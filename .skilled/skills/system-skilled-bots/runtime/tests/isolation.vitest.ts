// ───────────────────────────────────────────────────────────────────
// MODULE: Worktree Isolation Tests
// ───────────────────────────────────────────────────────────────────
//
// Every tree is made by sk-git's real numbering script inside a temp
// repository, with the base under a temp state root. No test creates a tree
// in this checkout or under the operator's worktree folder: the suite
// snapshots this checkout's worktree list before and after to prove it.

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import {
  rmSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  createBotWorktree,
  finishBotWorktree,
  inspectWorktree,
  NAMING_SCRIPT,
  resolveSharedPaths,
  resolveWorktreeBase,
  worktreeSlug,
} from '../lib/isolation.js';
import { checkoutLine, WORKING_PLACE_PREFIX, workingPlaceLine } from '../lib/dispatch.js';
import { leaseFile, leaseKey, runBot } from '../lib/runner.js';
import { readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { readRunRecord } from '../lib/run-record.js';
import { identityStatePaths, recordFile } from '../lib/state-root.js';
import { cleanupTemp, isolatedEnv, REAL_CHECKOUT, tempDir, tempRepo, tempSkilledTree } from './support.js';
import { approveBots, botWorld, IDENTITY, stubReceipt, waitFor, writeBot } from './runner-support.js';

import type { CreateWorktreeInput } from '../lib/isolation.js';
import type { RunRecord } from '../lib/run-record.js';
import type { BotWorld } from './runner-support.js';

const FIXTURES = resolve(import.meta.dirname, 'fixtures');
const CHILD = join(FIXTURES, 'run-bot-child.ts');
const RUNTIME = resolve(import.meta.dirname, '..');
const HALF_PROVISIONED_STUB = join(FIXTURES, 'naming-stub', 'half-provisioned.sh');
const RECORD_CALLS_STUB = join(FIXTURES, 'naming-stub', 'record-calls.sh');
const REAPER = resolve(import.meta.dirname, '..', '..', '..', '..', 'bin', 'worktree-reaper.sh');

let realWorktreesBefore: string[] = [];

function realWorktreeList(): string[] {
  const text = execFileSync('git', ['-C', REAL_CHECKOUT, 'worktree', 'list', '--porcelain'], { encoding: 'utf8' });
  return text.split('\n').filter((line) => line.startsWith('worktree ')).map((line) => line.slice('worktree '.length));
}
beforeAll(() => {
  realWorktreesBefore = realWorktreeList();
});
afterAll(() => {
  // Other sessions may add trees meanwhile; none added during this file may be a bot tree or a test temp path.
  const added = realWorktreeList().filter((path) => !realWorktreesBefore.includes(path));
  expect(added.filter((path) => /\/\d{3}-bot-|\/bots-[^/]*\//.test(path))).toEqual([]);
});

const orphans: number[] = [];

afterEach(() => {
  for (const pid of orphans.splice(0)) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Already gone.
    }
  }
  cleanupTemp();
});

function git(cwd: string, args: string[], env: NodeJS.ProcessEnv = isolatedEnv()): string {
  return execFileSync('git', ['-C', cwd, '-c', 'user.email=bots-test@example.invalid', '-c', 'user.name=bots test', ...args], {
    env,
    encoding: 'utf8',
  });
}

interface MainCheckout {
  root: string;
  skilledTree: string;
  /** The configured worktree base, a temp folder outside the checkout. */
  base: string;
  env: NodeJS.ProcessEnv;
  input(extra?: Partial<CreateWorktreeInput>): CreateWorktreeInput;
}

/**
 * A temp main checkout with one commit, an untracked `node_modules` that
 * holds three packages (the folder a careless removal would walk into) and
 * `speckit.worktreeBase` set in its own config to a temp folder outside it.
 */
function mainCheckout(): MainCheckout {
  const root = tempRepo();
  writeFileSync(join(root, 'README.md'), 'fixture\n');
  mkdirSync(join(root, 'pkgs', 'own'), { recursive: true });
  writeFileSync(join(root, 'pkgs', 'own', 'index.js'), 'module.exports = 1;\n');
  git(root, ['add', '-A']);
  git(root, ['commit', '-q', '--no-verify', '-m', 'fixture']);
  for (const name of ['alpha', 'beta', 'gamma']) {
    mkdirSync(join(root, 'node_modules', name), { recursive: true });
    writeFileSync(join(root, 'node_modules', name, 'index.js'), `// ${name}\n`);
  }
  const skilledTree = tempSkilledTree(true);
  const base = tempDir('bots-wt-base-');
  git(root, ['config', 'speckit.worktreeBase', base]);
  const env = { ...isolatedEnv(), PATH: process.env.PATH };
  return {
    root,
    skilledTree,
    base,
    env,
    input: (extra = {}) => ({
      checkoutRoot: root,
      skilledTree,
      botId: 'nightly',
      config: { worktreeSharedPaths: ['node_modules'] },
      env,
      ...extra,
    }),
  };
}

function made(main: MainCheckout, extra?: Partial<CreateWorktreeInput>) {
  const result = createBotWorktree(main.input(extra));
  if (!result.ok) throw new Error(`${result.reason}: ${result.detail ?? ''}`);
  return result.value;
}

function worktreePaths(root: string): string[] {
  return git(root, ['worktree', 'list', '--porcelain'])
    .split('\n')
    .filter((line) => line.startsWith('worktree '))
    .map((line) => line.slice('worktree '.length));
}

function linksUnder(dir: string): string[] {
  const out: string[] = [];
  const walk = (current: string, depth: number) => {
    if (depth > 4) return;
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const full = join(current, entry.name);
      if (entry.isSymbolicLink()) out.push(full);
      else if (entry.isDirectory()) walk(full, depth + 1);
    }
  };
  walk(dir, 0);
  return out.sort();
}

