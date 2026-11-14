// Runs the real backfillRunLog with an injected replay that reports a partner-side
// offer, then prints whether the written line keeps offeredAs. Usage: node offeredas-backfill.mjs <tmpdir>
import fs from 'node:fs';
import { join } from 'node:path';
const RAD = '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
const { backfillRunLog, parseOffer } = await import(join(RAD, 'command-offer.mjs'));
const tmp = process.argv[2];
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
const head = 'Advisor: live; ambiguous: sk-code 0.95/0.12 vs sk-doc → /create:manual-testing-playbook (start) 0.82/0.12 pass.';
console.log('parseOffer', JSON.stringify(parseOffer(head)));
const inPath = join(tmp, 'in.jsonl');
fs.writeFileSync(inPath, JSON.stringify({ runtime: 'claude', rowId: 'made-up-row', arm: 'post', exit: 0, locator: { projectDir: tmp } }) + '\n');
const result = await backfillRunLog({
  inPath,
  outPath: join(tmp, 'out.jsonl'),
  promptFor: () => 'made up',
  replay: async () => ({ ...parseOffer(head), offerError: null }),
  brief: async () => true,
  trusted: () => true,
  warm: async () => {},
});
const written = JSON.parse(fs.readFileSync(join(tmp, 'out.jsonl'), 'utf8'));
console.log('backfill', result.ok, 'keys', JSON.stringify(Object.keys(written)), 'offeredAs' in written ? 'HAS offeredAs' : 'NO offeredAs');
