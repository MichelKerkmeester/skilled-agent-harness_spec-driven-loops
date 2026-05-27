import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  extractSpecIdCandidates,
  validateMemoryQualityContent,
} from '../lib/validate-memory-quality';

const currentSpecFolder = 'system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/041-v-rule-cross-spec-overreach';
const dominatesSpecFolder = 'system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/042-dominates-current';
const tempRoots: string[] = [];

function memoryFixture(body: string, specFolder = currentSpecFolder): string {
  const specIds = extractSpecIdCandidates(specFolder);
  const currentSpecId = specIds.length > 0 ? specIds[specIds.length - 1] : 'v8-overreach-regression';
  return `---
title: "V8 overreach regression fixture"
spec_folder: "${specFolder}"
trigger_phrases:
  - "v8 overreach regression"
key_topics:
  - "${currentSpecId}"
tool_count: 0
---

# V8 overreach regression fixture

${body}
`;
}

function v8Result(content: string, filePath?: string) {
  return validateMemoryQualityContent(content, { filePath })
    .ruleResults.find((rule) => rule.ruleId === 'V8');
}

function createParentSpecFixture(): string {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'v8-dominates-parent-'));
  tempRoots.push(tempRoot);
  const parentSpecFolder = path.join(tempRoot, '014-parent-spec');
  fs.mkdirSync(path.join(parentSpecFolder, '037-foo'), { recursive: true });
  fs.mkdirSync(path.join(parentSpecFolder, '038-bar'), { recursive: true });
  return parentSpecFolder;
}

function repeatedSpecReference(specId: string, count: number): string {
  return Array.from(
    { length: count },
    (_value, index) => `Reference ${index + 1}: ${specId} remains relevant.`,
  ).join('\n');
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const tempRoot = tempRoots.pop();
    if (tempRoot) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
});

