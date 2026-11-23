// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Run Verb Tests
// ───────────────────────────────────────────────────────────────────
//
// What the `run` verb accepts and what its usage text promises. The slot a
// scheduled fire accounts belongs to the installed job alone, so a hand-typed
// `--schedule-index` must never reach slot accounting.

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { PINNED_IDENTITY_ENV } from '../lib/identity.js';
import { renderBotPlist, SCHEDULED_FIRE_ENV } from '../lib/plist-render.js';
import { EXIT_CODES, runBot } from '../lib/runner.js';
import { PINNED_STATE_ROOT_ENV, slotSnapshotFile } from '../lib/state-root.js';
import { botWorld, BOTS_CLI, IDENTITY, runCli, stubReceipt, stubRunCount, writeBot } from './runner-support.js';
import { cleanupTemp } from './support.js';

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
