// ───────────────────────────────────────────────────────────────────
// MODULE: Status Test Support
// ───────────────────────────────────────────────────────────────────
//
// Builders for the status suites: run records, needs-you items, install
// records with their job files, and a stand-in for launchctl. Every path is
// in a temp folder, the agents folder is a temp folder, and launchctl is
// answered in memory, so no status test reaches the real scheduler or the
// real per-user agents folder. plutil is the real one, run only on files in
// temp folders.

import { mkdirSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { translateCron } from '../lib/cron-translator.js';
import { detectSkilledTree, defaultSeams } from '../lib/installer.js';
import { buildBotLabel } from '../lib/label.js';
import { writeNeedsYouItem } from '../lib/needs-you.js';
import { renderBotPlist } from '../lib/plist-render.js';
import { writeRunRecord } from '../lib/run-record.js';
import { agentLogFile, ensureIdentityState, installFile, registerRoot, resolveRunFolder } from '../lib/state-root.js';
import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { tempDir, tempRepo, tempSkilledTree, writeConfig } from './support.js';

import type { CommandResult, InstallerSeams, InstallRecord } from '../lib/installer.js';
import type { NeedsYouItem } from '../lib/needs-you.js';
import type { DeliveryEntry, RunRecord, SkippedSlotSummary } from '../lib/run-record.js';

/** A state root, a temp agents folder and a launchctl stand-in that answers `print` from a table. */
export interface StatusWorld {
  stateRoot: string;
  skilledTree: string;
  /** The temp account home; its Library/LaunchAgents is the agents folder. */
  home: string;
  agentsDir: string;
  /** label to what `launchctl print` answers; anything else is not loaded. */
  prints: Map<string, CommandResult>;
  calls: string[][];
  seams: Partial<InstallerSeams>;
}

export const DOMAIN = 'gui/501';

export function statusWorld(): StatusWorld {
  const stateRoot = join(tempDir('bots-state-'), 'system-skilled-bots');
  mkdirSync(stateRoot, { recursive: true, mode: 0o700 });
  const home = tempDir('bots-home-');
  const agentsDir = join(home, 'Library', 'LaunchAgents');
  mkdirSync(agentsDir, { recursive: true });
  const prints = new Map<string, CommandResult>();
  const calls: string[][] = [];
  const seams: Partial<InstallerSeams> = {
    agentsDir,
    accountHome: home,
    domain: DOMAIN,
    plutil: defaultSeams().plutil,
    launchctl: (args) => {
      calls.push(args);
      if (args[0] === 'print') {
        const label = (args[1] ?? '').slice(DOMAIN.length + 1);
        return prints.get(label) ?? { status: 113, stdout: '', stderr: `Could not find service "${label}" in domain for user gui: 501` };
      }
      return { status: 1, stdout: '', stderr: 'only print is answered in the status suites' };
    },
  };
  return { stateRoot, skilledTree: tempSkilledTree(true), home, agentsDir, prints, calls, seams };
}

/** A checkout with a declared identity and state root, its own `.skilled/bin/bots.cjs`, registered under the state root. */
export function statusCheckout(world: StatusWorld, identity: string, extraConfig: Record<string, unknown> = {}): string {
  const checkout = tempRepo();
  writeConfig(checkout, { identity, stateRoot: world.stateRoot, ...extraConfig });
  mkdirSync(join(checkout, '.skilled', 'bin'), { recursive: true });
  writeFileSync(join(checkout, '.skilled', 'bin', 'bots.cjs'), '// runner stand-in\n');
  ensureIdentityState(world.stateRoot, identity);
  registerRoot(world.stateRoot, identity, checkout);
  return checkout;
}

/** A checkout whose `.skilled` is a link to a Skilled tree of its own, so the link can be retargeted. */
export function linkedCheckout(world: StatusWorld, identity: string): { checkout: string; tree: string } {
  const checkout = tempRepo();
  writeConfig(checkout, { identity, stateRoot: world.stateRoot });
  const tree = skilledTreeWithRunner();
  symlinkSync(join(tree, '.skilled'), join(checkout, '.skilled'));
  ensureIdentityState(world.stateRoot, identity);
  registerRoot(world.stateRoot, identity, checkout);
  return { checkout, tree };
}

export function skilledTreeWithRunner(): string {
  const tree = tempDir('bots-tree-');
  mkdirSync(join(tree, '.skilled', 'bin'), { recursive: true });
  writeFileSync(join(tree, '.skilled', 'bin', 'bots.cjs'), '// runner stand-in\n');
  return tree;
}

/**
 * Write what an install leaves: the job file in the temp agents folder and
 * the install record, both filled from the tree as it is now, so the
 * installer's own check finds nothing stale until a test changes the tree.
 *
 * @returns The label.
 */
export function fakeInstall(world: StatusWorld, identity: string, botId: string, checkout: string): string {
  const label = buildBotLabel(identity, botId, 0);
  if (!label.ok) throw new Error(label.reason);
  const tree = detectSkilledTree(checkout);
  if (!tree.ok) throw new Error(tree.reason);
  const translation = translateCron('0 9 * * *');
  if (!translation.ok) throw new Error(translation.reason);
  const plistPath = join(world.agentsDir, `${label.value}.plist`);
  const rendered = renderBotPlist({
    label: label.value,
    interpreter: process.execPath,
    runnerPath: tree.value.repoRunnerRealPath,
    botId,
    scheduleIndex: 0,
    checkoutRoot: realpathSync(checkout),
    skilledTree: world.skilledTree,
    translation: translation.value,
    logPath: agentLogFile(world.stateRoot, identity, label.value),
  });
  if (!rendered.ok) throw new Error(rendered.reason);
  writeFileSync(plistPath, rendered.value);
  const record: InstallRecord = {
    schemaVersion: 1,
    agent: 'bot',
    botId,
    identity,
    labels: [label.value],
    plistPaths: [plistPath],
    checkoutRoot: realpathSync(checkout),
    interpreter: process.execPath,
    plistRunnerPath: tree.value.repoRunnerRealPath,
    repoRunnerPath: tree.value.repoRunnerPath,
    repoRunnerRealPath: tree.value.repoRunnerRealPath,
    treeRoot: tree.value.treeRoot,
    skilledTree: world.skilledTree,
    skilledKind: tree.value.kind,
    pinCommit: tree.value.pinCommit,
    schedule: { expression: '0 9 * * *', scheduleIndex: 0 },
    hold: 'first-install',
    installedAt: '2026-11-20T09:00:00.000Z',
    enabledAt: null,
  };
  ensureIdentityState(world.stateRoot, identity);
  writeStateAtomic(installFile(world.stateRoot, identity, botId), record);
  return label.value;
}

export interface RecordOptions {
  identity: string;
  botId: string;
  runId: string;
  dispatchedAt: string;
  repositoryPath: string;
  /** Make the run folder in this Skilled tree; omit to point at a path that was never made. */
  skilledTree?: string;
  runFolder?: string;
  exit?: RunRecord['exit'];
  skippedSlots?: SkippedSlotSummary | null;
  delivery?: DeliveryEntry[];
}

/** Write one run record, with a real run folder when a Skilled tree is given. */
export function writeRecord(stateRoot: string, options: RecordOptions): RunRecord {
  let runFolder = options.runFolder ?? join(tempDir('bots-nofolder-'), options.runId);
  if (options.skilledTree !== undefined) {
    const made = resolveRunFolder({ skilledTree: options.skilledTree, identity: options.identity, runId: options.runId });
    if (!made.ok) throw new Error(made.reason);
    runFolder = made.value;
  }
  const record: RunRecord = {
    schemaVersion: 1,
    identity: { repository: options.identity, repositoryPath: options.repositoryPath, botId: options.botId, runId: options.runId, definitionDigest: 'sha256:abc' },
    request: { requestId: null, leaseNonce: null, resultEventId: null, firedSlot: null },
    dispatch: {
      source: 'manual',
      scheduledAt: null,
      dispatchedAt: options.dispatchedAt,
      latenessSeconds: null,
      latenessClass: null,
      skippedSlots: options.skippedSlots ?? null,
    },
    budget: {
      declared: { maxIterations: 1, maxDurationMinutes: 5, timeoutSeconds: 60 },
      measured: { iterations: 1, elapsedMinutes: 0.1, costUsd: null, costSource: null },
    },
    posture: { isolation: 'shared', sandbox: 'read-only', executorKind: 'cli-codex', model: null, apps: [] },
    exit: options.exit ?? { reason: 'converged', class: null, needsYouItemId: null },
    evidence: { runFolder, ledgerDir: null, receiptDir: null, observabilityStream: null, worktreePath: null, branch: null },
    delivery: options.delivery ?? [{ channel: 'desktop', target: 'https://hooks.example.invalid/T0KEN', state: 'delivered', evidence: null }],
  };
  const written = writeRunRecord(stateRoot, record);
  if (!written.ok) throw new Error(`${written.reason} ${written.detail ?? ''}`);
  return record;
}

/** Write one needs-you item for a bot. */
export function writeStatusItem(
  stateRoot: string,
  options: { identity: string; botId: string; id: string; createdAt: string; expiresAt: string; answer?: string; resumeRequestId?: string | null },
): NeedsYouItem {
  const item: NeedsYouItem = {
    id: options.id,
    runId: options.id,
    botId: options.botId,
    identity: options.identity,
    question: 'SECRET-QUESTION-TEXT: merge or open a PR?',
    options: ['merge', 'open a PR'],
    createdAt: options.createdAt,
    expiresAt: options.expiresAt,
    evidence: [],
    prompt: 'The parked prompt.',
    specFolder: null,
    answer: options.answer === undefined ? null : { text: options.answer, answeredAt: options.createdAt },
    resumeRequestId: options.resumeRequestId ?? null,
  };
  const written = writeNeedsYouItem(stateRoot, item);
  if (!written.ok) throw new Error(written.reason);
  return item;
}

/** Captured-format `launchctl print` output for a loaded label. */
export function printOutput(label: string, fields: { state?: string; runs?: string; lastExit?: string }): string {
  return [
    `${DOMAIN}/${label} = {`,
    '\tactive count = 0',
    `\tpath = /Users/someone/Library/LaunchAgents/${label}.plist`,
    '\ttype = LaunchAgent',
    `\tstate = ${fields.state ?? 'not running'}`,
    '',
    '\tprogram = /usr/local/bin/node',
    '\targuments = {',
    '\t\t/usr/local/bin/node',
    '\t}',
    '',
    '\tdefault environment = {',
    '\t\tPATH => /usr/bin:/bin:/usr/sbin:/sbin',
    '\t}',
    '',
    '\tendpoints = {',
    '\t\tstate = active',
    '\t}',
    '',
    `\tdomain = ${DOMAIN} [100005]`,
    '\tminimum runtime = 10',
    '\texit timeout = 5',
    `\truns = ${fields.runs ?? '0'}`,
    `\tlast exit code = ${fields.lastExit ?? '(never exited)'}`,
    '}',
    '',
  ].join('\n');
}
