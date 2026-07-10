#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Claude User Prompt Submit Shim
// ───────────────────────────────────────────────────────────────
// Thin process-boundary shim. The advisor implementation lives in
// system-skill-advisor; this path stays for existing runtime settings.

import { readSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TARGET = '.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js';
const MAX_STDIN_BYTES = 1024 * 1024;
const MAX_STDIO_BYTES = 1024 * 1024;
const CHILD_TIMEOUT_MS = 2500;
const READ_CHUNK_BYTES = 64 * 1024;

function emitDiagnostic(code: string): void {
  process.stderr.write(`[speckit-hook:user-prompt-submit] ${code}\n`);
}

function readBoundedStdin(): Buffer {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  while (true) {
    const buffer = Buffer.alloc(Math.min(READ_CHUNK_BYTES, MAX_STDIN_BYTES + 1 - totalBytes));
    const bytesRead = readSync(0, buffer, 0, buffer.length, null);
    if (bytesRead === 0) break;
    totalBytes += bytesRead;
    if (totalBytes > MAX_STDIN_BYTES) {
      throw new Error('INPUT_OVERFLOW');
    }
    chunks.push(buffer.subarray(0, bytesRead));
  }
  return Buffer.concat(chunks, totalBytes);
}

function runShim(): string {
  try {
    const result = spawnSync(process.execPath, [TARGET, ...process.argv.slice(2)], {
      cwd: process.cwd(),
      input: readBoundedStdin(),
      encoding: 'utf8',
      env: process.env,
      timeout: CHILD_TIMEOUT_MS,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: 'SIGKILL',
    });
    if (result.error) {
      const code = (result.error as NodeJS.ErrnoException).code;
      emitDiagnostic(code === 'ETIMEDOUT' ? 'CHILD_TIMEOUT' : code === 'ENOBUFS' ? 'OUTPUT_OVERFLOW' : 'SPAWN_ERROR');
      return '{}';
    }
    if (result.status !== 0) {
      emitDiagnostic('NONZERO_EXIT');
      return '{}';
    }

    const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
    if (!stdout) {
      emitDiagnostic('EMPTY_OUTPUT');
      return '{}';
    }
    try {
      JSON.parse(stdout);
      return stdout;
    } catch {
      emitDiagnostic('INVALID_JSON');
      return '{}';
    }
  } catch (error: unknown) {
    emitDiagnostic(error instanceof Error && error.message === 'INPUT_OVERFLOW'
      ? 'INPUT_OVERFLOW'
      : 'STDIN_READ_ERROR');
    return '{}';
  }
}

process.stdout.write(`${runShim()}\n`);
process.exit(0);
