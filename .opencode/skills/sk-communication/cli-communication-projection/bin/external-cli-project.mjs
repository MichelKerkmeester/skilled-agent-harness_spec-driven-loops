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

import { runExternalCliProjection } from '../dist/index.js';

const EXIT_USAGE = 2;

function usage() {
  return [
    'Usage: external-cli-project <engine> <model> [-- <target-text>]',
    '',
    'Reads the target message from stdin when no inline target text is given.',
    'Engines: claude-code, codex, cursor, devin, opencode, pi.',
    'opencode and pi expect a provider/model id.',
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

  const engine = argv[0];
  const model = argv[1];
  if (engine === undefined || model === undefined) {
    process.stderr.write(`${usage()}\n`);
    process.exit(EXIT_USAGE);
  }

  const separator = argv.indexOf('--');
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
