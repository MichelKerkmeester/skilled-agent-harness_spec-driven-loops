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

// Reviewed-accepted top-1 divergence: a row the Python reference gets right but
// the native scorer does not, ordered as it occurs in the corpus. What remains is
// fusion-level or labeling-edge loss that single-lane explicit calibration does
// not cleanly resolve. This list must stay identical to the one in
// tests/parity/python-ts-parity.vitest.ts — both gates read the same corpus and
// the same two scorers. Prune entries here as targeted cross-lane work resolves
// them; rr-iter3-093, rr-iter3-145 and rr-iter3-146 each left the list that way.
const ACCEPTED_PARITY_REGRESSION_IDS: string[] = [
  'rr-iter3-092',
  'rr-iter3-097',
  'rr-iter3-099',
  'rr-hub6-204',
  'rr-hub6-207',
];

const workspaceRoot = findAdvisorWorkspaceRoot(import.meta.dirname);
const corpusPath = join(
  workspaceRoot,
  '.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/labeled-prompts.jsonl',
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
path = os.path.join(workspace, '.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py')
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

describe('advisor 195-prompt corpus regression-protection parity', () => {
  it('preserves Python-correct top-1 decisions while allowing native improvements', async () => {
    const previousSemantic = process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC;
    process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';

    try {
      const rows = loadCorpus();
      // The current labeled corpus retains the seven hub-routing rows added
      // for the mcp-tooling hub projection, so the authoritative size is 195.
      expect(rows).toHaveLength(195);
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

      // On the current 195-row corpus the Python reference scorer (built-in
      // semantic disabled for determinism) makes 112 gold-correct top-1 calls;
      // the native/hook scorer preserves 107 of them. The remaining
      // Python-correct rows the native scorer diverges on are enumerated and
      // reviewed-accepted above.
      //
      // Both numbers measure the reference, not a target: they move with the
      // labeled corpus, the Python scoring tables, and the compiled skill graph,
      // and the graph is a locally built artifact that can shift them with no
      // diff to show for it. Re-baseline only after checking the move is an
      // improvement — a pythonCorrect drop, or an id appearing in the regression
      // list that is not accepted above, is a regression to fix, not to record.
      expect(pythonCorrect).toBe(112);
      expect(hookPreservedPythonCorrect).toBe(107);
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
