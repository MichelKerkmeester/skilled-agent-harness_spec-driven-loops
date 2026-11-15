// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Home Hooks Renderer Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// The rendered home file must name every hook script by absolute path, since
// a scratch-cwd run cannot resolve the checkout through git. The renderer must
// also refuse the operator's own home, where the guards would outlive one run.

import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { renderHomeHooks } = require('../render-home-hooks.cjs');

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
// The renderer anchors every command to the checkout's real path, so a checkout
// reached through a symlink renders the target and the test must compare to it.
const REAL_REPO_ROOT = realpathSync(REPO_ROOT);

test('renders every hook command with the absolute checkout path', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'vibe-home-hooks-'));
  try {
    const target = renderHomeHooks({ vibeHome: join(scratch, 'home'), repoRoot: REPO_ROOT });
    const rendered = readFileSync(target, 'utf8');
    const source = readFileSync(join(REPO_ROOT, '.vibe', 'hooks.toml'), 'utf8');
    const commands = rendered.split('\n').filter((line) => /^\s*command\s*=/.test(line));

    assert.equal(commands.length, source.split('\n').filter((line) => /^\s*command\s*=/.test(line)).length);
    assert.ok(commands.length > 0);
    for (const line of commands) {
      assert.ok(!line.includes('$('), line);
      assert.ok(
        line.includes(`"${REAL_REPO_ROOT}/`) || line.includes(`\\"${REAL_REPO_ROOT}/`),
        line,
      );
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});

test('refuses the operator home and a missing home', () => {
  assert.throws(
    () => renderHomeHooks({ vibeHome: join(homedir(), '.vibe'), repoRoot: REPO_ROOT }),
    /operator's Vibe home/,
  );
  assert.throws(() => renderHomeHooks({ vibeHome: '', repoRoot: REPO_ROOT }), /required/);
});

/**
 * Renders a hooks file that keeps one substitution form in its command.
 * @param {string} command - The command line to write into the fixture hooks file.
 * @returns {string} The rendered hooks path, when the renderer accepts it.
 */
function renderWithCommand(command) {
  const scratch = mkdtempSync(join(tmpdir(), 'vibe-home-hooks-'));
  try {
    mkdirSync(join(scratch, '.vibe'), { recursive: true });
    writeFileSync(
      join(scratch, '.vibe', 'hooks.toml'),
      `[[hooks]]\nname = "g"\ntype = "pre_tool"\ncommand = "${command}"\n`,
    );
    return renderHomeHooks({ vibeHome: join(scratch, 'home'), repoRoot: scratch });
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

test('refuses a command that keeps any substitution form', () => {
  for (const command of [
    'node $SCRIPT/g.mjs',
    'node ${SCRIPT}/g.mjs',
    'node $(pwd)/g.mjs',
    'node `pwd`/g.mjs',
  ]) {
    assert.throws(() => renderWithCommand(command), /shell substitution/, command);
  }
});

test('refuses a checkout path with a newline or a carriage return', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'vibe-home-hooks-'));
  try {
    mkdirSync(join(scratch, '.vibe'), { recursive: true });
    writeFileSync(join(scratch, '.vibe', 'hooks.toml'), '[[hooks]]\nname = "g"\ncommand = "node g.mjs"\n');
    assert.throws(
      () => renderHomeHooks({ vibeHome: join(scratch, 'home'), repoRoot: `${scratch}\n` }),
      /refusing a checkout path/,
    );
    assert.throws(
      () => renderHomeHooks({ vibeHome: join(scratch, 'home'), repoRoot: `${scratch}\r` }),
      /refusing a checkout path/,
    );
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
