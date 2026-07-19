#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Generated Metadata Drift Bridge
// ───────────────────────────────────────────────────────────────
// Strict-mode bridge for the generated-metadata drift gate. Re-derives a spec folder and
// compares the stored description and causal_summary against a fresh derivation ignoring
// volatile timestamps, then emits the validate.sh bridge protocol. The gate reads and reports
// only, it never writes the folder. Grandfather report mode keeps drift non-blocking until the
// drift-gate flag graduates the gate to a hard strict failure.

import {
  checkGeneratedMetadataDrift,
  resolveGeneratedMetadataDrift,
} from '../../mcp-server/lib/graph/generated-metadata-drift.js';
import { isGeneratedMetadataDriftGateEnabled } from '../../mcp-server/lib/config/capability-flags.js';
import { isMainModule } from '../lib/esm-entry.js';

interface CliOptions {
  folder: string;
  json: boolean;
  strict: boolean;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseArgs(argv: string[]): CliOptions {
  let folder = '';
  let json = false;
  let strict = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      console.log([
        'generated-metadata-drift: report drift between stored synopsis fields and current docs',
        '',
        'Usage:',
        '  node generated-metadata-drift.js --folder <spec-folder> [--json] [--strict]',
      ].join('\n'));
      process.exit(0);
    }
    if (arg.startsWith('--folder=')) {
      folder = arg.slice('--folder='.length);
      continue;
    }
    if (arg === '--folder') {
      folder = argv[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--strict') {
      strict = true;
      continue;
    }
    if (!arg.startsWith('-') && !folder) {
      folder = arg;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!folder) {
    throw new Error('--folder is required');
  }

  return { folder, json, strict };
}

function runCli(): void {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = checkGeneratedMetadataDrift(options.folder);
    // Flag off keeps the gate in grandfather report mode, flag on enforces the verdict.
    const resolved = resolveGeneratedMetadataDrift(report, {
      grandfather: !isGeneratedMetadataDriftGateEnabled(),
    });

    if (options.json) {
      process.stdout.write(`${JSON.stringify({ report, resolved }, null, 2)}\n`);
    } else {
      // validate.sh maps an 'error' status to a hard failure, so emit it as 'fail'.
      const bridgeStatus = resolved.status === 'error' ? 'fail' : resolved.status;
      process.stdout.write(`rule\t${resolved.rule}\n`);
      process.stdout.write(`status\t${bridgeStatus}\n`);
      process.stdout.write(`message\t${resolved.message}\n`);
      for (const detail of resolved.details) {
        process.stdout.write(`detail\t${detail}\n`);
      }
    }

    if (resolved.status === 'error' && options.strict) {
      process.exit(1);
    }
  } catch (error: unknown) {
    process.stderr.write(`${toErrorMessage(error)}\n`);
    process.exit(2);
  }
}

if (isMainModule(import.meta.url)) {
  runCli();
}
