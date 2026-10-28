// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Checklist Seats
// ───────────────────────────────────────────────────────────────────
'use strict';

// Which checklist a file has to load, and who listed it. A row arrives from the base layer, from
// the repository config, from a hub surface or from a skill outside the hub, and the seat that
// listed it is what rule-override precedence later reads, so the seat stays beside the list
// rather than inside it. A declaration a reader could not follow is reported instead of
// skipped, because a silent skip makes a broken declaration look like no declaration at all.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

const qualityConfig = require('./quality-config.cjs');

const {
  HUB_ROOT, REPAIRS, isRegularFile, matchesGlob, readJson, realpathOrSelf, textMarkerMatches,
} = require('./gate-core.cjs');
const { authored, declaredSurfaces, effectiveExtensions } = require('./gate-files.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ROW VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const CHECKLIST_SELECTOR_KEYS = Object.freeze(['paths', 'extensions', 'contentMarkers']);
const CHECKLIST_ROW_KEYS = Object.freeze(['file', ...CHECKLIST_SELECTOR_KEYS]);
// An extension without its dot never compares equal to the extension of a file, so such
// a row would silently cover no file at all.
const CHECKLIST_EXTENSION = /^\.[^./\s]+$/;

function describeSelectors(row) {
  return ['paths', 'extensions', 'contentMarkers']
    .filter((key) => Array.isArray(row[key]))
    .map((key) => `${key} ${row[key].join(' ')}`)
    .join(', ');
}

function hubFile(file, skillsDir) {
  return path.join(skillsDir, file.slice('hub:'.length));
}

// The row rules the metadata gate applies to a declared quality block, read again here
// because a private skill is never reached by that gate and this runner is the only
// reader left. A row that fails one is reported with its reason and never read, so a
// declaration nobody could follow cannot load a file its author did not ship.
function outsideRowFault(row, skillRoot) {
  const invalid = (reason) => ({ code: 'CHECKLIST_ROW_INVALID', reason });
  const outside = (file) => ({ code: 'CHECKLIST_OUTSIDE_SKILL', reason: `names ${JSON.stringify(file)}, which lies outside the skill folder` });
  if (!row || typeof row !== 'object' || Array.isArray(row)) return invalid('must be a JSON object');
  if (typeof row.file !== 'string' || row.file.trim() === '') return invalid('file must name a .md path inside the skill folder');
  const root = path.resolve(skillRoot);
  const target = path.resolve(root, row.file);
  const rel = path.relative(root, target);
  if (path.isAbsolute(row.file) || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    return outside(row.file);
  }
  // A `..` segment is refused however it resolves, because it reaches the same file as
  // a plain inside path and a reader cannot tell which of the two the author meant. The
  // test reads segments, so a name that merely begins with dots stays a legal name.
  if (row.file.split('/').includes('..')) return invalid(`names ${JSON.stringify(row.file)}, which holds a .. segment`);
  if (!/\.md$/.test(row.file)) return invalid('file must name a .md path inside the skill folder');
  const unknown = Object.keys(row).filter((key) => !CHECKLIST_ROW_KEYS.includes(key));
  if (unknown.length > 0) return invalid(`holds unknown key ${unknown.join(', ')}`);
  let selectors = 0;
  for (const key of CHECKLIST_SELECTOR_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(row, key)) continue;
    selectors += 1;
    const value = row[key];
    const isList = Array.isArray(value) && value.length > 0
      && value.every((entry) => typeof entry === 'string' && entry.trim() !== '');
    if (!isList) return invalid(`${key} must be a non-empty array of non-blank strings`);
    const undotted = key === 'extensions' ? value.find((entry) => !CHECKLIST_EXTENSION.test(entry)) : undefined;
    if (undotted !== undefined) return invalid(`${key} entry ${JSON.stringify(undotted)} must start with a dot`);
  }
  if (selectors === 0) return invalid(`names no selector, one of ${CHECKLIST_SELECTOR_KEYS.join(', ')}`);
  // A link reads as an inside path until it is resolved, so the containment test runs
  // again on the real path of both ends, as the file scope already does. A name that is
  // not there resolves through the folder that holds it, so a link above the missing
  // name still answers the test, and a link that leaves the folder is refused before
  // anything reads its path.
  if (!qualityConfig.isInside(realpathOrSelf(target), realpathOrSelf(root))) return outside(row.file);
  return null;
}

