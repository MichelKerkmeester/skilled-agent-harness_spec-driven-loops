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
  const sessionID = payload?.session_id;
  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();
  const { question, observe } = guardCore.runClassifyGate({ prompt, sessionID, projectDir, env: process.env, runtimeLabel: 'Codex' });
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
