// ───────────────────────────────────────────────────────────────────
// MODULE: Contract Drift Checker Tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type DriftClass =
  | 'STALE_SOURCE_DIGEST'
  | 'STALE_COMPILED_BODY'
  | 'UNRESOLVED_MARKERS'
  | 'TOOL_ALLOWLIST_OVERFLOW'
  | 'ENUMERATED_SOURCE_GAP';

type Drift = {
  command: string;
  class: DriftClass;
  reason: string;
};

type CheckResult = {
  command: string;
  failures: Drift[];
  warnings: Drift[];
};

const compiler = require('../../scripts/compile-command-contracts.cjs') as {
  GENERATED_HEADER_END: string;
  GENERATED_HEADER_START: string;
  outputPathFor: (command: string) => string;
  parseDigestHeader: (contractText: string) => {
    sourceDigests: Array<{ path: string; sha256: string; section: string }>;
    compiledBodyDigest: string;
  };
};

const checker = require('../../scripts/check-contract-drift.cjs') as {
  DRIFT_CLASSES: Record<DriftClass, DriftClass>;
  checkCommand: (command: string, options?: {
    acceptCompiledDrift?: boolean;
    contractTextByCommand?: Record<string, string>;
  }) => CheckResult;
  checkContracts: (options?: { commands?: string[] }) => { failures: Drift[]; warnings: Drift[] };
};

const COMMAND = 'deep/review';
const REVIEW_CONFIG_SOURCE = '.opencode/skills/system-deep-loop/deep-review/assets/deep-review-config.json';
const COUNCIL_COMMAND = 'deep/ai-council';
const COUNCIL_PATTERN_SOURCE = '.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md';

function realContract(command = COMMAND): string {
  return readFileSync(compiler.outputPathFor(command), 'utf8');
}

function withHeader(contractText: string, mutate: (header: ReturnType<typeof compiler.parseDigestHeader>) => void): string {
  const header = compiler.parseDigestHeader(contractText);
  mutate(header);
  const end = contractText.indexOf(compiler.GENERATED_HEADER_END) + compiler.GENERATED_HEADER_END.length;
  const body = contractText.slice(end);
  return `${compiler.GENERATED_HEADER_START}\n${JSON.stringify(header, null, 2)}\n${compiler.GENERATED_HEADER_END}${body}`;
}

function checkMutated(contractText: string, acceptCompiledDrift = false, command = COMMAND): CheckResult {
  return checker.checkCommand(command, {
    acceptCompiledDrift,
    contractTextByCommand: { [command]: contractText },
  });
}

function classes(result: CheckResult): DriftClass[] {
  return result.failures.map((failure) => failure.class);
}

describe('check-contract-drift', () => {
  it('flags stale source digests', () => {
    const contract = withHeader(realContract(), (header) => {
      header.sourceDigests[0].sha256 = '0'.repeat(64);
    });

    const result = checkMutated(contract);

    expect(classes(result)).toContain(checker.DRIFT_CLASSES.STALE_SOURCE_DIGEST);
  });

  it('flags stale compiled bodies', () => {
    const contract = realContract().replace('## absorptionAbort', '## absorptionAbort\n\nbody mutation');

    const result = checkMutated(contract);

    const failure = result.failures.find((item) => item.class === checker.DRIFT_CLASSES.STALE_COMPILED_BODY);

    expect(failure).toBeDefined();
    expect(failure?.reason).toContain('compiled body differs');
  });

  it('downgrades stale compiled bodies when explicitly accepted', () => {
    const contract = realContract().replace('## absorptionAbort', '## absorptionAbort\n\nbody mutation');

    const result = checkMutated(contract, true);

    expect(classes(result)).not.toContain(checker.DRIFT_CLASSES.STALE_COMPILED_BODY);
    expect(result.warnings.map((warning) => warning.class)).toContain(checker.DRIFT_CLASSES.STALE_COMPILED_BODY);
  });

  it('flags unresolved placeholder markers', () => {
    const contract = `${realContract()}\n[PLACEHOLDER]\n`;

    const result = checkMutated(contract, true);

    expect(classes(result)).toContain(checker.DRIFT_CLASSES.UNRESOLVED_MARKERS);
  });

  it('flags tool allowlist overflow', () => {
    const contract = realContract().replace('permittedByExecutor:', '  - "DeleteEverything"\npermittedByExecutor:');

    const result = checkMutated(contract, true);

    expect(classes(result)).toContain(checker.DRIFT_CLASSES.TOOL_ALLOWLIST_OVERFLOW);
  });

  for (const { command, sourcePath } of [
    { command: COMMAND, sourcePath: REVIEW_CONFIG_SOURCE },
    { command: COUNCIL_COMMAND, sourcePath: COUNCIL_PATTERN_SOURCE },
  ]) {
    it(`flags enumerated authority sources missing from sourceDigests for ${command}`, () => {
      const contract = withHeader(realContract(command), (header) => {
        header.sourceDigests = header.sourceDigests.filter((digest) => digest.path !== sourcePath);
      });

      const result = checkMutated(contract, false, command);
      const failure = result.failures.find((item) => item.class === checker.DRIFT_CLASSES.ENUMERATED_SOURCE_GAP);

      expect(failure).toBeDefined();
      expect(failure?.reason).toContain(sourcePath);
    });
  }

  it('passes against the real current compiled contracts', () => {
    const result = checker.checkContracts();

    expect(result.failures).toEqual([]);
    expect(result.warnings).toEqual([]);
  });
});
