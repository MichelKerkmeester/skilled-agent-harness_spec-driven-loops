// Run from the repository root:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Planning probe for the mention reader. For each case it prints the expected value,
// the value the shipped `commandOnlyMentioned` returns and the value a copy of that
// function returns with the five planned edits. It reads no corpus file, starts nothing
// and writes nothing. The last two lines count agreement for the shipped and the
// planned reader.
import { commandOnlyMentioned } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';

const USE = '(?:run|start|use|invoke|launch|execute|call|trigger|open|rerun|re-run|kick off)';
const GAP = "(?:[a-z']+ ){0,2}";
// Planned edit 1: `why not` suggests the command, so `not` after `why` is no refusal.
const NOT = '(?<!\\bwhy )not';
// Planned edit 2: three more refusal leads before a use verb.
// Planned edit 3: `stop`, `stopped` and `quit` before a gap word such as `using`.
const DECLINE = [
  `(?:do not|don't|dont|never|${NOT}|won't|wont|no longer|cannot|can't|no need to|need not|needn't) (?!(?:forget|hesitate|fail|mind)\\b)${GAP}${USE} ${GAP}`,
  `(?:skip|skipping|without|instead of|rather than|avoid|stop|stopped|quit|${NOT}) (?:(?!${USE}\\b)[a-z']+ ){0,2}`,
];
const ASK = [
  "(?:what does|what is|what's|what would|what will|what did|how does|how did|why does|why did|explain|describe|tell me what|tell me how|tell me about|tell me why|difference between|differ from|differs from|different from|undo what|ran|already ran|was running) (?:the )?(?:command )?",
  `(?:should i|should we|do i need to|when would i) ${USE} (?:the )?(?:command )?`,
];
const BARE = '(?:is|does|can|will|would) ';
// Planned edit 4: a later clause that opens with a use verb and `it` asks for the
// command the earlier clause only named.
const ASKED_BY_PRONOUN = new RegExp(`(?:^|[,.;!?\\n]) *(?:(?:and|then|so|please|now|just|go ahead and) )*${USE} it\\b`);

function escapePhrase(phrase: string): string {
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function planned(prompt: string, command: string): boolean {
  const text = prompt
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n\s*/g, '\n');
  const name = escapePhrase(command.toLowerCase());
  const occurrences = [...text.matchAll(new RegExp(`(?:^|[^a-z0-9_/])${name}(?![a-z0-9_-])`, 'g'))];
  if (occurrences.length === 0) return false;
  return occurrences.every((occurrence) => {
    const nameEnd = (occurrence.index ?? 0) + occurrence[0].length;
    const before = text.slice(0, nameEnd);
    const tail = text.slice(nameEnd);
    if (ASKED_BY_PRONOUN.test(tail)) return false;
    const led = [...DECLINE, ...ASK].some((lead) => (
      new RegExp(`(?:^|[^a-z0-9_/])${lead}${name}$`).test(before)
    ));
    if (led) return true;
    const bareLead = new RegExp(`(?:^|[^a-z0-9_/])${BARE}${name}$`).test(before);
    if (!bareLead) return false;
    const sentenceEnd = tail.search(/[.!\n]/);
    const sentence = sentenceEnd === -1 ? tail : tail.slice(0, sentenceEnd);
    // Planned edit 5: a question mark ends the sentence before the bare lead.
    return sentence.includes('?')
      || new RegExp(`(?:^|[.!?\\n] *)${BARE}${name}$`).test(before);
  });
}

type Case = readonly [group: string, prompt: string, command: string, expected: boolean];

