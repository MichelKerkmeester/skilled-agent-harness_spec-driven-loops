'use strict';

// A consumer project may expose the source tree as .skilled, as .opencode, or not at all.
// Three plugins read files from that tree: the dispatch guard reads a packet's hard rules,
// the git preflight reads sk-git's rules, and the Codex watchdog runs the hook installer.
// Each once joined `.skilled` onto the project root, so in a project carrying only the
// legacy name the guard found no rules and let a blocked dispatch through, and the other
// two went silent. These tests build each layout and check the plugin reaches the file.

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const PLUGIN_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(PLUGIN_DIR, '..', '..');
const SOURCE_NAMES = ['.skilled', '.opencode'];

// A run started from a git hook inherits GIT_DIR and its siblings, which would aim the
// fixtures' git calls at the enclosing repository.
for (const name of Object.keys(process.env)) if (name.startsWith('GIT_')) delete process.env[name];

const BLOCKING_PACKET = [
  '---',
  'name: cli-opencode',
  'hard_rules:',
  '  - id: no-bare-agent-general',
  '    check: no-bare-agent-general',
  '    message: "fixture rule that blocks"',
  '    severity: block',
  '---',
  '# Fixture',
  '',
].join('\n');

function consumer(sourceName, files = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-source-root-')));
  execFileSync('git', ['init', '-q', root], { stdio: 'ignore' });
  const write = (relative, content) => {
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    fs.writeFileSync(path.join(root, relative), content);
  };
  if (sourceName) {
    write(`${sourceName}/skills/system-spec-kit/SKILL.md`, '# sentinel\n');
    for (const [relative, content] of Object.entries(files)) write(`${sourceName}/${relative}`, content);
  }
  return root;
}

async function load(pluginFile, directory) {
  const plugin = await import(pathToFileURL(path.join(PLUGIN_DIR, pluginFile)).href);
  return plugin.default({ directory });
}

for (const sourceName of SOURCE_NAMES) {
  test(`dispatch guard blocks by the packet's rules when the project carries only ${sourceName}`, async () => {
    const root = consumer(sourceName, {
      'skills/cli-external-orchestration/cli-opencode/SKILL.md': BLOCKING_PACKET,
    });
    try {
      const hooks = await load('cli-dispatch-audit.js', root);
      await assert.rejects(
        hooks['tool.execute.before']({ tool: 'bash', args: { command: 'opencode run -m p/m --agent general "x" </dev/null' } }),
        /Dispatch blocked by cli-opencode/,
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test(`git preflight reads sk-git's rules when the project carries only ${sourceName}`, async () => {
    const skillDoc = fs.readFileSync(path.join(REPO_ROOT, '.skilled', 'skills', 'sk-git', 'SKILL.md'), 'utf8');
    const root = consumer(sourceName, { 'skills/sk-git/SKILL.md': skillDoc });
    try {
      const hooks = await load('sk-git-preflight-advisory.js', root);
      await hooks['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git add no-such-file.txt' } });
      const output = { system: [] };
      await hooks['experimental.chat.system.transform']({}, output);
      assert.match(output.system.join('\n'), /add-pathspec-matches-nothing|matches no files/);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test(`Codex watchdog runs the installer when the project carries only ${sourceName}`, async () => {
    const root = consumer(sourceName, {
      'bin/install-codex-hooks.mjs': "import fs from 'node:fs';\nfs.writeFileSync('installer-ran', process.argv.slice(2).join(' '));\n",
    });
    try {
      const hooks = await load('codex-hooks-watchdog.js', root);
      await hooks.event({ event: { type: 'session.created', properties: { info: { id: `s-${sourceName}` } } } });
      assert.equal(fs.readFileSync(path.join(root, 'installer-ran'), 'utf8'), '--check');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}

test('without a source root the guard stays open and the watchdog reports no drift', async () => {
  const root = consumer(null);
  try {
    const guard = await load('cli-dispatch-audit.js', root);
    await guard['tool.execute.before']({ tool: 'bash', args: { command: 'opencode run -m p/m --agent general "x" </dev/null' } });
    const watchdog = await load('codex-hooks-watchdog.js', root);
    await watchdog.event({ event: { type: 'session.created', properties: { info: { id: 's-none' } } } });
    assert.equal(fs.existsSync(path.join(root, '.skilled')), false);
    assert.equal(fs.existsSync(path.join(root, '.opencode')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
