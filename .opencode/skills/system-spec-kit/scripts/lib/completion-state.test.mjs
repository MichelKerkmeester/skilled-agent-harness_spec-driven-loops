// ───────────────────────────────────────────────────────────────
// TEST: completion-state.cjs core
// ───────────────────────────────────────────────────────────────
// Covers the merged-payload shape, the check-completion.sh exit-1
// err.stdout parse, the never-throws fail-open contract, canonical-doc level
// inference, and the CLI shim round-trip. The fixtures below are generated in
// a temp dir at load time so their checklist state (COMPLETE / EVIDENCE_MISSING
// / Level-3) is fixed and self-contained, independent of any live spec packet.
// ───────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, afterEach, describe, expect, it } from 'vitest';

import core from './completion-state.cjs';

const {
  computeCompletionState,
  resolveProjectDir,
  resolveSpecFolder,
  detectFilesPresent,
  inferLevel,
  parseJsonSafely,
  describeExecError,
  execScriptJson,
  DISABLED_ENV,
} = core;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');

// Fixtures are generated in a temp dir at load time rather than pointed at live
// spec packets. Earlier revisions pinned real packets for their settled
// checklist state, but the spec tree is reorganized often enough that those
// folders moved out from under the suite and every assertion failed for a
// reason unrelated to the code under test. Self-contained fixtures grade the
// same way on every machine and never rot.
const FIXTURES_BASE = fs.mkdtempSync(path.join(os.tmpdir(), 'completion-state-fixtures-'));

function writeCanonicalDocs(dir) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'spec.md'), '# Spec\n\nFixture spec.\n');
  fs.writeFileSync(path.join(dir, 'plan.md'), '# Plan\n\nFixture plan.\n');
  fs.writeFileSync(path.join(dir, 'tasks.md'), '# Tasks\n\n- Task A\n');
  fs.writeFileSync(path.join(dir, 'implementation-summary.md'), '# Implementation Summary\n\nDone.\n');
}

// All items complete; the P0/P1 items carry evidence markers, so
// check-completion.sh grades this COMPLETE.
const CHECKLIST_COMPLETE = `# Checklist

## [P0] Core
- [x] Core behavior implemented (verified)
- [x] Error path covered (tested)

## [P1] Secondary
- [x] Docs updated (confirmed)

## [P2] Polish
- [x] Naming pass
`;

// Every item is complete, but one completed P0 item has no evidence marker, so
// check-completion.sh settles at EVIDENCE_MISSING and exits 1 while still
// emitting its JSON first -- the err.stdout parse path this suite asserts.
const CHECKLIST_EVIDENCE_MISSING = `# Checklist

## [P0] Core
- [x] Core behavior implemented
- [x] Error path covered (tested)

## [P1] Secondary
- [x] Docs updated (confirmed)
`;

// Level 2, COMPLETE checklist, no decision-record.md.
const LEVEL2_COMPLETE_FIXTURE = path.join(FIXTURES_BASE, 'level2-complete');
writeCanonicalDocs(LEVEL2_COMPLETE_FIXTURE);
fs.writeFileSync(path.join(LEVEL2_COMPLETE_FIXTURE, 'checklist.md'), CHECKLIST_COMPLETE);

// Level 2, checklist settled at EVIDENCE_MISSING (check-completion.sh exits 1).
const LEVEL2_INCOMPLETE_FIXTURE = path.join(FIXTURES_BASE, 'level2-incomplete');
writeCanonicalDocs(LEVEL2_INCOMPLETE_FIXTURE);
fs.writeFileSync(path.join(LEVEL2_INCOMPLETE_FIXTURE, 'checklist.md'), CHECKLIST_EVIDENCE_MISSING);

// Level 3: a decision-record.md alongside the checklist raises the inferred level.
const LEVEL3_FIXTURE = path.join(FIXTURES_BASE, 'level3');
writeCanonicalDocs(LEVEL3_FIXTURE);
fs.writeFileSync(path.join(LEVEL3_FIXTURE, 'checklist.md'), CHECKLIST_COMPLETE);
fs.writeFileSync(
  path.join(LEVEL3_FIXTURE, 'decision-record.md'),
  '# Decision Record\n\n## Decision\n\nChose X over Y.\n',
);

