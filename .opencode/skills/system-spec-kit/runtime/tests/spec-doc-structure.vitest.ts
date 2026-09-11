import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { afterEach, describe, expect, it } from 'vitest';

import {
  RULE_FAILURE_CODES,
  extractGoalDurableSlice,
  runSpecDocStructureRule,
  type MergePlan,
} from '../lib/validation/spec-doc-structure';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = path.resolve(THIS_DIR, '../cli/test-fixtures');
const VALIDATE_SCRIPT = path.resolve(THIS_DIR, '../cli/spec/validate.sh');
const VALIDATOR_REGISTRY = path.resolve(THIS_DIR, '../cli/lib/validator-registry.json');

const TEMP_DIRS: string[] = [];

function makeTempDir(prefix: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  TEMP_DIRS.push(tempDir);
  return tempDir;
}

function copyFixture(name: string): string {
  const tempDir = makeTempDir(`speckit-${name}-`);
  const sourceDir = path.join(FIXTURE_ROOT, name);
  for (const entry of fs.readdirSync(sourceDir)) {
    fs.cpSync(path.join(sourceDir, entry), path.join(tempDir, entry), { recursive: true });
  }
  return tempDir;
}

function injectMemoryBlock(filePath: string, overrides: Partial<Record<string, string>> = {}): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const closingIndex = content.indexOf('\n---\n');
  if (closingIndex < 0) {
    throw new Error(`No frontmatter block found in ${filePath}`);
  }

  const continuityLines = [
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${overrides.packet_pointer ?? 'system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready'}"`,
    `    last_updated_at: "${overrides.last_updated_at ?? '2026-04-11T12:00:00Z'}"`,
    `    last_updated_by: "${overrides.last_updated_by ?? 'opencode-gate-c'}"`,
    `    recent_action: "${overrides.recent_action ?? 'Validated gate c fixture'}"`,
    `    next_safe_action: "${overrides.next_safe_action ?? 'Run strict validator'}"`,
    `  fingerprint: "${overrides.fingerprint ?? `sha256:${'1'.repeat(64)}`}"`,
  ];

  const insertion = `${continuityLines.join('\n')}\n`;
  const updated = `${content.slice(0, closingIndex)}\n${insertion}${content.slice(closingIndex + 1)}`;
  fs.writeFileSync(filePath, updated, 'utf8');
}

// Remove the _memory block (and everything it owns up to the next top-level key
// or the closing delimiter) from a doc's frontmatter. Template-compliant fixtures
// ship a valid block, so a test that exercises the missing-block path must strip it.
function stripMemoryBlock(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(/^_memory:\n(?:[ \t].*\n?)*/m, '');
  fs.writeFileSync(filePath, updated, 'utf8');
}

// Blank a single continuity field inside the doc's existing _memory block. The
// frontmatter parser reads the first _memory block, so a missing-field test must
// mutate that block rather than append a second one the parser would ignore.
function setContinuityFieldEmpty(filePath: string, field: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const pattern = new RegExp(`^(\\s*${field}:\\s*).*$`, 'm');
  const updated = content.replace(pattern, '$1""');
  fs.writeFileSync(filePath, updated, 'utf8');
}

// Set a single continuity field to a given value inside the doc's existing
// _memory block; the parser reads the first block, so a value-bearing assertion
// must mutate that block rather than append a second one it would ignore.
function setContinuityField(filePath: string, field: string, value: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const pattern = new RegExp(`^(\\s*${field}:\\s*).*$`, 'm');
  const updated = content.replace(pattern, `$1"${value}"`);
  fs.writeFileSync(filePath, updated, 'utf8');
}

function replaceAnchorBody(filePath: string, anchorId: string, body: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const pattern = new RegExp(
    `(<!--\\s*ANCHOR:${anchorId}\\s*-->\\n)([\\s\\S]*?)(\\n<!--\\s*\\/ANCHOR:${anchorId}\\s*-->)`,
    'm',
  );
  const updated = content.replace(pattern, `$1${body}$3`);
  fs.writeFileSync(filePath, updated, 'utf8');
}

function replaceText(filePath: string, searchValue: string, replaceValue: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, content.replace(searchValue, replaceValue), 'utf8');
}

