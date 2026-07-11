// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-speckit-completion Plugin Regression Tests                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the kill-switch contract (P2 fix): setting                  ║
// ║          MK_SPECKIT_COMPLETION_DISABLED=1 must make the plugin factory   ║
// ║          return an empty hooks object -- the tool is never registered   ║
// ║          at all -- rather than a registered tool whose payload merely    ║
// ║          reports `disabled`. Also pins the normal (enabled) registration ║
// ║          shape so the early-return branch cannot silently swallow it.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const DISABLED_ENV = 'MK_SPECKIT_COMPLETION_DISABLED';

function loadPlugin() {
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-speckit-completion.js')).href;
  return import(pluginUrl);
}

async function main() {
  const originalEnvValue = process.env[DISABLED_ENV];

  try {
    // Kill-switch ON: the whole surface must be a full no-op -- no `tool`
    // key at all, not just a tool that answers `{status:'disabled'}`.
    process.env[DISABLED_ENV] = '1';
    const pluginModule = await loadPlugin();
    const disabledHooks = await pluginModule.default({ directory: __dirname });
    assert.deepEqual(
      disabledHooks,
      {},
      'kill-switch must return an empty plugin object so the tool is never registered',
    );

    // Kill-switch OFF: normal registration must be untouched by the new guard.
    delete process.env[DISABLED_ENV];
    const enabledHooks = await pluginModule.default({ directory: __dirname });
    assert.ok(enabledHooks.tool, 'tool namespace must be present when the kill-switch is unset');
    assert.equal(
      typeof enabledHooks.tool.mk_speckit_completion.execute,
      'function',
      'mk_speckit_completion must register with a callable execute()',
    );

    // Kill-switch explicitly not '1' (e.g. '0') must also behave as enabled.
    process.env[DISABLED_ENV] = '0';
    const zeroValueHooks = await pluginModule.default({ directory: __dirname });
    assert.ok(zeroValueHooks.tool, 'a non-"1" kill-switch value must not disable registration');

    console.log('mk-speckit-completion.test.cjs: all assertions passed');
  } finally {
    if (originalEnvValue === undefined) delete process.env[DISABLED_ENV];
    else process.env[DISABLED_ENV] = originalEnvValue;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
