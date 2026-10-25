// ───────────────────────────────────────────────────────────────
// MODULE: Private Skill Target Containment Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Wraps realpathSync so a test can count how often a path is resolved. Behavior is unchanged.
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  const realpathSync = Object.assign(
    vi.fn((...args: Parameters<typeof actual.realpathSync>) => actual.realpathSync(...args)),
    { native: actual.realpathSync.native },
  );
  return { ...actual, realpathSync };
});

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
    const skillsRootResolutions = (): number => vi.mocked(realpathSync).mock.calls
      .filter(([target]) => target === skills).length;

    const check = createPrivateSkillLinkCheck(skills);
    vi.mocked(realpathSync).mockClear();
    expect(skillsRootResolutions()).toBe(0);

    expect(check(join(skills, 'local-in'))).toBe(true);
    expect(check(join(skills, 'local-out'))).toBe(false);
    expect(check(join(skills, 'local-again'))).toBe(true);
    expect(skillsRootResolutions()).toBe(1);

    // The per-link helper resolves the roots again each time, which is what the shared check avoids.
    vi.mocked(realpathSync).mockClear();
    isTrustedPrivateSkillLink(join(skills, 'local-in'), skills);
    isTrustedPrivateSkillLink(join(skills, 'local-out'), skills);
    expect(skillsRootResolutions()).toBe(2);
  });
});
