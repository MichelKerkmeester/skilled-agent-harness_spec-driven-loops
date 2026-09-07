#!/usr/bin/env node
import * as guardCore from '../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';

function approve() {
  process.exit(0);
}

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null) return approve(); // no/invalid payload -> fail open
  const prompt = typeof payload?.prompt === 'string' ? payload.prompt : '';
  const sessionID = typeof payload?.session_id === 'string' ? payload.session_id : '';
  if (sessionID.trim().length === 0) return approve();
  const projectDir = (typeof payload?.cwd === 'string' && payload.cwd.trim()) ? payload.cwd : (process.env.DEVIN_PROJECT_DIR || process.cwd());
  const { question, observe } = guardCore.runClassifyGate({ prompt, sessionID, projectDir, env: process.env, runtimeLabel: 'Devin' });
  if (question) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: question,
      },
    }), () => {
      observe();
      process.exit(0);
    });
    return;
  }
  return approve();
}

main().catch((error) => {
  process.stderr.write(`spec-gate-classify: ${error instanceof Error ? error.message : String(error)}\n`);
  approve();
});
