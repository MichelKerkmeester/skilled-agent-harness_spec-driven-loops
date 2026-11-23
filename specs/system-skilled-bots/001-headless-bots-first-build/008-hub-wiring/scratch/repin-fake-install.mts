// Writes what an install and one finished run leave behind, through the runtime's own
// writers, copied from the status test support's fakeInstall and writeRecord. No
// launchctl call is made; the job file goes into the temp agents folder.
import { realpathSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [lib, deepLoopLib, checkout, stateRoot, agentsDir] = process.argv.slice(2);
const { translateCron } = await import(join(lib, 'cron-translator.ts'));
const { detectSkilledTree } = await import(join(lib, 'installer.ts'));
const { buildBotLabel } = await import(join(lib, 'label.ts'));
const { renderBotPlist } = await import(join(lib, 'plist-render.ts'));
const { writeRunRecord } = await import(join(lib, 'run-record.ts'));
const { agentLogFile, ensureIdentityState, installFile, registerRoot, resolveRunFolder } = await import(join(lib, 'state-root.ts'));
const { writeStateAtomic } = await import(join(deepLoopLib, 'atomic-state.js'));

const identity = 'local/tool';
const botId = 'nightly-digest';
const label = buildBotLabel(identity, botId, 0);
if (!label.ok) throw new Error(label.reason);
const tree = detectSkilledTree(checkout);
if (!tree.ok) throw new Error(tree.reason);
const translation = translateCron('0 9 * * *');
if (!translation.ok) throw new Error(translation.reason);
const plistPath = join(agentsDir, `${label.value}.plist`);
const rendered = renderBotPlist({
  label: label.value,
  interpreter: process.execPath,
  runnerPath: tree.value.repoRunnerRealPath,
  botId,
  scheduleIndex: 0,
  checkoutRoot: realpathSync(checkout),
  skilledTree: realpathSync(checkout),
  translation: translation.value,
  logPath: agentLogFile(stateRoot, identity, label.value),
});
if (!rendered.ok) throw new Error(rendered.reason);
writeFileSync(plistPath, rendered.value);
const record = {
  schemaVersion: 1, agent: 'bot', botId, identity,
  labels: [label.value], plistPaths: [plistPath],
  checkoutRoot: realpathSync(checkout), interpreter: process.execPath,
  plistRunnerPath: tree.value.repoRunnerRealPath, repoRunnerPath: tree.value.repoRunnerPath,
  repoRunnerRealPath: tree.value.repoRunnerRealPath, treeRoot: tree.value.treeRoot,
  skilledTree: realpathSync(checkout), skilledKind: tree.value.kind, pinCommit: tree.value.pinCommit,
  schedule: { expression: '0 9 * * *', scheduleIndex: 0 },
  hold: 'first-install', installedAt: '2026-11-20T09:00:00.000Z', enabledAt: null,
};
ensureIdentityState(stateRoot, identity);
writeStateAtomic(installFile(stateRoot, identity, botId), record);
registerRoot(stateRoot, identity, realpathSync(checkout));

const runId = 'fixture-run-0001';
const made = resolveRunFolder({ skilledTree: realpathSync(checkout), identity, runId });
if (!made.ok) throw new Error(made.reason);
writeFileSync(join(made.value, 'notes.md'), 'fixture run evidence\n');
const written = writeRunRecord(stateRoot, {
  schemaVersion: 1,
  identity: { repository: identity, repositoryPath: realpathSync(checkout), botId, runId, definitionDigest: 'sha256:abc' },
  request: { requestId: null, leaseNonce: null, resultEventId: null, firedSlot: null },
  dispatch: { source: 'manual', scheduledAt: null, dispatchedAt: '2026-11-21T09:00:00.000Z', latenessSeconds: null, latenessClass: null, skippedSlots: null },
  budget: { declared: { maxIterations: 1, maxDurationMinutes: 5, timeoutSeconds: 60 }, measured: { iterations: 1, elapsedMinutes: 0.1, costUsd: null, costSource: null } },
  posture: { isolation: 'shared', sandbox: 'read-only', executorKind: 'native', model: null },
  exit: { reason: 'converged', class: null, needsYouItemId: null },
  evidence: { runFolder: made.value, ledgerDir: null, receiptDir: null, observabilityStream: null, worktreePath: null, branch: null },
  delivery: [{ channel: 'local-only', target: null, state: 'delivered', evidence: null }],
});
if (!written.ok) throw new Error(`${written.reason} ${written.detail ?? ''}`);
console.log(JSON.stringify({ label: label.value, skilledKind: record.skilledKind, pinCommit: record.pinCommit, installRecord: installFile(stateRoot, identity, botId), runFolder: made.value }));
