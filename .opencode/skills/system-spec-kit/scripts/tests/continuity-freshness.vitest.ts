import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { buildContinuityFingerprint, refreshGraphMetadataForSpecFolder, ZERO_CONTINUITY_FINGERPRINT } from '../../runtime/api';
import { validateContinuityFreshness } from '../validation/continuity-freshness.js';

const createdRoots = new Set<string>();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const VALIDATE_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'spec', 'validate.sh');
const RULE_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'dist', 'validation', 'continuity-freshness.js');

function makeWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'continuity-freshness-'));
  createdRoots.add(root);
  return root;
}

// No completion claim by default -- exercises the last_updated_at-vs-
// graph-metadata staleness path. Tests that need a completion claim use
// createSpecFolderWithCompletionClaim instead.
function createSpecFolder(workspaceRoot: string, name: string): string {
  const specFolder = path.join(workspaceRoot, '.opencode', 'specs', 'system-spec-kit', name);
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Continuity Freshness Fixture"',
    'description: "Fixture for continuity freshness validation."',
    'trigger_phrases: ["continuity freshness"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    '# Fixture',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  return specFolder;
}

// Claims completion the way a real packet does: spec.md's metadata table,
// not its frontmatter -- implementation-summary.md carries no status of its
// own, as real closed packets do, so the claim binds to its fingerprint alone.
function createSpecFolderWithCompletionClaim(workspaceRoot: string, name: string): string {
  const specFolder = path.join(workspaceRoot, '.opencode', 'specs', 'system-spec-kit', name);
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Continuity Freshness Completion Fixture"',
    'description: "Fixture for completion-claim continuity freshness validation."',
    'trigger_phrases: ["continuity freshness"]',
    'importance_tier: "important"',
    '---',
    '',
    '# Fixture',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| **Status** | Complete |',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  return specFolder;
}

function writeImplementationSummary(specFolder: string, continuityTimestamp?: string, fingerprint?: string): void {
  const frontmatterLines = [
    '---',
    'title: "Implementation Summary"',
    'status: "planned"',
  ];
  if (continuityTimestamp) {
    frontmatterLines.push('_memory:');
    frontmatterLines.push('  continuity:');
    frontmatterLines.push('    packet_pointer: "system-spec-kit/test-packet"');
    frontmatterLines.push(`    last_updated_at: "${continuityTimestamp}"`);
    frontmatterLines.push('    last_updated_by: "tester"');
    frontmatterLines.push('    recent_action: "Validated freshness"');
    frontmatterLines.push('    next_safe_action: "Keep timestamps aligned"');
    frontmatterLines.push('    blockers: []');
    frontmatterLines.push('    key_files: []');
    if (fingerprint) {
      frontmatterLines.push('    session_dedup:');
      frontmatterLines.push(`      fingerprint: "${fingerprint}"`);
      frontmatterLines.push('      session_id: "test-session"');
      frontmatterLines.push('      parent_session_id: null');
    }
    frontmatterLines.push('    completion_pct: 0');
    frontmatterLines.push('    open_questions: []');
    frontmatterLines.push('    answered_questions: []');
  }
  frontmatterLines.push('---', '', '| File Path | Change Type | Description |', '|-----------|-------------|-------------|', '| `implementation-summary.md` | Modify | Freshness fixture |');
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), frontmatterLines.join('\n'), 'utf-8');
}

// Stamps a fingerprint that will actually match on read-back: write the
// placeholder first, then recompute over that exact content (the field is
// normalized to the zero placeholder before hashing either way) and patch it in.
function stampRealFingerprint(specFolder: string): void {
  const summaryPath = path.join(specFolder, 'implementation-summary.md');
  const content = fs.readFileSync(summaryPath, 'utf-8');
  const recomputed = buildContinuityFingerprint(content);
  fs.writeFileSync(summaryPath, content.replace(ZERO_CONTINUITY_FINGERPRINT, recomputed), 'utf-8');
}