afterAll(() => {
  fs.rmSync(FIXTURES_BASE, { recursive: true, force: true });
});

const NONEXISTENT_FIXTURE = path.join(PROJECT_ROOT, '.opencode/specs/__does-not-exist-fixture__');
const CLI_SHIM_PATH = path.join(PROJECT_ROOT, '.opencode/bin/speckit-completion.cjs');

describe('resolveProjectDir / resolveSpecFolder', () => {
  it('resolves a relative projectDir against process.cwd() default', () => {
    expect(resolveProjectDir(undefined)).toBe(process.cwd());
    expect(resolveProjectDir(PROJECT_ROOT)).toBe(PROJECT_ROOT);
  });

  it('resolves a relative specFolder against projectDir, and passes through an absolute one', () => {
    expect(resolveSpecFolder('some/relative/folder', PROJECT_ROOT))
      .toBe(path.resolve(PROJECT_ROOT, 'some/relative/folder'));
    expect(resolveSpecFolder(LEVEL2_COMPLETE_FIXTURE, PROJECT_ROOT)).toBe(LEVEL2_COMPLETE_FIXTURE);
  });

  it('falls back to projectDir when no specFolder is given', () => {
    expect(resolveSpecFolder(undefined, PROJECT_ROOT)).toBe(PROJECT_ROOT);
    expect(resolveSpecFolder('', PROJECT_ROOT)).toBe(PROJECT_ROOT);
  });
});

describe('inferLevel', () => {
  it('defaults to Level 1 with no canonical docs present', () => {
    expect(inferLevel({})).toBe(1);
    expect(inferLevel({ status: 'unavailable' })).toBe(1);
  });

  it('raises to Level 2 when checklist.md is present', () => {
    expect(inferLevel({ checklist: true })).toBe(2);
  });

  it('raises to Level 3 when a decision-record is present, overriding checklist-only', () => {
    expect(inferLevel({ checklist: true, decisionRecord: true })).toBe(3);
  });
});

describe('parseJsonSafely / describeExecError', () => {
  it('parses valid JSON', () => {
    expect(parseJsonSafely('{"a":1}')).toEqual({ ok: true, data: { a: 1 } });
  });

  it('fails open on empty or malformed text', () => {
    expect(parseJsonSafely('')).toEqual({ ok: false, error: 'empty script output' });
    expect(parseJsonSafely('   ')).toEqual({ ok: false, error: 'empty script output' });
    expect(parseJsonSafely(undefined)).toEqual({ ok: false, error: 'empty script output' });
    const malformed = parseJsonSafely('{not json');
    expect(malformed.ok).toBe(false);
    expect(malformed.error).toMatch(/invalid JSON/);
  });

  it('describes an exec error from status/signal/stderr without throwing', () => {
    expect(describeExecError(null)).toBe('unknown script execution error');
    expect(describeExecError({ status: 2, stderr: 'ERROR: Folder not found\n' }))
      .toBe('exit 2: ERROR: Folder not found');
    expect(describeExecError({ signal: 'SIGTERM' })).toBe('signal SIGTERM');
    expect(describeExecError({ message: 'boom' })).toBe('boom');
  });
});

describe('execScriptJson -- stdio capture on non-zero exit (P0 regression)', () => {
  // execFileSync's stdout return value only covers the success path; a
  // script that writes JSON then exits non-zero must still surface that
  // JSON via err.stdout. Regression target: an explicit
  // `stdio: ['ignore', 'pipe', 'pipe']` must be set so this is never left to
  // an implicit default that could stop capturing it.
  let tmpDir;

  afterEach(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
    tmpDir = undefined;
  });

  function writeFixtureScript(body) {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'completion-state-execScriptJson-'));
    const scriptPath = path.join(tmpDir, 'fixture.sh');
    fs.writeFileSync(scriptPath, body, { mode: 0o755 });
    return scriptPath;
  }

  it('parses JSON from err.stdout when the script writes it then exits 1', () => {
    const scriptPath = writeFixtureScript('#!/usr/bin/env bash\necho \'{"status":"EVIDENCE_MISSING"}\'\nexit 1\n');
    const result = execScriptJson(scriptPath, [], { cwd: PROJECT_ROOT });
    expect(result).toEqual({ ok: true, data: { status: 'EVIDENCE_MISSING' } });
  });

  it('does not hang or inherit stdin -- an ignored stdin still lets a reading script exit', () => {
    const scriptPath = writeFixtureScript('#!/usr/bin/env bash\ncat <&0 >/dev/null\necho \'{"status":"OK"}\'\nexit 1\n');
    const result = execScriptJson(scriptPath, [], { cwd: PROJECT_ROOT });
    expect(result).toEqual({ ok: true, data: { status: 'OK' } });
  });

  it('reports a fail-open error (not a throw) when a non-zero exit has no parseable stdout', () => {
    const scriptPath = writeFixtureScript('#!/usr/bin/env bash\necho \'not json\' 1>&2\nexit 2\n');
    let result;
    expect(() => { result = execScriptJson(scriptPath, [], { cwd: PROJECT_ROOT }); }).not.toThrow();
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/exit 2/);
  });
});

