// ───────────────────────────────────────────────────────────────
// MODULE: sk-git Worktree Sweep Vocabulary Tests
// ───────────────────────────────────────────────────────────────
//
// The session-start sweep of numbered worktrees is sk-git's. These prompts
// reach sk-git only through the vocabulary its graph-metadata.json declares,
// so they run against the real metadata in the pinned force-local regime. The
// env is set before the scorer is imported because the scorer reads it at
// module load.

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const savedPrivateRoots = process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'sk-git-sweep-vocabulary-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
// Private local-* skills outside the checkout would change the ranking.
delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

const { scoreAdvisorPrompt } = await import('../../lib/scorer/fusion.js');

const workspaceRoot = findAdvisorWorkspaceRoot(here, {
  maxDepth: 20,
  sentinel: '.skilled/skills/system-spec-kit/SKILL.md',
});

afterAll(() => {
  if (savedPrivateRoots === undefined) delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
  else process.env.SPECKIT_PRIVATE_SKILL_ROOTS = savedPrivateRoots;
});

describe('sk-git worktree sweep vocabulary', () => {
  it.each([
    'how do I turn off the automatic worktree cleanup at session start',
    'disable the periodic session-start worktree cleanup',
  ])('routes a request to stop the sweep to sk-git without a tie: %s', (prompt) => {
    const result = scoreAdvisorPrompt(prompt, { workspaceRoot });
    expect(result.topSkill).toBe('sk-git');
    expect(result.ambiguous).toBe(false);
  });

  it('leaves a session-state cleanup that names no worktree off sk-git', () => {
    const result = scoreAdvisorPrompt('clean up the session state at session start', { workspaceRoot });
    expect(result.topSkill).not.toBe('sk-git');
  });
});