describe('worktree placement', () => {
  it('makes a numbered tree outside the checkout, under the configured base, with every link recorded', () => {
    const main = mainCheckout();
    const tree = made(main);

    const toplevel = git(main.root, ['rev-parse', '--show-toplevel']).trim();
    expect(relative(toplevel, tree.path).startsWith('..')).toBe(true);
    expect(tree.path).toBe(join(main.base, `001-${worktreeSlug('nightly')}`));
    expect(tree.baseSource).toBe('git-config');
    expect(tree.branch).toBe(`worktrees/001-${worktreeSlug('nightly')}`);
    expect(worktreePaths(main.root)).toContain(tree.path);
    expect(tree.baseCommit).toBe(git(main.root, ['rev-parse', 'HEAD']).trim());
    // The links exist as soon as the tree is handed back, before any dispatch.
    expect(linksUnder(tree.path)).toEqual([...tree.links].sort());
    expect(tree.links).toEqual([join(tree.path, 'node_modules')]);
    expect(tree.setupMs).toBeGreaterThanOrEqual(0);
  });

  it('pins the numbering script call shape against its usage text', () => {
    const usage = readFileSync(NAMING_SCRIPT, 'utf8');
    expect(usage).toContain('create          <slug> [base] [--no-provision]');
    expect(worktreeSlug('a--b-')).toBe('bot-a-b');
  });

  it('refuses an unconfigured base and a base inside the checkout or the Skilled tree, and makes no tree', () => {
    const main = mainCheckout();
    git(main.root, ['config', '--unset', 'speckit.worktreeBase']);
    expect(createBotWorktree(main.input())).toMatchObject({ ok: false, reason: 'worktree-base-unconfigured', kept: null });

    const inEnv = createBotWorktree(main.input({ env: { ...main.env, SPECKIT_WORKTREE_BASE: '.worktrees' } }));
    expect(inEnv).toMatchObject({ ok: false, reason: 'worktree-base-inside-checkout', kept: null });

    git(main.root, ['config', 'speckit.worktreeBase', '.worktrees']);
    expect(createBotWorktree(main.input())).toMatchObject({ ok: false, reason: 'worktree-base-inside-checkout' });

    const inSkilled = createBotWorktree(main.input({ env: { ...main.env, SPECKIT_WORKTREE_BASE: join(main.skilledTree, 'trees') } }));
    expect(inSkilled).toMatchObject({ ok: false, reason: 'worktree-base-inside-skilled-tree' });
    expect(worktreePaths(main.root)).toEqual([main.root]);
    expect(existsSync(join(main.root, '.worktrees'))).toBe(false);
  });

  it('takes an outside base from the environment for the child call', () => {
    const main = mainCheckout();
    const outside = tempDir('bots-wt-env-base-');
    expect(resolveWorktreeBase({ ...main.input(), env: { ...main.env, SPECKIT_WORKTREE_BASE: outside } })).toEqual({
      ok: true,
      value: { base: outside, source: 'env' },
    });
    const tree = made(main, { env: { ...main.env, SPECKIT_WORKTREE_BASE: outside } });
    expect(tree.path.startsWith(`${outside}/`)).toBe(true);
  });

  it('refuses a shared-path list that leaves the checkout', () => {
    const main = mainCheckout();
    expect(resolveSharedPaths({ checkoutRoot: main.root, config: { worktreeSharedPaths: ['../x'] }, env: {} })).toMatchObject({
      ok: false,
      reason: 'worktree-shared-paths-unresolved',
    });
    expect(createBotWorktree(main.input({ config: { worktreeSharedPaths: ['/abs'] } }))).toMatchObject({
      ok: false,
      reason: 'worktree-shared-paths-unresolved',
      kept: null,
    });
    // With no override the launcher's own list is read, under the checkout's source root.
    const launcher = resolveSharedPaths({ checkoutRoot: main.root, config: {}, env: {} });
    expect(launcher).toMatchObject({ ok: true, value: { source: 'launcher' } });
    if (launcher.ok) expect(launcher.value.paths).toContain('.opencode/skills/system-spec-kit/node_modules');
  });
});

