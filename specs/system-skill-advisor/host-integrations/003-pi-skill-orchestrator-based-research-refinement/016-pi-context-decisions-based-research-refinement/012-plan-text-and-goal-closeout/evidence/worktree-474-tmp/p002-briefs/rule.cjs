const PASTED_REPLY_CUE = /^\s*(?:(?:earlier|previously|above),?\s+)?(?:(?:you|the assistant|claude)\s+(?:replied|said|wrote|answered|responded)\s*:|["“>])/i;
const TASK_MARKER = /(?:^|[.!?\n]\s*)(?:now|task)\s*:\s*/i;
function stripOnce(prompt) {
  if (!PASTED_REPLY_CUE.test(prompt)) return prompt;
  const marker = TASK_MARKER.exec(prompt);
  if (!marker) return prompt;
  const task = prompt.slice(marker.index + marker[0].length).trim();
  return task.length > 0 ? task : prompt;
}
function stripLeadingPastedReply(prompt) {
  let current = prompt;
  for (;;) { const next = stripOnce(current); if (next === current) return current; current = next; }
}
module.exports = { stripLeadingPastedReply };
if (require.main === module) {
  const fs = require('fs'), path = require('path');
  const cases = {
    probe: 'Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code',
    youSaid: 'You said: run the tests. Task: fix the failing parser test',
    negQuoteInside: 'Fix the bug where the bot prints "you said:" twice',
    negNowMid: 'Update the docs. Now: also add a changelog entry',
    negNoMarker: 'Earlier you replied: done with the README',
    plain: 'Refactor the session store module to remove duplicated locking code',
    nested: 'Earlier you replied: A. Now: You said: B. Task: fix the parser',
  };
  for (const [k, v] of Object.entries(cases)) { const once = stripLeadingPastedReply(v); console.log(k.padEnd(15), JSON.stringify(once), 'idempotent=' + (stripLeadingPastedReply(once) === once)); }
  let n = 0, changed = [];
  for (const dir of process.argv.slice(2)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl'))) for (const line of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
    if (!line.trim()) continue; let o; try { o = JSON.parse(line); } catch { continue; }
    const p = o.prompt || o.text || o.input; if (typeof p !== 'string') continue; n++; if (stripLeadingPastedReply(p) !== p) changed.push(f + ': ' + p.slice(0, 80));
  }
  console.log(JSON.stringify({ corpusPrompts: n, changed: changed.length, changed }));
}
