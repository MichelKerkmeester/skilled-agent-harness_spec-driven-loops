// Reports, by row id only, which mention rule reads each listed row as a mention.
// It prints booleans and counts, never prompt text.
import { readFileSync } from 'node:fs';
const m = await import(process.argv[2]);
const ids = new Set(process.argv[4].split(','));
const rows = readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => ids.has(r.id));
const USE = m.COMMAND_USE_VERB;
const declined = new RegExp(`(?:^|[,.;!?\\n]|\\b(?:but|and|so|though)\\b) *(?:(?:please|just|then|still) )*(?:do not|don't|dont|never)(?: (?:actually|really|yet|ever|even))? ${USE} it\\b`);
const asDoc = /^(?: command)?(?:'s)? (?:doc|docs|document|documentation|file|page|source|definition|markdown)\b/;
for (const r of rows) {
  const cmd = r.expected_command;
  const t = r.prompt.toLowerCase();
  const name = cmd.toLowerCase().replace(/[/:]/g, (c) => '\\' + c);
  const occ = [...t.matchAll(new RegExp(`(?:^|[^a-z0-9_/])${name}(?![a-z0-9_-]|[./][a-z0-9])`, 'g'))];
  const tails = occ.map((o) => t.slice((o.index ?? 0) + o[0].length));
  console.log(JSON.stringify({
    id: r.id, mentionedNow: m.commandOnlyMentioned(r.prompt, cmd), occurrences: occ.length,
    asDocument: tails.map((x) => asDoc.test(x)), declinedAfter: tails.map((x) => declined.test(x)),
    marks: { brackets: /[\[\]]/.test(t), parens: /[()]/.test(t), tilde: /~/.test(t), codeTag: /<\/?code>/.test(t) },
  }));
}