// Every case the shipped test file pins, with the value it pins.
const SHIPPED: readonly Case[] = [
  ['REFUSE8', 'do not run /speckit:complete yet, just explain what it does', '/speckit:complete', true],
  ['REFUSE8', 'I never want to use /create:agent again, delete the agent file', '/create:agent', true],
  ['REFUSE8', 'someone ran /speckit:save by accident, how do I undo what it wrote', '/speckit:save', true],
  ['REFUSE8', 'please do not start /deep:research, I only want a two line summary of the readme', '/deep:research', true],
  ['REFUSE8', 'what does /create:readme do?', '/create:readme', true],
  ['REFUSE8', 'do not run it, just tell me what /doctor:update would change', '/doctor:update', true],
  ['REFUSE8', 'explain /deep:review to me', '/deep:review', true],
  ['REFUSE8', 'skip /create:readme, just append one line to the existing README', '/create:readme', true],
  ['QUESTION2', 'is /speckit:complete overkill for a two line fix?', '/speckit:complete', true],
  ['QUESTION2', 'should I use /deep:research for this or just read the two files myself?', '/deep:research', true],
  ['REQUEST6', 'run /speckit:complete for the rate limiter', '/speckit:complete', false],
  ['REQUEST6', '/create:agent security-reviewer', '/create:agent', false],
  ['REQUEST6', "don't forget to run /speckit:save", '/speckit:save', false],
  ['REQUEST6', 'explain the diff then run /speckit:save', '/speckit:save', false],
  ['REQUEST6', 'use /speckit:plan, not /speckit:complete', '/speckit:plan', false],
  ['REQUEST6', 'I ran /speckit:plan yesterday, now run /speckit:implement', '/speckit:implement', false],
  ['CONTROL5', 'dont guess, run /speckit:plan', '/speckit:plan', false],
  ['CONTROL5', 'never mind just run /speckit:save', '/speckit:save', false],
  ['CONTROL5', 'not sure, use /create:readme', '/create:readme', false],
  ['CONTROL5', 'without asking, run /speckit:complete', '/speckit:complete', false],
  ['CONTROL5', 'can you run /speckit:plan?', '/speckit:plan', false],
  ['BARE4', 'the next step is /speckit:implement', '/speckit:implement', false],
  ['BARE4', 'the next step is /speckit:implement\nany questions?', '/speckit:implement', false],
  ['BARE4', 'what does /speckit:save do? ok now run /speckit:save', '/speckit:save', false],
  ['BARE4', 'the plan is /speckit:plan then tests', '/speckit:plan', false],
  ['OPEN4', 'is /speckit:resume safe to run twice', '/speckit:resume', true],
  ['OPEN4', 'does /doctor:git change files or just report problems', '/doctor:git', true],
  ['OPEN4', 'can /prompt:improve make a vague request easier to follow', '/prompt:improve', true],
  ['OPEN4', 'ok. is /speckit:plan enough here', '/speckit:plan', true],
  ['SINGLE3', 'use /speckit:plan, not /speckit:complete', '/speckit:complete', true],
  ['SINGLE3', 'don’t run /speckit:save', '/speckit:save', true],
  ['SINGLE3', 'do not run /create:sk-skill-parent', '/create:sk-skill', false],
];

// The prompts of the review of 2026-11-14 and the controls each planned edit needs.
const REVIEW: readonly Case[] = [
  ['REFUSAL2', 'no need to run /doctor:setup, the hooks are fine', '/doctor:setup', true],
  ['REFUSAL2', 'stop using /create:changelog for this, write the changelog entry by hand', '/create:changelog', true],
  ['REQUEST3', 'I have not run /speckit:plan yet, please start it for the login feature', '/speckit:plan', false],
  ['REQUEST3', 'I already ran /create:readme but the output was wrong, run it again for the hooks folder', '/create:readme', false],
  ['REQUEST3', 'why not use /create:agent for this? go ahead and make a security reviewer agent', '/create:agent', false],
  ['QMARK1', 'quick question? is /speckit:resume safe to run twice', '/speckit:resume', true],
  ['GUARD8', 'do not run /speckit:complete, run /speckit:plan for the rate limiter instead', '/speckit:plan', false],
  ['GUARD8', 'do not run /speckit:complete, run /speckit:plan for the rate limiter instead', '/speckit:complete', true],
  ['GUARD8', 'do not run /speckit:complete, I will run it myself later', '/speckit:complete', true],
  ['GUARD8', 'do not use /create:agent, use that other one', '/create:agent', true],
  ['GUARD8', 'stop and run /speckit:plan', '/speckit:plan', false],
  ['GUARD8', 'no need to ask, run /speckit:save', '/speckit:save', false],
  ['GUARD8', 'is this right? run /speckit:plan', '/speckit:plan', false],
  ['GUARD8', 'I do not just run it, I read what /speckit:complete does first', '/speckit:complete', false],
];

let shippedAgree = 0;
let plannedAgree = 0;
const cases = [...SHIPPED, ...REVIEW];
for (const [group, prompt, command, expected] of cases) {
  const shipped = commandOnlyMentioned(prompt, command);
  const next = planned(prompt, command);
  if (shipped === expected) shippedAgree += 1;
  if (next === expected) plannedAgree += 1;
  console.log(`${group} expected=${expected} shipped=${shipped} planned=${next} :: ${prompt.replace(/\n/g, '\\n')} :: ${command}`);
}
console.log(`SHIPPED: ${shippedAgree} of ${cases.length} agree`);
console.log(`PLANNED: ${plannedAgree} of ${cases.length} agree`);
