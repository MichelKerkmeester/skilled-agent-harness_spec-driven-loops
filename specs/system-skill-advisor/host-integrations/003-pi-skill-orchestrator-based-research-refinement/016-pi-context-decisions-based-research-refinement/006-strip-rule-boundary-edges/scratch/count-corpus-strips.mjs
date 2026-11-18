// Counts the corpus prompts the BUILT strip rule changes, over the two JSONL
// corpus folders the first strip build counted and the harder intent corpus the
// divergence ratchet also reads. Run from the repository root after the advisor build.
// Prints one JSON line: {"jsonl":N,"jsonlChanged":[ids],"harder":N,"harderChanged":[prompts]}
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const RUNTIME = resolve('.skilled/skills/system-skill-advisor/runtime');
const { stripLeadingPastedReply } = await import(
  pathToFileURL(join(RUNTIME, 'dist/runtime/lib/prompt-policy.js')).href
);

const jsonlChanged = [];
let jsonl = 0;
for (const dir of ['scripts/routing-accuracy', 'scripts/fixtures']) {
  for (const file of readdirSync(join(RUNTIME, dir)).filter((name) => name.endsWith('.jsonl'))) {
    for (const line of readFileSync(join(RUNTIME, dir, file), 'utf8').split('\n')) {
      if (!line.trim()) continue;
      let row;
      try { row = JSON.parse(line); } catch { continue; }
      const prompt = row.prompt ?? row.text ?? row.input;
      if (typeof prompt !== 'string') continue;
      jsonl += 1;
      if (stripLeadingPastedReply(prompt) !== prompt) jsonlChanged.push(row.id ?? file);
    }
  }
}

const source = readFileSync(join(RUNTIME, 'tests/scorer/fixtures/harder-intent-prompt-corpus.ts'), 'utf8');
const marker = source.indexOf('HARDER_INTENT_PROMPT_CORPUS');
const start = source.indexOf('= [', marker);
const end = source.indexOf('\n];', start);
const harderRows = Function(`return ${source.slice(start + 2, end + 2)}`)();
const harderChanged = harderRows
  .map((row) => row.prompt)
  .filter((prompt) => stripLeadingPastedReply(prompt) !== prompt);

console.log(JSON.stringify({ jsonl, jsonlChanged, harder: harderRows.length, harderChanged }));
