import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { buildContinuityFingerprint } from '../lib/validation/spec-doc-structure';
import { validateContinuityFreshness } from '../../scripts/validation/continuity-freshness';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(THIS_DIR, '../../../../..');
const VALIDATE_SCRIPT = path.resolve(THIS_DIR, '../../scripts/spec/validate.sh');
const REVIEWER_STALE_VERDICT = path.resolve(
  REPO_ROOT,
  '.opencode/skills/deep-loop-workflows/improvement/assets/model_benchmark/benchmark-fixtures/reviewer-stale-verdict.json',
);
const TEMP_DIRS: string[] = [];

function makeTempDir(prefix: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  TEMP_DIRS.push(tempDir);
  return tempDir;
}

function writeWithFreshFingerprint(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf8');
  const fingerprint = buildContinuityFingerprint(content);
  fs.writeFileSync(filePath, content.replace('sha256:0000000000000000000000000000000000000000000000000000000000000000', fingerprint), 'utf8');
}

function createPacket(root: string): string {
  const folder = path.join(root, '.opencode', 'specs', 'example');
  fs.mkdirSync(folder, { recursive: true });
  const frontmatter = (title: string, status = 'planned') => [
    '---',
    `title: "${title}"`,
    'description: "Freshness fixture."',
    'trigger_phrases: ["freshness fixture"]',
    'importance_tier: "normal"',
    'contextType: "implementation"',
    `status: "${status}"`,
    '_memory:',
    '  continuity:',
    '    packet_pointer: "system-spec-kit/example"',
    '    last_updated_at: "2026-06-10T12:00:00Z"',
    '    last_updated_by: "tester"',
    '    recent_action: "Verified packet"',
    '    next_safe_action: "Keep verifying"',
    '    blockers: []',
    '    key_files: ["checklist.md"]',
    '    session_dedup:',
    '      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"',
    '      session_id: "freshness-fixture"',
    '      parent_session_id: null',
    '    completion_pct: 100',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
  ].join('\n');

  writeWithFreshFingerprint(path.join(folder, 'spec.md'), `${frontmatter('Spec', 'complete')}\n# Spec\n`);
  writeWithFreshFingerprint(path.join(folder, 'plan.md'), `${frontmatter('Plan')}\n# Plan\n`);
  writeWithFreshFingerprint(path.join(folder, 'tasks.md'), `${frontmatter('Tasks')}\n# Tasks\n`);
  writeWithFreshFingerprint(path.join(folder, 'checklist.md'), `${frontmatter('Checklist')}\n# Checklist\n\n- [x] Fixture check. Evidence: vitest.\n`);
  writeWithFreshFingerprint(path.join(folder, 'implementation-summary.md'), `${frontmatter('Implementation Summary')}\n# Implementation Summary\n`);
  fs.writeFileSync(
    path.join(folder, 'graph-metadata.json'),
    JSON.stringify({ derived: { last_save_at: '2026-06-10T12:00:00Z' } }, null, 2),
    'utf8',
  );
  return folder;
}

function createPacketWithoutCompletionClaim(root: string): string {
  const folder = path.join(root, '.opencode', 'specs', 'example-no-claim');
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'implementation-summary.md'), [
    '---',
    'title: "Implementation Summary"',
    '_memory:',
    '  continuity:',
    '    last_updated_at: "2026-06-10T12:00:00Z"',
    '---',
    '# Implementation Summary',
  ].join('\n'), 'utf8');
  fs.writeFileSync(
    path.join(folder, 'graph-metadata.json'),
    JSON.stringify({ derived: { last_save_at: '2026-06-10T13:00:00Z' } }, null, 2),
    'utf8',
  );
  return folder;
}

