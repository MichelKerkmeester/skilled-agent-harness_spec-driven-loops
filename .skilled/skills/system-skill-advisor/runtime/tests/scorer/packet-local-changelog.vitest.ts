// ───────────────────────────────────────────────────────────────
// MODULE: Packet-Local Changelog Routing Tests
// ───────────────────────────────────────────────────────────────
//
// "packet-local changelog" is sk-doc's declared phrase, and the router
// vocabulary reach check probes it bare. Prompts this short sit under the
// prompt-time policy floor, so they are pinned here rather than in the golden
// fixture, which holds hook-routeable prompts. The scorer runs in the pinned
// force-local regime, set before the import because the scorer reads it at
// module load.

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const savedPrivateRoots = process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'packet-local-changelog-'));
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

describe('packet-local changelog routing', () => {
  it.each([
    'packet-local changelog',
    'Document a packet-local changelog.',
  ])('ranks sk-doc first when packet-local names the changelog: %s', (prompt) => {
    const result = scoreAdvisorPrompt(prompt, { workspaceRoot });
    expect(result.recommendations[0]?.skill).toBe('sk-doc');
  });
});
