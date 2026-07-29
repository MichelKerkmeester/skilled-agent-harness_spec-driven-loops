'use strict';

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Runtime-Exclusive Command Scope                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// A few commands must live in exactly one runtime instead of being mirrored to
// all of them. The goal triggers are the case this exists for: each goal-capable
// runtime carries only its own. OpenCode reads .opencode/commands/goal-opencode.md
// natively (and Claude whole-dir-symlinks that tree, so it sees the same file),
// while Cursor, Devin, and Pi each own a hand-authored, runtime-native command
// that drives the shared bin/goal.cjs manage CLI. Codex has no goal hook, so it
// gets no goal command at all.
//
// The mirror generators consult these two lists so they neither cross-copy the
// OpenCode command outward nor prune a runtime's own native command as drift.
// Anything not named here keeps the default "one canonical, mirrored everywhere"
// behavior untouched.

// Canonical .opencode/commands/ paths (relative to that root) that must NOT be
// mirrored into any generated runtime tree.
const CANONICAL_MIRROR_EXCLUDES = new Set(['goal-opencode.md']);

// Real, hand-authored command entries a generator must leave in place — never
// prune, never flag as a real-file-where-a-symlink-belongs. Keyed by the mirror
// directory the generator writes into; the value is the entry basename (a file
// for flat trees, a directory name for Devin's nested skill tree).
const RUNTIME_NATIVE_COMMANDS = {
  '.cursor/commands': new Set(['goal-cursor.md']),
  '.devin/skills': new Set(['goal-devin']),
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
