// Run from the repository root: node <this file>
// Planning probe for the mention reader. It builds the reader from the exact pattern
// sources the task line quotes and prints one line per case: the expected value, the
// value the patterns return and whether they agree. It reads no corpus file, starts
// nothing and writes nothing. The last line is `RESULT: <agree> of <total> agree`.

const USE = '(?:run|start|use|invoke|launch|execute|call|trigger|open|rerun|re-run|kick off)';
const GAP = "(?:[a-z']+ ){0,2}";

export const COMMAND_DECLINE_LEADS = [
  `(?:do not|don't|dont|never|not|won't|wont|no longer|cannot|can't) (?!(?:forget|hesitate|fail|mind)\\b)${GAP}${USE} ${GAP}`,
  `(?:skip|skipping|without|instead of|rather than|avoid|not) (?:(?!${USE}\\b)[a-z']+ ){0,2}`,
];

export const COMMAND_ASK_LEADS = [
  "(?:what does|what is|what's|what would|what will|what did|how does|how did|why does|why did|explain|describe|tell me what|tell me how|tell me about|tell me why|difference between|differ from|differs from|different from|undo what|ran|already ran|was running) (?:the )?(?:command )?",
  `(?:should i|should we|do i need to|when would i) ${USE} (?:the )?(?:command )?`,
  '(?:is|does|can|will|would) ',
];

function escapePhrase(phrase) {
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function commandOnlyMentioned(prompt, command) {
  const text = prompt.toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
  const name = escapePhrase(command.toLowerCase());
  return [...COMMAND_DECLINE_LEADS, ...COMMAND_ASK_LEADS].some((lead) => (
    new RegExp(`(?:^|[^a-z0-9_/])${lead}${name}(?![a-z0-9_-])`).test(text)
  ));
}

const REFUSE8 = [
  ['do not run /speckit:complete yet, just explain what it does', '/speckit:complete'],
  ['I never want to use /create:agent again, delete the agent file', '/create:agent'],
  ['someone ran /speckit:save by accident, how do I undo what it wrote', '/speckit:save'],
  ['please do not start /deep:research, I only want a two line summary of the readme', '/deep:research'],
  ['what does /create:readme do?', '/create:readme'],
  ['do not run it, just tell me what /doctor:update would change', '/doctor:update'],
  ['explain /deep:review to me', '/deep:review'],
  ['skip /create:readme, just append one line to the existing README', '/create:readme'],
];

const QUESTION2 = [
  ['is /speckit:complete overkill for a two line fix?', '/speckit:complete'],
  ['should I use /deep:research for this or just read the two files myself?', '/deep:research'],
];

const REQUEST6 = [
  ['run /speckit:complete for the rate limiter', '/speckit:complete'],
  ['/create:agent security-reviewer', '/create:agent'],
  ["don't forget to run /speckit:save", '/speckit:save'],
  ['explain the diff then run /speckit:save', '/speckit:save'],
  ['use /speckit:plan, not /speckit:complete', '/speckit:plan'],
  ['I ran /speckit:plan yesterday, now run /speckit:implement', '/speckit:implement'],
];

const CONTROL5 = [
  ['dont guess, run /speckit:plan', '/speckit:plan'],
  ['never mind just run /speckit:save', '/speckit:save'],
  ['not sure, use /create:readme', '/create:readme'],
  ['without asking, run /speckit:complete', '/speckit:complete'],
  ['can you run /speckit:plan?', '/speckit:plan'],
];

const SINGLE = [
  ['use /speckit:plan, not /speckit:complete', '/speckit:complete', true],
  ['don’t run /speckit:save', '/speckit:save', true],
  ['do not run /create:sk-skill-parent', '/create:sk-skill', false],
];

const cases = [
  ...REFUSE8.map(([prompt, command]) => ['REFUSE8', prompt, command, true]),
  ...QUESTION2.map(([prompt, command]) => ['QUESTION2', prompt, command, true]),
  ...REQUEST6.map(([prompt, command]) => ['REQUEST6', prompt, command, false]),
  ...CONTROL5.map(([prompt, command]) => ['CONTROL5', prompt, command, false]),
  ...SINGLE.map(([prompt, command, expected]) => ['SINGLE', prompt, command, expected]),
];

let agree = 0;
for (const [group, prompt, command, expected] of cases) {
  const actual = commandOnlyMentioned(prompt, command);
  if (actual === expected) agree += 1;
  console.log(`${group} expected=${expected} actual=${actual} ${actual === expected ? 'agree' : 'DIFFER'} :: ${prompt} :: ${command}`);
}
console.log(`RESULT: ${agree} of ${cases.length} agree`);
