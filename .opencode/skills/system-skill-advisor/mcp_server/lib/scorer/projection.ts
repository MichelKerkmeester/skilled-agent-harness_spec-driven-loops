// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Skill Projection
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

import Database from 'better-sqlite3';

import { getManifest } from '../embedders/registry.js';
import type { BackendKind } from '../embedders/types.js';
import { lifecycleStatusForPath } from '../lifecycle/archive-handling.js';
import { sanitizeDerivedMetadata, sanitizeMetadataStringArray } from '../skill-graph/metadata-sanitizer.js';
import { docTierWeight, isDocTriggerHarvestEnabled } from '../skill-graph/doc-frontmatter.js';
import { providerModelId } from '../skill-graph/skill-graph-db.js';
import { parseJsonObject, parseJsonStringArray, readJsonObject } from '../utils/json-guard.js';
import { parseSkillFrontmatter } from '../utils/skill-markdown.js';
import type {
  AdvisorEmbeddingSignature,
  AdvisorEmbeddingStalenessVerdict,
  AdvisorProjection,
  SkillDocTriggerProjection,
  SkillEdgeProjection,
  SkillLifecycleStatus,
  SkillProjection,
} from './types.js';
import { phraseVariants, unique } from './text.js';

interface SkillNodeRow {
  readonly id: string;
  readonly family: string;
  readonly category: string;
  readonly domains: string | null;
  readonly intent_signals: string | null;
  readonly derived: string | null;
  readonly source_path: string;
}

interface SkillEdgeRow {
  readonly source_id: string;
  readonly target_id: string;
  readonly edge_type: SkillEdgeProjection['edgeType'];
  readonly weight: number;
  readonly context: string;
}

