// Read-only probe: does each hook-based runtime's brief name the command and
// policy the advisor attached to its top recommendation?
//
// Codex, Cursor and Devin run their compiled entry point with a stubbed stdin.
// Pi and DSH have no stdin entry, so their adapters are loaded in-process: the
// Pi extension with a stub host that records its `input` handler, and the DSH
// plugin's exported `runAdvisor`. Every path ends in the real advisor CLI, so no
// model session starts. Hook state goes where each adapter already writes it,
// under the system temp folder.
//
// Usage, from the repository root: node <this file>
// Exit 0 when every adapter printed a brief head.

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PROMPT = '/create:readme for the utils folder';
const COMMAND = '/create:readme';
const POLICY = '(start)';
const DIST = resolve(ROOT, '.skilled/skills/system-spec-kit/runtime/dist/hooks');

function headOf(text) {
  if (typeof text !== 'string') return '(no brief)';
  const line = text.split('\n').find((candidate) => candidate.startsWith('Advisor:'));
  return line ?? '(no Advisor line)';
}

function report(runtime, file, head, exit) {
  const command = head.includes(COMMAND);
  const policy = head.includes(POLICY);
  console.log(`[${runtime}] entry=${file} exit=${exit}`);
  console.log(`[${runtime}] head: ${head}`);
  console.log(`[${runtime}] names command=${command} names policy=${policy}`);
  return head.startsWith('Advisor:');
}

function stdinAdapter(runtime, eventName) {
  const file = `${DIST}/${runtime}/user-prompt-submit.js`;
  const input = {
    prompt: PROMPT,
    cwd: ROOT,
    hook_event_name: eventName,
    session_id: `probe-013-${runtime}`,
    conversation_id: `probe-013-${runtime}`,
    workspace_roots: [ROOT],
  };
  const result = spawnSync(process.execPath, [file], {
    cwd: ROOT,
    input: JSON.stringify(input),
    encoding: 'utf8',
    timeout: 60_000,
  });
  let text = null;
  try {
    const parsed = JSON.parse(result.stdout);
    text = parsed?.hookSpecificOutput?.additionalContext ?? parsed?.agent_message ?? parsed?.additionalContext ?? null;
  } catch {
    text = result.stdout;
  }
  return report(runtime, file.slice(ROOT.length + 1), headOf(text), result.status);
}

async function piAdapter() {
  const file = '.pi/extensions/prompt-advisor.ts';
  const handlers = new Map();
  const host = { on: (event, handler) => handlers.set(event, handler) };
  const mod = await import(pathToFileURL(resolve(ROOT, file)).href);
  mod.default(host);
  const ctx = { cwd: ROOT, sessionManager: { getSessionId: () => 'probe-013-pi' } };
  const result = await handlers.get('input')?.({ text: PROMPT, source: 'interactive' }, ctx);
  return report('pi', file, headOf(result?.text ?? null), result ? 0 : 1);
}

async function dshAdapter() {
  const file = '.dsh/plugins/repo-guards/adapters/prompt-advisor.mjs';
  const mod = await import(pathToFileURL(resolve(ROOT, file)).href);
  const output = await mod.runAdvisor({
    prompt: PROMPT,
    cwd: ROOT,
    session_id: 'probe-013-dsh',
    hook_event_name: 'UserPromptSubmit',
  });
  return report('dsh', file, headOf(output?.hookSpecificOutput?.additionalContext ?? null), output ? 0 : 1);
}

let ok = true;
ok = stdinAdapter('codex', 'UserPromptSubmit') && ok;
ok = stdinAdapter('cursor', 'beforeSubmitPrompt') && ok;
ok = stdinAdapter('devin', 'UserPromptSubmit') && ok;
ok = (await piAdapter()) && ok;
ok = (await dshAdapter()) && ok;
process.exitCode = ok ? 0 : 1;