describe('V8 cross-spec overreach calibration', () => {
  it('T040-01 ignores metric-like numeric prefixes such as vector dimensions and diff line counts', () => {
    const content = memoryFixture(`
The validator should not treat a 768-dimension vector as a spec packet.
The same applies to a 142-line diff summary or a 512-token context note.
All of those are metric labels, not packet identifiers.
`);

    expect(extractSpecIdCandidates(content)).not.toEqual(
      expect.arrayContaining(['768-dimension', '142-line', '512-token']),
    );
    expect(v8Result(content)?.passed).toBe(true);
  });

  it('T040-02 ignores ADR-NNN contexts and ADR title slugs', () => {
    const content = memoryFixture(`
ADR-002 covers retention. ADR-003 covers context size.
The ADR-002-decouple-retention-from-governance title is a decision number, not packet 002.
The adr-003-context-size-decision title follows the same decision-record convention.
`);

    expect(extractSpecIdCandidates(content)).not.toEqual(
      expect.arrayContaining([
        '002-decouple-retention-from-governance',
        '003-context-size-decision',
      ]),
    );
    expect(v8Result(content)?.passed).toBe(true);
  });

  it('T040-03 derives the current spec from the last numbered segment of a nested file path', () => {
    const decisionRecordPath = '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/037-token-budget-worker-deep-dive/decision-record.md';
    const content = `---
title: "ADR-003 embedding token budget"
trigger_phrases:
  - "embedding token budget"
tool_count: 0
---

# Embedding token budget

The 037-token-budget-worker-deep-dive packet documents the current decision.
It also references parent packet 026-graph-and-context-optimization as lineage.
`;

    const result = validateMemoryQualityContent(content, { filePath: decisionRecordPath });
    expect(result.contaminationAudit.passedThrough).toContain('current_spec:037-token-budget-worker-deep-dive');
    expect(result.ruleResults.find((rule) => rule.ruleId === 'V8')?.passed).toBe(true);
  });

  it('T040-04 allows three scattered foreign IDs in decision records but not generic notes', () => {
    const body = `
The decision record compares 901-alpha-packet as prior art.
It also mentions 902-beta-packet as a rejected direction.
Finally, 903-gamma-packet appears as a follow-up reference.
`;
    const content = memoryFixture(body);

    const decisionRecordPath = `.opencode/specs/${currentSpecFolder}/decision-record.md`;
    const notesPath = `.opencode/specs/${currentSpecFolder}/notes.md`;

    expect(v8Result(content, decisionRecordPath)?.passed).toBe(true);
    const notesV8 = v8Result(content, notesPath);
    expect(notesV8?.passed).toBe(false);
    expect(notesV8?.message).toContain('body-scattered:901-alpha-packet x1');
  });

  it('allows limited predecessor and follow-on references in spec.md', () => {
    const content = memoryFixture(`
This packet follows 113-z-archive-memory-indexing as predecessor context.
It may create a 345-scenario sweep report as a follow-on artifact.
The current packet remains focused on 041-v-rule-cross-spec-overreach.
`);

    const specPath = `.opencode/specs/${currentSpecFolder}/spec.md`;
    expect(v8Result(content, specPath)?.passed).toBe(true);
  });

  it('T040-05 preserves scattered-foreign detection for generic spec docs', () => {
    const content = memoryFixture(`
The generic plan should still fail when it drifts across 901-alpha-packet.
It also reaches into 902-beta-packet, 903-gamma-packet, and 904-delta-packet.
This remains contamination for plan.md because plan documents are expected to stay focused.
`);

    const planPath = `.opencode/specs/${currentSpecFolder}/plan.md`;
    const v8 = v8Result(content, planPath);
    expect(v8?.passed).toBe(false);
    expect(v8?.message).toContain('spec relevance mismatch');
    expect(v8?.message).toContain('body-scattered:904-delta-packet x1');
  });

  it('T047-01 allows four repeated foreign references in decision records under the relaxed dominates threshold', () => {
    const content = memoryFixture(repeatedSpecReference('037-foo', 4), dominatesSpecFolder);
    const decisionRecordPath = `.opencode/specs/${dominatesSpecFolder}/decision-record.md`;

    expect(v8Result(content, decisionRecordPath)?.passed).toBe(true);
  });

  it('T047-02 preserves strict dominates detection for plan documents', () => {
    const content = memoryFixture(repeatedSpecReference('037-foo', 4), dominatesSpecFolder);
    const planPath = `.opencode/specs/${dominatesSpecFolder}/plan.md`;

    const v8 = v8Result(content, planPath);
    expect(v8?.passed).toBe(false);
    expect(v8?.message).toContain('foreign spec ids dominate rendered content');
  });

  it('T047-03 allowlists direct child spec IDs for parent handovers', () => {
    const parentSpecFolder = createParentSpecFixture();
    const content = memoryFixture(`
${repeatedSpecReference('037-foo', 5)}
${repeatedSpecReference('038-bar', 5)}
`, parentSpecFolder);
    const handoverPath = path.join(parentSpecFolder, 'handover.md');

    expect(v8Result(content, handoverPath)?.passed).toBe(true);
  });

  it('T047-04 preserves dominates detection for unrelated specs in parent handovers', () => {
    const parentSpecFolder = createParentSpecFixture();
    const content = memoryFixture(repeatedSpecReference('999-unrelated-spec', 5), parentSpecFolder);
    const handoverPath = path.join(parentSpecFolder, 'handover.md');

    const v8 = v8Result(content, handoverPath);
    expect(v8?.passed).toBe(false);
    expect(v8?.message).toContain('foreign spec ids dominate rendered content');
  });

  // SKIP: live spec fixture absent in current checkout
  it.skip('T047-05 passes the live 014 parent handover quality gate', () => {
    const repoRoot = path.resolve(__dirname, '../../../../..');
    const handoverPath = path.join(
      repoRoot,
      '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/handover.md',
    );
    const content = fs.readFileSync(handoverPath, 'utf-8');
    const result = validateMemoryQualityContent(content, { filePath: handoverPath });

    expect(result.valid).toBe(true);
    expect(result.ruleResults.find((rule) => rule.ruleId === 'V8')?.passed).toBe(true);
  });
});