function seedContinuityAcrossFixture(folder: string): void {
  // Seed whatever documents the fixture actually carries. A hard-coded roster is a second
  // copy of the canonical document set, and it breaks the moment that set gains or retires
  // a member - the helper then throws ENOENT on a file no packet has any more.
  for (const entry of fs.readdirSync(folder).sort()) {
    if (entry.endsWith('.md')) {
      injectMemoryBlock(path.join(folder, entry));
    }
  }
}

function createMergeFixture(): { folder: string; mergePlan: MergePlan } {
  const folder = makeTempDir('speckit-merge-');
  fs.writeFileSync(
    path.join(folder, 'spec.md'),
    `---
title: "Merge Fixture"
description: "Fixture"
trigger_phrases:
  - "fixture"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/merge-fixture"
    last_updated_at: "2026-04-11T12:00:00Z"
    last_updated_by: "opencode-gate-c"
    recent_action: "Prepared merge fixture"
    next_safe_action: "Run merge validation"
---
# Merge Fixture

<!-- ANCHOR:what-built -->
## What Was Built

This anchor is prose only.
<!-- /ANCHOR:what-built -->
`,
    'utf8',
  );

  return {
    folder,
    mergePlan: {
      targetFile: 'spec.md',
      targetAnchor: 'what-built',
      mergeMode: 'append-table-row',
      chunkText: '| Cell A | Cell B |',
    },
  };
}

function createHandoverSessionNotesFixture(): { folder: string; mergePlan: MergePlan } {
  const folder = makeTempDir('speckit-handover-');
  fs.writeFileSync(
    path.join(folder, 'handover.md'),
    `---
title: "Session Handover"
description: "Fixture"
trigger_phrases:
  - "handover"
importance_tier: "normal"
contextType: "handover"
---
# Session Handover

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The existing notes may contain prose plus tables.

| Packet | Outcome |
|--------|---------|
| 001 | shipped |
<!-- /ANCHOR:session-notes -->
`,
    'utf8',
  );

  return {
    folder,
    mergePlan: {
      targetFile: 'handover.md',
      targetAnchor: 'session-notes',
      mergeMode: 'append-section',
      chunkText: '## Follow-up\n\nContinue from the saved state.',
    },
  };
}

