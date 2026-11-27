// ───────────────────────────────────────────────────────────────────
// MODULE: Installer Tests
// ───────────────────────────────────────────────────────────────────
//
// Every case runs against a temp agents folder and an in-memory stand-in for
// the scheduler that records each call, so no test reaches the real
// scheduler or the real per-user agents folder. plutil is the real one, run
// only on files in temp folders, so lint and read-back are real.

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { osActor, PINNED_OPERATOR_ENV } from '../lib/actor.js';
import { buildBotLabel, buildDrainLabel } from '../lib/label.js';
import {
  accountHome,
  checkInstalls,
  checkInstallsFor,
  DRAIN_BACKOFF_BASE_SECONDS,
  DRAIN_ID,
  DRAIN_THROTTLE_SECONDS,
  defaultSeams,
  detectSkilledTree,
  disableSchedule,
  enableSchedule,
  IDENTITY_CHANGED,
  installSchedule,
  JOB_ENV_DIVERGES,
  jobEnv,
  LAUNCHD_PATH,
  launchdJobEnv,
  NEXT_FIRE_UNKNOWN,
  readDrainBackoff,
  STATE_HOME_CHANGED,
  readInstallRecord,
  scheduledDrain,
  scheduledRunEnv,
  uninstallSchedule,
} from '../lib/installer.js';
import { PINNED_IDENTITY_ENV } from '../lib/identity.js';
import { FULL_ACCESS_ENV, renderBotPlist, SCHEDULED_FIRE_ENV } from '../lib/plist-render.js';
import { lineageCommandBuilder } from '../lib/dispatch.js';
import { drainQueue } from '../lib/request-drain.js';
import { resolveBotContext } from '../lib/runner.js';
import { readSwitch, setSwitch } from '../lib/switches.js';
import { enqueueFromCheckout } from '../lib/request-queue.js';
import { defaultRepoConfig } from '../lib/repo-config.js';
import { checkRunFolder, identityStatePaths, PINNED_STATE_ROOT_ENV, runRoot, userStateRoot } from '../lib/state-root.js';
import { entries, queueOf } from './queue-support.js';
import { botWorld, BOTS_CLI, filesUnder } from './runner-support.js';
import { cleanupTemp, isolatedEnv, tempDir, tempRepo, tempSkilledTree, writeConfig } from './support.js';

import type { SpawnSyncReturns } from 'node:child_process';

import type { CommandResult, InstallerSeams, InstallInput } from '../lib/installer.js';
import type { DrainInput } from '../lib/request-drain.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';
const DOMAIN = 'gui/501';

// Every CLI a test starts loads this, so launchctl is answered and logged and never reaches the scheduler.
const INTERCEPT = resolve(import.meta.dirname, 'fixtures', 'launchctl-intercept.cjs');

// ───────────────────────────────────────────────────────────────────
// FAKE SCHEDULER
// ───────────────────────────────────────────────────────────────────

/** An in-memory scheduler: what is loaded, what is disabled, and every call in order. */
class FakeScheduler {
  loaded = new Set<string>();
  disabled = new Map<string, boolean>();
  calls: string[][] = [];
  /** Verbs forced to fail with a status. */
  failures = new Map<string, number>();
  /** Whether bootstrap loads a disabled label anyway. */
  loadsDisabled = false;

  launchctl = (args: string[]): CommandResult => {
    this.calls.push(['launchctl', ...args]);
    const [verb = '', target = '', path = ''] = args;
    const forced = this.failures.get(verb);
    if (forced !== undefined) return { status: forced, stdout: '', stderr: `forced ${verb} failure` };
    const label = target.split('/').slice(2).join('/');
    switch (verb) {
      case 'print-disabled': {
        const lines = [...this.disabled].map(([name, off]) => `\t"${name}" => ${off ? 'disabled' : 'enabled'}`);
        return { status: 0, stdout: `disabled services = {\n${lines.join('\n')}\n}\n`, stderr: '' };
      }
      case 'print':
        return this.loaded.has(label) ? { status: 0, stdout: `${label} = { state = waiting }`, stderr: '' } : { status: 113, stdout: '', stderr: 'Could not find service' };
      case 'bootout':
        if (!this.loaded.delete(label)) return { status: 3, stdout: '', stderr: 'No such process' };
        return { status: 0, stdout: '', stderr: '' };
      case 'bootstrap': {
        const name = path.split('/').at(-1)?.replace(/\.plist$/, '') ?? '';
        if (this.disabled.get(name) === true && !this.loadsDisabled) return { status: 5, stdout: '', stderr: 'Bootstrap failed: 5: Input/output error' };
        this.loaded.add(name);
        return { status: 0, stdout: '', stderr: '' };
      }
      case 'enable':
        this.disabled.set(label, false);
        return { status: 0, stdout: '', stderr: '' };
      case 'disable':
        this.disabled.set(label, true);
        return { status: 0, stdout: '', stderr: '' };
      default:
        return { status: 64, stdout: '', stderr: `unknown verb ${verb}` };
    }
  };

  verbs(): string[] {
    return this.calls.filter((call) => call[0] === 'launchctl').map((call) => call[1] as string);
  }
}

function realPlutil(calls: string[][]): (args: string[]) => CommandResult {
  return (args) => {
    calls.push(['plutil', ...args]);
    const run = spawnSync('/usr/bin/plutil', args, { encoding: 'utf8' });
    return { status: run.status, stdout: run.stdout, stderr: run.stderr };
  };
}

// ───────────────────────────────────────────────────────────────────
// WORLDS
// ───────────────────────────────────────────────────────────────────

function cronBot(id: string, expression = '*/15 * * * *', runtime = 'cli-codex', extra: string[] = []): string {
  return ['---', `id: ${id}`, `trigger: {kind: cron, expression: "${expression}"}`, `runtime: {kind: ${runtime}}`, 'isolation: shared', ...extra, '---', 'Count the open notes.', ''].join('\n');
}

/** A folder holding `.skilled/bin/bots.cjs` and an installed runtime, as a real tree would. */
function makeRunnerTree(root: string): string {
  mkdirSync(join(root, '.skilled', 'bin'), { recursive: true });
  writeFileSync(join(root, '.skilled', 'bin', 'bots.cjs'), '// stand-in runner\n');
  const tsx = join(root, '.skilled', 'skills', 'system-skilled-bots', 'runtime', 'node_modules', 'tsx');
  mkdirSync(tsx, { recursive: true });
  writeFileSync(join(tsx, 'package.json'), '{}');
  return root;
}

interface InstallWorld {
  checkoutRoot: string;
  skilledTree: string;
  agentsDir: string;
  stateRoot: string;
  env: NodeJS.ProcessEnv;
  scheduler: FakeScheduler;
  plutilCalls: string[][];
  seams: Partial<InstallerSeams>;
  input(botId?: string, extra?: Partial<InstallInput>): InstallInput;
}

