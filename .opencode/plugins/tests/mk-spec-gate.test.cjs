// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-spec-gate Regression Tests                                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the OpenCode adapter's kill-switch ordering contract --      ║
// ║          MK_SPEC_GATE_DISABLED=1 must be checked BEFORE                  ║
// ║          experimental.chat.system.transform reads or mutates `output`    ║
// ║          at all, so the kill-switch is a genuine full no-op rather than  ║
// ║          a no-question no-op that still normalizes output.system. Also   ║
// ║          pins that the hook still behaves normally (normalize + inject)  ║
// ║          when the kill-switch is off. Hermetic: no live OpenCode         ║
// ║          session required.                                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');

const DISABLED_ENV = 'MK_SPEC_GATE_DISABLED';
const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-spec-gate.js')).href;

function loadPlugin() {
  return import(pluginUrl);
}

function makeProjectDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'mk-spec-gate-test-'));
}

async function withEnv(key, value, fn) {
  const previous = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
}

test('kill switch is a full no-op: chat.system.transform never reads or mutates output before checking MK_SPEC_GATE_DISABLED', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    await withEnv(DISABLED_ENV, '1', async () => {
      const hooks = await MkSpecGatePlugin({ directory: projectDir });

      // output.system starts as a non-array sentinel. If the kill switch were
      // checked AFTER the normalize line (the pre-fix ordering), this would
      // be silently coerced to [] even though the plugin is fully disabled.
      const output = { system: 'not-an-array-sentinel' };
      await hooks['experimental.chat.system.transform']({ prompt: 'fix the login bug' }, output);

      assert.equal(
        output.system,
        'not-an-array-sentinel',
        'a disabled plugin must not touch output.system at all',
      );
    });
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test('kill switch is a full no-op even when output is missing/malformed', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    await withEnv(DISABLED_ENV, '1', async () => {
      const hooks = await MkSpecGatePlugin({ directory: projectDir });
      // Must not throw even though `output` is undefined -- the disabled
      // check returns before the `!output` guard ever runs.
      await assert.doesNotReject(
        hooks['experimental.chat.system.transform']({ prompt: 'fix the login bug' }, undefined),
      );
    });
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test('kill switch off: chat.system.transform still normalizes output.system and injects the question', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    await withEnv(DISABLED_ENV, undefined, async () => {
      const hooks = await MkSpecGatePlugin({ directory: projectDir });

      const output = {};
      await hooks['experimental.chat.system.transform']({ prompt: 'fix the login bug' }, output);

      assert.ok(Array.isArray(output.system), 'output.system must be normalized to an array when the plugin is enabled');
      assert.ok(
        output.system.some((line) => typeof line === 'string' && line.includes('SPEC FOLDER QUESTION')),
        'the bounded Gate-3 question must be injected when a turn triggers mutation intent',
      );
    });
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P1 fix: the real chat.system.transform input is `{ sessionID?, model }` --
// no prompt field ever exists on it. extractPrompt(input) alone can never
// find a prompt in production, so the gate could never open on OpenCode. The
// fix best-effort fetches the session's last user message via ctx.client.
// ─────────────────────────────────────────────────────────────────────────────

test('P1 fix: a ctx.client stub returning a Gate-3-triggering user message opens the gate on the OpenCode classify surface', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    const sessionID = 'client-fallback-session';
    const ctx = {
      directory: projectDir,
      client: {
        session: {
          messages: async ({ path: p, query }) => {
            assert.equal(p.id, sessionID, 'must query messages for the resolved session ID');
            assert.equal(query.directory, projectDir);
            return {
              data: [
                { info: { role: 'user' }, parts: [{ type: 'text', text: 'fix the login bug' }] },
              ],
            };
          },
        },
      },
    };
    const hooks = await MkSpecGatePlugin(ctx);

    // No `prompt` field anywhere on input -- matches the real typed shape
    // `{ sessionID?, model }`. If extractPrompt(input) were the only prompt
    // source (the pre-fix bug), output.system would stay empty.
    const output = {};
    await hooks['experimental.chat.system.transform']({ sessionID, model: { id: 'stub' } }, output);

    assert.ok(Array.isArray(output.system));
    assert.ok(
      output.system.some((line) => typeof line === 'string' && line.includes('SPEC FOLDER QUESTION')),
      'the ctx.client fallback must surface the last user message and open the gate',
    );
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test('P1 fix: a ctx.client throw fails OPEN -- no question injected, no throw propagates', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    const ctx = {
      directory: projectDir,
      client: {
        session: {
          messages: async () => { throw new Error('transport unavailable'); },
        },
      },
    };
    const hooks = await MkSpecGatePlugin(ctx);

    const output = {};
    await assert.doesNotReject(
      hooks['experimental.chat.system.transform']({ sessionID: 'client-throw-session' }, output),
    );
    assert.ok(Array.isArray(output.system));
    assert.equal(
      output.system.length,
      0,
      'a ctx.client throw must resolve to "no prompt found": no question injected, gate stays closed (allow)',
    );
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test('P1 fix: no real session (no sessionID on input) never attempts the ctx.client fetch and stays closed', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    let called = false;
    const ctx = {
      directory: projectDir,
      client: { session: { messages: async () => { called = true; return { data: [] }; } } },
    };
    const hooks = await MkSpecGatePlugin(ctx);

    const output = {};
    await hooks['experimental.chat.system.transform']({}, output);

    assert.equal(called, false, 'without a real session ID there is nothing to query -- the fallback must not fire');
    assert.deepEqual(output.system, []);
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 fix: classify and enforce must key a missing sessionID under the SAME
// fallback. Neither hook input below carries a sessionID at all.
// ─────────────────────────────────────────────────────────────────────────────

test('P2 fix: classify and enforce key an absent sessionID under the same fallback -- enforce sees what classify opened', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    await withEnv('MK_SPEC_GATE_ENFORCE', '1', async () => {
      const hooks = await MkSpecGatePlugin({ directory: projectDir });

      // No sessionID anywhere on this input -- exercises the no-session
      // fallback on the classify surface. Uses the `prompt` field directly
      // (not the ctx.client fallback) since a no-session turn correctly never
      // attempts a ctx.client fetch (see the "never attempts the ctx.client
      // fetch" test above) -- this test isolates the session-key fallback
      // itself, independent of the P1 ctx.client fix.
      const output = {};
      await hooks['experimental.chat.system.transform']({ prompt: 'fix the login bug' }, output);
      assert.ok(
        output.system.some((line) => typeof line === 'string' && line.includes('SPEC FOLDER QUESTION')),
        'classify must open the gate for the no-session turn',
      );

      fs.mkdirSync(path.join(projectDir, 'src'), { recursive: true });
      fs.writeFileSync(path.join(projectDir, 'src', 'login.ts'), '// placeholder\n');

      // No sessionID on this input either. If classify and enforce resolved
      // the missing session to two different fallback strings, enforce would
      // read a never-opened state here and allow instead of deny.
      await assert.rejects(
        hooks['tool.execute.before']({ tool: 'write' }, { args: { filePath: 'src/login.ts' } }),
        /mk-spec-gate:/,
        'enforce must see the same no-session gate state classify opened, and deny',
      );
    });
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 highest-blast proof: MK_SPEC_GATE_ENFORCE unset never denies a Write/Edit
// through the real OpenCode adapter surface, even once the P1 fix lets the
// classify path actually open the gate via ctx.client.
// ─────────────────────────────────────────────────────────────────────────────

test('MK_SPEC_GATE_ENFORCE unset: no Write/Edit is ever denied through the OpenCode adapter, even after classify opens the gate', async () => {
  const { default: MkSpecGatePlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    await withEnv('MK_SPEC_GATE_ENFORCE', undefined, async () => {
      const sessionID = 'enforce-unset-session';
      const ctx = {
        directory: projectDir,
        client: {
          session: {
            messages: async () => ({
              data: [
                { info: { role: 'user' }, parts: [{ type: 'text', text: 'implement the export pipeline' }] },
              ],
            }),
          },
        },
      };
      const hooks = await MkSpecGatePlugin(ctx);

      await hooks['experimental.chat.system.transform']({ sessionID }, {});

      fs.mkdirSync(path.join(projectDir, 'src'), { recursive: true });
      fs.writeFileSync(path.join(projectDir, 'src', 'login.ts'), '// placeholder\n');

      for (const tool of ['write', 'edit']) {
        await assert.doesNotReject(
          hooks['tool.execute.before']({ tool, sessionID }, { args: { filePath: 'src/login.ts' } }),
          `${tool} must never deny while MK_SPEC_GATE_ENFORCE is unset`,
        );
      }
    });
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});
