// ───────────────────────────────────────────────────────────────────
// MODULE: Fleet Enablement Tests
// ───────────────────────────────────────────────────────────────────

// The driver's job is to move authority one mode at a time and never
// to move it twice, so these tests assert on what it actually did —
// which modes it called, in what order, and what is on disk at each
// point — rather than on what it reports having done.

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  FLEET_MODE_ORDER,
  deriveModeSurfaceSet,
  deriveAllModeSurfaceSets,
  readEnablementState,
  runFleetEnablement,
} from '../../lib/fleet-enablement/index.js';

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function freshStatePath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fleet-enablement-unit-'));
  tempDirs.push(dir);
  return join(dir, 'state.json');
}

type StepOutcome = {
  mode: string;
  ok: boolean;
  failedCheck: string | null;
  reason: string | null;
};

function makeRecorder(failing: Map<string, { failedCheck: string | null; reason: string | null }>) {
  const calls: string[] = [];
  const runStep = async (mode: string): Promise<StepOutcome> => {
    calls.push(mode);
    const fail = failing.get(mode);
    if (fail) {
      return { mode, ok: false, failedCheck: fail.failedCheck, reason: fail.reason };
    }
    return { mode, ok: true, failedCheck: null, reason: null };
  };
  return { runStep, calls };
}

const fixedNow = () => new Date('2026-08-19T00:00:00.000Z');

describe('fleet mode surface map', () => {
  it('excludes the already-enabled pilot mode', () => {
    expect(FLEET_MODE_ORDER).not.toContain('deep-research');
  });

  it('fixes the mode order as data', () => {
    expect(FLEET_MODE_ORDER).toEqual([
      'deep-review',
      'deep-ai-council',
      'deep-improvement-common',
      'agent-improvement',
      'model-benchmark',
      'skill-benchmark',
      'deep-alignment',
    ]);
  });

  it('rejects a mode it does not recognise', () => {
    expect(() => deriveModeSurfaceSet('not-a-mode')).toThrow(TypeError);
  });

  it('gives every fleet mode at least one surface', () => {
    // A mode with no manifest entry is not a mode with nothing to
    // project, it is a mode whose legacy consumers would silently
    // stop being maintained.
    for (const mode of FLEET_MODE_ORDER) {
      expect(deriveModeSurfaceSet(mode).surfaceIds.length).toBeGreaterThan(0);
    }
  });

  it('flags a mode whose projectable set is empty', () => {
    // A reader contract over an empty projectable set passes without
    // checking anything, so that emptiness has to be visible rather
    // than read as a real pass.
    const skillBenchmark = deriveModeSurfaceSet('skill-benchmark');
    expect(skillBenchmark.hasProjectableSurface).toBe(false);
    expect(skillBenchmark.projectableSurfaceIds).toEqual([]);

    const deepReview = deriveModeSurfaceSet('deep-review');
    expect(deepReview.hasProjectableSurface).toBe(true);
  });

  it('names the modes that share a surface prefix', () => {
    const common = deriveModeSurfaceSet('deep-improvement-common');
    const agent = deriveModeSurfaceSet('agent-improvement');
    expect(common.sharedWith).toEqual(['agent-improvement']);
    expect(agent.sharedWith).toEqual(['deep-improvement-common']);
  });

  it('derives one set per fleet mode in order', () => {
    const modes = deriveAllModeSurfaceSets().map((s) => s.mode);
    expect(modes).toEqual(FLEET_MODE_ORDER);
  });
});

