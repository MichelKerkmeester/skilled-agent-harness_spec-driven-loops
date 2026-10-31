// Plugin-vs-core probe: workspace resolution and packet-budget reporting.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const L = `${ROOT}/specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-2`;
const WS = `${L}/scratch/ws`;
const SUB = `${WS}/sub`;
mkdirSync(SUB, { recursive: true });

const core = require(`${ROOT}/.opencode/hooks/goal/lib/goal-core.cjs`);
const mod = await import(`${ROOT}/.opencode/plugins/opencode-goal.js`);
const t = mod.default.__test;

const result = {};

// 1. Core binds from a subdirectory: resolveRepoRoot walks up, so it succeeds.
try {
  const bound = core.bindGoal(
    { packetPath: 'specs/pkt', runtimeLabel: 'stub' },
    { scope: { runtime: 'stub', sessionId: 'sub-probe', workspace: SUB }, stateDir: `${L}/scratch/state-core-sub` },
  );
  result.coreFromSubdir = { ok: true, storedWorkspace: bound.record.workspace, packetPath: bound.record.packetPath };
} catch (error) {
  result.coreFromSubdir = { ok: false, code: error.code, message: error.message };
}

// 2. Plugin binds from the same subdirectory.
try {
  const bound = await t.bindGoal('sub-probe', 'specs/pkt', { directory: SUB, stateDir: `${L}/scratch/state-plugin-sub` });
  result.pluginFromSubdir = { ok: true, storedWorkspace: bound.workspace, packetPath: bound.packetPath };
} catch (error) {
  result.pluginFromSubdir = { ok: false, code: error.code, message: error.message };
}

// 3. Plugin binds from the repo root, then reports the packet budget.
try {
  const bound = await t.bindGoal('root-probe', 'specs/pkt', { directory: WS, stateDir: `${L}/scratch/state-plugin-root` });
  result.pluginFromRoot = { ok: true, storedWorkspace: bound.workspace, packetPath: bound.packetPath };
  const toolOut = await t.executeGoalAction(
    { action: 'bind', packetPath: 'specs/pkt' },
    { directory: WS },
    { directory: WS, stateDir: `${L}/scratch/state-plugin-root` },
  );
  const packetOut = await t.executeGoalAction(
    { action: 'packet', packetPath: 'specs/pkt' },
    { directory: WS },
    { directory: WS, stateDir: `${L}/scratch/state-plugin-root` },
  );
  result.pluginBindOutput = String(toolOut).split('\n').filter((l) => /packet|budget|warning/.test(l));
  result.pluginPacketOutput = String(packetOut).split('\n').filter((l) => /packet|budget|warning/.test(l));
} catch (error) {
  result.pluginFromRoot = { ok: false, code: error.code, message: error.message };
}

console.log(JSON.stringify(result, null, 2));
