#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Instruction Fixture Composer
// ───────────────────────────────────────────────────────────────────
'use strict';

// A fixture is a recipe, not a tree. A committed copy of the composed tree would put the
// shipped template into the repository a second time: its relative links would resolve
// from the fixture folder rather than the root, a runtime that loads nested instruction
// files would read it as some repository's own document, and every template edit would
// force a regeneration commit. So each folder here holds only `fixture.json`, and the
// tree it describes is composed on demand into a folder the caller throws away.
//
// Composition reads the manifest the template ships, never a stored copy of it, so a
// fixture is a statement about what is shipped today. That is also why a fixture cannot
// describe a template the manifest does not ship: the bodies come from the manifest's
// derived sections and its release history, the block shape from the manifest's markers,
// and the two runtime mirrors from the generators that own them.
//
// Composing by hand is supported, because "run the check against this defect" is the
// first thing a reader wants to do with a fixture:
//
// Usage: compose-fixture.cjs <fixture> <empty-folder>
//   <fixture>       one of the folder names beside this script
//   <empty-folder>  created if absent, refused when it already holds anything
// Exit codes: 0 composed, 2 bad arguments or a folder it must not write into

const fs = require('node:fs');
const path = require('node:path');

const SCRIPTS_DIR = path.resolve(__dirname, '../../..');
const REPO_ROOT = path.resolve(SCRIPTS_DIR, '../../../..');
const FIXTURES = __dirname;
const MANIFEST_PATH = path.join(SCRIPTS_DIR, '../assets/agents-md-manifest.json');
const POINTER_SYNC = path.join(
  REPO_ROOT,
  '.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs',
);

const { TARGETS, applyBlock, readGateOneLine, renderBlock } = require(POINTER_SYNC);

const TAG = '[compose-fixture]';
const USAGE = `Usage: node ${path.relative(REPO_ROOT, __filename)} <fixture> <empty-folder>`;

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// ─────────────────────────────────────────────────────────────────────────────
// 1. RECIPES
// ─────────────────────────────────────────────────────────────────────────────

