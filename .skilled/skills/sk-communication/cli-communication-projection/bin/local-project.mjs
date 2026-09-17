#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Local Provider Projection Launcher
// ───────────────────────────────────────────────────────────────────
// PURPOSE: Project a target message into plain English through the configured
//          local provider, routing the rewrite through the package's privacy,
//          fidelity, and exact-original guarantees. Projection runs only while
//          COMMUNICATION_PROJECTION_ENABLED=1 is scoped to this process;
//          otherwise the byte-exact original passes through. Unlike the wrapper
//          launcher, this rewrites a static piece of target text rather than a
//          live CLI capture.
// ───────────────────────────────────────────────────────────────────

import { loadLocalProjectionConfig, runLocalProjection } from '../dist/index.js';

function usage() {
  return [
    'Usage: local-project [-- <target-text>]',
    '',
    'Reads the target message from stdin when no inline target text is given.',
    'Requires a localProvider block in enablement.local.json.',
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
  const inlineText = separator === -1 ? '' : argv.slice(separator + 1).join(' ');
  const sourceText = inlineText.length > 0 ? inlineText : await readStdin();
  if (sourceText.trim().length === 0) {
    process.stderr.write(
      'local-project: no target text supplied.\nSTATUS=NOOP REASON="no target text"\n',
    );
    return;
  }

  const config = loadLocalProjectionConfig();
  if (config === null) {
    process.stderr.write(
      'local-project: no local provider configured. Add a localProvider block '
      + '(type, model, baseUrl) to enablement.local.json to enable local projection.\n'
      + 'STATUS=FAIL ERROR="local provider not configured"\n',
    );
    process.exit(1);
  }

  const now = new Date().toISOString();
  const result = await runLocalProjection({ config, sourceText, now });

  process.stdout.write(result.text);
  if (!result.text.endsWith('\n')) {
    process.stdout.write('\n');
  }

  if (result.status === 'projection') {
    process.stderr.write(
      `local-project: projected via local provider (mode=${result.mode}).\nSTATUS=OK\n`,
    );
  } else {
    process.stderr.write(
      `local-project: exact original returned (${result.reasonCode}).\n`
      + `STATUS=OK REASON="exact-original:${result.reasonCode}"\n`,
    );
  }
}

main().catch((error) => {
  const message = error?.message ?? String(error);
  process.stderr.write(`local-project: ${message}\nSTATUS=FAIL ERROR="${message}"\n`);
  process.exit(1);
});
