// Run from the repository root: node <this file> [--top-only] [--file <prompts.json>]
// Sends each prompt to the advisor CLI and prints one line per recommendation row:
// skill id, confidence, uncertainty, command, policy, owner skill and the ambiguous flag.
// --top-only sends {"compiledRouteTopOnly":true}, the option shape the Claude hook uses.
// It starts no daemon and no model session. A prompt file is a JSON array of strings.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const topOnly = args.includes('--top-only');
const fileIndex = args.indexOf('--file');
const file = fileIndex === -1 ? join(here, 'offer-prompts.json') : args[fileIndex + 1];
const prompts = JSON.parse(readFileSync(file, 'utf8'));

for (const prompt of prompts) {
  const request = { prompt, ...(topOnly ? { options: { compiledRouteTopOnly: true } } : {}) };
  let data;
  try {
    const stdout = execFileSync(
      'node',
      ['.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json', JSON.stringify(request), '--format', 'json'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    data = JSON.parse(stdout).data;
  } catch (error) {
    console.log(`PROMPT: ${prompt}\n  error: ${String(error.message).split('\n')[0]}`);
    continue;
  }
  console.log(`PROMPT: ${prompt}`);
  const rows = data.recommendations ?? [];
  if (rows.length === 0) console.log('  (no recommendation)');
  rows.forEach((row, index) => {
    console.log(
      `  row ${index}: ${row.skillId} ${row.confidence}/${row.uncertainty} command=${row.command ?? '-'} policy=${row.policy ?? '-'} owner=${row.ownerSkillId ?? '-'} ambiguous=${data.ambiguous}`,
    );
  });
}