describe('worktree removal', () => {
  it('unlinks first, removes a clean unchanged tree and its branch, and leaves the main dependencies whole', () => {
    const main = mainCheckout();
    const before = readdirSync(join(main.root, 'node_modules')).sort();
    const tree = made(main);

    expect(finishBotWorktree(main.root, tree, main.env)).toEqual({ disposition: 'removed', keptReason: null, detail: null });
    expect(existsSync(tree.path)).toBe(false);
    expect(worktreePaths(main.root)).toEqual([main.root]);
    expect(git(main.root, ['branch', '--list', tree.branch]).trim()).toBe('');
    expect(readdirSync(join(main.root, 'node_modules')).sort()).toEqual(before);
    expect(readFileSync(join(main.root, 'node_modules', 'beta', 'index.js'), 'utf8')).toBe('// beta\n');
  });

  it('keeps a dirty, modified, unmerged or stashed tree and names why', () => {
    const cases: Array<[string, (path: string, main: MainCheckout) => void]> = [
      ['dirty', (path) => writeFileSync(join(path, 'notes.txt'), 'half done\n')],
      ['dirty', (path) => writeFileSync(join(path, 'README.md'), 'edited\n')],
      ['unmerged', (path) => {
        writeFileSync(join(path, 'done.txt'), 'done\n');
        git(path, ['add', 'done.txt']);
        git(path, ['commit', '-q', '--no-verify', '-m', 'bot work']);
      }],
      ['stashed', (path) => {
        writeFileSync(join(path, 'README.md'), 'stash me\n');
        git(path, ['stash', 'push', '-q']);
      }],
    ];
    for (const [reason, change] of cases) {
      const main = mainCheckout();
      const tree = made(main);
      change(tree.path, main);
      const result = finishBotWorktree(main.root, tree, main.env);
      expect(result, reason).toMatchObject({ disposition: 'kept', keptReason: reason });
      expect(worktreePaths(main.root)).toContain(tree.path);
      // A kept tree keeps its links, so the operator can still build in it.
      expect(lstatSync(join(tree.path, 'node_modules')).isSymbolicLink()).toBe(true);
    }
  });

  it('keeps a tree whose only change is gitignored output, and still removes a clean one under the same ignore rules', () => {
    const main = mainCheckout();
    // The link itself matches an ignore line here, so the check must still know it as its own.
    writeFileSync(join(main.root, '.gitignore'), 'out/\nnode_modules\n');
    git(main.root, ['add', '.gitignore']);
    git(main.root, ['commit', '-q', '--no-verify', '-m', 'ignore build output']);

    const clean = made(main);
    expect(finishBotWorktree(main.root, clean, main.env)).toEqual({ disposition: 'removed', keptReason: null, detail: null });

    const tree = made(main);
    mkdirSync(join(tree.path, 'out'));
    writeFileSync(join(tree.path, 'out', 'report.md'), 'the bot output\n');
    expect(finishBotWorktree(main.root, tree, main.env)).toEqual({ disposition: 'kept', keptReason: 'ignored-changes', detail: 'out' });
    expect(readFileSync(join(tree.path, 'out', 'report.md'), 'utf8')).toBe('the bot output\n');
    expect(worktreePaths(main.root)).toContain(tree.path);
    for (const link of tree.links) expect(lstatSync(link).isSymbolicLink()).toBe(true);
  });

  it('keeps a tree as dirty, links intact, when the bot writes into a folder made to hold links', () => {
    const main = mainCheckout();
    mkdirSync(join(main.root, 'node_modules', '@ws'));
    symlinkSync('../../pkgs/own', join(main.root, 'node_modules', '@ws', 'own'));
    const tree = made(main);
    // An install inside the tree drops a real package beside the recorded links.
    mkdirSync(join(tree.path, 'node_modules', 'delta'));
    writeFileSync(join(tree.path, 'node_modules', 'delta', 'index.js'), '// delta\n');

    expect(finishBotWorktree(main.root, tree, main.env)).toEqual({ disposition: 'kept', keptReason: 'dirty', detail: join('node_modules', 'delta') });
    for (const link of tree.links) expect(lstatSync(link).isSymbolicLink()).toBe(true);
    expect(worktreePaths(main.root)).toContain(tree.path);
  });

  it('keeps a half-provisioned tree when the numbering script exits 3', () => {
    const main = mainCheckout();
    const result = createBotWorktree(main.input({ namingScript: HALF_PROVISIONED_STUB }));
    expect(result).toMatchObject({ ok: false, reason: 'worktree-half-provisioned' });
    if (result.ok) return;
    expect(result.kept?.branch).toBe('worktrees/001-bot-nightly');
    expect(existsSync(result.kept?.path ?? '')).toBe(true);
  });

  it('never follows a link out of the tree: outside, dangling and planted links', () => {
    const main = mainCheckout();
    const outside = tempDir('bots-outside-');
    writeFileSync(join(outside, 'keep.txt'), 'keep\n');
    // A shared path whose source leaves the checkout is never linked.
    symlinkSync(outside, join(main.root, 'ext'));
    const tree = made(main, { config: { worktreeSharedPaths: ['node_modules', 'ext', 'absent'] } });
    expect(tree.skipped).toEqual([
      { path: 'ext', why: 'outside-checkout' },
      { path: 'absent', why: 'absent' },
    ]);

    // A planted link nobody recorded makes the tree dirty, so it is kept untouched.
    symlinkSync(outside, join(tree.path, 'planted'));
    expect(finishBotWorktree(main.root, tree, main.env)).toMatchObject({ disposition: 'kept', keptReason: 'dirty' });
    expect(readdirSync(outside)).toEqual(['keep.txt']);

    // A recorded link whose target vanished is still unlinked, and the tree goes.
    const second = mainCheckout();
    mkdirSync(join(second.root, 'cache'));
    const dangling = made(second, { config: { worktreeSharedPaths: ['node_modules', 'cache'] } });
    rmSync(join(second.root, 'cache'), { recursive: true });
    expect(finishBotWorktree(second.root, dangling, second.env)).toMatchObject({ disposition: 'removed' });
    expect(readdirSync(join(second.root, 'node_modules')).sort()).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('leaves every non-clean bot tree to the reaper numbered lane, which judges it as a numbered pair', () => {
    const main = mainCheckout();
    const make = (botId: string) => made(main, { botId, config: { worktreeSharedPaths: [] } });
    const trees = { clean: make('clean'), dirty: make('dirty'), unmerged: make('unmerged'), half: make('half') };
    writeFileSync(join(trees.dirty.path, 'notes.txt'), 'half done\n');
    writeFileSync(join(trees.unmerged.path, 'done.txt'), 'done\n');
    git(trees.unmerged.path, ['add', 'done.txt']);
    git(trees.unmerged.path, ['commit', '-q', '--no-verify', '-m', 'bot work']);
    // A tree whose provisioning stopped part way holds a link nobody recorded.
    symlinkSync(join(main.root, 'node_modules'), join(trees.half.path, 'node_modules'));

    const reap = spawnSync('bash', [REAPER, '--numbered', '--dry-run', '--idle-hours', '0'], {
      cwd: main.root,
      env: { ...main.env, WORKTREE_REAPER_NOW: '4102444800' },
      encoding: 'utf8',
      timeout: 60_000,
    });
    expect(reap.status, reap.stderr).toBe(0);
    const verdicts = reap.stdout.split('\n').filter((line) => line.startsWith('numbered verdict='));
    expect(verdicts, reap.stdout).toHaveLength(4);
    expect(reap.stdout).not.toContain('not a numbered branch and folder pair');
    const verdictOf = (path: string) => verdicts.find((line) => line.includes(`worktree=${path} `)) ?? '';
    for (const key of ['dirty', 'unmerged', 'half'] as const) {
      expect(verdictOf(trees[key].path), key).toMatch(/^numbered verdict=keep /);
    }
    expect(verdictOf(trees.dirty.path)).toMatch(/reason=.*(dirty|uncommitted|untracked|changes)/i);
    expect(verdictOf(trees.unmerged.path)).toMatch(/reason=.*(ancestor|merged)/i);
    // The dry run changed nothing: every tree is still registered.
    for (const tree of Object.values(trees)) expect(worktreePaths(main.root)).toContain(tree.path);
    // A clean tree at its base is the one the reaper would take, once idle.
    expect(verdictOf(trees.clean.path), reap.stdout).toMatch(/^numbered verdict=would-reap .*reason=idle/);
  });

  it('splits a dependency root with workspace self-links so they resolve inside the tree', () => {
    const main = mainCheckout();
    mkdirSync(join(main.root, 'node_modules', '@ws'));
    symlinkSync('../../pkgs/own', join(main.root, 'node_modules', '@ws', 'own'));
    const tree = made(main);

    expect(lstatSync(join(tree.path, 'node_modules')).isDirectory()).toBe(true);
    const own = realpathSync(join(tree.path, 'node_modules', '@ws', 'own'));
    expect(own).toBe(realpathSync(join(tree.path, 'pkgs', 'own')));
    expect(realpathSync(join(tree.path, 'node_modules', 'alpha'))).toBe(realpathSync(join(main.root, 'node_modules', 'alpha')));
    expect(inspectWorktree(main.root, tree, main.env)).toEqual({ keptReason: null, detail: null });

    expect(finishBotWorktree(main.root, tree, main.env)).toMatchObject({ disposition: 'removed' });
    expect(readdirSync(join(main.root, 'node_modules')).sort()).toEqual(['@ws', 'alpha', 'beta', 'gamma']);
    expect(lstatSync(join(main.root, 'node_modules', '@ws', 'own')).isSymbolicLink()).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// Runner integration
// ───────────────────────────────────────────────────────────────────

/** Run a bot in its own node process, which is itself the lease owner, so killing it kills the owner. */
function startChild(world: BotWorld, botId: string) {
  const input = { checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, botId, env: world.env };
  return spawn(process.execPath, ['--import', 'tsx', CHILD, JSON.stringify(input)], { cwd: RUNTIME, env: world.env, stdio: 'ignore' });
}

/** The folder the stub executor ran in for one run. */
function stubCwd(world: BotWorld, runId: string): string {
  const receipt = stubReceipt(world, runId) as unknown as { cwd?: string } | null;
  return receipt?.cwd ?? '';
}

function receiptFor(world: BotWorld, count: number): string[] {
  const dir = join(world.home, 'stub-receipts');
  return existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.json')).map((name) => name.replace(/\.json$/, '')).slice(0, count) : [];
}

describe('worktree runs through the runner', () => {
  it('dispatches inside the tree, records its path and branch, then removes the unchanged tree', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    const outcome = await runBot(world.input('worktree-posture', { senders: {} }));
    expect(outcome.kind).toBe('completed');
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    const { evidence, posture } = read.value.record;
    expect(posture.isolation).toBe('worktree');
    expect(evidence.branch).toMatch(/^worktrees\/\d{3}-bot-worktree-posture$/);
    expect(relative(world.checkoutRoot, evidence.worktreePath as string).startsWith('..')).toBe(true);
    expect(evidence.worktree).toMatchObject({ postureSource: 'definition', disposition: 'removed', keptReason: null });
    expect(stubCwd(world, outcome.runId as string)).toBe(evidence.worktreePath);
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot]);
  });

  it('refuses a worktree run whose base is not configured, before dispatch and with no tree', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('worktree-posture', { senders: {} }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'worktree-refused', detail: expect.stringContaining('worktree-base-unconfigured') });
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    expect(read.ok && read.value.record.exit).toMatchObject({ reason: 'worktree-refused', class: 'operator' });
    expect(stubReceipt(world, outcome.runId as string)).toBeNull();
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot]);
  });

  it('never calls the numbering script for a definition with no isolation answer', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'no-answer', '---\nid: no-answer\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\n---\nDo a thing.\n');
    const log = join(world.home, 'naming-calls.log');
    const outcome = await runBot(world.input('no-answer', {
      env: { ...world.env, NAMING_STUB_LOG: log },
      namingScript: RECORD_CALLS_STUB,
      senders: {},
    }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'posture-refused', detail: expect.stringContaining('isolation-undeclared') });
    expect(existsSync(log)).toBe(false);
  });

  it('finishes its fresh tree when a read-only OpenCode run is refused before any child starts', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'oc-tree', '---\nid: oc-tree\ntrigger: {kind: manual}\nruntime: {kind: cli-opencode}\nisolation: worktree\nsandbox: read-only\n---\nReview the notes.\n');
    // The resolver stub reads this from the child's working folder, so it is committed into the tree.
    writeFileSync(join(world.checkoutRoot, '.stub-opencode-agents.json'), JSON.stringify([
      { id: 'build', permissions: [{ action: '*', resource: '*', effect: 'deny' }, { action: 'read', resource: '*', effect: 'allow' }, { action: 'shell', resource: '*', effect: 'allow' }] },
    ]));
    git(world.checkoutRoot, ['add', '-A']);
    git(world.checkoutRoot, ['commit', '-q', '--no-verify', '-m', 'open agent']);
    const outcome = await runBot(world.input('oc-tree', { senders: {} }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'read-only-unconfined' });
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.record.evidence.worktree).toMatchObject({ disposition: 'removed', keptReason: null });
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot]);
  });

  it('ends a half-provisioned run before dispatch, as an environment refusal that keeps the tree', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    const outcome = await runBot(world.input('worktree-posture', { namingScript: HALF_PROVISIONED_STUB, senders: {} }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'worktree-setup-failed' });
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.record.exit).toMatchObject({ reason: 'worktree-setup-failed', class: 'environment' });
    expect(read.value.record.evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'half-provisioned' });
    expect(existsSync(read.value.record.evidence.worktreePath as string)).toBe(true);
    expect(stubReceipt(world, outcome.runId as string)).toBeNull();
  });

  it('gives two concurrent worktree runs different numbers and keeps tree paths out of both lease keys', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'worktree-slow-b', readFileSync(join(world.checkoutRoot, 'bots', 'worktree-slow', 'BOT.md'), 'utf8').replace('id: worktree-slow', 'id: worktree-slow-b'));
    const first = startChild(world, 'worktree-slow');
    const second = startChild(world, 'worktree-slow-b');
    const exits = [first, second].map((child) => new Promise<void>((done) => child.once('exit', () => done())));
    await waitFor(() => receiptFor(world, 2).length === 2, 40_000);
    const runIds = receiptFor(world, 2);
    const cwds = runIds.map((runId) => stubCwd(world, runId));
    for (const runId of runIds) {
      const pid = stubReceipt(world, runId)?.pid;
      if (pid !== undefined) orphans.push(pid);
    }
    const numbers = cwds.map((cwd) => /\/(\d{3})-bot-/.exec(cwd)?.[1]);
    expect(new Set(numbers).size).toBe(2);
    for (const bot of ['worktree-slow', 'worktree-slow-b']) {
      const key = leaseKey(IDENTITY, bot, null);
      for (const cwd of cwds) expect(key).not.toContain(cwd);
      const lock = readFileSync(leaseFile(world.stateRoot, IDENTITY, key), 'utf8');
      for (const cwd of cwds) expect(lock).not.toContain(cwd);
    }
    writeFileSync(join(world.home, 'fast-flag'), '');
    await Promise.all(exits);
  }, 90_000);

  it('keeps the tree of a run killed mid-edit, and its record names it kept as dirty', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    const child = startChild(world, 'worktree-slow');
    orphans.push(child.pid as number);
    await waitFor(() => receiptFor(world, 1).length === 1, 40_000);
    const runId = receiptFor(world, 1)[0] as string;
    const stub = stubReceipt(world, runId);
    if (stub?.pid !== undefined) orphans.push(stub.pid);
    const tree = stubCwd(world, runId);
    // The bot is mid-edit: a half-written file sits in its tree.
    writeFileSync(join(tree, 'half-written.md'), 'draft\n');

    const exited = new Promise<void>((done) => child.once('exit', () => done()));
    child.kill('SIGKILL');
    await exited;
    expect(worktreePaths(world.checkoutRoot)).toContain(tree);

    writeFileSync(join(world.home, 'fast-flag'), '');
    const next = await runBot(world.input('worktree-slow', { senders: {} }));
    expect(next.kind).toBe('completed');
    const killed = readRunRecord(world.stateRoot, IDENTITY, runId);
    if (!killed.ok) throw new Error(killed.reason);
    expect(killed.value.record.exit).toMatchObject({ reason: 'unknown', class: 'environment' });
    expect(killed.value.record.evidence.worktreePath).toBe(tree);
    expect(killed.value.record.evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'dirty' });
    expect(existsSync(join(tree, 'half-written.md'))).toBe(true);
    expect(worktreePaths(world.checkoutRoot)).toContain(tree);
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).leases)).toEqual([]);
  }, 90_000);
});

