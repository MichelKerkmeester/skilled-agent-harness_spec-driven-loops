'use strict';
// Summarizes a Claude transcript for the receiver proof: the start prompt, every goal status
// entry with the length of its condition, each hook context message that mentions the
// hand-over, and every tool command the session ran. Usage: extract-receiver.cjs <transcript>
const fs = require('node:fs');

const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean);
let userPrompts = 0;
lines.forEach((line, index) => {
  let entry;
  try { entry = JSON.parse(line); } catch { return; }
  const at = `line=${index + 1} ts=${entry.timestamp ?? ''}`;
  const attachment = entry.attachment;
  if (attachment?.type === 'goal_status') {
    const condition = String(attachment.condition ?? '');
    console.log(`${at} goal_status met=${attachment.met} failed=${attachment.failed ?? false} condition_chars=${condition.length} head=${JSON.stringify(condition.slice(0, 40))}`);
  } else if (attachment && JSON.stringify(attachment).includes('session-relaunch')) {
    const text = JSON.stringify(attachment);
    console.log(`${at} hook_context type=${attachment.type} event=${attachment.hookEvent ?? attachment.hookName ?? ''} chars=${text.length} head=${JSON.stringify(text.slice(0, 160))}`);
  } else if (entry.type === 'user' && typeof entry.message?.content === 'string') {
    userPrompts += 1;
    if (userPrompts <= 3) console.log(`${at} user_prompt#${userPrompts} chars=${entry.message.content.length} head=${JSON.stringify(entry.message.content.slice(0, 80))}`);
  } else if (entry.type === 'assistant') {
    for (const part of entry.message?.content ?? []) {
      if (part.type === 'tool_use') console.log(`${at} tool_use ${part.name} ${JSON.stringify(part.input).slice(0, 200)}`);
    }
  }
});
