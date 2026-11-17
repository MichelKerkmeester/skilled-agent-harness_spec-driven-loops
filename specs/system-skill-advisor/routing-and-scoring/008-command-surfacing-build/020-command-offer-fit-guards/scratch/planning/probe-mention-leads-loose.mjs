// Run from the repository root: node <this file>
// Negative control for probe-mention-leads.mjs. It reads the lead gap the way the
// first task wording allowed, "at most two words" with a word as any run of
// non-space characters and no barred idiom, and prints what the four request
// controls return. A `true` here is a request the loose reading would withhold.
const USE = '(?:run|start|use|invoke|launch|execute|call|trigger|open|rerun|re-run|kick off)';
const LOOSE_GAP = '(?:\\S+ ){0,2}';
const leads = [
  `(?:do not|don't|dont|never|not|won't|wont|no longer|cannot|can't) (?!(?:forget|hesitate|fail)\\b)${LOOSE_GAP}${USE} ${LOOSE_GAP}`,
  `(?:skip|skipping|without|instead of|rather than|avoid|not) ${LOOSE_GAP}`,
];
const escapePhrase = (phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const mentioned = (prompt, command) => leads.some((lead) => (
  new RegExp(`(?:^|[^a-z0-9_/])${lead}${escapePhrase(command)}(?![a-z0-9_-])`).test(prompt.toLowerCase())
));
for (const [prompt, command] of [
  ['dont guess, run /speckit:plan', '/speckit:plan'],
  ['never mind just run /speckit:save', '/speckit:save'],
  ['not sure, use /create:readme', '/create:readme'],
  ['without asking, run /speckit:complete', '/speckit:complete'],
]) {
  console.log(`loose reading returns ${mentioned(prompt, command)} :: ${prompt}`);
}
