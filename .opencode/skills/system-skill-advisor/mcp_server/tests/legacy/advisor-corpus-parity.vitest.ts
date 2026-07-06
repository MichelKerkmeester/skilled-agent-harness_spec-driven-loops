// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Corpus Parity Tests
// ───────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import {
  readFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
}

interface ParityRegression {
  readonly id: string;
  readonly prompt: string;
  readonly expected_top_1: string | null;
  readonly cli_top_1: string | null;
  readonly hook_top_1: string | null;
}

// Reviewed-accepted top-1 divergences: rows the Python reference gets right but
// the native scorer does not, ordered as they occur in the corpus. These are the
// saturation-class misroutes (sk-code losing to sk-doc/sk-prompt/system-spec-kit,
// code-graph losing to deep-loop-workflows) that the explicit-lane demotion root
// fix targets; prune entries here as that fix resolves them.
const ACCEPTED_PARITY_REGRESSION_IDS: string[] = [
  'rr-iter2-016',
  'rr-iter2-020',
  'rr-iter2-060',
  'rr-iter3-093',
  'rr-iter3-100',
  'rr-iter3-104',
];

const workspaceRoot = findAdvisorWorkspaceRoot(import.meta.dirname);
const corpusPath = join(
  workspaceRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl',
);
function loadCorpus(): CorpusRow[] {
  return readFileSync(corpusPath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow);
}

function directPythonTopSkills(rows: readonly CorpusRow[]): Array<string | null> {
  const script = `
import importlib.util, json, os, sys
workspace = sys.argv[1]
path = os.path.join(workspace, '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor', path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
prompts = json.loads(sys.stdin.read())
out = []
for prompt in prompts:
    recs = mod.analyze_prompt(prompt=prompt, confidence_threshold=0.8, uncertainty_threshold=0.35, confidence_only=False, show_rejections=False)
    out.append(recs[0]['skill'] if recs else None)
print(json.dumps(out))
`;
  const output = execFileSync('python3', ['-c', script, workspaceRoot], {
    input: JSON.stringify(rows.map((row) => row.prompt)),
    cwd: workspaceRoot,
    env: {
      ...process.env,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    },
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
    timeout: 120_000,
  });
  return JSON.parse(output) as Array<string | null>;
}

function goldSkill(row: CorpusRow): string | null {
  return row.skill_top_1 === 'none' ? null : row.skill_top_1;
}

describe('advisor 193-prompt corpus regression-protection parity', () => {
  it('preserves Python-correct top-1 decisions while allowing native improvements', async () => {
    const previousSemantic = process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC;
    process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';

    try {
      const rows = loadCorpus();
      // Removed 3 mcp-clickup-related rows from the labeled corpus
      // (rr-iter2-056, rr-iter3-181, plus one peer): 200 -> 197.
      // Removed 4 mcp-figma-related rows when the mcp-figma skill
      // was retired in favor of the AI_Systems Figma MCP Agent: 197 -> 193.
      expect(rows).toHaveLength(193);
      const pythonTopSkills = directPythonTopSkills(rows);
      expect(pythonTopSkills).toHaveLength(rows.length);

      const regressions: ParityRegression[] = [];
      let pythonCorrect = 0;
      let hookPreservedPythonCorrect = 0;
      let pythonGoldNoneFalseFire = 0;
      let hookGoldNoneFalseFire = 0;
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const expected = goldSkill(row);
        const cliTopSkill = pythonTopSkills[index] ?? null;
        const hookTopSkill = scoreAdvisorPrompt(row.prompt, { workspaceRoot }).topSkill;
        if (expected === null && cliTopSkill !== null) {
          pythonGoldNoneFalseFire += 1;
        }
        if (expected === null && hookTopSkill !== null) {
          hookGoldNoneFalseFire += 1;
        }
        if (cliTopSkill === expected) {
          pythonCorrect += 1;
          if (hookTopSkill === expected) {
            hookPreservedPythonCorrect += 1;
          } else {
            regressions.push({
              id: row.id,
              prompt: row.prompt,
              expected_top_1: expected,
              cli_top_1: cliTopSkill,
              hook_top_1: hookTopSkill,
            });
          }
        }
      }

      // On the current 193-row corpus the Python reference scorer (built-in
      // semantic disabled for determinism) makes 105 gold-correct top-1 calls;
      // the native/hook scorer preserves 99 of them. The remaining Python-correct
      // rows the native scorer diverges on are enumerated and reviewed-accepted
      // below, pending the explicit-lane demotion root fix expected to shrink them.
      expect(pythonCorrect).toBe(105);
      expect(hookPreservedPythonCorrect).toBe(99);
      expect(hookGoldNoneFalseFire).toBeLessThanOrEqual(pythonGoldNoneFalseFire);
      expect(
        regressions.map((regression) => regression.id),
        JSON.stringify(regressions.slice(0, 10), null, 2),
      ).toEqual(ACCEPTED_PARITY_REGRESSION_IDS);
    } finally {
      if (previousSemantic === undefined) {
        delete process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC;
      } else {
        process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = previousSemantic;
      }
    }
  }, 240_000);
});
