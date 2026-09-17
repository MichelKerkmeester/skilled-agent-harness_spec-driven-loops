#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Projection Launcher
// ───────────────────────────────────────────────────────────────────
// PURPOSE: Project a target message into plain English through a chosen
//          external CLI engine, routing the rewrite through the package's
//          privacy, fidelity, and exact-original guarantees. Projection
//          runs only while COMMUNICATION_PROJECTION_ENABLED=1 is scoped to
//          this process; otherwise the byte-exact original passes through.
// ───────────────────────────────────────────────────────────────────

import { defaultModelForEngine, runExternalCliProjection } from '../dist/index.js';

const EXIT_USAGE = 2;

function usage() {
  return [
    'Usage: external-cli-project <engine> [model] [-- <target-text>]',
    '',
    'Reads the target message from stdin when no inline target text is given.',
    'Engines: claude-code, codex, cursor, devin, opencode, pi.',
    'The model is optional for every engine except pi, which has no default and',
    'needs an explicit provider/model id; opencode also expects a provider/model id.',
  ].join('\n');
}

async function readStdin() {
  if (process.stdin.isTTY) {
    return '';
  }
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === '--help' || argv[0] === '-h') {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const separator = argv.indexOf('--');
  const positionals = separator === -1 ? argv : argv.slice(0, separator);
  const engine = positionals[0];
  if (engine === undefined) {
    process.stderr.write(`${usage()}\n`);
    process.exit(EXIT_USAGE);
  }

  const model = positionals[1] ?? defaultModelForEngine(engine);
  if (model === undefined) {
    process.stderr.write(
      `external-cli-project: engine '${engine}' needs an explicit model; it has no documented default.\n`
      + `${usage()}\n`,
    );
    process.exit(EXIT_USAGE);
  }

  const inlineText = separator === -1 ? '' : argv.slice(separator + 1).join(' ');
  const sourceText = inlineText.length > 0 ? inlineText : await readStdin();
  if (sourceText.trim().length === 0) {
    process.stderr.write(
      'external-cli-project: no target text supplied.\nSTATUS=NOOP REASON="no target text"\n',
    );
    return;
  }

  const now = new Date().toISOString();
  const result = await runExternalCliProjection({
    engine,
    modelId: model,
    sourceText,
    now,
  });

  process.stdout.write(result.text);
  if (!result.text.endsWith('\n')) {
    process.stdout.write('\n');
  }

  if (result.status === 'projection') {
    process.stderr.write(
      `external-cli-project: projected via ${engine} (mode=${result.mode}).\nSTATUS=OK\n`,
    );
  } else {
    process.stderr.write(
      `external-cli-project: exact original returned (${result.reasonCode}).\n`
      + `STATUS=OK REASON="exact-original:${result.reasonCode}"\n`,
    );
  }
}

main().catch((error) => {
  const message = error?.message ?? String(error);
  process.stderr.write(`external-cli-project: ${message}\nSTATUS=FAIL ERROR="${message}"\n`);
  process.exit(1);
});
