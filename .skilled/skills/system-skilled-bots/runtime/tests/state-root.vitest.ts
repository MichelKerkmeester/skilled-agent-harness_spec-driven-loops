import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { defaultRepoConfig } from '../lib/repo-config.js';
import {
  deliveryClaimFolder,
  ensureIdentityState,
  identityStatePaths,
  installFile,
  needsYouFile,
  receiptFolder,
  recordFile,
  resolveRunFolder,
  runFolderPath,
  runRoot,
  sharedStatePaths,
  userStateRoot,
} from '../lib/state-root.js';
import { cleanupTemp, isolatedEnv, REAL_CHECKOUT, tempDir, tempRepo, tempSkilledTree } from './support.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';

function mode(path: string): number {
  return statSync(path).mode & 0o777;
}

describe('userStateRoot', () => {
  it('uses XDG_STATE_HOME when set', () => {
    const state = tempDir();
    expect(userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: state })).toBe(join(state, 'system-skilled-bots'));
  });

  it('falls back to HOME/.local/state when XDG_STATE_HOME is unset', () => {
    const home = tempDir();
    expect(userStateRoot(defaultRepoConfig(), { HOME: home })).toBe(
      join(home, '.local', 'state', 'system-skilled-bots'),
    );
  });

  it('honors the stateRoot override', () => {
    const override = tempDir();
    const config = { ...defaultRepoConfig(), stateRoot: override };
    expect(userStateRoot(config, { XDG_STATE_HOME: tempDir() })).toBe(override);
  });
});

describe('user-level layout', () => {
  it('names and creates every folder owner-only under the state root', () => {
    const stateRoot = userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: tempDir() });
    const paths = ensureIdentityState(stateRoot, IDENTITY);
    expect(paths.base).toBe(join(stateRoot, 'acme%2Ftool'));
    expect(readdirSync(paths.requests.root).sort()).toEqual(['claimed', 'done', 'inbox', 'quarantine', 'seen', 'tmp']);
    expect(readdirSync(paths.base).sort()).toEqual(['installs', 'leases', 'needs-you', 'receipts', 'records', 'requests', 'switches']);
    expect(mode(stateRoot)).toBe(0o700);
    expect(mode(paths.base)).toBe(0o700);
    expect(mode(paths.requests.inbox)).toBe(0o700);
    expect(sharedStatePaths(stateRoot)).toEqual({
      index: join(stateRoot, 'index'),
      registeredRoots: join(stateRoot, 'registered-roots'),
      authority: join(stateRoot, 'authority'),
    });
    expect(existsSync(join(stateRoot, 'index'))).toBe(true);
  });

  it('names the record, item and install files and refuses unsafe ids', () => {
    const stateRoot = tempDir();
    const base = identityStatePaths(stateRoot, IDENTITY).base;
    expect(recordFile(stateRoot, IDENTITY, 'r1')).toBe(join(base, 'records', 'r1.json'));
    expect(needsYouFile(stateRoot, IDENTITY, 'r1')).toBe(join(base, 'needs-you', 'r1.json'));
    expect(installFile(stateRoot, IDENTITY, 'nightly')).toBe(join(base, 'installs', 'nightly.json'));
    expect(receiptFolder(stateRoot, IDENTITY, 'r1')).toBe(join(base, 'receipts', 'r1'));
    expect(() => recordFile(stateRoot, IDENTITY, '../escape')).toThrow('run-id-invalid');
    expect(() => receiptFolder(stateRoot, IDENTITY, '../escape')).toThrow('run-id-invalid');
    expect(() => installFile(stateRoot, IDENTITY, '.hidden')).toThrow('bot-id-invalid');
  });

  it('names the delivery claim folder without creating it', () => {
    const stateRoot = tempDir();
    const base = identityStatePaths(stateRoot, IDENTITY).base;
    expect(deliveryClaimFolder(stateRoot, IDENTITY)).toBe(join(base, 'deliveries'));
    expect(existsSync(join(base, 'deliveries'))).toBe(false);
  });
});