describe('fleet enablement driver', () => {

  it("keeps an earlier run's completions when a later run resumes", async () => {
    const dir = mkdtempSync(join(tmpdir(), 'fleet-enablement-'));
    try {
      const stateFile = join(dir, 'state.json');

      const step = (failIndex: number) => {
        let index = 0;
        return async (_mode: string) => {
          index += 1;
          if (index !== failIndex) {
            return { ok: true };
          }
          return { ok: false, check: 'parity', reason: 'parity mismatch' };
        };
      };

      await runFleetEnablement({
        statePath: stateFile,
        dryRun: false,
        runStep: step(2),
      });
      let persisted = JSON.parse(readFileSync(stateFile, 'utf8')) as {
        completedModes: string[];
      };
      expect(persisted.completedModes).toEqual([FLEET_MODE_ORDER[0]]);

      const second = await runFleetEnablement({
        statePath: stateFile,
        dryRun: false,
        runStep: step(2),
      });
      persisted = JSON.parse(readFileSync(stateFile, 'utf8')) as {
        completedModes: string[];
      };
      expect(persisted.completedModes).toEqual([
        FLEET_MODE_ORDER[0],
        FLEET_MODE_ORDER[1],
      ]);
      expect(second.completedModes).toEqual([FLEET_MODE_ORDER[1]]);
      // The state file is the durable record of which modes have already moved
      // authority; a resumed run that persisted only its own progress would let
      // a later run re-move a mode.
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('does not re-plan a mode an earlier run completed', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'fleet-enablement-'));
    try {
      const stateFile = join(dir, 'state.json');

      const step = (failIndex: number) => {
        let index = 0;
        return async (_mode: string) => {
          index += 1;
          if (index !== failIndex) {
            return { ok: true };
          }
          return { ok: false, check: 'parity', reason: 'parity mismatch' };
        };
      };

      await runFleetEnablement({
        statePath: stateFile,
        dryRun: false,
        runStep: step(2),
      });
      await runFleetEnablement({
        statePath: stateFile,
        dryRun: false,
        runStep: step(2),
      });

      const third = await runFleetEnablement({
        statePath: stateFile,
        dryRun: true,
        runStep: async () => {
          throw new Error('must not be executed in dry run');
        },
      });

      expect(third.completedModes).toEqual([]);
      expect(third.plannedModes).not.toContain(FLEET_MODE_ORDER[0]);
      expect(third.plannedModes).not.toContain(FLEET_MODE_ORDER[1]);
      expect(third.plannedModes).toContain(FLEET_MODE_ORDER[2]);
      expect(third.skippedModes).toContain(FLEET_MODE_ORDER[0]);
      expect(third.skippedModes).toContain(FLEET_MODE_ORDER[1]);
      // Authority moves irreversibly, so re-planning a completed mode is the
      // failure this state file exists to prevent.
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
  it('invokes nothing during a dry run', async () => {
    const statePath = freshStatePath();
    const { runStep, calls } = makeRecorder(new Map());
    const result = await runFleetEnablement({
      statePath,
      dryRun: true,
      runStep,
      now: fixedNow,
    });
    expect(result.dryRun).toBe(true);
    expect(calls.length).toBe(0);
  });

  it('writes no state file during a dry run', async () => {
    const statePath = freshStatePath();
    const { runStep } = makeRecorder(new Map());
    await runFleetEnablement({
      statePath,
      dryRun: true,
      runStep,
      now: fixedNow,
    });
    expect(existsSync(statePath)).toBe(false);
  });

  it('plans every mode when nothing has run', async () => {
    const statePath = freshStatePath();
    const { runStep } = makeRecorder(new Map());
    const result = await runFleetEnablement({
      statePath,
      dryRun: true,
      runStep,
      now: fixedNow,
    });
    expect(result.plannedModes).toEqual(FLEET_MODE_ORDER);
    expect(result.untouchedModes).toEqual(result.plannedModes);
    expect(result.completedModes).toEqual([]);
  });

  it('stops at the first failing mode and names the failing check', async () => {
    const statePath = freshStatePath();
    const failing = new Map();
    failing.set('deep-improvement-common', { failedCheck: 'parity', reason: null });
    const { runStep } = makeRecorder(failing);
    const result = await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep,
      now: fixedNow,
    });
    expect(result.failure?.mode).toBe('deep-improvement-common');
    expect(result.failure?.check).toBe('parity');
    expect(result.completedModes).toEqual(['deep-review', 'deep-ai-council']);
  });

  it('never invokes a mode after the failure', async () => {
    const statePath = freshStatePath();
    const failing = new Map();
    failing.set('deep-improvement-common', { failedCheck: 'parity', reason: null });
    const { runStep, calls } = makeRecorder(failing);
    await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep,
      now: fixedNow,
    });
    expect(calls).toEqual(['deep-review', 'deep-ai-council', 'deep-improvement-common']);
  });

  it('reports the modes it did not touch', async () => {
    const statePath = freshStatePath();
    const failing = new Map();
    failing.set('deep-improvement-common', { failedCheck: 'parity', reason: null });
    const { runStep } = makeRecorder(failing);
    const result = await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep,
      now: fixedNow,
    });
    expect(result.untouchedModes).toEqual([
      'agent-improvement',
      'model-benchmark',
      'skill-benchmark',
      'deep-alignment',
    ]);
  });

  it('defaults the recorded check when the step does not name one', async () => {
    const statePath = freshStatePath();
    const failing = new Map();
    failing.set('model-benchmark', { failedCheck: null, reason: null });
    const { runStep } = makeRecorder(failing);
    const result = await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep,
      now: fixedNow,
    });
    expect(result.failure?.check).toBe('flip');
    const reason = result.failure?.reason ?? '';
    expect(reason.length).toBeGreaterThan(0);
  });

  it('persists progress after every success', async () => {
    const statePath = freshStatePath();
    const failing = new Map();
    // The third mode reads state from inside its own call.
    let captured: string[] | null = null;
    const calls: string[] = [];
    const runStep = async (mode: string): Promise<StepOutcome> => {
      calls.push(mode);
      if (mode === 'deep-improvement-common') {
        const raw = readFileSync(statePath, 'utf-8');
        const parsed = JSON.parse(raw) as { completedModes: string[] };
        captured = parsed.completedModes;
      }
      return { mode, ok: true, failedCheck: null, reason: null };
    };
    await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep,
      now: fixedNow,
    });
    // Progress has to be durable at the moment a run dies, not written
    // once at the end.
    expect(captured).toEqual(['deep-review', 'deep-ai-council']);
  });

  it('resumes without re-running completed modes', async () => {
    const statePath = freshStatePath();
    const prior = {
      version: 1,
      completedModes: ['deep-review', 'deep-ai-council'],
      failure: null,
      updatedAt: fixedNow().toISOString(),
    };
    writeFileSync(statePath, JSON.stringify(prior), 'utf-8');
    const failing = new Map();
    failing.set('deep-review', { failedCheck: 'parity', reason: null });
    failing.set('deep-ai-council', { failedCheck: 'parity', reason: null });
    const { runStep, calls } = makeRecorder(failing);
    const result = await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep,
      now: fixedNow,
    });
    expect(result.skippedModes).toEqual(['deep-review', 'deep-ai-council']);
    expect(calls).not.toContain('deep-review');
    expect(calls).not.toContain('deep-ai-council');
    expect(result.plannedModes).toEqual([
      'deep-improvement-common',
      'agent-improvement',
      'model-benchmark',
      'skill-benchmark',
      'deep-alignment',
    ]);
  });

  it('requests exactly one mode per call', async () => {
    const statePath = freshStatePath();
    const { runStep, calls } = makeRecorder(new Map());
    const result = await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep,
      now: fixedNow,
    });
    // The coordinator rejects a multi-mode request outright, so a
    // driver that ever batched modes would be building a request that
    // can only be refused.
    for (const call of calls) {
      expect(typeof call).toBe('string');
    }
    expect(calls.length).toBe(result.plannedModes.length);
  });

  it('refuses a state file that is not valid JSON', () => {
    const statePath = freshStatePath();
    writeFileSync(statePath, '{not json', 'utf-8');
    expect(() => readEnablementState(statePath)).toThrow(TypeError);
  });

  it('refuses a state file from an unexpected version', () => {
    const statePath = freshStatePath();
    writeFileSync(statePath, JSON.stringify({ version: 2, completedModes: [] }), 'utf-8');
    expect(() => readEnablementState(statePath)).toThrow(TypeError);
  });

  it('refuses a state file whose completed list is not a list', () => {
    const statePath = freshStatePath();
    writeFileSync(statePath, JSON.stringify({ version: 1, completedModes: 'oops' }), 'utf-8');
    // Silently reading a mis-shaped file as "nothing completed" would
    // re-run modes whose authority already moved.
    expect(() => readEnablementState(statePath)).toThrow(TypeError);
  });

  it('refuses a state file whose failure field is a list', () => {
    const statePath = freshStatePath();
    writeFileSync(
      statePath,
      JSON.stringify({ version: 1, completedModes: [], failure: [] }),
      'utf-8',
    );
    expect(() => readEnablementState(statePath)).toThrow(TypeError);
  });

  it('reads a missing state file as nothing having run', () => {
    const statePath = freshStatePath();
    expect(readEnablementState(statePath)).toBeNull();
  });

  it('refuses to resume from a corrupt state rather than starting over', async () => {
    const statePath = freshStatePath();
    writeFileSync(statePath, '{not json', 'utf-8');
    const { runStep } = makeRecorder(new Map());
    await expect(
      runFleetEnablement({ statePath, dryRun: false, runStep, now: fixedNow }),
    ).rejects.toThrow();
  });
});