'use strict';

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Runtime-Exclusive Command Scope                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// A few commands must live in exactly one runtime instead of being mirrored to
// all of them. Goal and vision are per-runtime because each host reaches the
// feature differently: OpenCode uses a plugin hook, Cursor and Devin use an MCP
// tool, and Pi uses a hidden extension tool. Claude has no sk-vision integration.
// OpenCode reads its native commands directly, while Claude receives filtered
// mirrors and Cursor and Pi each own hand-authored runtime-native commands.
//
// The mirror generators consult these two lists so they neither cross-copy the
// OpenCode command outward nor prune a runtime's own native command as drift.
// Anything not named here keeps the default "one canonical, mirrored everywhere"
// behavior untouched.

// Canonical .opencode/commands/ paths (relative to that root) that must NOT be
// mirrored into any generated runtime tree.
const CANONICAL_MIRROR_EXCLUDES = new Set(['goal-opencode.md', 'vision.md']);

// Real, hand-authored command entries a generator must leave in place — never
// prune, never flag as a real-file-where-a-symlink-belongs. Keyed by the mirror
// directory the generator writes into; the value is the entry basename (a file
// for flat trees, a directory name for Devin's nested skill tree).
const RUNTIME_NATIVE_COMMANDS = {
  '.cursor/commands': new Set(['goal-cursor.md', 'vision.md']),
  '.pi/prompts': new Set(['goal-pi.md', 'vision.md']),
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
