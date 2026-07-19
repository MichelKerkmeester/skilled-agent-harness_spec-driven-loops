#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Generated Metadata Integrity Bridge
// ───────────────────────────────────────────────────────────────
// Strict-mode bridge for the generated-metadata integrity check. Validates the
// description.json and graph-metadata.json a spec folder carries through the shared
// schemas plus the path-prefix and status-enum invariants, then emits the validate.sh
// bridge protocol. Grandfather report mode keeps violations non-blocking until the
// scoped migration graduates the rule to a hard error.

import {
  checkGeneratedMetadataIntegrity,
  resolveGeneratedMetadataIntegrity,
} from '../../mcp-server/lib/validation/generated-metadata-integrity.js';
import {
  isGeneratedMetadataGrandfatherEnabled,
  isStatusCompletionConsistencyGateEnabled,
} from '../../mcp-server/lib/config/capability-flags.js';
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
        'generated-metadata-integrity: validate generated description/graph metadata',
        '',
        'Usage:',
        '  node generated-metadata-integrity.js --folder <spec-folder> [--json] [--strict]',
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
    const report = checkGeneratedMetadataIntegrity(options.folder);
    const resolved = resolveGeneratedMetadataIntegrity(report, {
      grandfather: isGeneratedMetadataGrandfatherEnabled(),
      statusCompletionConsistencyEnforced: isStatusCompletionConsistencyGateEnabled(),
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