interface SkillMarkdownMetadata {
  readonly name: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

const advisorDbDirOverride = process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
const SKILL_GRAPH_DB = advisorDbDirOverride
  ? join(advisorDbDirOverride, 'skill-graph.sqlite')
  : join('.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database', 'skill-graph.sqlite');

const COMMAND_BRIDGES: readonly SkillProjection[] = [
  {
    id: 'command-spec-kit',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit',
    description: 'Spec Kit command bridge for /spec_kit workflows.',
    keywords: ['/speckit:plan', '/speckit:resume', '/deep:start-research-loop', '/deep:start-review-loop'],
    domains: ['spec-kit', 'command'],
    intentSignals: ['/speckit:plan', '/speckit:resume', '/deep:start-research-loop', '/deep:start-review-loop'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'memory:save',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'memory:save',
    description: 'Memory save command bridge for /memory:save context preservation.',
    keywords: ['/memory:save', 'save context', 'save memory', 'preserve session context'],
    domains: ['memory', 'command'],
    intentSignals: ['/memory:save', 'save context', 'save memory', 'preserve session context'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'command-memory-save',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-memory-save',
    description: 'Memory save command bridge for /memory:save context preservation.',
    keywords: ['/memory:save', 'save context', 'save memory'],
    domains: ['memory', 'command'],
    intentSignals: ['/memory:save', 'save context', 'save memory'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'create:agent',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'create:agent',
    description: 'Create command bridge for /create:agent OpenCode agent scaffolding.',
    keywords: ['/create:agent', 'create new agent', 'create agent', 'new agent', 'make new agent'],
    domains: ['create', 'agent', 'command'],
    intentSignals: ['/create:agent', 'create new agent', 'create agent', 'new agent', 'make new agent'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'create:testing-playbook',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'create:testing-playbook',
    description: 'Create command bridge for /create:testing-playbook manual testing playbook scaffolding.',
    keywords: ['/create:testing-playbook', 'create testing playbook', 'create test playbook', 'testing playbook'],
    domains: ['create', 'testing', 'playbook', 'command'],
    intentSignals: ['/create:testing-playbook', 'create testing playbook', 'create test playbook', 'testing playbook'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'deep-model-benchmark',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'deep-model-benchmark',
    description: 'Deep command bridge for /deep:start-model-benchmark-loop model and prompt-framework benchmarking.',
    keywords: ['/deep:start-model-benchmark-loop', 'benchmark a model', 'benchmark a prompt framework', 'optimize a model', 'model benchmark loop'],
    domains: ['deep', 'benchmark', 'model', 'command'],
    intentSignals: ['/deep:start-model-benchmark-loop', 'benchmark a model', 'benchmark a prompt framework', 'optimize a model', 'model benchmark loop'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
];

const INLINE_WORKFLOW_SKILLS: readonly SkillProjection[] = [
  {
    id: 'deep-research',
    kind: 'skill',
    family: 'deep-loop',
    category: 'workflow',
    name: 'deep-research',
    description: 'Autonomous deep-research loop for iterative investigation and persisted research state.',
    keywords: ['deep research', 'research loop', 'autoresearch', '/deep:start-research-loop'],
    domains: ['deep-loop', 'research'],
    intentSignals: ['deep research', 'research loop', 'autoresearch', 'resume deep research'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'deep-review',
    kind: 'skill',
    family: 'deep-loop',
    category: 'workflow',
    name: 'deep-review',
    description: 'Autonomous deep-review loop for iterative code review and convergence-tracked findings.',
    keywords: ['deep review', 'review loop', ':review:auto', '/deep:start-review-loop'],
    domains: ['deep-loop', 'review'],
    intentSignals: ['deep review', 'review loop', 'resume deep review', ':review:auto'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'deep-improvement',
    kind: 'skill',
    family: 'deep-loop',
    category: 'workflow',
    name: 'deep-improvement',
    description: 'Evaluator-first agent improvement workflow with scoring, profiling, and guarded promotion.',
    keywords: ['agent improvement', '5d scoring', 'integration scan', 'dynamic profile'],
    domains: ['deep-loop', 'improvement'],
    intentSignals: ['agent improvement', '5d scoring', 'integration scan', 'dynamic profile'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
];

function jsonArray(value: string | null | undefined): string[] {
  return value ? parseJsonStringArray(value) : [];
}

function jsonObject(value: string | null | undefined): Record<string, unknown> {
  return value ? parseJsonObject(value) ?? {} : {};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function boundedDemotion(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.min(1, value))
    : undefined;
}

function readJson(filePath: string): Record<string, unknown> {
  return readJsonObject(filePath) ?? {};
}

function parseSkillMarkdown(skillMdPath: string, fallbackId: string): SkillMarkdownMetadata {
  if (!existsSync(skillMdPath)) {
    return { name: fallbackId, description: '', keywords: [] };
  }
  const { frontmatter, keywords } = parseSkillFrontmatter(readFileSync(skillMdPath, 'utf8'));
  return {
    name: frontmatter.name || fallbackId,
    description: frontmatter.description || '',
    keywords,
  };
}

function lifecycleStatus(raw: unknown, sourcePath: string): SkillLifecycleStatus {
  if (raw === 'deprecated' || raw === 'archived' || raw === 'future' || raw === 'active') return raw;
  const pathStatus = lifecycleStatusForPath(sourcePath);
  return pathStatus === 'archived' || pathStatus === 'future' ? pathStatus : 'active';
}

function projectionFromRow(row: SkillNodeRow): SkillProjection {
  const derived = sanitizeDerivedMetadata(jsonObject(row.derived), row.source_path) ?? {};
  const graphMetadata = readJson(row.source_path);
  const skillDir = dirname(row.source_path);
  const skillMd = parseSkillMarkdown(join(skillDir, 'SKILL.md'), row.id);
  const lifecycle = lifecycleStatus(
    graphMetadata.lifecycle_status ?? derived.lifecycle_status,
    row.source_path,
  );
  const redirectTo = typeof graphMetadata.redirect_to === 'string'
    ? graphMetadata.redirect_to
    : (typeof derived.redirect_to === 'string' ? derived.redirect_to : null);
  const redirectFrom = stringArray(graphMetadata.redirect_from ?? derived.redirect_from);
  // Distinguish derivedTriggers (intent-shaped phrases) from
  // derivedKeywords (entity-shaped concepts). Previously both fields were
  // assigned the same array (value-by-reference), which double-counted the
  // same evidence into two scoring inputs. Triggers now come from
  // `derived.trigger_phrases` only; keywords come from `derived.key_topics`
  // + `derived.entities` + `derived.key_files` + `derived.source_docs`. Each
  // pipeline still passes through `phraseVariants` and `unique`. The two
  // arrays may overlap when authors duplicate entries, but they are no longer
  // assigned the same value-by-reference.
  const derivedTriggers = unique(
    stringArray(derived.trigger_phrases).flatMap((entry) => phraseVariants(entry)),
  );
  const derivedKeywords = unique([
    ...stringArray(derived.key_topics),
    ...stringArray(derived.entities),
    ...stringArray(derived.key_files),
    ...stringArray(derived.source_docs),
  ].flatMap((entry) => phraseVariants(entry)));

  return {
    id: row.id,
    kind: 'skill',
    family: row.family,
    category: row.category,
    name: skillMd.name,
    description: skillMd.description,
    keywords: unique(skillMd.keywords.flatMap((entry) => phraseVariants(entry))),
    domains: unique(sanitizeMetadataStringArray(jsonArray(row.domains), row.source_path).flatMap((entry) => phraseVariants(entry))),
    intentSignals: unique(sanitizeMetadataStringArray(jsonArray(row.intent_signals), row.source_path).flatMap((entry) => phraseVariants(entry))),
    derivedTriggers,
    derivedKeywords,
    derivedDemotion: boundedDemotion(derived.demotion),
    // V2 derived sync stamps generated_at (the canonical author/sync time of
    // the derived block); older shapes carried last_updated_at/created_at.
    // generated_at leads the chain so a V2 block's real freshness wins over a
    // stray legacy field. This value is AUTHOR-TIME, not runtime: rebuild
    // re-indexes the existing block without re-stamping it; only a
    // derived-content change through sync re-stamps generated_at.
    derivedGeneratedAt: isoTimestampOrNull(derived.generated_at ?? derived.last_updated_at ?? derived.created_at),
    sourcePath: row.source_path,
    lifecycleStatus: lifecycle,
    redirectTo,
    redirectFrom,
  };
}

function isoTimestampOrNull(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

interface SkillDocRow {
  readonly skill_id: string;
  readonly doc_path: string;
  readonly trigger_phrases: string;
  readonly importance_tier: string | null;
}

interface MetadataRow {
  readonly key: string;
  readonly value: string;
}

interface TableNameRow {
  readonly name: string;
}

interface EmbeddingModelRow {
  readonly model_id: string | null;
}

interface StoredEmbeddingSummary {
  readonly vectorCount: number;
  readonly missingModelCount: number;
  readonly modelIds: readonly string[];
  readonly dim: number | null;
}

interface ActiveEmbeddingPointer {
  readonly name: string;
  readonly dim: number;
  readonly provider: string | null;
}

const ACTIVE_EMBEDDER_NAME_KEY = 'active_embedder_name';
const ACTIVE_EMBEDDER_DIM_KEY = 'active_embedder_dim';
const ACTIVE_EMBEDDER_PROVIDER_KEY = 'active_embedder_provider';

function sqliteTableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare(`
    SELECT 1 AS present
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
    LIMIT 1
  `).get(tableName) as { present: number } | undefined;
  return Boolean(row);
}

function readMetadataMap(db: Database.Database): Map<string, string> {
  if (!sqliteTableExists(db, 'vec_metadata')) return new Map();
  const rows = db.prepare(`
    SELECT key, value
    FROM vec_metadata
    WHERE key IN (?, ?, ?)
  `).all(ACTIVE_EMBEDDER_NAME_KEY, ACTIVE_EMBEDDER_DIM_KEY, ACTIVE_EMBEDDER_PROVIDER_KEY) as MetadataRow[];
  return new Map(rows.map((row) => [row.key, row.value]));
}

function providerForBackend(backend: BackendKind | undefined): string | null {
  switch (backend) {
    case 'ollama':
      return 'ollama';
    case 'api':
      return 'openai';
    case 'sentence-transformers':
      return 'hf-local';
    default:
      return null;
  }
}

function readActiveEmbeddingPointer(db: Database.Database): ActiveEmbeddingPointer | null {
  const metadata = readMetadataMap(db);
  const name = metadata.get(ACTIVE_EMBEDDER_NAME_KEY);
  const rawDim = metadata.get(ACTIVE_EMBEDDER_DIM_KEY);
  const dim = rawDim && /^[0-9]+$/.test(rawDim) ? Number.parseInt(rawDim, 10) : null;
  if (!name || dim === null || dim <= 0) {
    return null;
  }
  const metadataProvider = metadata.get(ACTIVE_EMBEDDER_PROVIDER_KEY);
  const manifest = getManifest(name);
  return {
    name,
    dim,
    provider: metadataProvider && metadataProvider.trim().length > 0
      ? metadataProvider
      : providerForBackend(manifest?.backend),
  };
}

function signatureFromPointer(pointer: ActiveEmbeddingPointer): AdvisorEmbeddingSignature {
  const profileId = pointer.provider
    ? providerModelId({ provider: pointer.provider, model: pointer.name, dim: pointer.dim })
    : null;
  return {
    provider: pointer.provider,
    name: pointer.name,
    dim: pointer.dim,
    modelId: pointer.name,
    providerModelId: profileId,
  };
}

function parseProviderModelId(modelId: string): { provider: string; name: string; dim: number } | null {
  const slugParts = modelId.split('__');
  if (slugParts.length >= 3 && /^[0-9]+$/.test(slugParts[2])) {
    return {
      provider: slugParts[0],
      name: slugParts[1],
      dim: Number.parseInt(slugParts[2], 10),
    };
  }

  const parts = modelId.split(':');
  for (let index = parts.length - 1; index >= 2; index--) {
    if (!/^[0-9]+$/.test(parts[index])) continue;
    return {
      provider: parts[0],
      name: parts.slice(1, index).join(':'),
      dim: Number.parseInt(parts[index], 10),
    };
  }
  return null;
}

function signatureFromModelId(modelId: string, fallbackDim: number | null): AdvisorEmbeddingSignature {
  const parsed = parseProviderModelId(modelId);
  if (parsed) {
    return {
      provider: parsed.provider,
      name: parsed.name,
      dim: parsed.dim,
      modelId,
      providerModelId: modelId,
    };
  }
  return {
    provider: null,
    name: modelId,
    dim: fallbackDim ?? 0,
    modelId,
    providerModelId: null,
  };
}

function activeCompatibleModelIds(active: AdvisorEmbeddingSignature): Set<string> {
  const ids = new Set<string>([active.modelId]);
  if (active.providerModelId) ids.add(active.providerModelId);
  const manifest = getManifest(active.name);
  if (active.provider && manifest?.ollamaName) {
    ids.add(providerModelId({ provider: active.provider, model: manifest.ollamaName, dim: active.dim }));
  }
  return ids;
}

function vecTables(db: Database.Database): Array<{ name: string; dim: number }> {
  const rows = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name GLOB 'vec_[0-9]*'
    ORDER BY name ASC
  `).all() as TableNameRow[];
  return rows
    .map((row) => {
      const match = /^vec_([0-9]+)$/.exec(row.name);
      return match ? { name: row.name, dim: Number.parseInt(match[1], 10) } : null;
    })
    .filter((row): row is { name: string; dim: number } => row !== null);
}

function summarizeModelRows(rows: readonly EmbeddingModelRow[], dim: number | null): StoredEmbeddingSummary {
  const normalizedModelIds = rows.map((row) => row.model_id?.trim() ?? '');
  const modelIds = unique(
    normalizedModelIds.filter((modelId) => modelId.length > 0),
  );
  return {
    vectorCount: rows.length,
    missingModelCount: normalizedModelIds.filter((modelId) => modelId.length === 0).length,
    modelIds,
    dim,
  };
}

function summarizeVecTable(db: Database.Database, tableName: string, dim: number): StoredEmbeddingSummary {
  const rows = db.prepare(`
    SELECT model_id
    FROM ${tableName}
    WHERE embedding IS NOT NULL
    ORDER BY skill_id ASC
  `).all() as EmbeddingModelRow[];
  return summarizeModelRows(rows, dim);
}

function summarizeLegacyEmbeddings(db: Database.Database): StoredEmbeddingSummary {
  if (!sqliteTableExists(db, 'skill_nodes')) {
    return { vectorCount: 0, missingModelCount: 0, modelIds: [], dim: null };
  }
  const rows = db.prepare(`
    SELECT embedding_model_id AS model_id
    FROM skill_nodes
    WHERE embedding IS NOT NULL
    ORDER BY id ASC
  `).all() as EmbeddingModelRow[];
  return summarizeModelRows(rows, null);
}

function combineSummaries(summaries: readonly StoredEmbeddingSummary[]): StoredEmbeddingSummary {
  return {
    vectorCount: summaries.reduce((total, summary) => total + summary.vectorCount, 0),
    missingModelCount: summaries.reduce((total, summary) => total + summary.missingModelCount, 0),
    modelIds: unique(summaries.flatMap((summary) => [...summary.modelIds])),
    dim: summaries.find((summary) => summary.dim !== null)?.dim ?? null,
  };
}

function storedEmbeddingSummary(db: Database.Database, active: ActiveEmbeddingPointer | null): StoredEmbeddingSummary {
  const tables = vecTables(db);
  if (active) {
    const activeTable = tables.find((table) => table.dim === active.dim);
    if (activeTable) {
      const summary = summarizeVecTable(db, activeTable.name, activeTable.dim);
      if (summary.vectorCount > 0 || summary.missingModelCount > 0) {
        return summary;
      }
    }
    const nonActiveSummaries = tables
      .filter((table) => table.dim !== active.dim)
      .map((table) => summarizeVecTable(db, table.name, table.dim))
      .filter((summary) => summary.vectorCount > 0 || summary.missingModelCount > 0);
    return combineSummaries(nonActiveSummaries);
  }

  const legacy = summarizeLegacyEmbeddings(db);
  if (legacy.vectorCount > 0 || legacy.missingModelCount > 0) {
    return legacy;
  }
  return combineSummaries(
    tables
      .map((table) => summarizeVecTable(db, table.name, table.dim))
      .filter((summary) => summary.vectorCount > 0 || summary.missingModelCount > 0),
  );
}

function buildEmbeddingStalenessVerdict(
  active: AdvisorEmbeddingSignature | null,
  summary: StoredEmbeddingSummary,
): AdvisorEmbeddingStalenessVerdict {
  if (summary.vectorCount === 0 && summary.missingModelCount === 0) {
    return { stale: false, active, stored: null, vectorCount: 0 };
  }

  const storedModelId = summary.modelIds[0] ?? null;
  const rawStored = storedModelId
    ? signatureFromModelId(storedModelId, summary.dim)
    : null;
  const stored = rawStored && active && activeCompatibleModelIds(active).has(rawStored.modelId)
    ? { ...active, modelId: rawStored.modelId }
    : rawStored;
  const base = {
    active,
    stored,
    vectorCount: summary.vectorCount,
    modelIds: summary.modelIds,
  };

  if (!active) {
    return { ...base, stale: true, reason: 'main active-embedder pointer incomplete' };
  }
  if (summary.missingModelCount > 0) {
    return { ...base, stale: true, reason: 'projection embedding model missing' };
  }
  if (summary.modelIds.length !== 1) {
    return {
      ...base,
      stale: true,
      reason: `projection model set '${summary.modelIds.join(', ')}' != active '${active.name}'`,
    };
  }
  if (stored && stored.dim > 0 && stored.provider !== null && stored.dim !== active.dim) {
    return { ...base, stale: true, reason: `projection dim ${stored.dim} != active ${active.dim}` };
  }
  if (!activeCompatibleModelIds(active).has(summary.modelIds[0])) {
    return {
      ...base,
      stale: true,
      reason: `projection model '${summary.modelIds[0]}' != active '${active.name}'`,
    };
  }
  return { ...base, stale: false };
}

export function readAdvisorEmbeddingStaleness(db: Database.Database): AdvisorEmbeddingStalenessVerdict {
  try {
    const activePointer = readActiveEmbeddingPointer(db);
    const active = activePointer ? signatureFromPointer(activePointer) : null;
    return buildEmbeddingStalenessVerdict(active, storedEmbeddingSummary(db, activePointer));
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      stale: true,
      reason: `projection embedding staleness check failed: ${reason}`,
      active: null,
      stored: null,
      vectorCount: 0,
      modelIds: [],
    };
  }
}

/**
 * Load doc-level trigger projections grouped by skill id. Tolerates a
 * pre-migration database (missing skill_docs table) by returning an
 * empty map — the read-only recommend path never runs migrations.
 */
function loadDocTriggersBySkill(db: Database.Database): Map<string, SkillDocTriggerProjection[]> {
  const bySkill = new Map<string, SkillDocTriggerProjection[]>();
  if (!isDocTriggerHarvestEnabled()) return bySkill;
  let docRows: SkillDocRow[];
  try {
    docRows = db.prepare(`
      SELECT skill_id, doc_path, trigger_phrases, importance_tier
      FROM skill_docs
      ORDER BY skill_id ASC, doc_path ASC
    `).all() as SkillDocRow[];
  } catch {
    return bySkill;
  }
  for (const row of docRows) {
    const phrases = unique(parseJsonStringArray(row.trigger_phrases).flatMap((entry) => phraseVariants(entry)));
    if (phrases.length === 0) continue;
    const entry: SkillDocTriggerProjection = {
      docPath: row.doc_path,
      phrases,
      tierWeight: docTierWeight(row.importance_tier),
    };
    const existing = bySkill.get(row.skill_id);
    if (existing) existing.push(entry);
    else bySkill.set(row.skill_id, [entry]);
  }
  return bySkill;
}

function loadSqliteProjection(workspaceRoot: string): AdvisorProjection | null {
  const dbPath = isAbsolute(SKILL_GRAPH_DB) ? SKILL_GRAPH_DB : join(workspaceRoot, SKILL_GRAPH_DB);
  if (!existsSync(dbPath)) return null;
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT id, family, category, domains, intent_signals, derived, source_path
      FROM skill_nodes
      ORDER BY id ASC
    `).all() as SkillNodeRow[];
    const edgeRows = db.prepare(`
      SELECT source_id, target_id, edge_type, weight, context
      FROM skill_edges
      ORDER BY source_id ASC, edge_type ASC, target_id ASC
    `).all() as SkillEdgeRow[];
    const docTriggersBySkill = loadDocTriggersBySkill(db);
    const embeddingStaleness = readAdvisorEmbeddingStaleness(db);
    return {
      skills: [
        ...rows.map((row) => {
          const projection = projectionFromRow(row);
          const docTriggers = docTriggersBySkill.get(row.id);
          return docTriggers && docTriggers.length > 0 ? { ...projection, docTriggers } : projection;
        }),
        ...INLINE_WORKFLOW_SKILLS,
        ...COMMAND_BRIDGES,
      ],
      edges: edgeRows.map((row) => ({
        sourceId: row.source_id,
        targetId: row.target_id,
        edgeType: row.edge_type,
        weight: Math.max(0, Math.min(1, row.weight)),
        context: row.context,
      })),
      generatedAt: new Date().toISOString(),
      source: 'sqlite',
      embeddingSignature: embeddingStaleness.stored,
      embeddingStaleness,
    };
  } finally {
    db.close();
  }
}

function loadFilesystemProjection(workspaceRoot: string): AdvisorProjection {
  const skillRoot = join(workspaceRoot, '.opencode', 'skills');
  const skills: SkillProjection[] = [];
  const edges: SkillEdgeProjection[] = [];
  if (!existsSync(skillRoot)) {
    return { skills: [...INLINE_WORKFLOW_SKILLS, ...COMMAND_BRIDGES], edges, generatedAt: new Date().toISOString(), source: 'filesystem' };
  }
  for (const entry of readdirSync(skillRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillDir = join(skillRoot, entry.name);
    const metadataPath = join(skillDir, 'graph-metadata.json');
    if (!existsSync(metadataPath)) continue;
    const metadata = readJson(metadataPath);
    const skillMd = parseSkillMarkdown(join(skillDir, 'SKILL.md'), entry.name);
    const skillId = typeof metadata.skill_id === 'string' ? metadata.skill_id : entry.name;
    const rawDerived = typeof metadata.derived === 'object' && metadata.derived !== null && !Array.isArray(metadata.derived)
      ? metadata.derived as Record<string, unknown>
      : {};
    const derived = sanitizeDerivedMetadata(rawDerived, metadataPath) ?? {};
    // Same split applied here as in projectionFromRow above —
    // derivedTriggers (from trigger_phrases) and derivedKeywords (from
    // key_topics + entities + key_files + source_docs) are now distinct.
    const derivedTriggers = unique(
      stringArray(derived.trigger_phrases).flatMap((item) => phraseVariants(item)),
    );
    const derivedKeywords = unique([
      ...stringArray(derived.key_topics),
      ...stringArray(derived.entities),
      ...stringArray(derived.key_files),
      ...stringArray(derived.source_docs),
    ].flatMap((item) => phraseVariants(item)));
    skills.push({
      id: skillId,
      kind: 'skill',
      family: typeof metadata.family === 'string' ? metadata.family : 'system',
      category: typeof metadata.category === 'string' ? metadata.category : 'skill',
      name: skillMd.name,
      description: skillMd.description,
      keywords: unique(skillMd.keywords.flatMap((item) => phraseVariants(item))),
      domains: unique(sanitizeMetadataStringArray(stringArray(metadata.domains), metadataPath).flatMap((item) => phraseVariants(item))),
      intentSignals: unique(sanitizeMetadataStringArray(stringArray(metadata.intent_signals), metadataPath).flatMap((item) => phraseVariants(item))),
      derivedTriggers,
      derivedKeywords,
      derivedDemotion: boundedDemotion(derived.demotion),
      // generated_at leads the chain (canonical V2 author/sync time); see the
      // SQLite branch above for why this is author-time, not runtime.
      derivedGeneratedAt: isoTimestampOrNull(derived.generated_at ?? derived.last_updated_at ?? derived.created_at),
      sourcePath: metadataPath,
      lifecycleStatus: lifecycleStatus(metadata.lifecycle_status ?? derived.lifecycle_status, metadataPath),
      redirectTo: typeof metadata.redirect_to === 'string' ? metadata.redirect_to : undefined,
      redirectFrom: stringArray(metadata.redirect_from),
    });
  }
  return { skills: [...skills, ...INLINE_WORKFLOW_SKILLS, ...COMMAND_BRIDGES], edges, generatedAt: new Date().toISOString(), source: 'filesystem' };
}

// Previously a bare `catch {}` swallowed every SQLite read error
// and silently fell back to the filesystem projection, hiding corrupt-DB and
// schema-drift failures from operators. We now distinguish three cases:
//   1. SQLite read succeeded → return that projection ('sqlite').
//   2. SQLite DB does not exist yet → loadSqliteProjection returns null and we
//      fall through to a clean 'filesystem' projection (legitimate first run).
//   3. SQLite read THREW → we still degrade to filesystem so the daemon stays
//      up, but the projection is tagged 'filesystem-fallback' with a
//      fallbackReason carrying the underlying error message AND the failure
//      is logged via console.warn so it surfaces in daemon logs.
export function loadAdvisorProjection(workspaceRoot: string): AdvisorProjection {
  const resolvedRoot = resolve(workspaceRoot);
  try {
    const sqliteProjection = loadSqliteProjection(resolvedRoot);
    if (sqliteProjection !== null) return sqliteProjection;
    return loadFilesystemProjection(resolvedRoot);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[advisor-projection] SQLite projection failed; degraded to filesystem fallback: ${reason}`);
    const fallback = loadFilesystemProjection(resolvedRoot);
    return {
      ...fallback,
      source: 'filesystem-fallback',
      fallbackReason: reason,
    };
  }
}

export function createFixtureProjection(
  skills: readonly SkillProjection[],
  edges: readonly SkillEdgeProjection[] = [],
): AdvisorProjection {
  return {
    skills,
    edges,
    generatedAt: new Date().toISOString(),
    source: 'fixture',
  };
}
