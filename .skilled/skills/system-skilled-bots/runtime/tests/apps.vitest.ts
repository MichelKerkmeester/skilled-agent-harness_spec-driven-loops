// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Bot Apps Tests
// ───────────────────────────────────────────────────────────────────
//
// The declaration, the resolver over the declaration by config-state matrix,
// the file a run writes into its run folder and its tree, the record, the
// child environment key and the two run refusals. The runner cases work in a
// temp checkout with the stub executor. The executor's audited runner is
// wrapped, so a case reads the call it receives and the config file the
// child would find in its working folder at that moment.

import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runAuditedExecutorCommand } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-audit.js';
import { parseExecutorConfig } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { readUtcpServerNames, resolveApps, writeRunUtcpConfig } from '../lib/apps.js';
import { parseDefinition } from '../lib/definition.js';
import { readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { exitCodeFor, runBot } from '../lib/runner.js';
import { readRunRecord, validateRunRecord } from '../lib/run-record.js';
import { cleanupTemp, tempDir } from './support.js';
import { botWorld, commitAll, IDENTITY, stubReceipt, stubRunCount, writeBot } from './runner-support.js';

import type { NeedsYouItem } from '../lib/needs-you.js';
import type { RunRecord } from '../lib/run-record.js';
import type { BotWorld } from './runner-support.js';

interface AuditedCall {
  cwd: string;
  dispatchEnv: Record<string, string> | undefined;
  dispatchEnvKeys: string[] | undefined;
  /** The config the child would find in its working folder at dispatch, or null when there was none. */
  cwdConfig: string | null;
}

const seen = vi.hoisted(() => ({ calls: [] as AuditedCall[] }));

vi.mock('../../../system-deep-loop/runtime/lib/deep-loop/executor-audit.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../system-deep-loop/runtime/lib/deep-loop/executor-audit.js')>();
  const fs = await import('node:fs');
  const path = await import('node:path');
  return {
    ...actual,
    runAuditedExecutorCommand: (input: Parameters<typeof actual.runAuditedExecutorCommand>[0]) => {
      const config = path.join(input.cwd, '.utcp_config.json');
      seen.calls.push({
        cwd: input.cwd,
        dispatchEnv: input.dispatchEnv,
        dispatchEnvKeys: input.dispatchEnvKeys,
        cwdConfig: fs.existsSync(config) ? fs.readFileSync(config, 'utf8') : null,
      });
      return actual.runAuditedExecutorCommand(input);
    },
  };
});

const GOLDENS = resolve(import.meta.dirname, '..', '..', '..', '..', '..', 'specs', 'system-skilled-bots', '003-openbot-parity-build', '007-per-bot-apps', 'design', 'fixtures');
const SOURCE = join(GOLDENS, 'utcp-source.json');

function golden(name: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(GOLDENS, name), 'utf8')) as Record<string, unknown>;
}

/** A golden filtered copy with its dotenv path set to the one a config in `folder` resolves to. */
function goldenFor(name: string, folder: string): Record<string, unknown> {
  const copy = golden(name) as { load_variables_from: Array<{ env_file_path: string }> };
  const first = copy.load_variables_from[0];
  if (first === undefined) throw new Error(`${name} has no dotenv loader`);
  first.env_file_path = join(folder, '.env');
  return copy as unknown as Record<string, unknown>;
}

/** A folder holding the three-server source config, the given text as its config, or no config for null. */
function configFolder(text: string | null = readFileSync(SOURCE, 'utf8')): string {
  const dir = tempDir('apps-config-');
  if (text !== null) writeFileSync(join(dir, '.utcp_config.json'), text);
  return dir;
}

function honoredOf(result: ReturnType<typeof resolveApps>): string[] | string {
  return result.ok ? result.value.honored : `${result.reason}: ${result.detail ?? ''}`;
}

function bot(id: string, lines: string[], body = 'Do the task.'): string {
  return ['---', `id: ${id}`, 'trigger: {kind: manual}', 'runtime: {kind: cli-codex}', ...lines, '---', body, ''].join('\n');
}