describe('a parked worktree run and its resume', () => {
  const VIBE_TREE_BOT = '---\nid: vibe-tree\ntrigger: {kind: manual}\nruntime: {kind: cli-mistral-vibe, model: deepseek-flash}\nisolation: worktree\nsandbox: read-only\n---\nReview the notes and ask before deleting any.\nSTUB:decide=Delete the stale notes?\n';
  const PARK_EDIT_BOT = '---\nid: park-edit\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\n---\nEdit the notes and ask before keeping them.\nSTUB:park-edit=parked.md\n';

  /** Park a worktree bot, answer its item, and run the resume. */
  async function parkAnswerResume(world: BotWorld, botId: string) {
    const parked = await runBot(world.input(botId, { senders: {} }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    writeNeedsYouItem(world.stateRoot, { ...item.value, answer: { text: 'keep it', answeredAt: new Date().toISOString() } });
    const parkedRecord = readRunRecord(world.stateRoot, IDENTITY, parked.runId);
    if (!parkedRecord.ok) throw new Error(parkedRecord.reason);
    const resumed = await runBot(world.input(botId, { senders: {}, request: { kind: 'resume', requestId: 'rq-resume', itemId: parked.itemId } }));
    return { parked, parkedRecord: parkedRecord.value.record, resumed };
  }

  it('resumes in the parked tree, where the parked edit still is', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'park-edit', PARK_EDIT_BOT);
    const { parked, parkedRecord, resumed } = await parkAnswerResume(world, 'park-edit');
    const tree = parkedRecord.evidence.worktreePath as string;
    expect(existsSync(join(tree, 'parked.md'))).toBe(true);

    expect(resumed.kind, JSON.stringify(resumed)).toBe('completed');
    expect(stubCwd(world, resumed.runId as string)).toBe(tree);
    expect(parkedRecord.evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'awaiting-decision' });
    expect(readFileSync(join(tree, 'parked.md.resumed'), 'utf8')).toBe('continued\n');
    const record = readRunRecord(world.stateRoot, IDENTITY, resumed.runId as string);
    if (!record.ok) throw new Error(record.reason);
    expect(record.value.record.request.resumedItemId).toBe(parked.itemId);
    expect(record.value.record.evidence.worktreePath).toBe(tree);
    expect(record.value.record.evidence.branch).toBe(parkedRecord.evidence.branch);
    // The resume ends the tree by the normal rules: the bot's edits keep it.
    expect(record.value.record.evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'dirty' });
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot, tree]);
  }, 90_000);

  it('refuses a resume whose parked tree is gone, and never makes a fresh one', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'park-edit', PARK_EDIT_BOT);
    const parked = await runBot(world.input('park-edit', { senders: {} }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const parkedRecord = readRunRecord(world.stateRoot, IDENTITY, parked.runId);
    if (!parkedRecord.ok) throw new Error(parkedRecord.reason);
    const tree = parkedRecord.value.record.evidence.worktreePath as string;
    git(world.checkoutRoot, ['worktree', 'remove', '--force', tree]);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    writeNeedsYouItem(world.stateRoot, { ...item.value, answer: { text: 'keep it', answeredAt: new Date().toISOString() } });

    const resumed = await runBot(world.input('park-edit', { senders: {}, request: { kind: 'resume', requestId: 'rq-resume', itemId: parked.itemId } }));
    expect(resumed).toMatchObject({ kind: 'refused', cause: 'parked-worktree-missing', itemId: parked.itemId });
    expect(resumed.kind === 'refused' && resumed.detail).toContain(tree);
    const record = readRunRecord(world.stateRoot, IDENTITY, resumed.runId as string);
    expect(record.ok && record.value.record.exit).toMatchObject({ reason: 'parked-worktree-missing', class: 'operator' });
    expect(stubReceipt(world, resumed.runId as string)).toBeNull();
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot]);
  }, 90_000);

  it('hands a Vibe child the parked tree as its checkout, and a second question keeps that same tree', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'vibe-tree', VIBE_TREE_BOT);
    const { parked, parkedRecord, resumed } = await parkAnswerResume(world, 'vibe-tree');
    const tree = parkedRecord.evidence.worktreePath as string;
    expect(parkedRecord.evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'awaiting-decision' });
    const second = readRunRecord(world.stateRoot, IDENTITY, resumed.runId as string);
    if (!second.ok) throw new Error(second.reason);

    // The child starts in its lineage folder, so the prompt line is the only way it finds the tree it runs in.
    const prompt = stubReceipt(world, resumed.runId as string)?.prompt ?? '';
    expect(prompt).toContain(checkoutLine(second.value.record.evidence.worktreePath as string));
    expect(prompt.match(/The repository checkout is /g)).toHaveLength(1);

    // The resumed child asked again: the tree waits for that answer too.
    expect(resumed).toMatchObject({ kind: 'awaiting-decision' });
    expect(second.value.record.request.resumedItemId).toBe(parked.itemId);
    expect(second.value.record.evidence.worktreePath).toBe(tree);
    expect(second.value.record.evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'awaiting-decision' });
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot, tree]);
  }, 90_000);

  it('refuses a Vibe resume whose parked prompt names another checkout, and leaves the parked tree kept', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'vibe-tree', VIBE_TREE_BOT);
    const parked = await runBot(world.input('vibe-tree', { senders: {} }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const parkedRecord = readRunRecord(world.stateRoot, IDENTITY, parked.runId);
    if (!parkedRecord.ok) throw new Error(parkedRecord.reason);
    const tree = parkedRecord.value.record.evidence.worktreePath as string;
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    // A stored prompt that names some other folder must never reach the child.
    const stale = item.value.prompt.replace(checkoutLine(tree), checkoutLine(join(tempDir('bots-elsewhere-'), 'old-tree')));
    expect(stale).not.toBe(item.value.prompt);
    writeNeedsYouItem(world.stateRoot, { ...item.value, prompt: stale, answer: { text: 'keep them', answeredAt: new Date().toISOString() } });

    const resumed = await runBot(world.input('vibe-tree', { senders: {}, request: { kind: 'resume', requestId: 'rq-resume', itemId: parked.itemId } }));
    expect(resumed).toMatchObject({ kind: 'refused', cause: 'resume-item-invalid', itemId: parked.itemId });
    const record = readRunRecord(world.stateRoot, IDENTITY, resumed.runId as string);
    if (!record.ok) throw new Error(record.reason);
    expect(record.value.record.evidence.worktree ?? null).toBeNull();
    expect(stubReceipt(world, resumed.runId as string)).toBeNull();
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot, tree]);
  }, 90_000);

  it('refuses a resume whose bot became a worktree bot after it parked in the checkout', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    const parked = await runBot(world.input('needs-decision', { senders: {} }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const definition = join(world.checkoutRoot, 'bots', 'needs-decision', 'BOT.md');
    writeFileSync(definition, readFileSync(definition, 'utf8').replace('isolation: shared', 'isolation: worktree'));
    // The operator approved the new posture, so the resume reaches the posture check rather than the drift gate.
    approveBots(world);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    writeNeedsYouItem(world.stateRoot, { ...item.value, answer: { text: 'merge', answeredAt: new Date().toISOString() } });

    const resumed = await runBot(world.input('needs-decision', { senders: {}, request: { kind: 'resume', requestId: 'rq-resume', itemId: parked.itemId } }));
    expect(resumed).toMatchObject({ kind: 'refused', cause: 'resume-posture-changed' });
    const record = readRunRecord(world.stateRoot, IDENTITY, resumed.runId as string);
    expect(record.ok && record.value.record.exit).toMatchObject({ reason: 'resume-posture-changed', class: 'author' });
    expect(stubReceipt(world, resumed.runId as string)).toBeNull();
    expect(worktreePaths(world.checkoutRoot)).toEqual([world.checkoutRoot]);
  }, 90_000);
});

