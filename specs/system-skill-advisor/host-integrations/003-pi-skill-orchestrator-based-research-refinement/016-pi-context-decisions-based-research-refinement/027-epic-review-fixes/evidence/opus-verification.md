# Opus verification of commit 98d7830402b

A fresh native Opus 5.5 subagent at high effort reviewed commit `98d7830402b` read-only on 2026-11-22. This is its report as returned, kept as the source for the second round of fixes.

## Verdicts
- **F1, calibration override has no caller: FIXED.** `resolvedCalibration` and `RoutingCalibrationOverride` are deleted from `scoring-constants.ts`, as are the `.env.example` row and the `ENV-REFERENCE.md` row. A search for `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON`, `resolvedCalibration` or `RoutingCalibrationOverride` outside specs/, changelog/ and dist/ finds nothing.
- **F2, overrides not forwarded to the daemon: PARTIAL.** Both keys are in the launcher allowlist (`.skilled/bin/system-skill-advisor-launcher.cjs:142-143`), and the daemon spawn uses that env (`createChildEnv()`, `:1428`). The Python native bridge still drops both keys (`runtime/scripts/skill_advisor.py:214-235`). See D1.
- **F3, eval script imports a deleted module: FIXED.** The script is deleted, along with its README row, its mention in the `labeled-prompts.jsonl` row and its holdout consumer entry (`tests/parity/holdout-independent.vitest.ts:88-95`). No reference remains.
- **F4, lane cleanup pinned by wording only: FIXED.** A new test runs both commands (`.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:252-293`). A mutation run in scratch showed it bites. One gap remains, D4.
- **F5, query-class routing and the BM25 query-length switch unreachable: FIXED.** Both are deleted. `fusion.ts:156` `effectiveScorerWeights` takes the override only, and `lanes/bm25.ts:21` uses a fixed midpoint of 4.
- **F6, dead scoring inputs: FIXED.** The `hasExplicitWorkflowSignal` helper and parameter and `semanticSearchCodeGraphBonus` are gone. `EXPLICIT_WORKFLOW_SIGNAL_FLOOR` is still used by `hasSlashCommandAnchor` (`fusion.ts:436-443`). A comment and a catalog line that described the deleted signal are now stale, D3.
- **F7, Python fallback boosts the retired vocabulary: FIXED,** plus `voyage` and the trimmed `SYNONYM_MAP["memory"]` (`skill_advisor.py:1793`).
- **Leftovers:** the dist orphans and the projection fixture are FIXED. The pinned refusal tests, the `skill-graph-db.vitest.ts` fixture, the dated approval reason, the `OLLAMA_` prefix forward and the two prompt texts are INTENTIONALLY LEFT. Repo-mode residue reports `live : 0`.
- **Default native scoring: unchanged.** Every removed branch was dead under the default environment.
- **Python fallback scoring: changed, by design.** With the old entries restored in-process (A/B), "update the voyage embeddings config" moved top-1 from system-spec-kit to mcp-code-mode. Four other prompts kept their top-1.
- **Launcher test bites:** inferred from code. `toEqual` on the exact key set (`tests/launcher-bootstrap.vitest.ts:181-187`) fails if either key leaves the allowlist.
- **Doctor test bites:** mutation-run. `--format-json`, `--dry-run`, `--format json` and `[--shared-model remove|keep]` each turned it red.

## Defects
1. **P2 `runtime/scripts/skill_advisor.py:214-235` (used at `:664-671`).** The Python native bridge drops the two location keys, so `python3 skill_advisor.py "<prompt>"` and the compat `buildSkillAdvisorBrief` (`runtime/lib/skill-advisor-brief.ts:541`) score in a child that reads the packaged config. Read from code, not run.
2. **P2, pre-existing.** The Python fallback ignores route exclusions entirely. Neither `skill_advisor.py` nor `skill_advisor_runtime.py` filters excluded ids at score time. `skill_graph_compiler.py:34` hard-codes the config folder. In degraded mode an excluded skill can be recommended. Inferred, not run.
3. **P2 `runtime/lib/scorer/executor-delegation.ts:65` and `feature-catalog/scorer-fusion/executor-delegation.md:39`.** Both describe the 0.55 floor as "the floor fusion applies to its own explicit workflow signal", which this commit deleted.
4. **P2 `doctor-update-contract.test.cjs:274`.** The new test only passes `--shared-model keep`. It never runs `delete`, the value an operator's yes binds, or the apply form with no answer that the YAML prescribes for an empty askFirst.
5. **P2, pre-existing, same class as F1.** `.env.example:320-323` documents four alert-threshold keys that no production code reads. Only `getAdvisorHookAlertThresholds` (`runtime/lib/metrics.ts:370-376`) reads them, and only a test calls it.

## Checks run
- `npm run typecheck` in the advisor runtime: exit 0.
- `npx vitest run`, full suite: exit 0, 178 files, 2450 passed, 4 skipped.
- `python3 tests/python/test_skill_advisor.py`: exit 0, `pass=123, fail=0`.
- `node --test doctor-update-contract.test.cjs`: exit 0, 21 of 21.
- `sweep-lane-residue.mjs repo`: exit 0, `live : 0`, 47 allowlisted.
- Mutation copies of the doctor test in scratch: four mutations each failed, the unmodified copy passed.

## Not checked
The launcher test was not mutation-run. No live daemon probe with either key set, and the Python bridge and degraded path were not run with a real denylist. The generated JSON diffs were skimmed only. The Pi, Vibe and OpenCode adapters were not read for further env allowlists.
