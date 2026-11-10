import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const { runFleetEnablement, FLEET_MODE_ORDER } = await import('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/index.ts');

const dir = mkdtempSync(join(tmpdir(), 'resume-loss-'));
const statePath = join(dir, 'state.json');

// Run A: first mode succeeds, second fails.
const first = FLEET_MODE_ORDER[0], second = FLEET_MODE_ORDER[1], third = FLEET_MODE_ORDER[2];
await runFleetEnablement({ statePath, dryRun: false, runStep: async (m) => ({
  mode: m, ok: m !== second, failedCheck: m === second ? 'parity' : null, reason: m === second ? 'injected' : null })});
const afterA = JSON.parse(readFileSync(statePath, 'utf8'));
console.log('after run A  completedModes =', JSON.stringify(afterA.completedModes));

// Run B: resume. second now succeeds, third fails.
await runFleetEnablement({ statePath, dryRun: false, runStep: async (m) => ({
  mode: m, ok: m !== third, failedCheck: m === third ? 'parity' : null, reason: m === third ? 'injected' : null })});
const afterB = JSON.parse(readFileSync(statePath, 'utf8'));
console.log('after run B  completedModes =', JSON.stringify(afterB.completedModes));

const lost = !afterB.completedModes.includes(first);
console.log(lost
  ? `\nCONFIRMED: '${first}' completed in run A and is ABSENT from the state after run B.`
  : `\nNOT REPRODUCED: '${first}' survived.`);

// Run C: what does a third run now plan?
const r3 = await runFleetEnablement({ statePath, dryRun: true, runStep: async () => { throw new Error('x'); } });
console.log('run C would re-plan:', JSON.stringify(r3.plannedModes.slice(0, 3)), '...');
console.log(r3.plannedModes.includes(first)
  ? `RE-PLANS '${first}' — a mode whose authority already moved.`
  : `does not re-plan '${first}'.`);
