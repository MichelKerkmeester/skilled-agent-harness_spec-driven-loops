// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-deep-loop-guard Regression Tests                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the plugin's export shape and the tool.execute.before hook  ║
// ║          logic (warn/reject toggle, fail-open, non-deep passthrough)    ║
// ║          against a hermetic fixture registry -- no live OpenCode        ║
// ║          session required.                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const REJECT_ENV = 'MK_DEEP_LOOP_GUARD_REJECT';

function writeFixtureRegistry(dir) {
  const registryDir = path.join(dir, '.opencode', 'skills', 'deep-loop-workflows');
  fs.mkdirSync(registryDir, { recursive: true });
  fs.writeFileSync(
    path.join(registryDir, 'mode-registry.json'),
    JSON.stringify({
      modes: [
        { workflowMode: 'ai-council', agent: 'ai-council' },
        { workflowMode: 'research', agent: 'deep-research' },
      ],
    }),
  );
}

async function loadPlugin() {
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-deep-loop-guard.js')).href;
  return import(pluginUrl);
}

async function main() {
  const pluginModule = await loadPlugin();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default, 'function');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mk-deep-loop-guard-'));
  writeFixtureRegistry(tmpDir);
  const hooks = await pluginModule.default({ directory: tmpDir });
  const beforeHook = hooks['tool.execute.before'];
  assert.equal(typeof beforeHook, 'function');

  delete process.env[REJECT_ENV];

  // Non-task tool: no-op, no throw.
  await beforeHook({ tool: 'read' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research' } });

  // Unknown subagent_type: no-op, no throw.
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'not-a-real-agent', prompt: 'mode=research' } });

  // Matching mode: no-op, no throw.
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=ai-council do the thing' } });

  // No mode declared in the prompt at all: no-op, no throw (absence, not disagreement).
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'do the thing' } });

  // Mismatch, warn mode (default): logs, does not throw.
  let warned = '';
  const originalError = console.error;
  console.error = (msg) => { warned = String(msg); };
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } });
  console.error = originalError;
  assert.match(warned, /mk-deep-loop-guard.*mode mismatch/i);

  // Mismatch, reject mode: throws.
  process.env[REJECT_ENV] = '1';
  await assert.rejects(
    () => beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } }),
    /mk-deep-loop-guard: Deep Route mode mismatch/,
  );
  delete process.env[REJECT_ENV];

  // Fail-open: registry unreadable, mismatch present, reject mode on -- must not throw.
  fs.rmSync(path.join(tmpDir, '.opencode', 'skills', 'deep-loop-workflows', 'mode-registry.json'));
  process.env[REJECT_ENV] = '1';
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } });
  delete process.env[REJECT_ENV];

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('mk-deep-loop-guard.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
