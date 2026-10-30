#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Manifest Generator
// ───────────────────────────────────────────────────────────────────
'use strict';

// The manifest's authored keys are decisions: which headings the template ships, which
// strings tooling greps out of it, what each runtime is expected to load and where the
// delivery budget sits. The `derived` key is not a decision. It is a copy of the shipped
// bodies, their hashes and the router rows, taken from the root documents, so a consumer
// has a machine-readable copy of what it was shipped and the check engine can tell a
// released body from a locally edited one.
//
// A copy that nobody refreshes is a copy that lies, so `derived` is written only here and
// only in the repository that ships the template, and `--check` is the freshness gate: it
// re-segments the same documents and fails on any difference. The guard is on `--write`
// alone because a consumer's root document is its own file, and rebuilding this key there
// would overwrite the shipped copy with that repository's text.
//
// The generator refuses a surface it does not recognise in either direction. A heading no
// authored entry matches would otherwise vanish from every consumer's template, and an
// authored entry that matches nothing would keep a section in the manifest that no longer
// exists. Both are a manifest edit or a template edit, and never an accident.
//
// Usage: agents-md-manifest.cjs [--check | --write] [--root <dir>] [--manifest <path>]
//   --check           compare `derived` with the root documents and exit 1 on any drift
//                     (the default: the read-only target)
//   --write           regenerate `derived`, in the source repository only
//   --root <dir>      read the root documents under this directory instead of this tree
//   --manifest <path> read and write this file instead of the shipped manifest
// Exit codes: 0 in sync (or written), 1 a refused or drifted surface, 2 a precondition

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const { deliveryAnchorEnd, matchSections, segment, sha256 } = require('./lib/agents-md-sections.cjs');
const {
  currentRepository,
  normalizeRemote,
} = require('../../../skills/sk-code/shared/scripts/lib/repository-identity.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[agents-md-manifest]';
const REPO_ROOT = path.resolve(__dirname, '../../../..');
const MANIFEST_PATH = path.resolve(__dirname, '../assets/agents-md-manifest.json');
const USAGE = 'Usage: node .skilled/commands/doctor/scripts/agents-md-manifest.cjs [--check | --write] [--root <dir>] [--manifest <path>]';
const GIT_TIMEOUT_MS = 10000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

class UsageError extends Error {}

function parseArgs(argv) {
  const options = { mode: 'check', root: REPO_ROOT, manifest: MANIFEST_PATH };
  const modes = [];
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--check') modes.push('check');
    else if (token === '--write') modes.push('write');
    else if (token === '--root') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new UsageError('--root needs a directory');
      options.root = path.resolve(value);
      index += 1;
    } else if (token === '--manifest') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new UsageError('--manifest needs a file path');
      options.manifest = path.resolve(value);
      index += 1;
    } else if (token === '--help' || token === '-h') {
      options.help = true;
    } else {
      throw new UsageError(`unknown argument: ${token}`);
    }
  }
  if (modes.length > 1) throw new UsageError('--check and --write are different targets; pass one');
  if (modes.length === 1) options.mode = modes[0];
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SOURCE-REPOSITORY GUARD
// ─────────────────────────────────────────────────────────────────────────────

function readOriginUrl(root) {
  const run = spawnSync('git', ['-C', root, '-c', 'core.fsmonitor=false', 'remote', 'get-url', 'origin'], {
    encoding: 'utf8',
    timeout: GIT_TIMEOUT_MS,
  });
  if (run.status !== 0 || typeof run.stdout !== 'string') return null;
  const url = run.stdout.trim();
  return url === '' ? null : url;
}

/**
 * Whether this working tree is the repository the manifest ships from.
 *
 * @param {{root: string, manifest: Object, readOrigin?: Function}} input
 * @returns {{isSource: boolean, identity: string|null, origin: string, reason: string}}
 */
