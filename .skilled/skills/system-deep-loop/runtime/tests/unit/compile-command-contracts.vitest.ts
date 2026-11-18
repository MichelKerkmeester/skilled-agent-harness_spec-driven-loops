// ───────────────────────────────────────────────────────────────────
// MODULE: Command Contract Compilation Tests
// ───────────────────────────────────────────────────────────────────
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const compiler = require('../../scripts/compile-command-contracts.cjs') as {
  WORKSPACE_ROOT: string;
  buildContract: (command: string) => string;
  outputPathFor: (command: string) => string;
  getCommandDefinition: (command: string) => {
    commandPath: string;
    workflowPath?: string;
    autoWorkflowPath?: string;
    confirmWorkflowPath?: string;
  };
  computeCompiledBodyDigestFromContract: (contractText: string) => string;
  parseDigestHeader: (contractText: string) => {
    compiledBodyDigest: string;
    sourceDigests: Array<{ path: string; sha256: string; section: string }>;
  };
  sha256: (input: string | Buffer) => string;
};

const commands = ['deep/review', 'deep/research'] as const;
const schemaBlocks = [
  '## gate3Precedence',
  '## renderBlocks.auto',
  '## renderBlocks.confirm',
  '## setup',
  '## outputTemplate',
  '## writeBoundary',
  '## executorContract',
  '## refs',
  '## tools',
  '## absorptionAbort',
] as const;

function sourceSha(sourcePath: string): string {
  return compiler.sha256(readFileSync(join(compiler.WORKSPACE_ROOT, sourcePath)));
}