describe('detectFilesPresent', () => {
  it('reports all-false for a directory with no canonical docs', () => {
    const present = detectFilesPresent(PROJECT_ROOT);
    expect(present.spec).toBe(false);
    expect(present.checklist).toBe(false);
    expect(present.decisionRecord).toBe(false);
  });

  it('detects checklist.md without a decision-record on the Level-2 fixture', () => {
    const present = detectFilesPresent(LEVEL2_COMPLETE_FIXTURE);
    expect(present.checklist).toBe(true);
    expect(present.decisionRecord).toBe(false);
  });

  it('detects decision-record.md on the Level-3 fixture', () => {
    const present = detectFilesPresent(LEVEL3_FIXTURE);
    expect(present.checklist).toBe(true);
    expect(present.decisionRecord).toBe(true);
  });
});

describe('computeCompletionState -- merged payload shape', () => {
  it('returns every top-level key for a real Level-2 packet', () => {
    const result = computeCompletionState({ specFolder: LEVEL2_COMPLETE_FIXTURE, projectDir: PROJECT_ROOT });

    expect(result).toHaveProperty('specFolder');
    expect(result).toHaveProperty('level');
    expect(result).toHaveProperty('filesPresent');
    expect(result).toHaveProperty('checklist');
    expect(result).toHaveProperty('placeholders');
    expect(result).toHaveProperty('generatedAt');

    expect(result.level).toBe(2);
    expect(result.checklist.status).toBe('COMPLETE');
    expect(result.checklist.passed).toBe(true);
    expect(typeof result.placeholders.overall_completion).toBe('number');
    expect(() => new Date(result.generatedAt).toISOString()).not.toThrow();
  });
});

describe('computeCompletionState -- check-completion.sh exit-1 catch', () => {
  it('reports the real checklist status for a known-incomplete packet instead of unavailable', () => {
    const result = computeCompletionState({ specFolder: LEVEL2_INCOMPLETE_FIXTURE, projectDir: PROJECT_ROOT });

    expect(result.checklist.status).toBe('EVIDENCE_MISSING');
    expect(result.checklist.status).not.toBe('unavailable');
    expect(result.checklist.passed).toBe(false);
    expect(result.checklist.qualityGates.p0MissingEvidence).toBeGreaterThan(0);
  });
});