function sourceStatus({ root, manifest, readOrigin = null }) {
  const declared = manifest.source_repository;
  const expected = normalizeRemote(declared);

  let origin;
  let identity;
  if (typeof readOrigin === 'function') {
    const url = readOrigin();
    origin = `origin remote ${url === null || url === undefined ? '(unreadable)' : url}`;
    identity = normalizeRemote(url);
  } else {
    const current = currentRepository({ root });
    identity = current.identity;
    origin = identity === null
      ? `origin remote (unreadable under ${root})`
      : `${current.source === 'env' ? 'CI repository' : 'origin remote'} ${identity}`;
  }

  const isSource = expected !== null && identity !== null && identity.toLowerCase() === expected.toLowerCase();
  if (isSource) return { isSource: true, identity, origin, reason: '' };

  return {
    isSource: false,
    identity,
    origin,
    reason: `the ${origin} differs from the source repository manifest.source_repository (${declared})`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DERIVED KEY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split a router document into the rows of the two tables the manifest carries.
 *
 * @param {string} text - The router document.
 * @param {string} anchor - Text that identifies the table's heading.
 * @returns {Array<Array<string>>} One array of trimmed cells per data row.
 */
function parseTableRows(text, anchor) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith('#') && line.includes(anchor));
  if (start === -1) return [];

  const rows = [];
  let headerWidth = 0;
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith('#')) break;
    if (!line.startsWith('|')) {
      // A blank line ends the table; prose after it belongs to the next block.
      if (rows.length > 0 && line === '') break;
      continue;
    }
    const cells = line.replace(/^\|/u, '').replace(/\|$/u, '').split('|').map((cell) => cell.trim());
    if (cells.every((cell) => /^:?-+:?$/u.test(cell) || cell === '')) continue;
    if (headerWidth === 0) {
      headerWidth = cells.length;
      continue;
    }
    if (cells.length !== headerWidth) continue;
    rows.push(cells);
  }
  return rows;
}

/**
 * The release-tag history of shipped bodies: every body the current document does not
 * already hold, deduped by hash, in release order.
 *
 * @param {Array<{body: string, tag: string}>} entries
 * @param {Set<string>} [known] - Hashes already accounted for.
 * @returns {Array<{sha256: string, first_tag: string, body: string}>}
 */
function dedupeBodies(entries, known = new Set()) {
  const seen = new Set(known);
  const history = [];
  for (const entry of entries) {
    const hash = sha256(entry.body);
    if (seen.has(hash)) continue;
    seen.add(hash);
    history.push({ sha256: hash, first_tag: entry.tag, body: entry.body });
  }
  return history;
}

/**
 * Read the release tags the manifest records and collect their shipped bodies.
 *
 * @param {{root: string, manifest: Object}} input
 * @returns {{ok: boolean, bodies: Array<{body: string, tag: string}>, tags: Array<string>, reason: string}}
 */
function readReleaseHistory({ root, manifest }) {
  const pattern = new RegExp(manifest.history.tag_pattern);
  const listed = spawnSync('git', ['-C', root, '-c', 'core.fsmonitor=false', 'tag', '--list', '--sort=version:refname'], {
    encoding: 'utf8',
    timeout: GIT_TIMEOUT_MS,
  });
  if (listed.status !== 0 || typeof listed.stdout !== 'string') {
    return { ok: false, bodies: [], tags: [], reason: `no release tags readable under ${root}: git tag exited ${listed.status}` };
  }

  const tags = listed.stdout.split('\n').map((line) => line.trim()).filter((line) => pattern.test(line));
  const recent = tags.slice(-Math.max(0, manifest.history.tags));
  if (recent.length === 0) {
    return { ok: true, bodies: [], tags: [], reason: `no tag matches ${manifest.history.tag_pattern}` };
  }

  const bodies = [];
  for (const tag of recent) {
    const shown = spawnSync('git', ['-C', root, '-c', 'core.fsmonitor=false', 'show', `${tag}:${manifest.root_file}`], {
      encoding: 'utf8',
      timeout: GIT_TIMEOUT_MS,
      maxBuffer: 64 * 1024 * 1024,
    });
    // A tag that predates the template is not a fault: it simply carries no body.
    if (shown.status !== 0 || typeof shown.stdout !== 'string') continue;
    for (const section of segment(shown.stdout, manifest.markers).sections) bodies.push({ body: section.body, tag });
  }
  return { ok: true, bodies, tags: recent, reason: '' };
}

