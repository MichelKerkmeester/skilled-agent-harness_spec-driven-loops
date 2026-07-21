// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Incremental Style Database Indexer                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import {
  lstat,
  open,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
} from 'node:fs/promises';
import path from 'node:path';

import { CRAWL_MANIFEST_FILENAME } from '../lib/paths.mjs';
import {
  compareRawStrings,
  digest,
  lengthFrame,
  stableJson,
} from './canonical.mjs';
import {
  buildManifest,
  hashArtifactFile,
  writeManifestPointer,
} from './generation-manifest.mjs';
import {
  RESIDENCY,
} from './stage-telemetry.mjs';
import {
  DEFAULT_STYLE_DATABASE_PATH,
  STYLE_DB_SCHEMA_VERSION,
  STYLE_DATABASE_POINTER_SUFFIX,
  openStyleDatabase,
} from './schema.mjs';

export const INDEXER_LIFECYCLE = Object.freeze([
  'DISCOVER',
  'VERIFY',
  'PARSE_VALIDATE',
  'COMMIT',
  'VECTOR_DRAIN',
  'PUBLISH',
]);
export const DEFAULT_EMBEDDING_PROFILE = 'style-default-v1';

const AGGREGATE_HASH_VERSION = 'style-all-artifacts-v2';
const RETRIEVAL_HASH_VERSION = 'style-retrieval-document-v1';
const GENERATION_HASH_VERSION = 'style-corpus-generation-v2';
const LICENSE_ALLOWLIST = new Set(['allowed', 'licensed', 'public-domain']);
const RESTRICTED_LICENSE_PATTERN = /\b(unlicensed trial|license[- ]restricted)\b/i;
const WARM_SURFACE_PATTERN = /\b(warm|cream|beige|bone|ivory|linen|sand|tan)\b/i;
const MOTION_PATTERN = /\b(motion|animation|animated|transition|kinetic|scroll)\b/i;
const SERIF_PATTERN = /(^|[^a-z])serif([^a-z]|$)/i;
const SANS_SERIF_PATTERN = /sans[- ]serif/i;

function nowIso() {
  return new Date().toISOString();
}

function normalizeTerm(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function normalizeMarkdown(value) {
  return String(value ?? '').normalize('NFC').replace(/\r\n?/g, '\n')
    .split('\n').map((line) => line.trimEnd()).join('\n').trimEnd();
}

function artifactRole(fileName) {
  if (fileName.endsWith('-canonical.json')) return 'canonical';
  if (fileName === 'design-tokens.json') return 'tokens';
  if (fileName === 'DESIGN.md') return 'design';
  if (fileName === 'source.md') return 'source';
  if (fileName === 'css-variables.css') return 'css-variables';
  if (fileName === 'tailwind-v4.css') return 'tailwind';
  return null;
}

function isContained(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function parseJson(artifact, label) {
  if (!artifact) return {};
  try {
    return JSON.parse(artifact.buffer.toString('utf8'));
  } catch (error) {
    const invalid = new Error(`Invalid ${label} JSON: ${artifact.relativePath}`, { cause: error });
    invalid.code = 'invalid-artifact';
    throw invalid;
  }
}

function countTokenLeaves(value) {
  if (!value || typeof value !== 'object') return 0;
  if (Object.hasOwn(value, '$value')) return 1;
  return Object.values(value).reduce((sum, child) => sum + countTokenLeaves(child), 0);
}

function deriveTokenAxes(tokens, designSystem) {
  const counts = new Map();
  for (const [axis, value] of Object.entries(tokens ?? {})) {
    const count = countTokenLeaves(value);
    if (count > 0) counts.set(axis, count);
  }
  const fallbackCounts = {
    color: Array.isArray(designSystem.colors) ? designSystem.colors.length : 0,
    spacing: designSystem.spacing ? Object.keys(designSystem.spacing).length : 0,
    typography: Array.isArray(designSystem.typography) ? designSystem.typography.length : 0,
  };
  for (const [axis, count] of Object.entries(fallbackCounts)) {
    if (count > 0 && !counts.has(axis)) counts.set(axis, count);
  }
  return [...counts].map(([axis, count]) => ({ axis, count }))
    .sort((left, right) => compareRawStrings(left.axis, right.axis));
}

function deriveSections(designMarkdown) {
  const sections = [];
  for (const [index, line] of designMarkdown.split('\n').entries()) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) sections.push({ name: match[1], line: index + 1 });
  }
  return sections;
}

function deriveCapabilities(designSystem, tokenAxes, sections, provenanceStatus) {
  const values = new Set();
  if (tokenAxes.length > 0) values.add('tokens');
  if ((designSystem.components?.length ?? 0) > 0) values.add('components');
  if (designSystem.layout) values.add('layout');
  if (designSystem.imagery) values.add('imagery');
  if (designSystem.spacing) values.add('spacing');
  if ((designSystem.dos?.length ?? 0) + (designSystem.donts?.length ?? 0) > 0) {
    values.add('constraints');
  }
  if (provenanceStatus === 'known') values.add('provenance');
  if (sections.some((section) => MOTION_PATTERN.test(section.name))) values.add('motion');
  return [...values].sort(compareRawStrings);
}

function deriveFacets(style, designSystem, capabilities, tokenAxes, searchableText, licenseStatus) {
  const values = new Set(capabilities);
  for (const { axis } of tokenAxes) values.add(axis);
  if (designSystem.theme) values.add(normalizeTerm(designSystem.theme));
  if (designSystem.industry) values.add(normalizeTerm(designSystem.industry));
  if (SERIF_PATTERN.test(searchableText) && !SANS_SERIF_PATTERN.test(searchableText)) {
    values.add('serif-role');
  }
  if (WARM_SURFACE_PATTERN.test(searchableText)) values.add('warm-surface');
  if (MOTION_PATTERN.test(searchableText)) values.add('motion');
  if (licenseStatus === 'restricted') values.add('license-restricted');
  values.add(normalizeTerm(style.slug));
  return [...values].filter(Boolean).sort(compareRawStrings);
}

