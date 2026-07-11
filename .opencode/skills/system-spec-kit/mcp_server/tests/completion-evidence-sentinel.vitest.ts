// TEST: Completion Evidence Sentinel (runtime-neutral core)
// Covers:
// - Claim gate: no-claim / no-spec-folder short-circuits to 'ok', never spawns check-completion.sh
// - Checklist evaluation: a completed P0 item missing an evidence marker advises EVIDENCE_MISSING;
//   the same item WITH a marker resolves 'ok'
// - Level 1 fallback: no checklist.md falls back to an implementation-summary.md stat
// - Dedup: an identical packet+message pair only advises once
// - Kill switch + fail-open on an unexpected internal error
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import childProcess from 'node:child_process';

const require = createRequire(import.meta.url);
const sentinelCore = require('../lib/hooks/completion-evidence-sentinel.cjs') as {
  COMPLETION_CLAIM_PATTERN: RegExp;
  SPEC_FOLDER_TEXT_PATTERN: RegExp;
  KILL_SWITCH_ENV: string;
  detectCompletionClaim: (text: string) => boolean;
  resolveSpecFolderFromText: (text: string) => string | null;
  resolveSentinelPaths: (projectDir: string) => { stateDir: string; logPath: string; checkCompletionScriptPath: string };
  evaluateCompletionEvidence: (request: {
    specFolder?: string;
    claimText?: string;
    projectDir?: string;
    env?: NodeJS.ProcessEnv;
  }) => { decision: 'ok' | 'advise'; detail: string | null; deduped: boolean };
  appendAdvisoryLog: (projectDir: string, detail: string) => boolean;
};

const CLAIM_TEXT = 'The core is now complete and shipped.';
const NON_CLAIM_TEXT = 'Let me look at a few more things before continuing.';

function makeFixtureFolder(options: { checklist?: string | null; implementationSummary?: boolean }): string {
  const dir = mkdtempSync(join(tmpdir(), 'completion-sentinel-fixture-'));
  if (typeof options.checklist === 'string') {
    writeFileSync(join(dir, 'checklist.md'), options.checklist, 'utf8');
  }
  if (options.implementationSummary) {
    writeFileSync(join(dir, 'implementation-summary.md'), '# Summary\n\nDone.\n', 'utf8');
  }
  return dir;
}

const CHECKLIST_P0_NO_EVIDENCE = '# Checklist\n\n## P0 - Blockers\n- [x] Ship the core module [P0]\n';
const CHECKLIST_P0_WITH_EVIDENCE = '# Checklist\n\n## P0 - Blockers\n- [x] Ship the core module [P0] [EVIDENCE: tests/foo.test.js:12]\n';