/**
 * Build the `derived` key from the root documents.
 *
 * @param {{root: string, manifest: Object, history?: Array<Object>|null}} input
 * @returns {{ok: boolean, derived: Object|null, errors: Array<Object>}}
 */
function composeDerived({ root, manifest, history = null }) {
  const readFile = (relative) => {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) {
      return { error: { code: 'missing-root-file', message: `cannot read ${relative} under ${root}: no such file` } };
    }
    return { text: fs.readFileSync(file, 'utf8') };
  };

  const rootFile = readFile(manifest.root_file);
  if (rootFile.error) return { ok: false, derived: null, errors: [rootFile.error] };

  // A repository may route no rules at all: the router is the optional half of the pair,
  // and reporting it absent is an answer, not a failure. The shipped template is not.
  const routerText = fs.existsSync(path.join(root, manifest.router_file))
    ? fs.readFileSync(path.join(root, manifest.router_file), 'utf8')
    : null;

  const { sections, block } = segment(rootFile.text, manifest.markers);
  if (block !== null && block.complete === false) {
    return {
      ok: false,
      derived: null,
      errors: [{
        code: 'half-written-block',
        message: `the repository block in ${manifest.root_file} carries one of its two markers and not the other, near byte ${block.start}`,
      }],
    };
  }

  const { matched, unregistered, unmatched, conflicts } = matchSections(sections, manifest.sections);
  const errors = [...conflicts, ...unregistered, ...unmatched];
  if (errors.length > 0) return { ok: false, derived: null, errors };

  const bodies = {};
  for (const row of matched) {
    bodies[row.entry.id] = {
      start: row.section.start,
      end: row.section.end,
      sha256: row.section.sha256,
      body: row.section.body,
    };
  }

  // The deepest delivery anchor decides how much of the document a truncating runtime
  // still receives, so it is measured from the anchors rather than from the file size.
  let prefixEnd = 0;
  for (const pin of (manifest.pins || []).filter((entry) => entry.kind === 'delivery-anchor')) {
    const section = bodies[pin.section];
    if (!section) continue;
    const end = deliveryAnchorEnd(section, pin);
    if (end !== null) prefixEnd = Math.max(prefixEnd, end);
  }

  const currentHashes = new Set(Object.values(bodies).map((entry) => entry.sha256));
  return {
    ok: true,
    errors: [],
    derived: {
      root_sha256: sha256(rootFile.text),
      budget: { total_bytes: Buffer.byteLength(rootFile.text, 'utf8'), prefix_end_bytes: prefixEnd },
      sections: bodies,
      history: history === null ? [] : dedupeBodies(history, currentHashes),
      repo_rules: {
        path: manifest.router_file,
        present: routerText !== null,
        sha256: routerText === null ? null : sha256(routerText),
        trigger_rows: routerText === null ? [] : parseTableRows(routerText, 'TRIGGER TABLE'),
        index_rows: routerText === null ? [] : parseTableRows(routerText, 'INDEX'),
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. COMPARISON
// ─────────────────────────────────────────────────────────────────────────────

/** The ways a stored `derived` key differs from a freshly composed one. */
function drift(stored, fresh, { compareHistory }) {
  const diffs = [];
  if (stored.root_sha256 !== fresh.root_sha256) diffs.push('the root document hash differs');
  for (const key of ['total_bytes', 'prefix_end_bytes']) {
    if (!stored.budget || stored.budget[key] !== fresh.budget[key]) {
      diffs.push(`budget ${key}: stored ${stored.budget && stored.budget[key]}, measured ${fresh.budget[key]}`);
    }
  }

  const storedIds = Object.keys(stored.sections || {});
  const freshIds = Object.keys(fresh.sections);
  for (const id of freshIds) {
    const storedEntry = (stored.sections || {})[id];
    if (!storedEntry) {
      diffs.push(`section ${id}: not recorded in the manifest`);
      continue;
    }
    const changed = ['start', 'end', 'sha256', 'body'].filter((field) => storedEntry[field] !== fresh.sections[id][field]);
    if (changed.length > 0) diffs.push(`section ${id}: ${changed.join(', ')} differs from the root document`);
  }
  for (const id of storedIds) {
    if (!fresh.sections[id]) diffs.push(`section ${id}: recorded in the manifest but not in the root document`);
  }

  if (compareHistory) {
    const storedHashes = new Set((stored.history || []).map((entry) => entry.sha256));
    const freshHashes = new Set(fresh.history.map((entry) => entry.sha256));
    for (const hash of freshHashes) if (!storedHashes.has(hash)) diffs.push(`history: a released body ${hash.slice(0, 12)} is not recorded`);
    for (const hash of storedHashes) if (!freshHashes.has(hash)) diffs.push(`history: the recorded body ${hash.slice(0, 12)} is no longer released`);
  }

  if (JSON.stringify(stored.repo_rules) !== JSON.stringify(fresh.repo_rules)) {
    diffs.push(`router rows differ from ${fresh.repo_rules.path}`);
  }
  return diffs;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function report(errors) {
  for (const error of errors) console.error(`${TAG} FAIL: ${error.code}: ${error.message}`);
}

/**
 * @param {string[]} argv
 * @param {{readOrigin?: Function, write?: Function}} [hooks] - test seams
 * @returns {number} the process exit code
 */
function main(argv, hooks = {}) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(USAGE);
    return 0;
  }

  if (!fs.existsSync(options.manifest)) {
    console.error(`${TAG} ERROR: the manifest is missing at ${options.manifest}`);
    return 2;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(options.manifest, 'utf8'));
  } catch (error) {
    console.error(`${TAG} ERROR: ${options.manifest} is not valid JSON: ${error.message}`);
    return 2;
  }

  // The write guard runs before the documents are read: a consumer's root file is its
  // own, so rebuilding the shipped copy there would be a quiet overwrite.
  if (options.mode === 'write') {
    const source = sourceStatus({ root: options.root, manifest, readOrigin: hooks.readOrigin || null });
    if (!source.isSource) {
      console.error(`${TAG} ERROR: refusing --write: ${source.reason}`);
      return 2;
    }
  }

  const history = readReleaseHistory({ root: options.root, manifest });
  const composed = composeDerived({
    root: options.root,
    manifest,
    history: history.ok ? history.bodies : [],
  });
  if (!composed.ok) {
    // A root document that is not there is a precondition, not a drift: there is nothing
    // to compare and nothing to write over.
    if (composed.errors.some((error) => error.code === 'missing-root-file')) {
      for (const error of composed.errors) console.error(`${TAG} ERROR: ${error.code}: ${error.message}`);
      return 2;
    }
    report(composed.errors);
    return 1;
  }

  if (options.mode === 'write') {
    const next = { ...manifest, derived: composed.derived };
    (hooks.write || fs.writeFileSync)(options.manifest, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
    console.log(`${TAG} WROTE: ${Object.keys(composed.derived.sections).length} sections, ${manifest.pins.length} pins, ${composed.derived.history.length} history bodies to ${options.manifest}`);
    if (!history.ok) console.log(`${TAG} NOTE: ${history.reason}; the history key is empty`);
    return 0;
  }

  const compareHistory = history.ok;
  const diffs = drift(manifest.derived || {}, composed.derived, { compareHistory });
  if (diffs.length > 0) {
    console.error(`${TAG} FAIL: the manifest's derived key does not match ${manifest.root_file}`);
    for (const line of diffs) console.error(`${TAG}   ${line}`);
    console.error(`${TAG} Run: node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write`);
    return 1;
  }
  if (!compareHistory) console.log(`${TAG} WARN: ${history.reason}; the history key was not compared`);
  console.log(`${TAG} PASS: ${Object.keys(composed.derived.sections).length} sections, ${manifest.pins.length} pins, derived matches ${manifest.root_file}`);
  console.log(`${TAG} Budget: ${composed.derived.budget.prefix_end_bytes} / ${manifest.budget.prefix_bytes} bytes to the last anchor, ${composed.derived.budget.total_bytes} / ${manifest.budget.max_bytes} bytes total, ${composed.derived.history.length} history bodies`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    if (error instanceof UsageError) console.error(USAGE);
    process.exitCode = 2;
  }
}

module.exports = {
  MANIFEST_PATH,
  composeDerived,
  dedupeBodies,
  main,
  sourceStatus,
};
