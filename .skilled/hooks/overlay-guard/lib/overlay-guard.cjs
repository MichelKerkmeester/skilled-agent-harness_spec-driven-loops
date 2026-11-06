// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: overlay-guard core (runtime-neutral policy)                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Refuse a pending write to a file a vendored Skilled tree's      ║
// ║          overlay owns, before the write happens. An edit made in place   ║
// ║          is lost at the next re-pin, so the agent is told which overlay  ║
// ║          file to edit instead. The overlay engine is the one judge: this ║
// ║          module asks its --guard query once per path and never reads the ║
// ║          manifest itself. It only ever answers 'allow' or 'deny'; it     ║
// ║          never applies, captures or writes anything. Each adapter owns   ║
// ║          its own transport and stdout/stderr; this core writes neither.  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// lib -> overlay-guard -> hooks -> .skilled -> the vendored tree root, the same
// tree the engine treats as its default root.
const DEFAULT_TREE_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const ENGINE_RELATIVE = path.join('.skilled', 'commands', 'doctor', 'scripts', 'overlay-engine.cjs');

// The two names a tree with overlays must carry: the setting file, or the
// default folder the engine falls back to without one. When neither exists no
// manifest can, so the hook allows on two stat calls and never loads the
// engine. That is the case in every Skilled repository without overlays. When
// either exists, the engine itself resolves the folder, so it stays the only
// reader of the setting.
const SETTING_FILE = '.skilled-overlays.json';
const DEFAULT_OVERLAY_FOLDER = 'skilled-overlays';

const ENGINE_TIMEOUT_MS = 3_000;
const MAX_STDIO_BYTES = 1024 * 1024;
const EXIT_OWNED = 1;
// Embedded runtimes such as Bun report the host binary as process.execPath,
// and that binary cannot run the engine.
const NODE_BINARY = /^node(\.exe)?$/i.test(path.basename(process.execPath)) ? process.execPath : 'node';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function uniquePaths(paths) {
  const list = Array.isArray(paths) ? paths : [paths];
  return [...new Set(list.filter((item) => typeof item === 'string' && item.trim()))];
}

function oneLine(text) {
  return String(text).replace(/\s*\r?\n\s*/g, ' ').trim();
}

function couldHaveOverlays(treeRoot) {
  return fs.existsSync(path.join(treeRoot, SETTING_FILE)) ||
    fs.existsSync(path.join(treeRoot, DEFAULT_OVERLAY_FOLDER));
}

/**
 * Ask the engine where the manifest lives and whether it exists. Loading the
 * engine runs nothing: its CLI only starts when it is the main module.
 * @returns {boolean}
 */
function hasManifest(treeRoot, enginePath) {
  const engine = require(enginePath);
  return fs.existsSync(engine.createContext(treeRoot).manifestPath);
}

/**
 * Run the engine's --guard for one absolute path.
 * @returns {{owned: boolean, reason?: string, note?: string}}
 */
function guardOne(spawn, enginePath, treeRoot, absolutePath) {
  const result = spawn(NODE_BINARY, [enginePath, '--guard', absolutePath, '--root', treeRoot], {
    cwd: treeRoot,
    encoding: 'utf8',
    timeout: ENGINE_TIMEOUT_MS,
    maxBuffer: MAX_STDIO_BYTES,
    killSignal: 'SIGKILL',
  });
  const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
  const stderr = typeof result.stderr === 'string' ? result.stderr.trim() : '';
  if (result.error) return { owned: false, note: result.error.message };
  if (result.status === 0) return { owned: false };
  if (result.status === EXIT_OWNED && /^refuse:/m.test(stdout)) return { owned: true, reason: stdout };
  return { owned: false, note: 'engine exited ' + result.status + ': ' + (stderr || stdout || 'no output') };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. POLICY EVALUATION (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decide whether a pending write may proceed. 'deny' only when the engine said
 * a path is owned; every error, timeout or unreadable setting allows and
 * carries one note line for the adapter to print on stderr.
 * @param {{paths: string|string[], sessionDir?: string, treeRoot?: string,
 *   enginePath?: string, spawn?: Function}} request
 * @returns {{decision: 'allow'|'deny', reason: string|null, notes: string[]}}
 */
function evaluateWrite(request = {}) {
  const allow = { decision: 'allow', reason: null, notes: [] };
  const paths = uniquePaths(request.paths);
  if (paths.length === 0) return allow;
  const treeRoot = path.resolve(request.treeRoot || DEFAULT_TREE_ROOT);
  if (!couldHaveOverlays(treeRoot)) return allow;

  const enginePath = request.enginePath || path.join(treeRoot, ENGINE_RELATIVE);
  const spawn = request.spawn || spawnSync;
  const sessionDir = request.sessionDir || process.cwd();
  try {
    if (!hasManifest(treeRoot, enginePath)) return allow;
  } catch (error) {
    return { ...allow, notes: ['overlay-guard: could not judge the write, allowing it: ' + oneLine(error.message)] };
  }

  const refusals = [];
  const unjudged = [];
  for (const filePath of paths) {
    const absolutePath = path.resolve(sessionDir, filePath);
    const answer = guardOne(spawn, enginePath, treeRoot, absolutePath);
    if (answer.owned) refusals.push(answer.reason);
    else if (answer.note) unjudged.push(filePath + ' (' + oneLine(answer.note) + ')');
  }
  if (refusals.length > 0) return { decision: 'deny', reason: refusals.join('\n'), notes: [] };
  if (unjudged.length > 0) {
    return { ...allow, notes: ['overlay-guard: could not judge ' + unjudged.join('; ') + ', allowing'] };
  }
  return allow;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAYLOAD HELPERS (shared by the adapters)
// ─────────────────────────────────────────────────────────────────────────────

/** The file named by a tool input's file_path, filePath or path field. */
function fileFieldPath(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  for (const key of ['file_path', 'filePath', 'path']) {
    if (typeof toolInput[key] === 'string' && toolInput[key].trim()) return toolInput[key];
  }
  return null;
}

/** Every path an apply_patch body names: Add, Update and Delete headers plus Move to targets. */
function pathsFromPatch(patchText) {
  if (typeof patchText !== 'string') return [];
  const paths = [];
  for (const match of patchText.matchAll(/^\*\*\* (?:Add|Update|Delete) File:\s*(.+?)\s*$/gm)) paths.push(match[1].trim());
  for (const match of patchText.matchAll(/^\*\*\* Move to:\s*(.+?)\s*$/gm)) paths.push(match[1].trim());
  return paths;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  evaluateWrite,
  fileFieldPath,
  pathsFromPatch,
};
