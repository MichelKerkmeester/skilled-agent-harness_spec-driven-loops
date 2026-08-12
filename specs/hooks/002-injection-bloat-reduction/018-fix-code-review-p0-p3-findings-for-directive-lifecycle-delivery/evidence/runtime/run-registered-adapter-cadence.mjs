#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Registered Adapter Cadence Harness
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = process.cwd();
const outputArg = process.argv[2];
if (!outputArg) {
  process.stderr.write('Usage: run-registered-adapter-cadence.mjs <new-output-directory>\n');
  process.exit(64);
}
const outputDir = resolve(outputArg);
if (existsSync(outputDir)) {
  process.stderr.write(`Refusing to overwrite evidence: ${outputDir}\n`);
  process.exit(1);
}
mkdirSync(outputDir, { recursive: true });

const target = resolve(fileURLToPath(new URL('./deterministic-advisor-target.mjs', import.meta.url)));
const hostStatus = {
  claude: 'adapter-driven-only',
  codex: 'adapter-driven-only',
  cursor: 'adapter-pass-host-dormant-unconfirmed',
  devin: 'historical-host-live-current-adapter-driven',
};

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function adapterPath(runtime) {
  return join(repoRoot, '.opencode', 'skills', 'system-spec-kit', 'mcp-server', 'dist', 'hooks', runtime, 'user-prompt-submit.js');
}

function payload(runtime, transcriptPath, includeSession = true) {
  if (runtime === 'cursor') {
    return {
      hook_event_name: 'beforeSubmitPrompt',
      prompt: 'implement feature',
      ...(includeSession ? { session_id: 'cadence-session' } : {}),
      transcript_path: transcriptPath,
      workspace_roots: [repoRoot],
    };
  }
  return {
    hook_event_name: 'UserPromptSubmit',
    prompt: 'implement feature',
    ...(includeSession ? { session_id: 'cadence-session' } : {}),
    transcript_path: transcriptPath,
    cwd: repoRoot,
  };
}

function contextFrom(runtime, output) {
  return runtime === 'cursor'
    ? output?.agent_message ?? ''
    : output?.hookSpecificOutput?.additionalContext ?? '';
}

function invoke(runtime, transcriptPath, stateDir, options = {}) {
  const result = spawnSync(process.execPath, [adapterPath(runtime)], {
    cwd: repoRoot,
    input: JSON.stringify(payload(runtime, transcriptPath, options.includeSession !== false)),
    encoding: 'utf8',
    timeout: 10_000,
    env: {
      ...process.env,
      DIRECTIVE_REPO_ROOT: repoRoot,
      SPECKIT_USER_PROMPT_TARGET: target,
      SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR: stateDir,
      SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP: options.dedup ?? '1',
    },
  });
  let parsed = {};
  try { parsed = JSON.parse(result.stdout || '{}'); } catch { parsed = {}; }
  return {
    exitCode: result.status,
    signal: result.signal,
    stderr: result.stderr,
    envelope: parsed,
    context: contextFrom(runtime, parsed),
  };
}

function full(context) {
  return context.includes('Directives:') && context.includes('Comment hygiene');
}

function routeOnly(context) {
  return context.startsWith('Advisor:') && !context.includes('Directives:');
}

const tempRoots = [];
const runtimeResults = {};
try {
  for (const runtime of ['claude', 'codex', 'cursor', 'devin']) {
    const stateDir = mkdtempSync(join(tmpdir(), `directive-${runtime}-state-`));
    const transcriptDir = mkdtempSync(join(tmpdir(), `directive-${runtime}-transcript-`));
    tempRoots.push(stateDir, transcriptDir);
    const transcriptPath = join(transcriptDir, 'session.jsonl');
    writeFileSync(transcriptPath, 'x'.repeat(100));
    const first = invoke(runtime, transcriptPath, stateDir);
    appendFileSync(transcriptPath, 'x'.repeat(100));
    const repeat = invoke(runtime, transcriptPath, stateDir);
    writeFileSync(transcriptPath, 'x'.repeat(50));
    const afterShrink = invoke(runtime, transcriptPath, stateDir);
    const killSwitchFirst = invoke(runtime, transcriptPath, stateDir, { dedup: '0' });
    const killSwitchRepeat = invoke(runtime, transcriptPath, stateDir, { dedup: '0' });
    const unknownSession = invoke(runtime, transcriptPath, stateDir, { includeSession: false });
    const checks = {
      firstFull: first.exitCode === 0 && full(first.context),
      repeatRouteOnly: repeat.exitCode === 0 && routeOnly(repeat.context),
      shrinkFull: afterShrink.exitCode === 0 && full(afterShrink.context),
      killSwitchFull: full(killSwitchFirst.context) && full(killSwitchRepeat.context),
      unknownNeverRouteOnly: !routeOnly(unknownSession.context),
    };
    runtimeResults[runtime] = {
      runtime,
      evidenceClass: 'registered-path',
      hostDeliveryStatus: hostStatus[runtime],
      adapter: relative(repoRoot, adapterPath(runtime)),
      checks,
      outputs: { first, repeat, afterShrink, killSwitchFirst, killSwitchRepeat, unknownSession },
      passed: Object.values(checks).every(Boolean),
    };
    writeFileSync(join(outputDir, `${runtime}.json`), `${JSON.stringify(runtimeResults[runtime], null, 2)}\n`);
  }

  const payloadFixtures = Object.fromEntries(['claude', 'codex', 'cursor', 'devin'].map((runtime) => {
    const fixture = payload(runtime, '<temp-transcript>', true);
    if (Object.prototype.hasOwnProperty.call(fixture, 'cwd')) fixture.cwd = '<repo-root>';
    if (Object.prototype.hasOwnProperty.call(fixture, 'workspace_roots')) fixture.workspace_roots = ['<repo-root>'];
    return [runtime, fixture];
  }));
  writeFileSync(join(outputDir, 'payload-fixtures.json'), `${JSON.stringify(payloadFixtures, null, 2)}\n`);
  const sourceHashes = {
    harness: { path: relative(repoRoot, fileURLToPath(import.meta.url)), sha256: sha256(fileURLToPath(import.meta.url)) },
    target: { path: relative(repoRoot, target), sha256: sha256(target) },
    adapters: Object.fromEntries(['claude', 'codex', 'cursor', 'devin'].map((runtime) => [
      runtime,
      { path: relative(repoRoot, adapterPath(runtime)), sha256: sha256(adapterPath(runtime)) },
    ])),
  };
  const passed = Object.values(runtimeResults).every((result) => result.passed);
  writeFileSync(join(outputDir, 'source-hashes.json'), `${JSON.stringify(sourceHashes, null, 2)}\n`);
  writeFileSync(join(outputDir, 'environment.json'), `${JSON.stringify({
    capturedAt: new Date().toISOString(),
    nodeVersion: process.version,
    platform: `${process.platform}-${process.arch}`,
    evidenceClass: 'registered-path',
    hostVersions: {
      claude: 'not-observed',
      codex: 'not-observed',
      cursor: 'dormant-unconfirmed',
      devin: 'not-observed-current-run',
    },
  }, null, 2)}\n`);
  writeFileSync(join(outputDir, 'summary.json'), `${JSON.stringify({
    passed,
    runtimes: Object.fromEntries(Object.entries(runtimeResults).map(([runtime, result]) => [runtime, {
      passed: result.passed,
      checks: result.checks,
      hostDeliveryStatus: result.hostDeliveryStatus,
    }])),
  }, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ outputDir, passed }, null, 2)}\n`);
  process.exitCode = passed ? 0 : 1;
} finally {
  for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
}