describe('completion-evidence-sentinel core', () => {
  const tempDirs: string[] = [];
  let projectDir: string;

  function newProjectDir(): string {
    const dir = mkdtempSync(join(tmpdir(), 'completion-sentinel-project-'));
    tempDirs.push(dir);
    return dir;
  }

  function trackFixture(dir: string): string {
    tempDirs.push(dir);
    return dir;
  }

  afterEach(() => {
    vi.restoreAllMocks();
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('detectCompletionClaim anchors to the trailing slice of the turn', () => {
    expect(sentinelCore.detectCompletionClaim(CLAIM_TEXT)).toBe(true);
    expect(sentinelCore.detectCompletionClaim(NON_CLAIM_TEXT)).toBe(false);
    expect(sentinelCore.detectCompletionClaim('')).toBe(false);
    // A claim word buried deep in a long turn, far from the trailing anchor,
    // should not fire once padded past the anchor window.
    const buried = `${CLAIM_TEXT}${' filler'.repeat(200)}`;
    expect(sentinelCore.detectCompletionClaim(buried)).toBe(false);
  });

  it('resolveSpecFolderFromText extracts a spec-folder-shaped path and trims trailing punctuation', () => {
    expect(sentinelCore.resolveSpecFolderFromText('see .opencode/specs/foo/bar/baz for details.'))
      .toBe('.opencode/specs/foo/bar/baz');
    expect(sentinelCore.resolveSpecFolderFromText('no folder mentioned here')).toBeNull();
  });

  it('REQ-001: no completion claim is a no-op and never spawns check-completion.sh', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ checklist: CHECKLIST_P0_NO_EVIDENCE }));
    const spy = vi.spyOn(childProcess, 'execFileSync');

    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: NON_CLAIM_TEXT,
      projectDir,
    });

    expect(result).toEqual({ decision: 'ok', detail: null, deduped: false });
    expect(spy).not.toHaveBeenCalled();
  });

  it('REQ-001: a completion claim with no resolved spec folder is a no-op', () => {
    projectDir = newProjectDir();
    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: '',
      claimText: CLAIM_TEXT,
      projectDir,
    });
    expect(result).toEqual({ decision: 'ok', detail: null, deduped: false });
  });

  it('REQ-002 fixture A: a completed P0 item lacking an evidence marker advises EVIDENCE_MISSING', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ checklist: CHECKLIST_P0_NO_EVIDENCE }));

    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: CLAIM_TEXT,
      projectDir,
    });

    expect(result.decision).toBe('advise');
    expect(result.detail).toMatch(/lack an evidence marker/);
    expect(result.deduped).toBe(false);
  });

  it('REQ-002 fixture B: the same packet with a full evidence marker resolves ok', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ checklist: CHECKLIST_P0_WITH_EVIDENCE }));

    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: CLAIM_TEXT,
      projectDir,
    });

    expect(result).toEqual({ decision: 'ok', detail: null, deduped: false });
  });

  it('REQ-003: a Level 1 folder with no checklist.md and no implementation-summary.md advises', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({}));

    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: CLAIM_TEXT,
      projectDir,
    });

    expect(result.decision).toBe('advise');
    expect(result.detail).toMatch(/no implementation-summary\.md recorded/);
  });

  it('REQ-003: a Level 1 folder WITH implementation-summary.md resolves ok', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ implementationSummary: true }));

    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: CLAIM_TEXT,
      projectDir,
    });

    expect(result).toEqual({ decision: 'ok', detail: null, deduped: false });
  });

  it('REQ-004: never invokes validate.sh, vitest, npm test, or a build', () => {
    const source = readFileSync(
      join(import.meta.dirname, '..', 'lib', 'hooks', 'completion-evidence-sentinel.cjs'),
      'utf8',
    );
    // Strip comment-only lines first: the module's own header prose names
    // validate.sh precisely to disclaim running it, which would otherwise
    // false-positive a raw substring match against this test.
    const codeOnly = source
      .split('\n')
      .filter((line) => !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.trim().startsWith('║'))
      .join('\n');
    expect(codeOnly).not.toMatch(/validate\.sh/);
    expect(codeOnly).not.toMatch(/\bvitest\b/i);
    expect(codeOnly).not.toMatch(/npm\s+(run\s+build|test)/);
  });

  it('REQ-004: a forced internal error (unexpected spawn failure shape) fails open to ok', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ checklist: CHECKLIST_P0_NO_EVIDENCE }));
    // Throw a non-Error, no-.stdout value to exercise the defensive branch
    // that only trusts err.stdout when it is actually present.
    vi.spyOn(childProcess, 'execFileSync').mockImplementation(() => {
      throw { unexpected: true };
    });

    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: CLAIM_TEXT,
      projectDir,
    });

    expect(result).toEqual({ decision: 'ok', detail: null, deduped: false });
  });

  it('REQ-007: dedups an identical packet+message pair to at most one advisory', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ checklist: CHECKLIST_P0_NO_EVIDENCE }));

    const first = sentinelCore.evaluateCompletionEvidence({ specFolder: fixture, claimText: CLAIM_TEXT, projectDir });
    const second = sentinelCore.evaluateCompletionEvidence({ specFolder: fixture, claimText: CLAIM_TEXT, projectDir });

    expect(first.decision).toBe('advise');
    expect(second).toEqual({ decision: 'ok', detail: null, deduped: true });
  });

  it('REQ-007: a different claim against the same packet advises again (fingerprint changed)', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ checklist: CHECKLIST_P0_NO_EVIDENCE }));

    const first = sentinelCore.evaluateCompletionEvidence({ specFolder: fixture, claimText: CLAIM_TEXT, projectDir });
    const second = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: 'Everything is now finished after the second pass.',
      projectDir,
    });

    expect(first.decision).toBe('advise');
    expect(second.decision).toBe('advise');
  });

  it('kill switch: MK_COMPLETION_SENTINEL_DISABLED=1 makes the core a full no-op', () => {
    projectDir = newProjectDir();
    const fixture = trackFixture(makeFixtureFolder({ checklist: CHECKLIST_P0_NO_EVIDENCE }));
    const spy = vi.spyOn(childProcess, 'execFileSync');

    const result = sentinelCore.evaluateCompletionEvidence({
      specFolder: fixture,
      claimText: CLAIM_TEXT,
      projectDir,
      env: { ...process.env, [sentinelCore.KILL_SWITCH_ENV]: '1' },
    });

    expect(result).toEqual({ decision: 'ok', detail: null, deduped: false });
    expect(spy).not.toHaveBeenCalled();
  });

  it('appendAdvisoryLog writes a bounded, append-only line under .opencode/logs', () => {
    projectDir = newProjectDir();
    mkdirSync(join(projectDir, '.opencode', 'logs'), { recursive: true });

    const ok = sentinelCore.appendAdvisoryLog(projectDir, 'test advisory line');
    expect(ok).toBe(true);

    const { logPath } = sentinelCore.resolveSentinelPaths(projectDir);
    const content = readFileSync(logPath, 'utf8');
    expect(content).toMatch(/test advisory line/);
    expect(content).toMatch(/\[completion-evidence-sentinel\]/);
  });
});
