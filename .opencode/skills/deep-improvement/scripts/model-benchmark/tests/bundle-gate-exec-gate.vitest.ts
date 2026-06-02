// ───────────────────────────────────────────────────────────────────
// MODULE: bundle-gate Layer-3 exec gate (fail-closed criteria-exec)
//   bundle-gate Layer-3 execSync must honor DEEP_AGENT_ALLOW_CRITERIA_EXEC,
//   like score-model-variant's deterministic branch. bundle-gate is the D2
//   hard gate, so the "refuse criteria-driven shell execution" guarantee
//   would be false for this path without the shared fail-closed gate.
//
//   Semantics mirror score-model-variant's fail-closed gate:
//     - gate ON (env '1' or 'true'): the smoke-run command executes.
//     - gate OFF (env unset or '0'): the command is REFUSED (no execSync side
//       effect), the layer does not pass, and the score is produced without
//       crashing (hard_gate_failed stays false, so D1 is not short-circuited).
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const require = createRequire(import.meta.url);

const BUNDLE_GATE = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs',
);
const bundleGate = require(BUNDLE_GATE) as {
  scoreOutput: (
    fixture: Record<string, unknown>,
    text: string,
  ) => {
    score: number;
    passed: boolean;
    hard_gate_failed: boolean;
    details: { layer_3: { passed: boolean; hard_gate_failed: boolean; details: Record<string, unknown> } };
  };
};

let work: string;
let cwd: string;
let sentinel: string;
const OUTPUT = '```ts\nexport const ok = true;\n```\n';

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-gate-exec-'));
  // cwd MUST exist on disk so scoreLayer3 reaches the execSync (no env-failure short-circuit).
  cwd = path.join(work, 'cwd');
  fs.mkdirSync(cwd, { recursive: true });
  // The smoke-run command runs with `cwd: cwdAbs`, so a relative `touch` lands here.
  sentinel = path.join(cwd, 'ran.sentinel');
});
afterEach(() => {
  fs.rmSync(work, { recursive: true, force: true });
  delete process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC;
});

// A smoke-run acceptance whose command leaves a filesystem side effect, so the
// test can detect whether the command actually ran (rather than relying on the
// returned layer flags alone). `touch` keeps the command quote-free and runs in
// the fixture cwd, exiting 0.
function fixtureWithSmokeRun() {
  return {
    id: 'fx-exec-gate',
    scope: { cwd },
    acceptance: [{ type: 'smoke-run', command: 'touch ran.sentinel' }],
  };
}

describe('bundle-gate Layer-3 exec gate (fail-closed)', () => {
  it('gate OFF (env unset): fail-closed default REFUSES the smoke-run (no sentinel)', () => {
    delete process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC;
    const r = bundleGate.scoreOutput(fixtureWithSmokeRun(), OUTPUT);
    expect(fs.existsSync(sentinel)).toBe(false); // command refused (fail-closed default)
    expect(r.details.layer_3.passed).toBe(false);
    expect((r.details.layer_3.details as { skipped?: boolean }).skipped).toBe(true);
    expect(r.details.layer_3.hard_gate_failed).toBe(false);
  });

  it("gate ON (env '1'): also runs the smoke-run command", () => {
    process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC = '1';
    const r = bundleGate.scoreOutput(fixtureWithSmokeRun(), OUTPUT);
    expect(fs.existsSync(sentinel)).toBe(true);
    expect(r.details.layer_3.passed).toBe(true);
  });

  it("gate OFF (env '0'): REFUSES execution (no sentinel) and does not crash the score", () => {
    process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC = '0';
    const r = bundleGate.scoreOutput(fixtureWithSmokeRun(), OUTPUT);
    // No execSync side effect: the command never ran.
    expect(fs.existsSync(sentinel)).toBe(false);
    // Layer-3 is refused (does not pass), mirroring score-model-variant's ok=false.
    expect(r.details.layer_3.passed).toBe(false);
    expect((r.details.layer_3.details as { skipped?: boolean }).skipped).toBe(true);
    // The score is still produced without crashing, and the hard gate is NOT tripped.
    expect(r.details.layer_3.hard_gate_failed).toBe(false);
    expect(r.hard_gate_failed).toBe(false);
    expect(typeof r.score).toBe('number');
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(1);
  });

  it('gate OFF with no smoke-run acceptance: unaffected (layer still skip-passes)', () => {
    process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC = '0';
    const r = bundleGate.scoreOutput({ id: 'fx', scope: { cwd }, acceptance: [] }, OUTPUT);
    // No command to refuse, so Layer-3 keeps its existing skip-as-pass behavior.
    expect(r.details.layer_3.passed).toBe(true);
    expect(fs.existsSync(sentinel)).toBe(false);
  });
});
