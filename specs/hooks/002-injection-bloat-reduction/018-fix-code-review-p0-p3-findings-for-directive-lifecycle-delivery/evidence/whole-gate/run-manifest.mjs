#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Whole-Gate Evidence Runner
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const MAX_LOG_BYTES = 128 * 1024 * 1024;
const ALLOWED_LABEL = /^(?:baseline|post|final(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?)$/u;

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function runCommand(command, cwd, env) {
  return new Promise((resolveCommand) => {
    const stdoutChunks = [];
    const stderrChunks = [];
    let capturedBytes = 0;
    let exitCode = null;
    let exitSignal = null;
    let infrastructureError = null;
    let settled = false;
    let drainTimer;
    let killTimer;

    const child = spawn('/bin/bash', ['-lc', command.command], {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const timeoutTimer = setTimeout(() => {
      infrastructureError = `Command timed out after ${command.timeoutMs}ms`;
      child.kill('SIGTERM');
      killTimer = setTimeout(() => {
        child.kill('SIGKILL');
        exitSignal ??= 'SIGKILL';
        finish();
      }, 2_000);
    }, command.timeoutMs);

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutTimer);
      clearTimeout(drainTimer);
      clearTimeout(killTimer);
      resolveCommand({
        status: exitCode,
        signal: exitSignal,
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: Buffer.concat(stderrChunks).toString('utf8'),
        error: infrastructureError === null ? undefined : { message: infrastructureError },
      });
    };

    const capture = (chunks) => (chunk) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      const remainingBytes = MAX_LOG_BYTES - capturedBytes;
      if (remainingBytes <= 0) return;
      if (buffer.length > remainingBytes) {
        chunks.push(buffer.subarray(0, remainingBytes));
        capturedBytes += remainingBytes;
        infrastructureError = `Combined command output exceeded ${MAX_LOG_BYTES} bytes`;
        child.kill('SIGTERM');
        return;
      }
      chunks.push(buffer);
      capturedBytes += buffer.length;
    };

    child.stdout.on('data', capture(stdoutChunks));
    child.stderr.on('data', capture(stderrChunks));
    child.on('spawn', () => {
      process.stderr.write(`[runner] started ${command.id} (pid ${child.pid})\n`);
    });
    child.on('error', (error) => {
      infrastructureError = error.message;
      process.stderr.write(`[runner] error ${command.id}: ${error.message}\n`);
    });
    child.on('exit', (code, signal) => {
      exitCode = code;
      exitSignal = signal;
      process.stderr.write(`[runner] exited ${command.id} (code ${code}, signal ${signal})\n`);
      drainTimer = setTimeout(() => {
        infrastructureError ??= 'Child stdio did not close within 2000ms after exit';
        child.stdout.destroy();
        child.stderr.destroy();
        finish();
      }, 2_000);
    });
    child.on('close', (code, signal) => {
      exitCode ??= code;
      exitSignal ??= signal;
      process.stderr.write(`[runner] closed ${command.id} (code ${code}, signal ${signal})\n`);
      finish();
    });
  });
}

function parseTestSummary(output) {
  const summary = {};
  for (const label of ['Test Files', 'Tests']) {
    const lines = output.split('\n').filter((line) => line.includes(label));
    const line = lines.at(-1);
    if (!line) continue;
    const counts = {};
    for (const match of line.matchAll(/(\d+)\s+(passed|failed|skipped|todo)/gi)) {
      counts[match[2].toLowerCase()] = Number(match[1]);
    }
    if (Object.keys(counts).length > 0) summary[label === 'Tests' ? 'tests' : 'testFiles'] = counts;
  }
  return summary;
}

function failureIdentities(output) {
  return [...new Set(output.split('\n')
    .map((line) => line.trim())
    .filter((line) => /^(FAIL|Failed:|✗|×|x\s)/u.test(line))
    .slice(0, 1000))];
}

const manifestPath = resolve(process.argv[2] ?? '');
const label = process.argv[3] ?? '';
const onlyCommandId = process.argv[4] ?? null;
if (!manifestPath || !ALLOWED_LABEL.test(label)) {
  process.stderr.write(
    'Usage: run-manifest.mjs <manifest.json> <baseline|post|final[-label]> [command-id]\n',
  );
  process.exit(64);
}

const manifestText = readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(manifestText);
const selectedCommands = onlyCommandId === null
  ? manifest.commands
  : manifest.commands.filter((command) => command.id === onlyCommandId);
if (selectedCommands.length === 0) {
  process.stderr.write(`Unknown command id: ${onlyCommandId}\n`);
  process.exit(64);
}
const repoRoot = resolve(manifest.repoRoot);
const outputDir = join(dirname(manifestPath), label);
if (existsSync(outputDir)) {
  process.stderr.write(`Refusing to overwrite existing evidence directory: ${outputDir}\n`);
  process.exit(1);
}
mkdirSync(outputDir, { recursive: true });
copyFileSync(manifestPath, join(outputDir, 'manifest.json'));

const env = {};
for (const key of manifest.environmentPolicy.inherit) {
  if (process.env[key] !== undefined) env[key] = process.env[key];
}
Object.assign(env, manifest.environmentPolicy.pinned);

writeFileSync(join(outputDir, 'environment.json'), `${JSON.stringify({
  inheritedKeys: manifest.environmentPolicy.inherit,
  pinned: manifest.environmentPolicy.pinned,
  node: process.version,
  platform: process.platform,
  arch: process.arch,
}, null, 2)}\n`);

const results = [];
for (const command of selectedCommands) {
  const startedAt = Date.now();
  const cwd = resolve(repoRoot, command.cwd);
  const completed = await runCommand(command, cwd, env);
  const output = `${completed.stdout ?? ''}${completed.stderr ?? ''}`;
  const logName = `${command.id}.log`;
  writeFileSync(join(outputDir, logName), output);
  results.push({
    id: command.id,
    cwd: command.cwd,
    command: command.command,
    expectedPostExitCode: command.expectedPostExitCode,
    exitCode: completed.status,
    signal: completed.signal,
    durationMs: Date.now() - startedAt,
    log: logName,
    logSha256: sha256(output),
    outputLineCount: output.length === 0 ? 0 : output.split('\n').length,
    testSummary: parseTestSummary(output),
    failureIdentities: failureIdentities(output),
    infrastructureError: completed.error?.message ?? null,
  });
}

const receipt = {
  schemaVersion: 1,
  label,
  capturedAt: new Date().toISOString(),
  manifestSha256: sha256(manifestText),
  repoHead: manifest.repoHead,
  branch: manifest.branch,
  results,
};
writeFileSync(join(outputDir, 'results.json'), `${JSON.stringify(receipt, null, 2)}\n`);
writeFileSync(join(outputDir, 'manifest.sha256'), `${receipt.manifestSha256}  manifest.json\n`);

const failures = results.filter((result) => (
  result.exitCode !== result.expectedPostExitCode || result.infrastructureError !== null
));
process.stdout.write(`${JSON.stringify({
  label,
  outputDir,
  commands: results.length,
  nonTargetResults: failures.map((result) => ({ id: result.id, exitCode: result.exitCode })),
}, null, 2)}\n`);
