import { readFileSync } from 'node:fs';
import { shouldDenyPiDispatch } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/dispatch-preflight-lint.ts';

const userText = readFileSync('/tmp/last-user-msg.txt', 'utf8');
const D = 'specs/system-deep-loop/036-deep-loop-innovation/scratch/merge-041-050';
const command = [
  'env SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true',
  'pi -p @' + D + '/prompts/prompt-w1a.md',
  '--model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline',
  '--tools read,grep,find,ls --no-extensions --no-skills --no-prompt-templates',
  '</dev/null > ' + D + '/census-w1a.out 2> ' + D + '/census-w1a.err',
].join(' ');

const denied = shouldDenyPiDispatch({
  runtime: 'pi',
  toolName: 'bash',
  command,
  dispatchSkill: 'cli-pi',
  inspectedExecutor: 'cli-pi',
  inspectionKind: 'direct',
  userText,
});

console.log(JSON.stringify({ denied, userTextLen: userText.length }));
console.log('contains [user]:', userText.includes('[user]'));
console.log('contains Advisor::', userText.includes('\n\nAdvisor:'));
console.log('contains SPEC FOLDER QUESTION:', userText.includes('SPEC FOLDER QUESTION:'));
