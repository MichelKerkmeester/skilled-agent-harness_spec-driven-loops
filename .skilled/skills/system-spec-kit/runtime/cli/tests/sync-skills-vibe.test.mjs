// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Skills Mirror Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// The skills mirror is a folder of relative symlinks, so any other entry is
// drift. A dotfile is not a skill: Finder drops .DS_Store into a folder nobody
// edited, and counting it as EXTRA made --check fail on a clean mirror.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const GENERATOR = join(
  REPO_ROOT,
  '.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs',
);

/**
 * Runs the generator against one output folder.
 * @param {string} outputDir - The mirror folder under test.
 * @param {string[]} args - Extra arguments, such as --check.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} The run.
 */
function runSync(outputDir, args) {
  // The source tree is always the repository's own; an inherited override would
  // make the expected links depend on the shell the suite runs in.
  const env = { ...process.env, VIBE_SKILLS_OUTPUT_DIR: outputDir };
  delete env.VIBE_SKILLS_SOURCE_DIR;
  return spawnSync(process.execPath, [GENERATOR, ...args], { env, encoding: 'utf8' });
}

test('a .DS_Store in the skills mirror is not drift', () => {
  const outputDir = mkdtempSync(join(tmpdir(), 'vibe-skills-mirror-'));
  try {
    const generated = runSync(outputDir, []);
    assert.equal(generated.status, 0, generated.stderr);

    writeFileSync(join(outputDir, '.DS_Store'), '');
    const checked = runSync(outputDir, ['--check']);
    assert.equal(checked.status, 0, checked.stderr);
    assert.ok(!checked.stderr.includes('.DS_Store'), checked.stderr);
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

/**
 * Builds an empty skill source and mirror tree for one run.
 * @returns {{root: string, source: string, output: string}} The fixture paths.
 */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'vibe-skills-'));
  const source = join(root, 'skills');
  const output = join(root, 'out');
  mkdirSync(source, { recursive: true });
  return { root, source, output };
}

/**
 * Writes one skill source with the frontmatter the generator reads.
 * @param {string} source - The skill source root.
 * @param {string} directory - The source directory below the root.
 * @param {string} name - The frontmatter name, which is the mirror link name.
 * @param {string} description - The frontmatter description.
 */
function writeSkill(source, directory, name, description) {
  const skillDirectory = join(source, directory);
  mkdirSync(skillDirectory, { recursive: true });
  writeFileSync(
    join(skillDirectory, 'SKILL.md'),
    [
      '---',
      'name: ' + name,
      'description: ' + JSON.stringify(description),
      '---',
      '# ' + name,
      '',
    ].join('\n'),
  );
}

/**
 * Runs the generator against one fixture.
 * @param {{root: string, source: string, output: string}} env - The fixture.
 * @param {string[]} args - Extra arguments, such as --check.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} The run.
 */
function runFixture(env, args = []) {
  const result = spawnSync(process.execPath, [GENERATOR, ...args], {
    cwd: env.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      VIBE_SKILLS_SOURCE_DIR: env.source,
      VIBE_SKILLS_OUTPUT_DIR: env.output,
    },
  });
  if (result.error) throw result.error;
  return result;
}

test('fails without writing when two skills declare the same frontmatter name', () => {
  const env = fixture();
  try {
    writeSkill(env.source, 'first', 'shared', 'First');
    writeSkill(env.source, 'second', 'shared', 'Second');

    const generated = runFixture(env);
    const output = generated.stdout + generated.stderr;
    assert.equal(generated.status, 1);
    assert.match(output, /duplicate skill name "shared"/);
    assert.ok(output.includes(join(env.source, 'first', 'SKILL.md')), output);
    assert.ok(output.includes(join(env.source, 'second', 'SKILL.md')), output);
    assert.equal(existsSync(env.output), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('prunes stale links and folders and preserves dotfiles and operator-private entries', () => {
  const env = fixture();
  try {
    writeSkill(env.source, 'worker', 'worker', 'Worker');
    mkdirSync(env.output, { recursive: true });
    symlinkSync(join(env.source, 'worker'), join(env.output, 'retired'), 'dir');
    mkdirSync(join(env.output, 'retired-folder'));
    writeFileSync(join(env.output, 'retired-folder', 'notes.txt'), 'sourceless\n');
    mkdirSync(join(env.output, 'local-operator'));
    writeFileSync(join(env.output, 'local-operator', 'keep.txt'), 'operator-owned\n');
    writeFileSync(join(env.output, '.DS_Store'), '');

    const generated = runFixture(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.match(generated.stdout, /pruned 2/);
    assert.equal(existsSync(join(env.output, 'retired')), false);
    assert.equal(existsSync(join(env.output, 'retired-folder')), false);
    assert.equal(readFileSync(join(env.output, 'local-operator', 'keep.txt'), 'utf8'), 'operator-owned\n');
    assert.equal(existsSync(join(env.output, '.DS_Store')), true);

    const checked = runFixture(env, ['--check']);
    assert.equal(checked.status, 0, checked.stderr);
    assert.equal(checked.stderr.includes('.DS_Store'), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('reserves the operator-private local- prefix in sources and outputs', () => {
  const env = fixture();
  try {
    writeSkill(env.source, 'worker', 'worker', 'Worker');
    writeSkill(env.source, 'private', 'local-x', 'Private');

    const generated = runFixture(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.match(generated.stdout, /LINKS: 1/);
    assert.match(generated.stdout, /EXCLUDED .*private\/SKILL\.md.*reserved operator-private local-\* prefix/);
    assert.equal(lstatSync(join(env.output, 'worker')).isSymbolicLink(), true);
    assert.equal(existsSync(join(env.output, 'local-x')), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