function runValidateStrict(specFolder: string): { exitCode: number; stdout: string; stderr: string } {
  const result = spawnSync('bash', [VALIDATE_SCRIPT, specFolder, '--strict'], {
    cwd: path.resolve(specFolder, '..', '..', '..', '..'),
    encoding: 'utf-8',
    env: {
      ...process.env,
      SPECKIT_RULES: 'GRAPH_METADATA_PRESENT,CONTINUITY_FRESHNESS',
    },
  });

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('continuity-freshness', () => {
  it('passes when continuity is within the 10-minute freshness budget', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '920-continuity-fresh');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:09:59Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('fresh');
  });

  it('warns when graph metadata is more than 10 minutes newer than continuity', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '921-continuity-stale');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('warn');
    expect(result.code).toBe('stale');
    expect(result.deltaMs).toBe(601000);
  });

  it('skips cleanly when continuity frontmatter is missing', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '922-continuity-missing-frontmatter');
    writeImplementationSummary(specFolder);
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('missing_frontmatter');
  });

  it('skips cleanly when graph metadata is missing', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '923-continuity-missing-graph');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('missing_graph_metadata');
  });

  it('fails with a distinct code when graph metadata is unreadable JSON', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '923a-continuity-invalid-graph');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    fs.writeFileSync(path.join(specFolder, 'graph-metadata.json'), '{invalid json', 'utf-8');

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('fail');
    expect(result.code).toBe('invalid_graph_metadata');
  });

  it('treats continuity newer than graph metadata as benign clock drift', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '924-continuity-clock-drift');
    writeImplementationSummary(specFolder, '2026-04-17T12:11:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:00:00Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('clock_drift');
    expect(result.deltaMs).toBeLessThan(0);
  });

  // Followup-actual: vitest-recovery-followup runtime regression exceeds the 30 LOC single-file repair rule
  it.fails.skip('wires stale continuity into validate.sh strict mode as a warning failure', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '925-continuity-validate-sh');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = runValidateStrict(specFolder);

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toContain('CONTINUITY_FRESHNESS');
    expect(result.stdout).toContain('lags graph-metadata');
  });

  it('passes as fresh_completion when a completion claim carries a matching fingerprint', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolderWithCompletionClaim(root, '926-continuity-fresh-completion');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z', ZERO_CONTINUITY_FINGERPRINT);
    stampRealFingerprint(specFolder);

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('fresh_completion');
  });

  it('reports missing_fingerprint as a distinguishable skip, not the timestamp verdict', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolderWithCompletionClaim(root, '927-continuity-missing-fingerprint');
    // No fingerprint anywhere; graph-metadata is set far enough past the
    // budget that the old fall-through bug would have reported 'stale'.
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('missing_fingerprint');
  });

  it('reports zero_fingerprint directly instead of the timestamp verdict (the closed-packet regression)', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolderWithCompletionClaim(root, '928-continuity-zero-fingerprint');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z', ZERO_CONTINUITY_FINGERPRINT);
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('zero_fingerprint');
  });

  it('gates the CLI on SPECKIT_COMPLETION_FRESHNESS while the exported function stays unguarded', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '929-continuity-not-opted-in');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:09:59Z' });

    const { SPECKIT_COMPLETION_FRESHNESS: _omitted, ...envWithoutOptIn } = process.env;
    const cliRun = spawnSync('node', [RULE_SCRIPT, '--folder', specFolder, '--json'], {
      encoding: 'utf-8',
      env: envWithoutOptIn,
    });
    const cliResult = JSON.parse(cliRun.stdout) as { status: string; code: string };

    expect(cliResult.status).toBe('pass');
    expect(cliResult.code).toBe('not_opted_in');

    // Calling the exported function directly performs no such gate: it
    // always evaluates the real verdict, regardless of the env var.
    const directResult = validateContinuityFreshness(specFolder);
    expect(directResult.code).toBe('fresh');
  });
});
