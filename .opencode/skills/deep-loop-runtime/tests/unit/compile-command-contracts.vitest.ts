import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const compiler = require('../../scripts/compile-command-contracts.cjs') as {
  WORKSPACE_ROOT: string;
  buildContract: (command: string) => string;
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
});
