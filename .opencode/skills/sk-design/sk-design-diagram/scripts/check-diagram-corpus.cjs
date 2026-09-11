#!/usr/bin/env node
/**
 * Corpus check for the diagram packet.
 *
 * Every rule the skill states that a regex over an SVG can hold is enforced here, one family per
 * module under scripts/families/. The registry is that directory, so the family count is whatever
 * is on disk and never a number kept by hand.
 *
 * What this does not hold, and why, so nobody reads a green run as more than it is:
 *   - pairwise connector geometry (overlap, the attach fan, the visible label gap, a route behind a
 *     box) needs a 2D pass over parsed paths, not a regex; until one exists the eye holds it
 *   - focal balance, type fit, the remove test and taste are judgments
 * Those live in the capture review, and a judgment that becomes computable moves in here, logged.
 *
 * Usage:
 *   node check-diagram-corpus.cjs             the corpus
 *   node check-diagram-corpus.cjs --extra DIR also HTML deliveries outside this package
 *
 * Exit 0 only when the run prints RESULT: PASSED. Read the marker, not the exit code: a run that
 * dies before its first check exits without printing failures.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const gates = require('./color-gates.cjs');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const FAMILY_DIR = path.join(__dirname, 'families');
const FORM_DIR = path.join(PACKAGE_ROOT, 'assets', 'diagrams');
// A starter is a form with nothing drawn in it yet. It is the only kind that must carry a palette
// block, because it is what a new diagram is copied from; a worked form keeps whichever tokens it
// draws with. The two used to be told apart by directory and now share one, so the name says it.
const STARTER = /(^|\/)starter-[a-z-]+\.html$/;
const PALETTE_SOURCE = path.join(PACKAGE_ROOT, 'assets', 'style-reference', 'diagram-palette.json');

const findings = [];
const counts = new Map();
const seen = new Set();

function record(check, level, file, message) {
  const key = `${check} ${file} ${message}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings.push({ check, level, file, message });
}

function tally(check, n) {
  counts.set(check, (counts.get(check) || 0) + n);
}

function rel(p) {
  return path.relative(PACKAGE_ROOT, p) || path.basename(p);
}

function stripHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, '');
}

function stripCssComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

// Styles and scripts are lifted out so a rule about markup never reads a stylesheet, and a rule
// about paint never reads prose. Attribute values are collected from the markup that remains.
function regionsOf(src) {
  const styles = [];
  const scripts = [];
  const attrs = [];
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = styleRe.exec(src)) !== null) styles.push(m[1]);
  while ((m = scriptRe.exec(src)) !== null) scripts.push(m[1]);
  const markup = src.replace(styleRe, '').replace(scriptRe, '');
  const attrRe = /[a-zA-Z-]+\s*=\s*"([^"]*)"/g;
  while ((m = attrRe.exec(markup)) !== null) attrs.push(m[1]);
  return { styles, scripts, attrs, markup };
}

// A tag that spans lines fooled a line-oriented read once; every rule about what a tag carries
// asks this flattened view instead.
function flattenTags(markup) {
  return markup.replace(/<([^>]*)>/g, (whole, inner) => `<${inner.replace(/\s+/g, ' ').trim()}>`);
}

function htmlFilesUnder(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFilesUnder(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out.sort();
}

function parseExtraDirectory(argv) {
  const index = argv.indexOf('--extra');
  if (index === -1) return null;
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error('--extra needs a directory path');
  const directory = path.resolve(value);
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`--extra directory does not exist: ${value}`);
  }
  return directory;
}

function loadFamilies() {
  return fs.readdirSync(FAMILY_DIR)
    .filter((name) => name.endsWith('.cjs'))
    .sort()
    .map((name) => {
      const family = require(path.join(FAMILY_DIR, name));
      if (!family.name || typeof family.run !== 'function' || !['file', 'corpus'].includes(family.scope)) {
        throw new Error(`families/${name} must export name, scope ('file' or 'corpus') and run`);
      }
      return family;
    });
}

function main() {
  let extraDirectory;
  try {
    extraDirectory = parseExtraDirectory(process.argv.slice(2));
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(2);
  }
  const palette = JSON.parse(fs.readFileSync(PALETTE_SOURCE, 'utf8'));
  const families = loadFamilies();
  const internal = htmlFilesUnder(FORM_DIR);
  const extra = extraDirectory ? htmlFilesUnder(extraDirectory) : [];
  const shared = {
    tally, record, rel, gates, palette, crypto, fs, path,
    root: PACKAGE_ROOT, formDir: FORM_DIR, templateDir: FORM_DIR, exampleDir: FORM_DIR,
    stripHtmlComments, stripCssComments, regionsOf, flattenTags, htmlFilesUnder,
  };
  for (const file of [...internal, ...extra]) {
    const isExtra = extra.includes(file);
    const label = isExtra ? `--extra/${path.relative(extraDirectory, file)}` : rel(file);
    const src = fs.readFileSync(file, 'utf8');
    const clean = stripHtmlComments(src);
    const kind = isExtra ? 'extra' : STARTER.test(file) ? 'starter' : 'form';
    const ctx = { ...shared, file, label, isExtra, src, clean, regions: regionsOf(clean), kind };
    for (const family of families) if (family.scope === 'file') family.run(ctx);
  }
  for (const family of families) if (family.scope === 'corpus') family.run({ ...shared, files: internal });

  const errors = findings.filter((f) => f.level === 'error');
  console.log(`Diagram corpus: ${internal.length} files, ${families.length} families`);
  for (const family of families) {
    const n = counts.get(family.name) || 0;
    const failed = errors.filter((e) => e.check === family.name).length;
    console.log(`  ${failed ? 'x' : '+'} ${family.name}: ${n} assertion(s), ${failed} failure(s)`);
  }
  if (errors.length) {
    console.log('');
    for (const e of errors) console.log(`  FAIL [${e.check}] ${e.file}: ${e.message}`);
  }
  console.log('');
  console.log(`Summary: errors: ${errors.length}`);
  console.log('');
  console.log(errors.length ? 'RESULT: FAILED' : 'RESULT: PASSED');
  process.exit(errors.length ? 1 : 0);
}

module.exports = { regionsOf, flattenTags, stripHtmlComments, stripCssComments, htmlFilesUnder, loadFamilies };
if (require.main === module) main();
