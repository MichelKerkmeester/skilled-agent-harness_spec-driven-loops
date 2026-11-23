'use strict';

// A stand-in for the opencode binary, put on PATH by the runner tests.
// OpenCode takes its prompt as the last argv entry and, with `--format json`,
// prints one JSON event per line; a `text` event carries one text part of an
// assistant message in `part.text`. This stub prints that shape, so a
// decision marker lives inside a JSON string, never on a line of its own. It
// acts on `STUB:` directive lines in the prompt and leaves a receipt under
// $HOME holding the environment it saw, including its inline permission config.

const fs = require('node:fs');
const path = require('node:path');

if (process.argv.includes('--version')) {
  process.stdout.write('2.3.2\n');
  process.exit(0);
}

const args = process.argv.slice(2);

// `debug agents` resolves the agents a run would use, with no model call. A test that needs
// a given resolution leaves `.stub-opencode-agents.json` in the working folder; otherwise the
// stub lays the inline config's rules over a catch-all allow, top level first and the build
// agent's own rules last, the order OpenCode applies them in.
if (args[0] === 'debug' && args[1] === 'agents') {
  const pinned = path.join(process.cwd(), '.stub-opencode-agents.json');
  if (fs.existsSync(pinned)) {
    process.stdout.write(fs.readFileSync(pinned, 'utf8'));
    process.exit(0);
  }
  const inline = JSON.parse(process.env.OPENCODE_CONFIG_CONTENT || '{}');
  const rulesOf = (map) => Object.entries(map || {}).map(([action, effect]) => ({ action, resource: '*', effect }));
  const permissions = [
    { action: '*', resource: '*', effect: 'allow' },
    ...rulesOf(inline.permission),
    ...rulesOf(inline.agent && inline.agent.build && inline.agent.build.permission),
  ];
  process.stdout.write(`${JSON.stringify([{ id: 'build', name: 'Build', mode: 'primary', permissions }])}\n`);
  process.exit(0);
}

const prompt = String(args[args.length - 1] ?? '');
const home = process.env.HOME || '/nonexistent';
const runId = process.env.SKILLED_BOT_RUN_ID || 'no-run-marker';

fs.mkdirSync(path.join(home, 'stub-receipts'), { recursive: true });
// Written through a rename so a test polling for the receipt never parses a half-written file.
const receiptPath = path.join(home, 'stub-receipts', `${runId}.json`);
fs.writeFileSync(`${receiptPath}.tmp`, JSON.stringify({ pid: process.pid, argv: args, cwd: process.cwd(), env: process.env, prompt }));
fs.renameSync(`${receiptPath}.tmp`, receiptPath);

function directive(name) {
  const line = prompt.split('\n').find((entry) => entry.startsWith(`STUB:${name}`));
  return line === undefined ? null : line.slice(`STUB:${name}`.length).replace(/^=/, '');
}

const sessionID = 'ses_stub0001';
const lines = ['Read the notes.'];
const decide = directive('decide');
if (decide !== null) {
  lines.push(`[NEEDS-DECISION] ${decide}`);
  for (const entry of prompt.split('\n')) {
    if (entry.startsWith('STUB:option=')) lines.push(`[OPTION] ${entry.slice('STUB:option='.length)}`);
  }
}

const events = [
  { type: 'step_start', sessionID, part: { type: 'step-start', messageID: 'msg_1', sessionID } },
  { type: 'text', sessionID, part: { type: 'text', messageID: 'msg_1', sessionID, text: 'Planning the read.' } },
  { type: 'step_finish', sessionID, part: { type: 'step-finish', messageID: 'msg_1', sessionID, reason: 'tool-calls', cost: 0 } },
  { type: 'step_start', sessionID, part: { type: 'step-start', messageID: 'msg_2', sessionID } },
  { type: 'text', sessionID, part: { type: 'text', messageID: 'msg_2', sessionID, text: lines.join('\n') } },
  { type: 'step_finish', sessionID, part: { type: 'step-finish', messageID: 'msg_2', sessionID, reason: 'stop', cost: 0 } },
];
for (const event of events) process.stdout.write(`${JSON.stringify(event)}\n`);
process.exit(0);
