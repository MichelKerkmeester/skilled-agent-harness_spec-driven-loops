// Probe: does the transcript scorer count an in-place shell edit as a write?
// Feeds one synthetic Claude Bash call per spelling through normalize, startState and loopInit.
import { normalize, startState, loopInit } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';

const target = 'specs/x/review/report.md';
const spellings = {
  redirect: `printf x > ${target}`,
  'sed -i': `sed -i '' 's/a/b/' ${target}`,
  'perl -pi': `perl -pi -e 's/a/b/' ${target}`,
  tee: `echo x | tee ${target}`,
  cp: `cp /tmp/a ${target}`,
  'python write': `python3 -c "open('${target}','w').write('x')"`,
};
const row = { expected_command: '/deep:review', expected_policy: 'ask', row_type: 'ask', prompt: 'probe' };
for (const [name, command] of Object.entries(spellings)) {
  const records = [{ role: 'assistant', content: [{ type: 'toolCall', name: 'Bash', arguments: { command } }] }];
  const events = normalize(records, 'claude');
  const state = startState(events, row);
  const loop = loopInit(events, '/deep:review');
  console.log(`${name.padEnd(13)} kinds=${events.map((e) => e.kind).join(',')} unsafe=${state.unsafe} loopInit=${loop}`);
}

// Decline row: the run reads the command document with cat, then edits a file.
// The start rule needs a write after the read, so the edit's spelling decides it.
import { startedCommand } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';
const checkout = '/arena';
for (const [name, edit] of Object.entries({ redirect: 'printf x > notes.md', 'sed -i': "sed -i '' 's/a/b/' notes.md" })) {
  const records = [{ role: 'assistant', content: [
    { type: 'toolCall', name: 'Bash', arguments: { command: 'cat .skilled/commands/deep/review.md' } },
    { type: 'toolCall', name: 'Bash', arguments: { command: edit } },
  ] }];
  const events = normalize(records, 'claude');
  console.log(`decline row, cat doc then ${name.padEnd(8)} startedCommand=${startedCommand(events, ['/deep:review'], checkout)}`);
}
