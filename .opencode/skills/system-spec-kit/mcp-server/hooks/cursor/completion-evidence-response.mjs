#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Completion Evidence Response
// ───────────────────────────────────────────────────────────────────
// `afterAgentResponse` carries the final assistant text; all policy remains
// in the shared completion sentinel core.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sentinelCore from '../../lib/hooks/completion-evidence-sentinel.cjs';
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

function readLastSpecFolder(projectDir, sessionId) {
  if (!sessionId) return null;
  try {
    const projectHash = createHash('sha256').update(projectDir).digest('hex').slice(0, 12);
    const sessionHash = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
    const statePath = join(tmpdir(), 'speckit-claude-hooks', projectHash, `${sessionHash}.json`);
    const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
    const specFolder = typeof parsed?.lastSpecFolder === 'string' ? parsed.lastSpecFolder.trim() : '';
    return specFolder || null;
  } catch {
    return null;
  }
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  if (!isHookEnabled('completion')) return;

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return;
  }

  const claimText = typeof payload?.text === 'string' ? payload.text : '';
  if (!sentinelCore.detectCompletionClaim(claimText)) return;

  const projectDir = payload?.workspace_roots?.[0] || payload?.cwd || process.cwd();
  const sessionId = payload?.session_id || payload?.conversation_id;
  const specFolder = sentinelCore.resolveSpecFolderFromText(claimText)
    || readLastSpecFolder(projectDir, sessionId);
  if (!specFolder) return;

  const result = sentinelCore.evaluateCompletionEvidence({
    specFolder,
    claimText,
    projectDir,
    env: process.env,
  });
  if (result.decision === 'advise' && result.detail) {
    sentinelCore.appendAdvisoryLog(projectDir, result.detail);
  }
}

main().catch(() => {});