function runValidate(folder: string, env: Record<string, string | undefined> = {}): { status: number; stdout: string; stderr: string } {
  const childEnv: NodeJS.ProcessEnv = {
    ...process.env,
    SPECKIT_RULES: 'CONTINUITY_FRESHNESS',
  };
  if (!isEnabledEnv(env.SPECKIT_COMPLETION_FRESHNESS)) {
    childEnv.SPECKIT_VALIDATE_LEGACY = '1';
  }
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete childEnv[key];
    } else {
      childEnv[key] = value;
    }
  }
  const result = spawnSync('bash', [VALIDATE_SCRIPT, folder, '--strict', '--json'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: childEnv,
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function isEnabledEnv(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes((value ?? '').toLowerCase().trim());
}

function withFakeGit<T>(root: string, statusOutput: string, callback: () => T): T {
  const binDir = makeTempDir('speckit-fake-git-');
  const fakeGit = path.join(binDir, 'git');
  fs.writeFileSync(fakeGit, [
    '#!/usr/bin/env node',
    'const args = process.argv.slice(2);',
    'if (args.includes("rev-parse") && args.includes("--show-toplevel")) { console.log(process.env.FAKE_GIT_ROOT); process.exit(0); }',
    'if (args.includes("status") && args.includes("--porcelain")) { process.stdout.write(process.env.FAKE_GIT_STATUS || ""); process.exit(0); }',
    'process.exit(1);',
  ].join('\n'), 'utf8');
  fs.chmodSync(fakeGit, 0o755);

  const previousPath = process.env.PATH;
  const previousRoot = process.env.FAKE_GIT_ROOT;
  const previousStatus = process.env.FAKE_GIT_STATUS;
  process.env.PATH = `${binDir}${path.delimiter}${previousPath ?? ''}`;
  process.env.FAKE_GIT_ROOT = root;
  process.env.FAKE_GIT_STATUS = statusOutput;
  try {
    return callback();
  } finally {
    process.env.PATH = previousPath;
    if (previousRoot === undefined) delete process.env.FAKE_GIT_ROOT;
    else process.env.FAKE_GIT_ROOT = previousRoot;
    if (previousStatus === undefined) delete process.env.FAKE_GIT_STATUS;
    else process.env.FAKE_GIT_STATUS = previousStatus;
  }
}

afterEach(() => {
  delete process.env.SPECKIT_COMPLETION_FRESHNESS_ENFORCE;
  while (TEMP_DIRS.length > 0) {
    const tempDir = TEMP_DIRS.pop();
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('completion continuity freshness', () => {
  it('keeps flag-off validate.sh output byte-identical after a stale edit', () => {
    const root = makeTempDir('speckit-freshness-off-');
    const folder = createPacket(root);

    const before = runValidate(folder, { SPECKIT_COMPLETION_FRESHNESS: undefined });
    fs.appendFileSync(path.join(folder, 'checklist.md'), '\nEdited after green evidence.\n', 'utf8');
    const after = runValidate(folder, { SPECKIT_COMPLETION_FRESHNESS: undefined });

    expect(before.status).toBe(0);
    expect(after.status).toBe(0);
    expect(after.stdout).toBe(before.stdout);
  });

  it('warns on the stale-verdict fixture class when a completion fingerprint is stale', () => {
    const sourceFixture = JSON.parse(fs.readFileSync(REVIEWER_STALE_VERDICT, 'utf8')) as { id: string };
    expect(sourceFixture.id).toBe('reviewer-stale-verdict');

    const root = makeTempDir('speckit-freshness-warn-');
    const folder = createPacket(root);
    fs.appendFileSync(path.join(folder, 'checklist.md'), '\nEdited after green evidence.\n', 'utf8');

    const result = runValidate(folder, { SPECKIT_COMPLETION_FRESHNESS: 'true' });
    const parsed = JSON.parse(result.stdout) as { results: Array<{ rule: string; status: string; message: string }> };

    expect(result.status).toBe(2);
    expect(parsed.results[0].rule).toBe('CONTINUITY_FRESHNESS');
    expect(parsed.results[0].status).toBe('warn');
    expect(parsed.results[0].message).toContain('stored continuity fingerprint does not match current content');
  });

  it('promotes the stale completion fingerprint to an error in enforce mode', () => {
    const root = makeTempDir('speckit-freshness-enforce-');
    const folder = createPacket(root);
    fs.appendFileSync(path.join(folder, 'checklist.md'), '\nEdited after green evidence.\n', 'utf8');

    const result = runValidate(folder, {
      SPECKIT_COMPLETION_FRESHNESS: 'true',
      SPECKIT_COMPLETION_FRESHNESS_ENFORCE: 'true',
    });
    const parsed = JSON.parse(result.stdout) as { results: Array<{ status: string }> };

    expect(result.status).toBe(2);
    expect(parsed.results[0].status).toBe('error');
  });

  it('passes unchanged completion content with a recomputed matching fingerprint', () => {
    const root = makeTempDir('speckit-freshness-match-');
    const folder = createPacket(root);

    const result = validateContinuityFreshness(folder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('fresh_completion');
    expect(result.details.some((detail) => detail.includes('recomputed=sha256:'))).toBe(true);
  });

  it('returns early when no completion claim is present', () => {
    const root = makeTempDir('speckit-freshness-no-claim-');
    const folder = createPacketWithoutCompletionClaim(root);

    const result = validateContinuityFreshness(folder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('no_completion_claim');
  });

  it('detects completion claims from metadata-table status and accepted evidence markers', () => {
    const root = makeTempDir('speckit-freshness-table-status-');
    const folder = createPacketWithoutCompletionClaim(root);
    const specPath = path.join(folder, 'spec.md');
    const checklistPath = path.join(folder, 'checklist.md');
    fs.writeFileSync(
      path.join(folder, 'graph-metadata.json'),
      JSON.stringify({ derived: { last_save_at: '2026-06-10T12:00:00Z' } }, null, 2),
      'utf8',
    );
    fs.writeFileSync(specPath, [
      '---',
      'title: "Spec"',
      '_memory:',
      '  continuity:',
      '    session_dedup:',
      '      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"',
      '---',
      '# Spec',
      '',
      '| Field | Value |',
      '|---|---|',
      '| **Status** | Completed |',
    ].join('\n'), 'utf8');
    writeWithFreshFingerprint(specPath, fs.readFileSync(specPath, 'utf8'));
    fs.writeFileSync(checklistPath, [
      '---',
      'title: "Checklist"',
      '_memory:',
      '  continuity:',
      '    session_dedup:',
      '      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"',
      '---',
      '# Checklist',
      '',
      '- [x] Fixture check [EVIDENCE: vitest.]',
    ].join('\n'), 'utf8');
    writeWithFreshFingerprint(checklistPath, fs.readFileSync(checklistPath, 'utf8'));

    const result = validateContinuityFreshness(folder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('fresh_completion');
  });

  it('keeps the clean-tree precondition scoped to packet paths', () => {
    const root = makeTempDir('speckit-freshness-scope-');
    const folder = createPacket(root);

    const outsideDirty = withFakeGit(root, '', () => validateContinuityFreshness(folder));
    const insideDirty = withFakeGit(root, ' M .opencode/specs/example/implementation-summary.md\n', () => validateContinuityFreshness(folder));

    expect(outsideDirty.status).toBe('pass');
    expect(insideDirty.status).toBe('warn');
    expect(insideDirty.code).toBe('dirty_tree');
  });
});
