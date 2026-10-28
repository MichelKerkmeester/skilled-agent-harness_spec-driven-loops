// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Enforcement Layers
// ───────────────────────────────────────────────────────────────────
'use strict';

// Which hook and workflow layers enforce comment hygiene in this repository. A layer is present
// only when it would really run: the hook names a checker that exists and can run, the hook's own
// trust gate lets it run here, and the CI job or runtime hook config names a file this checkout
// ships. A present layer that scans whole files is what lets a finding on an unchanged line
// block, so the probe is deliberately strict.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { realpathOrSelf } = require('./gate-core.cjs');
const { gitValue } = require('./gate-context.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HYGIENE_REFERENCE = /check-comment-hygiene\.sh\b/;
// A hook spells the checker path after a shell variable whose value a read cannot know, or
// after a substitution, or after nothing at all. The path is therefore read back from the
// checker name to the last boundary in front of it, and whatever stood in front of that
// boundary is taken as a root the probe already knows, because the probe reads the hook as
// text and never runs it. One pattern cannot do this: a substitution nests, a parameter
// default puts a brace pair in the prefix, and a plain path carries no prefix at all.
const PATH_CHARACTER = /[A-Za-z0-9_.\/-]/;
const SOURCE_ROOTS = Object.freeze(['', '.skilled', '.opencode']);
const POST_EDIT_CONFIGS = Object.freeze(['.claude/settings.json', '.codex/hooks.json', '.cursor/hooks.json', '.devin/hooks.v1.json']);
const POST_EDIT_PATH = /[A-Za-z0-9_./-]*post-edit-quality[A-Za-z0-9_./-]*\.(?:cjs|mjs|js|sh)\b/g;

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRE-COMMIT PROBE
// ─────────────────────────────────────────────────────────────────────────────

// A hook can name the checker in a comment as well as in a call, and a call inside a
// comment is a call nobody makes. A # inside a quote is text rather than a comment start,
// and so is the one in a parameter expansion, which has no space in front of it. A
// backslash outside quotes takes the meaning from the character after it, so an escaped
// quote opens no quote. Inside double quotes it escapes a quote, a backslash or a dollar
// sign, and inside single quotes it is literal.
const DOUBLE_QUOTE_ESCAPES = new Set(['"', '\\', '$']);

function stripShellComments(text) {
  let kept = '';
  let quote = null;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quote === "'") {
      kept += char;
      if (char === "'") quote = null;
    } else if (char === '\\' && (quote === null || DOUBLE_QUOTE_ESCAPES.has(next))) {
      kept += char + (next === undefined ? '' : next);
      index += 1;
    } else if (quote) {
      kept += char;
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
      kept += char;
    } else if (char === '#' && (index === 0 || /[\s;|&()]/.test(text[index - 1]))) {
      while (index < text.length && text[index] !== '\n') index += 1;
      kept += '\n';
    } else {
      kept += char;
    }
  }
  return kept;
}

