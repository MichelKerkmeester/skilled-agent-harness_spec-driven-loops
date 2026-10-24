// ───────────────────────────────────────────────────────────────
// MODULE: Private Skill Target Containment
// ───────────────────────────────────────────────────────────────
// A `local-*` skill may be linked into the skills tree from a private checkout.
// Following the link is safe only when its resolved target stays inside a
// directory the operator has declared trusted, so resolve the whole chain and
// test containment instead of trusting the link's name.

import { existsSync, realpathSync, statSync } from 'node:fs';
import { delimiter, isAbsolute, relative, resolve, sep } from 'node:path';

export const PRIVATE_SKILL_ROOTS_ENV = 'SPECKIT_PRIVATE_SKILL_ROOTS';

interface TrustedRoot {
  path: string;
  // A link to the skills root itself would make the scan re-enter its own tree,
  // so only a declared external root may be named by a link directly.
  allowSelf: boolean;
}

function isInside(root: TrustedRoot, target: string): boolean {
  const rel = relative(root.path, target);
  if (rel === '') return root.allowSelf;
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

function trustedRoots(skillsRoot: string): TrustedRoot[] {
  const roots: TrustedRoot[] = [];
  if (existsSync(skillsRoot)) roots.push({ path: realpathSync(skillsRoot), allowSelf: false });
  const declared = process.env[PRIVATE_SKILL_ROOTS_ENV] ?? '';
  for (const part of declared.split(delimiter)) {
    const candidate = part.trim();
    if (!candidate) continue;
    const absolute = resolve(candidate);
    if (existsSync(absolute)) roots.push({ path: realpathSync(absolute), allowSelf: true });
  }
  return roots;
}

function resolvesInside(entryPath: string, roots: TrustedRoot[]): boolean {
  let target: string;
  try {
    target = realpathSync(entryPath);
    if (!statSync(target).isDirectory()) return false;
  } catch {
    return false;
  }
  return roots.some((root) => isInside(root, target));
}

export function isTrustedPrivateSkillLink(entryPath: string, skillsRoot: string): boolean {
  return resolvesInside(entryPath, trustedRoots(skillsRoot));
}

// One scan checks many entries; resolve the trusted roots at most once, and
// only when a `local-*` link is actually met.
export function createPrivateSkillLinkCheck(skillsRoot: string): (entryPath: string) => boolean {
  let roots: TrustedRoot[] | null = null;
  return (entryPath: string): boolean => {
    roots ??= trustedRoots(skillsRoot);
    return resolvesInside(entryPath, roots);
  };
}
