// ───────────────────────────────────────────────────────────────────
// MODULE: Runner Test Support
// ───────────────────────────────────────────────────────────────────
//
// Every runner test works in a temp checkout, a temp Skilled tree and a temp
// state root, with a stub codex first on a PATH that holds nothing else an
// executor could be found on. No real executor is reachable from a test, so
// no test can call a model.

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { userStateRoot } from '../lib/state-root.js';
import { defaultRepoConfig } from '../lib/repo-config.js';
import { isolatedEnv, tempDir, tempRepo, tempSkilledTree, writeConfig } from './support.js';

import type { RunBotInput } from '../lib/runner.js';

export const IDENTITY = 'acme/tool';
export const FIXTURE_BOTS = resolve(import.meta.dirname, 'fixtures', 'bots');
export const STUB_DIR = resolve(import.meta.dirname, 'fixtures', 'stub-executor');
export const BOTS_CLI = resolve(import.meta.dirname, '..', '..', '..', '..', 'bin', 'bots.cjs');

export interface BotWorld {
  checkoutRoot: string;
  skilledTree: string;
  home: string;
  stateHome: string;
  stateRoot: string;
  env: NodeJS.ProcessEnv;
  /** A runBot input with the recursion guard's host reads pinned empty. */
  input(botId: string, extra?: Partial<RunBotInput>): RunBotInput;
}

/**
 * A temp checkout holding the fixture bots and a declared identity, a temp
 * Skilled tree that git ignores run folders in, and an environment whose
 * PATH resolves `codex` to the stub and nothing else.
 */
export function botWorld(extraEnv: NodeJS.ProcessEnv = {}): BotWorld {
  const checkoutRoot = tempRepo();
  cpSync(FIXTURE_BOTS, join(checkoutRoot, 'bots'), { recursive: true });
  writeConfig(checkoutRoot, { identity: IDENTITY });
  // The run's result event is bound to the checkout's HEAD, so the checkout needs a commit.
  commitAll(checkoutRoot);
  const skilledTree = tempSkilledTree(true);
  const home = tempDir('bots-home-');
  const stateHome = tempDir('bots-state-');
  const env: NodeJS.ProcessEnv = {
    PATH: [STUB_DIR, dirname(process.execPath), '/usr/bin', '/bin'].join(':'),
    HOME: home,
    XDG_STATE_HOME: stateHome,
    GIT_CONFIG_NOSYSTEM: '1',
    TMPDIR: tempDir('bots-tmp-'),
    ...extraEnv,
  };
  const stateRoot = userStateRoot(defaultRepoConfig(), env);
  return {
    checkoutRoot,
    skilledTree,
    home,
    stateHome,
    stateRoot,
    env,
    input: (botId, extra = {}) => ({
      checkoutRoot,
      skilledTree,
      botId,
      env,
      guard: { ancestryCmdlines: [], statePaths: [] },
      ...extra,
    }),
  };
}

/** Commit everything in a temp checkout under a fixed test identity. */
export function commitAll(checkoutRoot: string): void {
  const git = (args: string[]) => execFileSync('git', ['-C', checkoutRoot, '-c', 'user.email=bots-test@example.invalid', '-c', 'user.name=bots test', ...args], {
    env: isolatedEnv(),
    stdio: 'ignore',
  });
  git(['add', '-A']);
  git(['commit', '-q', '--no-verify', '--allow-empty', '-m', 'fixture']);
}

/** Write a bot definition into a world's checkout. */
export function writeBot(world: BotWorld, botId: string, text: string): void {
  mkdirSync(join(world.checkoutRoot, 'bots', botId), { recursive: true });
  writeFileSync(join(world.checkoutRoot, 'bots', botId, 'BOT.md'), text);
}

/** What the stub saw for one run, or null when it never ran for that run. */
export function stubReceipt(world: BotWorld, runId: string): { env: Record<string, string>; prompt: string; pid: number } | null {
  const path = join(world.home, 'stub-receipts', `${runId}.json`);
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as { env: Record<string, string>; prompt: string; pid: number }) : null;
}

/** How many times the stub ran in a world. */
export function stubRunCount(world: BotWorld): number {
  const dir = join(world.home, 'stub-receipts');
  return existsSync(dir) ? readdirSync(dir).length : 0;
}

/** Run the bots CLI as its own process and collect its exit and output. */
export function runCli(world: BotWorld, args: string[]): { status: number | null; stdout: string; stderr: string } {
  const run = spawnSync(process.execPath, [BOTS_CLI, ...args, '--repo', world.checkoutRoot, '--skilled-tree', world.skilledTree], {
    cwd: world.checkoutRoot,
    env: world.env,
    encoding: 'utf8',
    timeout: 60_000,
  });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

/** Start the bots CLI without waiting for it. */
export function startCli(world: BotWorld, args: string[]) {
  return spawn(process.execPath, [BOTS_CLI, ...args, '--repo', world.checkoutRoot, '--skilled-tree', world.skilledTree], {
    cwd: world.checkoutRoot,
    env: world.env,
    stdio: 'ignore',
  });
}

/** Every file under a folder, recursively. */
export function filesUnder(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(full));
    else out.push(full);
  }
  return out;
}

/** Wait until a condition holds or the time runs out. */
export async function waitFor(check: () => boolean, timeoutMs = 20_000): Promise<void> {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    if (check()) return;
    await new Promise((done) => setTimeout(done, 50));
  }
  throw new Error('condition not met in time');
}
