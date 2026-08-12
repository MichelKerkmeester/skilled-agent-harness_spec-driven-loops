#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Deterministic Advisor Target
// ───────────────────────────────────────────────────────────────

import { statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.env.DIRECTIVE_REPO_ROOT || process.cwd();
const lifecycle = await import(pathToFileURL(join(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/lib/directive-lifecycle.js',
)).href);
const FULL = 'Advisor: live; use sk-code 0.91/0.23 pass.\nDirectives:\n- Comment hygiene\n- Governor\n- Proof over appearance';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
let input = {};
try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { input = {}; }
const sessionId = typeof input.session_id === 'string' && input.session_id.trim() ? input.session_id.trim() : undefined;
const transcriptPath = typeof input.transcript_path === 'string' && input.transcript_path ? input.transcript_path : null;
let transcriptBytes = null;
try { transcriptBytes = transcriptPath ? statSync(transcriptPath).size : null; } catch { transcriptBytes = null; }
const decision = lifecycle.decideDirectiveLifecycleDelivery(FULL, {
  state: lifecycle.defaultDirectiveLifecycleStore(),
  sessionId,
  sessionConfirmed: Boolean(sessionId),
  transcriptPath,
  transcriptBytes,
  enabled: lifecycle.isDirectiveLifecycleDedupEnabled(),
});
const context = decision.suppressed && decision.reducedContext ? decision.reducedContext : FULL;
process.stdout.write(`${JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: context,
  },
})}\n`);
