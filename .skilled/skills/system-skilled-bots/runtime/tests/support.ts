// ───────────────────────────────────────────────────────────────────
// MODULE: Test Support
// ───────────────────────────────────────────────────────────────────
//
// Every test works in temp folders outside the checkout: a temp state root,
// temp repositories and a temp Skilled tree. Git runs with a temp HOME and
// no system config, so a developer's own git settings or a CI's
// GITHUB_REPOSITORY never change what a test resolves.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const made: string[] = [];

/** A fresh temp folder, removed by cleanupTemp. */
export function tempDir(prefix = 'bots-test-'): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  made.push(dir);
  return dir;
}

/** Remove every temp folder this file made. */
export function cleanupTemp(): void {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
}

/** An environment that hides the caller's git config and repository variables. */
export function isolatedEnv(stateHome?: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    HOME: tempDir('bots-home-'),
    GIT_CONFIG_NOSYSTEM: '1',
  };
  if (stateHome !== undefined) env.XDG_STATE_HOME = stateHome;
  return env;
}

function git(cwd: string, args: string[]): void {
  execFileSync('git', ['-C', cwd, ...args], { env: isolatedEnv(), stdio: 'ignore' });
}

/** A temp git repository, with an origin remote when one is given. */
export function tempRepo(origin?: string): string {
  const dir = tempDir('bots-repo-');
  git(dir, ['init', '-q']);
  if (origin !== undefined) git(dir, ['remote', 'add', 'origin', origin]);
  return dir;
}

/** Write bots/config.json into a checkout. */
export function writeConfig(checkoutRoot: string, config: unknown): void {
  mkdirSync(join(checkoutRoot, 'bots'), { recursive: true });
  writeFileSync(join(checkoutRoot, 'bots', 'config.json'), JSON.stringify(config));
}

/**
 * A temp Skilled tree: a git repository holding `.skilled/skills/.state/`,
 * whose .gitignore carries the repository's own ignore line, or none.
 */
export function tempSkilledTree(ignored: boolean): string {
  const tree = tempRepo();
  mkdirSync(join(tree, '.skilled', 'skills', '.state'), { recursive: true });
  if (ignored) writeFileSync(join(tree, '.gitignore'), '.skilled/skills/.state/*/*\n');
  return tree;
}

/** The checkout this suite runs from, which no test may write into. */
export const REAL_CHECKOUT = resolve(import.meta.dirname, '..', '..', '..', '..', '..');
