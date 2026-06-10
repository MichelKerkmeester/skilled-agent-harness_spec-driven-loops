// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Trust Gate Tests
// ───────────────────────────────────────────────────────────────
// Daemon-side trust gating for mutation tools: advisor_rebuild caller
// authority, transport-absent _meta defaults, the daemon-owner env grant,
// propagate-apply dry-run labeling, and read-only recommend-path DB access.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildCallerContext, dispatchTool, resolveTrustedCaller } from '../../advisor-server.js';
import { propagateInboundEnhances } from '../../lib/cross-skill-edges/index.js';
import {
  closeDb,
  getDbReadOnly,
  initDb,
  isGenuineCorruptionReason,
  loadSkillEmbeddings,
} from '../../lib/skill-graph/skill-graph-db.js';

type MCPResponse = { content: Array<{ type: string; text: string }> };

const MANAGED_ENV_KEYS = [
  'MK_SKILL_ADVISOR_TRUST_DEFAULT',
  'MK_SKILL_ADVISOR_DB_DIR',
  'SYSTEM_SKILL_ADVISOR_DB_DIR',
] as const;

let savedEnv: Map<string, string | undefined>;
let sandboxRoot: string;

function parsePayload(response: MCPResponse | null): Record<string, unknown> {
  expect(response).not.toBeNull();
  return JSON.parse(response!.content[0].text) as Record<string, unknown>;
}

function writeGraphMetadata(
  skillRoot: string,
  skillId: string,
  family: string,
  enhanceWhen?: Record<string, unknown>,
): string {
  const skillDir = join(skillRoot, skillId);
  mkdirSync(skillDir, { recursive: true });
  const metadata: Record<string, unknown> = {
    schema_version: 2,
    skill_id: skillId,
    family,
    category: 'test',
    domains: ['test'],
    intent_signals: [skillId],
    derived: {},
    edges: {},
  };
  if (enhanceWhen) {
    metadata.enhance_when = enhanceWhen;
  }
  const metadataPath = join(skillDir, 'graph-metadata.json');
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  return metadataPath;
}

beforeEach(() => {
  savedEnv = new Map(MANAGED_ENV_KEYS.map((key) => [key, process.env[key]]));
  delete process.env.MK_SKILL_ADVISOR_TRUST_DEFAULT;
  delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  sandboxRoot = mkdtempSync(join(tmpdir(), 'advisor-trust-gate-'));
  process.env.MK_SKILL_ADVISOR_DB_DIR = join(sandboxRoot, 'db');
  closeDb();
});

afterEach(() => {
  closeDb();
  for (const [key, value] of savedEnv) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  rmSync(sandboxRoot, { recursive: true, force: true });
});

describe('advisor_rebuild caller authority', () => {
  it('rejects an explicitly untrusted _meta caller before any database access', async () => {
    const callerContext = buildCallerContext({
      transport: 'cli',
      trusted: false,
      callerAuthority: 'untrusted',
    });

    const response = await dispatchTool('advisor_rebuild', {}, callerContext);
    const payload = parsePayload(response);

    expect(payload).toEqual({
      status: 'error',
      error: 'advisor_rebuild requires trusted caller context',
      code: 'UNTRUSTED_CALLER',
    });
    // Gate fires before the handler touches the database: nothing is created.
    expect(existsSync(join(sandboxRoot, 'db', 'skill-graph.sqlite'))).toBe(false);
  });

  it('rejects a dispatch with no caller context at all (fail-closed)', async () => {
    const response = await dispatchTool('advisor_rebuild', {});
    const payload = parsePayload(response);

    expect(payload.status).toBe('error');
    expect(payload.code).toBe('UNTRUSTED_CALLER');
    expect(existsSync(join(sandboxRoot, 'db', 'skill-graph.sqlite'))).toBe(false);
  });
});

describe('transport-absent _meta defaults to untrusted for mutations', () => {
  it('treats an empty _meta as untrusted for advisor_rebuild and skill_graph_scan', async () => {
    const callerContext = buildCallerContext({});
    expect(callerContext.trusted).toBe(false);

    const rebuild = parsePayload(await dispatchTool('advisor_rebuild', {}, callerContext));
    expect(rebuild.status).toBe('error');
    expect(rebuild.code).toBe('UNTRUSTED_CALLER');

    const scan = parsePayload(await dispatchTool('skill_graph_scan', {}, callerContext));
    expect(scan.status).toBe('error');
    expect(scan.code).toBe('UNTRUSTED_CALLER');
  });

  it('honors the daemon-owner env grant for transport-absent callers only', () => {
    expect(resolveTrustedCaller({})).toBe(false);

    process.env.MK_SKILL_ADVISOR_TRUST_DEFAULT = 'trusted';
    expect(resolveTrustedCaller({})).toBe(true);
    expect(buildCallerContext({}).trusted).toBe(true);
    expect(buildCallerContext(undefined).trusted).toBe(true);
    // Explicit untrusted markers always win over the grant.
    expect(resolveTrustedCaller({ trusted: false })).toBe(false);
    expect(resolveTrustedCaller({ callerAuthority: 'untrusted' })).toBe(false);

    process.env.MK_SKILL_ADVISOR_TRUST_DEFAULT = 'untrusted';
    expect(resolveTrustedCaller({})).toBe(false);
  });

  it('keeps honoring explicit trusted markers without the grant', () => {
    expect(resolveTrustedCaller({ transport: 'cli', trusted: true, callerAuthority: 'trusted' })).toBe(true);
    expect(resolveTrustedCaller({ callerAuthority: 'trusted' })).toBe(true);
  });
});

