import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const loopHost = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs',
)) as {
  parseArgs: (argv: string[]) => Record<string, string | boolean>;
  resolveMode: (raw: string | undefined) => string;
  planInvocation: (
    mode: string,
    args: Record<string, string | boolean>,
  ) => { ok: true; steps: Array<{ script: string; args: string[] }> } | { ok: false; error: string };
  resolveScriptPath: (scriptName: string) => string;
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

    it('parses space-form flags from the Lane B command surface (F-P0-1)', () => {
      // The Lane B YAML invokes loop-host with space-separated flags. Before the
      // fix these parsed to boolean true; now each --key followed by a non-flag
      // token consumes that token as the value.
      const args = loopHost.parseArgs(['--profile', 'p.json', '--scorer', '5dim', '--grader', 'noop']);
      expect(args).toEqual({ profile: 'p.json', scorer: '5dim', grader: 'noop' });
    });

    it('keeps a bare flag boolean when followed by another flag', () => {
      const args = loopHost.parseArgs(['--approve', '--scorer', '5dim']);
      expect(args).toEqual({ approve: true, scorer: '5dim' });
    });

    it('keeps a bare flag boolean when it is the final token', () => {
      const args = loopHost.parseArgs(['--scorer', '5dim', '--approve']);
      expect(args).toEqual({ scorer: '5dim', approve: true });
    });

    it('does not alter =-form parsing (TST-1 identity surface)', () => {
      // =-form must stay byte-identical so the TST-1 identity gate holds.
      const args = loopHost.parseArgs(['--candidate=/tmp/cand.md', '--baseline=/tmp/base.md']);
      expect(args).toEqual({ candidate: '/tmp/cand.md', baseline: '/tmp/base.md' });
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

    it('forwards space-form scorer/grader from parseArgs through to run-benchmark (F-P0-1 end to end)', () => {
      // The full Lane B command shape: space-form flags must parse AND then
      // forward to run-benchmark, not collapse to booleans.
      const args = loopHost.parseArgs([
        '--profile', 'p.json',
        '--outputs-dir', '/tmp/o',
        '--scorer', '5dim',
        '--grader', 'noop',
      ]);
      const plan = loopHost.planInvocation('model-benchmark', args);
      expect(plan.ok).toBe(true);
      if (plan.ok) {
        expect(plan.steps[1].script).toBe('run-benchmark.cjs');
        expect(plan.steps[1].args).toEqual(
          expect.arrayContaining(['--scorer', '5dim', '--grader', 'noop']),
        );
      }
    });

    it('forwards --profiles-dir to BOTH materialize and run-benchmark (F-P1-4b)', () => {
      // A profile-by-ID must resolve consistently in both steps, so --profiles-dir
      // has to reach the materializer, not only run-benchmark.
      const plan = loopHost.planInvocation(
        'model-benchmark',
        loopHost.parseArgs(['--profile', 'my-profile-id', '--outputs-dir', '/tmp/o', '--profiles-dir', '/tmp/profiles']),
      );
      expect(plan.ok).toBe(true);
      if (plan.ok) {
        expect(plan.steps[0].script).toBe('materialize-benchmark-fixtures.cjs');
        expect(plan.steps[0].args).toEqual(
          expect.arrayContaining(['--profiles-dir', '/tmp/profiles']),
        );
        expect(plan.steps[1].args).toEqual(
          expect.arrayContaining(['--profiles-dir', '/tmp/profiles']),
        );
      }
    });

    it('forwards --integration-report to run-benchmark (P2 option-schema consolidation)', () => {
      // run-benchmark supports --integration-report; loop-host must forward it
      // rather than silently dropping the runner option.
      const plan = loopHost.planInvocation(
        'model-benchmark',
        loopHost.parseArgs(['--profile=p.json', '--outputs-dir=/tmp/o', '--integration-report=/tmp/integ.json']),
      );
      expect(plan.ok).toBe(true);
      if (plan.ok) {
        expect(plan.steps[1].args).toEqual(
          expect.arrayContaining(['--integration-report', '/tmp/integ.json']),
        );
        // materialize never carries the runner-only integration-report flag
        expect(plan.steps[0].args).not.toContain('--integration-report');
      }
    });
  });

  describe('resolveScriptPath spawn-path mapping (P2 013-lane-sep traceability-3-6)', () => {
    it('maps a Lane A script name to the agent-improvement lane dir', () => {
      const resolved = loopHost.resolveScriptPath('score-candidate.cjs');
      expect(resolved.endsWith(path.join('agent-improvement', 'score-candidate.cjs'))).toBe(true);
      expect(resolved).not.toContain(path.join('model-benchmark', 'score-candidate.cjs'));
    });

    it('maps a Lane B script name to the model-benchmark lane dir', () => {
      const resolved = loopHost.resolveScriptPath('run-benchmark.cjs');
      expect(resolved.endsWith(path.join('model-benchmark', 'run-benchmark.cjs'))).toBe(true);
    });

    it('maps a shared script name to the scripts root (./)', () => {
      const resolved = loopHost.resolveScriptPath('materialize-benchmark-fixtures.cjs');
      // Shared scripts resolve alongside loop-host under scripts/shared/, with no
      // lane segment between the scripts root and the file name.
      expect(resolved.endsWith(path.join('shared', 'materialize-benchmark-fixtures.cjs'))).toBe(true);
      expect(resolved).not.toContain(path.join('agent-improvement', 'materialize-benchmark-fixtures.cjs'));
      expect(resolved).not.toContain(path.join('model-benchmark', 'materialize-benchmark-fixtures.cjs'));
    });
  });
});
