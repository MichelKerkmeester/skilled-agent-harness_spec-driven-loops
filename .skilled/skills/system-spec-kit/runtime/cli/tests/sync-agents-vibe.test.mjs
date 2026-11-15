// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Agents Mirror Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// The agents mirror is one TOML profile per `.skilled/agents` source. A wrong
// profile loads a different persona, and a profile with no source keeps loading
// after its source is gone, so the suite pins the reserved name, the prune and
// the dotfile that Finder drops into any folder.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const GENERATOR = join(
  REPO_ROOT,
  '.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs',
);

/**
 * Builds an empty source and output tree for one run.
 * @returns {{root: string, source: string, output: string}} The fixture paths.
 */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'vibe-agents-'));
  const source = join(root, 'agents');
  const output = join(root, 'out');
  mkdirSync(source, { recursive: true });
  return { root, source, output };
}

/**
 * Writes one agent source with the frontmatter the generator requires.
 * @param {string} source - The agent source folder.
 * @param {string} fileName - The source file name.
 * @param {string} body - The markdown body after the frontmatter.
 */
function writeAgent(source, fileName, body) {
  writeFileSync(
    join(source, fileName),
    '---\nname: ' + fileName.replace(/\.md$/, '')
      + '\ndescription: Agent description\n---\n' + body,
  );
}

/**
 * Runs the generator against one fixture.
 * @param {{root: string, source: string, output: string}} env - The fixture.
 * @param {string[]} args - Extra arguments, such as --check.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} The run.
 */
function run(env, args = []) {
  const result = spawnSync(process.execPath, [GENERATOR, ...args], {
    cwd: env.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      VIBE_AGENTS_SOURCE_DIR: env.source,
      VIBE_AGENTS_OUTPUT_DIR: env.output,
    },
  });
  if (result.error) throw result.error;
  return result;
}

test('writes one TOML profile per source and --check passes', () => {
  const env = fixture();
  try {
    writeAgent(env.source, 'worker.md', '# Worker\n');
    writeFileSync(join(env.source, 'README.md'), '# Agent index\n');

    const generated = run(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.match(generated.stdout, /Wrote 1 of 1 agent profiles/);

    const profile = readFileSync(join(env.output, 'worker.toml'), 'utf8');
    assert.match(profile, /description = "Agent description"/);
    assert.match(profile, /instructions = "# Worker\\n"/);
    assert.equal(existsSync(join(env.output, 'README.toml')), false);

    const checked = run(env, ['--check']);
    assert.equal(checked.status, 0, checked.stderr);
    assert.match(checked.stdout, /PASS: 1 agent profiles are in sync/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

// Vibe refuses to spawn a profile by name unless it is typed as a subagent, so the
// source's mode must survive the render, and a primary agent must not gain the type.
test('types a subagent source as a Vibe subagent and leaves a primary agent untyped', () => {
  const env = fixture();
  try {
    writeFileSync(
      join(env.source, 'helper.md'),
      '---\nname: helper\ndescription: Helper agent\nmode: subagent\n---\n# Helper\n',
    );
    writeFileSync(
      join(env.source, 'lead.md'),
      '---\nname: lead\ndescription: Lead agent\nmode: primary\n---\n# Lead\n',
    );

    const generated = run(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.match(readFileSync(join(env.output, 'helper.toml'), 'utf8'), /^agent_type = "subagent"$/m);
    assert.doesNotMatch(readFileSync(join(env.output, 'lead.toml'), 'utf8'), /agent_type/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

// Source stems are unique within one folder, so this generator has no name-collision
// surface; the equivalent danger is a profile with no source. It must be reported by
// --check and pruned by a write run, never left for Vibe to load.
test('--check reports a missing, stale, or sourceless profile without repairing it', () => {
  const env = fixture();
  try {
    writeAgent(env.source, 'worker.md', '# Worker\n');
    writeAgent(env.source, 'reviewer.md', '# Reviewer\n');
    assert.equal(run(env).status, 0);

    const missing = join(env.output, 'reviewer.toml');
    const stale = join(env.output, 'worker.toml');
    const extra = join(env.output, 'retired.toml');
    unlinkSync(missing);
    writeFileSync(stale, 'stale\n');
    writeFileSync(extra, 'sourceless\n');

    const checked = run(env, ['--check']);
    const output = checked.stdout + checked.stderr;
    assert.equal(checked.status, 1);
    assert.match(output, /MISSING .*reviewer\.toml/);
    assert.match(output, /STALE .*worker\.toml/);
    assert.match(output, /EXTRA .*retired\.toml/);
    assert.equal(existsSync(missing), false);
    assert.equal(readFileSync(stale, 'utf8'), 'stale\n');
    assert.equal(readFileSync(extra, 'utf8'), 'sourceless\n');
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('prunes a sourceless profile and leaves non-profile entries alone', () => {
  const env = fixture();
  try {
    writeAgent(env.source, 'worker.md', '# Worker\n');
    mkdirSync(env.output, { recursive: true });
    writeFileSync(join(env.output, 'retired.toml'), 'sourceless\n');
    writeFileSync(join(env.output, 'operator-notes.txt'), 'operator-owned\n');
    writeFileSync(join(env.output, '.DS_Store'), '');

    const generated = run(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.match(generated.stdout, /pruned 1/);
    assert.equal(existsSync(join(env.output, 'retired.toml')), false);
    assert.equal(readFileSync(join(env.output, 'operator-notes.txt'), 'utf8'), 'operator-owned\n');
    assert.equal(existsSync(join(env.output, '.DS_Store')), true);

    const checked = run(env, ['--check']);
    assert.equal(checked.status, 0, checked.stderr);
    assert.equal(checked.stderr.includes('.DS_Store'), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('refuses a source whose stem is the reserved main agent name', () => {
  const env = fixture();
  try {
    writeAgent(env.source, 'main.md', '# Main\n');

    const generated = run(env);
    assert.equal(generated.status, 1);
    assert.match(generated.stderr, /Vibe reserves the agent name "main"/);
    assert.equal(existsSync(env.output), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('refuses a case variant of the reserved main agent name', () => {
  const env = fixture();
  try {
    writeAgent(env.source, 'Main.md', '# Main\n');

    const generated = run(env);
    assert.equal(generated.status, 1);
    assert.match(generated.stderr, /Vibe reserves the agent name "main"/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});