describe('computeCompletionState -- fail-open, never throws', () => {
  it('degrades both sections to unavailable for a nonexistent folder without throwing', () => {
    expect(() => computeCompletionState({ specFolder: NONEXISTENT_FIXTURE, projectDir: PROJECT_ROOT }))
      .not.toThrow();

    const result = computeCompletionState({ specFolder: NONEXISTENT_FIXTURE, projectDir: PROJECT_ROOT });
    expect(result.checklist.status).toBe('unavailable');
    expect(typeof result.checklist.error).toBe('string');
    expect(result.placeholders.status).toBe('unavailable');
    expect(typeof result.placeholders.error).toBe('string');
  });

  it('never throws even when handed a malformed options shape', () => {
    // Non-string specFolder/projectDir values fail their typeof guards and fall
    // back to safe defaults (cwd) rather than propagating a TypeError -- still
    // proving the never-throws contract, just via graceful defaulting instead
    // of an 'unavailable' section.
    expect(() => computeCompletionState({ specFolder: 12345, projectDir: { not: 'a string' } })).not.toThrow();
    expect(() => computeCompletionState(undefined)).not.toThrow();
    expect(() => computeCompletionState()).not.toThrow();

    const result = computeCompletionState({ specFolder: 12345, projectDir: { not: 'a string' } });
    expect(result).toHaveProperty('checklist');
    expect(result).toHaveProperty('placeholders');
    expect(result).toHaveProperty('filesPresent');
  });

  it('never throws when options is explicitly null (P2 regression)', () => {
    // `options = {}` only fires for a genuinely missing argument; an
    // explicit `null` bypasses that default and, before the fix, made the
    // outer catch's own fallback (`options.specFolder`) throw a second,
    // uncaught TypeError instead of degrading gracefully.
    expect(() => computeCompletionState(null)).not.toThrow();

    const result = computeCompletionState(null);
    // A null options object degrades to the same defaults as no argument at
    // all (cwd-derived specFolder), not a thrown error.
    expect(typeof result.specFolder).toBe('string');
    expect(result).toHaveProperty('checklist');
    expect(result).toHaveProperty('placeholders');
    expect(result).toHaveProperty('filesPresent');
    expect(result).toHaveProperty('generatedAt');
  });
});

describe('computeCompletionState -- level inference', () => {
  it('reports Level 2 for a checklist-only packet', () => {
    const result = computeCompletionState({ specFolder: LEVEL2_COMPLETE_FIXTURE, projectDir: PROJECT_ROOT });
    expect(result.level).toBe(2);
  });

  it('reports Level 3 for a packet with a decision-record', () => {
    const result = computeCompletionState({ specFolder: LEVEL3_FIXTURE, projectDir: PROJECT_ROOT });
    expect(result.level).toBe(3);
  });
});

describe('computeCompletionState -- strict flag pass-through', () => {
  it('accepts strict:true without crashing and still returns a checklist section', () => {
    const result = computeCompletionState({
      specFolder: LEVEL2_COMPLETE_FIXTURE,
      projectDir: PROJECT_ROOT,
      strict: true,
    });
    expect(result.checklist).toBeTruthy();
    expect(result.checklist.strict).toBe(true);
  });
});

describe('computeCompletionState -- kill switch (MK_SPECKIT_COMPLETION_DISABLED)', () => {
  it('is a full no-op when the kill-switch env is set to 1', () => {
    const result = computeCompletionState({
      specFolder: LEVEL2_COMPLETE_FIXTURE,
      projectDir: PROJECT_ROOT,
      env: { [DISABLED_ENV]: '1' },
    });

    expect(result.disabled).toBe(true);
    expect(result.filesPresent.status).toBe('disabled');
    expect(result.checklist.status).toBe('disabled');
    expect(result.placeholders.status).toBe('disabled');
  });

  it('behaves normally when the kill-switch env is unset or not "1"', () => {
    const result = computeCompletionState({
      specFolder: LEVEL2_COMPLETE_FIXTURE,
      projectDir: PROJECT_ROOT,
      env: { [DISABLED_ENV]: '0' },
    });

    expect(result.disabled).toBeUndefined();
    expect(result.checklist.status).toBe('COMPLETE');
  });
});

describe('CLI shim (speckit-completion.cjs) -- Claude/Bash parity', () => {
  it('prints one parseable JSON object identical in shape to the tool result', () => {
    const stdout = execFileSync(
      process.execPath,
      [CLI_SHIM_PATH, LEVEL2_COMPLETE_FIXTURE, '--project-dir', PROJECT_ROOT],
      { encoding: 'utf8', timeout: 10_000 },
    );

    const parsed = JSON.parse(stdout);
    expect(parsed).toHaveProperty('specFolder');
    expect(parsed).toHaveProperty('level');
    expect(parsed).toHaveProperty('filesPresent');
    expect(parsed).toHaveProperty('checklist');
    expect(parsed).toHaveProperty('placeholders');
    expect(parsed).toHaveProperty('generatedAt');
    expect(parsed.level).toBe(2);
    expect(parsed.checklist.status).toBe('COMPLETE');
  });

  it('exits non-zero and prints usage when no spec folder is given', () => {
    expect(() => execFileSync(process.execPath, [CLI_SHIM_PATH], { encoding: 'utf8', timeout: 10_000 }))
      .toThrow();
  });
});
