'use strict';
// Compose one brief: PREAMBLE, PERSONA, the task text, RUN CONTEXT, DON'T and
// HANDBACK, the shared blocks pasted verbatim with only the phase path filled.
// usage: node compose.cjs <code|markdown> <task.txt> <brief.md>
const fs = require('node:fs');

const SHARED = '/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/shared-blocks.md';
const PHASE = 'specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint';
const [persona, taskFile, outFile] = process.argv.slice(2);

const text = fs.readFileSync(SHARED, 'utf8');
function block(heading) {
  const start = text.indexOf('## ' + heading);
  if (start < 0) throw new Error('no block ' + heading);
  const open = text.indexOf('```text\n', start) + '```text\n'.length;
  const close = text.indexOf('\n```', open);
  return text.slice(open, close).split('<phase folder path>').join(PHASE);
}
const personaHeading = persona === 'code' ? 'PERSONA: code' : 'PERSONA: markdown';
const task = fs.readFileSync(taskFile, 'utf8').replace(/\s+$/u, '');
const brief = [
  block('PREAMBLE'),
  block(personaHeading),
  task,
  block('RUN CONTEXT'),
  block("DON'T"),
  block('HANDBACK')
].join('\n\n') + '\n';
fs.writeFileSync(outFile, brief);
console.log(outFile + ' lines=' + brief.split('\n').length);
