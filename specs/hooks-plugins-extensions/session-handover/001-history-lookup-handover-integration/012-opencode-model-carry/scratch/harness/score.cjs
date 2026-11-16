#!/usr/bin/env node
// Score one live-hop run folder written by live-hop.sh: hop steps from the relaunch log,
// the note's final state, the receiver's answer on screen and the flags each launch carried.
'use strict';
const fs = require('fs');
const path = require('path');

const dir = path.resolve(process.argv[2]);
const read = (name) => { try { return fs.readFileSync(path.join(dir, name), 'utf8'); } catch { return ''; } };
const meta = JSON.parse(read('meta.json'));
const repo = path.resolve(__dirname, '../../../../../../..');
const readmeLines = fs.readFileSync(path.join(repo, '.skilled/hooks/session-handover/README.md'), 'utf8').split('\n').length - 1;

const events = read('relaunch.log').split('\n').filter(Boolean).map((line) => {
  const [stamp, event, ...rest] = line.split(' ');
  return { ms: Date.parse(stamp), event, fields: Object.fromEntries(rest.map((kv) => kv.split('='))) };
}).filter((e) => e.ms >= meta.startMs);

const notes = fs.readdirSync(dir).filter((f) => f.startsWith('note-'));
const note = notes.length ? read(notes[notes.length - 1]) : '';
const noteField = (key) => (note.match(new RegExp(`^${key}:\\s*(.*)$`, 'm')) || [])[1] || null;
const sessionId = noteField('session_id');

const prepare = sessionId ? events.find((e) => e.event === 'prepare' && e.fields.sessionId === sessionId) : null;
const loopId = prepare && prepare.fields.loopId;
const runPids = new Set(read('argv.log').split('\n').filter(Boolean).map((line) => line.split(' ')[1]));
const signal = prepare ? events.find((e) => e.event === 'killer-signal' && e.ms >= prepare.ms && runPids.has(e.fields.targetPid)) : null;
const relaunch = prepare ? events.find((e) => e.event === 'relaunch' && e.fields.loopId === loopId && e.ms >= prepare.ms) : null;
const problems = events.filter((e) => /error|timeout|withdrawn|arm-cancelled|refused|no-armed|decline/.test(e.event)
  && (!loopId || !e.fields.loopId || e.fields.loopId === loopId));

