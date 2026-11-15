'use strict';
// Summarizes a Pi session log for the receiver proof: each entry's kind and size, whether it
// carries an active-goal block (with the goal id), the user prompts and every tool command.
// Usage: extract-pi.cjs <session.jsonl>
const fs = require('node:fs');

const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean);
lines.forEach((line, index) => {
  let entry;
  try { entry = JSON.parse(line); } catch { return; }
  const text = JSON.stringify(entry);
  const at = `line=${index + 1} ts=${entry.timestamp ?? ''}`;
  const kind = `${entry.type}${entry.message?.role ? `/${entry.message.role}` : ''}${entry.customType ? `/${entry.customType}` : ''}`;
  const goal = /\[active_goal:([A-Za-z0-9-]+)\]/.exec(text);
  const body = entry.message?.content ?? entry.content;
  const bodyText = typeof body === 'string' ? body : JSON.stringify(body ?? '');
  let extra = '';
  if (entry.message?.role === 'user') extra = ` head=${JSON.stringify(bodyText.slice(0, 90))}`;
  const parts = Array.isArray(body) ? body : [];
  for (const part of parts) {
    if (part?.type === 'toolCall') extra += ` tool=${part.name} args=${JSON.stringify(part.arguments ?? part.input ?? {}).slice(0, 220)}`;
  }
  console.log(`${at} ${kind} chars=${text.length}${goal ? ` ACTIVE_GOAL=${goal[1]}` : ''}${extra}`);
});
