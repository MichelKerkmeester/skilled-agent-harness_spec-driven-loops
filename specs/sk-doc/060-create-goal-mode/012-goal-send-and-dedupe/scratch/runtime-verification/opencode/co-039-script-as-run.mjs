import assert from 'node:assert/strict';
import { access, mkdtemp, rename, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const pluginUrl = pathToFileURL('.skilled/plugins/opencode-goal.js').href;
const stateDir = await mkdtemp(join(tmpdir(), 'co-039-goal-'));
const { default: MkGoalPlugin } = await import(pluginUrl);
const hooks = await MkGoalPlugin({}, { stateDir });
const helpers = MkGoalPlugin.__test;

const A = { sessionID: 'sess-co-039-a' };
const B = { sessionID: 'sess-co-039-b' };

const setA = await hooks.tool.opencode_goal.execute({ action: 'set', objective: 'Ship the CO-039 goal-hook manual-testing scenario', tokenBudget: 500 }, A);
assert.match(setA, /STATUS=OK ACTION=set/);
assert.match(setA, /mutation=created/);

const digestAPath = helpers.goalPathForSession(A.sessionID, { stateDir });
assert.match(basename(digestAPath), /^[a-f0-9]{64}\.json$/);

const legacyAPath = join(stateDir, `${Buffer.from(A.sessionID, 'utf8').toString('hex')}.json`);
await rename(digestAPath, legacyAPath);
const migratedA = await hooks.tool.opencode_goal_status.execute({}, A);
assert.match(migratedA, /goal_present=true/);
await access(digestAPath);
await assert.rejects(access(legacyAPath));

const output = { system: [] };
const systemTransform = hooks['experimental.chat.system.transform'];
await systemTransform({ sessionID: 'sess-co-039-a' }, output);
assert.equal(output.system.length, 1);
assert.match(output.system[0], /^\[active_goal:/);

await hooks.event({ event: { type: 'message.updated', properties: { sessionID: 'sess-co-039-a', info: { id: 'msg-1', tokens: { input: 120, output: 40 } } } } });
const tokenStatus = await hooks.tool.opencode_goal_status.execute({}, A);
assert.match(tokenStatus, /tokens_used=160/);
assert.match(tokenStatus, /usage_source=opencode-native-tokens/);

assert.match(await hooks.tool.opencode_goal_status.execute({}, B), /goal_present=false/);
await hooks.tool.opencode_goal.execute({ action: 'set', objective: 'Session B isolated objective' }, B);
assert.match(await hooks.tool.opencode_goal_status.execute({}, A), /Ship the CO-039 goal-hook manual-testing scenario/);

const longSession = { sessionID: `session-${'s'.repeat(140)}` };
await hooks.tool.opencode_goal.execute({ action: 'set', objective: 'Long native session id remains persistable' }, longSession);
assert.match(basename(helpers.goalPathForSession(longSession.sessionID, { stateDir })), /^[a-f0-9]{64}\.json$/);

const stateFiles = (await readdir(stateDir)).filter((name) => name.endsWith('.json'));
assert.equal(stateFiles.length, 3);
assert.ok(stateFiles.every((name) => /^[a-f0-9]{64}\.json$/.test(name)));

await hooks.tool.opencode_goal.execute({ action: 'pause', reason: 'operator break' }, A);
await hooks.tool.opencode_goal.execute({ action: 'resume' }, A);
await hooks.tool.opencode_goal.execute({ action: 'history' }, A);
await hooks.tool.opencode_goal.execute({ action: 'doctor' }, A);
await hooks.tool.opencode_goal.execute({ action: 'complete' }, A);
await hooks.tool.opencode_goal.execute({ action: 'clear' }, A);

process.env.OPENCODE_GOAL_PLUGIN_DISABLED = '1';
for (const action of ['set', 'show', 'history', 'doctor', 'health', 'pause', 'resume', 'complete', 'clear']) {
  const result = await hooks.tool.opencode_goal.execute(
    action === 'set' ? { action, objective: 'should fail closed' } : { action },
    B,
  );
  assert.match(result, /STATUS=FAIL/);
  assert.match(result, /code=PLUGIN_DISABLED/);
}
delete process.env.OPENCODE_GOAL_PLUGIN_DISABLED;

await rm(stateDir, { recursive: true, force: true });
console.log(JSON.stringify({ verdict: 'PASS', stateFiles, migrated: true, tokensUsed: 160 }));