describe('compile-command-contracts', () => {
  it.each([
    ['deep/review', 'deep-review.contract.markdown'],
    ['deep/research', 'deep-research.contract.markdown'],
  ])('writes %s to its tracked renderer path', (command, fileName) => {
    expect(compiler.outputPathFor(command)).toBe(
      join(compiler.WORKSPACE_ROOT, '.skilled/commands/deep/assets/compiled', fileName),
    );
  });

  it.each(commands)('emits every schema block for %s', (command) => {
    const contract = compiler.buildContract(command);

    for (const block of schemaBlocks) {
      expect(contract).toContain(block);
    }
    expect(contract).toContain('<!-- START renderBlocks.auto -->');
    expect(contract).toContain('<!-- END renderBlocks.auto -->');
    expect(contract).toContain('<!-- START renderBlocks.confirm -->');
    expect(contract).toContain('<!-- END renderBlocks.confirm -->');
    expect(contract).toContain('Producing findings without a dispatch receipt is role absorption; write no findings.');
  });

  it.each(commands)('computes compiledBodyDigest from the body only for %s', (command) => {
    const contract = compiler.buildContract(command);
    const header = compiler.parseDigestHeader(contract);
    const commandName = `/${command.replace('/', ':')}`;

    const headerMutated = contract.replace(`"command": "${commandName}"`, `"command": "${commandName}:mutated-header"`);
    expect(compiler.computeCompiledBodyDigestFromContract(headerMutated)).toBe(header.compiledBodyDigest);

    const bodyMutated = contract.replace('## absorptionAbort', '## absorptionAbort\n\nbody mutation');
    expect(compiler.computeCompiledBodyDigestFromContract(bodyMutated)).not.toBe(header.compiledBodyDigest);
  });

  it.each(commands)('records live source sha values for %s', (command) => {
    const contract = compiler.buildContract(command);
    const header = compiler.parseDigestHeader(contract);

    expect(header.sourceDigests.length).toBeGreaterThan(0);
    for (const digest of header.sourceDigests) {
      expect(digest.section).toBe('full');
      expect(digest.sha256).toBe(sourceSha(digest.path));
    }
  });

  // A checkout that holds its tree only under .opencode has no .skilled path, so an output
  // directory missing under both names must resolve under the compiler's own tree.
  it('resolves a missing compiled directory under the tree the compiler runs from', () => {
    const root = realpathSync(mkdtempSync(join(tmpdir(), 'compile-contracts-opencode-only-')));
    try {
      const scripts = join(root, '.opencode', 'skills', 'system-deep-loop', 'runtime', 'scripts');
      mkdirSync(scripts, { recursive: true });
      copyFileSync(require.resolve('../../scripts/compile-command-contracts.cjs'), join(scripts, 'compile-command-contracts.cjs'));
      const copied = require(join(scripts, 'compile-command-contracts.cjs')) as typeof compiler;

      expect(copied.outputPathFor('deep/review')).toBe(
        join(root, '.opencode', 'commands', 'deep', 'assets', 'compiled', 'deep-review.contract.markdown'),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// WORKFLOW DRIFT GUARD
// ───────────────────────────────────────────────────────────────────

// Research and review each run from one workflow file. Two per-mode files
// drift apart, so every fix lands twice or lands in one mode only. Both deep
// modes share this shape, so the guard scans every command.
const guardedCommands = ['deep/review', 'deep/research'] as const;

// A scratch copy of the assets folder can stand in here, to show that the
// guard still fails when a per-mode file comes back.
const GUARD_ASSETS_DIR = process.env.DEEP_LOOP_GUARD_ASSETS_DIR
  ?? join(compiler.WORKSPACE_ROOT, '.skilled/commands/deep/assets');

// A flag maps to the workflow key it binds: drop the dashes, then turn each
// inner dash into an underscore. These flags bind a key with another name.
const FLAG_KEY_ALIASES: Record<string, string> = {
  '--convergence': 'convergence_threshold',
  '--no-resource-map': 'resource_map.emit',
  '--restart': 'lineage_mode',
  '--executor': 'config.executor',
  '--executors': 'config.fanout',
  '--concurrency': 'config.fanout',
};

// The command docs spell two required inputs in camel case.
const REQUIRED_INPUT_ALIASES: Record<string, string> = {
  maxIterations: 'max_iterations',
  convergenceThreshold: 'convergence_threshold',
};

// The runtime binds these inputs itself, so no operator flag names them.
// max_iterations_source is the setup's record of where max_iterations came from.
const RUNTIME_BOUND_INPUTS = new Set(['session_id', 'config.fanout_lineage_artifact_dir', 'max_iterations_source']);

function flagKey(flag: string): string {
  return FLAG_KEY_ALIASES[flag] ?? flag.replace(/^--/u, '').replace(/-/gu, '_');
}

function perModeWorkflowFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => /^deep-(research|review)-(auto|confirm)\.yaml$/u.test(name))
    .sort();
}

function docFlags(docText: string): string[] {
  const lines = docText.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.includes('Workflow Flag Surface'));
  if (start === -1) return [];
  const flags: string[] = [];
  let inTable = false;
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('|')) {
      inTable = true;
      const firstCell = line.split('|')[1] ?? '';
      for (const match of firstCell.matchAll(/`(--[a-z][a-z-]*)`/gu)) flags.push(match[1]);
    } else if (inTable) {
      break;
    }
  }
  return flags;
}

function docRequiredInputs(docText: string): string[] {
  const lines = docText.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.includes('YAML START CONDITION'));
  if (start === -1) return [];
  const inputs: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (!/^\s+- /u.test(line)) break;
    for (const match of line.matchAll(/`([A-Za-z_.]+)`/gu)) {
      inputs.push(REQUIRED_INPUT_ALIASES[match[1]] ?? match[1]);
    }
  }
  return inputs;
}

function withoutComments(workflowText: string): string {
  return workflowText
    .split(/\r?\n/u)
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n');
}

function declaredInputs(workflowText: string): string[] {
  const lines = workflowText.split(/\r?\n/u);
  const start = lines.findIndex((line) => line === 'user_inputs:');
  if (start === -1) return [];
  const inputs: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const match = /^ {2}([A-Za-z_.]+):/u.exec(line);
    if (!match) break;
    inputs.push(match[1]);
  }
  return inputs;
}