// A present quality block must name at least one checklist row. A block a reader cannot
// follow is reported rather than skipped, because a silent skip makes a declaration
// nobody could load look exactly like no declaration at all.
function outsideQualityFaults(quality) {
  if (!quality || typeof quality !== 'object' || Array.isArray(quality)) return ['must be a JSON object'];
  const faults = [];
  const unknown = Object.keys(quality).filter((key) => key !== 'checklists');
  if (unknown.length > 0) faults.push(`holds unknown key ${unknown.join(', ')}. A skill names checklists only, never a command`);
  if (!Array.isArray(quality.checklists) || quality.checklists.length === 0) faults.push('checklists must be a non-empty array');
  return faults;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROW DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

// A base-layer row always names a hub file. A repository row names a file of its own,
// relative to the root, or opts into a hub file with the hub: prefix. An outside skill
// declares its quality rows beside its surface, so they arrive through the same surface
// discovery the labels come from and resolve against that skill's own folder. Such a row
// is named after the folder its path resolves through, which is the name the hub: label
// looks for, whether or not the skill id matches it.
function checklistRows(context) {
  const rows = context.merged.checklists.map((row) => ({
    owner: null,
    skillRoot: null,
    seat: row.layer === 'repo' ? 'repo-config' : 'default',
    file: row.file,
    path: row.file.startsWith('hub:') ? hubFile(row.file, path.dirname(HUB_ROOT)) : path.join(context.root, row.file),
    why: row.why || `${context.config.path}, ${describeSelectors(row)}`,
    selectors: row,
  }));
  const faults = [];
  const registry = readJson(path.join(context.declHub, 'mode-registry.json'));
  const hubName = path.basename(context.declHub);
  for (const mode of Array.isArray(registry.modes) ? registry.modes : []) {
    const declared = mode && mode.quality && Array.isArray(mode.quality.checklists) ? mode.quality.checklists : [];
    const owner = mode && mode.surfaceDetection && typeof mode.surfaceDetection.label === 'string'
      ? mode.surfaceDetection.label.toUpperCase()
      : null;
    for (const row of declared) {
      rows.push({
        owner,
        skillRoot: null,
        seat: 'hub-surface',
        file: `hub:${hubName}/${row.file}`,
        path: path.join(context.declHub, row.file),
        why: `${owner ? `${owner} surface` : mode.workflowMode}, ${describeSelectors(row)}`,
        selectors: row,
      });
    }
  }
  for (const surface of declaredSurfaces(context.declHub)) {
    if (!surface.skillRoot || surface.quality === undefined) continue;
    const root = path.resolve(surface.skillRoot);
    const folder = path.basename(root);
    // A fault keeps the skill folder that declared it, so its reader can tell whether that
    // declaration reaches the change and gate it only where it does.
    const report = (code, message) => faults.push({
      code, repair: REPAIRS[code], message, skillRoot: root,
    });
    const blockFaults = outsideQualityFaults(surface.quality);
    for (const reason of blockFaults) report('CHECKLIST_ROW_INVALID', `${surface.label} quality ${reason}`);
    if (blockFaults.length > 0) continue;
    surface.quality.checklists.forEach((row, index) => {
      const fault = outsideRowFault(row, root);
      if (fault) {
        report(fault.code, `${surface.label} quality.checklists[${index}] ${fault.reason}`);
        return;
      }
      rows.push({
        owner: surface.label,
        skillRoot: root,
        seat: 'outside-skill',
        file: `hub:${folder}/${row.file}`,
        path: path.resolve(root, row.file),
        why: `${surface.label} surface, ${describeSelectors(row)}`,
        selectors: row,
      });
    });
  }
  return { rows, faults };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ROW SELECTION
// ─────────────────────────────────────────────────────────────────────────────

function selectorsMatch(selectors, facts, context) {
  const kinds = ['paths', 'extensions', 'contentMarkers'].filter((key) => Array.isArray(selectors[key]));
  if (kinds.length === 0) return false;
  return kinds.every((key) => {
    if (key === 'paths') return matchesGlob(selectors.paths, facts.matchPath);
    if (key === 'extensions') {
      const own = effectiveExtensions(facts, context);
      return selectors.extensions.some((ext) => own.includes(ext.toLowerCase()));
    }
    const lowerText = facts.text ? facts.text.toLowerCase() : '';
    return lowerText !== '' && selectors.contentMarkers.some((marker) => textMarkerMatches(lowerText, marker.toLowerCase()));
  });
}

// A base-layer row may be scoped to the repository that declares this hub, because a
// framework-specific standard handed to a file in another repository claims an authority the
// runner cannot check. The two roots the run already resolved answer that, so the row lists
// nothing outside the repository the hub lives in.
function sameRepositoryAsHub(context) {
  return qualityConfig.isInside(context.declHub, context.rootReal);
}

// A row the hub or the repository declares is gated on the surface label the hub itself
// selected. A row an outside skill declares is gated on that skill's folder having
// detected the file, because two skills may share a label or a skill id and an outside
// skill may reuse a label the hub uses too.
function rowApplies(row, facts) {
  if (row.skillRoot !== null) return facts.skillRoots.has(row.skillRoot);
  return row.owner === null || facts.hubLabels.has(row.owner);
}

// A fault on an outside declaration gates only where that declaration applies, because a
// malformed skill that no in-scope file reached cannot make this verdict untrustworthy. The
// skill folder is the same test a readable row uses, and it stays unique where a label a
// skill reuses from the hub does not.
function faultApplies(fault, facts) {
  return facts.skillRoots.has(fault.skillRoot);
}

function resolveChecklists(files, context) {
  const checklists = [];
  const declaredRows = checklistRows(context);
  const scoped = files.filter(authored);
  // A declaration that applies to no scoped file is reported beside the gate rather than
  // through it, so one broken skill in a shared hub cannot stop every repository.
  const errors = [];
  const warnings = [];
  for (const fault of declaredRows.faults) {
    const entry = { code: fault.code, repair: fault.repair, message: fault.message };
    if (scoped.some((facts) => faultApplies(fault, facts))) errors.push(entry);
    else warnings.push(entry);
  }
  const sameRepository = sameRepositoryAsHub(context);
  // The seats that listed each file stay beside the list rather than in it, so a run's
  // checklist rows keep their shape and only an explanation reports where a row came from.
  const seats = new Map();
  for (const row of declaredRows.rows) {
    if (row.selectors.hubRepo === true && !sameRepository) continue;
    const matched = scoped.filter((facts) => rowApplies(row, facts) && selectorsMatch(row.selectors, facts, context));
    if (matched.length === 0) continue;
    const listedBy = seats.get(row.file) || [];
    for (const facts of matched) listedBy.push({ seat: row.seat, file: facts.rel, owner: row.owner });
    seats.set(row.file, listedBy);
    const existing = checklists.find((entry) => entry.file === row.file);
    if (existing) {
      for (const facts of matched) if (!existing.files.includes(facts.rel)) existing.files.push(facts.rel);
      continue;
    }
    checklists.push({ file: row.file, path: row.path, why: row.why, files: matched.map((facts) => facts.rel) });
    if (!isRegularFile(row.path)) {
      errors.push({ code: 'CHECKLIST_MISSING', message: `${row.file} is declared but ${row.path} is not a regular file`, repair: REPAIRS.CHECKLIST_MISSING });
    }
  }
  return { checklists, errors, warnings, seats };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { resolveChecklists };
