import { afterEach, describe, expect, it } from 'vitest';

import { identityGuard, identityKey, resolveIdentity } from '../lib/identity.js';
import { defaultRepoConfig, repositoryIdentity } from '../lib/repo-config.js';
import { identityStatePaths, readRegisteredRoots, registerRoot, userStateRoot } from '../lib/state-root.js';
import { cleanupTemp, isolatedEnv, tempDir, tempRepo, writeConfig } from './support.js';

afterEach(cleanupTemp);

describe('shared resolver shape', () => {
  it('returns {identity, source} from the sk-code resolver', () => {
    const repo = tempRepo('https://github.com/acme/tool.git');
    expect(repositoryIdentity.currentRepository({ root: repo, env: isolatedEnv() })).toEqual({
      identity: 'acme/tool',
      source: 'origin',
    });
  });
});

describe('identityGuard', () => {
  it('refuses two repositories with no remote and no declared identity, and shares no folder', () => {
    const env = isolatedEnv(tempDir());
    const first = tempRepo();
    const second = tempRepo();
    expect(identityGuard(first, env)).toEqual({ ok: false, reason: 'identity-unknown' });
    expect(identityGuard(second, env)).toEqual({ ok: false, reason: 'identity-unknown' });
  });

  it('returns a declared identity for a repository with no remote', () => {
    const repo = tempRepo();
    const env = isolatedEnv();
    expect(identityGuard(repo, env)).toEqual({ ok: false, reason: 'identity-unknown' });
    writeConfig(repo, { identity: 'acme/tool' });
    expect(identityGuard(repo, env)).toEqual({ ok: true, value: { identity: 'acme/tool', source: 'config' } });
    writeConfig(repo, { identity: 'local/tool' });
    expect(identityGuard(repo, env)).toEqual({ ok: true, value: { identity: 'local/tool', source: 'config' } });
  });

  it('lets a declared identity win over the origin remote', () => {
    const repo = tempRepo('https://github.com/other/name.git');
    writeConfig(repo, { identity: 'acme/tool' });
    expect(identityGuard(repo, isolatedEnv())).toEqual({ ok: true, value: { identity: 'acme/tool', source: 'config' } });
  });

  it('passes a config refusal through instead of guessing', () => {
    const repo = tempRepo('https://github.com/acme/tool.git');
    writeConfig(repo, { identity: 'not a slug' });
    expect(identityGuard(repo, isolatedEnv())).toMatchObject({ ok: false, reason: 'identity-invalid' });
  });

  it('reads the environment before the origin remote', () => {
    const repo = tempRepo('https://github.com/acme/tool.git');
    const env = { ...isolatedEnv(), GITHUB_REPOSITORY: 'ci/declared' };
    expect(resolveIdentity({ checkoutRoot: repo, config: defaultRepoConfig(), env })).toEqual({
      ok: true,
      value: { identity: 'ci/declared', source: 'env' },
    });
  });
});

describe('two checkouts of one origin', () => {
  it('share one identity folder and both appear in registered-roots', () => {
    const origin = 'git@github.com:acme/tool.git';
    const first = tempRepo(origin);
    const second = tempRepo(origin);
    const env = isolatedEnv(tempDir());
    const stateRoot = userStateRoot(defaultRepoConfig(), env);

    const a = identityGuard(first, env);
    const b = identityGuard(second, env);
    if (!a.ok || !b.ok) throw new Error('expected both identities to resolve');
    expect(a.value.identity).toBe(b.value.identity);
    expect(identityStatePaths(stateRoot, a.value.identity).base).toBe(
      identityStatePaths(stateRoot, b.value.identity).base,
    );

    registerRoot(stateRoot, a.value.identity, first);
    const roots = registerRoot(stateRoot, b.value.identity, second);
    expect(roots).toEqual([first, second]);
    expect(readRegisteredRoots(stateRoot)).toEqual({ 'acme%2Ftool': [first, second] });
    expect(registerRoot(stateRoot, a.value.identity, first)).toEqual([first, second]);
  });

  it('lists case variants of one identity under one key, as their folder is one', () => {
    const stateRoot = tempDir();
    const first = tempRepo();
    const second = tempRepo();
    registerRoot(stateRoot, 'Acme/Tool', first);
    expect(registerRoot(stateRoot, 'acme/tool', second)).toEqual([first, second]);
  });
});

describe('identityKey', () => {
  it('is filesystem-safe and folds case', () => {
    expect(identityKey('Acme/Tool')).toBe('acme%2Ftool');
    expect(identityKey('acme/tool')).toBe(identityKey('ACME/TOOL'));
    expect(identityKey('a.b/c-d_e')).not.toContain('/');
  });

  it('keeps different identities apart', () => {
    expect(identityKey('a/b_c')).not.toBe(identityKey('a_b/c'));
    expect(identityKey('local/tool')).not.toBe(identityKey('acme/tool'));
  });
});
