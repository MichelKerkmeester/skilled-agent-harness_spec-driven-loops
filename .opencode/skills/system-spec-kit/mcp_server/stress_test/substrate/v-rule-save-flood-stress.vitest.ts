import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { afterEach, describe, expect, it } from 'vitest';

import {
  extractSpecIdCandidates,
  validateMemoryQualityContent,
} from '../../../scripts/lib/validate-memory-quality';

const currentSpecFolder = 'system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/049-substrate-stress-coverage';
const tempRoots: string[] = [];

function repeatedSpecReference(specId: string, count: number): string {
  return Array.from(
    { length: count },
    (_value, index) => `Reference ${index + 1}: ${specId} remains relevant to the substrate stress packet.`,
  ).join('\n');
}

function memoryFixture(body: string, specFolder = currentSpecFolder): string {
  return `---
title: "Substrate stress canonical doc"
spec_folder: "${specFolder}"
trigger_phrases:
  - "substrate stress"
key_topics:
  - "049-substrate-stress-coverage"
tool_count: 0
---

# Substrate stress canonical doc

This canonical document records substrate stress evidence for the current packet.

${body}
`;
}

function v8Result(content: string, filePath?: string) {
  return validateMemoryQualityContent(content, { filePath })
    .ruleResults.find((rule) => rule.ruleId === 'V8');
}

function createParentSpecFixture(): string {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'substrate-v8-parent-'));
  tempRoots.push(tempRoot);
  const parentSpecFolder = path.join(tempRoot, '014-local-embeddings-migration');
  fs.mkdirSync(path.join(parentSpecFolder, '_046-shared-daemon-suite-runner'), { recursive: true });
  fs.mkdirSync(path.join(parentSpecFolder, '049-substrate-stress-coverage'), { recursive: true });
  fs.writeFileSync(path.join(parentSpecFolder, 'spec.md'), '# Parent spec\n');
  return parentSpecFolder;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const tempRoot = tempRoots.pop();
    if (tempRoot) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
});

describe('V-rule save flood stress', () => {
  it('honors V8 dominance thresholds for handover and implementation-summary documents', () => {
    const handoverPath = `.opencode/specs/${currentSpecFolder}/handover.md`;
    const implementationSummaryPath = `.opencode/specs/${currentSpecFolder}/implementation-summary.md`;

    expect(v8Result(memoryFixture(repeatedSpecReference('999-foreign-packet', 4)), handoverPath)?.passed)
      .toBe(true);
    expect(v8Result(memoryFixture(repeatedSpecReference('999-foreign-packet', 5)), handoverPath)?.passed)
      .toBe(false);
    expect(v8Result(memoryFixture(repeatedSpecReference('999-foreign-packet', 5)), implementationSummaryPath)?.passed)
      .toBe(true);
    expect(v8Result(memoryFixture(repeatedSpecReference('999-foreign-packet', 6)), implementationSummaryPath)?.passed)
      .toBe(false);
  });

  it('applies parent-child ancestry allowlisting without false-positive scatter trips', () => {
    const parentSpecFolder = createParentSpecFixture();
    const content = memoryFixture(`
${repeatedSpecReference('_046-shared-daemon-suite-runner', 5)}
${repeatedSpecReference('049-substrate-stress-coverage', 5)}
`, parentSpecFolder);

    expect(v8Result(content, path.join(parentSpecFolder, 'handover.md'))?.passed).toBe(true);
  });

  it('preserves scattered and dominance failures for unrelated foreign specs', () => {
    const planPath = `.opencode/specs/${currentSpecFolder}/plan.md`;
    const scattered = memoryFixture(`
The generic plan should fail when it drifts into 901-alpha-packet.
It also reaches into 902-beta-packet.
`);
    const dominated = memoryFixture(repeatedSpecReference('999-foreign-packet', 3));

    expect(v8Result(scattered, planPath)?.message).toContain('body-scattered:901-alpha-packet x1');
    expect(v8Result(dominated, planPath)?.message).toContain('foreign spec ids dominate rendered content');
  });

  it('prevents numeric-prefix false positives while valid canonical docs pass', () => {
    const content = memoryFixture(`
The validator should not treat a 768-dimension vector as a spec packet.
The same applies to a 512-token context note or a 142-line diff summary.
The 049-substrate-stress-coverage packet remains the active canonical doc.
`);

    expect(extractSpecIdCandidates(content)).not.toEqual(
      expect.arrayContaining(['768-dimension', '512-token', '142-line']),
    );
    expect(v8Result(content, `.opencode/specs/${currentSpecFolder}/implementation-summary.md`)?.passed).toBe(true);
  });

  it('validates 50 canonical-doc save attempts within 5 seconds without live DB access', () => {
    const started = performance.now();
    const results = Array.from({ length: 50 }, (_value, index) => {
      const content = memoryFixture(`
Attempt ${index + 1} records canonical substrate stress evidence.
Current packet 049-substrate-stress-coverage remains dominant and references parent 014-local-embeddings-migration.
`);
      return validateMemoryQualityContent(content, {
        filePath: `.opencode/specs/${currentSpecFolder}/implementation-summary.md`,
      });
    });
    const elapsedMs = performance.now() - started;

    expect(results).toHaveLength(50);
    expect(results.every((result) => result.ruleResults.find((rule) => rule.ruleId === 'V8')?.passed)).toBe(true);
    expect(elapsedMs).toBeLessThan(5_000);
  });
});
