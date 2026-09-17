import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const compiler = require('../../scripts/compile-command-contracts.cjs') as {
  WORKSPACE_ROOT: string;
  buildContract: (command: string) => string;
  outputPathFor: (command: string) => string;
  computeCompiledBodyDigestFromContract: (contractText: string) => string;
  parseDigestHeader: (contractText: string) => {
    compiledBodyDigest: string;
    sourceDigests: Array<{ path: string; sha256: string; section: string }>;
  };
  sha256: (input: string | Buffer) => string;
};

const commands = ['deep/ai-council', 'deep/review', 'deep/research'] as const;
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
    ['deep/ai-council', 'deep-ai-council.contract.md'],
    ['deep/review', 'deep-review.contract.md'],
    ['deep/research', 'deep-research.contract.md'],
  ])('writes %s to its tracked renderer path', (command, fileName) => {
    expect(compiler.outputPathFor(command)).toBe(
      join(compiler.WORKSPACE_ROOT, '.opencode/commands/deep/assets/compiled', fileName),
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

  // A checkout that holds its tree only under .skilled has no .opencode path, so an output
  // directory missing under both names must resolve under the compiler's own tree.
  it('resolves a missing compiled directory under the tree the compiler runs from', () => {
    const root = realpathSync(mkdtempSync(join(tmpdir(), 'compile-contracts-skilled-only-')));
    try {
      const scripts = join(root, '.skilled', 'skills', 'system-deep-loop', 'runtime', 'scripts');
      mkdirSync(scripts, { recursive: true });
      copyFileSync(require.resolve('../../scripts/compile-command-contracts.cjs'), join(scripts, 'compile-command-contracts.cjs'));
      const copied = require(join(scripts, 'compile-command-contracts.cjs')) as typeof compiler;

      expect(copied.outputPathFor('deep/review')).toBe(
        join(root, '.skilled', 'commands', 'deep', 'assets', 'compiled', 'deep-review.contract.md'),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
