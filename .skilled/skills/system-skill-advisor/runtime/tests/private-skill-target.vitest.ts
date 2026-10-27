// ───────────────────────────────────────────────────────────────
// MODULE: Private Skill Target Containment Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

// The rule is plain CommonJS and resolves paths through the shared `fs` module object,
// so a spy on that object counts how often a path is resolved. Behavior is unchanged.
const sharedFs = createRequire(import.meta.url)('node:fs') as typeof import('node:fs');
const realpathSpy = vi.spyOn(sharedFs, 'realpathSync');

import { createPrivateSkillLinkCheck, isTrustedPrivateSkillLink } from '../lib/private-skill-target.js';

const roots: string[] = [];
const savedRoots = process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'private-skill-target-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  if (savedRoots === undefined) delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
  else process.env.SPECKIT_PRIVATE_SKILL_ROOTS = savedRoots;
});

describe('private skill link containment', () => {
  it('accepts a link that resolves inside the skills root', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const target = join(skills, 'private-beta');
    mkdirSync(target, { recursive: true });
    symlinkSync(target, join(skills, 'local-beta'));
    expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(true);
  });

  it('rejects a link that resolves outside the skills root', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const target = join(root, 'outside-beta');
    mkdirSync(skills, { recursive: true });
    mkdirSync(target, { recursive: true });
    symlinkSync(target, join(skills, 'local-beta'));
    expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(false);
  });

  it('rejects a link whose target is missing', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    mkdirSync(skills, { recursive: true });
    symlinkSync(join(root, 'missing-beta'), join(skills, 'local-beta'));
    expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(false);
  });

  it('rejects a link whose target is a regular file', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    mkdirSync(skills, { recursive: true });
    writeFileSync(join(root, 'file-beta'), 'not a directory\n');
    symlinkSync(join(root, 'file-beta'), join(skills, 'local-beta'));
    expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(false);
  });

  it('accepts a link into a root named by SPECKIT_PRIVATE_SKILL_ROOTS', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const external = join(root, 'private-repos');
    const target = join(external, 'sk-code-webflow');
    mkdirSync(skills, { recursive: true });
    mkdirSync(target, { recursive: true });
    symlinkSync(target, join(skills, 'local-webflow'));
    process.env.SPECKIT_PRIVATE_SKILL_ROOTS = external;
    expect(isTrustedPrivateSkillLink(join(skills, 'local-webflow'), skills)).toBe(true);
  });

  it('accepts a link into either of two joined roots and ignores an empty segment', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const first = join(root, 'private-one');
    const second = join(root, 'private-two');
    mkdirSync(skills, { recursive: true });
    mkdirSync(join(first, 'alpha'), { recursive: true });
    mkdirSync(join(second, 'beta'), { recursive: true });
    mkdirSync(join(root, 'outside-gamma'), { recursive: true });
    symlinkSync(join(first, 'alpha'), join(skills, 'local-alpha'));
    symlinkSync(join(second, 'beta'), join(skills, 'local-beta'));
    symlinkSync(join(root, 'outside-gamma'), join(skills, 'local-gamma'));
    // An empty segment resolves to the working directory, so point that at the
    // folder holding the untrusted target: trusting the segment would accept it.
    const cwd = vi.spyOn(process, 'cwd').mockReturnValue(root);
    process.env.SPECKIT_PRIVATE_SKILL_ROOTS = [first, '', second].join(delimiter);
    try {
      expect(isTrustedPrivateSkillLink(join(skills, 'local-alpha'), skills)).toBe(true);
      expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(true);
      expect(isTrustedPrivateSkillLink(join(skills, 'local-gamma'), skills)).toBe(false);
    } finally {
      cwd.mockRestore();
    }
  });

  it('rejects a target in a sibling folder that shares the declared root as a name prefix', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const declared = join(root, 'private');
    const sibling = join(root, 'private-x');
    mkdirSync(skills, { recursive: true });
    mkdirSync(declared, { recursive: true });
    mkdirSync(join(sibling, 'beta'), { recursive: true });
    symlinkSync(join(sibling, 'beta'), join(skills, 'local-beta'));
    process.env.SPECKIT_PRIVATE_SKILL_ROOTS = declared;
    expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(false);
  });

  it('trusts only the skills root when the variable is empty', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const external = join(root, 'private-repos');
    mkdirSync(join(skills, 'private-beta'), { recursive: true });
    mkdirSync(join(external, 'gamma'), { recursive: true });
    symlinkSync(join(skills, 'private-beta'), join(skills, 'local-beta'));
    symlinkSync(join(external, 'gamma'), join(skills, 'local-gamma'));
    // The working directory holds the external target, so reading the empty value
    // as a root would accept it.
    const cwd = vi.spyOn(process, 'cwd').mockReturnValue(root);
    process.env.SPECKIT_PRIVATE_SKILL_ROOTS = '';
    try {
      expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(true);
      expect(isTrustedPrivateSkillLink(join(skills, 'local-gamma'), skills)).toBe(false);
    } finally {
      cwd.mockRestore();
    }
  });

  it('rejects a link to the skills root itself', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    mkdirSync(skills, { recursive: true });
    symlinkSync(skills, join(skills, 'local-loop'));
    expect(isTrustedPrivateSkillLink(join(skills, 'local-loop'), skills)).toBe(false);
  });

  it('accepts a target whose folder name merely starts with two dots', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const target = join(skills, '..dotted-beta');
    mkdirSync(target, { recursive: true });
    symlinkSync(target, join(skills, 'local-beta'));
    expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(true);
  });

  it('checks many links against one resolution of the trusted roots', () => {
    const root = tempRoot();
    const skills = join(root, 'skills');
    const inside = join(skills, 'private-beta');
    const outside = join(root, 'outside-beta');
    mkdirSync(inside, { recursive: true });
    mkdirSync(outside, { recursive: true });
    symlinkSync(inside, join(skills, 'local-in'));
    symlinkSync(outside, join(skills, 'local-out'));
    symlinkSync(inside, join(skills, 'local-again'));
    const skillsRootResolutions = (): number => realpathSpy.mock.calls
      .filter(([target]) => target === skills).length;

    const check = createPrivateSkillLinkCheck(skills);
    realpathSpy.mockClear();
    expect(skillsRootResolutions()).toBe(0);

    expect(check(join(skills, 'local-in'))).toBe(true);
    expect(check(join(skills, 'local-out'))).toBe(false);
    expect(check(join(skills, 'local-again'))).toBe(true);
    expect(skillsRootResolutions()).toBe(1);

    // The per-link helper resolves the roots again each time, which is what the shared check avoids.
    realpathSpy.mockClear();
    isTrustedPrivateSkillLink(join(skills, 'local-in'), skills);
    isTrustedPrivateSkillLink(join(skills, 'local-out'), skills);
    expect(skillsRootResolutions()).toBe(2);
  });
});