function excerpt(value, maxLength = 240) {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function computeAggregateHash(styleId, artifacts) {
  const parts = [
    ...lengthFrame(AGGREGATE_HASH_VERSION),
    ...lengthFrame(styleId),
  ];
  for (const artifact of artifacts.slice()
    .sort((left, right) => compareRawStrings(left.role, right.role))) {
    parts.push(...lengthFrame(artifact.role), ...lengthFrame(artifact.buffer));
  }
  return digest(parts);
}

function computeHintHash(artifacts) {
  return digest([
    'style-artifact-hints-v1\0',
    ...artifacts.map((artifact) => (
      `${artifact.relativePath}\0${artifact.byteLength}\0${artifact.mtimeNs}\0${artifact.ctimeNs}\n`
    )),
  ]);
}

function computeCrawlRecordHash(crawlRecord) {
  return digest([
    'style-crawl-record-v1\0',
    stableJson(crawlRecord ?? null),
  ]);
}

function computeGenerationHash(crawlManifestHash, styles, inactiveStates = []) {
  const parts = [
    ...lengthFrame(GENERATION_HASH_VERSION),
    ...lengthFrame(STYLE_DB_SCHEMA_VERSION),
    ...lengthFrame(crawlManifestHash),
  ];
  for (const style of styles.slice().sort((left, right) => compareRawStrings(left.id, right.id))) {
    parts.push(...lengthFrame(style.id), ...lengthFrame(style.aggregateHash));
  }
  for (const style of inactiveStates.slice().sort((left, right) => compareRawStrings(left.id, right.id))) {
    parts.push(...lengthFrame(style.id), ...lengthFrame(style.state));
  }
  return digest(parts);
}

async function readVerifiedArtifacts(corpusRoot, corpusRealPath, slug) {
  const styleRoot = path.join(corpusRoot, slug);
  const entries = (await readdir(styleRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() || entry.isSymbolicLink())
    .sort((left, right) => compareRawStrings(left.name, right.name));
  const artifacts = [];
  for (const entry of entries) {
    const role = artifactRole(entry.name);
    if (!role) {
      const error = new Error(`Style ${slug} contains an unsupported artifact: ${entry.name}`);
      error.code = 'invalid-artifact';
      throw error;
    }
    const candidatePath = path.join(styleRoot, entry.name);
    const linkInfo = await lstat(candidatePath, { bigint: true });
    if (!linkInfo.isFile() && !linkInfo.isSymbolicLink()) continue;
    const artifactRealPath = await realpath(candidatePath);
    if (!isContained(corpusRealPath, artifactRealPath)) {
      const error = new Error(`Artifact escapes the corpus root: ${slug}/${entry.name}`);
      error.code = 'path-escape';
      throw error;
    }
    const before = await stat(artifactRealPath, { bigint: true });
    const buffer = await readFile(artifactRealPath);
    const after = await stat(artifactRealPath, { bigint: true });
    if (before.size !== after.size || before.mtimeNs !== after.mtimeNs || before.ctimeNs !== after.ctimeNs) {
      const error = new Error(`Corpus changed while reading ${slug}/${entry.name}.`);
      error.code = 'corpus-changing';
      throw error;
    }
    artifacts.push({
      role,
      relativePath: `${slug}/${entry.name}`,
      byteLength: buffer.byteLength,
      sha256: digest([buffer]),
      mtimeNs: String(after.mtimeNs),
      ctimeNs: String(after.ctimeNs),
      buffer,
    });
  }
  if (!artifacts.some((artifact) => artifact.role === 'canonical')
    || !artifacts.some((artifact) => artifact.role === 'design')) {
    const error = new Error(`Style ${slug} lacks its canonical JSON or DESIGN.md artifact.`);
    error.code = 'invalid-artifact';
    throw error;
  }
  return artifacts;
}

async function readArtifactHints(corpusRoot, corpusRealPath, slug) {
  const styleRoot = path.join(corpusRoot, slug);
  const entries = (await readdir(styleRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() || entry.isSymbolicLink())
    .sort((left, right) => compareRawStrings(left.name, right.name));
  const artifacts = [];
  for (const entry of entries) {
    const role = artifactRole(entry.name);
    if (!role) {
      const error = new Error(`Style ${slug} contains an unsupported artifact: ${entry.name}`);
      error.code = 'invalid-artifact';
      throw error;
    }
    const candidatePath = path.join(styleRoot, entry.name);
    const artifactRealPath = await realpath(candidatePath);
    if (!isContained(corpusRealPath, artifactRealPath)) {
      const error = new Error(`Artifact escapes the corpus root: ${slug}/${entry.name}`);
      error.code = 'path-escape';
      throw error;
    }
    const fileInfo = await stat(artifactRealPath, { bigint: true });
    artifacts.push({
      role,
      relativePath: `${slug}/${entry.name}`,
      byteLength: Number(fileInfo.size),
      mtimeNs: String(fileInfo.mtimeNs),
      ctimeNs: String(fileInfo.ctimeNs),
    });
  }
  return artifacts;
}

function parseStyle(slug, crawlRecord, artifacts) {
  const canonical = parseJson(artifacts.find((artifact) => artifact.role === 'canonical'), 'canonical');
  const tokens = parseJson(artifacts.find((artifact) => artifact.role === 'tokens'), 'token');
  const designMarkdown = normalizeMarkdown(
    artifacts.find((artifact) => artifact.role === 'design')?.buffer.toString('utf8'),
  );
  const designSystem = canonical.designSystem ?? {};
  const id = canonical.uuid ?? crawlRecord?.uuid;
  if (typeof id !== 'string' || id.length === 0) {
    const error = new Error(`Style ${slug} has no stable UUID.`);
    error.code = 'invalid-artifact';
    throw error;
  }
  const title = excerpt(canonical.name ?? slug, 120);
  const thesis = excerpt(canonical.northStar ?? designSystem.northStar ?? designSystem.description);
  const theme = designSystem.theme == null ? null : String(designSystem.theme);
  const industry = designSystem.industry == null ? null : String(designSystem.industry);
  const sections = deriveSections(designMarkdown);
  const tokenAxes = deriveTokenAxes(tokens, designSystem);
  const provenanceStatus = canonical.source && canonical.uuid && canonical.meta?.url
    ? 'known'
    : 'missing';
  const searchableText = [
    title,
    thesis,
    designSystem.description,
    theme,
    industry,
    designSystem.layout,
    designSystem.imagery,
    ...(Array.isArray(designSystem.typography)
      ? designSystem.typography.map((entry) => `${entry.family ?? ''} ${entry.role ?? ''}`)
      : []),
    designMarkdown.slice(0, 65_536),
  ].join(' ');
  const licenseStatus = RESTRICTED_LICENSE_PATTERN.test(searchableText)
    ? 'restricted'
    : String(canonical.license?.status ?? 'unknown');
  const rightsKnown = LICENSE_ALLOWLIST.has(licenseStatus) || licenseStatus === 'restricted';
  const capabilities = deriveCapabilities(designSystem, tokenAxes, sections, provenanceStatus);
  const facets = deriveFacets(
    { slug },
    designSystem,
    capabilities,
    tokenAxes,
    searchableText,
    licenseStatus,
  );
  const retrievalDocument = {
    id,
    title,
    thesis,
    theme,
    industry,
    capabilities,
    facets,
    tokenAxes,
    sections: sections.map((section) => section.name),
    designMarkdown,
  };
  const retrievalJson = stableJson(retrievalDocument);
  const retrievalHash = digest([
    ...lengthFrame(RETRIEVAL_HASH_VERSION),
    ...lengthFrame(retrievalJson),
  ]);
  const aggregateHash = computeAggregateHash(id, artifacts);
  return {
    id,
    slug,
    crawlStatus: crawlRecord?.status ?? 'unknown',
    title,
    thesis,
    theme,
    industry,
    aggregateHash,
    artifactHintHash: computeHintHash(artifacts),
    crawlRecordHash: computeCrawlRecordHash(crawlRecord),
    retrievalHash,
    artifacts,
    tokenAxes,
    sections,
    capabilities,
    facets,
    provenance: {
      status: provenanceStatus,
      sourceUrl: canonical.source ?? crawlRecord?.url ?? null,
      originalUrl: canonical.meta?.url ?? null,
      screenshotUrl: canonical.screenshot?.url ?? null,
      uuid: canonical.uuid ?? crawlRecord?.uuid ?? null,
      capturedAt: canonical.capturedAt ?? crawlRecord?.capturedAt ?? null,
      licenseStatus,
      rightsKnown,
      evidenceScope: ['reference', 'rationale'],
    },
    relationships: (Array.isArray(designSystem.similar) ? designSystem.similar : [])
      .map((relationship, ordinal) => ({
        ordinal,
        rawTargetLabel: String(relationship.business ?? relationship.name ?? '').trim(),
        rationale: String(relationship.why ?? relationship.rationale ?? '').trim(),
      })).filter((relationship) => relationship.rawTargetLabel),
    retrievalDocument: {
      title,
      thesis,
      theme: theme ?? '',
      industry: industry ?? '',
      terms: [...new Set([...facets, ...capabilities, ...tokenAxes.map(({ axis }) => axis)])]
        .sort(compareRawStrings).join(' '),
      body: designMarkdown,
      documentJson: retrievalJson,
      retrievalHash,
    },
  };
}

function replaceStyleChildren(database, styleRowid, style, timestamp) {
  for (const table of [
    'style_provenance',
    'style_artifacts',
    'style_terms',
    'style_token_axes',
    'style_sections',
    'retrieval_documents',
    'style_relationships',
  ]) {
    const key = table === 'style_relationships' ? 'source_style_rowid' : 'style_rowid';
    database.prepare(`DELETE FROM ${table} WHERE ${key} = ?`).run(styleRowid);
  }
  database.prepare(`
    INSERT INTO style_provenance(
      style_rowid, status, source_url, original_url, screenshot_url, source_uuid,
      captured_at, license_status, rights_known, evidence_scope_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    styleRowid,
    style.provenance.status,
    style.provenance.sourceUrl,
    style.provenance.originalUrl,
    style.provenance.screenshotUrl,
    style.provenance.uuid,
    style.provenance.capturedAt,
    style.provenance.licenseStatus,
    style.provenance.rightsKnown ? 1 : 0,
    JSON.stringify(style.provenance.evidenceScope),
  );
  const insertArtifact = database.prepare(`
    INSERT INTO style_artifacts(
      style_rowid, role, relative_path, byte_length, sha256, mtime_ns, ctime_ns
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const artifact of style.artifacts) {
    insertArtifact.run(
      styleRowid,
      artifact.role,
      artifact.relativePath,
      artifact.byteLength,
      artifact.sha256,
      artifact.mtimeNs,
      artifact.ctimeNs,
    );
  }
  const insertTerm = database.prepare(
    'INSERT INTO style_terms(style_rowid, term_type, term) VALUES (?, ?, ?)',
  );
  for (const term of style.facets) insertTerm.run(styleRowid, 'facet', term);
  for (const term of style.capabilities) insertTerm.run(styleRowid, 'capability', term);
  const insertAxis = database.prepare(
    'INSERT INTO style_token_axes(style_rowid, axis, token_count) VALUES (?, ?, ?)',
  );
  for (const axis of style.tokenAxes) insertAxis.run(styleRowid, axis.axis, axis.count);
  const insertSection = database.prepare(`
    INSERT INTO style_sections(style_rowid, ordinal, name, line_number) VALUES (?, ?, ?, ?)
  `);
  for (const [ordinal, section] of style.sections.entries()) {
    insertSection.run(styleRowid, ordinal, section.name, section.line);
  }
  const document = style.retrievalDocument;
  database.prepare(`
    INSERT INTO retrieval_documents(
      style_rowid, title, thesis, theme, industry, terms, body, document_json, retrieval_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    styleRowid,
    document.title,
    document.thesis,
    document.theme,
    document.industry,
    document.terms,
    document.body,
    document.documentJson,
    document.retrievalHash,
  );
  const insertRelationship = database.prepare(`
    INSERT INTO style_relationships(
      source_style_rowid, ordinal, raw_target_label, target_style_rowid,
      rationale, resolution_state, confidence
    ) VALUES (?, ?, ?, NULL, ?, 'unresolved', 0)
  `);
  for (const relationship of style.relationships) {
    insertRelationship.run(
      styleRowid,
      relationship.ordinal,
      relationship.rawTargetLabel,
      relationship.rationale,
    );
  }
  database.prepare(`
    INSERT INTO style_index_state(
      style_rowid, artifact_hint_hash, crawl_record_hash, aggregate_hash,
      last_success_generation, last_success_at, missing_observations
    ) VALUES (?, ?, ?, ?, ?, ?, 0)
    ON CONFLICT(style_rowid) DO UPDATE SET
      artifact_hint_hash = excluded.artifact_hint_hash,
      crawl_record_hash = excluded.crawl_record_hash,
      aggregate_hash = excluded.aggregate_hash,
      last_success_generation = excluded.last_success_generation,
      last_success_at = excluded.last_success_at,
      missing_observations = 0
  `).run(
    styleRowid,
    style.artifactHintHash,
    style.crawlRecordHash,
    style.aggregateHash,
    '',
    timestamp,
  );
}

function resolveRelationships(database) {
  const aliases = new Map();
  for (const style of database.prepare(`
    SELECT style_rowid, slug, title FROM styles WHERE lifecycle_state = 'active'
  `).all()) {
    for (const alias of [style.slug, style.title]) {
      const key = normalizeTerm(alias);
      if (!aliases.has(key)) aliases.set(key, []);
      aliases.get(key).push(Number(style.style_rowid));
    }
  }
  const update = database.prepare(`
    UPDATE style_relationships
    SET target_style_rowid = ?, resolution_state = ?, confidence = ?
    WHERE relationship_id = ?
  `);
  for (const relationship of database.prepare(`
    SELECT relationship_id, raw_target_label FROM style_relationships
  `).all()) {
    const matches = [...new Set(aliases.get(normalizeTerm(relationship.raw_target_label)) ?? [])];
    if (matches.length === 1) update.run(matches[0], 'resolved', 1, relationship.relationship_id);
    else if (matches.length > 1) update.run(null, 'ambiguous', 0.5, relationship.relationship_id);
    else update.run(null, 'unresolved', 0, relationship.relationship_id);
  }
}

function ensureEmbeddingProfile(database, profile, timestamp) {
  const existing = database.prepare(`
    SELECT provider, model, dimensions, config_hash
    FROM embedding_profiles WHERE profile_id = ?
  `).get(profile.id);
  if (existing && (
    existing.provider !== profile.provider
    || existing.model !== profile.model
    || existing.config_hash !== profile.configHash
    || (existing.dimensions != null && profile.dimensions != null
      && Number(existing.dimensions) !== profile.dimensions)
  )) {
    const error = new Error(`Embedding profile identity conflict: ${profile.id}`);
    error.code = 'embedding-profile-conflict';
    throw error;
  }
  if (existing) return;
  database.prepare(`
    INSERT INTO embedding_profiles(
      profile_id, provider, model, dimensions, config_hash, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    profile.id,
    profile.provider,
    profile.model,
    profile.dimensions ?? null,
    profile.configHash,
    timestamp,
  );
}

function enqueueVector(database, styleRowid, retrievalHash, profileId, timestamp) {
  database.prepare(`
    UPDATE style_vector_jobs
    SET status = 'superseded', updated_at = ?
    WHERE style_rowid = ? AND profile_id = ?
      AND retrieval_hash != ? AND status IN ('pending', 'running', 'failed')
  `).run(timestamp, styleRowid, profileId, retrievalHash);
  database.prepare(`
    UPDATE style_vector_jobs
    SET status = 'pending', updated_at = ?, last_error = NULL, next_attempt_at = NULL
    WHERE style_rowid = ? AND retrieval_hash = ? AND profile_id = ?
      AND status = 'completed'
      AND NOT EXISTS (
        SELECT 1 FROM style_vectors v
        WHERE v.style_rowid = style_vector_jobs.style_rowid
          AND v.retrieval_hash = style_vector_jobs.retrieval_hash
          AND v.profile_id = style_vector_jobs.profile_id
      )
  `).run(timestamp, styleRowid, retrievalHash, profileId);
  database.prepare(`
    INSERT INTO style_vector_jobs(
      style_rowid, retrieval_hash, profile_id, status, created_at, updated_at
    ) VALUES (?, ?, ?, 'pending', ?, ?)
    ON CONFLICT(style_rowid, retrieval_hash, profile_id) DO UPDATE SET
      status = CASE
        WHEN style_vector_jobs.status = 'completed' THEN 'completed'
        ELSE 'pending'
      END,
      updated_at = excluded.updated_at,
      last_error = NULL
  `).run(styleRowid, retrievalHash, profileId, timestamp, timestamp);
}

/**
 * Incrementally project an authoritative flat-file corpus into SQLite.
 *
 * @param {Object} options - Indexing controls.
 * @param {string} options.corpusRoot - Authoritative style corpus root.
 * @param {string} [options.databasePath] - SQLite destination when no connection is supplied.
 * @param {import('node:sqlite').DatabaseSync} [options.database] - Existing connection.
 * @param {'migration'|'rollback'} options.corpusWalkMode - Explicit filesystem-walk grant.
 * @param {boolean} [options.confirmMissing=false] - Confirm quarantined absences as tombstones.
 * @param {boolean} [options.verifyAll=false] - Bypass metadata hints and hash every bundle.
 * @param {Function} [options.onStage] - Lifecycle observation hook.
 * @param {Function} [options.failureInjector] - Test-only crash hook inside the transaction.
 * @param {Object} [options.embeddingProfile] - Profile metadata for queued vectors.
 * @param {Function} [options.embedder] - Optional asynchronous embedding callback.
 * @returns {Promise<Object>} Publication and incremental-change summary.
 */
export async function indexStyleCorpus(options) {
  if (!options?.corpusRoot || !['migration', 'rollback'].includes(options.corpusWalkMode)) {
    const error = new Error('Corpus walking requires explicit migration or rollback mode.');
    error.code = 'corpus-walk-forbidden';
    throw error;
  }
  const database = options.database ?? openStyleDatabase(
    options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH,
  );
  const ownsDatabase = !options.database;
  const telemetry = options.telemetry ?? null;
  const overallTimer = telemetry?.overall() ?? null;
  const emit = (stage, details = {}) => {
    options.onStage?.(stage, details);
  };
  const profile = {
    id: options.embeddingProfile?.id ?? DEFAULT_EMBEDDING_PROFILE,
    provider: options.embeddingProfile?.provider ?? 'external',
    model: options.embeddingProfile?.model ?? 'configured',
    dimensions: options.embeddingProfile?.dimensions ?? null,
    configHash: options.embeddingProfile?.configHash ?? 'style-default-v1',
  };
  try {
    emit('DISCOVER');
    const discoverSpan = telemetry?.span('discover', RESIDENCY.JS_RESIDENT);
    const corpusRealPath = await realpath(options.corpusRoot);
    const crawlPath = path.join(options.corpusRoot, CRAWL_MANIFEST_FILENAME);
    const crawlRealPath = await realpath(crawlPath);
    if (!isContained(corpusRealPath, crawlRealPath)) {
      const error = new Error('Crawl manifest escapes the corpus root.');
      error.code = 'path-escape';
      throw error;
    }
    const crawlBuffer = await readFile(crawlRealPath);
    const crawlManifestHash = digest([crawlBuffer]);
    const crawlRecords = JSON.parse(crawlBuffer.toString('utf8'));
    const crawlBySlug = new Map(crawlRecords.map((record) => [record.slug, record]));
    const entries = await readdir(options.corpusRoot, { withFileTypes: true });
    const slugs = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
      .map((entry) => entry.name).sort(compareRawStrings);
    discoverSpan?.end(slugs.length);
    const snapshotSpan = telemetry?.span('snapshot.load', RESIDENCY.NATIVE);
    const currentRows = database.prepare(`
      SELECT s.style_rowid, s.style_id, s.slug, s.crawl_status, s.aggregate_hash,
        s.retrieval_hash, s.lifecycle_state, i.artifact_hint_hash, i.crawl_record_hash
      FROM styles s
      LEFT JOIN style_index_state i ON i.style_rowid = s.style_rowid
    `).all();
    snapshotSpan?.end(currentRows.length);
    const currentBySlug = new Map(currentRows.map((row) => [row.slug, row]));
    const verifySpan = telemetry?.span('verify.parse', RESIDENCY.JS_RESIDENT);
    const discovered = [];
    let candidateCount = 0;
    for (const slug of slugs) {
      const crawlRecord = crawlBySlug.get(slug);
      const crawlRecordHash = computeCrawlRecordHash(crawlRecord);
      const hints = await readArtifactHints(options.corpusRoot, corpusRealPath, slug);
      const artifactHintHash = computeHintHash(hints);
      const current = currentBySlug.get(slug);
      const needsVerification = options.verifyAll === true
        || !current
        || current.lifecycle_state !== 'active'
        || current.artifact_hint_hash !== artifactHintHash
        || current.crawl_record_hash !== crawlRecordHash;
      if (needsVerification) {
        candidateCount += 1;
        const artifacts = await readVerifiedArtifacts(options.corpusRoot, corpusRealPath, slug);
        discovered.push({
          slug,
          crawlRecord,
          artifactHintHash,
          crawlRecordHash,
          style: parseStyle(slug, crawlRecord, artifacts),
        });
      } else {
        discovered.push({
          slug,
          crawlRecord,
          artifactHintHash,
          crawlRecordHash,
          style: {
            id: current.style_id,
            slug,
            crawlStatus: current.crawl_status,
            aggregateHash: current.aggregate_hash,
            retrievalHash: current.retrieval_hash,
          },
        });
      }
    }
    verifySpan?.end(candidateCount);
    emit('VERIFY', { discovered: slugs.length, candidates: candidateCount });
    emit('PARSE_VALIDATE', { verified: candidateCount });
    const planSpan = telemetry?.span('plan.hash', RESIDENCY.JS_RESIDENT);
    const parsedStyles = discovered.map((entry) => entry.style);
    if (new Set(parsedStyles.map((style) => style.id)).size !== parsedStyles.length) {
      const error = new Error('The corpus contains duplicate style UUIDs.');
      error.code = 'duplicate-style-id';
      throw error;
    }
    const currentById = new Map(currentRows.map((row) => [row.style_id, row]));
    const verifiedStyles = discovered.filter((entry) => entry.style.artifacts)
      .map((entry) => entry.style);
    const changedStyles = verifiedStyles.filter((style) => {
      const current = currentById.get(style.id);
      return !current
        || current.slug !== style.slug
        || current.crawl_status !== style.crawlStatus
        || current.aggregate_hash !== style.aggregateHash
        || current.crawl_record_hash !== style.crawlRecordHash
        || current.lifecycle_state !== 'active';
    });
    const changedIds = new Set(changedStyles.map((style) => style.id));
    const hintOnlyStyles = verifiedStyles.filter((style) => !changedIds.has(style.id));
    const discoveredIds = new Set(parsedStyles.map((style) => style.id));
    const absentRows = currentRows.filter((row) => !discoveredIds.has(row.style_id));
    const missingRows = absentRows.filter((row) => row.lifecycle_state !== 'tombstoned');
    const inactiveStates = absentRows.map((row) => ({
      id: row.style_id,
      state: row.lifecycle_state === 'active' ? 'quarantined' : 'tombstoned',
    }));
    const generationHash = computeGenerationHash(
      crawlManifestHash,
      parsedStyles,
      inactiveStates,
    );
    const aggregateCorpusHash = digest([
      'style-corpus-aggregate-v1\0',
      ...parsedStyles.slice().sort((left, right) => compareRawStrings(left.id, right.id))
        .map((style) => `${style.id}\0${style.aggregateHash}\n`),
    ]);
    const timestamp = nowIso();
    planSpan?.end(parsedStyles.length);
    const planLoadSpan = telemetry?.span('plan.load', RESIDENCY.NATIVE);
    const currentGeneration = database.prepare(`
      SELECT generation_hash FROM current_corpus_generation WHERE singleton = 1
    `).get()?.generation_hash ?? null;
    const profileRow = database.prepare(`
      SELECT provider, model, dimensions, config_hash
      FROM embedding_profiles WHERE profile_id = ?
    `).get(profile.id);
    if (profileRow && (
      profileRow.provider !== profile.provider
      || profileRow.model !== profile.model
      || profileRow.config_hash !== profile.configHash
      || (profileRow.dimensions != null && profile.dimensions != null
        && Number(profileRow.dimensions) !== profile.dimensions)
    )) {
      const error = new Error(`Embedding profile identity conflict: ${profile.id}`);
      error.code = 'embedding-profile-conflict';
      throw error;
    }
    const missingProfileJobs = profileRow ? Number(database.prepare(`
      SELECT COUNT(*) AS count FROM styles s
      WHERE s.lifecycle_state = 'active' AND NOT EXISTS (
        SELECT 1 FROM style_vector_jobs j
        WHERE j.style_rowid = s.style_rowid
          AND j.retrieval_hash = s.retrieval_hash
          AND j.profile_id = ?
          AND j.status != 'superseded'
          AND (j.status != 'completed' OR EXISTS (
            SELECT 1 FROM style_vectors v
            WHERE v.style_rowid = j.style_rowid
              AND v.retrieval_hash = j.retrieval_hash
              AND v.profile_id = j.profile_id
          ))
      )
    `).get(profile.id).count) : parsedStyles.length;
    planLoadSpan?.end(1);
    const needsVectorQueue = !profileRow || missingProfileJobs > 0 || changedStyles.length > 0;
    const shouldPublish = changedStyles.length > 0
      || missingRows.length > 0
      || currentGeneration !== generationHash;
    if (!shouldPublish && hintOnlyStyles.length === 0 && !needsVectorQueue) {
      return {
        ok: true,
        generationHash,
        published: false,
        indexed: 0,
        unchanged: parsedStyles.length,
        quarantined: 0,
        tombstoned: 0,
      };
    }

    database.exec('BEGIN IMMEDIATE');
    try {
      emit('COMMIT', {
        changed: changedStyles.length,
        hintOnly: hintOnlyStyles.length,
        missing: missingRows.length,
      });
      const commitSpan = telemetry?.span('commit.write', RESIDENCY.NATIVE);
      ensureEmbeddingProfile(database, profile, timestamp);
      const upsertStyle = database.prepare(`
        INSERT INTO styles(
          style_id, slug, lifecycle_state, crawl_status, title, thesis, theme,
          industry, aggregate_hash, retrieval_hash, quarantine_at, tombstoned_at,
          created_at, updated_at
        ) VALUES (?, ?, 'active', ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)
        ON CONFLICT(style_id) DO UPDATE SET
          slug = excluded.slug,
          lifecycle_state = 'active',
          crawl_status = excluded.crawl_status,
          title = excluded.title,
          thesis = excluded.thesis,
          theme = excluded.theme,
          industry = excluded.industry,
          aggregate_hash = excluded.aggregate_hash,
          retrieval_hash = excluded.retrieval_hash,
          quarantine_at = NULL,
          tombstoned_at = NULL,
          updated_at = excluded.updated_at
      `);
      for (const [index, style] of changedStyles.entries()) {
        upsertStyle.run(
          style.id,
          style.slug,
          style.crawlStatus,
          style.title,
          style.thesis,
          style.theme,
          style.industry,
          style.aggregateHash,
          style.retrievalHash,
          timestamp,
          timestamp,
        );
        const styleRowid = Number(database.prepare(
          'SELECT style_rowid FROM styles WHERE style_id = ?',
        ).get(style.id).style_rowid);
        replaceStyleChildren(database, styleRowid, style, timestamp);
        options.failureInjector?.({ phase: 'COMMIT', style, index, database });
      }
      const updateHints = database.prepare(`
        UPDATE style_index_state
        SET artifact_hint_hash = ?, crawl_record_hash = ?, last_success_at = ?
        WHERE style_rowid = ?
      `);
      for (const style of hintOnlyStyles) {
        const current = currentById.get(style.id);
        updateHints.run(
          style.artifactHintHash,
          style.crawlRecordHash,
          timestamp,
          current.style_rowid,
        );
      }

      let queued = 0;
      const queueRows = database.prepare(`
        SELECT s.style_rowid, s.retrieval_hash FROM styles s
        WHERE s.lifecycle_state = 'active' AND NOT EXISTS (
          SELECT 1 FROM style_vector_jobs j
          WHERE j.style_rowid = s.style_rowid
            AND j.retrieval_hash = s.retrieval_hash
            AND j.profile_id = ?
            AND j.status != 'superseded'
            AND (j.status != 'completed' OR EXISTS (
              SELECT 1 FROM style_vectors v
              WHERE v.style_rowid = j.style_rowid
                AND v.retrieval_hash = j.retrieval_hash
                AND v.profile_id = j.profile_id
            ))
        )
      `).all(profile.id);
      for (const row of queueRows) {
        enqueueVector(database, row.style_rowid, row.retrieval_hash, profile.id, timestamp);
        queued += 1;
      }
      commitSpan?.end(changedStyles.length + queued);

      emit('VECTOR_DRAIN', { queued });
      if (!shouldPublish) {
        const finalizeSpan = telemetry?.span('commit.finalize', RESIDENCY.NATIVE);
        database.exec('COMMIT');
        finalizeSpan?.end(1);
        if (options.embedder) {
          const { drainVectorQueue } = await import('./vectors.mjs');
          const drainSpan = telemetry?.span('vector.drain', RESIDENCY.JS_RESIDENT);
          await drainVectorQueue(database, {
            profileId: profile.id,
            embedder: options.embedder,
            limit: options.vectorDrainLimit,
          });
          drainSpan?.end(queued);
        }
        return {
          ok: true,
          generationHash,
          published: false,
          indexed: 0,
          unchanged: parsedStyles.length,
          quarantined: 0,
          tombstoned: 0,
          queued,
        };
      }

      const missingSpan = telemetry?.span('publish.missing', RESIDENCY.NATIVE);
      let quarantined = 0;
      let tombstoned = 0;
      for (const row of missingRows) {
        const state = database.prepare(`
          SELECT missing_observations FROM style_index_state WHERE style_rowid = ?
        `).get(row.style_rowid);
        const shouldTombstone = row.lifecycle_state === 'quarantined'
          && (options.confirmMissing === true || Number(state?.missing_observations ?? 0) >= 1);
        if (shouldTombstone) {
          database.prepare(`
            UPDATE styles SET lifecycle_state = 'tombstoned',
              quarantine_at = COALESCE(quarantine_at, ?), tombstoned_at = ?, updated_at = ?
            WHERE style_rowid = ?
          `).run(timestamp, timestamp, timestamp, row.style_rowid);
          tombstoned += 1;
        } else if (row.lifecycle_state !== 'tombstoned') {
          database.prepare(`
            UPDATE styles SET lifecycle_state = 'quarantined', quarantine_at = ?,
              tombstoned_at = NULL, updated_at = ? WHERE style_rowid = ?
          `).run(timestamp, timestamp, row.style_rowid);
          quarantined += 1;
        }
        database.prepare(`
          UPDATE style_index_state
          SET missing_observations = missing_observations + 1, last_success_at = ?
          WHERE style_rowid = ?
        `).run(timestamp, row.style_rowid);
      }
      missingSpan?.end(missingRows.length);
      resolveRelationships(database);

      const publishSpan = telemetry?.span('publish.write', RESIDENCY.NATIVE);
      const counts = Object.fromEntries(database.prepare(`
        SELECT lifecycle_state, COUNT(*) AS count FROM styles GROUP BY lifecycle_state
      `).all().map((row) => [row.lifecycle_state, Number(row.count)]));
      emit('PUBLISH', { generationHash });
      database.prepare(`
        INSERT OR IGNORE INTO corpus_generations(
          generation_hash, parent_generation_hash, crawl_manifest_hash,
          aggregate_corpus_hash, schema_version, active_style_count,
          quarantined_style_count, tombstoned_style_count, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        generationHash,
        currentGeneration,
        crawlManifestHash,
        aggregateCorpusHash,
        STYLE_DB_SCHEMA_VERSION,
        counts.active ?? 0,
        counts.quarantined ?? 0,
        counts.tombstoned ?? 0,
        timestamp,
      );
      database.prepare(`
        INSERT INTO current_corpus_generation(singleton, generation_hash, published_at)
        VALUES (1, ?, ?)
        ON CONFLICT(singleton) DO UPDATE SET
          generation_hash = excluded.generation_hash,
          published_at = excluded.published_at
      `).run(generationHash, timestamp);
      database.prepare(`
        UPDATE style_index_state SET last_success_generation = ?
        WHERE style_rowid IN (SELECT style_rowid FROM styles WHERE lifecycle_state = 'active')
      `).run(generationHash);
      options.failureInjector?.({ phase: 'PUBLISH', database });
      database.exec('COMMIT');
      publishSpan?.end(changedStyles.length);

      if (options.embedder) {
        const { drainVectorQueue } = await import('./vectors.mjs');
        const drainSpan = telemetry?.span('vector.drain', RESIDENCY.JS_RESIDENT);
        await drainVectorQueue(database, {
          profileId: profile.id,
          embedder: options.embedder,
          limit: options.vectorDrainLimit,
        });
        drainSpan?.end(changedStyles.length);
      }
      return {
        ok: true,
        generationHash,
        published: true,
        indexed: changedStyles.length,
        unchanged: parsedStyles.length - changedStyles.length,
        quarantined,
        tombstoned,
      };
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  } finally {
    overallTimer?.end();
    if (ownsDatabase) database.close();
  }
}

/**
 * Build a complete database projection without making it a query side effect.
 *
 * @param {Object} options - The same controls as indexStyleCorpus.
 * @returns {Promise<Object>} Publication summary.
 */
async function writeGenerationPointer(
  databasePath,
  generationHash,
  databaseFile,
  afterRename,
  options = {},
) {
  if (path.basename(databaseFile) !== databaseFile) {
    throw new TypeError('Generation database file must be a basename.');
  }
  const pointerPath = `${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`;
  const artifactPath = path.join(path.dirname(databasePath), databaseFile);
  const { sha256, bytes } = await hashArtifactFile(artifactPath);
  const manifest = buildManifest({
    generationHash,
    createdAt: nowIso(),
    parentGenerationHash: options.parentGenerationHash ?? null,
    artifacts: { sqlite: { role: 'sqlite', file: databaseFile, sha256, bytes } },
  });
  await writeManifestPointer(pointerPath, manifest, { afterRename });
}

export async function buildStyleDatabase(options) {
  if (options?.database) {
    const error = new Error('Full rebuild publication requires a databasePath, not an open connection.');
    error.code = 'staging-requires-database-path';
    throw error;
  }
  const databasePath = options?.databasePath ?? DEFAULT_STYLE_DATABASE_PATH;
  const buildingPath = `${databasePath}.building-${process.pid}-${Date.now()}`;
  let generationPath = null;
  const removeSidecars = async (basePath) => {
    await Promise.all(['', '-wal', '-shm'].map((suffix) => (
      rm(`${basePath}${suffix}`, { force: true })
    )));
  };
  await removeSidecars(buildingPath);
  try {
    const result = await indexStyleCorpus({
      ...options,
      databasePath: buildingPath,
      corpusWalkMode: options.corpusWalkMode ?? 'migration',
      verifyAll: true,
    });
    const staged = openStyleDatabase(buildingPath);
    try {
      const integrity = staged.prepare('PRAGMA integrity_check').get().integrity_check;
      const foreignKeyFailures = staged.prepare('PRAGMA foreign_key_check').all();
      const current = staged.prepare(`
        SELECT generation_hash FROM current_corpus_generation WHERE singleton = 1
      `).get()?.generation_hash;
      if (integrity !== 'ok' || foreignKeyFailures.length > 0
        || current !== result.generationHash) {
        const error = new Error('Staged style database failed publication validation.');
        error.code = 'staging-validation-failed';
        throw error;
      }
      staged.prepare(`
        INSERT INTO style_fts(style_fts) VALUES ('integrity-check')
      `).run();
      staged.exec('PRAGMA wal_checkpoint(TRUNCATE)');
    } finally {
      staged.close();
    }
    const generationName = result.generationHash.replace(':', '-');
    const databaseFile = `${path.basename(databasePath)}.${generationName}`
      + `.${process.pid}-${Date.now()}.sqlite`;
    generationPath = path.join(path.dirname(databasePath), databaseFile);
    await removeSidecars(generationPath);
    await rename(buildingPath, generationPath);
    const immutableGenerationPath = generationPath;
    generationPath = null;
    const generationHandle = await open(immutableGenerationPath, 'r');
    try {
      await generationHandle.sync();
    } finally {
      await generationHandle.close();
    }
    const generationDirectory = await open(path.dirname(immutableGenerationPath), 'r');
    try {
      await generationDirectory.sync();
    } finally {
      await generationDirectory.close();
    }
    await writeGenerationPointer(
      databasePath,
      result.generationHash,
      databaseFile,
      options.failureInjector
        ? (details) => options.failureInjector({ phase: 'POINTER_RENAMED', ...details })
        : undefined,
    );
    return {
      ...result,
      databasePath,
      generationDatabasePath: path.join(path.dirname(databasePath), databaseFile),
    };
  } finally {
    await removeSidecars(buildingPath);
    if (generationPath) await removeSidecars(generationPath);
  }
}

/**
 * Roll back by atomically repointing new readers to a retained generation file.
 *
 * @param {Object} options - Logical path and retained generation identity.
 * @param {string} options.databasePath - Logical database path.
 * @param {string} options.generationDatabasePath - Retained immutable database file.
 * @returns {Promise<Object>} Restored generation pointer details.
 */
export async function rollbackStyleDatabase(options) {
  const databasePath = options?.databasePath ?? DEFAULT_STYLE_DATABASE_PATH;
  const generationDatabasePath = options?.generationDatabasePath;
  if (!generationDatabasePath
    || path.dirname(path.resolve(generationDatabasePath)) !== path.dirname(path.resolve(databasePath))) {
    const error = new Error('Rollback generation must be retained beside the logical database path.');
    error.code = 'rollback-generation-invalid';
    throw error;
  }
  try {
    const retainedInfo = await stat(generationDatabasePath);
    if (!retainedInfo.isFile()) throw new Error('not a file');
    const databaseDirectoryRealPath = await realpath(path.dirname(databasePath));
    const retainedRealPath = await realpath(generationDatabasePath);
    if (!isContained(databaseDirectoryRealPath, retainedRealPath)) {
      throw new Error('generation escapes database directory');
    }
  } catch (cause) {
    const error = new Error('Rollback generation is unavailable.', { cause });
    error.code = 'rollback-generation-invalid';
    throw error;
  }
  const retained = openStyleDatabase(generationDatabasePath);
  let generationHash;
  try {
    const integrity = retained.prepare('PRAGMA integrity_check').get().integrity_check;
    generationHash = retained.prepare(`
      SELECT generation_hash FROM current_corpus_generation WHERE singleton = 1
    `).get()?.generation_hash;
    if (integrity !== 'ok' || !generationHash) {
      const error = new Error('Rollback generation failed validation.');
      error.code = 'rollback-generation-invalid';
      throw error;
    }
  } finally {
    retained.close();
  }
  await writeGenerationPointer(
    databasePath,
    generationHash,
    path.basename(generationDatabasePath),
  );
  return { databasePath, generationDatabasePath, generationHash };
}

export const indexerInternals = Object.freeze({
  computeAggregateHash,
  computeGenerationHash,
  normalizeMarkdown,
  parseStyle,
});
