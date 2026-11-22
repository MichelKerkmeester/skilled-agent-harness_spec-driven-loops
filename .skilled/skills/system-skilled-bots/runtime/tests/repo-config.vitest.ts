import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { readRepoConfig } from '../lib/repo-config.js';
import { cleanupTemp, tempDir, writeConfig } from './support.js';

afterEach(cleanupTemp);

function reason(config: unknown): string | undefined {
  const root = tempDir();
  writeConfig(root, config);
  const result = readRepoConfig(root);
  return result.ok ? undefined : result.reason;
}

describe('readRepoConfig', () => {
  it('yields the defaults when bots/config.json is missing', () => {
    const result = readRepoConfig(tempDir());
    expect(result).toEqual({
      ok: true,
      value: {
        allowedExecutorKinds: null,
        stateRoot: null,
        defaultIsolation: null,
        identity: null,
        gitHookTrigger: false,
        needsYou: { expiryDays: 7 },
        retention: {
          indexRowsPerIdentity: 1000,
          runFoldersPerBot: 200,
          skippedSlotsPerSummary: 100,
          closedNeedsYouPerIdentity: 200,
        },
      },
    });
  });

  it('reads a full file', () => {
    const root = tempDir();
    const full = {
      allowedExecutorKinds: ['cli-opencode', 'native'],
      stateRoot: '/tmp/bots-state',
      defaultIsolation: 'worktree',
      identity: 'acme/tool',
      gitHookTrigger: true,
      needsYou: { expiryDays: 3 },
      retention: {
        indexRowsPerIdentity: 50,
        runFoldersPerBot: 20,
        skippedSlotsPerSummary: 10,
        closedNeedsYouPerIdentity: 5,
      },
    };
    writeConfig(root, full);
    expect(readRepoConfig(root)).toEqual({ ok: true, value: full });
  });

  it('reads gitHookTrigger as false when the key is absent', () => {
    const root = tempDir();
    writeConfig(root, { defaultIsolation: 'shared' });
    const result = readRepoConfig(root);
    expect(result.ok && result.value.gitHookTrigger).toBe(false);
  });

  it('rejects each bad value by name', () => {
    expect(reason({ isolaton: 'worktree' })).toBe('unknown-key');
    expect(reason({ gitHookTrigger: 'yes' })).toBe('gitHookTrigger-invalid');
    expect(reason({ identity: 'not a slug' })).toBe('identity-invalid');
    expect(reason({ defaultIsolation: 'sometimes' })).toBe('defaultIsolation-invalid');
    expect(reason({ stateRoot: 'relative/path' })).toBe('stateRoot-invalid');
    expect(reason({ retention: { runFoldersPerBot: 0 } })).toBe('retention.runFoldersPerBot-invalid');
    expect(reason({ retention: { runFoldersPerBot: -1 } })).toBe('retention.runFoldersPerBot-invalid');
    expect(reason({ retention: { indexRowsPerIdentity: 1.5 } })).toBe('retention.indexRowsPerIdentity-invalid');
    expect(reason({ retention: { closedNeedsYouPerIdentity: '200' } })).toBe(
      'retention.closedNeedsYouPerIdentity-invalid',
    );
    expect(reason({ needsYou: { expiryDays: 0 } })).toBe('needsYou.expiryDays-invalid');
    expect(reason({ retention: { keepForever: 1 } })).toBe('unknown-key');
  });

  it('accepts a declared owner/name identity for a repository with no remote', () => {
    const root = tempDir();
    writeConfig(root, { identity: 'local/tool' });
    const result = readRepoConfig(root);
    expect(result.ok && result.value.identity).toBe('local/tool');
  });

  it('reports an unreadable file as unreadable, not as missing', () => {
    const root = tempDir();
    mkdirSync(join(root, 'bots'));
    const file = join(root, 'bots', 'config.json');
    writeFileSync(file, '{}');
    chmodSync(file, 0o000);
    try {
      const result = readRepoConfig(root);
      expect(result).toMatchObject({ ok: false, reason: 'config-unreadable' });
    } finally {
      chmodSync(file, 0o600);
    }
  });

  it('reports malformed JSON by name', () => {
    const root = tempDir();
    mkdirSync(join(root, 'bots'));
    writeFileSync(join(root, 'bots', 'config.json'), '{ not json');
    expect(readRepoConfig(root)).toMatchObject({ ok: false, reason: 'config-invalid' });
  });
});