/** A world whose checkout commits the three-server source config, so every tree holds it as its own file. */
function appsWorld(withTrees: boolean): BotWorld {
  const world = botWorld(withTrees ? { SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') } : {});
  copyFileSync(SOURCE, join(world.checkoutRoot, '.utcp_config.json'));
  commitAll(world.checkoutRoot);
  return world;
}

function recordOf(world: BotWorld, outcome: { runId: string | null }): RunRecord {
  const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
  if (!read.ok) throw new Error(read.reason);
  return read.value.record;
}

function runCopyText(rec: RunRecord): string {
  return readFileSync(join(rec.evidence.runFolder as string, 'utcp.json'), 'utf8');
}

function answeredAs(item: NeedsYouItem, text: string): NeedsYouItem {
  const answeredAt = new Date().toISOString();
  const grants = item.grants ?? null;
  return {
    ...item,
    answer: { text, answeredAt, by: 'ada', scope: 'once' },
    grants: grants === null ? null : { ...grants, scope: 'once', grantedBy: 'ada', grantedAt: answeredAt },
  };
}

afterEach(() => {
  seen.calls.length = 0;
  cleanupTemp();
});

describe('apps declaration', () => {
  const parsed = (line: string | null) => parseDefinition(bot('x', line === null ? [] : [line]));
  const appsOf = (line: string | null) => {
    const result = parsed(line);
    return result.ok ? result.value.posture.apps : result.reason;
  };

  it('parses a declared list into posture apps', () => {
    expect(appsOf('apps: [github]')).toEqual(['github']);
    expect(appsOf(null)).toBeNull();
    expect(appsOf('apps: null')).toBeNull();
    expect(appsOf('apps: []')).toEqual([]);
    // A blank name is still a name: the parser checks the shape and the resolver checks the name.
    expect(appsOf('apps: [" "]')).toEqual([' ']);
    expect(appsOf('apps: [github, github]')).toEqual(['github', 'github']);
  });

  it('refuses a non-list as apps-invalid', () => {
    expect(parsed('apps: github')).toEqual({ ok: false, reason: 'apps-invalid', detail: 'apps: expected a list of server names' });
    expect(parsed('apps: {github: true}')).toEqual({ ok: false, reason: 'apps-invalid', detail: 'apps: expected a list of server names' });
  });

  it('refuses an empty entry as apps-invalid', () => {
    expect(parsed('apps: [""]')).toEqual({ ok: false, reason: 'apps-invalid', detail: 'apps: entry 0 is not a non-empty string' });
    expect(parsed('apps: [1]')).toEqual({ ok: false, reason: 'apps-invalid', detail: 'apps: entry 0 is not a non-empty string' });
    expect(parsed('apps: [github, ""]')).toEqual({ ok: false, reason: 'apps-invalid', detail: 'apps: entry 1 is not a non-empty string' });
  });
});

describe('apps resolution', () => {
  it('refuses an unknown server name', () => {
    const dir = configFolder();
    expect(honoredOf(resolveApps(dir, ['nosuchserver']))).toBe('apps-unknown-server: nosuchserver');
    // The detail names the unknown name and never the one the config holds.
    expect(honoredOf(resolveApps(dir, ['github', 'nosuchserver']))).toBe('apps-unknown-server: nosuchserver');
    expect(honoredOf(resolveApps(dir, ['GitHub']))).toBe('apps-unknown-server: GitHub');
    expect(honoredOf(resolveApps(dir, ['nosuchserver', 'other', 'nosuchserver']))).toBe('apps-unknown-server: nosuchserver, other');
    const devtools = configFolder(JSON.stringify({ manual_call_templates: [{ name: 'chrome_devtools_1' }, { name: 'chrome_devtools_2' }] }));
    expect(honoredOf(resolveApps(devtools, ['chrome_devtools']))).toBe('apps-unknown-server: chrome_devtools');
    // A config with no template list holds no name, so the refusal is the unknown name and not a broken config.
    const noList = configFolder(JSON.stringify({ tool_repository: { tool_repository_type: 'in_memory' } }));
    expect(honoredOf(resolveApps(noList, ['github']))).toBe('apps-unknown-server: github');
  });

  it('refuses a missing config', () => {
    const dir = configFolder(null);
    expect(honoredOf(resolveApps(dir, ['github']))).toBe(`utcp-config-missing: ${join(dir, '.utcp_config.json')}`);
    // Nothing declared reads nothing, so a missing config refuses nothing.
    expect(resolveApps(dir, null)).toEqual({ ok: true, value: { honored: [], source: null } });
    expect(resolveApps(dir, [])).toEqual({ ok: true, value: { honored: [], source: null } });
  });

  it('refuses a malformed config', () => {
    const dir = configFolder('{');
    expect(resolveApps(dir, ['github'])).toMatchObject({ ok: false, reason: 'utcp-config-invalid' });
    expect(readUtcpServerNames(configFolder('{"manual_call_templates": {}}'))).toEqual({ ok: false, reason: 'utcp-config-invalid', detail: 'manual_call_templates is not a list' });
    expect(resolveApps(dir, null)).toEqual({ ok: true, value: { honored: [], source: null } });
  });

  it('honors names in source order', () => {
    const dir = configFolder();
    expect(honoredOf(resolveApps(dir, ['github']))).toEqual(['github']);
    expect(honoredOf(resolveApps(dir, ['github', 'notion', 'figma']))).toEqual(['github', 'notion', 'figma']);
    expect(honoredOf(resolveApps(dir, ['figma', 'github']))).toEqual(['github', 'figma']);
    expect(honoredOf(resolveApps(dir, ['github', 'github']))).toEqual(['github']);
  });
});

describe('apps written file', () => {
  it('writes the filtered config into the run folder', async () => {
    // The writer over the golden source gives the one-server golden, key for key.
    const dir = configFolder();
    const source = readUtcpServerNames(dir);
    if (!source.ok) throw new Error(source.reason);
    const folder = tempDir('apps-run-');
    expect(writeRunUtcpConfig({ runFolder: folder, source: source.value, honored: ['github'] })).toEqual({ ok: true, value: { path: join(folder, 'utcp.json'), treeOriginal: null } });
    expect(JSON.parse(readFileSync(join(folder, 'utcp.json'), 'utf8'))).toEqual(goldenFor('utcp-filtered-one.json', dir));

    // A run of a bot declaring github leaves the same shape in its run folder, with an absolute dotenv path.
    const world = appsWorld(true);
    writeBot(world, 'one-app', bot('one-app', ['isolation: worktree', 'apps: [github]']));
    const outcome = await runBot(world.input('one-app', { senders: {} }));
    expect(outcome.kind).toBe('completed');
    const copy = JSON.parse(runCopyText(recordOf(world, outcome))) as { load_variables_from: Array<{ env_file_path: string }> };
    expect(isAbsolute(copy.load_variables_from[0]?.env_file_path ?? '')).toBe(true);
    expect(copy).toEqual(goldenFor('utcp-filtered-one.json', world.checkoutRoot));
  }, 90_000);

  it('writes an empty template list for a bot that declares nothing', async () => {
    const dir = configFolder();
    const source = readUtcpServerNames(dir);
    if (!source.ok) throw new Error(source.reason);
    const folder = tempDir('apps-run-');
    writeRunUtcpConfig({ runFolder: folder, source: source.value, honored: [] });
    expect(JSON.parse(readFileSync(join(folder, 'utcp.json'), 'utf8'))).toEqual(goldenFor('utcp-filtered-none.json', dir));

    // A run that declares nothing writes the empty list without reading the source, so a broken config cannot widen it.
    const shared = appsWorld(false);
    writeFileSync(join(shared.checkoutRoot, '.utcp_config.json'), '{');
    writeBot(shared, 'no-apps', bot('no-apps', ['isolation: shared']));
    const sharedRun = await runBot(shared.input('no-apps'));
    expect(sharedRun.kind).toBe('completed');
    expect(JSON.parse(runCopyText(recordOf(shared, sharedRun)))).toEqual({ manual_call_templates: [] });

    // A worktree run writes the same empty list into its tree, so the child never falls back to the tree's own config.
    const trees = appsWorld(true);
    writeBot(trees, 'no-apps-tree', bot('no-apps-tree', ['isolation: worktree']));
    const treeRun = await runBot(trees.input('no-apps-tree', { senders: {} }));
    expect(treeRun.kind).toBe('completed');
    const rec = recordOf(trees, treeRun);
    expect(JSON.parse(runCopyText(rec))).toEqual({ manual_call_templates: [] });
    const call = seen.calls.find((entry) => entry.cwd === rec.evidence.worktreePath);
    expect(call?.cwdConfig).toBe(runCopyText(rec));
  }, 120_000);

  it('writes the filtered config into the worktree root', async () => {
    const world = appsWorld(true);
    writeBot(world, 'one-app', bot('one-app', ['isolation: worktree', 'apps: [github]']));
    const outcome = await runBot(world.input('one-app', { senders: {} }));
    expect(outcome.kind).toBe('completed');
    const rec = recordOf(world, outcome);
    const call = seen.calls.find((entry) => entry.cwd === rec.evidence.worktreePath);
    if (call === undefined || call.cwdConfig === null) throw new Error('the child found no config in its tree');
    const treeCopy = JSON.parse(call.cwdConfig) as { manual_call_templates: Array<{ name: string }> };
    expect(treeCopy.manual_call_templates.map((entry) => entry.name)).toEqual(['github']);
    // The tree's copy is the run folder's bytes, so the two can never differ.
    expect(call.cwdConfig).toBe(runCopyText(rec));
  }, 90_000);

  it('restores the worktree file after the run', async () => {
    // A tracked config is put back, so the unchanged tree is removed rather than kept as dirty.
    const world = appsWorld(true);
    writeBot(world, 'one-app', bot('one-app', ['isolation: worktree', 'apps: [github]']));
    const outcome = await runBot(world.input('one-app', { senders: {} }));
    expect(outcome.kind).toBe('completed');
    expect(recordOf(world, outcome).evidence.worktree).toMatchObject({ disposition: 'removed', keptReason: null });

    // A tree whose checkout tracks no config has its copy removed again, so it is left clean too.
    const bare = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(bare, 'bare-tree', bot('bare-tree', ['isolation: worktree']));
    const bareRun = await runBot(bare.input('bare-tree', { senders: {} }));
    expect(bareRun.kind).toBe('completed');
    expect(recordOf(bare, bareRun).evidence.worktree).toMatchObject({ disposition: 'removed', keptReason: null });
  }, 120_000);

  it('restores a tree left holding the filtered file at the next open', async () => {
    const world = appsWorld(true);
    writeBot(world, 'park-app', bot('park-app', ['isolation: worktree', 'apps: [github]'], 'Edit the notes and ask before keeping them.\nSTUB:park-edit=parked.md'));
    const own = readFileSync(join(world.checkoutRoot, '.utcp_config.json'), 'utf8');
    const parked = await runBot(world.input('park-app', { senders: {} }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const parkedRecord = recordOf(world, parked);
    const tree = parkedRecord.evidence.worktreePath as string;
    // The parked run put the tree's own file back once its child exited.
    expect(readFileSync(join(tree, '.utcp_config.json'), 'utf8')).toBe(own);

    // A run killed between its write and its restore leaves the filtered copy in the tree.
    writeFileSync(join(tree, '.utcp_config.json'), runCopyText(parkedRecord));
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    writeNeedsYouItem(world.stateRoot, answeredAs(item.value, 'keep it'));
    seen.calls.length = 0;
    const resumed = await runBot(world.input('park-app', { senders: {}, request: { kind: 'resume', requestId: 'rq-resume', itemId: parked.itemId } }));
    expect(resumed.kind).toBe('completed');

    // The resumed child read this run's filtered copy, and once it exited the tree held its own
    // file again, which holds only when the tree was restored before this run took its copy.
    const call = seen.calls.find((entry) => entry.cwd === tree);
    expect(call?.cwdConfig).toBe(runCopyText(recordOf(world, resumed)));
    expect(readFileSync(join(tree, '.utcp_config.json'), 'utf8')).toBe(own);
  }, 120_000);
});

describe('apps record', () => {
  it('records the honored names on the run record', async () => {
    const world = appsWorld(true);
    writeBot(world, 'one-app', bot('one-app', ['isolation: worktree', 'apps: [github]']));
    const outcome = await runBot(world.input('one-app', { senders: {} }));
    expect(outcome.kind).toBe('completed');
    const rec = recordOf(world, outcome);
    expect(rec.posture).toEqual({ ...(golden('run-record.posture.json') as { posture: Record<string, unknown> }).posture, secretsUsed: [] });
    expect(validateRunRecord(rec).ok).toBe(true);
  }, 90_000);

  it('records an empty list for a bot that declares nothing', async () => {
    const world = appsWorld(false);
    writeBot(world, 'no-apps', bot('no-apps', ['isolation: shared']));
    const outcome = await runBot(world.input('no-apps'));
    expect(outcome.kind).toBe('completed');
    const rec = recordOf(world, outcome);
    expect(rec.posture).toMatchObject({ isolation: 'shared', apps: [] });
    // The shared golden's posture block is a posture the record validator accepts.
    const sharedPosture = (golden('run-record.posture-shared.json') as { posture: RunRecord['posture'] }).posture;
    expect(validateRunRecord({ ...rec, posture: sharedPosture }).ok).toBe(true);
  }, 90_000);
});

describe('apps child environment', () => {
  it('passes UTCP_CONFIG_FILE through extraEnv', async () => {
    const world = appsWorld(false);
    writeBot(world, 'no-apps', bot('no-apps', ['isolation: shared']));
    const outcome = await runBot(world.input('no-apps'));
    expect(outcome.kind).toBe('completed');
    const runFile = join(recordOf(world, outcome).evidence.runFolder as string, 'utcp.json');
    expect(isAbsolute(runFile)).toBe(true);
    expect(seen.calls).toHaveLength(1);
    expect(seen.calls[0]?.dispatchEnv).toMatchObject({ UTCP_CONFIG_FILE: runFile });
    expect(seen.calls[0]?.dispatchEnvKeys).toEqual(['UTCP_CONFIG_FILE']);
    // The child itself saw the key, past the executor's environment filter.
    expect(stubReceipt(world, outcome.runId as string)?.env.UTCP_CONFIG_FILE).toBe(runFile);
  }, 90_000);

  it('refuses a key outside the kind list and outside dispatchEnvKeys', () => {
    const stateLogPath = join(tempDir('apps-audit-'), 'state.jsonl');
    writeFileSync(stateLogPath, '');
    const base = {
      command: 'true',
      args: [],
      cwd: tempDir('apps-audit-cwd-'),
      timeoutSeconds: 5,
      stateLogPath,
      executor: parseExecutorConfig({ kind: 'cli-codex', sandboxMode: 'read-only', timeoutSeconds: 60 }),
      iteration: 1,
      guardContext: { env: {}, ancestryCmdlines: [], statePaths: [] },
    };
    expect(() => runAuditedExecutorCommand({ ...base, dispatchEnv: { UTCP_CONFIG_FILE: '/run/utcp.json' } })).toThrow('dispatchEnv key UTCP_CONFIG_FILE is not allowed for cli-codex');
    expect(() => runAuditedExecutorCommand({ ...base, dispatchEnv: { UTCP_CONFIG_FILE: '/run/utcp.json', PATH: '/tmp' }, dispatchEnvKeys: ['UTCP_CONFIG_FILE'] })).toThrow('dispatchEnv key PATH is not allowed for cli-codex');
    expect(() => runAuditedExecutorCommand({ ...base, dispatchEnv: { BOT_HOME: '/tmp' }, dispatchEnvKeys: ['BOT_HOME'] })).toThrow('caller-named key BOT_HOME is outside the bounded caller namespace');
    expect(() => runAuditedExecutorCommand({ ...base, dispatchEnv: { SKILLED_BOT_SECRET_lower: 'x' }, dispatchEnvKeys: ['SKILLED_BOT_SECRET_lower'] })).toThrow('outside the bounded caller namespace');
  });
});

describe('apps refusals', () => {
  it('refuses apps-refused before dispatch', async () => {
    const world = appsWorld(true);
    writeBot(world, 'bad-app', bot('bad-app', ['isolation: worktree', 'apps: [github, nosuchserver]']));
    const outcome = await runBot(world.input('bad-app', { senders: {} }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'apps-refused', detail: 'apps-unknown-server: nosuchserver' });
    expect(exitCodeFor(outcome)).toBe(4);
    const rec = recordOf(world, outcome);
    expect(rec.exit).toMatchObject({ reason: 'apps-refused', class: 'author', refusal: { cause: 'apps-refused', detail: 'apps-unknown-server: nosuchserver' } });
    expect(rec.posture.apps).toEqual([]);
    expect(existsSync(join(rec.evidence.runFolder as string, 'utcp.json'))).toBe(false);
    expect(rec.evidence.worktreePath).toBeNull();
    expect(stubRunCount(world)).toBe(0);

    // A checkout with no config refuses a declaration it cannot check.
    rmSync(join(world.checkoutRoot, '.utcp_config.json'));
    writeBot(world, 'one-app', bot('one-app', ['isolation: worktree', 'apps: [github]']));
    const missing = await runBot(world.input('one-app', { senders: {} }));
    expect(missing).toMatchObject({ kind: 'refused', cause: 'apps-refused', detail: `utcp-config-missing: ${join(world.checkoutRoot, '.utcp_config.json')}` });
  }, 90_000);

  it('refuses apps-unenforceable on a shared run', async () => {
    const world = appsWorld(false);
    writeBot(world, 'shared-app', bot('shared-app', ['isolation: shared', 'apps: [github]']));
    const outcome = await runBot(world.input('shared-app'));
    const detail = 'apps is declared and isolation is shared, so a filtered config needs a worktree';
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'apps-unenforceable', detail });
    expect(exitCodeFor(outcome)).toBe(4);
    const rec = recordOf(world, outcome);
    expect(rec.exit).toMatchObject({ reason: 'apps-unenforceable', class: 'author' });
    expect(rec.posture.apps).toEqual([]);
    expect(existsSync(join(rec.evidence.runFolder as string, 'utcp.json'))).toBe(false);
    expect(stubRunCount(world)).toBe(0);

    // An empty declaration is still a declaration, and the isolation wins over a missing config.
    rmSync(join(world.checkoutRoot, '.utcp_config.json'));
    writeBot(world, 'shared-empty', bot('shared-empty', ['isolation: shared', 'apps: []']));
    expect(await runBot(world.input('shared-empty'))).toMatchObject({ kind: 'refused', cause: 'apps-unenforceable', detail });
  }, 90_000);
});