describe('run folders', () => {
  it('resolves and creates an owner-only run folder in an ignored Skilled tree', () => {
    const tree = tempSkilledTree(true);
    const result = resolveRunFolder({ skilledTree: tree, identity: IDENTITY, runId: 'r1' });
    const expected = join(tree, '.skilled', 'skills', '.state', 'system-skilled-bots', 'acme%2Ftool', 'runs', 'r1');
    expect(result).toEqual({ ok: true, value: expected });
    expect(mode(expected)).toBe(0o700);
    expect(execFileSync('git', ['-C', tree, 'status', '--short'], { env: isolatedEnv(), encoding: 'utf8' })).toBe(
      '?? .gitignore\n',
    );
  });

  it('refuses a tree git does not ignore and creates nothing', () => {
    const tree = tempSkilledTree(false);
    const result = resolveRunFolder({ skilledTree: tree, identity: IDENTITY, runId: 'r1' });
    expect(result).toMatchObject({ ok: false, reason: 'run-folder-not-ignored' });
    expect(existsSync(runRoot(tree))).toBe(false);
  });

  it('refuses a folder that is not in a git repository', () => {
    const tree = tempDir();
    expect(resolveRunFolder({ skilledTree: tree, identity: IDENTITY, runId: 'r1' })).toMatchObject({
      ok: false,
      reason: 'run-folder-not-ignored',
    });
  });

  it('refuses a linked worktree, whose cleanup would delete the evidence', () => {
    const tree = tempSkilledTree(true);
    const env = isolatedEnv();
    const git = (args: string[]) => execFileSync('git', ['-C', tree, ...args], { env, stdio: 'ignore' });
    git(['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', 'commit', '-q', '--allow-empty', '-m', 'base']);
    const linked = join(tempDir(), 'linked');
    git(['worktree', 'add', '-q', '--detach', linked]);
    expect(resolveRunFolder({ skilledTree: linked, identity: IDENTITY, runId: 'r1' })).toEqual({
      ok: false,
      reason: 'skilled-tree-is-worktree',
    });
  });

  it('follows a symlinked .skilled to the Skilled checkout that holds it', () => {
    const tree = tempSkilledTree(true);
    const consumer = tempRepo();
    symlinkSync(join(tree, '.skilled'), join(consumer, '.skilled'));
    const result = resolveRunFolder({ skilledTree: consumer, identity: IDENTITY, runId: 'r1' });
    expect(result).toEqual({ ok: true, value: runFolderPath(tree, IDENTITY, 'r1') });
    expect(existsSync(runFolderPath(tree, IDENTITY, 'r1'))).toBe(true);
  });

  it('refuses an unsafe run id', () => {
    const tree = tempSkilledTree(true);
    expect(resolveRunFolder({ skilledTree: tree, identity: IDENTITY, runId: '../x' })).toEqual({
      ok: false,
      reason: 'run-id-invalid',
    });
  });

  it('keeps the run root in the Skilled tree whatever stateRoot says', () => {
    const tree = tempSkilledTree(true);
    const config = { ...defaultRepoConfig(), stateRoot: tempDir() };
    expect(userStateRoot(config, {})).toBe(config.stateRoot);
    expect(runRoot(tree)).toBe(join(tree, '.skilled', 'skills', '.state', 'system-skilled-bots'));
  });
});

describe('placement guards', () => {
  it('puts only the run folder inside the Skilled tree', () => {
    const tree = tempSkilledTree(true);
    const stateRoot = userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: tempDir() });
    const paths = identityStatePaths(stateRoot, IDENTITY);
    const userLevel = [
      paths.base,
      ...Object.values(paths.requests),
      paths.leases,
      paths.switches,
      paths.needsYou,
      paths.records,
      paths.installs,
      paths.receipts,
      receiptFolder(stateRoot, IDENTITY, 'r1'),
      ...Object.values(sharedStatePaths(stateRoot)),
      recordFile(stateRoot, IDENTITY, 'r1'),
      needsYouFile(stateRoot, IDENTITY, 'r1'),
      installFile(stateRoot, IDENTITY, 'b1'),
    ];
    for (const path of userLevel) expect(path.startsWith(tree)).toBe(false);
    expect(runFolderPath(tree, IDENTITY, 'r1').startsWith(runRoot(tree))).toBe(true);
  });

  it('never resolves under the real checkout or the real home during tests', () => {
    const tree = tempSkilledTree(true);
    const stateRoot = userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: tempDir() });
    for (const path of [stateRoot, runRoot(tree)]) {
      expect(path.startsWith(REAL_CHECKOUT)).toBe(false);
      expect(path.startsWith(join(homedir(), '.local', 'state'))).toBe(false);
    }
  });
});
