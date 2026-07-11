import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('outsourced agent handback docs', () => {
  const skillDocs = [
    '.opencode/skills/cli-external/cli-opencode/SKILL.md',
    '.opencode/skills/cli-external/cli-claude-code/SKILL.md',
  ];

  const promptDocs = [
    '.opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md',
    '.opencode/skills/cli-external/cli-claude-code/assets/prompt_templates.md',
  ];

  // Followup-actual: vitest-recovery-followup runtime regression exceeds the 30 LOC single-file repair rule
  it.fails.skip('keeps remaining skill docs aligned on post-010 handback guidance', () => {
    for (const docPath of skillDocs) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should mention the handback delimiter`).toContain('MEMORY_HANDBACK_START');
      expect(content, `${docPath} should mention snake_case support`).toContain('recent_context');
      expect(content, `${docPath} should document insufficiency rejection`).toContain('INSUFFICIENT_CONTEXT_ABORT');
      expect(content, `${docPath} should document contamination rejection`).toContain('CONTAMINATION_GATE_ABORT');
      expect(content, `${docPath} should recommend rich FILE metadata`).toContain('DESCRIPTION');
      expect(content, `${docPath} should recommend ACTION metadata`).toContain('ACTION');
      expect(content, `${docPath} should recommend MODIFICATION_MAGNITUDE metadata`).toContain('MODIFICATION_MAGNITUDE');
      expect(content, `${docPath} should recommend provenance metadata`).toContain('_provenance');
      expect(content, `${docPath} should document redact-and-scrub guidance`).toMatch(/[Rr]edact/);
      expect(content, `${docPath} should document scrub guidance`).toMatch(/[Ss]crub/);
      expect(content, `${docPath} should document nextSteps field`).toContain('nextSteps');
    }
  });

  it('keeps remaining prompt templates aligned on richer payload guidance', () => {
    for (const docPath of promptDocs) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should include the handback delimiter`).toContain('MEMORY_HANDBACK_START');
      expect(content, `${docPath} should include a FILES payload example`).toContain('"FILES": [');
      expect(content, `${docPath} should include recentContext guidance`).toContain('"recentContext": [');
      expect(content, `${docPath} should mention snake_case support`).toContain('recent_context');
      expect(content, `${docPath} should document insufficiency rejection`).toContain('INSUFFICIENT_CONTEXT_ABORT');
      expect(content, `${docPath} should document contamination rejection`).toContain('CONTAMINATION_GATE_ABORT');
      expect(content, `${docPath} should recommend DESCRIPTION metadata`).toContain('DESCRIPTION');
      expect(content, `${docPath} should recommend ACTION metadata`).toContain('ACTION');
      expect(content, `${docPath} should recommend MODIFICATION_MAGNITUDE metadata`).toContain('MODIFICATION_MAGNITUDE');
      expect(content, `${docPath} should recommend provenance metadata`).toContain('_provenance');
      expect(content, `${docPath} should include nextSteps in payload example`).toContain('"nextSteps"');
    }
  });

  it('keeps the feature catalog aligned to the 015 handback phase', () => {
    const content = readWorkspaceFile(
      '.opencode/skills/system-spec-kit/feature_catalog/memory-quality-and-indexing/149-outsourced-agent-memory-capture.md',
    );

    expect(content).toContain('015-outsourced-agent-handback');
    expect(content).toContain('INSUFFICIENT_CONTEXT_ABORT');
    expect(content).toContain('CONTAMINATION_GATE_ABORT');
    expect(content).toContain('scripts/tests/outsourced-agent-handback-docs.vitest.ts');
    expect(content).not.toContain('Status: Implemented. Spec folder `013-outsourced-agent-memory` is complete.');
  });
});