const argv = read('argv.log').split('\n').filter(Boolean).map((line) => {
  const [ms, pid, ...args] = line.split(' ');
  return { ms: Number(ms), pid, args: args.join(' ') };
}).filter((a) => {
  // Keep only the runtime itself: its binary, or node running the runtime's script.
  const words = a.args.split(' ');
  const base = (w) => path.basename(w || '');
  return base(words[0]) === meta.runtime
    || (meta.runtime === 'vibe' && base(words[0]) === 'vibe-rs')
    || (base(words[0]) === 'node' && base(words[1]) === meta.runtime);
});
const first = argv[0] ? argv[0].args : null;
const receiver = relaunch ? (argv.find((a) => a.ms >= relaunch.ms - 2000 && a.args !== first) || null) : null;
const flag = (args, names) => {
  if (!args) return null;
  for (const n of names) {
    const m = args.match(new RegExp(`(?:^|\\s)${n.replace(/[-]/g, '\\-')}(?:=|\\s+)("[^"]*"|\\S+)`));
    if (m) return m[1].replace(/^"|"$/g, '');
  }
  return null;
};
const carry = {};
for (const [key, names] of Object.entries({
  model: ['--model', '-m'], effort: ['--effort', '--thinking', '-c'], name: ['--name'], provider: ['--provider'],
})) {
  const clean = (v) => (v == null ? v : v.replace(/"/g, '').replace(/^model_reasoning_effort=/, ''));
  const sent = clean(flag(first, names));
  const got = receiver ? clean(flag(receiver.args, names)) : null;
  carry[key] = first && path.basename(first.split(' ')[0]) === meta.runtime && first.trim() === meta.runtime ? 'unobservable' : sent == null ? 'not-set' : got == null ? 'dropped' : (got === sent || got.startsWith(sent.replace(/ \(\d+\)$/, ''))) ? 'kept' : `changed:${got}`;
}

// The receiver's own turns, read through the repository's session readers. The pane cannot
// prove recall: when it holds no seed marker the only text left is the sender's echoed prompt.
async function receiverTurns() {
  const receiverId = noteField('claimed_by');
  if (!receiverId || !['pi', 'opencode'].includes(meta.runtime)) return null;
  const readers = await import(path.join(repo, '.skilled/hooks/shared/session-readers/index.mjs'));
  const result = await readers.readSession({ runtime: meta.runtime, sessionId: receiverId, projectDir: repo });
  return result.ok ? result.items : { error: result.code };
}

function blocks(items, role, type) {
  return items.filter((item) => item.role === role)
    .flatMap((item) => item.content || [])
    .filter((block) => block.type === type);
}

async function main() {
const pane = read('pane.txt');
const marker = pane.lastIndexOf('[session-handover]');
const afterSeed = marker >= 0 ? pane.slice(marker) : '';
const turns = await receiverTurns();
const replies = Array.isArray(turns) ? blocks(turns, 'assistant', 'text').map((b) => b.text).join('\n') : afterSeed;
const answer = {
  lineCount: new RegExp(`\\b${readmeLines}\\b`).test(replies),
  heading: /Session Handover/.test(replies),
  codeWord: replies.includes(meta.codeWord),
};
// Recall is scored apart from the hop steps, so a score stays comparable with earlier runs. The
// side word is planted in the sender's prompt and kept out of the note, so a receiver that
// states it in its own reply had to read the sender's turns.
const lookupCalls = Array.isArray(turns)
  ? blocks(turns, 'assistant', 'toolCall').filter((b) => JSON.stringify(b.arguments || {}).includes('history-lookup.mjs'))
  : [];
const lookupIds = new Set(lookupCalls.map((b) => b.id));
const lookupReplies = Array.isArray(turns)
  ? turns.filter((item) => item.role === 'toolResult' && lookupIds.has(item.toolCallId))
    .map((item) => JSON.stringify(item.content))
  : [];
const recall = meta.sideWord ? {
  source: Array.isArray(turns) ? 'receiver-transcript' : turns ? `transcript-unreadable:${turns.error}` : 'pane-after-seed',
  sideWordStated: replies.includes(meta.sideWord),
  sideWordInNote: note.includes(meta.sideWord),
  lookupCalls: lookupCalls.length,
} : null;
// The planted secret sits in the sender's first turn. The receiver may see it only as a
// redaction marker: never in a lookup reply, never in its own words, never in the note.
const secret = meta.plantedSecret && Array.isArray(turns) ? {
  leakedToReceiver: JSON.stringify(turns).includes(meta.plantedSecret),
  leakedToNote: note.includes(meta.plantedSecret),
  markerInLookupReply: lookupReplies.some((text) => text.includes('[REDACTED:url-password]')),
} : null;

// The model each side answered on, from the OpenCode store: the sender's last assistant message
// and the receiver's first. Carry holds when the receiver starts on the sender's model and that
// model is the one the run started the sender on, not the project's pinned one.
function openCodeModel(id, order) {
  if (meta.runtime !== 'opencode' || !id) return null;
  try {
    const { DatabaseSync } = require('node:sqlite');
    const os = require('node:os');
    const db = new DatabaseSync(path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share'), 'opencode', 'opencode.db'), { readOnly: true });
    const row = db.prepare(`SELECT data FROM session_message WHERE session_id = ? AND type = 'assistant' ORDER BY seq ${order} LIMIT 1`).get(id);
    db.close();
    const model = row ? JSON.parse(row.data).model : null;
    return model ? `${model.providerID}/${model.id}#${model.variant || ''}` : null;
  } catch (error) {
    return `error:${error.message}`;
  }
}
const senderModel = openCodeModel(noteField('session_id'), 'DESC');
const receiverModel = openCodeModel(noteField('claimed_by'), 'ASC');
const modelCarry = meta.runtime === 'opencode' ? {
  expected: meta.senderModel || null,
  sender: senderModel,
  receiver: receiverModel,
  kept: Boolean(senderModel && receiverModel && senderModel === receiverModel
    && (!meta.senderModel || senderModel.startsWith(`${meta.senderModel}#`))),
} : null;

const secs = (a, b) => (a && b ? Math.round((b.ms - a.ms) / 100) / 10 : null);
const card = {
  runtime: meta.runtime,
  label: meta.label,
  trustDialogs: meta.trustDialogs,
  steps: {
    notePrepared: Boolean(prepare),
    signalled: Boolean(signal),
    relaunched: Boolean(relaunch),
    noteClosed: /^(done|complete)/.test(noteField('status') || ''),
    receiverAnswered: answer.lineCount && answer.codeWord,
  },
  answer,
  recall,
  secret,
  noteStatus: noteField('status'),
  carry,
  modelCarry,
  seconds: {
    startToPrepare: prepare ? Math.round((prepare.ms - meta.startMs) / 100) / 10 : null,
    prepareToSignal: secs(prepare, signal),
    signalToRelaunch: secs(signal, relaunch),
    startToClosed: noteField('completed_at') ? Math.round((Date.parse(noteField('completed_at')) - meta.startMs) / 100) / 10 : null,
  },
  problems: problems.map((e) => `${e.event} ${Object.entries(e.fields).map(([k, v]) => `${k}=${v}`).join(' ')}`),
  firstLaunch: first,
  relaunchArgs: receiver ? receiver.args : null,
};
card.score = Object.values(card.steps).filter(Boolean).length + '/' + Object.keys(card.steps).length;
fs.writeFileSync(path.join(dir, 'scorecard.json'), JSON.stringify(card, null, 2));
console.log(JSON.stringify(card, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
