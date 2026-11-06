// ───────────────────────────────────────────────────────────────────
// MODULE: Sync DSH Skills - generator tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'dsh',
  'sync-skills-dsh.cjs',
);

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'dsh-skills-'));
  const source = join(root, 'skills');
  const output = join(root, 'out');
  mkdirSync(source, { recursive: true });
  return { root, source, output };
}

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

function run(env, args = []) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: env.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      DSH_SKILLS_SOURCE_DIR: env.source,
      DSH_SKILLS_OUTPUT_DIR: env.output,
    },
  });
  if (result.error) throw result.error;
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

test('writes relative skill links, follows source directory symlinks, and preserves local entries', () => {
  const env = fixture();
  try {
    writeSkill(env.source, 'hub', 'hub', 'Hub skill');
    writeSkill(env.source, 'hub/mode', 'mode', 'Nested skill');
    writeSkill(env.source, 'node_modules/dependency', 'ignored', 'Excluded');
    writeSkill(env.source, 'local-private', 'private', 'Private');
    writeSkill(env.source, 'named-local-skill', 'local-x', 'Operator-private by frontmatter');

    const linkedSource = join(env.root, 'linked-source');
    writeSkill(linkedSource, '.', 'linked', 'Linked skill');
    symlinkSync(linkedSource, join(env.source, 'linked-alias'), 'dir');

    const localOutput = join(env.output, 'local-operator');
    mkdirSync(localOutput, { recursive: true });
    writeFileSync(join(localOutput, 'keep.txt'), 'operator-owned');

    const result = run(env);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /LINKS: 3/);
    assert.match(result.stdout, /EXCLUDED .*node_modules.*excluded directory name: node_modules/);
    assert.match(result.stdout, /EXCLUDED .*local-private.*top-level operator-private local-.+ entry/);
    assert.match(
      result.stdout,
      /EXCLUDED .*named-local-skill.*frontmatter name uses the reserved operator-private local-\* prefix/,
    );
    assert.match(result.stdout, /EXCLUDED .*local-operator.*reserved operator-private output/);
    assert.equal(readFileSync(join(localOutput, 'keep.txt'), 'utf8'), 'operator-owned');

    const hubLink = join(env.output, 'hub');
    assert.equal(lstatSync(hubLink).isSymbolicLink(), true);
    assert.equal(readlinkSync(hubLink), relative(env.output, join(env.source, 'hub')));
    assert.equal(lstatSync(join(env.output, 'mode')).isSymbolicLink(), true);
    assert.equal(lstatSync(join(env.output, 'linked')).isSymbolicLink(), true);
    assert.equal(existsSync(join(env.output, 'ignored')), false);
    assert.equal(existsSync(join(env.output, 'private')), false);
    assert.equal(existsSync(join(env.output, 'local-x')), false);

    const check = run(env, ['--check']);
    assert.equal(check.status, 0, check.stderr);
    assert.match(check.stdout, /PASS: 3 skill links are in sync/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('skips missing metadata with warnings and warns without failing for long descriptions', () => {
  const env = fixture();
  try {
    writeSkill(env.source, 'long-description', 'long-description', 'x'.repeat(501));
    mkdirSync(join(env.source, 'missing-name'), { recursive: true });
    writeFileSync(
      join(env.source, 'missing-name', 'SKILL.md'),
      '---\ndescription: Present\n---\n# No name\n',
    );
    mkdirSync(join(env.source, 'missing-description'), { recursive: true });
    writeFileSync(
      join(env.source, 'missing-description', 'SKILL.md'),
      '---\nname: missing-description\n---\n# No description\n',
    );

    const result = run(env);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /LINKS: 1/);
    assert.match(result.stderr, /description has 501 characters/);
    assert.match(result.stderr, /missing required name or description frontmatter, skipped/);
    assert.equal(lstatSync(join(env.output, 'long-description')).isSymbolicLink(), true);
    assert.equal(existsSync(join(env.output, 'missing-name')), false);
    assert.equal(existsSync(join(env.output, 'missing-description')), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('--check reports missing, stale, and extra links without repairing them', () => {
  const env = fixture();
  try {
    writeSkill(env.source, 'first', 'first', 'First');
    writeSkill(env.source, 'second', 'second', 'Second');
    writeSkill(env.source, 'wrong-target', 'other', 'Other');
    assert.equal(run(env).status, 0);

    const missing = join(env.output, 'first');
    const stale = join(env.output, 'second');
    const extra = join(env.output, 'extra');
    unlinkSync(missing);
    unlinkSync(stale);
    symlinkSync(relative(env.output, join(env.source, 'wrong-target')), stale, 'dir');
    symlinkSync(relative(env.output, join(env.source, 'wrong-target')), extra, 'dir');

    const check = run(env, ['--check']);
    const output = check.stdout + check.stderr;
    assert.equal(check.status, 1);
    assert.match(output, /MISSING .*first/);
    assert.match(output, /STALE .*second/);
    assert.match(output, /EXTRA .*extra/);
    assert.equal(existsSync(missing), false);
    assert.equal(readlinkSync(stale), relative(env.output, join(env.source, 'wrong-target')));
    assert.equal(readlinkSync(extra), relative(env.output, join(env.source, 'wrong-target')));

    const repaired = run(env);
    assert.equal(repaired.status, 0, repaired.stderr);
    assert.equal(existsSync(extra), false);
    assert.equal(run(env, ['--check']).status, 0);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('an empty source list fails without pruning existing skill links', () => {
  const env = fixture();
  try {
    env.source = join(env.root, 'missing-skills');
    mkdirSync(env.output, { recursive: true });
    const existing = join(env.output, 'existing-skill');
    symlinkSync(relative(env.output, join(env.root, 'operator-skill')), existing, 'dir');

    const result = run(env);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /no skill sources found/);
    assert.equal(readlinkSync(existing), relative(env.output, join(env.root, 'operator-skill')));
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('exits with code one and names both paths when frontmatter names collide', () => {
  const env = fixture();
  try {
    writeSkill(env.source, 'first', 'shared', 'First');
    writeSkill(env.source, 'second', 'shared', 'Second');

    const result = run(env);
    const output = result.stdout + result.stderr;
    assert.equal(result.status, 1);
    assert.ok(output.includes(join(env.source, 'first', 'SKILL.md')), output);
    assert.ok(output.includes(join(env.source, 'second', 'SKILL.md')), output);
    assert.equal(existsSync(env.output), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});
