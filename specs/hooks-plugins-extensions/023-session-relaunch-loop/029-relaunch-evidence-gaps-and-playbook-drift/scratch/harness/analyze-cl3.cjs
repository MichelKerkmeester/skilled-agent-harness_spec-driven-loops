'use strict';
// Reads each trial's probe.jsonl and transcript-deliveries.txt and prints one row per trial:
// did the first PostToolUse after the withdraw prompt deliver the extra nudge, and was the
// transcript tail it read stale (same fill as the withdraw prompt measured)?
const fs = require('node:fs');
const path = require('node:path');
const dir = process.argv[2];
const rows = [];
for (const name of fs.readdirSync(dir).filter((n) => /^trial-\d+$/.test(n)).sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)))) {
  const trial = path.join(dir, name);
  let probe;
  let deliveries;
  try {
    probe = fs.readFileSync(path.join(trial, 'probe.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
    deliveries = fs.readFileSync(path.join(trial, 'transcript-deliveries.txt'), 'utf8').split('\n').filter(Boolean);
  } catch (error) { rows.push({ trial: name, error: error.message }); continue; }
  const promptIdx = probe.findIndex((r) => r.ev === 'UserPromptSubmit' && /^Run the shell command '(sleep 3; )?echo/.test(r.prompt || ''));
  if (promptIdx < 0) { rows.push({ trial: name, error: 'no withdraw prompt in probe log' }); continue; }
  const prompt = probe[promptIdx];
  const posts = [];
  for (const r of probe.slice(promptIdx + 1)) {
    if (r.ev === 'UserPromptSubmit') break;
    if (r.ev === 'PostToolUse') posts.push(r);
  }
  const first = posts[0];
  const parse = (l) => Object.fromEntries(l.split('\t').slice(1).map((kv) => { const i = kv.indexOf('='); return i < 0 ? [kv, ''] : [kv.slice(0, i), kv.slice(i + 1)]; }));
  const att = deliveries.filter((l) => l.includes('\ttype=attachment\t') && l.includes('hook_additional_context'));
  const notice = att.find((l) => l.startsWith('withdraw-notice'));
  const noticeTs = notice ? parse(notice).ts : null;
  const nudgesAfter = att.filter((l) => l.startsWith('nudge') && noticeTs && parse(l).ts > noticeTs);
  const firstNudge = nudgesAfter[0] ? parse(nudgesAfter[0]) : null;
  const deliveredHook = firstNudge ? (nudgesAfter[0].includes('PostToolUse') ? 'PostToolUse' : 'UserPromptSubmit') : 'none';
  // the first post-withdraw PostToolUse delivered iff the first nudge attachment sits inside the window that hook ran in
  let firstAttemptDelivered = false;
  if (firstNudge && first) {
    const hookTs = Date.parse(first.ts);
    firstAttemptDelivered = deliveredHook === 'PostToolUse' && Math.abs(Date.parse(firstNudge.ts) - hookTs) < 3000;
  }
  rows.push({
    trial: name,
    promptFill: prompt.fill,
    postToolUseHooksInTurn: posts.length,
    firstPostFill: first ? first.fill : null,
    firstPostStale: first ? first.fill === prompt.fill : null,
    firstPostNudgeState: first ? first.nudge : null,
    firstNudgeDeliveredBy: deliveredHook,
    firstNudgeSecondsAfterNotice: firstNudge && noticeTs ? ((Date.parse(firstNudge.ts) - Date.parse(noticeTs)) / 1000).toFixed(1) : null,
    firstAttemptDelivered,
  });
}
console.log(JSON.stringify(rows, null, 1));
const ok = rows.filter((r) => r.firstAttemptDelivered).length;
const valid = rows.filter((r) => !r.error).length;
console.log(`first-attempt deliveries: ${ok} of ${valid}`);