afterEach(() => {
  while (TEMP_DIRS.length > 0) {
    const tempDir = TEMP_DIRS.pop();
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});


// A goal document whose durable slice can be sized exactly: the frontmatter and
// the log are outside the slice by definition, so only the padding inside the
// directive anchor moves the measurement.
function writeGoalDoc(folder: string, options: { level: 'phase' | '1'; sliceChars: number; bindingRows?: string[] }): string {
  const frontmatter = [
    '---',
    'title: "Goal: fixture"',
    'description: "fixture"',
    'trigger_phrases:',
    '  - "goal fixture"',
    'importance_tier: "important"',
    'contextType: "planning"',
    '_memory:',
    '  continuity:',
    '    packet_pointer: "fixture/goal"',
    '    last_updated_at: "2026-09-11T00:00:00Z"',
    '    last_updated_by: "vitest"',
    '    recent_action: "Wrote fixture"',
    '    next_safe_action: "Run validator"',
    '    blockers: []',
    '    key_files: []',
    '    session_dedup:',
    `      fingerprint: "sha256:${'0'.repeat(64)}"`,
    '      session_id: "vitest"',
    '      parent_session_id: null',
    '    completion_pct: 0',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '',
  ].join('\n');
  const binding = options.level === 'phase'
    ? [
        '<!-- ANCHOR:binding -->',
        '## 2. BINDING',
        '| Phase | Goal document |',
        '|-------|---------------|',
        ...(options.bindingRows ?? []),
        '<!-- /ANCHOR:binding -->',
        '',
      ].join('\n')
    : '';
  const skeleton = [
    '# Goal: fixture',
    '',
    '<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->',
    '',
    '<!-- ANCHOR:directive -->',
    '## 1. DURABLE DIRECTIVE',
    '**Objective:** PADDING',
    '<!-- /ANCHOR:directive -->',
    '',
    binding,
    '<!-- ANCHOR:completion -->',
    '## 3. COMPLETION CRITERIA',
    '- [ ] validate.sh passes',
    '<!-- /ANCHOR:completion -->',
    '',
  ].join('\n');
  const baseLength = skeleton.replace('PADDING', '').length;
  const padding = 'x'.repeat(Math.max(0, options.sliceChars - baseLength));
  const content = `${frontmatter}${skeleton.replace('PADDING', padding)}<!-- ANCHOR:log -->\n## 4. LOG\nvolatile\n<!-- /ANCHOR:log -->\n`;
  const goalPath = path.join(folder, 'goal.md');
  fs.writeFileSync(goalPath, content, 'utf8');
  return goalPath;
}

describe('spec-doc-structure contract', () => {
  // drift: verified against shipped behavior during Unit H
  it('freezes the failure-code ordering from Gate C research', () => {
    expect(RULE_FAILURE_CODES.FRONTMATTER_MEMORY_BLOCK).toEqual([
      'SPECDOC_FRONTMATTER_001',
      'SPECDOC_FRONTMATTER_002',
      'SPECDOC_FRONTMATTER_003',
      'SPECDOC_FRONTMATTER_004',
      'SPECDOC_FRONTMATTER_005',
      'SPECDOC_FRONTMATTER_006',
      'SPECDOC_FRONTMATTER_007',
      'MEMORY_BLOCK_INVALID',
      'SESSION_LINEAGE_BROKEN',
    ]);
    expect(RULE_FAILURE_CODES.MERGE_LEGALITY).toEqual([
      'SPECDOC_MERGE_001',
      'SPECDOC_MERGE_002',
      'SPECDOC_MERGE_003',
      'SPECDOC_MERGE_004',
      'SPECDOC_MERGE_005',
    ]);
    expect(RULE_FAILURE_CODES.SPEC_DOC_SUFFICIENCY).toEqual([
      'SPECDOC_SUFFICIENCY_001',
      'SPECDOC_SUFFICIENCY_002',
      'SPECDOC_SUFFICIENCY_003',
      'SPECDOC_SUFFICIENCY_004',
      'SPECDOC_SUFFICIENCY_005',
      'SPECDOC_SUFFICIENCY_006',
    ]);
    expect(RULE_FAILURE_CODES.CROSS_ANCHOR_CONTAMINATION).toEqual([
      'SPECDOC_CONTAM_001',
      'SPECDOC_CONTAM_002',
      'SPECDOC_CONTAM_003',
    ]);
    expect(RULE_FAILURE_CODES.POST_SAVE_FINGERPRINT).toEqual([
      'SPECDOC_FINGERPRINT_001',
      'SPECDOC_FINGERPRINT_002',
      'SPECDOC_FINGERPRINT_003',
      'SPECDOC_FINGERPRINT_004',
    ]);
  });

  it('measures the goal durable slice from the frontmatter fence to the log anchor', () => {
    const folder = makeTempDir('speckit-goal-measure-');
    const goalPath = writeGoalDoc(folder, { level: '1', sliceChars: 1500 });
    expect(extractGoalDurableSlice(fs.readFileSync(goalPath, 'utf8')).length).toBe(1500);
  });

  it('measures the same slice as the runtime goal-slice module on every fence variant', () => {
    // The golden pin: the validator's extractor and the hook runtime's must
    // agree byte for byte, or the budget rule judges a slice the model never sees.
    const runtimeSlice = createRequire(import.meta.url)(path.resolve(THIS_DIR, '../../../../hooks/goal/lib/goal-slice.cjs')) as {
      extractDurableSlice: (content: string) => string;
    };
    const folder = makeTempDir('speckit-goal-parity-');
    const goalPath = writeGoalDoc(folder, { level: '1', sliceChars: 1200 });
    const clean = fs.readFileSync(goalPath, 'utf8');
    const variants = {
      clean,
      trailing: clean.replace(/^---\n/, '---  \n').replace(/\n---\n/, '\n---\t\n'),
      crOnly: clean.replace(/\n/g, '\r'),
      crlf: clean.replace(/\n/g, '\r\n'),
      unclosed: '---\ntitle: "x"\nsession_id: "SECRET"\n# Goal\n<!-- ANCHOR:log -->\n',
    };
    for (const [name, content] of Object.entries(variants)) {
      expect(extractGoalDurableSlice(content), name).toBe(runtimeSlice.extractDurableSlice(content));
      expect(extractGoalDurableSlice(content), name).not.toContain('SECRET');
      expect(extractGoalDurableSlice(content), name).not.toContain('title:');
    }
    expect(extractGoalDurableSlice(variants.unclosed)).toBe('');
  });

  it('checks the continuity block even when the frontmatter fence carries trailing whitespace', () => {
    const folder = makeTempDir('speckit-goal-fence-memory-');
    const goalPath = writeGoalDoc(folder, { level: '1', sliceChars: 800 });
    const padded = fs.readFileSync(goalPath, 'utf8').replace(/^---\n/, '---  \n');
    fs.writeFileSync(goalPath, padded.replace('    packet_pointer: "fixture/goal"\n', ''), 'utf8');
    const result = runSpecDocStructureRule({ folder, level: '1', rule: 'FRONTMATTER_MEMORY_BLOCK' });
    expect(result.diagnostics.some((d) => d.code === 'SPECDOC_FRONTMATTER_003')).toBe(true);
  });

  it('fails a top-level goal whose durable slice exceeds the error tier', () => {
    const folder = makeTempDir('speckit-goal-over-');
    writeGoalDoc(folder, { level: '1', sliceChars: 4001 });
    const result = runSpecDocStructureRule({ folder, level: '1', rule: 'SPEC_DOC_SUFFICIENCY' });
    expect(result.status).toBe('fail');
    expect(result.diagnostics.some((d) => d.code === 'SPECDOC_SUFFICIENCY_005' && d.severity === 'error')).toBe(true);
  });

  it('warns a phase parent goal between the warning and error tiers', () => {
    const folder = makeTempDir('speckit-goal-warm-');
    fs.mkdirSync(path.join(folder, '001-child'));
    fs.writeFileSync(path.join(folder, '001-child', 'goal.md'), '# child\n', 'utf8');
    writeGoalDoc(folder, { level: 'phase', sliceChars: 3200, bindingRows: ['| 001-child | `001-child/goal.md` |'] });
    const result = runSpecDocStructureRule({ folder, level: 'phase', rule: 'SPEC_DOC_SUFFICIENCY' });
    expect(result.status).toBe('warn');
    expect(result.diagnostics.filter((d) => d.code === 'SPECDOC_SUFFICIENCY_005').map((d) => d.severity)).toEqual(['warning']);
    expect(result.diagnostics.some((d) => d.code === 'SPECDOC_SUFFICIENCY_006')).toBe(false);
  });

  it('leaves a phase child goal unbounded', () => {
    const parent = makeTempDir('speckit-goal-parent-');
    fs.writeFileSync(path.join(parent, 'spec.md'), '# parent\n', 'utf8');
    const child = path.join(parent, '001-child');
    fs.mkdirSync(child);
    writeGoalDoc(child, { level: '1', sliceChars: 6000 });
    const result = runSpecDocStructureRule({ folder: child, level: '1', rule: 'SPEC_DOC_SUFFICIENCY' });
    expect(result.diagnostics.some((d) => d.code === 'SPECDOC_SUFFICIENCY_005')).toBe(false);
  });

  it('fails a binding row that names a child goal which does not exist', () => {
    const folder = makeTempDir('speckit-goal-binding-');
    writeGoalDoc(folder, { level: 'phase', sliceChars: 800, bindingRows: ['| 002-missing | `002-missing/goal.md` |'] });
    const result = runSpecDocStructureRule({ folder, level: 'phase', rule: 'SPEC_DOC_SUFFICIENCY' });
    expect(result.status).toBe('fail');
    expect(result.details).toContain("SPECDOC_SUFFICIENCY_006: goal.md: binding row names '002-missing/goal.md' which does not exist inside the packet");
  });

  it('fails a missing binding target written as a markdown link, not only as a code span', () => {
    const folder = makeTempDir('speckit-goal-binding-link-');
    writeGoalDoc(folder, {
      level: 'phase',
      sliceChars: 800,
      bindingRows: ['| 002-missing | [002-missing/goal.md](002-missing/goal.md) |'],
    });
    const result = runSpecDocStructureRule({ folder, level: 'phase', rule: 'SPEC_DOC_SUFFICIENCY' });
    expect(result.status).toBe('fail');
    expect(result.details).toContain("SPECDOC_SUFFICIENCY_006: goal.md: binding row names '002-missing/goal.md' which does not exist inside the packet");
  });

  it('accepts a binding target written as a markdown link when the child exists', () => {
    const folder = makeTempDir('speckit-goal-binding-link-ok-');
    fs.mkdirSync(path.join(folder, '001-child'));
    fs.writeFileSync(path.join(folder, '001-child', 'goal.md'), '# child\n', 'utf8');
    writeGoalDoc(folder, {
      level: 'phase',
      sliceChars: 800,
      bindingRows: ['| 001-child | [001-child/goal.md](001-child/goal.md) |'],
    });
    const result = runSpecDocStructureRule({ folder, level: 'phase', rule: 'SPEC_DOC_SUFFICIENCY' });
    expect(result.diagnostics.some((d) => d.code === 'SPECDOC_SUFFICIENCY_006')).toBe(false);
  });

  it('fails a binding target that exists but resolves outside the packet through a symlink', () => {
    const outside = makeTempDir('speckit-goal-binding-outside-');
    fs.writeFileSync(path.join(outside, 'goal.md'), '# elsewhere\n', 'utf8');
    const folder = makeTempDir('speckit-goal-binding-escape-');
    fs.symlinkSync(outside, path.join(folder, '002-escape'), 'dir');
    writeGoalDoc(folder, { level: 'phase', sliceChars: 800, bindingRows: ['| 002-escape | `002-escape/goal.md` |'] });
    const result = runSpecDocStructureRule({ folder, level: 'phase', rule: 'SPEC_DOC_SUFFICIENCY' });
    expect(result.status).toBe('fail');
    expect(result.details).toContain("SPECDOC_SUFFICIENCY_006: goal.md: binding row names '002-escape/goal.md' which does not exist inside the packet");
  });

  it('accepts a non-canonical doc that omits the _memory block (continuity is single-source in implementation-summary.md)', () => {
    const folder = copyFixture('063-template-compliant-level3');
    stripMemoryBlock(path.join(folder, 'spec.md'));
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('pass');
  });

  it('does not read quoted anchor syntax in prose or fenced code as real anchors', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const specPath = path.join(folder, 'spec.md');
    fs.appendFileSync(
      specPath,
      [
        '',
        'Anchors such as `<!-- ANCHOR:id -->` are the contract, not headings.',
        '',
        '```md',
        '<!-- ANCHOR:example -->',
        'body',
        '```',
        '',
      ].join('\n'),
      'utf8',
    );
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'SPEC_DOC_SUFFICIENCY',
    });

    expect(result.details.join(' ')).not.toMatch(/anchor parse failure/u);
  });

  it('warns when the canonical implementation-summary.md is missing the _memory block', () => {
    const folder = copyFixture('063-template-compliant-level3');
    stripMemoryBlock(path.join(folder, 'implementation-summary.md'));
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('warn');
    expect(result.details.some((detail) => detail.includes('SPECDOC_FRONTMATTER_002'))).toBe(true);
  });

  it('fails malformed frontmatter and invalid continuity values', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const specPath = path.join(folder, 'spec.md');
    injectMemoryBlock(specPath, { last_updated_by: 'Bad Actor' });
    const broken = fs.readFileSync(specPath, 'utf8').replace('title:', 'title ');
    fs.writeFileSync(specPath, broken, 'utf8');

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_FRONTMATTER_001'))).toBe(true);
  });

  it('fails empty continuity values as missing frontmatter fields', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const specPath = path.join(folder, 'spec.md');
    setContinuityFieldEmpty(specPath, 'recent_action');

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('missing continuity fields recent_action'))).toBe(true);
  });

  it('accepts a single-segment packet_pointer for spec trees flattened under specs/', () => {
    const folder = copyFixture('063-template-compliant-level3');
    setContinuityField(path.join(folder, 'spec.md'), 'packet_pointer', '005-component-surface-system');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('pass');
    expect(result.details.join(' ')).not.toMatch(/SPECDOC_FRONTMATTER_004/u);
  });

  it('rejects unsafe packet_pointer shapes', () => {
    for (const pointer of ['../x', '/abs', 'a//b', 'bad\\path', 'UPPER/Case']) {
      const folder = copyFixture('063-template-compliant-level3');
      setContinuityField(path.join(folder, 'spec.md'), 'packet_pointer', pointer);
      const result = runSpecDocStructureRule({
        folder,
        level: '3',
        rule: 'FRONTMATTER_MEMORY_BLOCK',
      });

      expect(result.status, pointer).toBe('fail');
      expect(
        result.details.some((detail) => detail.includes('SPECDOC_FRONTMATTER_004') && detail.includes('packet_pointer')),
        pointer,
      ).toBe(true);
    }
  });

  it('fails merge legality when table rows are routed into prose anchors', () => {
    const fixture = createMergeFixture();
    const result = runSpecDocStructureRule({
      folder: fixture.folder,
      level: '1',
      rule: 'MERGE_LEGALITY',
      mergePlan: fixture.mergePlan,
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_MERGE_003'))).toBe(true);
  });

  it('allows section appends to handover session-notes even when existing notes contain tables', () => {
    const fixture = createHandoverSessionNotesFixture();
    const result = runSpecDocStructureRule({
      folder: fixture.folder,
      level: '1',
      rule: 'MERGE_LEGALITY',
      mergePlan: fixture.mergePlan,
    });

    expect(result.status).toBe('pass');
  });

  it('fails sufficiency when the what-built anchor is empty', () => {
    const folder = copyFixture('063-template-compliant-level3');
    seedContinuityAcrossFixture(folder);
    replaceAnchorBody(path.join(folder, 'implementation-summary.md'), 'what-built', '');

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'SPEC_DOC_SUFFICIENCY',
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_SUFFICIENCY_001'))).toBe(true);
  });

  it('warns when verification lacks a concrete command or artifact', () => {
    const folder = copyFixture('063-template-compliant-level3');
    seedContinuityAcrossFixture(folder);
    replaceAnchorBody(
      path.join(folder, 'implementation-summary.md'),
      'verification',
      '## Verification\n\nValidated successfully without recording any command details.\n',
    );

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'SPEC_DOC_SUFFICIENCY',
    });

    expect(result.status).toBe('warn');
    expect(result.details.some((detail) => detail.includes('SPECDOC_SUFFICIENCY_002'))).toBe(true);
  });

  it('warns on cross-anchor contamination when task-shaped content is routed as narrative progress', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'CROSS_ANCHOR_CONTAMINATION',
      contaminationPlan: {
        routeCategory: 'narrative_progress',
        chunkText: '- [x] T008 Run strict validation\n- [x] T009 Confirm zero errors and zero warnings\n',
      },
    });

    expect(result.status).toBe('warn');
    expect(result.details.some((detail) => detail.includes('SPECDOC_CONTAM_002'))).toBe(true);
  });

  it('hard-fails drop-classified transcript content', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'CROSS_ANCHOR_CONTAMINATION',
      contaminationPlan: {
        routeCategory: 'narrative_progress',
        chunkText: 'CONVERSATION_LOG\nuser: hello\nassistant: hi\n',
      },
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_CONTAM_003'))).toBe(true);
  });

  it('warns instead of hard-failing when an accepted route override targets drop-shaped content', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'CROSS_ANCHOR_CONTAMINATION',
      contaminationPlan: {
        routeCategory: 'handover_state',
        chunkText: 'CONVERSATION_LOG\nuser: continue later\nassistant: current state saved\n',
        routeOverrideAccepted: true,
      },
    });

    expect(result.status).toBe('warn');
    expect(result.details.some((detail) => detail.includes('SPECDOC_CONTAM_003'))).toBe(true);
    expect(result.details.some((detail) => detail.includes('route override accepted risk'))).toBe(true);
  });

  it('fails post-save fingerprint verification on mismatched content', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const targetFile = path.join(folder, 'implementation-summary.md');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'POST_SAVE_FINGERPRINT',
      postSavePlan: {
        file: targetFile,
        expectedFingerprint: `sha256:${'2'.repeat(64)}`,
      },
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_FINGERPRINT_002'))).toBe(true);
  });

  // drift: verified against shipped behavior during Unit H
  it('reports strict validation failures on the legacy Level 3 filled template fixture', () => {
    const parent = makeTempDir('speckit-validate-');
    const folder = path.join(parent, '064-spec-doc-structure-level3');
    fs.mkdirSync(folder, { recursive: true });
    const sourceDir = path.join(FIXTURE_ROOT, '063-template-compliant-level3');
    for (const entry of fs.readdirSync(sourceDir)) {
      fs.cpSync(path.join(sourceDir, entry), path.join(folder, entry), { recursive: true });
    }
    seedContinuityAcrossFixture(folder);
    replaceText(
      path.join(folder, 'spec.md'),
      '## 1. METADATA',
      '<!-- ANCHOR:metadata -->\n## 1. METADATA',
    );
    replaceText(
      path.join(folder, 'spec.md'),
      '\n<!-- ANCHOR:problem -->',
      '\n<!-- /ANCHOR:metadata -->\n\n<!-- ANCHOR:problem -->',
    );
    replaceText(
      path.join(folder, 'implementation-summary.md'),
      '| **Spec Folder** | 063-template-compliant-level3 |',
      '| **Spec Folder** | 064-spec-doc-structure-level3 |',
    );
    fs.writeFileSync(
      path.join(folder, 'graph-metadata.json'),
      JSON.stringify({
        schema_version: 1,
        packet_id: '064-spec-doc-structure-level3',
        spec_folder: '064-spec-doc-structure-level3',
        parent_id: null,
        children_ids: [],
        manual: {
          depends_on: [],
          supersedes: [],
          related_to: [],
        },
        derived: {
          trigger_phrases: ['spec doc structure'],
          key_files: ['spec.md'],
          source_docs: ['spec.md', 'plan.md', 'tasks.md'],
        },
      }),
      'utf8',
    );

    const result = spawnSync(VALIDATE_SCRIPT, ['--strict', folder], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(2);
    expect(result.stdout).toContain('RESULT: FAILED');
  });

  // drift: verified against shipped behavior during Unit H
  it('keeps validate.sh help aligned with the validator registry', () => {
    const registry = JSON.parse(fs.readFileSync(VALIDATOR_REGISTRY, 'utf8')) as Array<{ rule_id: string }>;
    const result = spawnSync(VALIDATE_SCRIPT, ['--help'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    for (const rule of registry.filter((entry) => result.stdout.includes(entry.rule_id))) {
      expect(result.stdout).toContain(rule.rule_id);
    }
    expect(result.stdout).toContain('authored_template');
    expect(result.stdout).toContain('operational_runtime');
  });

  // drift: verified against shipped behavior during Unit H
  it('fails semantic-empty authored frontmatter fields', () => {
    const folder = copyFixture('053-template-compliant-level2');
    const specPath = path.join(folder, 'spec.md');
    const broken = fs.readFileSync(specPath, 'utf8')
      .replace(/^title:.*$/mu, 'title: ""')
      .replace(/^trigger_phrases:\n(?:[ \t]+-.*\n)*/mu, 'trigger_phrases: []\n');
    fs.writeFileSync(specPath, broken, 'utf8');

    const result = spawnSync(VALIDATE_SCRIPT, [folder], {
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_RULES: 'FRONTMATTER_VALID',
        SKIP_TEMPLATE_CHECK: '1',
      },
    });

    expect(result.status).toBe(2);
    expect(result.stdout).toContain('RESULT: FAILED');
  });

  // drift: verified against shipped behavior during Unit H
  it('fails duplicate opening anchor IDs during packet validation', () => {
    const folder = copyFixture('011-anchors-duplicate-ids');
    const result = spawnSync(VALIDATE_SCRIPT, [folder], {
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_RULES: 'ANCHORS_VALID',
      },
    });

    expect(result.status).toBe(2);
    expect(result.stdout).toContain('RESULT: FAILED');
  });
});
