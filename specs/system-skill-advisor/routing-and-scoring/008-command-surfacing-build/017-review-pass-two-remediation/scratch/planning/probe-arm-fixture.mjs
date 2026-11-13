// Run from the repository root: node <this file>
// Asks the runner which arm a row picked by id runs under, and compares the fixture
// a run put into a started-command prompt with the one its backfill replays. Uses
// the runner's exported armFor and lineFixture when they exist and evaluates the
// source of the private versions otherwise. Reads files only and starts no turn.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const R = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs';
const source = readFileSync(R, 'utf8');
const runner = await import(resolve(R));
const { G2_ROWS } = runner;
const body = (name) => new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`).exec(source)[0];
console.log(`armFor exported: ${typeof runner.armFor === 'function'}`);
let armOf;
if (typeof runner.armFor === 'function') {
  armOf = (set, rowIds) => {
    try {
      return runner.armFor({ arm: null, set }, rowIds);
    } catch (error) {
      return `refused ${error.code}`;
    }
  };
} else {
  const legacy = new Function(`const G2_SET = 'g2'; const DEFAULT_ARM = 'pre'; ${body('armFor')}; return armFor;`)();
  armOf = (set, rowIds) => legacy({ arm: null, set, rowIds });
}
console.log(`--row-id g2-deep-review-ask -> arm ${armOf(null, ['g2-deep-review-ask'])}`);
console.log(`--set g2 -> arm ${armOf('g2', G2_ROWS.map((row) => row.id))}`);
console.log(`--row-id g2-deep-review-ask --row-id cmd-x -> arm ${armOf(null, ['g2-deep-review-ask', 'cmd-x'])}`);
const fixtureDir = new Function('resolve', 'dirname', `const G2_FIXTURE_DIRNAME = 'g2-fixture'; ${body('fixtureDir')}; return fixtureDir;`)(resolve, dirname);
const runFixture = fixtureDir({ fixture: '/custom/fixture', out: '/runs/arm/runs.jsonl' });
const defaultLine = /async function backfillLog\(options\) \{\n\s*(const fixture = [^\n]+)/.exec(source)?.[1];
const fallback = defaultLine
  ? new Function('resolve', 'dirname', 'options', `const G2_FIXTURE_DIRNAME = 'g2-fixture'; ${defaultLine}; return fixture;`)(resolve, dirname, { backfill: '/runs/arm/runs.jsonl' })
  : resolve(dirname('/runs/arm/runs.jsonl'), 'g2-fixture');
const replayed = typeof runner.lineFixture === 'function'
  ? runner.lineFixture({ fixture: runFixture }, fallback)
  : fallback;
const template = G2_ROWS.find((row) => row.id === 'g2-deep-review-ask').prompt;
console.log(`run with --fixture /custom/fixture puts in the prompt: ${template.split('{fixture}').join(runFixture)}`);
console.log(`its backfill replays: ${template.split('{fixture}').join(replayed)}`);
const lineBlock = /const line = \{([\s\S]*?)\};/.exec(source)[1];
console.log(`run line keys: ${JSON.stringify(lineBlock.match(/^\s*(\w+)/gm).map((key) => key.trim()))}`);
console.log(`run line records the fixture: ${/\bfixture\b/.test(lineBlock)}`);