// The recipe folders, not every entry beside them: this script lives in the same folder.
function fixtureNames() {
  return fs.readdirSync(FIXTURES, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function loadRecipe(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES, name, 'fixture.json'), 'utf8'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE DOCUMENT A RECIPE DESCRIBES
// ─────────────────────────────────────────────────────────────────────────────

function derivedBody(id) {
  const entry = manifest.derived.sections[id];
  if (!entry) throw new Error(`the manifest's derived key holds no section ${id}`);
  return entry.body;
}

// The older body the release history holds for one section, found by the heading the body
// opens with rather than by a tag, so the fixture names a section and the history decides
// which released wording stands in for it.
function historyBody(id) {
  const entry = manifest.sections.find((row) => row.id === id);
  if (!entry) throw new Error(`the manifest declares no section ${id}`);
  const hit = manifest.derived.history.find((row) => row.body.split('\n')[0].includes(entry.match));
  if (!hit) throw new Error(`the manifest's history holds no older body for ${id}`);
  return hit.body;
}

// A local line belongs inside the section it was written into, ahead of the divider that
// closes it, so the fixture reads like an edit somebody made rather than a line appended
// after the rule.
function insertIntoSection(body, line) {
  const divider = body.lastIndexOf('\n---\n');
  if (divider === -1) return `${body}${line}\n`;
  return `${body.slice(0, divider)}\n${line}\n${body.slice(divider)}`;
}

function composeDocument(recipe) {
  if (recipe.base === 'none') return null;
  if (recipe.base === 'own') return recipe.own_document;

  const parts = [];
  for (const entry of manifest.sections) {
    let body = (recipe.replace_with_history || []).includes(entry.id)
      ? historyBody(entry.id)
      : derivedBody(entry.id);
    for (const line of (recipe.section_edits || {})[entry.id] || []) {
      body = insertIntoSection(body, line);
    }
    for (const row of recipe.insert_sections || []) {
      if (row.before === entry.id) parts.push(row.text);
    }
    parts.push(body);
  }
  return parts.join('');
}

function blockText(recipe) {
  const { markers } = manifest;
  return `\n${markers.heading}\n\n${markers.note}\n${recipe.block.text || ''}`.trimEnd();
}

function composeDocumentWithBlock(recipe) {
  const shipped = composeDocument(recipe);
  if (!recipe.block) return shipped;

  const { markers } = manifest;
  if (recipe.block.markers === 'reversed') {
    const filler = Array.from(
      { length: recipe.block.pad_lines || 0 },
      (_, index) => `${String(index + 1).padStart(2, '0')}. A repository note kept out of the shipped sections.`,
    ).join('\n');
    return `${shipped}${markers.end}\n${filler}\n${markers.start}\n`;
  }
  return `${shipped}${markers.start}\n${blockText(recipe)}\n${markers.end}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE RUNTIME MIRRORS
// ─────────────────────────────────────────────────────────────────────────────

// The Cursor rule every runtime mirror is generated from. Writing it with the sync's own
// renderer is what makes the fixture a repository that has run the generator, instead of
// one carrying a hand-copied block that would only prove the copy.
function writePointerMirror(dir) {
  const line = readGateOneLine(dir);
  if (!line) return null;
  const target = path.join(dir, TARGETS[0].file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, applyBlock('', renderBlock(TARGETS[0].intro, line)), 'utf8');
  return path.relative(dir, target).split(path.sep).join('/');
}

// Devin never sees past the delivery prefix of the root document, so a repository with a
// non-empty block is expected to carry the generated mirror of it.
function writeRepoLocalMirror(dir, recipe) {
  if (!recipe.block || recipe.block.markers === 'reversed') return null;
  const target = path.join(dir, '.cursor/rules/repo-local.md');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `---\nalwaysApply: true\n---\n${blockText(recipe)}\n`, 'utf8');
  return path.relative(dir, target).split(path.sep).join('/');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE TREE A RECIPE DESCRIBES
// ─────────────────────────────────────────────────────────────────────────────

// The root document, the files the recipe adds, and the two runtime mirrors a repository
// that ran its generators would carry. Returns the relative path of every file written,
// so a caller can report what it composed.
function composeFixture(name, dir) {
  const recipe = loadRecipe(name);
  const written = [];

  fs.mkdirSync(dir, { recursive: true });
  const document = composeDocumentWithBlock(recipe);
  if (document !== null) {
    fs.writeFileSync(path.join(dir, manifest.root_file), document, 'utf8');
    written.push(manifest.root_file);
  }
  for (const [relative, content] of Object.entries(recipe.files || {})) {
    const target = path.join(dir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    written.push(relative);
  }
  for (const relative of [writePointerMirror(dir), writeRepoLocalMirror(dir, recipe)]) {
    if (relative) written.push(relative);
  }
  return written;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  if (argv.length !== 2) {
    console.error(`${TAG} ERROR: expected a fixture name and an empty folder\n${USAGE}`);
    return 2;
  }
  const [name, target] = argv;
  if (!fixtureNames().includes(name)) {
    console.error(`${TAG} ERROR: no fixture named ${name}. Known: ${fixtureNames().join(', ')}`);
    return 2;
  }

  const dir = path.resolve(target);
  if (fs.existsSync(dir)) {
    if (!fs.statSync(dir).isDirectory()) {
      console.error(`${TAG} ERROR: ${dir} is not a directory`);
      return 2;
    }
    if (fs.readdirSync(dir).length > 0) {
      console.error(`${TAG} ERROR: ${dir} is not empty, so composing here would mix two trees`);
      return 2;
    }
  }

  const written = composeFixture(name, dir);
  console.log(`${TAG} ${name} -> ${dir}`);
  for (const relative of written) console.log(`  ${relative}`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = {
  FIXTURES,
  MANIFEST_PATH,
  REPO_ROOT,
  SCRIPTS_DIR,
  composeFixture,
  fixtureNames,
  loadRecipe,
};
