// Run from the repository root: node <this file> [<run log> ...]
// Default run log: the before arm, 007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl.
// Planning probe for the Codex shell shape. For every Codex line of a run log it loads
// the session through the shared reader and the scorer's own normalize, then reads the
// rollout file a second time to see what the reader dropped. It prints counts only:
// no prompt text, no command text and no row id. Row labels come from
// `jq -c 'del(.prompt)'`, so the corpus is never opened unfiltered. It starts no model
// session and writes nothing.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { loadSession } from '../../../../../../../.skilled/hooks/shared/session-readers/index.mjs';
import {
  normalize,
  startState,
  workflowPath,
} from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';

const RAD = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
const P = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build';
const logs = process.argv.slice(2).length > 0
  ? process.argv.slice(2)
  : [`${P}/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`];

const labels = new Map();
const labelText = execFileSync('jq', ['-c', 'del(.prompt)', `${RAD}/command-prompts.jsonl`], { encoding: 'utf8' });
for (const text of labelText.split('\n')) {
  if (text.trim() === '') continue;
  const row = JSON.parse(text);
  if (row.split === 'holdout') continue;
  labels.set(row.id, row);
}

const bridges = JSON.parse(readFileSync('.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json', 'utf8'));
const ownerByCommand = new Map();
const skills = new Set();
for (const entry of bridges.entries) {
  if (typeof entry.skillId !== 'string') continue;
  skills.add(entry.skillId);
  if (typeof entry.command === 'string') ownerByCommand.set(entry.command.split(' ')[0], entry.skillId);
}
const ownerOf = (label) => ownerByCommand.get(String(label.expected_command ?? '').split(' ')[0])
  ?? (skills.has(label.expected_top) ? label.expected_top : null);

// The shape the planned scorer helper reads: every `cmd` string literal inside the
// JavaScript body of a custom `exec` call.
const CMD_LITERAL = /\bcmd\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
function execBodyCommands(input) {
  const commands = [];
  for (const match of String(input ?? '').matchAll(CMD_LITERAL)) {
    const literal = match[1];
    if (literal.startsWith('"')) {
      try { commands.push(JSON.parse(literal)); } catch { /* an escape JSON does not know */ }
    } else {
      commands.push(literal.slice(1, -1).replace(/\\(.)/g, '$1'));
    }
  }
  return commands;
}

const ENTRY_DOC = /skills\/[\w-]+\/(?:[\w-]+\/)?(?:SKILL|ROUTER)\.md\b/;
const COMMAND_DOC = /\/commands\/[\w-]+\/[\w-]+\.md\b|\/prompts\/[\w-]+\.md\b/;
const READ_VERB = /\b(?:cat|head|tail|sed|less|more|bat|nl|awk)\b/;

const count = { 'started now': 0, 'started with the body read': 0, 'sessions whose wrote fact changes': 0 };
const bump = (key, by = 1) => { count[key] = (count[key] ?? 0) + by; };
const toolNames = {};

for (const log of logs) {
  for (const text of readFileSync(log, 'utf8').split('\n')) {
    if (text.trim() === '') continue;
    const line = JSON.parse(text);
    if (line.runtime !== 'codex') continue;
    bump('codex lines');
    const label = labels.get(line.rowId);
    if (!label) { bump('lines with no tune label'); continue; }
    const loaded = await loadSession({ ...(line.locator ?? {}), runtime: 'codex' });
    if (!loaded.ok) { bump(`unreadable:${loaded.code}`); continue; }
    bump('sessions read');

    // What the scorer sees today.
    const events = normalize(loaded.records, 'codex');
    const shell = events.filter((event) => event.kind === 'shell');
    bump('shell events', shell.length);
    bump('shell events with no command text', shell.filter((event) => event.command === null).length);
    const owner = ownerOf(label);
    const wroteNow = (Array.isArray(line.changedPaths) && line.changedPaths.length > 0)
      || events.some((event) => event.kind === 'write');
    if (owner !== null) {
      bump('owned rows');
      bump(`path now:${workflowPath(events, { command: label.expected_command, owner, wrote: wroteNow, policy: label.expected_policy })}`);
    }
    if (startState(events, label).started) bump('started now');

    // What the rollout holds and the reader drops.
    const bodies = new Map();
    for (const raw of readFileSync(line.locator.transcriptPath, 'utf8').split('\n')) {
      if (raw.trim() === '') continue;
      let entry;
      try { entry = JSON.parse(raw); } catch { continue; }
      const payload = entry?.payload;
      if (entry?.type !== 'response_item' || payload?.type !== 'custom_tool_call') continue;
      bump('custom tool calls');
      bump(`custom tool call name:${payload.name}`);
      if (typeof payload.arguments === 'string' && payload.arguments.trim()) bump('custom tool calls with an arguments field');
      if (typeof payload.input === 'string' && payload.input.trim()) {
        bump('custom tool calls with an input string');
        bodies.set(payload.call_id, payload.input);
        for (const match of payload.input.matchAll(/\btools\.([A-Za-z_]+)\s*\(/g)) {
          toolNames[match[1]] = (toolNames[match[1]] ?? 0) + 1;
        }
        if (payload.name === 'exec' && execBodyCommands(payload.input).length === 0) {
          bump('exec bodies the planned helper reads no command from');
          // The skeleton of such a body, with every string literal emptied, so the
          // shape is visible and no text a model or a prompt wrote is printed.
          const skeleton = payload.input
            .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, '""')
            .replace(/\s+/g, ' ')
            .slice(0, 160);
          bump(`no-command body shape: ${skeleton}`);
        }
      }
    }

    // The same session with the body handed to the scorer the planned way: each
    // `cmd` literal of an `exec` body becomes that call's command.
    const patched = loaded.records.map((record) => ({
      ...record,
      content: (record.content ?? []).flatMap((block) => {
        if (block?.type !== 'toolCall' || !bodies.has(block.id)) return [block];
        if (block.name !== 'exec') return [{ ...block, arguments: { input: bodies.get(block.id) } }];
        const commands = execBodyCommands(bodies.get(block.id));
        return commands.length === 0
          ? [block]
          : commands.map((command, index) => ({ ...block, id: `${block.id}-${index}`, arguments: { command } }));
      }),
    }));
    const next = normalize(patched, 'codex');
    const firstWrite = next.findIndex((event) => event.kind === 'write');
    const before = firstWrite === -1 ? next : next.slice(0, firstWrite);
    const reads = next.filter((event) => event.kind === 'shell' && READ_VERB.test(event.command ?? '')
      && (ENTRY_DOC.test(event.command ?? '') || COMMAND_DOC.test(event.command ?? '')));
    if (reads.length > 0) bump('sessions with a shell read of a skill or command document');
    if (before.some((event) => reads.includes(event))) bump('of those, read before the first write');
    const wroteNext = (Array.isArray(line.changedPaths) && line.changedPaths.length > 0) || firstWrite !== -1;
    if (owner !== null) {
      bump(`path with the body read:${workflowPath(next, { command: label.expected_command, owner, wrote: wroteNext, policy: label.expected_policy })}`);
    }
    if (startState(next, label).started) bump('started with the body read');
    if (wroteNow !== wroteNext) bump('sessions whose wrote fact changes');
  }
}

for (const key of Object.keys(count).sort()) console.log(`${key}: ${count[key]}`);
console.log(`tools called inside exec bodies: ${Object.keys(toolNames).sort().map((name) => `${name}=${toolNames[name]}`).join(', ') || 'none'}`);
