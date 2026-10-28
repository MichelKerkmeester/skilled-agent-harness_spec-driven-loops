// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate File Facts
// ───────────────────────────────────────────────────────────────────
'use strict';

// One record per scoped file, and the labels a caller reads off it. The facts are what every
// later step asks instead of re-reading a path: which comment family a file belongs to, how it
// should be parsed, whether the repository excluded it, and whether a build declared it output
// rather than source. The labels are the hub's own surface detection, so an explanation and a
// run name a file the same way.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const qualityConfig = require('./quality-config.cjs');

const {
  REPLAY_LIB_PATH, fileMarkerMatches, interpreterFromShebang, matchesGlob, pathMarkerMatches,
  realpathOrSelf, textMarkerMatches, toPosix,
} = require('./gate-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const BINARY_SNIFF_BYTES = 8192;

// TypeScript, VS Code, dev containers and ESLint read these JSON files with comments
// and trailing commas, so a strict parse would report a fault that no tool sees.
const JSONC_BASENAME = /^(?:(?:ts|js)config(?:\.[^/]*)?|\.?devcontainer|\.eslintrc)\.json$/i;
const JSONC_FOLDER = /(?:^|\/)\.vscode\/[^/]+\.json$/i;

const SHELL_PARSERS = new Set(['bash', 'sh']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. FILE FACTS
// ─────────────────────────────────────────────────────────────────────────────

function syntaxKind(rel, language, interpreter) {
  const ext = path.extname(rel).toLowerCase();
  if (language === 'python') return 'python';
  if (language === 'shell') {
    const shell = interpreter || (['.sh', '.bash'].includes(ext) ? 'bash' : null);
    return SHELL_PARSERS.has(shell) ? 'shell' : null;
  }
  if (language === 'javascript') return ext === '.cjs' ? 'cjs' : ext === '.mjs' ? 'mjs' : 'js';
  if (language === 'jsonc') return 'jsonc';
  if (ext === '.json') return JSONC_BASENAME.test(path.basename(rel)) || JSONC_FOLDER.test(rel) ? 'jsonc' : 'json';
  if (language === 'yaml' || language === 'toml') return language;
  return null;
}

// Path selectors read the resolved path: a hub file reached through a link is read
// where the hub keeps it, and any other file inside the repository by its real place
// there.
function matchPathFor(facts, context) {
  if (facts.real && qualityConfig.isInside(facts.real, context.skilledDir)) {
    return toPosix(path.join(path.basename(context.skilledDir), path.relative(context.skilledDir, facts.real)));
  }
  if (facts.real && qualityConfig.isInside(facts.real, context.rootReal)) return toPosix(path.relative(context.rootReal, facts.real));
  return facts.rel;
}

// A declared generated file is a build product, not source: the adapter reads whether
// it is current and no authored-file path reads it, so it is marked rather than left to
// the exclude list. Only a base-layer row names one, because a row the repository adds
// carries its own command and runs as a configured check.
function declaredGenerated(rel, context) {
  return context.merged.generated.some((row) => row.layer === 'defaults' && matchesGlob(row.paths, rel));
}

// Only the repository's own exclude list is read here, because the base list holds the
// build folders a declared path lives in. A repository exclude therefore wins over a
// declaration, which is the one way it can keep a build output out of the run.
function repositoryExclude(context) {
  const raw = context.configLoaded && context.configLoaded.raw;
  return raw && Array.isArray(raw.exclude) ? raw.exclude : [];
}

// The files an authored-file path may read: an excluded file was never read, and a
// generated file is output rather than source.
function authored(facts) {
  return facts.unchecked !== 'excluded' && !facts.generated;
}

function fileFacts(file, context) {
  const facts = {
    ...file, unchecked: null, text: null, language: null, languageSource: null,
    interpreter: null, family: null, syntax: null, real: null, insideHub: false, labels: [], generated: false,
    excludedByRepo: false, hubLabels: new Set(), skillRoots: new Set(),
  };
  facts.real = realpathOrSelf(file.abs);
  // The hub's plugins folder may be a link to a folder outside .skilled/, and the files
  // it reaches are still the hub's own code.
  facts.insideHub = qualityConfig.isInside(facts.real, context.skilledDir)
    || (context.hubPluginsDir !== null && qualityConfig.isInside(facts.real, context.hubPluginsDir));
  facts.matchPath = matchPathFor(facts, context);
  if (matchesGlob(repositoryExclude(context), file.rel)) {
    facts.unchecked = 'excluded';
    facts.excludedByRepo = true;
    return facts;
  }
  if (declaredGenerated(file.rel, context)) {
    facts.generated = true;
    return facts;
  }
  if (matchesGlob(context.merged.exclude, file.rel)) {
    facts.unchecked = 'excluded';
    return facts;
  }
  let buffer;
  try {
    const stat = fs.statSync(file.abs);
    if (!stat.isFile()) {
      facts.unchecked = 'not a regular file';
      return facts;
    }
    if (stat.size > MAX_FILE_BYTES) {
      facts.unchecked = 'size';
      return facts;
    }
    buffer = fs.readFileSync(file.abs);
  } catch {
    facts.unchecked = 'unreadable';
    return facts;
  }
  if (buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0)) {
    facts.unchecked = 'binary';
    return facts;
  }
  facts.text = buffer.toString('utf8').replace(/^﻿/, '');
  const firstLine = facts.text.split('\n', 1)[0];
  facts.interpreter = interpreterFromShebang(firstLine);
  const ext = path.extname(file.rel).toLowerCase();
  // The order is the checker's own: a shebang, then an extension the repository maps
  // to a family, then the table. A mapped extension names a family and no language.
  const mapped = context.merged.commentHygiene.extensions[ext];
  if (facts.interpreter && context.table.byInterpreter[facts.interpreter]) {
    facts.language = context.table.byInterpreter[facts.interpreter];
    facts.languageSource = 'shebang';
  } else if (mapped) {
    facts.family = mapped;
    facts.languageSource = 'config';
  } else if (context.table.byExtension[ext]) {
    facts.language = context.table.byExtension[ext];
    facts.languageSource = 'extension';
  }
  if (facts.language) facts.family = context.table.languages[facts.language].family;
  facts.syntax = syntaxKind(file.rel, facts.language, facts.languageSource === 'shebang' ? facts.interpreter : null);
  if (!facts.family && !facts.syntax) facts.unchecked = 'no comment family';
  return facts;
}

// A file whose shebang names another language than its extension does, or whose
// name has no known extension, is read with that language's extensions, so a Python
// program named .sh gets the Python checklist. A file whose two signals agree keeps
// its own extension, so a .cjs file never reads as .js.
function effectiveExtensions(facts, context) {
  const own = path.extname(facts.rel).toLowerCase();
  if (facts.languageSource === 'shebang' && context.table.byExtension[own] !== facts.language) {
    return context.table.languages[facts.language].extensions || [];
  }
  return [own];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SURFACES AND LABELS
// ─────────────────────────────────────────────────────────────────────────────

function declaredSurfaces(declHub) {
  return require(REPLAY_LIB_PATH).declaredSurfaces(declHub);
}

// A specific surface matches on any of its markers. The fallback is the hub's own
// code, so on a real file it holds only through a path marker and only when the
// resolved path lies inside the hub's own .skilled/ folder, or inside the folder its
// plugins link resolves to when that folder is not an ancestor of the hub. An outside surface records
// the folder of the skill that declared it, which stays unique where a skill id does
// not, so a row belongs to the skill that shipped it rather than to a label or an id
// it shares. A hub surface records its label, because a hub row is selected only by
// the hub's own detection and never by an outside skill that reuses the label.
function fileLabels(facts, surfaces) {
  const lowerPath = facts.matchPath.toLowerCase();
  const lowerBase = path.posix.basename(lowerPath);
  const lowerText = facts.text ? facts.text.toLowerCase() : '';
  const labels = [];
  for (const surface of surfaces) {
    const paths = surface.pathMarkers || [];
    if (surface.role === 'fallback') {
      if (facts.insideHub && paths.some((marker) => pathMarkerMatches(lowerPath, marker))) {
        labels.push(surface.label);
        facts.hubLabels.add(surface.label);
      }
      continue;
    }
    const hit = paths.some((marker) => pathMarkerMatches(lowerPath, marker))
      || (surface.fileMarkers || []).some((marker) => fileMarkerMatches(lowerBase, marker))
      || (lowerText !== '' && (surface.contentMarkers || []).some((marker) => textMarkerMatches(lowerText, marker)));
    if (hit) {
      labels.push(surface.label);
      if (surface.skillRoot) facts.skillRoots.add(path.resolve(surface.skillRoot));
      else facts.hubLabels.add(surface.label);
    }
  }
  return labels.length > 0 ? labels : ['UNKNOWN'];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  authored, declaredSurfaces, effectiveExtensions, fileFacts, fileLabels,
};
