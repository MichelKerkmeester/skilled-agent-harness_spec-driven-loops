// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime-Exclusive Command Scope
// ───────────────────────────────────────────────────────────────────

'use strict';

// A few commands must live in exactly one runtime instead of being mirrored to
// all of them. The goal command is per-runtime because each host reaches the
// feature differently: OpenCode uses a plugin hook, Cursor and Devin inject the
// bound goal from a hook, and Pi registers a hidden extension tool.
// Claude receives filtered mirrors, while OpenCode, Cursor and Pi each own a
// hand-authored runtime-native command beside their mirrored ones.
//
// The mirror generators consult these two lists so they neither cross-copy a
// runtime's command outward nor prune a runtime's own native command as drift.
// Anything not named here keeps the default "one canonical, mirrored everywhere"
// behavior untouched.

// Canonical .skilled/commands/ paths (relative to that root) that must NOT be
// mirrored into any generated runtime tree.
const CANONICAL_MIRROR_EXCLUDES = new Set();

// Real, hand-authored command entries a generator must leave in place — never
// prune, never flag as a real-file-where-a-symlink-belongs. Keyed by the mirror
// directory the generator writes into; the value is the entry basename (a file
// for flat trees, a directory name for Devin's nested skill tree).
const RUNTIME_NATIVE_COMMANDS = {
  '.opencode/commands': new Set(['goal-opencode.md']),
  '.cursor/commands': new Set(['goal-cursor.md']),
  '.pi/prompts': new Set(['goal-pi.md']),
};

function isCanonicalMirrorExcluded(relativePath) {
  return CANONICAL_MIRROR_EXCLUDES.has(relativePath);
}

function isRuntimeNativeCommand(mirrorDir, name) {
  const set = RUNTIME_NATIVE_COMMANDS[mirrorDir];
  return set ? set.has(name) : false;
}

module.exports = {
  CANONICAL_MIRROR_EXCLUDES,
  RUNTIME_NATIVE_COMMANDS,
  isCanonicalMirrorExcluded,
  isRuntimeNativeCommand,
};
