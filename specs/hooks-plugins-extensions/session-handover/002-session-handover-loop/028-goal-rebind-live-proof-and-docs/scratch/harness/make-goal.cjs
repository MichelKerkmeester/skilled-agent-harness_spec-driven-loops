'use strict';
// Writes a harmless goal.md whose durable slice has exactly N characters, so a live run can sit
// at the 4,000-character limit. Usage: make-goal.cjs <packet-dir> <durable-chars>
const fs = require('node:fs');
const path = require('node:path');

const [packetDir, charsArg] = process.argv.slice(2);
const target = Number(charsArg);
const head = [
  '# Goal: Pong keeper',
  '',
  'Packet: specs/demo/001-demo',
  '',
  'Reply to every operator message with the single word PONG and do nothing else.',
  'This goal is met only when the operator sends the word FINISH.',
  '',
].join('\n');
const filler = 'Filler line that only pads this goal toward its size limit and asks for nothing.\n';
let body = head;
while (body.length + filler.length <= target) body += filler;
body += 'x'.repeat(target - body.length);
fs.mkdirSync(packetDir, { recursive: true });
fs.writeFileSync(path.join(packetDir, 'goal.md'), `---\ntitle: "Goal: Pong keeper"\nstatus: active\n---\n${body}`);
console.log(`durable chars written: ${body.length}`);
