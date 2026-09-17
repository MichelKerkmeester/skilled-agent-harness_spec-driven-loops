// -----------------------------------------------------------------------------
// MODULE: Skill Advisor CLI Exit-Taxonomy Tests
// -----------------------------------------------------------------------------
// Proves the documented exit taxonomy end to end through the .opencode/bin shim:
// each runnable case invokes the real front door and reads its numeric exit code
// plus its JSON envelope. The two reserved codes are asserted at the constant,
// because forcing a protocol mismatch or a daemon kill would disturb shared state.

import { afterEach, describe, expect, it } from 'vitest';

import { __testing } from '../skill-advisor-cli.js';
import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  parseJsonOutput,
  runSkillAdvisorShim,
  type CliRunResult,
  type IsolatedCliScope,
} from './skill-advisor-cli-test-utils.js';

interface Envelope {
  readonly status?: string;
}

const scopes: IsolatedCliScope[] = [];

function makeScope(label: string): IsolatedCliScope {
  const scope = createIsolatedCliScope(label);
  scopes.push(scope);
  return scope;
}

function parseStatusEnvelope(run: CliRunResult): Envelope {
  const payload = parseJsonOutput<Envelope>(run);
  expect(typeof payload.status).toBe('string');
  return payload;
}

afterEach(async () => {
  while (scopes.length > 0) {
    const scope = scopes.pop();
    if (scope) await cleanupSkillAdvisorScope(scope);
  }
});

describe('skill-advisor CLI exit taxonomy', () => {
  it('exits 0 with an ok envelope for a successful advisor_recommend', () => {
    const scope = makeScope('exit-0-recommend');
    const run = runSkillAdvisorShim([
      'advisor_recommend',
      '--json',
      JSON.stringify({ prompt: 'commit my changes and open a pull request' }),
      '--format',
      'json',
      '--timeout-ms',
      '120000',
    ], scope.env, { timeoutMs: 120_000 });

    expect(run.exitCode, run.stderr).toBe(0);
    expect(parseStatusEnvelope(run).status).toBe('ok');
  }, 120_000);

  it('exits 64 with an error envelope for an unknown command name', () => {
    const scope = makeScope('exit-64-unknown');
    const run = runSkillAdvisorShim(['advisor_nonexistent', '--format', 'json'], scope.env, { timeoutMs: 30_000 });

    expect(run.exitCode, run.stderr).toBe(64);
    expect(parseStatusEnvelope(run).status).toBe('error');
  });

  it('exits 64 with an error envelope when advisor_status omits workspaceRoot', () => {
    const scope = makeScope('exit-64-missing-root');
    const run = runSkillAdvisorShim(['advisor_status', '--format', 'json'], scope.env, { timeoutMs: 30_000 });

    expect(run.exitCode, run.stderr).toBe(64);
    expect(parseStatusEnvelope(run).status).toBe('error');
  });

  it('reserves exit 69 for protocol disagreement without forcing a version mismatch', () => {
    expect(__testing.EXIT_PROTOCOL).toBe(69);
  });

  it('reserves exit 75 for retryable daemon errors without killing the daemon', () => {
    expect(__testing.EXIT_RETRYABLE).toBe(75);
  });
});
