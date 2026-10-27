// ───────────────────────────────────────────────────────────────
// MODULE: Private Skill Target Containment (shared rule)
// ───────────────────────────────────────────────────────────────
// A `local-*` skill may be linked into the skills tree from a private checkout.
// Following the link is safe only when its resolved target stays inside a
// directory the operator has declared trusted, so resolve the whole chain and
// test containment instead of trusting the link's name.
//
// This is plain CommonJS so every reader can load it on every supported Node
// version: the TypeScript runtime imports it, and the CommonJS and plugin
// readers outside the runtime require it, so the rule has one copy.

'use strict';

// Called through the module object, so a test can observe how often a path resolves.
const fs = require('node:fs');
const { delimiter, isAbsolute, relative, resolve, sep } = require('node:path');

/** Environment variable naming extra trusted roots, joined by the platform path delimiter. */
const PRIVATE_SKILL_ROOTS_ENV = 'SPECKIT_PRIVATE_SKILL_ROOTS';

// A root is { path, allowSelf }. A link to the skills root itself would make the
// scan re-enter its own tree, so only a declared external root may be named by a
// link directly.
function isInside(root, target) {
  const rel = relative(root.path, target);
  if (rel === '') return root.allowSelf;
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

function trustedRoots(skillsRoot) {
  const roots = [];
  if (fs.existsSync(skillsRoot)) roots.push({ path: fs.realpathSync(skillsRoot), allowSelf: false });
  const declared = process.env[PRIVATE_SKILL_ROOTS_ENV] ?? '';
  for (const part of declared.split(delimiter)) {
    const candidate = part.trim();
    if (!candidate) continue;
    const absolute = resolve(candidate);
    if (fs.existsSync(absolute)) roots.push({ path: fs.realpathSync(absolute), allowSelf: true });
  }
  return roots;
}

function resolvesInside(entryPath, roots) {
  let target;
  try {
    target = fs.realpathSync(entryPath);
    if (!fs.statSync(target).isDirectory()) return false;
  } catch {
    return false;
  }
  return roots.some((root) => isInside(root, target));
}

/**
 * True when a top-level `local-*` entry resolves to a directory inside a trusted root.
 * @param {string} entryPath - The skills-root entry to resolve.
 * @param {string} skillsRoot - The skills root the entry was listed from.
 * @returns {boolean} Whether the entry's real target is a directory inside a trusted root.
 */
function isTrustedPrivateSkillLink(entryPath, skillsRoot) {
  return resolvesInside(entryPath, trustedRoots(skillsRoot));
}

/**
 * Return a per-scan check that resolves the trusted roots at most once, and only
 * when a `local-*` link is actually met, because one scan checks many entries.
 * @param {string} skillsRoot - The skills root the scan lists.
 * @returns {(entryPath: string) => boolean} A check that reports whether one entry resolves inside a trusted root.
 */
function createPrivateSkillLinkCheck(skillsRoot) {
  let roots = null;
  return (entryPath) => {
    roots ??= trustedRoots(skillsRoot);
    return resolvesInside(entryPath, roots);
  };
}

module.exports = {
  PRIVATE_SKILL_ROOTS_ENV,
  isTrustedPrivateSkillLink,
  createPrivateSkillLinkCheck,
};