// Present only when a pre-commit hook names the checker, git would run it, the hook's
// own trust gate lets it run in this repository, and the checker the hook names really
// can run. A present layer lends whole-file authority to that checker, so a hook whose
// path names nothing runnable is broken rather than present.
function probePreCommit(context) {
  if (!context.git) return 'absent';
  const hooks = gitValue(context, ['rev-parse', '--path-format=absolute', '--git-path', 'hooks']);
  if (!hooks) return 'unknown';
  const hook = path.join(hooks, 'pre-commit');
  let text;
  try {
    text = fs.readFileSync(hook, 'utf8');
  } catch (error) {
    return error.code === 'ENOENT' ? 'absent' : 'unknown';
  }
  const code = stripShellComments(text);
  if (!HYGIENE_REFERENCE.test(code)) return 'absent';
  try {
    fs.accessSync(hook, fs.constants.X_OK);
  } catch {
    return 'broken';
  }
  // The hook's own repository is read through the real path, because a hook installed
  // machine-wide is a link into the checkout that ships it, and that checkout is where
  // its checker lives rather than the repository under test.
  const hookCommon = gitValue(context, ['rev-parse', '--path-format=absolute', '--git-common-dir'], path.dirname(realpathOrSelf(hook)));
  if (/skilled\.trustRepoHooks/.test(text)) {
    const repoCommon = gitValue(context, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
    const trusted = gitValue(context, ['config', '--local', '--bool', 'skilled.trustRepoHooks']) === 'true';
    if ((!hookCommon || hookCommon !== repoCommon) && !trusted) return 'untrusted';
  }
  return checkerCandidates(code, checkerRoots(context, hookCommon)).some(isRunnableFile) ? 'present' : 'broken';
}

function isRunnableFile(file) {
  try {
    if (!fs.statSync(file).isFile()) return false;
    fs.accessSync(file, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

// Every spelling a hook carries is a candidate, and one runnable spelling settles the
// layer. A hook builds the path from a variable, a substitution or the folder it runs in,
// so each spelling is tried as a path under each root and, where it is absolute, as the
// path it literally names.
function checkerCandidates(text, roots) {
  const candidates = [];
  for (const found of text.matchAll(/check-comment-hygiene\.sh\b/g)) {
    let start = found.index;
    while (start > 0 && PATH_CHARACTER.test(text[start - 1])) start -= 1;
    const word = text.slice(start, found.index + found[0].length);
    const spelled = text[start - 1] === '$' ? word.replace(/^[A-Za-z0-9_]+/, '') : word;
    if (path.isAbsolute(spelled)) candidates.push(spelled);
    const rel = rootRelative(spelled);
    if (!rel) continue;
    for (const root of roots) candidates.push(path.join(root, rel));
  }
  return candidates;
}

// A hook builds the path from the folder it runs in, so the segments above the folder it
// climbed from are folded away rather than allowed to leave the roots the caller tries.
function rootRelative(spelled) {
  const parts = [];
  for (const part of spelled.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return parts.join('/');
}

function checkerRoots(context, hookCommon) {
  const roots = [context.root];
  if (hookCommon) roots.push(path.dirname(hookCommon));
  return roots.flatMap((root) => SOURCE_ROOTS.map((sub) => (sub ? path.join(root, sub) : root)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CI AND POST-EDIT PROBES
// ─────────────────────────────────────────────────────────────────────────────

function probeCi(context) {
  const dir = path.join(context.root, '.github', 'workflows');
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch (error) {
    return error.code === 'ENOENT' ? 'absent' : 'unknown';
  }
  try {
    const found = names.filter((name) => /\.ya?ml$/i.test(name))
      .some((name) => HYGIENE_REFERENCE.test(fs.readFileSync(path.join(dir, name), 'utf8')));
    return found ? 'present' : 'absent';
  } catch {
    return 'unknown';
  }
}

// A runtime hook config that names the post-edit adapter runs it from the project
// folder, so a named adapter missing from this repository is a broken hook. Only a
// token holding a folder is a path: a bare file name in a config is a log label.
function probePostEdit(context) {
  let configured = false;
  const named = [];
  for (const config of POST_EDIT_CONFIGS) {
    let text;
    try {
      text = fs.readFileSync(path.join(context.root, config), 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      return 'unknown';
    }
    if (!text.includes('post-edit-quality')) continue;
    configured = true;
    named.push(...(text.match(POST_EDIT_PATH) || []).filter((token) => token.includes('/')));
  }
  if (!configured) return 'absent';
  const missing = named.some((file) => !fs.existsSync(path.join(context.root, file.replace(/^\.?\/+/, ''))));
  return missing ? 'broken' : 'present';
}

/**
 * Inspect the configured hook and CI layers that enforce comment hygiene.
 *
 * @param {Object} context - Run context containing the repository root and hook environment.
 * @returns {{pre_commit_hygiene:string, ci_hygiene:string, post_edit:string}} Layer presence states.
 */
function probeLayers(context) {
  return { pre_commit_hygiene: probePreCommit(context), ci_hygiene: probeCi(context), post_edit: probePostEdit(context) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LAYER RULE
// ─────────────────────────────────────────────────────────────────────────────

const WHOLE_FILE_LAYERS = Object.freeze([
  ['pre_commit_hygiene', 'the pre-commit hook scans whole files'],
  ['ci_hygiene', 'the CI hygiene job scans whole files'],
]);

// A hygiene finding on an unchanged line of a touched file blocks only when a layer
// that scans whole files would fail the commit anyway. Otherwise it is debt the change
// did not write.
function applyLayerRule(findings, layers) {
  const layer = WHOLE_FILE_LAYERS.find(([key]) => layers[key] === 'present');
  return findings.map((entry) => {
    if (entry.check !== 'comment-hygiene' || entry.origin !== 'touched-file') return entry;
    if (layer) return { ...entry, severity: 'P0', blocking: true, reason: `${entry.reason}, blocking because ${layer[1]}` };
    return { ...entry, severity: 'P1', blocking: false };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { applyLayerRule, probeLayers };
