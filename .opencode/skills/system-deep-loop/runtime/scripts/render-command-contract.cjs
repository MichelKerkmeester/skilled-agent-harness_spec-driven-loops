#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  canonicalizeCommand,
  resolveInjectionMode,
} = require('../../shared/rollout/resolve-injection-mode.cjs');
const { checkCommand } = require('./check-contract-drift.cjs');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const MANIFEST_PATH = '.opencode/commands/deep/assets/compiled/manifest.jsonl';

const COMMANDS = {
  'deep/ai-council': {
    slug: 'deep_ai-council',
    legacyBodyPath: '.opencode/commands/deep/assets/legacy/deep_ai-council.body.md',
    compiledContractPath: '.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md',
  },
  'deep/review': {
    slug: 'deep_review',
    legacyBodyPath: '.opencode/commands/deep/assets/legacy/deep_review.body.md',
    compiledContractPath: '.opencode/commands/deep/assets/compiled/deep_review.contract.md',
  },
  'deep/research': {
    slug: 'deep_research',
    legacyBodyPath: '.opencode/commands/deep/assets/legacy/deep_research.body.md',
    compiledContractPath: '.opencode/commands/deep/assets/compiled/deep_research.contract.md',
  },
};

function absolutePath(sourcePath) {
  return path.resolve(WORKSPACE_ROOT, sourcePath);
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function readBuffer(sourcePath) {
  return fs.readFileSync(absolutePath(sourcePath));
}

function getCommandDefinition(command) {
  const canonicalCommand = canonicalizeCommand(command);
  const definition = COMMANDS[canonicalCommand];
  if (!definition) {
    const supported = Object.keys(COMMANDS).join(', ');
    throw new Error(`Unsupported command ${command}. Supported commands: ${supported}`);
  }
  return { command: canonicalCommand, ...definition };
}

function passthroughArgsText(argv) {
  if (argv.length === 0) return '';
  if (argv.length === 1) return argv[0];
  return argv.join(' ');
}

function resolveMode(command) {
  return resolveInjectionMode(command);
}

function assertCompiledContractFresh(definition, check = checkCommand) {
  const drift = check(definition.command);
  if (drift.failures.length > 0) {
    const classes = [...new Set(drift.failures.map((failure) => failure.class))].join(', ');
    throw new Error(
      `Refusing stale compiled contract for ${definition.command}: ${classes}. `
        + 'Re-run compile-command-contracts.cjs --write.',
    );
  }
}

function renderPayload(definition, mode) {
  const legacyBody = readBuffer(definition.legacyBodyPath);

  if (mode === 'fallback') return legacyBody;
  if (mode === 'fix') {
    assertCompiledContractFresh(definition);
    const compiledContract = readBuffer(definition.compiledContractPath);
    return Buffer.concat([compiledContract, legacyBody]);
  }
  throw new Error(`Unsupported injection mode ${mode} for ${definition.command}`);
}

// The command reaches the executor as rendered markdown; the raw invocation message
// (target, :auto suffix, spec_folder, topic, flags) arrives only via this prelude's
// argv and must be echoed back, or the model never sees it and re-asks for setup.
// This mirrors the memory-search command's ARGS_PRESENT/QUERY surface.
function buildInvocationPrefix(argsText) {
  const present = argsText.trim().length > 0;
  const lines = [
    '<!-- INVOCATION MESSAGE (the user input for this run) -->',
    `ARGS_PRESENT=${present}`,
  ];
  if (present) {
    lines.push('MESSAGE:', argsText, '');
    lines.push(
      'Bind setup from the MESSAGE above — the target, the `:auto`/`:confirm` suffix, `--spec-folder`, the research topic, and other flags are there. When ARGS_PRESENT=true you MUST proceed on that MESSAGE now: do NOT ask the setup question, and do NOT treat a populated MESSAGE as empty.',
    );
  } else {
    lines.push('MESSAGE: (none supplied)', '');
    lines.push('ARGS_PRESENT=false: no invocation message was supplied; follow the command body below for setup routing.');
  }
  lines.push('', '<!-- END INVOCATION MESSAGE -->', '');
  return Buffer.from(lines.join('\n'), 'utf8');
}

function buildManifestRow(definition, mode, argsText, output) {
  const legacyBody = readBuffer(definition.legacyBodyPath);
  const compiledContract = readBuffer(definition.compiledContractPath);
  return {
    command: definition.command,
    mode,
    argsSha256: sha256(Buffer.from(argsText, 'utf8')),
    legacyBodySha256: sha256(legacyBody),
    compiledContractSha256: sha256(compiledContract),
    renderedSha256: sha256(output),
  };
}

function appendManifestRow(row, manifestPath = absolutePath(MANIFEST_PATH)) {
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.appendFileSync(manifestPath, `${JSON.stringify(row)}\n`, 'utf8');
}

function renderCommandContract(command, options = {}) {
  const definition = getCommandDefinition(command);
  const mode = resolveMode(definition.command);
  const argsText = options.argsText ?? '';
  const body = renderPayload(definition, mode);
  const prefix = buildInvocationPrefix(argsText);
  const output = Buffer.concat([prefix, body]);
  const manifestRow = buildManifestRow(definition, mode, argsText, output);

  if (options.writeManifest !== false) {
    appendManifestRow(manifestRow, options.manifestPath ? path.resolve(options.manifestPath) : undefined);
  }

  return { command: definition.command, mode, output, body, prefix, manifestRow };
}

function firstByteDiff(left, right) {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) {
      return {
        offset: index,
        expected: right[index],
        actual: left[index],
      };
    }
  }
  if (left.length !== right.length) {
    return {
      offset: length,
      expected: right.length > length ? right[length] : null,
      actual: left.length > length ? left[length] : null,
    };
  }
  return null;
}

function compareFallback(command) {
  const definition = getCommandDefinition(command);
  const rendered = renderPayload(definition, 'fallback');
  const legacyBody = readBuffer(definition.legacyBodyPath);
  const equal = rendered.equals(legacyBody);
  return {
    command: definition.command,
    equal,
    renderedLength: rendered.length,
    legacyBodyLength: legacyBody.length,
    diff: equal ? null : firstByteDiff(rendered, legacyBody),
  };
}

function parseArgs(argv) {
  const args = { compare: false, passthroughArgs: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--') {
      args.passthroughArgs = argv.slice(index + 1);
      return args;
    }
    if (token === '--command') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error('--command requires a value');
      args.command = value;
      index += 1;
      continue;
    }
    if (token === '--compare') {
      args.compare = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write('Usage: node render-command-contract.cjs --command deep/ai-council|deep/review|deep/research [--compare] -- [arguments]\n');
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.command) throw new Error('--command is required');

  if (args.compare) {
    const comparison = compareFallback(args.command);
    if (!comparison.equal) {
      process.stderr.write(`${JSON.stringify(comparison)}\n`);
      process.exit(2);
    }
    process.stdout.write(`COMPARE OK command=${comparison.command} bytes=${comparison.renderedLength}\n`);
    return;
  }

  const result = renderCommandContract(args.command, {
    argsText: passthroughArgsText(args.passthroughArgs),
  });
  process.stdout.write(result.output);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

module.exports = {
  COMMANDS,
  MANIFEST_PATH,
  WORKSPACE_ROOT,
  appendManifestRow,
  buildInvocationPrefix,
  buildManifestRow,
  compareFallback,
  getCommandDefinition,
  passthroughArgsText,
  renderCommandContract,
  renderPayload,
  resolveMode,
  sha256,
};
