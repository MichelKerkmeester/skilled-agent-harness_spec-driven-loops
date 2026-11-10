// Drives the real plugin event path (session.idle) with a stub promptAsync, so
// the counter can be read from the plugin's own status output. This is not a
// live OpenCode run: no model is called.
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const pluginPath = fileURLToPath(new URL('../../../../../.opencode/plugins/opencode-goal.js', import.meta.url));
const corePath = fileURLToPath(new URL('../../../../../.opencode/plugins/lib/opencode-goal-core.js', import.meta.url));
const pluginModule = await import(pathToFileURL(pluginPath).href);
const { getGoalCore } = await import(pathToFileURL(corePath).href);
const helpers = getGoalCore(pluginModule.default.server);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run(mode, turns) {
  const stateDir = await mkdtemp(join(tmpdir(), `goal-harness-${mode}-`));
  if (mode === 'on') process.env.OPENCODE_GOAL_AUTONOMY = 'active'; else delete process.env.OPENCODE_GOAL_AUTONOMY;
  const sessionID = `session-harness-${mode}`;
  let sent = 0;
  const client = { session: { async promptAsync() { sent += 1; } } };
  const plugin = await pluginModule.default.server({ client, directory: stateDir }, { stateDir });
  await helpers.executeGoalAction({ action: 'set', objective: 'Reply tick on every turn and never finish' }, { sessionID }, { stateDir, includeInjectionPreview: false });
  for (let turn = 1; turn <= turns; turn += 1) {
    await plugin.event({ event: { type: 'session.status', properties: { sessionID, status: { type: 'idle' } } } });
    await plugin.event({ event: { type: 'session.idle', properties: { sessionID } } });
    await sleep(1700);
  }
  const status = await helpers.executeGoalStatus({ sessionID }, { stateDir, includeInjectionPreview: false });
  const pick = (key) => (status.match(new RegExp(`^${key}=(.*)$`, 'm')) || [])[1];
  console.log(`autonomy=${mode} idle_events=${turns} promptAsync_calls=${sent} status=${pick('status')} continuation_attempts=${pick('continuation_attempts')} continuation_suppressed=${pick('continuation_suppressed')} reason=${pick('continuation_suppressed_reason')}`);
  await helpers.executeGoalAction({ action: 'clear' }, { sessionID }, { stateDir, includeInjectionPreview: false });
  await rm(stateDir, { recursive: true, force: true });
}

await run('off', 3);
await run('on', 12);
