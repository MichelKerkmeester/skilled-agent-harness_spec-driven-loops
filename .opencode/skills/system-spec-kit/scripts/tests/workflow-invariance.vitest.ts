// -------------------------------------------------------------------
// TEST: Workflow Invariance
// -------------------------------------------------------------------

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SKILL_ROOT = path.resolve(__dirname, '../..');
const WORKSPACE_ROOT = path.resolve(SKILL_ROOT, '../../..');
const BANNED = /\b(preset|capabilit(?:y|ies)|kind|manifest)\b/iu;

interface SurfaceHit {
  surface: string;
  line: number;
  text: string;
}

function pathExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function walk(startPath: string, predicate: (filePath: string) => boolean, results: string[] = []): string[] {
  if (!pathExists(startPath)) return results;
  // Scanner-scope guard: never descend into vendored node_modules. Those trees are gitignored
  // dependency code, not our public surface, and otherwise yield spurious dependency-README hits.
  if (startPath.split(/[\\/]/u).includes('node_modules')) return results;
  const stat = fs.statSync(startPath);
  if (stat.isFile()) {
    if (predicate(startPath)) results.push(startPath);
    return results;
  }
  for (const entry of fs.readdirSync(startPath)) {
    walk(path.join(startPath, entry), predicate, results);
  }
  return results;
}

function isTextSurface(filePath: string): boolean {
  return /\.(md|yaml|yml|json|txt)$/iu.test(filePath);
}

function relative(filePath: string): string {
  return path.relative(WORKSPACE_ROOT, filePath).replace(/\\/gu, '/');
}

function collectDefaultSurfaces(): string[] {
  const roots = [
    path.join(SKILL_ROOT, 'scripts/tests/fixtures'),
    path.join(SKILL_ROOT, 'templates'),
    path.join(WORKSPACE_ROOT, '.opencode/command'),
    path.join(WORKSPACE_ROOT, '.opencode/agent'),
    path.join(SKILL_ROOT, 'feature_catalog'),
    path.join(SKILL_ROOT, 'manual_testing_playbook'),
  ];
  const files = roots.flatMap((root) => walk(root, isTextSurface));
  for (const name of ['CLAUDE.md', 'AGENTS.md', 'AGENTS_Barter.md', 'AGENTS_example_fs_enterprises.md']) {
    const filePath = path.join(WORKSPACE_ROOT, name);
    if (pathExists(filePath)) files.push(filePath);
  }
  files.push(path.join(SKILL_ROOT, 'SKILL.md'));
  return files;
}

function collectExtraSurfaces(): string[] {
  return (process.env.WORKFLOW_INVARIANCE_EXTRA_PATHS ?? '')
    .split(path.delimiter)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => path.resolve(entry));
}

function isLegacyPhaseCleanupDebt(filePath: string): boolean {
  const rel = relative(filePath);
  return [
    'AGENTS.md',
    'AGENTS_Barter.md',
    'CLAUDE.md',
    '.opencode/agents/',
    '.opencode/commands/',
    '.opencode/skills/system-spec-kit/SKILL.md',
    '.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/',
  ].some((prefix) => rel === prefix || rel.startsWith(prefix));
}

