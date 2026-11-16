import { readFileSync } from 'node:fs';
const m = await import(process.argv[2]);
const rows = readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.id === 'sv-06' || r.id === 'sv-08');
for (const r of rows) {
  const t = r.prompt.toLowerCase().replace(/`/g, '').replace(/[^\S\n]+/g, ' ');
  const name = r.expected_command.replace(/[/:]/g, (c) => '\\' + c);
  const occ = [...t.matchAll(new RegExp(`(?:^|[^a-z0-9_/])${name}(?![a-z0-9_-])`, 'g'))];
  const out = occ.map((o) => {
    const before = t.slice(0, (o.index ?? 0) + o[0].length);
    const dec = m.COMMAND_DECLINE_LEADS.map((l, i) => new RegExp(`(?:^|[^a-z0-9_/])${l}${name}$`).test(before) ? i : -1).filter((i) => i >= 0);
    const ask = m.COMMAND_ASK_LEADS.map((l, i) => new RegExp(`(?:^|[^a-z0-9_/])${l}${name}$`).test(before) ? i : -1).filter((i) => i >= 0);
    const bare = new RegExp(`(?:^|[^a-z0-9_/])${m.COMMAND_BARE_ASK_LEAD}${name}$`).test(before);
    return { dec, ask, bare };
  });
  console.log(JSON.stringify({ id: r.id, occurrences: occ.length, mentionedNow: m.commandOnlyMentioned(r.prompt, r.expected_command), out }));
}
