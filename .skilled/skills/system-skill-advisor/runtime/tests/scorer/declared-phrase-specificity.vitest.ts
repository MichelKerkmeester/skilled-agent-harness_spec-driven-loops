// ───────────────────────────────────────────────────────────────
// MODULE: Declared Phrase Specificity Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'fixture',
    category: 'fixture',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

// The generic surface declares two bare words in both of the fields the
// explicit lane reads: graph-metadata intent_signals and the SKILL.md keyword
// list. An outside repository's surface often looks like this. The two hubs
// each declare one exact two-word phrase and nothing else.
const GENERIC_SURFACE = skill({
  id: 'fixture-generic-surface',
  description: 'Frontend surface evidence: CSS, HTML and JavaScript standards, browser debugging and verification.',
  domains: ['frontend', 'css', 'html', 'javascript', 'browser-debugging'],
  intentSignals: ['html', 'css', 'javascript', 'browser'],
  keywords: ['browser', 'css'],
  derivedTriggers: ['frontend implementation standards', 'frontend'],
  derivedKeywords: ['frontend', 'css', 'html', 'javascript', 'browser-debugging'],
});
const AUTOMATION_HUB = skill({ id: 'fixture-automation-hub', intentSignals: ['browser agent'] });
const DESIGN_HUB = skill({ id: 'fixture-design-hub', intentSignals: ['css extraction'] });
// A specific multi-word phrase declared in both fields, the shape shipped hubs
// use on purpose.
const NOTES_HUB = skill({
  id: 'fixture-notes-hub',
  intentSignals: ['markdown notes'],
  keywords: ['markdown notes'],
});

const PROJECTION = createFixtureProjection([GENERIC_SURFACE, AUTOMATION_HUB, DESIGN_HUB, NOTES_HUB]);

function explicitScore(prompt: string, skillId: string): number {
  return scoreExplicitLane(prompt, PROJECTION).find((match) => match.skillId === skillId)?.score ?? 0;
}

function explicitEvidence(prompt: string, skillId: string): readonly string[] {
  return scoreExplicitLane(prompt, PROJECTION).find((match) => match.skillId === skillId)?.evidence ?? [];
}

describe('declared phrase specificity', () => {
  it.each([
    ['browser agent', 'fixture-automation-hub', 'browser'],
    ['css extraction', 'fixture-design-hub', 'css'],
  ])('an exact declared phrase outranks a bare word declared twice: %s', (prompt, hub, word) => {
    expect(scoreAdvisorPrompt(prompt, { workspaceRoot: process.cwd(), projection: PROJECTION }).topSkill).toBe(hub);
    expect(explicitScore(prompt, hub)).toBeGreaterThan(explicitScore(prompt, GENERIC_SURFACE.id));
    // One declared word is one piece of author evidence, wherever it is declared.
    expect(explicitEvidence(prompt, GENERIC_SURFACE.id)).toEqual([`author:${word}`]);
  });

  it('still adds distinct declared words together', () => {
    // Control: dedup removes a repeat, not a second real match.
    expect(explicitEvidence('browser css', GENERIC_SURFACE.id)).toEqual(['author:css', 'author:browser']);
    expect(explicitScore('browser css', GENERIC_SURFACE.id)).toBe(1);
  });

  it('keeps a multi-word phrase declared in both fields counting twice', () => {
    // Only a bare word collapses; a specific phrase keeps the weight routes rest on.
    expect(explicitEvidence('markdown notes', NOTES_HUB.id))
      .toEqual(['author:markdown notes', 'author:markdown notes']);
    expect(explicitScore('markdown notes', NOTES_HUB.id)).toBe(1);
  });
});

