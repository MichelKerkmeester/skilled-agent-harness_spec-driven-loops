// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Run Verb Tests
// ───────────────────────────────────────────────────────────────────
//
// What the `run` verb accepts and what its usage text promises. The slot a
// scheduled fire accounts belongs to the installed job alone, so a hand-typed
// `--schedule-index` must never reach slot accounting.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { userInfo } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { PINNED_IDENTITY_ENV } from '../lib/identity.js';
import { defaultSeams, installSchedule, readInstallRecord } from '../lib/installer.js';
import { needsYouExpiry, needsYouState, readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { renderBotPlist, SCHEDULED_FIRE_ENV } from '../lib/plist-render.js';
import { requestIdFor } from '../lib/request-record.js';
import { EMPTY_ROUTINE_STATE, FATIGUE_QUESTION, readRoutineState, routineStateFile, writeRoutineState } from '../lib/routine-state.js';
import { EXIT_CODES, newRunId, runBot } from '../lib/runner.js';
import { installFile, PINNED_STATE_ROOT_ENV, slotSnapshotFile } from '../lib/state-root.js';
import { readSwitch, setSwitch } from '../lib/switches.js';
import { entries, queueOf, writeItem } from './queue-support.js';
import { botWorld, BOTS_CLI, IDENTITY, runCli, stubReceipt, stubRunCount, writeBot } from './runner-support.js';
import { writeRecord } from './status-support.js';
import { cleanupTemp, REAL_CHECKOUT, tempDir } from './support.js';

import type { InstallerSeams } from '../lib/installer.js';
import type { NeedsYouItem } from '../lib/needs-you.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

const RUN_REFERENCE = resolve(import.meta.dirname, '..', '..', 'bots-run', 'references', 'run-queue-and-answer.md');

describe('bots run --schedule-index', () => {
  it('refuses a hand-typed schedule index as a usage error and leaves slot accounting untouched', () => {
    const world = botWorld();
    const refused = runCli(world, ['run', 'manual-ok', '--schedule-index', '0']);
    expect(refused.status).toBe(EXIT_CODES.usage);
    expect(refused.stderr).toContain('--schedule-index');
    expect(existsSync(slotSnapshotFile(world.stateRoot, IDENTITY, 'manual-ok', 0))).toBe(false);
    expect(stubRunCount(world)).toBe(0);
  });

  it('accepts the schedule index under the marker the installed job file carries', () => {
    const rendered = renderBotPlist({
      label: 'com.skilled.bots.acme.tool.manual-ok.0',
      interpreter: process.execPath,
      runnerPath: BOTS_CLI,
      botId: 'manual-ok',
      scheduleIndex: 0,
      checkoutRoot: '/tmp/checkout',
      skilledTree: '/tmp/skilled',
      translation: { kind: 'interval', startInterval: 300 },
      logPath: '/tmp/agent.log',
    });
    if (!rendered.ok) throw new Error(rendered.reason);
    expect(rendered.value).toContain(`<key>${SCHEDULED_FIRE_ENV}</key>`);

    const world = botWorld({ [SCHEDULED_FIRE_ENV]: '1' });
    const fired = runCli(world, ['run', 'manual-ok', '--schedule-index', '0']);
    // Past the usage check, the runner itself decides; this bot has no cron trigger to account.
    expect(fired.status).toBe(EXIT_CODES.refused);
    expect(fired.stderr).toContain('refused before dispatch');
  });
});

describe('the job values inside a run', () => {
  it('keeps the fire marker and the pinned values away from the child and the precheck', async () => {
    const jobValues = { [SCHEDULED_FIRE_ENV]: '1', [PINNED_STATE_ROOT_ENV]: '/tmp/pinned-root', [PINNED_IDENTITY_ENV]: IDENTITY };
    const world = botWorld(jobValues);
    const seen = `${world.home}/precheck-vars.txt`;
    writeBot(world, 'vars-probe', ['---', 'id: vars-probe', 'trigger: {kind: manual}', 'runtime: {kind: cli-codex}', 'isolation: shared', `precheck: "printenv > ${seen}"`, '---', 'Report the notes.', ''].join('\n'));
    // The run resolves without the values, so only what reaches the child is under test.
    const resolveEnv: NodeJS.ProcessEnv = { ...world.env };
    for (const key of Object.keys(jobValues)) delete resolveEnv[key];
    const outcome = await runBot(world.input('vars-probe', { resolveEnv }));
    expect(outcome.kind).toBe('completed');
    const childVars = stubReceipt(world, outcome.runId as string)?.env ?? {};
    const precheckVars = readFileSync(seen, 'utf8');
    // Both captures hold the admitted keys, so an absence below is a filter, not an empty read.
    expect(Object.keys(childVars)).toContain('PATH');
    expect(precheckVars).toContain('PATH=');
    for (const key of Object.keys(jobValues)) {
      expect(Object.keys(childVars), key).not.toContain(key);
      expect(precheckVars, key).not.toContain(`${key}=`);
    }
  }, 60_000);
});

describe('bots run usage text', () => {
  it('never says a run always works in the shared checkout, since a worktree bot runs in its own tree', () => {
    const { USAGE } = createRequire(import.meta.url)(BOTS_CLI) as { USAGE: string };
    const runUsage = USAGE.slice(USAGE.indexOf('  run <id>'), USAGE.indexOf('  disable <id>'));
    const runRow = readFileSync(RUN_REFERENCE, 'utf8').split('\n').find((line) => line.startsWith('| `bots run <id>`')) ?? '';
    for (const text of [runUsage, runRow]) {
      expect(text).toContain('shared checkout');
      expect(text).toMatch(/worktree/);
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// ACTIVITY, INBOX, ANSWER AND THE FULL-ACCESS GRANT
// ───────────────────────────────────────────────────────────────────

const INBOX_FIXTURE_FILE = join(
  REAL_CHECKOUT,
  'specs',
  'system-skilled-bots',
  '003-openbot-parity-build',
  '001-activity-and-actor',
  'design',
  'fixtures',
  'inbox-all.json',
);

interface FixtureAnswer {
  text: string;
  answeredAt: string;
  by?: string | null;
  scope?: 'once' | 'deny';
}

interface FixtureItem {
  id: string;
  runId: string;
  botId: string;
  identity: string;
  question: string;
  options: string[] | null;
  createdAt: string;
  expiresAt: string;
  evidence: string[];
  prompt: string;
  specFolder: string | null;
  answer: FixtureAnswer | null;
  resumeRequestId: string | null;
}

interface FixtureRow {
  id: string;
  botId: string;
  kind: string | null;
  question: string;
  state: 'open' | 'answered' | 'expired';
  at: string;
  options: string[] | null;
  createdAt: string;
  expiresAt: string;
  answer: FixtureAnswer | null;
}

interface FixturePayload {
  version: number;
  items: FixtureRow[];
}

interface InboxFixture {
  clock: string;
  items: FixtureItem[];
  expectDefault: FixturePayload;
  expectAll: FixturePayload;
}

const INBOX_FIXTURE = JSON.parse(readFileSync(INBOX_FIXTURE_FILE, 'utf8')) as InboxFixture;

// A spawned CLI reads the real clock and takes no clock option, so every
// instant moves by one offset and each item keeps the state the fixture means.
const CLOCK_OFFSET_MS = Math.round((Date.now() - Date.parse(INBOX_FIXTURE.clock)) / 1000) * 1000;

/** The first line of a command's stderr, which is the refusal it printed. */
function firstLine(text: string): string {
  return text.split('\n')[0] ?? '';
}

function shiftedInstant(value: string): string {
  return new Date(Date.parse(value) + CLOCK_OFFSET_MS).toISOString();
}

function shiftedAnswer(answer: FixtureAnswer | null): FixtureAnswer | null {
  return answer === null ? null : { ...answer, answeredAt: shiftedInstant(answer.answeredAt) };
}

function shiftedItem(item: FixtureItem): NeedsYouItem {
  return {
    ...item,
    identity: IDENTITY,
    createdAt: shiftedInstant(item.createdAt),
    expiresAt: shiftedInstant(item.expiresAt),
    answer: shiftedAnswer(item.answer),
  };
}

function shiftedRow(row: FixtureRow): FixtureRow {
  return {
    ...row,
    at: shiftedInstant(row.at),
    createdAt: shiftedInstant(row.createdAt),
    expiresAt: shiftedInstant(row.expiresAt),
    answer: shiftedAnswer(row.answer),
  };
}

function shiftedPayload(payload: FixturePayload): FixturePayload {
  return { version: payload.version, items: payload.items.map(shiftedRow) };
}

/** Write the fixture's three items into a world, under the world's own identity. */
function writeInboxFixture(world: BotWorld): void {
  for (const item of INBOX_FIXTURE.items) {
    const written = writeNeedsYouItem(world.stateRoot, shiftedItem(item));
    if (!written.ok) throw new Error(written.reason);
  }
}

/** Give a checkout the runner and the installed runtime an install preflight looks for. */
function addRunnerTree(checkoutRoot: string): void {
  mkdirSync(join(checkoutRoot, '.skilled', 'bin'), { recursive: true });
  writeFileSync(join(checkoutRoot, '.skilled', 'bin', 'bots.cjs'), '// runner stand-in\n');
  const tsx = join(checkoutRoot, '.skilled', 'skills', 'system-skilled-bots', 'runtime', 'node_modules', 'tsx');
  mkdirSync(tsx, { recursive: true });
  writeFileSync(join(tsx, 'package.json'), '{}');
}

/** A temp agents folder and an in-memory scheduler, so no install reaches the real one. */
function installerSeams(agentsDir: string): Partial<InstallerSeams> {
  return {
    agentsDir,
    accountHome: tempDir('bots-account-'),
    domain: 'gui/501',
    launchctl: (args) =>
      args[0] === 'print-disabled'
        ? { status: 0, stdout: 'disabled services = {\n}\n', stderr: '' }
        : { status: 113, stdout: '', stderr: 'Could not find service' },
    plutil: defaultSeams().plutil,
    checker: () => ({ exitCode: 0, lines: ['PASS: stub: checker stubbed'] }),
  };
}

describe('bots activity', () => {
  it('refuses an id and an unknown option', () => {
    const world = botWorld();
    const withId = runCli(world, ['activity', 'extra']);
    expect(withId.status).toBe(2);
    expect(firstLine(withId.stderr)).toBe('bots: activity takes no id');

    const withAll = runCli(world, ['activity', '--all']);
    expect(withAll.status).toBe(2);
    expect(firstLine(withAll.stderr)).toBe('bots: activity takes no --all');

    const empty = runCli(world, ['activity']);
    expect(empty.status).toBe(0);
    expect(empty.stdout).toContain('bots: no activity');
  }, 60_000);
});

describe('bots inbox', () => {
  it('prints the answered item under --all', () => {
    const world = botWorld();
    writeInboxFixture(world);

    const open = runCli(world, ['inbox', '--json']);
    expect(open.status).toBe(0);
    expect(JSON.parse(open.stdout)).toEqual(shiftedPayload(INBOX_FIXTURE.expectDefault));

    const all = runCli(world, ['inbox', '--json', '--all']);
    expect(all.status).toBe(0);
    const payload = JSON.parse(all.stdout) as FixturePayload;
    expect(payload).toEqual(shiftedPayload(INBOX_FIXTURE.expectAll));
    const digest = payload.items.find((item) => item.botId === 'digest');
    expect(digest?.state).toBe('answered');
    expect(digest?.answer?.by).toBe('ada');

    const digestItem = INBOX_FIXTURE.items.find((item) => item.botId === 'digest');
    if (digestItem?.answer == null) throw new Error('the fixture holds no answered digest item');
    const text = runCli(world, ['inbox', '--all']);
    expect(text.status).toBe(0);
    expect(text.stdout).toContain(`\tanswered ${shiftedInstant(digestItem.answer.answeredAt)} by ada scope once`);
  }, 60_000);
});

describe('bots routines', () => {
  it('lists the routines and their switches', () => {
    const world = botWorld();
    writeBot(world, 'digest', ['---', 'id: digest', 'routine:', '  what: the morning digest', '  starts:', '    - {kind: cron, expression: "15 */6 * * *"}', '  does: tell', '  until: the digest is sent', 'runtime: {kind: cli-codex}', 'isolation: shared', '---', 'Summarize the commits.', ''].join('\n'));
    writeBot(world, 'nightly-report', ['---', 'id: nightly-report', 'routine:', '  what: the nightly report', '  starts:', '    - {kind: cron, expression: "0 2 * * *"}', '  does: act', '  until: the report is filed', '  until_check: test -f reports/nightly.md', 'runtime: {kind: cli-codex}', 'isolation: shared', '---', 'Write the nightly report.', ''].join('\n'));

    // The fixture bots carry no routine block, so none of them is a row.
    const listed = runCli(world, ['routines']);
    expect(listed.status).toBe(0);
    expect(listed.stdout).toBe('digest\tevery 6h\ttell\tthe digest is sent\t-\tenabled\tstreak 0\nnightly-report\tdaily 02:00\tact\tthe report is filed\t-\tenabled\tstreak 0\n');

    setSwitch(world.stateRoot, IDENTITY, 'nightly-report', 'paused');
    writeRecord(world.stateRoot, {
      identity: IDENTITY,
      botId: 'nightly-report',
      runId: 'fail-1',
      dispatchedAt: new Date(Date.now() - 60_000).toISOString(),
      repositoryPath: world.checkoutRoot,
      exit: { reason: 'crash', class: 'environment', needsYouItemId: null, refusal: null },
    });

    const json = runCli(world, ['routines', '--json']);
    expect(json.status).toBe(0);
    expect(json.stderr).not.toContain('did not read');
    const payload = JSON.parse(json.stdout) as { version: number; routines: Record<string, unknown>[] };
    expect(payload.version).toBe(1);
    expect(payload.routines).toHaveLength(2);
    expect(payload.routines.map((row) => row.botId)).toEqual(['digest', 'nightly-report']);
    for (const row of payload.routines) {
      expect(Object.keys(row)).toEqual(['botId', 'what', 'starts', 'does', 'until', 'untilMetAt', 'failureStreak', 'switch']);
    }
    expect(payload.routines[0].starts).toEqual([{ kind: 'cron', expression: '15 */6 * * *', summary: 'every 6h' }]);
    expect(payload.routines[1]).toMatchObject({ switch: 'paused', failureStreak: 1, untilMetAt: null, does: 'act' });

    // A state file that does not read is named on stderr and never hides the row.
    const damaged = routineStateFile(world.stateRoot, IDENTITY, 'digest');
    mkdirSync(dirname(damaged), { recursive: true });
    writeFileSync(damaged, '{bad');
    const damagedRun = runCli(world, ['routines']);
    expect(damagedRun.status).toBe(0);
    expect(damagedRun.stdout.trimEnd().split('\n')).toHaveLength(2);
    expect(damagedRun.stderr).toContain('bots: routine state digest did not read');

    expect(runCli(world, ['routines', 'extra']).status).toBe(2);
  }, 60_000);
});

describe('bots enable', () => {
  it('answers the fatigue item with no resume', () => {
    const world = botWorld();
    const now = new Date();
    const item: NeedsYouItem = {
      id: 'fatigue-1',
      runId: 'fatigue-1',
      botId: 'crash',
      identity: IDENTITY,
      question: FATIGUE_QUESTION,
      options: null,
      createdAt: now.toISOString(),
      expiresAt: needsYouExpiry(now, 7),
      evidence: [],
      prompt: 'Exit with a failure status.',
      specFolder: null,
      answer: null,
      resumeRequestId: null,
    };
    const written = writeNeedsYouItem(world.stateRoot, item);
    if (!written.ok) throw new Error(written.reason);
    const fatigued = writeRoutineState(world.stateRoot, IDENTITY, 'crash', { ...EMPTY_ROUTINE_STATE, fatiguedAt: now.toISOString(), fatigueItemId: 'fatigue-1' });
    if (!fatigued.ok) throw new Error(fatigued.reason);
    setSwitch(world.stateRoot, IDENTITY, 'crash', 'disabled');
    setSwitch(world.stateRoot, IDENTITY, 'crash', 'completed');

    const enabled = runCli(world, ['enable', 'crash']);
    expect(enabled.status).toBe(0);
    expect(enabled.stdout).toContain('bots: crash no longer disabled');

    const answered = readNeedsYouItem(world.stateRoot, IDENTITY, 'fatigue-1');
    if (!answered.ok) throw new Error(answered.reason);
    expect(needsYouState(answered.value)).toBe('answered');
    expect(answered.value.answer?.text).toBe('enabled');
    expect(answered.value.resumeRequestId).toBe(requestIdFor('crash', 'fatigue-1'));
    // The answer is recorded and no resume is queued, so nothing waits on a run.
    // The root holds the request folders themselves, so only the folders are read.
    for (const [name, folder] of Object.entries(queueOf(world))) {
      if (name === 'root' || typeof folder !== 'string') continue;
      expect(entries(folder), name).toEqual([]);
    }

    const state = readRoutineState(world.stateRoot, IDENTITY, 'crash').state;
    expect(state.fatiguedAt).toBeNull();
    expect(state.fatigueItemId).toBeNull();
    expect(typeof state.enabledAt).toBe('string');
    expect(readSwitch(world.stateRoot, IDENTITY, 'crash', 'disabled')).toBeNull();
    expect(readSwitch(world.stateRoot, IDENTITY, 'crash', 'completed')).toBeNull();

    const again = runCli(world, ['enable', 'crash']);
    expect(again.status).toBe(0);
    const after = readRoutineState(world.stateRoot, IDENTITY, 'crash').state;
    expect(after.fatiguedAt).toBeNull();
    expect(after.fatigueItemId).toBeNull();

    // A notice past its expiry is named and left unanswered, and the bot still enables.
    const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
    const expired: NeedsYouItem = { ...item, id: 'fatigue-2', runId: 'fatigue-2', createdAt: eightDaysAgo.toISOString(), expiresAt: needsYouExpiry(eightDaysAgo, 7) };
    const writtenExpired = writeNeedsYouItem(world.stateRoot, expired);
    if (!writtenExpired.ok) throw new Error(writtenExpired.reason);
    const refatigued = writeRoutineState(world.stateRoot, IDENTITY, 'crash', { ...EMPTY_ROUTINE_STATE, fatiguedAt: now.toISOString(), fatigueItemId: 'fatigue-2' });
    if (!refatigued.ok) throw new Error(refatigued.reason);
    setSwitch(world.stateRoot, IDENTITY, 'crash', 'disabled');

    const lapsed = runCli(world, ['enable', 'crash']);
    expect(lapsed.status).toBe(0);
    expect(lapsed.stderr).toContain('bots: item fatigue-2 expired; not answered');
    expect(readSwitch(world.stateRoot, IDENTITY, 'crash', 'disabled')).toBeNull();
  }, 60_000);
});

describe('bots answer', () => {
  it('refuses a foreign actor without a tty', () => {
    const world = botWorld();
    const item = writeItem(world, 'manual-ok');
    const me = userInfo().username;
    const foreign = me === 'ada' ? 'grace' : 'ada';

    const refused = runCli(world, ['answer', item.id, 'yes', '--as', foreign]);
    expect(refused.status).toBe(2);
    expect(firstLine(refused.stderr)).toBe('bots: --as needs a tty');
    const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect(stored.value.answer).toBeNull();

    const empty = runCli(world, ['answer', item.id, 'yes', '--as', '']);
    expect(empty.status).toBe(2);
    expect(firstLine(empty.stderr)).toBe('bots: option --as needs a value');

    const slash = runCli(world, ['answer', item.id, 'yes', '--as', 'a/b']);
    expect(slash.status).toBe(2);
    expect(firstLine(slash.stderr)).toBe('bots: --as takes a name');

    const always = runCli(world, ['answer', item.id, 'yes', '--scope', 'always']);
    expect(always.status).toBe(2);
    expect(firstLine(always.stderr)).toBe('bots: grant-scope-unsupported');

    const sometimes = runCli(world, ['answer', item.id, 'yes', '--scope', 'sometimes']);
    expect(sometimes.status).toBe(2);
    expect(firstLine(sometimes.stderr)).toBe('bots: --scope takes once or deny');
  }, 60_000);

  it('refuses a write from a bot child', () => {
    const world = botWorld();
    const item = writeItem(world, 'manual-ok');

    const child = { ...world, env: { ...world.env, SKILLED_BOT_RUN_ID: 'r1' } };
    const refused = runCli(child, ['answer', item.id, 'yes']);
    expect(refused.status).toBe(2);
    expect(firstLine(refused.stderr)).toBe('bots: child-write-refused');
    const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect(stored.value.answer).toBeNull();

    const session = { ...world, env: { ...world.env, AI_SESSION_CHILD: '1' } };
    const enable = runCli(session, ['enable', 'manual-ok']);
    expect(enable.status).toBe(2);
    expect(firstLine(enable.stderr)).toBe('bots: child-write-refused');

    const unknown = runCli(world, ['answer', '20991231T000000Z-deadbeef', 'yes']);
    expect(unknown.status).toBe(4);
    expect(firstLine(unknown.stderr)).toMatch(/^bots: item-unknown: /);
  }, 60_000);
});

describe('bots schedule install', () => {
  it('refuses full access without a tty', () => {
    const world = botWorld();
    const refused = runCli(world, ['schedule', 'install', 'manual-ok', '--full-access']);
    expect(refused.status).toBe(2);
    expect(firstLine(refused.stderr)).toBe('bots: --full-access needs a tty');
    expect(existsSync(installFile(world.stateRoot, IDENTITY, 'manual-ok'))).toBe(false);
  }, 60_000);

  it('records full access for a non-cron bot', () => {
    const world = botWorld();
    addRunnerTree(world.checkoutRoot);
    const agentsDir = tempDir('bots-agents-');
    const seams = installerSeams(agentsDir);
    const input = { checkoutRoot: world.checkoutRoot, skilledTree: world.skilledTree, botId: 'manual-ok', env: world.env, seams };

    const granted = installSchedule({ ...input, fullAccess: true });
    if (!granted.ok) throw new Error(`${granted.reason}: ${granted.detail ?? ''}`);
    expect(granted.value.recordedOnly?.triggerKind).toBe('manual');
    expect(granted.value.record.fullAccess).toBe(true);
    expect(granted.value.record.labels).toEqual([]);
    const record = readInstallRecord(world.stateRoot, IDENTITY, 'manual-ok');
    expect(record?.fullAccess).toBe(true);
    expect(record?.labels).toEqual([]);
    expect(readdirSync(agentsDir)).toEqual([]);

    expect(installSchedule(input)).toMatchObject({ ok: false, reason: 'trigger-not-cron' });

    expect(runCli(world, ['schedule', 'install', 'manual-ok']).status).toBe(4);
  }, 120_000);
});

describe('the activity and inbox payloads', () => {
  it("match the screen's types", () => {
    const world = botWorld();
    writeInboxFixture(world);

    const all = runCli(world, ['inbox', '--json', '--all']);
    expect(all.status).toBe(0);
    const payload = JSON.parse(all.stdout) as { version: number; items: Record<string, unknown>[] };
    expect(payload).toEqual(shiftedPayload(INBOX_FIXTURE.expectAll));

    const keys = ['id', 'botId', 'kind', 'question', 'state', 'at', 'options', 'createdAt', 'expiresAt', 'answer'];
    expect(payload.items).toHaveLength(3);
    for (const item of payload.items) expect(Object.keys(item)).toEqual(keys);
  }, 60_000);
});

// ───────────────────────────────────────────────────────────────────
// THE PAYLOAD TYPES THE SCREEN READS
// ───────────────────────────────────────────────────────────────────
//
// The screen draws three payloads from one contract and the CLI produces
// them. A key the contract names and the CLI stops printing is a blank
// column on the screen, so the tables below are read from the contract and
// checked against both the CLI's real output and the sample files the
// screen is built from. A key another packet produces is left out, because
// this phase does not produce it.

const PAYLOAD_DIR = join(
  REAL_CHECKOUT,
  'specs',
  'system-skilled-bots',
  '003-openbot-parity-build',
  '003-terminal-screen',
  '002-architecture-and-contracts',
  'design',
  'payloads',
);

type JsonType = 'string' | 'boolean' | 'integer' | 'array' | 'object';

interface CheckedKey {
  path: string;
  type: JsonType;
  nullable: boolean;
}

/** One key of a payload, with the type the contract names and whether null is allowed. */
function checked(path: string, type: JsonType, nullable = false): CheckedKey {
  return { path, type, nullable };
}

/** `bots status --json`, the keys the report itself carries. */
const STATUS_KEYS: CheckedKey[] = [
  checked('version', 'integer'),
  checked('indexPath', 'string'),
  checked('builtAt', 'string', true),
  checked('updatedAt', 'string', true),
  checked('stale', 'boolean'),
  checked('staleIdentities', 'array'),
  checked('rows', 'array'),
  checked('duplicateRoots', 'array'),
  checked('notes', 'array'),
];

/** One `kind: 'bot'` row of `bots status --json`. */
const STATUS_BOT_KEYS: CheckedKey[] = [
  checked('kind', 'string'),
  checked('identity', 'string'),
  checked('botId', 'string'),
  checked('state', 'string'),
  checked('flags', 'array'),
  checked('path', 'string', true),
  checked('previousPath', 'string', true),
  checked('pathState', 'string', true),
  checked('installed', 'boolean'),
  checked('labels', 'array'),
  checked('launchd', 'array'),
  checked('reinstall', 'array'),
  checked('fix', 'string', true),
  checked('heldBy', 'string', true),
  checked('lastRun', 'object', true),
  checked('lastRun.runId', 'string'),
  checked('lastRun.dispatchedAt', 'string'),
  checked('lastRun.exitReason', 'string'),
  checked('lastRun.exitClass', 'string', true),
  checked('lastRun.needsYouItemId', 'string', true),
  checked('lastRun.delivery', 'array'),
];

/** One `kind: 'needs-you'` row of `bots status --json`. */
const STATUS_ITEM_KEYS: CheckedKey[] = [
  checked('kind', 'string'),
  checked('identity', 'string'),
  checked('itemId', 'string'),
  checked('botId', 'string'),
  checked('runId', 'string'),
  checked('state', 'string'),
  checked('createdAt', 'string'),
  checked('expiresAt', 'string'),
];

/** `bots activity --json`, the keys the payload itself carries. */
const ACTIVITY_KEYS: CheckedKey[] = [
  checked('version', 'integer'),
  checked('groups', 'array'),
];

/** One group of `bots activity --json`. */
const ACTIVITY_GROUP_KEYS: CheckedKey[] = [
  checked('id', 'string'),
  checked('title', 'string'),
  checked('rows', 'array'),
];

/** One row of one activity group. Every row carries the same keys. */
const ACTIVITY_ROW_KEYS: CheckedKey[] = [
  checked('botId', 'string'),
  checked('identity', 'string'),
  checked('state', 'string'),
  checked('at', 'string'),
  checked('actor', 'string', true),
  checked('runId', 'string', true),
  checked('schedule', 'string', true),
];

/** `bots inbox --json`, the keys the payload itself carries. */
const INBOX_KEYS: CheckedKey[] = [
  checked('version', 'integer'),
  checked('items', 'array'),
];

/** One item of `bots inbox --json`. */
const INBOX_ITEM_KEYS: CheckedKey[] = [
  checked('id', 'string'),
  checked('botId', 'string'),
  checked('kind', 'string', true),
  checked('question', 'string'),
  checked('state', 'string'),
  checked('at', 'string'),
  checked('options', 'array', true),
  checked('createdAt', 'string'),
  checked('expiresAt', 'string'),
  checked('answer', 'object', true),
];

/** The answer an item carries once it is answered. */
const ANSWER_KEYS: CheckedKey[] = [
  checked('text', 'string'),
  checked('answeredAt', 'string'),
  checked('by', 'string', true),
  checked('scope', 'string'),
];

/** A marker for a path that is not there, so a null value is never read as an absent one. */
const ABSENT = Symbol('absent');

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The value at a dotted path, or ABSENT when a segment is not there. */
function valueAt(target: unknown, path: string): unknown {
  let node = target;
  for (const part of path.split('.')) {
    if (!isObject(node)) return ABSENT;
    if (!Object.hasOwn(node, part)) return ABSENT;
    node = node[part];
  }
  return node;
}

/** Whether a value is the JSON type the contract names. */
function hasType(value: unknown, type: JsonType): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'boolean':
      return typeof value === 'boolean';
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value);
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isObject(value);
  }
}

/**
 * Every checked key of one object that is missing or carries the wrong type.
 * A path under a null parent is not checked, because the parent's null is
 * what the contract allows there.
 */
function keyProblems(target: Record<string, unknown>, keys: CheckedKey[], where: string): string[] {
  const problems: string[] = [];
  for (const entry of keys) {
    const value = valueAt(target, entry.path);
    if (value === ABSENT) {
      const cut = entry.path.lastIndexOf('.');
      if (cut !== -1 && valueAt(target, entry.path.slice(0, cut)) === null) continue;
      problems.push(`${where}: ${entry.path} is missing`);
      continue;
    }
    if (value === null) {
      if (!entry.nullable) problems.push(`${where}: ${entry.path} is null`);
      continue;
    }
    if (!hasType(value, entry.type)) problems.push(`${where}: ${entry.path} is not ${entry.type}`);
  }
  return problems;
}

/** Every checked key of a status payload and of each row it holds. */
function statusProblems(payload: Record<string, unknown>, where: string): string[] {
  const problems = keyProblems(payload, STATUS_KEYS, where);
  const rows = payload.rows;
  if (!Array.isArray(rows)) return problems;
  for (const [at, row] of rows.entries()) {
    if (!isObject(row)) {
      problems.push(`${where} rows[${at}]: not an object`);
      continue;
    }
    if (row.kind === 'bot') problems.push(...keyProblems(row, STATUS_BOT_KEYS, `${where} rows[${at}]`));
    else if (row.kind === 'needs-you') problems.push(...keyProblems(row, STATUS_ITEM_KEYS, `${where} rows[${at}]`));
    else problems.push(`${where} rows[${at}]: kind ${String(row.kind)} is neither bot nor needs-you`);
  }
  return problems;
}

/** Every checked key of an activity payload, of each group and of each row. */
function activityProblems(payload: Record<string, unknown>, where: string): string[] {
  const problems = keyProblems(payload, ACTIVITY_KEYS, where);
  const groups = payload.groups;
  if (!Array.isArray(groups)) return problems;
  for (const [at, group] of groups.entries()) {
    if (!isObject(group)) {
      problems.push(`${where} groups[${at}]: not an object`);
      continue;
    }
    problems.push(...keyProblems(group, ACTIVITY_GROUP_KEYS, `${where} groups[${at}]`));
    const rows = group.rows;
    if (!Array.isArray(rows)) continue;
    for (const [index, row] of rows.entries()) {
      if (!isObject(row)) {
        problems.push(`${where} groups[${at}] rows[${index}]: not an object`);
        continue;
      }
      problems.push(...keyProblems(row, ACTIVITY_ROW_KEYS, `${where} groups[${at}] rows[${index}]`));
    }
  }
  return problems;
}

/** Every checked key of an inbox payload, of each item and of each answer it holds. */
function inboxProblems(payload: Record<string, unknown>, where: string): string[] {
  const problems = keyProblems(payload, INBOX_KEYS, where);
  const items = payload.items;
  if (!Array.isArray(items)) return problems;
  for (const [at, item] of items.entries()) {
    if (!isObject(item)) {
      problems.push(`${where} items[${at}]: not an object`);
      continue;
    }
    problems.push(...keyProblems(item, INBOX_ITEM_KEYS, `${where} items[${at}]`));
    if (isObject(item.answer)) problems.push(...keyProblems(item.answer, ANSWER_KEYS, `${where} items[${at}].answer`));
  }
  return problems;
}

/** Write one answered needs-you item, so the answer's own keys are checked too. */
function writeAnsweredItem(world: BotWorld, botId: string): NeedsYouItem {
  const created = new Date();
  const id = newRunId(created);
  const item: NeedsYouItem = {
    id,
    runId: id,
    botId,
    identity: IDENTITY,
    question: 'Which channel?',
    options: ['email', 'chat'],
    createdAt: created.toISOString(),
    expiresAt: needsYouExpiry(created, 7),
    evidence: [],
    prompt: 'The parked prompt.',
    specFolder: null,
    answer: { text: 'email', answeredAt: created.toISOString(), by: 'ada', scope: 'once' },
    resumeRequestId: null,
  };
  const written = writeNeedsYouItem(world.stateRoot, item);
  if (!written.ok) throw new Error(written.reason);
  return item;
}

describe('bots activity and inbox', () => {
  it('payload types', async () => {
    const world = botWorld();
    // An open item holds its bot, so the two items name bots this test never runs.
    writeItem(world, 'digest');
    writeAnsweredItem(world, 'archive');

    const completed = await runBot(world.input('manual-ok', { actor: 'ada' }));
    expect(completed.kind).toBe('completed');
    const refused = await runBot(world.input('failing-precheck', { actor: 'ada' }));
    expect(refused.kind).toBe('refused');

    const status = runCli(world, ['status', '--json']);
    expect(status.status).toBe(0);
    const statusPayload = JSON.parse(status.stdout) as Record<string, unknown>;

    const activity = runCli(world, ['activity', '--json']);
    expect(activity.status).toBe(0);
    const activityPayload = JSON.parse(activity.stdout) as Record<string, unknown>;

    const inbox = runCli(world, ['inbox', '--json', '--all']);
    expect(inbox.status).toBe(0);
    const inboxPayload = JSON.parse(inbox.stdout) as Record<string, unknown>;

    // Every table below is exercised, so none of them passes on an empty list.
    const statusRows = statusPayload.rows as Record<string, unknown>[];
    expect(statusRows.filter((row) => row.kind === 'bot').length).toBeGreaterThan(0);
    expect(statusRows.filter((row) => row.kind === 'needs-you').length).toBeGreaterThan(0);
    expect(statusRows.some((row) => row.kind === 'bot' && row.lastRun !== null)).toBe(true);
    const activityRows = (activityPayload.groups as Record<string, unknown>[]).flatMap((group) => group.rows as Record<string, unknown>[]);
    expect(activityRows.length).toBeGreaterThan(0);
    expect((inboxPayload.items as Record<string, unknown>[]).some((item) => item.answer !== null)).toBe(true);

    expect([
      ...statusProblems(statusPayload, 'status'),
      ...activityProblems(activityPayload, 'activity'),
      ...inboxProblems(inboxPayload, 'inbox'),
    ]).toEqual([]);

    // The same table against the samples the screen reads, so a key the
    // contract names and the sample never carries is caught here.
    const samples = {
      status: JSON.parse(readFileSync(join(PAYLOAD_DIR, 'status.json'), 'utf8')) as Record<string, unknown>,
      activity: JSON.parse(readFileSync(join(PAYLOAD_DIR, 'activity.json'), 'utf8')) as Record<string, unknown>,
      inbox: JSON.parse(readFileSync(join(PAYLOAD_DIR, 'inbox.json'), 'utf8')) as Record<string, unknown>,
    };
    expect([
      ...statusProblems(samples.status, 'status.json'),
      ...activityProblems(samples.activity, 'activity.json'),
      ...inboxProblems(samples.inbox, 'inbox.json'),
    ]).toEqual([]);
  }, 120_000);
});
