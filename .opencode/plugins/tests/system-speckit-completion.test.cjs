// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: system-speckit-completion Plugin Regression Tests                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the kill-switch contract: the master switch                 ║
// ║          SYSTEM_HOOKS_DISABLED, its older alias MK_HOOKS_DISABLED and    ║
// ║          the plugin's own SYSTEM_SPECKIT_COMPLETION_DISABLED, with any   ║
// ║          truthy value, make the factory return an empty hooks object on  ║
// ║          OpenCode 1 and register no tool on OpenCode 2. Also pins the    ║
// ║          normal registration shape so the early return cannot swallow    ║
// ║          it.                                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const CONFIG_ENV = 'HOOK_FLAGS_CONFIG';
const MASTER_ENV = 'SYSTEM_HOOKS_DISABLED';
const MASTER_ALIAS_ENV = 'MK_HOOKS_DISABLED';
const DISABLED_ENV = 'SYSTEM_SPECKIT_COMPLETION_DISABLED';
const TOUCHED_ENVS = [CONFIG_ENV, MASTER_ENV, MASTER_ALIAS_ENV, DISABLED_ENV];

function loadPlugin() {
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'system-speckit-completion.js')).href;
  return import(pluginUrl);
}

// Drive the OpenCode 2 entry point with a stub context that records every
// registration, so "no tool registered" is observed at the seam the v2 runtime
// actually uses instead of being inferred from the v1 hooks object.
async function v2Registrations(pluginModule) {
  const registrations = [];
  const record = (registration) => (...args) => { registrations.push({ registration, args }); };
  const ctx = {
    location: { directory: __dirname },
    tool: { hook: record('tool.hook'), transform: record('tool.transform') },
    event: { subscribe(...args) { registrations.push({ registration: 'event.subscribe', args }); return (async function* () {})(); } },
    session: { hook: record('session.hook') },
  };
  await pluginModule.default.setup(ctx);
  return registrations;
}

// Set exactly one switch for the duration of `run`, then remove it again so the
// next case starts from the same clean environment.
async function withSwitch(name, value, run) {
  process.env[name] = value;
  try {
    return await run();
  } finally {
    delete process.env[name];
  }
}

function registersTool(registrations) {
  return registrations.some(({ registration }) => registration === 'tool.transform');
}

async function main() {
  // The shared resolver also reads a hook-flags.env file, so point it at a path
  // that cannot exist: only the switch under test may decide the outcome.
  const originalEnv = {};
  for (const name of TOUCHED_ENVS) originalEnv[name] = process.env[name];

  process.env[CONFIG_ENV] = path.join(__dirname, 'no-such-hook-flags.env');
  delete process.env[MASTER_ENV];
  delete process.env[MASTER_ALIAS_ENV];
  delete process.env[DISABLED_ENV];

  try {
    const pluginModule = await loadPlugin();

    // The plugin's own switch: the whole surface must be a full no-op -- no
    // `tool` key at all, not a tool that answers `{status:'disabled'}`.
    await withSwitch(DISABLED_ENV, '1', async () => {
      assert.deepEqual(
        await pluginModule.default.server({ directory: __dirname }),
        {},
        `${DISABLED_ENV}=1 must make the OpenCode 1 factory return an empty hooks object`,
      );
      assert.ok(
        !registersTool(await v2Registrations(pluginModule)),
        `${DISABLED_ENV}=1 must register no tool on OpenCode 2`,
      );
    });

    // Master switch: one export silences every repo-authored hook at once.
    await withSwitch(MASTER_ENV, '1', async () => {
      assert.deepEqual(
        await pluginModule.default.server({ directory: __dirname }),
        {},
        `${MASTER_ENV}=1 must make the OpenCode 1 factory return an empty hooks object`,
      );
      assert.ok(
        !registersTool(await v2Registrations(pluginModule)),
        `${MASTER_ENV}=1 must register no tool on OpenCode 2`,
      );
    });

    // The master switch's pre-rename name stays honored for operators who
    // exported it before the rename.
    await withSwitch(MASTER_ALIAS_ENV, '1', async () => {
      assert.deepEqual(
        await pluginModule.default.server({ directory: __dirname }),
        {},
        `${MASTER_ALIAS_ENV}=1 must make the OpenCode 1 factory return an empty hooks object`,
      );
      assert.ok(
        !registersTool(await v2Registrations(pluginModule)),
        `${MASTER_ALIAS_ENV}=1 must register no tool on OpenCode 2`,
      );
    });

    // A truthy value that is not literally '1' disables too; a `=== '1'` check
    // would silently keep the surface registered.
    await withSwitch(DISABLED_ENV, 'true', async () => {
      assert.deepEqual(
        await pluginModule.default.server({ directory: __dirname }),
        {},
        `${DISABLED_ENV}=true must make the OpenCode 1 factory return an empty hooks object`,
      );
    });

    // No switch set: normal registration must be untouched by the guard.
    const enabledHooks = await pluginModule.default.server({ directory: __dirname });
    assert.ok(
      enabledHooks.tool?.system_speckit_completion,
      'no kill-switch set: the tool namespace must be present',
    );
    assert.equal(
      typeof enabledHooks.tool.system_speckit_completion.execute,
      'function',
      'no kill-switch set: system_speckit_completion must register with a callable execute()',
    );
    assert.ok(
      registersTool(await v2Registrations(pluginModule)),
      'no kill-switch set: OpenCode 2 must receive at least one tool.transform registration',
    );

    // An explicit falsy value must behave as enabled.
    await withSwitch(DISABLED_ENV, '0', async () => {
      assert.ok(
        (await pluginModule.default.server({ directory: __dirname })).tool,
        `${DISABLED_ENV}=0 must not disable registration: a falsy value leaves the tool namespace in place`,
      );
    });

    console.log('system-speckit-completion.test.cjs: all assertions passed');
  } finally {
    for (const name of TOUCHED_ENVS) {
      if (originalEnv[name] === undefined) delete process.env[name];
      else process.env[name] = originalEnv[name];
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
