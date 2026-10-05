// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Code Native Dispatch Docs
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

// A Claude Code session reads this guard when asked for a model at an effort level. Guidance that
// names agent definitions without saying subagents inherit the session's effort reads as "no
// matching definition, no such effort", and a session acts on that misreading.
describe('claude code native dispatch docs', () => {
  const skillDocs = [
    '.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md',
    '.hermes/skills/cli-claude-code/SKILL.md',
  ];

  it('says a subagent inherits the session effort and cites the official page', () => {
    for (const docPath of skillDocs) {
      const content = readWorkspaceFile(docPath);
      const guard = content.split('\n').find((line) => line.includes('You ARE Claude Code already'));

      expect(guard, `${docPath} should keep the self-invocation bullet`).toBeDefined();
      expect(guard, `${docPath} should say subagents run at the session's effort`).toContain("session's effort level");
      expect(guard, `${docPath} should limit definitions to a different level`).toContain('only for a level different');
      expect(guard, `${docPath} should cite the subagents page`).toContain('https://code.claude.com/docs/en/sub-agents');
      expect(content, `${docPath} should keep the guard comment aligned`).toContain("it inherits the session's effort");
      expect(content, `${docPath} should not require a definition to pin effort`).not.toContain('To pin an effort level, use an agent definition');
    }
  });
});
