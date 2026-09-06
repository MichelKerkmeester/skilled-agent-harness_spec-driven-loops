// Assigns every scanned file a disposition from a single ordered rule list, so the inventory is
// regenerated rather than hand-maintained. The first matching rule wins, and the final rule is a
// catch-all that fails loudly: an unclassified file is the failure this whole pass exists to prevent.
import { readFileSync } from 'node:fs';

const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').slice(1).map(l => {
  const [path, bytes, cls, lines, han, punct] = l.split('\t');
  return { path, bytes: +bytes, cls, lines: +lines || 0, han: +han || 0, punct: +punct || 0 };
});

const RULES = [
  [r => /^docs\/assets\/reports\/report-\d\d\.png$/.test(r.path), 'port',
   'Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html'],
  [r => r.cls === 'binary', 'drop',
   'Preview imagery referenced only from the GitHub README surfaces, which do not cross over'],
  [r => r.path === 'LICENSE', 'port',
   'The Notices clause requires the terms to travel with any part of the software'],
  [r => r.path === '.gitignore', 'drop',
   'Ignore rules for a standalone repository root. This repository has its own'],
  [r => r.path === 'agents/openai.yaml', 'port',
   'Required by scripts/validate.mjs, and inert in this runtime but too small to be worth diverging over'],
  [r => r.path === 'SKILL.md', 'adapt',
   'Becomes the packet SKILL.md under the create-skill template, and carries the largest translation load'],
  [r => r.path === 'README.md', 'drop',
   'Chinese twin of README.en.md. Keeping both would duplicate content the adoption wants in one language'],
  [r => r.path === 'README.en.md', 'adapt',
   'Source of fact for the packet README, but rewritten to the readme template and stripped of dead image references'],
  [r => r.path === 'catalog.md' || r.path === 'report-catalog.md', 'adapt',
   'The lookup index the workflow depends on. It needs translation and re-pathing to the packet layout'],
  [r => r.path === 'THIRD_PARTY_NOTICES.md', 'translate',
   'Names the runtime dependencies and their licences, so it has to survive and has to be readable'],
  [r => /README\.md$/.test(r.path), 'translate',
   'Folder-level guidance that ports structurally unchanged once the prose is English'],
  [r => r.path === 'color-presets.js' || r.path === 'mono-tokens.js', 'translate',
   'Block comments and the cn display-name field are Chinese. The name field is already the latin id, so behaviour is unaffected'],
  [r => /^scripts\//.test(r.path), 'adapt',
   'Path assumptions and Chinese comments both change. Smoke additionally needs a global Playwright install'],
  [r => r.cls === 'text' && r.han === 0, 'port',
   'No Chinese content and no repository-specific assumption to rewrite'],
  [r => r.cls === 'text' && r.han > 0, 'translate',
   'Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged'],
];

const out = rows.map(r => {
  for (const [test, disposition, reason] of RULES) if (test(r)) return { ...r, disposition, reason };
  return { ...r, disposition: 'UNCLASSIFIED', reason: 'No rule matched' };
});

const unclassified = out.filter(r => r.disposition === 'UNCLASSIFIED');
if (unclassified.length) {
  console.error('UNCLASSIFIED:', unclassified.map(r => r.path).join(', '));
  process.exit(1);
}

console.log(['path', 'bytes', 'class', 'lines', 'han', 'punct', 'disposition', 'reason'].join('\t'));
for (const r of out) console.log([r.path, r.bytes, r.cls, r.lines, r.han, r.punct, r.disposition, r.reason].join('\t'));

const tally = {};
for (const r of out) { tally[r.disposition] = tally[r.disposition] || { n: 0, bytes: 0 }; tally[r.disposition].n++; tally[r.disposition].bytes += r.bytes; }
console.error('total=' + out.length);
for (const [k, v] of Object.entries(tally).sort()) console.error(`${k}: files=${v.n} bytes=${v.bytes}`);
