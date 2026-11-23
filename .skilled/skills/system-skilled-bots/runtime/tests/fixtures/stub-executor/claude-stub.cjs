'use strict';

// A stand-in for the claude binary, put on PATH by the runner tests. Claude
// Code takes its prompt on argv after `-p` and, with `--output-format
// stream-json`, prints one JSON event per line, ending on a `result` event
// whose `result` string is the final answer. This stub prints that shape so
// a test sees what the runner reads from a real stream: a decision marker
// lives inside the JSON string, never on a line of its own. It acts on
// `STUB:` directive lines in the prompt and leaves a receipt under $HOME.

const fs = require('node:fs');
const path = require('node:path');

if (process.argv.includes('--version')) {
  process.stdout.write('2.0.0 (Claude Code stub)\n');
  process.exit(0);
}

const args = process.argv.slice(2);
const promptAt = args.indexOf('-p');
const prompt = promptAt === -1 ? '' : String(args[promptAt + 1] ?? '');
const home = process.env.HOME || '/nonexistent';
const runId = process.env.SKILLED_BOT_RUN_ID || 'no-run-marker';

fs.mkdirSync(path.join(home, 'stub-receipts'), { recursive: true });
fs.writeFileSync(
  path.join(home, 'stub-receipts', `${runId}.json`),
  JSON.stringify({ pid: process.pid, argv: args, cwd: process.cwd(), env: process.env, prompt }),
);

function directive(name) {
  const line = prompt.split('\n').find((entry) => entry.startsWith(`STUB:${name}`));
  return line === undefined ? null : line.slice(`STUB:${name}`.length).replace(/^=/, '');
}

const sessionId = 'stub-session-0001';
const lines = ['Looked at the task.'];
const decide = directive('decide');
if (decide !== null) {
  lines.push(`[NEEDS-DECISION] ${decide}`);
  for (const entry of prompt.split('\n')) {
    if (entry.startsWith('STUB:option=')) lines.push(`[OPTION] ${entry.slice('STUB:option='.length)}`);
  }
}
const finalText = lines.join('\n');

const events = [
  { type: 'system', subtype: 'init', session_id: sessionId, model: 'stub' },
  { type: 'assistant', session_id: sessionId, parent_tool_use_id: null, message: { content: [{ type: 'text', text: finalText }] } },
  { type: 'result', subtype: 'success', is_error: false, session_id: sessionId, result: finalText, total_cost_usd: 0 },
];
for (const event of events) process.stdout.write(`${JSON.stringify(event)}\n`);
process.exit(0);
