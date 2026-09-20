import { inspectDispatch } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/hooks/dispatch/lib/dispatch-audit.mjs';

const D = 'specs/system-deep-loop/036-deep-loop-innovation/scratch/merge-041-050';
const candidate = [
  'env SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true',
  'pi -p @' + D + '/prompts/prompt-w1a.md',
  '--model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline',
  '--tools read,grep,find,ls --no-extensions --no-skills --no-prompt-templates',
  '</dev/null > ' + D + '/census-w1a.out 2> ' + D + '/census-w1a.err',
].join(' ');

const negatives = [
  'pi -p "$(cat ' + D + '/prompts/prompt-w1a.md)" --model llmgateway/deepseek-v4.1-flash --mode text',
  '(pi -p @x --model a/b --mode text </dev/null > o 2> e) & (pi -p @y --model a/b --mode text </dev/null > o2 2> e2) & wait',
];

console.log('candidate:', JSON.stringify(inspectDispatch(candidate)));
for (const n of negatives) console.log('negative :', JSON.stringify(inspectDispatch(n)));