function isAllowedHit(hit: SurfaceHit, filePath: string, isExtra: boolean): boolean {
  const rel = relative(filePath);
  if (rel.includes('.opencode/specs/')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/templates/manifest/README.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/templates/manifest/EXTENSION_GUIDE.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/templates/manifest/MIGRATION.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/templates/README.md')) return true;
  if (/mcp_server\/lib\/config\/capability-flags\.ts|lib\/config\/capability-flags\.ts|\bcapability-flags\.ts\b|from ['"][^'"]*capability-flags['"]|require\(['"][^'"]*capability-flags(?:\.js)?['"]\)/iu.test(hit.text)) return true;
  if (!isExtra && isLegacyPhaseCleanupDebt(filePath)) return true;
  // --- Concrete technical identifiers that are never private taxonomy (schema fields, real
  // filenames/modules, MCP protocol) — allowed by the specific token they match, not by whole
  // surface, so an unrelated banned word on another line still fails. ---
  // Provenance schema: `source_kind` column / `source-kind` provenance attribute (schema v35).
  if (/source[_ -]kind/iu.test(hit.text)) return true;
  // Real manifest artifacts: `manifest.json`/`.tsv`/`.ts` files (incl. `*-manifest.json`), embedder
  // `manifest.{backend,dim,name}` fields, and the CHECKPOINT_MANIFEST / getManifest identifiers.
  if (/\bmanifest\.(?:json|tsv|ts|backend|dim|name)\b|\bgetManifest\b|\bCHECKPOINT_MANIFEST\b/u.test(hit.text)) return true;
  // Roadmap capability-flags config module/type + doc, the `mk-goal-capabilities` test, and the
  // `capabilities` JSON-RPC / config field — MCP protocol + config surface, not workflow taxonomy.
  if (/capability-flags|MemoryRoadmapCapabilityFlags|roadmap capability flags|mk-goal-capabilities|"capabilities"\s*:|capabilities\s*:\s*\{/iu.test(hit.text)) return true;
  // /doctor router consolidation feature docs legitimately use "manifest" vocabulary (route
  // manifest + manifest-driven dispatch) — a real command surface, not private taxonomy.
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/maintenance/doctor-router-and-manifest-dispatch.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/doctor-commands/category-overview.md')) return true;
  if (rel.startsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/')) return true;
  // Causal-graph edge records document a "kind" schema field (edge kind, e.g. "semantic") in their
  // JSON shape — a data-schema field name, not workflow taxonomy.
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/causal-graph-link-quality.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md')) return true;
  // Feature-catalog / playbook docs that legitimately describe real "manifest" artifacts in prose:
  // the CLI-manifest modules (code-index / skill-advisor / spec-memory), the checkpoint manifest,
  // the embedder registry manifest, the `templates/manifest/` source-template dir, per-document
  // "manifest anchors" (validator output), and cross-reference links to the doctor-router doc.
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/lifecycle/checkpoint-restore-checkpointrestore.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/maintenance/memory-retention-sweep.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/maintenance/startup-runtime-compatibility-guards.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/code-index-cli-daemon-backed-surface.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/embedder-list-registry-inventory.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/memory-quality-and-indexing/spec-doc-structure-validator-and-continuity-frontmatter.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/cli-list-tools-parity.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/embedder-set-dry-run-and-validation.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/review-packet-type-marker-gated-validation.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/templates/examples/README.md')) return true;
  // Docs that use "kind" as a JSON/YAML schema-enum field (verified values: document / code /
  // structured_data / startup / unresolved), a CLI grouping label, or incidental plain English.
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/context-preservation/session-resume.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/context-preservation/session-start-startup.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/memory-quality-and-indexing/encoding-intent-capture-at-index-time-r16.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/memory-maintenance-and-migration-clis.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/dist-freshness-guard.md')) return true;
  // Docs describing real "capabilities" surfaces: the MCP server public-API barrel exposes MCP
  // server capabilities, and the spec-memory plugin status tool reports its capability boundaries.
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/mcp-server-public-api-barrel.md')) return true;
  if (rel.endsWith('.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/spec-memory-plugin.md')) return true;
  return false;
}

function scanContent(surface: string, content: string): SurfaceHit[] {
  return content
    .split(/\r?\n/u)
    .flatMap((text, index) => (BANNED.test(text) ? [{ surface, line: index + 1, text }] : []));
}

function liveOutputSurfaces(): SurfaceHit[] {
  const commands: Array<[string, string[]]> = [
    ['bash', ['scripts/spec/create.sh', '--help']],
    ['bash', ['scripts/spec/validate.sh', '--help']],
    ['bash', ['scripts/spec/scaffold-debug-delegation.sh', '--help']],
  ];
  return commands.flatMap(([command, args]) => {
    try {
      const output = execFileSync(command, args, { cwd: SKILL_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return scanContent(`live:${command} ${args.join(' ')}`, output);
    } catch (error) {
      const stderr = error instanceof Error && 'stderr' in error ? (error as { stderr?: Buffer }).stderr : undefined;
      return scanContent(`live:${command} ${args.join(' ')}`, stderr?.toString('utf8') ?? '');
    }
  });
}

describe('workflow vocabulary invariance', () => {
  it('keeps public surfaces free from new private taxonomy leaks', () => {
    const fileHits = [
      ...collectDefaultSurfaces().map((filePath) => ({ filePath, isExtra: false })),
      ...collectExtraSurfaces().map((filePath) => ({ filePath, isExtra: true })),
    ].flatMap(({ filePath, isExtra }) => {
      if (!pathExists(filePath)) return [];
      return scanContent(relative(filePath), fs.readFileSync(filePath, 'utf8'))
        .filter((hit) => !isAllowedHit(hit, filePath, isExtra));
    });

    const liveHits = liveOutputSurfaces();
    expect([...fileHits, ...liveHits]).toEqual([]);
  });

  it('reports leaks from extra-path sentinels', () => {
    const tempDir = fs.mkdtempSync(path.join(process.cwd(), 'workflow-invariance-'));
    try {
      const sentinel = path.join(tempDir, 'sentinel.md');
      fs.writeFileSync(sentinel, 'This public surface leaks preset vocabulary.\n', 'utf8');
      const hits = scanContent(relative(sentinel), fs.readFileSync(sentinel, 'utf8'))
        .filter((hit) => !isAllowedHit(hit, sentinel, true));

      expect(hits).toHaveLength(1);
      expect(hits[0].text).toContain('preset');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