function flagParityFailures(input: {
  docPath: string;
  docText: string;
  workflowPath: string;
  workflowText: string;
  knownFlags: string[];
}): string[] {
  const failures: string[] = [];
  const listed = docFlags(input.docText);
  const listedKeys = new Set(listed.map(flagKey));
  const required = new Set(docRequiredInputs(input.docText));
  const body = withoutComments(input.workflowText);

  for (const flag of listed) {
    if (!body.includes(flagKey(flag))) {
      failures.push(`${input.docPath} lists ${flag} but ${input.workflowPath} never reads ${flagKey(flag)}`);
    }
  }
  for (const flag of input.knownFlags) {
    const key = flagKey(flag);
    if (!listedKeys.has(key) && body.includes(key)) {
      failures.push(`${input.workflowPath} reads ${key} but ${input.docPath} does not list ${flag}`);
    }
  }
  for (const declared of declaredInputs(input.workflowText)) {
    if (!listedKeys.has(declared) && !required.has(declared) && !RUNTIME_BOUND_INPUTS.has(declared)) {
      failures.push(
        `${input.workflowPath} declares input ${declared} that ${input.docPath} lists neither as a flag nor as a required input`,
      );
    }
  }
  return failures;
}

function workflowPathsOf(command: string): string[] {
  const definition = compiler.getCommandDefinition(command);
  if (definition.workflowPath) return [definition.workflowPath];
  return [definition.autoWorkflowPath, definition.confirmWorkflowPath].filter(
    (path): path is string => typeof path === 'string',
  );
}

describe('workflow drift guard', () => {
  it('finds no per-mode workflow file for research or review', () => {
    expect(
      perModeWorkflowFiles(GUARD_ASSETS_DIR),
      'a per-mode workflow file is back: /deep:research and /deep:review each run from one file',
    ).toEqual([]);
  });

  it('reports a per-mode workflow file when one exists', () => {
    const dir = mkdtempSync(join(tmpdir(), 'workflow-drift-guard-'));
    try {
      writeFileSync(join(dir, 'deep-research.yaml'), 'workflow: {}\n', 'utf8');
      writeFileSync(join(dir, 'deep-research-confirm.yaml'), 'workflow: {}\n', 'utf8');
      writeFileSync(join(dir, 'deep-other-auto.yaml'), 'workflow: {}\n', 'utf8');
      expect(perModeWorkflowFiles(dir)).toEqual(['deep-research-confirm.yaml']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it.each(guardedCommands)('%s names one workflow path', (command) => {
    const definition = compiler.getCommandDefinition(command);
    expect(typeof definition.workflowPath, `${command} still names a workflow file per mode`).toBe('string');
  });

  it.each(guardedCommands)('flag parity: %s lists the flags its workflow reads', (command) => {
    const definition = compiler.getCommandDefinition(command);
    const docText = readFileSync(join(compiler.WORKSPACE_ROOT, definition.commandPath), 'utf8');
    const knownFlags = [
      ...new Set(
        guardedCommands.flatMap((name) => docFlags(
          readFileSync(join(compiler.WORKSPACE_ROOT, compiler.getCommandDefinition(name).commandPath), 'utf8'),
        )),
      ),
    ];
    expect(docFlags(docText).length).toBeGreaterThan(0);

    const failures = workflowPathsOf(command).flatMap((workflowPath) => flagParityFailures({
      docPath: definition.commandPath,
      docText,
      workflowPath,
      workflowText: readFileSync(join(compiler.WORKSPACE_ROOT, workflowPath), 'utf8'),
      knownFlags,
    }));
    expect(failures).toEqual([]);
  });

  it('flag parity: a flag the doc lists and the workflow never reads fails', () => {
    const failures = flagParityFailures({
      docPath: 'doc.md',
      docText: '### Workflow Flag Surface\n\n| Flag | Value |\n|---|---|\n| `--dry-run` | no value |\n',
      workflowPath: 'workflow.yaml',
      workflowText: 'user_inputs:\n  spec_folder: "x"\nworkflow: {}\n# dry_run in a comment does not count\n',
      knownFlags: ['--dry-run'],
    });
    expect(failures).toContain('doc.md lists --dry-run but workflow.yaml never reads dry_run');
  });

  it('flag parity: a flag the workflow reads and the doc does not list fails', () => {
    const failures = flagParityFailures({
      docPath: 'doc.md',
      docText: '### Workflow Flag Surface\n\n| Flag | Value |\n|---|---|\n| `--spec-folder` | PATH |\n',
      workflowPath: 'workflow.yaml',
      workflowText: 'user_inputs:\n  spec_folder: "x"\nworkflow:\n  skip_when: "review_focus is empty"\n',
      knownFlags: ['--spec-folder', '--review-focus'],
    });
    expect(failures).toEqual(['workflow.yaml reads review_focus but doc.md does not list --review-focus']);
  });
});