// ───────────────────────────────────────────────────────────────────
// Working place
// ───────────────────────────────────────────────────────────────────

describe('working place line', () => {
  it('worktree run', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    const outcome = await runBot(world.input('worktree-posture', { senders: {} }));
    expect(outcome.kind).toBe('completed');
    const runId = outcome.runId as string;
    const record = JSON.parse(readFileSync(recordFile(world.stateRoot, IDENTITY, runId), 'utf8')) as RunRecord;
    const { evidence } = record;
    expect(typeof evidence.worktreePath).toBe('string');
    expect(evidence.branch).toMatch(/^worktrees\/\d{3}-bot-worktree-posture$/);

    // The line is built from the record's own values, so the prompt and the record cannot disagree.
    const line = workingPlaceLine({ path: evidence.worktreePath as string, branch: evidence.branch, runFolder: evidence.runFolder });
    const prompt = stubReceipt(world, runId)?.prompt ?? '';
    expect(prompt.split('\n').filter((entry) => entry.startsWith(WORKING_PLACE_PREFIX))).toEqual([line]);
    // The child started in the directory the line names.
    expect(stubCwd(world, runId)).toBe(evidence.worktreePath);
  });
});

describe('working place', () => {
  it('refusal keeps the tree', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    const outcome = await runBot(world.input('worktree-posture', { namingScript: HALF_PROVISIONED_STUB, senders: {} }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'worktree-setup-failed' });
    const runId = outcome.runId as string;
    const record = JSON.parse(readFileSync(recordFile(world.stateRoot, IDENTITY, runId), 'utf8')) as RunRecord;
    const { evidence } = record;
    // A refusal at the isolation step still records the tree it kept and the branch it is on.
    expect(typeof evidence.worktreePath).toBe('string');
    expect(existsSync(evidence.worktreePath as string)).toBe(true);
    expect(evidence.branch).toMatch(/^worktrees\/\d{3}-bot-/);
    expect(stubReceipt(world, runId)).toBeNull();
  });
});
