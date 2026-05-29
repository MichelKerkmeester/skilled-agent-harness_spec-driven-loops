import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const loopHost = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs',
)) as {
  parseArgs: (argv: string[]) => Record<string, string | boolean>;
  resolveMode: (raw: string | undefined) => string;
  planInvocation: (
    mode: string,
    args: Record<string, string | boolean>,
  ) => { ok: true; steps: Array<{ script: string; args: string[] }> } | { ok: false; error: string };
  VALID_MODES: Set<string>;
};

describe('loop-host', () => {
  describe('resolveMode', () => {
    it('defaults to agent-improvement when mode is absent', () => {
      expect(loopHost.resolveMode(undefined)).toBe('agent-improvement');
    });
    it('passes through known modes', () => {
      expect(loopHost.resolveMode('agent-improvement')).toBe('agent-improvement');
      expect(loopHost.resolveMode('model-benchmark')).toBe('model-benchmark');
    });
    it('falls back to agent-improvement on an unknown mode (EC-2)', () => {
      expect(loopHost.resolveMode('foobar')).toBe('agent-improvement');
    });
  });

  describe('parseArgs', () => {
    it('parses key=value and bare flags', () => {
      const args = loopHost.parseArgs(['--mode=model-benchmark', '--profile=p', '--outputs-dir=d', '--approve']);
      expect(args).toEqual({ mode: 'model-benchmark', profile: 'p', 'outputs-dir': 'd', approve: true });
    });
  });

  describe('TST-1: backward-compat identity gate', () => {
    it('plans a byte-identical invocation for default vs explicit agent-improvement', () => {
      const argv = ['--candidate=/tmp/cand.md', '--baseline=/tmp/base.md', '--output=/tmp/score.json'];

      const defaultArgs = loopHost.parseArgs(argv);
      const defaultPlan = loopHost.planInvocation(loopHost.resolveMode(defaultArgs.mode as string | undefined), defaultArgs);

      const explicitArgs = loopHost.parseArgs(['--mode=agent-improvement', ...argv]);
      const explicitPlan = loopHost.planInvocation(loopHost.resolveMode(explicitArgs.mode as string | undefined), explicitArgs);

      // The whole point of TST-1: the default route and the explicit
      // agent-improvement route must produce the identical underlying command.
      expect(defaultPlan).toEqual(explicitPlan);
      expect(defaultPlan.ok).toBe(true);
      if (defaultPlan.ok) {
        expect(defaultPlan.steps).toEqual([
          { script: 'score-candidate.cjs', args: ['--candidate=/tmp/cand.md', '--baseline=/tmp/base.md', '--output=/tmp/score.json'] },
        ]);
      }
    });

    it('an unknown mode also plans the identical agent-improvement invocation', () => {
      const argv = ['--candidate=/tmp/cand.md'];
      const known = loopHost.planInvocation('agent-improvement', loopHost.parseArgs(argv));
      const unknown = loopHost.planInvocation(loopHost.resolveMode('whoops'), loopHost.parseArgs(['--mode=whoops', ...argv]));
      expect(unknown).toEqual(known);
    });
  });

  describe('agent-improvement planning', () => {
    it('requires --candidate', () => {
      const plan = loopHost.planInvocation('agent-improvement', {});
      expect(plan.ok).toBe(false);
    });
    it('omits optional flags when absent', () => {
      const plan = loopHost.planInvocation('agent-improvement', loopHost.parseArgs(['--candidate=/tmp/c.md']));
      expect(plan).toEqual({ ok: true, steps: [{ script: 'score-candidate.cjs', args: ['--candidate=/tmp/c.md'] }] });
    });
  });

  describe('model-benchmark planning', () => {
    it('plans materialize before run-benchmark (EC-5 ordering)', () => {
      const plan = loopHost.planInvocation(
        'model-benchmark',
        loopHost.parseArgs(['--profile=prof.json', '--outputs-dir=/tmp/out', '--label=x']),
      );
      expect(plan.ok).toBe(true);
      if (plan.ok) {
        expect(plan.steps.map((s) => s.script)).toEqual([
          'materialize-benchmark-fixtures.cjs',
          'run-benchmark.cjs',
        ]);
        expect(plan.steps[0].args).toEqual(['--profile', 'prof.json', '--outputs-dir', '/tmp/out']);
        expect(plan.steps[1].args).toEqual(['--profile', 'prof.json', '--outputs-dir', '/tmp/out', '--label', 'x']);
      }
    });
    it('requires --profile and --outputs-dir', () => {
      expect(loopHost.planInvocation('model-benchmark', loopHost.parseArgs(['--profile=p'])).ok).toBe(false);
    });
    it('forwards --scorer and --grader to run-benchmark (5dim + mock/llm reachable via loop-host)', () => {
      const plan = loopHost.planInvocation(
        'model-benchmark',
        loopHost.parseArgs(['--profile=p.json', '--outputs-dir=/tmp/o', '--scorer=5dim', '--grader=mock']),
      );
      expect(plan.ok).toBe(true);
      if (plan.ok) {
        expect(plan.steps[1].script).toBe('run-benchmark.cjs');
        expect(plan.steps[1].args).toEqual(
          expect.arrayContaining(['--scorer', '5dim', '--grader', 'mock']),
        );
        // materialize never carries scorer/grader
        expect(plan.steps[0].args).not.toContain('--scorer');
      }
    });
  });
});
