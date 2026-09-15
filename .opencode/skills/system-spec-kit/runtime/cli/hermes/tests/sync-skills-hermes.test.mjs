// ───────────────────────────────────────────────────────────────────
// MODULE: Sync Hermes Skills - generator tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, existsSync, lstatSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'sync-skills-hermes.cjs');

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'hermes-skills-'));
  const source = join(root, 'skills');
  const output = join(root, 'out');
  mkdirSync(join(source, 'hub', 'mode-a', 'scripts'), { recursive: true });
  mkdirSync(join(source, 'hub', 'node_modules', 'dep'), { recursive: true });
  mkdirSync(join(source, 'plain'), { recursive: true });
  const agents = join(root, 'agents');
  mkdirSync(agents, { recursive: true });
  writeFileSync(join(agents, 'markdown.md'), '---\nname: markdown\ndescription: Docs "executor"\ntools: Read\n---\n\n# The Markdown Agent\n');
  writeFileSync(join(agents, 'README.txt'), 'not an agent');
  writeFileSync(join(source, 'hub', 'SKILL.md'), '---\nname: hub\ndescription: "Hub"\n---\n\n# Hub\n\nbody\n');
  writeFileSync(join(source, 'hub', 'mode-a', 'SKILL.md'), '---\nname: mode-a\ndescription: "Mode A"\n---\n\n# Mode A\n');
  writeFileSync(join(source, 'hub', 'mode-a', 'scripts', 'x.sh'), 'rm -rf /tmp/x\n');
  writeFileSync(join(source, 'hub', 'node_modules', 'dep', 'SKILL.md'), '---\nname: dep\n---\n');
  writeFileSync(join(source, 'plain', 'SKILL.md'), '# No frontmatter\n');
  return { root, source, output, agents };
}

function run(env, args = []) {
  return execFileSync(process.execPath, [SCRIPT, ...args], {
    env: { ...process.env, HERMES_SKILLS_SOURCE_DIR: env.source, HERMES_SKILLS_OUTPUT_DIR: env.output, HERMES_AGENTS_SOURCE_DIR: env.agents },
    encoding: 'utf8',
  });
}

test('writes one markdown-only folder per SKILL.md, flat by frontmatter name, skipping node_modules', () => {
  const env = fixture();
  try {
    const out = run(env);
    assert.match(out, /Wrote 4 of 4/);
    const agent = readFileSync(join(env.output, 'agent-markdown', 'SKILL.md'), 'utf8');
    assert.match(agent, /^---\nname: agent-markdown\n/);
    assert.ok(agent.includes('description: "Docs \\"executor\\""'), agent.slice(0, 80));
    assert.match(agent, /Preload with `-s agent-markdown`/);
    assert.match(agent, /# The Markdown Agent/);
    assert.ok(!agent.includes('tools: Read'));
    for (const name of ['hub', 'mode-a', 'plain']) {
      assert.ok(existsSync(join(env.output, name, 'SKILL.md')), name);
    }
    assert.ok(!existsSync(join(env.output, 'dep')));
    assert.ok(!existsSync(join(env.output, 'mode-a', 'scripts')));
    const copy = readFileSync(join(env.output, 'mode-a', 'SKILL.md'), 'utf8');
    assert.match(copy, /^---\nname: mode-a\n/);
    assert.match(copy, /Canonical source: `\.opencode\/skills\/hub\/mode-a\/`/);
    assert.match(copy, /# Mode A/);
    const plain = readFileSync(join(env.output, 'plain', 'SKILL.md'), 'utf8');
    assert.match(plain, /^---\nname: plain\n/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('--check passes when in sync, fails on drift, and write mode prunes stale folders and replaces symlinks', () => {
  const env = fixture();
  try {
    run(env);
    assert.match(run(env, ['--check']), /PASS: 4/);
    mkdirSync(join(env.output, 'stale'), { recursive: true });
    writeFileSync(join(env.output, 'stale', 'SKILL.md'), 'x');
    rmSync(join(env.output, 'plain'), { recursive: true, force: true });
    symlinkSync(join(env.source, 'plain'), join(env.output, 'plain'));
    let checkOutput = '';
    try {
      run(env, ['--check']);
    } catch (error) {
      checkOutput = String(error.stdout || '');
    }
    assert.match(checkOutput, /FAIL: 1 drifted, 1 stale/);
    run(env);
    assert.ok(!existsSync(join(env.output, 'stale')));
    assert.ok(!lstatSync(join(env.output, 'plain')).isSymbolicLink());
    assert.match(run(env, ['--check']), /PASS: 4/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('refuses two skills that share a frontmatter name', () => {
  const env = fixture();
  try {
    mkdirSync(join(env.source, 'other'), { recursive: true });
    writeFileSync(join(env.source, 'other', 'SKILL.md'), '---\nname: hub\n---\n');
    let message = '';
    try {
      run(env);
    } catch (error) {
      message = String(error.stderr || '');
    }
    assert.match(message, /duplicate skill name 'hub'/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});
