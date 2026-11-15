// Probe: a refusal that quotes the COMMAND: marker, and a mode suffix on a repeated report.
import { normalize, commandLines, startState, startedCommand } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';

const text = (body) => normalize([{ role: 'assistant', content: [{ type: 'text', text: body }] }], 'claude');

const refusal = text('A line like COMMAND: /deep:review → started appears only when I actually run one, so you will not see it here.');
console.log('quoted marker commandLines', JSON.stringify(commandLines(refusal)));
console.log('quoted marker startedCommand', startedCommand(refusal, ['/deep:review'], '/arena'));
console.log('quoted marker startState', JSON.stringify(startState(refusal, { expected_command: '/deep:review', expected_policy: 'ask', row_type: 'ask', prompt: 'x' })));

const twice = text('COMMAND: /deep:review → offered\n\nlater\n\nCOMMAND: /deep:review:auto → started');
console.log('suffix pair commandLines', JSON.stringify(commandLines(twice)));
const same = text('COMMAND: /deep:review → offered\n\nlater\n\nCOMMAND: /deep:review → started');
console.log('same pair commandLines', JSON.stringify(commandLines(same)));
