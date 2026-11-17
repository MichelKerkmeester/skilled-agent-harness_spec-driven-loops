// Run from the repository root: node <this file>
// Backfills a one-line run log whose locator names a scratch folder holding a fake
// advisor CLI and a fake prompt hook at the paths the backfill runs, and prints
// whether either fake ran. Builds and removes its own temporary folders.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
const { backfillRunLog } = await import(resolve('.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs'));
const fake = mkdtempSync(join(tmpdir(), 'probe-fake-checkout-'));
const logs = mkdtempSync(join(tmpdir(), 'probe-backfill-logs-'));
try {
  const cli = join(fake, '.skilled/bin/skill-advisor.cjs');
  const hook = join(fake, '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js');
  mkdirSync(dirname(cli), { recursive: true });
  mkdirSync(dirname(hook), { recursive: true });
  writeFileSync(cli, `require('node:fs').writeFileSync(${JSON.stringify(join(fake, 'ran-cli'))}, 'ran');\n`);
  writeFileSync(hook, `require('node:fs').writeFileSync(${JSON.stringify(join(fake, 'ran-hook'))}, 'ran');\nprocess.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: 'Advisor: live; use sk-doc' } }));\n`);
  const inPath = join(logs, 'runs.jsonl');
  writeFileSync(inPath, `${JSON.stringify({ runtime: 'claude', rowId: 'row-one', arm: 'pre', locator: { projectDir: fake }, exit: 0, changedPaths: [] })}\n`);
  const outPath = join(logs, 'runs-out.jsonl');
  const result = await backfillRunLog({ inPath, outPath, promptFor: () => 'probe prompt', brief: async () => 'unknown' });
  console.log(`backfill result: ${JSON.stringify(result.ok)} lines ${result.lines}`);
  console.log(`fake CLI ran: ${existsSync(join(fake, 'ran-cli'))}, fake hook ran: ${existsSync(join(fake, 'ran-hook'))}`);
  const [line] = readFileSync(outPath, 'utf8').trim().split('\n').map((text) => JSON.parse(text));
  console.log(`offerError: ${JSON.stringify(line.offerError)}`);
} finally {
  rmSync(fake, { recursive: true, force: true });
  rmSync(logs, { recursive: true, force: true });
}