// The same declarations as a skills root the Python fallback scorer reads: SKILL.md
// keywords plus graph signals, which is how a real skill reaches both scorers.
const PYTHON_FIXTURES = [
  { name: 'fixture-generic-surface', description: 'Fixture surface for front-end work.', keywords: ['browser', 'css'], signals: ['browser', 'css'] },
  { name: 'fixture-automation-hub', description: 'Fixture hub for automation work.', keywords: [], signals: ['browser agent'] },
  { name: 'fixture-design-hub', description: 'Fixture hub for style capture.', keywords: [], signals: ['css extraction'] },
] as const;
const CROSS_SCORER_CASES = [
  ['browser agent', 'fixture-automation-hub'],
  ['css extraction', 'fixture-design-hub'],
] as const;

const PYTHON_ADVISOR = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts/skill_advisor.py');

// Loads the scorer, points it at the fixture root with no SQLite graph and an
// in-memory signal map, and prints each prompt's top skill.
const PYTHON_RUNNER = `
import importlib.util, json, os, sys
script, root, payload = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
sys.path.insert(0, os.path.dirname(script))
spec = importlib.util.spec_from_file_location("skill_advisor", script)
advisor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(advisor)
advisor.SKILLS_DIR = root
advisor.SKILL_GRAPH_SQLITE_PATH = os.path.join(root, "absent.sqlite")
advisor._SKILL_GRAPH = {
    "schema_version": 1, "skill_count": len(payload["fixtures"]),
    "families": {"fixture": [f["name"] for f in payload["fixtures"]]},
    "adjacency": {}, "signals": {f["name"]: f["signals"] for f in payload["fixtures"]},
    "conflicts": [], "topology_warnings": {},
}
advisor._SKILL_GRAPH_SOURCE = "json"
advisor.COMMAND_BRIDGES = {}
advisor.get_skills(force_refresh=True)
tops = {}
for prompt in payload["prompts"]:
    ranked = advisor.analyze_request(prompt)
    tops[prompt] = ranked[0]["skill"] if ranked else None
print(json.dumps(tops))
`;

function writePythonFixtureRoot(root: string): void {
  for (const fixture of PYTHON_FIXTURES) {
    const directory = join(root, fixture.name);
    mkdirSync(directory);
    const keywordLine = fixture.keywords.length > 0 ? `<!-- Keywords: ${fixture.keywords.join(', ')} -->\n` : '';
    writeFileSync(
      join(directory, 'SKILL.md'),
      `---\nname: ${fixture.name}\ndescription: ${fixture.description}\n---\n${keywordLine}\n# ${fixture.name}\n`,
    );
    writeFileSync(
      join(directory, 'graph-metadata.json'),
      JSON.stringify({ schema_version: 2, skill_id: fixture.name, intent_signals: fixture.signals }),
    );
  }
}

describe('declared phrase specificity across both scorers', () => {
  it('ranks the declaring hub first in TypeScript and in the Python fallback alike', () => {
    const projection = createFixtureProjection(PYTHON_FIXTURES.map((fixture) => skill({
      id: fixture.name,
      description: fixture.description,
      keywords: [...fixture.keywords],
      intentSignals: [...fixture.signals],
    })));
    const root = mkdtempSync(join(tmpdir(), 'declared-phrase-python-'));
    try {
      writePythonFixtureRoot(root);
      const payload = JSON.stringify({ fixtures: PYTHON_FIXTURES, prompts: CROSS_SCORER_CASES.map(([prompt]) => prompt) });
      const result = spawnSync('python3', ['-c', PYTHON_RUNNER, PYTHON_ADVISOR, root, payload], {
        encoding: 'utf8',
        env: { ...process.env, SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1', SPECKIT_SKILL_ADVISOR_FORCE_LOCAL: '1' },
      });
      expect(result.status, result.stderr).toBe(0);
      const pythonTops = JSON.parse(result.stdout.trim().split('\n').at(-1) ?? '{}') as Record<string, string | null>;
      for (const [prompt, hub] of CROSS_SCORER_CASES) {
        const nativeTop = scoreAdvisorPrompt(prompt, { workspaceRoot: process.cwd(), projection, includeAllCandidates: true })
          .recommendations[0]?.skill ?? null;
        expect({ prompt, native: nativeTop, python: pythonTops[prompt] }).toEqual({ prompt, native: hub, python: hub });
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