function installWorld(options: { identity?: string | null; agentsDir?: string; stateHome?: string; checkoutRoot?: string } = {}): InstallWorld {
  const checkoutRoot = options.checkoutRoot ?? tempRepo();
  writeConfig(checkoutRoot, options.identity === null ? {} : { identity: options.identity ?? IDENTITY });
  mkdirSync(join(checkoutRoot, 'bots', 'digest'), { recursive: true });
  writeFileSync(join(checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest'));
  if (!existsSync(join(checkoutRoot, '.skilled'))) makeRunnerTree(checkoutRoot);
  const skilledTree = tempSkilledTree(true);
  const agentsDir = options.agentsDir ?? tempDir('bots-agents-');
  const stateHome = options.stateHome ?? tempDir('bots-state-');
  const env = isolatedEnv(stateHome);
  const scheduler = new FakeScheduler();
  const plutilCalls: string[][] = [];
  const seams: Partial<InstallerSeams> = {
    agentsDir,
    accountHome: tempDir('bots-account-'),
    domain: DOMAIN,
    launchctl: scheduler.launchctl,
    plutil: realPlutil(plutilCalls),
    checker: () => ({ exitCode: 0, lines: ['PASS: stub: checker stubbed'] }),
  };
  return {
    checkoutRoot,
    skilledTree,
    agentsDir,
    stateRoot: userStateRoot(defaultRepoConfig(), env),
    env,
    scheduler,
    plutilCalls,
    seams,
    input: (botId = 'digest', extra = {}) => ({ checkoutRoot, skilledTree, botId, env, seams, ...extra }),
  };
}

/** A content hash of every file under a folder, so "unchanged" means byte-identical. */
function folderHash(root: string): string {
  const hash = createHash('sha256');
  for (const file of filesUnder(root).sort()) hash.update(file).update(readFileSync(file));
  return hash.digest('hex');
}

function labelOf(identity: string, botId: string): string {
  const built = buildBotLabel(identity, botId, 0);
  if (!built.ok) throw new Error(built.reason);
  return built.value;
}

function mustInstall(world: InstallWorld, botId = 'digest', extra: Partial<InstallInput> = {}) {
  const result = installSchedule(world.input(botId, extra));
  if (!result.ok) throw new Error(`${result.reason}: ${result.detail ?? ''}`);
  return result.value;
}

function plistJson(path: string): Record<string, unknown> {
  const run = spawnSync('/usr/bin/plutil', ['-convert', 'json', '-o', '-', path], { encoding: 'utf8' });
  return JSON.parse(run.stdout) as Record<string, unknown>;
}

/**
 * Start a job file's program as launchd would: under the built job
 * environment and nothing else, the account home being a temp folder, with
 * launchctl intercepted.
 */
function fireJob(plistPath: string, home: string): SpawnSyncReturns<string> {
  const job = plistJson(plistPath);
  const [program, ...args] = job.ProgramArguments as string[];
  const env = {
    ...launchdJobEnv({ accountHome: home, environmentVariables: (job.EnvironmentVariables as Record<string, string> | undefined) ?? null }),
    BOTS_TEST_LAUNCHCTL_LOG: join(tempDir('bots-launchctl-log-'), 'calls.jsonl'),
    BOTS_TEST_ACCOUNT_HOME: home,
  };
  return spawnSync(program as string, ['--require', INTERCEPT, ...args], { cwd: job.WorkingDirectory as string, env, encoding: 'utf8', timeout: 60_000 });
}

// ───────────────────────────────────────────────────────────────────
// TRANSACTION
// ───────────────────────────────────────────────────────────────────

describe('install transaction', () => {
  it('runs lint, bootout, move, bootstrap and print in order and reads the schedule back', () => {
    const world = installWorld();
    const treesBefore = [folderHash(world.checkoutRoot), folderHash(world.skilledTree)];
    mustInstall(world);
    const enabled = enableSchedule(world.input());
    expect(enabled.ok).toBe(true);
    world.scheduler.calls = [];
    world.plutilCalls.length = 0;

    const report = mustInstall(world);
    expect(report.steps.map((step) => step.step)).toEqual(['render', 'lint', 'bootout', 'move', 'bootstrap', 'print', 'read-back']);
    const order = [...world.plutilCalls.filter((call) => call[1] === '-lint').map(() => 'lint'), ...world.scheduler.verbs().filter((verb) => verb !== 'print-disabled')];
    expect(order).toEqual(['lint', 'print', 'bootout', 'bootstrap', 'print']);
    expect(report.loaded).toBe(true);
    expect(report.hold).toBeNull();
    expect(report.nextFire).toBe(NEXT_FIRE_UNKNOWN);
    expect(world.scheduler.verbs()).not.toContain('load');

    const job = plistJson(report.plistPaths[0] as string);
    expect(job.Label).toBe(labelOf(IDENTITY, 'digest'));
    const args = job.ProgramArguments as string[];
    expect(args[0]).toBe(process.execPath);
    expect(args.slice(2)).toEqual(['run', 'digest', '--schedule-index', '0', '--repo', report.record.checkoutRoot, '--skilled-tree', report.record.skilledTree]);
    for (const path of [args[0], args[1], args[7], args[9], job.WorkingDirectory, job.StandardOutPath] as string[]) {
      expect(path.startsWith('/')).toBe(true);
    }
    expect(readFileSync(report.plistPaths[0] as string, 'utf8')).not.toMatch(/~|\$HOME/);
    // The job's whole environment is the shell's state home, the pinned state root, identity and operator plus the fire marker.
    const operator = osActor();
    expect(job.EnvironmentVariables).toEqual({
      XDG_STATE_HOME: world.env.XDG_STATE_HOME,
      [PINNED_STATE_ROOT_ENV]: world.stateRoot,
      [PINNED_IDENTITY_ENV]: IDENTITY,
      ...(operator === null ? {} : { [PINNED_OPERATOR_ENV]: operator }),
      [SCHEDULED_FIRE_ENV]: '1',
    });
    expect((job.StartCalendarInterval as unknown[]).length).toBe(4);
    // The installer writes only to the agents folder and the state root, never into a checkout or a Skilled tree.
    expect([folderHash(world.checkoutRoot), folderHash(world.skilledTree)]).toEqual(treesBefore);
  });

  it('leaves the old job file and the loaded job untouched when lint fails', () => {
    const world = installWorld();
    mustInstall(world);
    expect(enableSchedule(world.input()).ok).toBe(true);
    const before = folderHash(world.agentsDir);
    const loadedBefore = [...world.scheduler.loaded];
    world.scheduler.calls = [];

    const failing = installSchedule(world.input('digest', { seams: { ...world.seams, plutil: (args) => (args[0] === '-lint' ? { status: 1, stdout: '', stderr: 'bad plist' } : realPlutil([])(args)) } }));
    expect(failing).toMatchObject({ ok: false, reason: 'install-step-failed' });
    expect(!failing.ok && failing.detail).toContain('lint exited 1: nothing changed');
    expect(folderHash(world.agentsDir)).toBe(before);
    expect([...world.scheduler.loaded]).toEqual(loadedBefore);
    expect(world.scheduler.verbs()).toEqual([]);
  });

  it('reports a read-back mismatch instead of claiming the install', () => {
    const world = installWorld();
    const tampered = installSchedule(world.input('digest', {
      seams: {
        ...world.seams,
        plutil: (args) => (args[0] === '-convert' ? { status: 0, stdout: JSON.stringify({ StartInterval: 60 }), stderr: '' } : realPlutil([])(args)),
      },
    }));
    expect(tampered).toMatchObject({
      ok: false,
      reason: 'install-step-failed',
      detail:
        'read-back: the installed schedule differs from the translator output: the job file is in place, the job is held disabled and not loaded (first-install), and no install record was written',
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// DISABLED DEFAULT AND KILL SWITCH
// ───────────────────────────────────────────────────────────────────

describe('disabled default', () => {
  it('holds a first install disabled and lets a reinstall before enable through', () => {
    const world = installWorld();
    const label = labelOf(IDENTITY, 'digest');
    const first = mustInstall(world);
    expect(first.hold).toBe('first-install');
    expect(first.loaded).toBe(false);
    expect(world.scheduler.disabled.get(label)).toBe(true);
    expect(world.scheduler.loaded.has(label)).toBe(false);
    // The hold is set before the job file is moved into place.
    const verbs = world.scheduler.verbs();
    expect(verbs.indexOf('disable')).toBeLessThan(verbs.indexOf('bootstrap'));

    const again = installSchedule(world.input());
    expect(again.ok).toBe(true);
    expect(again.ok && again.value.hold).toBe('first-install');
    expect(world.scheduler.loaded.has(label)).toBe(false);
  });

  it('boots a held label out again when the host loads it anyway', () => {
    const world = installWorld();
    world.scheduler.loadsDisabled = true;
    const report = mustInstall(world);
    expect(report.loaded).toBe(false);
    expect(world.scheduler.loaded.size).toBe(0);
  });

  it('enables on request and rechecks the bot first', () => {
    const world = installWorld();
    mustInstall(world);
    const label = labelOf(IDENTITY, 'digest');
    const refused = enableSchedule(world.input('digest', { seams: { ...world.seams, checker: () => ({ exitCode: 1, lines: ['FAIL: x: broken'] }) } }));
    expect(refused).toMatchObject({ ok: false, reason: 'checker-failed' });
    expect(world.scheduler.loaded.has(label)).toBe(false);

    const enabled = enableSchedule(world.input());
    expect(enabled.ok).toBe(true);
    expect(world.scheduler.disabled.get(label)).toBe(false);
    expect(world.scheduler.loaded.has(label)).toBe(true);
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')?.hold).toBeNull();
  });

  it('stops a reinstall at a kill switch and changes nothing', () => {
    const world = installWorld();
    mustInstall(world);
    expect(enableSchedule(world.input()).ok).toBe(true);
    expect(disableSchedule(world.input()).ok).toBe(true);
    const label = labelOf(IDENTITY, 'digest');
    expect(world.scheduler.loaded.has(label)).toBe(false);
    const before = folderHash(world.agentsDir);
    world.scheduler.calls = [];

    const stopped = installSchedule(world.input());
    expect(stopped).toMatchObject({ ok: false, reason: 'label-kill-switch' });
    expect(!stopped.ok && stopped.detail).toContain('bots enable digest');
    expect(folderHash(world.agentsDir)).toBe(before);
    expect(world.scheduler.verbs()).toEqual(['print-disabled']);
    expect(world.scheduler.disabled.get(label)).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// PREFLIGHT
// ───────────────────────────────────────────────────────────────────

describe('preflight', () => {
  function expectRefusal(world: InstallWorld, input: InstallInput, reason: string): void {
    const before = folderHash(world.agentsDir);
    const result = installSchedule(input);
    expect(result).toMatchObject({ ok: false, reason });
    expect(folderHash(world.agentsDir)).toBe(before);
    expect(readdirSync(world.agentsDir)).toEqual([]);
    expect(world.scheduler.calls).toEqual([]);
  }

  it('refuses an unresolvable runner', () => {
    const world = installWorld();
    rmSync(join(world.checkoutRoot, '.skilled'), { recursive: true, force: true });
    expectRefusal(world, world.input(), 'runner-unresolved');
  });

  it('refuses unreadable switches', () => {
    const world = installWorld();
    const switches = identityStatePaths(world.stateRoot, IDENTITY).switches;
    mkdirSync(switches, { recursive: true });
    chmodSync(switches, 0o000);
    try {
      expectRefusal(world, world.input(), 'switches-unreadable');
    } finally {
      chmodSync(switches, 0o700);
    }
  });

  it('refuses while identity is unknown, before any state is written', () => {
    const world = installWorld({ identity: null });
    expectRefusal(world, world.input(), 'identity-unknown');
    expect(existsSync(world.stateRoot)).toBe(false);
  });

  it('refuses a definition the real checker fails', () => {
    const world = installWorld();
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-nothing'));
    const { checker: _stub, ...realChecker } = world.seams;
    expectRefusal(world, world.input('digest', { seams: realChecker }), 'checker-failed');
  }, 60_000);

  it('refuses a posture the runner would refuse at the real checker, naming it', () => {
    const world = installWorld();
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'native'));
    const { checker: _stub, ...realChecker } = world.seams;
    const input = world.input('digest', { seams: realChecker });
    expectRefusal(world, input, 'checker-failed');
    expect(installSchedule(input)).toMatchObject({ detail: expect.stringContaining('executor-kind-native') });
  }, 60_000);

  it('still refuses a posture the runner would refuse when the checker passes it', () => {
    const world = installWorld();
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'native'));
    expectRefusal(world, world.input('digest'), 'posture-refused');
  });

  it('refuses a cron start under fifteen minutes', () => {
    const world = installWorld();
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/5 * * * *'));
    expectRefusal(world, world.input(), 'routine-floor-15-minutes');
    expect(installSchedule(world.input())).toMatchObject({ detail: 'bots/digest/BOT.md: "*/5 * * * *" is under the 900-second floor' });
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *'));
    expect(installSchedule(world.input())).toMatchObject({ ok: true });
  });

  it('refuses a Skilled tree that is a linked worktree, naming the fix', () => {
    const world = installWorld();
    const worktree = join(tempDir('bots-wt-'), 'wt');
    spawnSync('git', ['-C', world.skilledTree, '-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'commit', '-q', '--allow-empty', '-m', 'x'], { env: isolatedEnv() });
    spawnSync('git', ['-C', world.skilledTree, 'worktree', 'add', '-q', worktree], { env: isolatedEnv() });
    const result = installSchedule(world.input('digest', { skilledTree: worktree }));
    expect(result).toMatchObject({ ok: false, reason: 'skilled-tree-refused' });
    expect(!result.ok && result.detail).toContain('skilled-tree-is-worktree');
  });

  it('refuses a bot with nothing to schedule', () => {
    const world = installWorld();
    mkdirSync(join(world.checkoutRoot, 'bots', 'by-hand'), { recursive: true });
    writeFileSync(join(world.checkoutRoot, 'bots', 'by-hand', 'BOT.md'), ['---', 'id: by-hand', 'trigger: {kind: manual}', 'runtime: {kind: cli-codex}', 'isolation: shared', '---', 'Body.', ''].join('\n'));
    expectRefusal(world, world.input('by-hand'), 'trigger-not-cron');
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'by-hand')).toBeNull();
  });

  it('checks the run root without writing into the Skilled tree', () => {
    const tree = tempSkilledTree(true);
    const checked = checkRunFolder({ skilledTree: tree, identity: IDENTITY, runId: 'probe' });
    expect(checked.ok).toBe(true);
    expect(existsSync(runRoot(tree))).toBe(false);
    expect(checkRunFolder({ skilledTree: tempSkilledTree(false), identity: IDENTITY, runId: 'probe' })).toMatchObject({ ok: false, reason: 'run-folder-not-ignored' });
  });
});

// ───────────────────────────────────────────────────────────────────
// LABELS AND CLONES
// ───────────────────────────────────────────────────────────────────

describe('labels', () => {
  it('gives the same bot id in two repositories two labels and two job files', () => {
    const agentsDir = tempDir('bots-agents-');
    const one = installWorld({ identity: 'acme/tool', agentsDir });
    const two = installWorld({ identity: 'other/tool', agentsDir });
    const first = mustInstall(one);
    const second = mustInstall(two);
    expect(first.labels[0]).not.toBe(second.labels[0]);
    expect(readdirSync(agentsDir).sort()).toEqual([`${first.labels[0]}.plist`, `${second.labels[0]}.plist`].sort());
  });

  it('refuses a label another live, registered clone installed, and treats a vanished clone as moved', () => {
    const agentsDir = tempDir('bots-agents-');
    const stateHome = tempDir('bots-state-');
    const first = installWorld({ agentsDir, stateHome });
    mustInstall(first);
    const second = installWorld({ agentsDir, stateHome });
    const before = folderHash(agentsDir);

    const refused = installSchedule(second.input());
    expect(refused).toMatchObject({ ok: false, reason: 'label-held-by-clone' });
    expect(!refused.ok && refused.detail).toContain(first.checkoutRoot);
    expect(folderHash(agentsDir)).toBe(before);

    rmSync(first.checkoutRoot, { recursive: true, force: true });
    const moved = installSchedule(second.input());
    expect(moved.ok).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// UNINSTALL
// ───────────────────────────────────────────────────────────────────

describe('uninstall', () => {
  it('removes the bot and this identity\'s orphans, keeps the drain job, other repositories and every run folder', () => {
    const agentsDir = tempDir('bots-agents-');
    const world = installWorld({ agentsDir });
    const other = installWorld({ identity: 'other/tool', agentsDir });
    // The other repository's bot has no definition in this checkout, so only the identity check keeps it.
    mkdirSync(join(other.checkoutRoot, 'bots', 'nightly'), { recursive: true });
    writeFileSync(join(other.checkoutRoot, 'bots', 'nightly', 'BOT.md'), cronBot('nightly'));
    mustInstall(world);
    mustInstall(other, 'nightly');
    mustInstall(world, DRAIN_ID);
    // An orphan: a hub job of this identity whose bot definition is gone.
    mkdirSync(join(world.checkoutRoot, 'bots', 'gone'), { recursive: true });
    writeFileSync(join(world.checkoutRoot, 'bots', 'gone', 'BOT.md'), cronBot('gone'));
    mustInstall(world, 'gone');
    rmSync(join(world.checkoutRoot, 'bots', 'gone'), { recursive: true });

    const runs = runRoot(world.skilledTree);
    for (const key of ['acme%2Ftool', 'other%2Ftool']) {
      mkdirSync(join(runs, key, 'runs', 'r1'), { recursive: true });
      writeFileSync(join(runs, key, 'runs', 'r1', 'stdout.log'), `evidence of ${key}\n`);
    }
    const runsBefore = folderHash(runs);

    const removed = uninstallSchedule(world.input());
    expect(removed.ok).toBe(true);
    const names = readdirSync(agentsDir).sort();
    const drainLabel = buildDrainLabel(IDENTITY);
    if (!drainLabel.ok) throw new Error(drainLabel.reason);
    expect(names).toEqual([`${drainLabel.value}.plist`, `${labelOf('other/tool', 'nightly')}.plist`].sort());
    expect(removed.ok && removed.value.swept).toEqual([labelOf(IDENTITY, 'gone')]);
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')).toBeNull();
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'gone')).toBeNull();
    expect(readInstallRecord(world.stateRoot, IDENTITY, DRAIN_ID)).not.toBeNull();
    expect(folderHash(runs)).toBe(runsBefore);
    expect(removed.ok && removed.value.leftDisabled).toContain(labelOf(IDENTITY, 'digest'));
  });
});

// ───────────────────────────────────────────────────────────────────
// INSTALL RECORD AND NEEDS-REINSTALL CHECK
// ───────────────────────────────────────────────────────────────────

/** A consumer repository whose `.skilled` is a whole link to a separate Skilled checkout. */
function linkedWorld(mode: 'whole' | 'merge'): { world: InstallWorld; skilled: string } {
  const skilled = makeRunnerTree(tempDir('bots-skilled-'));
  const checkoutRoot = tempRepo();
  if (mode === 'whole') {
    symlinkSync(join(skilled, '.skilled'), join(checkoutRoot, '.skilled'));
  } else {
    mkdirSync(join(checkoutRoot, '.skilled'));
    symlinkSync(join(skilled, '.skilled', 'bin'), join(checkoutRoot, '.skilled', 'bin'));
    symlinkSync(join(skilled, '.skilled', 'skills'), join(checkoutRoot, '.skilled', 'skills'));
  }
  return { world: installWorld({ checkoutRoot }), skilled };
}

function vendoredWorld(pin = 'a'.repeat(40)): InstallWorld {
  const checkoutRoot = makeRunnerTree(tempRepo());
  mkdirSync(join(checkoutRoot, 'skilled-overlays'));
  writeFileSync(join(checkoutRoot, 'skilled-overlays', 'overlay-manifest.json'), JSON.stringify({ pin: { commit: pin, checkout: '../upstream' }, overlays: [] }));
  return installWorld({ checkoutRoot });
}

describe('install record', () => {
  it('records the kind, both runner paths, the tree root and a pin only for a vendored tree', () => {
    const plain = installWorld();
    const whole = linkedWorld('whole');
    const merged = linkedWorld('merge');
    const vendored = vendoredWorld();

    const cases: Array<[InstallWorld, string, string]> = [
      [plain, 'checkout', plain.checkoutRoot],
      [whole.world, 'symlink', whole.skilled],
      [merged.world, 'symlink', merged.skilled],
      [vendored, 'vendored', vendored.checkoutRoot],
    ];
    for (const [world, kind, treeRoot] of cases) {
      const report = mustInstall(world);
      const record = readInstallRecord(world.stateRoot, IDENTITY, 'digest');
      expect(record).toMatchObject({
        skilledKind: kind,
        labels: [labelOf(IDENTITY, 'digest')],
        repoRunnerPath: join(world.checkoutRoot, '.skilled', 'bin', 'bots.cjs'),
        repoRunnerRealPath: join(treeRoot, '.skilled', 'bin', 'bots.cjs'),
        plistRunnerPath: join(treeRoot, '.skilled', 'bin', 'bots.cjs'),
        treeRoot,
        pinCommit: kind === 'vendored' ? 'a'.repeat(40) : null,
        hold: 'first-install',
      });
      expect((plistJson(report.plistPaths[0] as string).ProgramArguments as string[])[1]).toBe(join(treeRoot, '.skilled', 'bin', 'bots.cjs'));
      expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).installs)).toEqual(['digest.json']);
    }
  });

  it('reads a merged link as a symlink from the real path, not from .skilled', () => {
    const { world } = linkedWorld('merge');
    const detected = detectSkilledTree(world.checkoutRoot);
    expect(detected.ok && detected.value.kind).toBe('symlink');
  });

  it('pins the operator and the full-access flag', () => {
    // The operator is the OS user that ran the install, and absent when there is none to name.
    const operator = osActor();
    const operatorPin = operator === null ? {} : { [PINNED_OPERATOR_ENV]: operator };
    const granted = installWorld();
    const plain = installWorld();
    const grantedReport = mustInstall(granted, 'digest', { fullAccess: true });
    const plainReport = mustInstall(plain);

    expect(readInstallRecord(granted.stateRoot, IDENTITY, 'digest')).toMatchObject({ operator, fullAccess: true });
    expect(readInstallRecord(plain.stateRoot, IDENTITY, 'digest')).toMatchObject({ operator, fullAccess: false });

    const grantedJob = plistJson(grantedReport.plistPaths[0] as string).EnvironmentVariables as Record<string, string>;
    expect(grantedJob).toMatchObject({ ...operatorPin, [FULL_ACCESS_ENV]: '1' });
    const plainJob = plistJson(plainReport.plistPaths[0] as string).EnvironmentVariables as Record<string, string>;
    expect(plainJob).toMatchObject(operatorPin);
    expect(Object.keys(plainJob)).not.toContain(FULL_ACCESS_ENV);

    // Every verb resolves under the job's own environment, so the operator and the grant reach it too.
    const verbs = jobEnv({ checkoutRoot: granted.checkoutRoot, botId: 'digest', env: granted.env, seams: granted.seams });
    expect(verbs).toMatchObject({ ...operatorPin, [FULL_ACCESS_ENV]: '1' });

    // The drain job names the operator and never carries the grant, which belongs to one bot.
    const drain = installWorld();
    const drainJob = plistJson(mustInstall(drain, DRAIN_ID).plistPaths[0] as string).EnvironmentVariables as Record<string, string>;
    expect(drainJob).toMatchObject(operatorPin);
    expect(Object.keys(drainJob)).not.toContain(FULL_ACCESS_ENV);
  });
});

describe('needs-reinstall check', () => {
  function checkOf(world: InstallWorld) {
    return checkInstalls({ stateRoot: world.stateRoot, identity: IDENTITY, agentsDir: world.agentsDir }).find((row) => row.botId === 'digest');
  }

  it('flags a removed runner, then reads ok after a reinstall', () => {
    const { world, skilled } = linkedWorld('whole');
    mustInstall(world);
    const runner = join(skilled, '.skilled', 'bin', 'bots.cjs');
    renameSync(runner, `${runner}.moved`);
    expect(checkOf(world)).toMatchObject({ status: 'needs-reinstall', reasons: expect.arrayContaining(['runner-missing']) });
    renameSync(`${runner}.moved`, runner);
    mustInstall(world);
    expect(checkOf(world)).toMatchObject({ status: 'ok', reasons: [] });
  });

  it('flags a retargeted link, then reads ok after a reinstall', () => {
    const { world } = linkedWorld('whole');
    mustInstall(world);
    const elsewhere = makeRunnerTree(tempDir('bots-skilled-'));
    rmSync(join(world.checkoutRoot, '.skilled'));
    symlinkSync(join(elsewhere, '.skilled'), join(world.checkoutRoot, '.skilled'));
    expect(checkOf(world)).toMatchObject({ status: 'needs-reinstall', reasons: ['runner-retargeted'] });
    const reinstalled = mustInstall(world);
    expect(reinstalled.check).toMatchObject({ status: 'ok', reasons: [] });
    expect((plistJson(reinstalled.plistPaths[0] as string).ProgramArguments as string[])[1]).toBe(join(elsewhere, '.skilled', 'bin', 'bots.cjs'));
  });

  it('flags a changed kind, then reads ok after a reinstall', () => {
    const { world } = linkedWorld('whole');
    mustInstall(world);
    rmSync(join(world.checkoutRoot, '.skilled'));
    makeRunnerTree(world.checkoutRoot);
    expect(checkOf(world)).toMatchObject({ status: 'needs-reinstall', reasons: expect.arrayContaining(['kind-changed', 'runner-retargeted']) });
    mustInstall(world);
    expect(checkOf(world)).toMatchObject({ status: 'ok', reasons: [] });
  });

  it('flags a re-pinned vendored tree, whose paths never moved, then reads ok after a reinstall', () => {
    const world = vendoredWorld('a'.repeat(40));
    mustInstall(world);
    writeFileSync(join(world.checkoutRoot, 'skilled-overlays', 'overlay-manifest.json'), JSON.stringify({ pin: { commit: 'b'.repeat(40) }, overlays: [] }));
    expect(checkOf(world)).toMatchObject({ status: 'needs-reinstall', reasons: ['pin-changed'] });
    mustInstall(world);
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')?.pinCommit).toBe('b'.repeat(40));
    expect(checkOf(world)).toMatchObject({ status: 'ok', reasons: [] });
  });

  it('reads no record whose labels are not hub labels, so uninstall deletes nothing outside the agents folder', () => {
    const world = installWorld();
    mustInstall(world);
    const recordPath = join(identityStatePaths(world.stateRoot, IDENTITY).installs, 'digest.json');
    const record = JSON.parse(readFileSync(recordPath, 'utf8')) as { labels: string[] };
    const outside = join(world.agentsDir, '..', 'outside.plist');
    writeFileSync(outside, 'not a job\n');
    writeFileSync(recordPath, JSON.stringify({ ...record, labels: ['../outside'] }));

    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')).toBeNull();
    expect(uninstallSchedule(world.input()).ok).toBe(true);
    expect(existsSync(outside)).toBe(true);
    expect(readdirSync(world.agentsDir)).toEqual([]);
  });

  it('flags a hub label with no record, and writes and calls nothing', () => {
    const world = installWorld();
    mustInstall(world);
    rmSync(join(identityStatePaths(world.stateRoot, IDENTITY).installs, 'digest.json'));
    const stateBefore = folderHash(world.stateRoot);
    const agentsBefore = folderHash(world.agentsDir);
    world.scheduler.calls = [];

    expect(checkOf(world)).toMatchObject({ status: 'needs-reinstall', reasons: ['record-missing'] });
    expect(folderHash(world.stateRoot)).toBe(stateBefore);
    expect(folderHash(world.agentsDir)).toBe(agentsBefore);
    expect(world.scheduler.calls).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────
// EXECUTOR PIN
// ───────────────────────────────────────────────────────────────────

describe('executor pin', () => {
  /** A folder outside launchd's PATH holding a stand-in `codex` that starts through env node. */
  function stubExecutor(): string {
    const bin = tempDir('bots-exec-');
    writeFileSync(join(bin, 'codex'), '#!/usr/bin/env node\n');
    chmodSync(join(bin, 'codex'), 0o755);
    return bin;
  }

  function checkOf(world: InstallWorld) {
    return checkInstalls({ stateRoot: world.stateRoot, identity: IDENTITY, agentsDir: world.agentsDir }).find((row) => row.botId === 'digest');
  }

  function buildsUnder(env: NodeJS.ProcessEnv, cwd: string): () => unknown {
    const executor = { kind: 'cli-codex', model: null, sandboxMode: 'read-only' } as unknown as Parameters<typeof lineageCommandBuilder>[0]['executor'];
    return () => lineageCommandBuilder({ executor, prompt: 'Count the open notes.', env, cwd, lineageDir: null });
  }

  it('pins the executor the shell resolves, and a scheduled fire finds it under the bare PATH', () => {
    const bin = stubExecutor();
    const world = installWorld();
    mustInstall(world, 'digest', { env: { ...world.env, PATH: `${bin}:${LAUNCHD_PATH}` } });
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')?.executor).toEqual({ kind: 'cli-codex', path: join(bin, 'codex') });

    const bare = { ...world.env, PATH: LAUNCHD_PATH };
    expect(buildsUnder(bare, world.checkoutRoot)).toThrow(/unavailable/);
    const runEnv = scheduledRunEnv({ checkoutRoot: world.checkoutRoot, botId: 'digest', env: bare, seams: world.seams });
    expect(String(runEnv.PATH).split(':').slice(0, 2)).toEqual([bin, dirname(process.execPath)]);
    expect(buildsUnder(runEnv, world.checkoutRoot)).not.toThrow();
    const job = plistJson(join(world.agentsDir, `${labelOf(IDENTITY, 'digest')}.plist`));
    expect(Object.keys((job.EnvironmentVariables as Record<string, string> | undefined) ?? {})).not.toContain('PATH');
  });

  it('leaves the PATH alone when the definition now names another kind', () => {
    const bin = stubExecutor();
    const world = installWorld();
    mustInstall(world, 'digest', { env: { ...world.env, PATH: `${bin}:${LAUNCHD_PATH}` } });
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-claude-code'));
    const bare = { ...world.env, PATH: LAUNCHD_PATH };
    expect(scheduledRunEnv({ checkoutRoot: world.checkoutRoot, botId: 'digest', env: bare, seams: world.seams }).PATH).toBe(LAUNCHD_PATH);
  });

  it('installs with a null pin when the executor does not resolve, and changes no PATH', () => {
    const world = installWorld();
    const bare = { ...world.env, PATH: LAUNCHD_PATH };
    mustInstall(world, 'digest', { env: bare });
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')?.executor).toEqual({ kind: 'cli-codex', path: null });
    expect(scheduledRunEnv({ checkoutRoot: world.checkoutRoot, botId: 'digest', env: bare, seams: world.seams }).PATH).toBe(LAUNCHD_PATH);
    expect(checkOf(world)).toMatchObject({ status: 'ok', reasons: [] });
  });

  it('pins every resolvable executor for the drain job, and a drain pass hands its runs that PATH', async () => {
    const bin = stubExecutor();
    const world = installWorld();
    mustInstall(world, DRAIN_ID, { env: { ...world.env, PATH: `${bin}:${LAUNCHD_PATH}` } });
    const record = readInstallRecord(world.stateRoot, IDENTITY, DRAIN_ID);
    expect(record?.executors).toContainEqual({ kind: 'cli-codex', path: join(bin, 'codex') });
    expect(record?.executors?.every((pin) => pin.path !== null)).toBe(true);

    let seen: NodeJS.ProcessEnv | undefined;
    const capture = (input: DrainInput) => {
      seen = input.env;
      return drainQueue(input);
    };
    const bare = { ...world.env, PATH: LAUNCHD_PATH };
    await scheduledDrain({ checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, env: bare, drain: capture });
    expect(String(seen?.PATH).split(':').slice(0, 2)).toEqual([bin, dirname(process.execPath)]);
    const drainLabel = buildDrainLabel(IDENTITY);
    if (!drainLabel.ok) throw new Error(drainLabel.reason);
    const job = plistJson(join(world.agentsDir, `${drainLabel.value}.plist`));
    expect(Object.keys((job.EnvironmentVariables as Record<string, string> | undefined) ?? {})).not.toContain('PATH');

    rmSync(join(bin, 'codex'));
    const row = checkInstalls({ stateRoot: world.stateRoot, identity: IDENTITY, agentsDir: world.agentsDir }).find((candidate) => candidate.botId === DRAIN_ID);
    expect(row).toMatchObject({ status: 'needs-reinstall', reasons: ['executor-missing'] });
  });

  it('flags a pinned executor that is gone as executor-missing', () => {
    const bin = stubExecutor();
    const world = installWorld();
    mustInstall(world, 'digest', { env: { ...world.env, PATH: `${bin}:${LAUNCHD_PATH}` } });
    rmSync(join(bin, 'codex'));
    expect(checkOf(world)).toMatchObject({ status: 'needs-reinstall', reasons: ['executor-missing'] });
  });
});

// ───────────────────────────────────────────────────────────────────
// DRAIN JOB
// ───────────────────────────────────────────────────────────────────

describe('drain job', () => {
  it('watches only the inbox under the drain label, throttled, through the same held install', () => {
    const world = installWorld();
    const report = mustInstall(world, DRAIN_ID);
    expect(report.hold).toBe('first-install');
    const job = plistJson(report.plistPaths[0] as string);
    const drainLabel = buildDrainLabel(IDENTITY);
    expect(drainLabel.ok && job.Label).toBe(drainLabel.ok ? drainLabel.value : '');
    const watched = job.QueueDirectories as string[];
    const queue = identityStatePaths(world.stateRoot, IDENTITY).requests;
    expect(watched).toEqual([queue.inbox]);
    expect(watched[0]?.endsWith(join('requests', 'inbox'))).toBe(true);
    for (const sibling of ['tmp', 'claimed', 'done', 'quarantine', 'seen'] as const) {
      expect(queue[sibling].startsWith(`${queue.inbox}/`)).toBe(false);
    }
    expect(job.ThrottleInterval).toBe(DRAIN_THROTTLE_SECONDS);
    expect((job.ProgramArguments as string[]).slice(2, 4)).toEqual(['drain', '--scheduled']);
  });

  it('backs off after a drain that stops on a setup fault, so the unemptied folder does not spin', async () => {
    const world = botWorld();
    // A Skilled tree with no ignore line refuses every run folder: a setup fault that hits every request.
    writeFileSync(join(world.skilledTree, '.gitignore'), '');
    const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: 'evt-1', prompt: '' }, world.env);
    expect(sent.ok).toBe(true);
    let passes = 0;
    const counted = (input: DrainInput) => {
      passes += 1;
      return drainQueue(input);
    };
    const base = { checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, env: world.env, runOptions: { guard: { ancestryCmdlines: [], statePaths: [] } }, drain: counted };
    const t0 = new Date('2026-11-23T09:00:00Z');

    const stopped = await scheduledDrain({ ...base, now: t0 });
    expect(stopped).toMatchObject({ kind: 'refused', reason: 'drain-stopped' });
    expect(entries(queueOf(world).inbox)).toHaveLength(1);
    expect(readDrainBackoff(world.stateRoot, IDENTITY)).toMatchObject({ failures: 1, until: new Date(t0.getTime() + DRAIN_BACKOFF_BASE_SECONDS * 1000).toISOString() });

    // Every start inside the window returns at once, without a pass.
    const inboxBefore = folderHash(queueOf(world).inbox);
    const waiting = await scheduledDrain({ ...base, now: new Date(t0.getTime() + DRAIN_THROTTLE_SECONDS * 1000) });
    expect(waiting.kind).toBe('backing-off');
    expect(passes).toBe(1);
    expect(folderHash(queueOf(world).inbox)).toBe(inboxBefore);

    // Past the window, a second fault doubles it.
    const t1 = new Date(t0.getTime() + (DRAIN_BACKOFF_BASE_SECONDS + 1) * 1000);
    const again = await scheduledDrain({ ...base, now: t1 });
    expect(again.kind).toBe('refused');
    expect(passes).toBe(2);
    expect(readDrainBackoff(world.stateRoot, IDENTITY)).toMatchObject({ failures: 2, until: new Date(t1.getTime() + 2 * DRAIN_BACKOFF_BASE_SECONDS * 1000).toISOString() });

    // Fixed setup: the next pass after the window drains and clears the back-off.
    writeFileSync(join(world.skilledTree, '.gitignore'), '.skilled/skills/.state/*/*\n');
    const drained = await scheduledDrain({ ...base, now: new Date(t1.getTime() + (2 * DRAIN_BACKOFF_BASE_SECONDS + 1) * 1000) });
    expect(drained.kind).toBe('drained');
    expect(entries(queueOf(world).inbox)).toEqual([]);
    expect(readDrainBackoff(world.stateRoot, IDENTITY)).toBeNull();
  }, 120_000);
});

// ───────────────────────────────────────────────────────────────────
// BARE PATH START
// ───────────────────────────────────────────────────────────────────

describe('a rendered job', () => {
  it('starts the real runner under the bare PATH and records the slot it fired for', () => {
    // The checkout links the real .skilled, so the job names the real CLI and runtime.
    const checkoutRoot = tempRepo();
    symlinkSync(resolve(BOTS_CLI, '..', '..'), join(checkoutRoot, '.skilled'));
    const world = installWorld({ checkoutRoot });
    const stateRoot = tempDir('bots-pinned-state-');
    writeConfig(checkoutRoot, { identity: IDENTITY, stateRoot });
    writeFileSync(join(checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-codex', ["precheck: \"echo '[SILENT] bare path probe'\""]));
    const report = mustInstall(world);
    const job = plistJson(report.plistPaths[0] as string);
    // A config state root needs no state home. The job still pins that root, the identity and the operator, plus its fire marker.
    const operator = osActor();
    expect(job.EnvironmentVariables).toEqual({
      [PINNED_STATE_ROOT_ENV]: stateRoot,
      [PINNED_IDENTITY_ENV]: IDENTITY,
      ...(operator === null ? {} : { [PINNED_OPERATOR_ENV]: operator }),
      [SCHEDULED_FIRE_ENV]: '1',
    });

    const run = fireJob(report.plistPaths[0] as string, tempDir('bots-home-'));
    expect(run.stderr).toContain('refused before dispatch (precheck-silent)');
    expect(run.status).toBe(4);

    const folder = identityStatePaths(stateRoot, IDENTITY).records;
    const [name] = readdirSync(folder);
    const record = JSON.parse(readFileSync(join(folder, name as string), 'utf8')) as { request: { firedSlot: string | null }; dispatch: Record<string, unknown> };
    expect(record.dispatch.source).toBe('schedule');
    expect(typeof record.dispatch.scheduledAt).toBe('string');
    expect(record.request.firedSlot).toBe(record.dispatch.scheduledAt);
    // Started by hand, not at a slot: the class depends on where in the 15-minute period the test runs.
    expect(['on-time', 'late']).toContain(record.dispatch.latenessClass);
    expect(record.dispatch.latenessSeconds as number).toBeLessThan(900);
  }, 60_000);
});

describe('a job installed from a shell state home', () => {
  it('fires its run and its drain against the state root the install recorded', () => {
    // No state root in the config: the installing shell's XDG_STATE_HOME decides it.
    const world = botWorld();
    symlinkSync(resolve(BOTS_CLI, '..', '..'), join(world.checkoutRoot, '.skilled'));
    mkdirSync(join(world.checkoutRoot, 'bots', 'digest'), { recursive: true });
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-codex', ["precheck: \"echo '[SILENT] state home probe'\""]));
    const seams: Partial<InstallerSeams> = {
      agentsDir: tempDir('bots-agents-'),
      accountHome: tempDir('bots-account-'),
      domain: DOMAIN,
      launchctl: new FakeScheduler().launchctl,
      plutil: realPlutil([]),
      checker: () => ({ exitCode: 0, lines: ['PASS: stub: checker stubbed'] }),
    };
    const install = (botId: string) => {
      const result = installSchedule({ checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, botId, env: world.env, seams });
      if (!result.ok) throw new Error(`${result.reason}: ${result.detail ?? ''}`);
      return result.value;
    };
    const bot = install('digest');
    const drain = install(DRAIN_ID);
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')).not.toBeNull();
    expect(readInstallRecord(world.stateRoot, IDENTITY, DRAIN_ID)).not.toBeNull();

    // launchd gives a job its bare environment plus the job file's own values, never the installing shell's.
    const bareHome = tempDir('bots-home-');
    const start = (plistPath: string) => fireJob(plistPath, bareHome);

    const fired = start(bot.plistPaths[0] as string);
    expect(fired.stderr).toContain('refused before dispatch (precheck-silent)');
    expect(fired.status).toBe(4);
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).records)).toHaveLength(1);

    // The drain finds the request the shell queued, so it reads the same inbox; a setup fault keeps it there.
    writeFileSync(join(world.skilledTree, '.gitignore'), '');
    const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: 'evt-home', prompt: '' }, world.env);
    expect(sent.ok).toBe(true);
    const drained = start(drain.plistPaths[0] as string);
    expect(drained.stderr).toContain('backs off until');
    expect(readDrainBackoff(world.stateRoot, IDENTITY)?.failures).toBe(1);

    // Nothing landed under the default state root the bare environment would otherwise resolve.
    expect(existsSync(join(bareHome, '.local', 'state'))).toBe(false);
  }, 120_000);
});

describe('operator verbs from a shell with another state home', () => {
  function installedFromStateHome() {
    const world = botWorld();
    symlinkSync(resolve(BOTS_CLI, '..', '..'), join(world.checkoutRoot, '.skilled'));
    mkdirSync(join(world.checkoutRoot, 'bots', 'digest'), { recursive: true });
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-codex', ["precheck: \"echo '[SILENT] stop probe'\""]));
    const scheduler = new FakeScheduler();
    const seams: Partial<InstallerSeams> = {
      agentsDir: tempDir('bots-agents-'),
      accountHome: tempDir('bots-account-'),
      domain: DOMAIN,
      launchctl: scheduler.launchctl,
      plutil: realPlutil([]),
      checker: () => ({ exitCode: 0, lines: ['PASS: stub: checker stubbed'] }),
    };
    const base = { checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, botId: 'digest', seams };
    const installed = installSchedule({ ...base, env: world.env });
    if (!installed.ok) throw new Error(`${installed.reason}: ${installed.detail ?? ''}`);
    expect(enableSchedule({ ...base, env: world.env }).ok).toBe(true);
    return { world, scheduler, seams, base, plistPath: installed.value.plistPaths[0] as string, label: labelOf(IDENTITY, 'digest') };
  }

  it('stops the job at the scheduler and writes the run-layer switch where the job reads it', () => {
    const { world, scheduler, base, plistPath, label } = installedFromStateHome();
    const other = { ...world.env, XDG_STATE_HOME: tempDir('bots-other-state-') };
    const unset = { ...world.env };
    delete unset.XDG_STATE_HOME;
    for (const shell of [other, unset]) expect(jobEnv({ ...base, env: shell }).XDG_STATE_HOME).toBe(world.stateHome);

    // What bots disable does: the run-layer switch first, then the scheduler.
    const context = resolveBotContext({ checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, env: jobEnv({ ...base, env: other }) });
    if (!context.ok) throw new Error(context.reason);
    expect(context.value.stateRoot).toBe(world.stateRoot);
    expect(setSwitch(context.value.stateRoot, IDENTITY, 'digest', 'disabled').ok).toBe(true);
    const disabled = disableSchedule({ ...base, env: other });
    expect(disabled).toMatchObject({ ok: true, value: { installed: true, labels: [label] } });
    expect(scheduler.disabled.get(label)).toBe(true);
    expect(scheduler.loaded.has(label)).toBe(false);
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')?.hold).toBe('operator');
    expect(readSwitch(world.stateRoot, IDENTITY, 'digest', 'disabled')).not.toBeNull();
    expect(existsSync(join(other.XDG_STATE_HOME as string, 'system-skilled-bots'))).toBe(false);

    // A fire under the job's own environment finds the switch and refuses.
    const fired = fireJob(plistPath, tempDir('bots-home-'));
    expect(fired.stderr).toContain('refused before dispatch (disabled)');
    expect(fired.status).toBe(4);
  }, 120_000);

  it('still disables the label when no install record is found', () => {
    const { world, scheduler, base, label } = installedFromStateHome();
    rmSync(join(identityStatePaths(world.stateRoot, IDENTITY).installs, 'digest.json'));
    const disabled = disableSchedule({ ...base, env: world.env });
    expect(disabled).toMatchObject({ ok: true, value: { installed: true, labels: [label] } });
    expect(scheduler.disabled.get(label)).toBe(true);
    expect(scheduler.loaded.has(label)).toBe(false);
  }, 60_000);
});

describe('a reinstall from a shell with another state home', () => {
  it('refuses state-home-changed and writes nothing, and the same state home still meets the kill switch', () => {
    const stateHome = tempDir('bots-state-a-');
    const world = installWorld({ stateHome });
    mustInstall(world);
    expect(enableSchedule(world.input()).ok).toBe(true);
    expect(disableSchedule(world.input()).ok).toBe(true);
    const agentsBefore = folderHash(world.agentsDir);
    const stateBefore = folderHash(stateHome);

    const other = { ...world.env, XDG_STATE_HOME: tempDir('bots-state-b-') };
    const unset = { ...world.env };
    delete unset.XDG_STATE_HOME;
    for (const env of [other, unset]) {
      world.scheduler.calls = [];
      const refused = installSchedule(world.input('digest', { env }));
      expect(refused).toMatchObject({ ok: false, reason: STATE_HOME_CHANGED });
      expect(!refused.ok && refused.detail).toContain(`XDG_STATE_HOME=${stateHome}`);
      expect(!refused.ok && refused.detail).toContain(userStateRoot(defaultRepoConfig(), world.env));
      expect(world.scheduler.calls).toEqual([]);
    }
    expect(readdirSync(other.XDG_STATE_HOME as string)).toEqual([]);
    expect(existsSync(join(unset.HOME as string, '.local', 'state'))).toBe(false);
    expect(folderHash(world.agentsDir)).toBe(agentsBefore);
    expect(folderHash(stateHome)).toBe(stateBefore);

    expect(installSchedule(world.input())).toMatchObject({ ok: false, reason: 'label-kill-switch' });
  });
});

describe('the CLI from a shell with another state home', () => {
  // The CLI runs for real; launchctl is answered by an intercept loaded with --require and never reaches the scheduler.
  function cliWorld() {
    const world = botWorld();
    symlinkSync(resolve(BOTS_CLI, '..', '..'), join(world.checkoutRoot, '.skilled'));
    mkdirSync(join(world.checkoutRoot, 'bots', 'digest'), { recursive: true });
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-codex', ["precheck: \"echo '[SILENT] cli probe'\""]));
    // The job file sits where the CLI's own default seams look: the temp HOME's agents folder.
    const installed = installSchedule({
      checkoutRoot: world.checkoutRoot,
      skilledTree: world.skilledTree,
      botId: 'digest',
      env: world.env,
      seams: { agentsDir: join(world.home, 'Library', 'LaunchAgents'), accountHome: world.home, domain: DOMAIN, launchctl: new FakeScheduler().launchctl, plutil: realPlutil([]), checker: () => ({ exitCode: 0, lines: [] }) },
    });
    if (!installed.ok) throw new Error(`${installed.reason}: ${installed.detail ?? ''}`);
    const log = join(tempDir('bots-launchctl-log-'), 'calls.jsonl');
    const otherHome = tempDir('bots-state-other-');
    const cli = (args: string[]) => spawnSync(process.execPath, ['--require', INTERCEPT, BOTS_CLI, ...args, '--repo', world.checkoutRoot, '--skilled-tree', world.skilledTree], {
      cwd: world.checkoutRoot,
      env: { ...world.env, XDG_STATE_HOME: otherHome, BOTS_TEST_LAUNCHCTL_LOG: log, BOTS_TEST_ACCOUNT_HOME: world.home },
      encoding: 'utf8',
      timeout: 60_000,
    });
    const calls = () => (existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map((line) => JSON.parse(line) as string[]) : []);
    return { world, cli, calls, otherHome, label: labelOf(IDENTITY, 'digest') };
  }

  it('bots disable writes the switch under the job\'s state root and disables the label', () => {
    const { world, cli, calls, otherHome, label } = cliWorld();
    const run = cli(['disable', 'digest']);
    expect(run.status).toBe(0);
    expect(readSwitch(world.stateRoot, IDENTITY, 'digest', 'disabled')).not.toBeNull();
    expect(existsSync(join(otherHome, 'system-skilled-bots'))).toBe(false);
    expect(calls()).toContainEqual(['disable', expect.stringMatching(new RegExp(`/${label.replace(/\./g, '\\.')}$`))]);
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')?.hold).toBe('operator');
  }, 60_000);

  it('bots pause writes the switch under the job\'s state root', () => {
    const { world, cli, calls, otherHome } = cliWorld();
    const run = cli(['pause', 'digest']);
    expect(run.status).toBe(0);
    expect(readSwitch(world.stateRoot, IDENTITY, 'digest', 'paused')).not.toBeNull();
    expect(existsSync(join(otherHome, 'system-skilled-bots'))).toBe(false);
    expect(calls()).toEqual([]);
  }, 60_000);

  it('bots disable stops the schedule of a bot whose BOT.md is gone, and sets no switch', () => {
    const { world, cli, calls, label } = cliWorld();
    rmSync(join(world.checkoutRoot, 'bots', 'digest'), { recursive: true });
    const run = cli(['disable', 'digest']);
    expect(run.status).toBe(0);
    expect(run.stdout).toContain('schedule disabled; no run-layer switch was set');
    expect(calls()).toContainEqual(['disable', expect.stringMatching(new RegExp(`/${label.replace(/\./g, '\\.')}$`))]);
    expect(readSwitch(world.stateRoot, IDENTITY, 'digest', 'disabled')).toBeNull();
  }, 60_000);
});

describe('job paths', () => {
  it('accepts a ~ inside a name, as in iCloud Drive, and refuses a shell variable', () => {
    const icloud = '/Users/someone/Library/Mobile Documents/com~apple~CloudDocs/repo';
    const input = { label: 'com.skilled.bots.a_2fb.digest.0', interpreter: process.execPath, runnerPath: BOTS_CLI, botId: 'digest', scheduleIndex: 0, skilledTree: icloud, translation: { kind: 'interval', startInterval: 300 } as const, logPath: '/tmp/x.log' };
    expect(renderBotPlist({ ...input, checkoutRoot: icloud }).ok).toBe(true);
    expect(renderBotPlist({ ...input, checkoutRoot: '/Users/$USER/repo' })).toMatchObject({ ok: false, reason: 'path-not-absolute', detail: 'checkoutRoot' });
  });
});

describe('the default agents folder', () => {
  it('sits under the account home, whatever HOME says', () => {
    const saved = process.env.HOME;
    process.env.HOME = tempDir('bots-shell-home-');
    try {
      const seams = defaultSeams();
      expect(seams.accountHome).toBe(accountHome());
      expect(seams.agentsDir).toBe(join(accountHome(), 'Library', 'LaunchAgents'));
      expect(seams.agentsDir.startsWith(process.env.HOME)).toBe(false);
    } finally {
      process.env.HOME = saved;
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// CLI
// ───────────────────────────────────────────────────────────────────

describe('schedule verbs', () => {
  it('exits 2 with usage when schedule install has no id', () => {
    const run = spawnSync(process.execPath, [BOTS_CLI, 'schedule', 'install'], { encoding: 'utf8', env: isolatedEnv(), cwd: tempDir() });
    expect(run.status).toBe(2);
    expect(run.stderr).toContain('schedule install needs a bot id');
    expect(run.stderr).toContain('usage: bots');
  });
});

// ───────────────────────────────────────────────────────────────────
// RECHECK AND DRAIN JOB, AS INSTALLED
// ───────────────────────────────────────────────────────────────────

describe('enable rechecks the job as installed', () => {
  it('uses the recorded Skilled tree, not the one the enabling shell names', () => {
    const world = installWorld();
    mustInstall(world);
    const shellTree = join(tempDir('bots-wt-'), 'not-a-tree');
    const enabled = enableSchedule(world.input('digest', { skilledTree: shellTree }));
    expect(enabled.ok).toBe(true);
    expect(world.scheduler.loaded.has(labelOf(IDENTITY, 'digest'))).toBe(true);
  });
});

describe('the drain job as launchd starts it', () => {
  it('backs off through the CLI under the bare PATH, and a start inside the window touches nothing', () => {
    const world = botWorld();
    symlinkSync(resolve(BOTS_CLI, '..', '..'), join(world.checkoutRoot, '.skilled'));
    // Pin the state root in the config, so the bare environment and the test agree on it.
    writeConfig(world.checkoutRoot, { identity: IDENTITY, stateRoot: world.stateRoot });
    const scheduler = new FakeScheduler();
    const installed = installSchedule({
      checkoutRoot: world.checkoutRoot,
      skilledTree: world.skilledTree,
      botId: DRAIN_ID,
      env: world.env,
      seams: { agentsDir: tempDir('bots-agents-'), accountHome: tempDir('bots-account-'), domain: DOMAIN, launchctl: scheduler.launchctl, plutil: realPlutil([]) },
    });
    if (!installed.ok) throw new Error(`${installed.reason}: ${installed.detail ?? ''}`);

    // The fault arrives after install: the Skilled tree stops ignoring run folders.
    writeFileSync(join(world.skilledTree, '.gitignore'), '');
    const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: 'evt-cli', prompt: '' }, world.env);
    expect(sent.ok).toBe(true);
    const home = tempDir('bots-home-');
    const start = () => fireJob(installed.value.plistPaths[0] as string, home);

    const first = start();
    expect(first.stderr).toContain('backs off until');
    expect(first.status).toBe(1);
    expect(readDrainBackoff(world.stateRoot, IDENTITY)?.failures).toBe(1);

    const inboxBefore = folderHash(queueOf(world).inbox);
    const second = start();
    expect(second.stderr).toContain('backing off until');
    expect(second.status).toBe(0);
    expect(folderHash(queueOf(world).inbox)).toBe(inboxBefore);
    expect(entries(queueOf(world).inbox)).toHaveLength(1);
    expect(readDrainBackoff(world.stateRoot, IDENTITY)?.failures).toBe(1);
  }, 120_000);
});

// ───────────────────────────────────────────────────────────────────
// SHELL AND JOB RESOLVE THE SAME IDENTITY AND STATE ROOT
// ───────────────────────────────────────────────────────────────────

describe('an install whose job would resolve another identity', () => {
  it('refuses job-env-diverges when the shell names a CI repository and origin names another, and writes nothing', () => {
    const world = installWorld({ identity: null, checkoutRoot: tempRepo('https://github.com/other/thing.git') });
    const shell = { ...world.env, GITHUB_REPOSITORY: IDENTITY };
    const agentsBefore = folderHash(world.agentsDir);

    const refused = installSchedule(world.input('digest', { env: shell }));
    expect(refused).toMatchObject({ ok: false, reason: JOB_ENV_DIVERGES });
    expect(!refused.ok && refused.detail).toContain(`(${IDENTITY}, ${world.stateRoot})`);
    expect(!refused.ok && refused.detail).toContain(`(other/thing, ${world.stateRoot})`);
    expect(!refused.ok && refused.detail).toContain('bots/config.json');
    expect(folderHash(world.agentsDir)).toBe(agentsBefore);
    expect(readdirSync(world.agentsDir)).toEqual([]);
    expect(world.scheduler.calls).toEqual([]);
    expect(existsSync(world.stateRoot)).toBe(false);

    // The same checkout from a shell that names no repository resolves origin on both sides.
    expect(installSchedule(world.input()).ok).toBe(true);
  });
});

describe('the CLI from a shell that names a CI repository', () => {
  /** A real CLI world whose checkout has an origin remote, installed from `installShell`. */
  function ciWorld(config: Record<string, unknown>, origin: string, installShell: (env: NodeJS.ProcessEnv) => NodeJS.ProcessEnv) {
    const world = botWorld();
    writeConfig(world.checkoutRoot, config);
    spawnSync('git', ['-C', world.checkoutRoot, 'remote', 'add', 'origin', origin], { env: isolatedEnv() });
    symlinkSync(resolve(BOTS_CLI, '..', '..'), join(world.checkoutRoot, '.skilled'));
    mkdirSync(join(world.checkoutRoot, 'bots', 'digest'), { recursive: true });
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-codex', ["precheck: \"echo '[SILENT] ci probe'\""]));
    const home = tempDir('bots-account-');
    const installed = installSchedule({
      checkoutRoot: world.checkoutRoot,
      skilledTree: world.skilledTree,
      botId: 'digest',
      env: installShell(world.env),
      seams: { agentsDir: join(home, 'Library', 'LaunchAgents'), accountHome: home, domain: DOMAIN, launchctl: new FakeScheduler().launchctl, plutil: realPlutil([]), checker: () => ({ exitCode: 0, lines: [] }) },
    });
    if (!installed.ok) throw new Error(`${installed.reason}: ${installed.detail ?? ''}`);
    const cli = (args: string[]) => spawnSync(process.execPath, ['--require', INTERCEPT, BOTS_CLI, ...args, '--repo', world.checkoutRoot, '--skilled-tree', world.skilledTree], {
      cwd: world.checkoutRoot,
      env: { ...world.env, GITHUB_REPOSITORY: 'ci/elsewhere', BOTS_TEST_LAUNCHCTL_LOG: join(tempDir('bots-launchctl-log-'), 'calls.jsonl'), BOTS_TEST_ACCOUNT_HOME: home },
      encoding: 'utf8',
      timeout: 60_000,
    });
    return { world, home, cli, plistPath: installed.value.plistPaths[0] as string };
  }

  it('installs with a declared identity, and a pause from that shell lands where the job refuses', () => {
    const { world, home, cli, plistPath } = ciWorld({ identity: IDENTITY }, 'https://github.com/other/thing.git', (env) => ({ ...env, GITHUB_REPOSITORY: 'ci/elsewhere' }));
    const paused = cli(['pause', 'digest']);
    expect(paused.status).toBe(0);
    expect(readSwitch(world.stateRoot, IDENTITY, 'digest', 'paused')).not.toBeNull();

    const fired = fireJob(plistPath, home);
    expect(fired.stderr).toContain('refused before dispatch (paused)');
    expect(fired.status).toBe(4);
  }, 120_000);

  it('resolves the origin identity the job uses, not the shell\'s CI repository', () => {
    const { world, home, cli, plistPath } = ciWorld({}, `https://github.com/${IDENTITY}.git`, (env) => env);
    const paused = cli(['pause', 'digest']);
    expect(paused.status).toBe(0);
    expect(readSwitch(world.stateRoot, IDENTITY, 'digest', 'paused')).not.toBeNull();
    expect(existsSync(identityStatePaths(world.stateRoot, 'ci/elsewhere').switches)).toBe(false);

    const fired = fireJob(plistPath, home);
    expect(fired.stderr).toContain('refused before dispatch (paused)');
    expect(fired.status).toBe(4);
  }, 120_000);
});

describe('an install from a shell with another HOME and no state home', () => {
  it('pins the state home the shell resolved, so the job and every verb agree with the install', () => {
    const world = installWorld();
    const shell: NodeJS.ProcessEnv = { ...world.env, HOME: tempDir('bots-other-home-') };
    delete shell.XDG_STATE_HOME;
    const shellRoot = userStateRoot(defaultRepoConfig(), shell);
    expect(shellRoot.startsWith(shell.HOME as string)).toBe(true);

    const report = mustInstall(world, 'digest', { env: shell });
    const job = plistJson(report.plistPaths[0] as string);
    // The operator is the OS user that ran the install, and absent when there is none to name.
    const operator = osActor();
    const pins = { [PINNED_STATE_ROOT_ENV]: shellRoot, [PINNED_IDENTITY_ENV]: IDENTITY, ...(operator === null ? {} : { [PINNED_OPERATOR_ENV]: operator }) };
    expect(job.EnvironmentVariables).toEqual({ XDG_STATE_HOME: join(shell.HOME as string, '.local', 'state'), ...pins, [SCHEDULED_FIRE_ENV]: '1' });
    expect(readInstallRecord(shellRoot, IDENTITY, 'digest')).not.toBeNull();

    // The verbs' environment is the job's minus its fire marker: the bare PATH, the account home, the state home and the pins.
    const verbs = jobEnv({ checkoutRoot: world.checkoutRoot, botId: 'digest', env: world.env, seams: world.seams });
    expect(verbs).toEqual({ PATH: LAUNCHD_PATH, HOME: world.seams.accountHome, XDG_STATE_HOME: join(shell.HOME as string, '.local', 'state'), ...pins });
    expect(userStateRoot(defaultRepoConfig(), verbs)).toBe(shellRoot);
  });
});

// ───────────────────────────────────────────────────────────────────
// JOBS FOUND BY THEIR CHECKOUT, NOT BY THE LABEL BUILT NOW
// ───────────────────────────────────────────────────────────────────

describe('a job installed before the checkout\'s identity changed', () => {
  const OLD = 'acme/tool';

  /** A real CLI world installed under origin `acme/tool`, then given another identity by `change`. */
  function renamedWorld(change: 'origin' | 'config') {
    const world = botWorld();
    writeConfig(world.checkoutRoot, {});
    spawnSync('git', ['-C', world.checkoutRoot, 'remote', 'add', 'origin', `https://github.com/${OLD}.git`], { env: isolatedEnv() });
    symlinkSync(resolve(BOTS_CLI, '..', '..'), join(world.checkoutRoot, '.skilled'));
    mkdirSync(join(world.checkoutRoot, 'bots', 'digest'), { recursive: true });
    writeFileSync(join(world.checkoutRoot, 'bots', 'digest', 'BOT.md'), cronBot('digest', '*/15 * * * *', 'cli-codex', ["precheck: \"echo '[SILENT] rename probe'\""]));
    const home = tempDir('bots-account-');
    const agentsDir = join(home, 'Library', 'LaunchAgents');
    const seams: Partial<InstallerSeams> = { agentsDir, accountHome: home, domain: DOMAIN, launchctl: new FakeScheduler().launchctl, plutil: realPlutil([]), checker: () => ({ exitCode: 0, lines: [] }) };
    const base = { checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, botId: 'digest', env: world.env, seams };
    const installed = installSchedule(base);
    if (!installed.ok) throw new Error(`${installed.reason}: ${installed.detail ?? ''}`);
    const renamed = change === 'origin' ? 'acme/renamed' : 'acme/declared';
    if (change === 'origin') spawnSync('git', ['-C', world.checkoutRoot, 'remote', 'set-url', 'origin', `https://github.com/${renamed}.git`], { env: isolatedEnv() });
    else writeConfig(world.checkoutRoot, { identity: renamed });
    const log = join(tempDir('bots-launchctl-log-'), 'calls.jsonl');
    const otherHome = tempDir('bots-state-other-');
    const cli = (args: string[]) => spawnSync(process.execPath, ['--require', INTERCEPT, BOTS_CLI, ...args, '--repo', world.checkoutRoot, '--skilled-tree', world.skilledTree], {
      cwd: world.checkoutRoot,
      env: { ...world.env, XDG_STATE_HOME: otherHome, BOTS_TEST_LAUNCHCTL_LOG: log, BOTS_TEST_ACCOUNT_HOME: home },
      encoding: 'utf8',
      timeout: 60_000,
    });
    const calls = () => (existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map((line) => JSON.parse(line) as string[]) : []);
    return { world, home, agentsDir, seams, base, cli, calls, otherHome, renamed, oldLabel: labelOf(OLD, 'digest'), plistPath: installed.value.plistPaths[0] as string };
  }

  for (const change of ['origin', 'config'] as const) {
    it(`after the ${change} changes it: disable stops the old label and sets the switch where the job reads, and a reinstall refuses identity-changed`, () => {
      const { world, home, agentsDir, seams, base, cli, calls, otherHome, renamed, oldLabel, plistPath } = renamedWorld(change);

      // jobEnv finds the old job by its checkout, so every verb resolves the job's pinned state home.
      expect(jobEnv({ ...base, env: { ...world.env, XDG_STATE_HOME: otherHome } }).XDG_STATE_HOME).toBe(world.stateHome);

      const disabled = cli(['disable', 'digest']);
      expect(disabled.status).toBe(0);
      expect(calls()).toContainEqual(['disable', expect.stringMatching(new RegExp(`/${oldLabel.replace(/\./g, '\\.')}$`))]);
      // The job pinned the identity it was installed under, so the verbs keep to it and the new one gets no switch.
      expect(readSwitch(world.stateRoot, OLD, 'digest', 'disabled')).not.toBeNull();
      expect(readSwitch(world.stateRoot, renamed, 'digest', 'disabled')).toBeNull();
      expect(existsSync(join(otherHome, 'system-skilled-bots'))).toBe(false);

      // The old job, fired under its own environment, resolves its pinned identity and is stopped. A config
      // edit is itself a change nobody approved since the install, so that fire stops on drift first.
      const fired = fireJob(plistPath, home);
      expect(fired.stderr).toContain(change === 'config' ? 'refused before dispatch (definition-drifted): bots/config.json' : 'refused before dispatch (disabled)');
      expect(fired.status).toBe(4);

      // A reinstall would leave two jobs for one bot: it refuses and writes nothing.
      const agentsBefore = folderHash(agentsDir);
      const refused = installSchedule(base);
      expect(refused).toMatchObject({ ok: false, reason: IDENTITY_CHANGED });
      expect(!refused.ok && refused.detail).toContain(oldLabel);
      expect(!refused.ok && refused.detail).toContain('bots schedule uninstall for digest');
      expect(folderHash(agentsDir)).toBe(agentsBefore);

      // The check names it, and uninstall removes the old job and its record.
      const checked = checkInstallsFor(base);
      expect(checked.ok && checked.value).toContainEqual({ botId: 'digest', labels: [oldLabel], status: 'needs-reinstall', reasons: ['identity-changed'] });
      expect(readInstallRecord(world.stateRoot, OLD, 'digest')).not.toBeNull();
      const removed = uninstallSchedule(base);
      expect(removed.ok && removed.value.removed).toContain(oldLabel);
      expect(readdirSync(agentsDir)).toEqual([]);
      expect(readInstallRecord(world.stateRoot, OLD, 'digest')).toBeNull();

      const again = installSchedule(base);
      expect(again.ok && again.value.labels).toEqual([labelOf(renamed, 'digest')]);
      expect(seams.agentsDir).toBe(agentsDir);
    }, 120_000);
  }

  it('disable with no install record still stops the job found by its checkout', () => {
    const { world, base, oldLabel, agentsDir } = renamedWorld('origin');
    const scheduler = new FakeScheduler();
    const label = oldLabel;
    scheduler.loaded.add(label);
    const stopped = disableSchedule({ ...base, seams: { ...base.seams, launchctl: scheduler.launchctl } });
    expect(stopped).toMatchObject({ ok: true, value: { installed: true, labels: [label] } });
    expect(scheduler.disabled.get(label)).toBe(true);
    expect(scheduler.loaded.has(label)).toBe(false);
    expect(readdirSync(agentsDir)).toEqual([`${label}.plist`]);
    expect(readInstallRecord(world.stateRoot, 'acme/renamed', 'digest')).toBeNull();
  }, 60_000);
});

describe('a job installed for another state root', () => {
  it('refuses a reinstall after the config adds a stateRoot, because the drain job watches the old inbox, and the check says so', () => {
    const world = installWorld();
    const report = mustInstall(world, DRAIN_ID);
    const oldInbox = identityStatePaths(world.stateRoot, IDENTITY).requests.inbox;
    expect(plistJson(report.plistPaths[0] as string).QueueDirectories).toEqual([oldInbox]);

    const pinned = tempDir('bots-pinned-state-');
    writeConfig(world.checkoutRoot, { identity: IDENTITY, stateRoot: pinned });
    const agentsBefore = folderHash(world.agentsDir);
    world.scheduler.calls = [];
    const refused = installSchedule(world.input(DRAIN_ID));
    expect(refused).toMatchObject({ ok: false, reason: STATE_HOME_CHANGED });
    expect(!refused.ok && refused.detail).toContain(report.labels[0]);
    expect(!refused.ok && refused.detail).toContain('bots schedule uninstall drain');
    expect(folderHash(world.agentsDir)).toBe(agentsBefore);
    expect(world.scheduler.calls).toEqual([]);
    expect(existsSync(pinned) && readdirSync(pinned)).toEqual([]);

    const checked = checkInstallsFor({ checkoutRoot: world.checkoutRoot, env: world.env, seams: world.seams });
    expect(checked.ok && checked.value).toContainEqual({ botId: DRAIN_ID, labels: report.labels, status: 'needs-reinstall', reasons: ['record-missing', 'state-root-changed'] });

    // Uninstall then install moves the drain job to the inbox resolved now.
    expect(uninstallSchedule(world.input(DRAIN_ID)).ok).toBe(true);
    const moved = mustInstall(world, DRAIN_ID);
    expect(plistJson(moved.plistPaths[0] as string).QueueDirectories).toEqual([identityStatePaths(pinned, IDENTITY).requests.inbox]);
  });
});

describe('a switch set before the first install', () => {
  it('refuses an install whose shell resolves another root than the one a pause was written under', () => {
    const world = installWorld();
    // What bots pause does from a shell with no state home, before any job is installed.
    const unset: NodeJS.ProcessEnv = { ...world.env };
    delete unset.XDG_STATE_HOME;
    const context = resolveBotContext({ checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, env: jobEnv({ checkoutRoot: world.checkoutRoot, botId: 'digest', env: unset, seams: world.seams }) });
    if (!context.ok) throw new Error(context.reason);
    expect(context.value.stateRoot).toBe(userStateRoot(defaultRepoConfig(), unset));
    expect(setSwitch(context.value.stateRoot, IDENTITY, 'digest', 'paused').ok).toBe(true);

    const agentsBefore = folderHash(world.agentsDir);
    const refused = installSchedule(world.input());
    expect(refused).toMatchObject({ ok: false, reason: STATE_HOME_CHANGED });
    expect(!refused.ok && refused.detail).toContain(context.value.stateRoot);
    expect(!refused.ok && refused.detail).toContain('digest.paused.json');
    expect(folderHash(world.agentsDir)).toBe(agentsBefore);
    expect(world.scheduler.calls).toEqual([]);
    expect(existsSync(world.stateRoot)).toBe(false);

    // From the shell that wrote the pause, the install goes through and the job reads that switch.
    const installed = installSchedule(world.input('digest', { env: unset }));
    expect(installed.ok).toBe(true);
    expect(readSwitch(context.value.stateRoot, IDENTITY, 'digest', 'paused')).not.toBeNull();
  });
});

describe('the launchctl intercept', () => {
  it('refuses to load without an account home, so no CLI a test starts reads the real one', () => {
    const run = spawnSync(process.execPath, ['--require', INTERCEPT, '-e', ''], {
      env: { PATH: LAUNCHD_PATH, BOTS_TEST_LAUNCHCTL_LOG: join(tempDir('bots-launchctl-log-'), 'calls.jsonl') },
      encoding: 'utf8',
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain('launchctl-intercept needs BOTS_TEST_ACCOUNT_HOME');
  });
});

describe('install preflight', () => {
  it('refuses a damaged registered-roots file before any job file is written or the scheduler is told', () => {
    const world = installWorld();
    mkdirSync(world.stateRoot, { recursive: true });
    writeFileSync(join(world.stateRoot, 'registered-roots'), '{ not json');

    const result = installSchedule(world.input());
    expect(result).toMatchObject({ ok: false, reason: 'registered-roots-unreadable' });
    expect(readdirSync(world.agentsDir)).toEqual([]);
    expect(world.scheduler.verbs().filter((verb) => !['print', 'print-disabled'].includes(verb))).toEqual([]);
    expect(readInstallRecord(world.stateRoot, IDENTITY, 'digest')).toBeNull();
  });
});

describe('a job pins its state root and identity', () => {
  it('resolves every fire and verb under the installed values, whatever a run later writes into bots/config.json', () => {
    const world = installWorld();
    const report = mustInstall(world);
    const job = plistJson(report.plistPaths[0] as string);
    expect(job.EnvironmentVariables).toMatchObject({ SKILLED_BOTS_STATE_ROOT: world.stateRoot, SKILLED_BOTS_IDENTITY: IDENTITY });

    // A run with checkout write access points the config at an empty root and another identity.
    const decoy = tempDir('bots-decoy-root-');
    writeConfig(world.checkoutRoot, { identity: 'decoy/elsewhere', stateRoot: decoy });
    for (const botId of ['digest', DRAIN_ID]) {
      const context = resolveBotContext({ checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, env: jobEnv({ checkoutRoot: world.checkoutRoot, botId, env: world.env, seams: world.seams }) });
      expect(context, botId).toMatchObject({ ok: true, value: { identity: IDENTITY, stateRoot: world.stateRoot } });
    }
  });

  it('approves the installed definition and config, and re-approves the current ones on enable', async () => {
    const { configDigest, digestOf, readApproval } = await import('../lib/approval.js');
    const world = installWorld();
    const botPath = join(world.checkoutRoot, 'bots', 'digest', 'BOT.md');
    mustInstall(world);
    expect(readApproval(world.stateRoot, IDENTITY, 'digest')).toMatchObject({
      approvedBy: 'install',
      definitionDigest: digestOf(readFileSync(botPath)),
      configDigest: configDigest(world.checkoutRoot),
    });

    writeFileSync(botPath, cronBot('digest', '*/30 * * * *'));
    expect(readApproval(world.stateRoot, IDENTITY, 'digest')?.definitionDigest).not.toBe(digestOf(readFileSync(botPath)));
    const enabled = enableSchedule(world.input());
    expect(enabled.ok).toBe(true);
    expect(readApproval(world.stateRoot, IDENTITY, 'digest')).toMatchObject({ approvedBy: 'enable', definitionDigest: digestOf(readFileSync(botPath)) });
  });
});
