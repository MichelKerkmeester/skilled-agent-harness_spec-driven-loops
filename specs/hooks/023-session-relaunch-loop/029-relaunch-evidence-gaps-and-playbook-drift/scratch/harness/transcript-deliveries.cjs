'use strict';
// Lists, from a Claude transcript, every entry that carries a session-relaunch hook message
// (withdraw notice, extra nudge) with its line number, entry type and timestamp, so delivery
// is read from what the model was handed rather than from the model's own quoting.
const fs = require('node:fs');
const file = process.argv[2];
const markers = [
  ['withdraw-notice', 'The prepared hand-over was withdrawn'],
  ['nudge', 'Context is past the configured window'],
];
const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
lines.forEach((line, i) => {
  for (const [name, text] of markers) {
    if (!line.includes(text)) continue;
    let entry = {};
    try { entry = JSON.parse(line); } catch {}
    const attachment = entry.attachment ? `${entry.attachment.type}/${entry.attachment.hookEvent ?? entry.attachment.hookName ?? ''}` : '';
    const role = entry.message?.role ?? '';
    console.log(`${name}\tline=${i + 1}\ttype=${entry.type}\trole=${role}\t${attachment}\tts=${entry.timestamp}`);
  }
});
console.log(`total_lines=${lines.length}`);