describe('propagate apply dry-run labeling', () => {
  it('does not write when dryRun is omitted and reports dryRun true', async () => {
    const skillRoot = join(sandboxRoot, 'skills');
    const sourcePath = writeGraphMetadata(skillRoot, 'cli-alpha', 'cli', {
      skill_has_files: ['SKILL.md'],
      weight: 0.5,
      context_template: 'routes ${target.id}',
    });
    writeGraphMetadata(skillRoot, 'cli-new', 'cli');
    writeFileSync(join(skillRoot, 'cli-new', 'SKILL.md'), '# cli-new', 'utf8');
    const sourceBefore = readFileSync(sourcePath, 'utf8');

    const report = await propagateInboundEnhances({
      skillsRoot: skillRoot,
      mode: 'report',
      minConfidence: 0.25,
    });
    const candidate = report.candidates.find(
      (entry) => entry.sourceSkillId === 'cli-alpha' && entry.targetSkillId === 'cli-new',
    );
    expect(candidate).toBeDefined();

    const apply = await propagateInboundEnhances({
      skillsRoot: skillRoot,
      mode: 'apply',
      minConfidence: 0.25,
      applyCandidateIds: [candidate!.id],
      // dryRun intentionally omitted: the default must be a non-writing dry run
    });

    expect(apply.dryRun).toBe(true);
    expect(apply.applied).toEqual([]);
    expect(readFileSync(sourcePath, 'utf8')).toBe(sourceBefore);

    const explicit = await propagateInboundEnhances({
      skillsRoot: skillRoot,
      mode: 'apply',
      minConfidence: 0.25,
      applyCandidateIds: [candidate!.id],
      dryRun: false,
    });

    expect(explicit.dryRun).toBe(false);
    expect(explicit.applied).toContain(candidate!.id);
    const reparsed = JSON.parse(readFileSync(sourcePath, 'utf8')) as {
      edges?: { enhances?: Array<{ target?: string }> };
    };
    expect((reparsed.edges?.enhances ?? []).some((edge) => edge.target === 'cli-new')).toBe(true);
  });
});

describe('read-only recommend-path database access', () => {
  it('returns null when the database file is absent and loads no embeddings', () => {
    expect(getDbReadOnly()).toBeNull();
    expect(loadSkillEmbeddings()).toEqual([]);
    expect(existsSync(join(sandboxRoot, 'db', 'skill-graph.sqlite'))).toBe(false);
  });

  it('opens an existing database read-only and rejects writes', () => {
    initDb(join(sandboxRoot, 'db'));
    closeDb();

    const readOnly = getDbReadOnly();
    expect(readOnly).not.toBeNull();
    const count = readOnly!.prepare('SELECT COUNT(*) AS c FROM skill_nodes').get() as { c: number };
    expect(count.c).toBe(0);
    expect(() => readOnly!.exec('CREATE TABLE second_writer_probe (x TEXT)')).toThrow();
  });
});

describe('malformed-database recovery scoping', () => {
  it('only treats genuine corruption reasons as recoverable', () => {
    expect(isGenuineCorruptionReason('SQLITE_CORRUPT')).toBe(true);
    expect(isGenuineCorruptionReason('SQLITE_NOTADB')).toBe(true);
    expect(isGenuineCorruptionReason('database disk image is malformed')).toBe(true);
    expect(isGenuineCorruptionReason('file is not a database')).toBe(true);
    expect(isGenuineCorruptionReason('SQLITE_QUICK_CHECK_row 12 missing from index')).toBe(true);

    expect(isGenuineCorruptionReason('SQLITE_CHECK_FAILED: database is locked')).toBe(false);
    expect(isGenuineCorruptionReason('database is locked')).toBe(false);
    expect(isGenuineCorruptionReason('SQLITE_BUSY')).toBe(false);
    expect(isGenuineCorruptionReason('SQLITE_CHECK_FAILED: EIO: i/o error')).toBe(false);
    expect(isGenuineCorruptionReason('EPERM: operation not permitted')).toBe(false);
    expect(isGenuineCorruptionReason('SQLITE_CHECK_FAILED: EACCES: permission denied')).toBe(false);
  });
});
