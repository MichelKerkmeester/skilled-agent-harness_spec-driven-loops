'use strict';

// A stand-in for the vibe binary, put on PATH by the runner tests. Vibe reads
// its prompt from `--prompt-file`, prints the answer as plain text, and on
// every exit writes `export.json` into `--output-dir`, echoing the effective
// tool set under `config.enabled_tools`. This stub does the same from its own
// argv, acts on `STUB:` directive lines in the prompt, and leaves a receipt
// under $HOME.

const fs = require('node:fs');
const path = require('node:path');

if (process.argv.includes('--version')) {
  process.stdout.write('vibe 3.1.2\n');
  process.exit(0);
}

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const at = args.indexOf(flag);
  return at === -1 ? null : args[at + 1] ?? null;
};
const promptFile = valueOf('--prompt-file');
const prompt = promptFile === null ? '' : fs.readFileSync(promptFile, 'utf8');
const enabledTools = args.flatMap((arg, index) => (arg === '--enabled-tools' ? [args[index + 1]] : []));
const home = process.env.HOME || '/nonexistent';
const runId = process.env.SKILLED_BOT_RUN_ID || 'no-run-marker';

fs.mkdirSync(path.join(home, 'stub-receipts'), { recursive: true });
// Written through a rename so a test polling for the receipt never parses a half-written file.
const receiptPath = path.join(home, 'stub-receipts', `${runId}.json`);
fs.writeFileSync(`${receiptPath}.tmp`, JSON.stringify({ pid: process.pid, argv: args, cwd: process.cwd(), env: process.env, prompt }));
fs.renameSync(`${receiptPath}.tmp`, receiptPath);

const outputDir = valueOf('--output-dir');
if (outputDir !== null) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, 'export.json'),
    `${JSON.stringify({
      // A real run can exit 0 while its record says it did not finish; STUB:export-exit sets that code.
      exit_code: Number(directive('export-exit') ?? 0),
      outcome: directive('export-exit') === null ? 'finished' : 'failed',
      config: { enabled_tools: enabledTools, disabled_tools: [] },
    })}\n`,
  );
}

// Real Vibe leaves plugin package folders under its home with the write bit off;
// STUB:readonly-tree does the same so the lineage cleanup meets such a tree.
if (directive('readonly-tree') !== null && process.env.VIBE_HOME) {
  const pkg = path.join(process.env.VIBE_HOME, 'logs', 'session', 'plugins', 'packages', 'stub-plugin');
  fs.mkdirSync(path.join(pkg, 'lib'), { recursive: true });
  fs.writeFileSync(path.join(pkg, 'lib', 'index.js'), 'module.exports = {};\n');
  fs.chmodSync(path.join(pkg, 'lib'), 0o500);
  fs.chmodSync(pkg, 0o500);
}

function directive(name) {
  const line = prompt.split('\n').find((entry) => entry.startsWith(`STUB:${name}`));
  return line === undefined ? null : line.slice(`STUB:${name}`.length).replace(/^=/, '');
}

process.stdout.write('Read the notes.\n');
const decide = directive('decide');
if (decide !== null) {
  process.stdout.write(`[NEEDS-DECISION] ${decide}\n`);
  for (const entry of prompt.split('\n')) {
    if (entry.startsWith('STUB:option=')) process.stdout.write(`[OPTION] ${entry.slice('STUB:option='.length)}\n`);
  }
}
process.exit(0);
