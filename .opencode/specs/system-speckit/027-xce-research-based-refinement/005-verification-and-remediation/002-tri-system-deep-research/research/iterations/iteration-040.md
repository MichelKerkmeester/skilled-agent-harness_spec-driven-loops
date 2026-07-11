# Iteration 040 — Angle 40

**Angle:** Ambiguity margin calibration: dual 0.05 score/confidence margins — empirical false-positive/negative rates on real session prompts.

**Summary:** The dual 0.05 margins exist in the native scorer, but downstream brief rendering and Python fallback paths do not fully preserve them. Empirical calibration is currently blocked by a broken corpus scorer and by missing real-session ambiguity FP/FN instrumentation.

**Findings kept:** 5

## [P1][BROKEN-FEATURE] Routing corpus scorer cannot run from this repo root

- Evidence: Command: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/score-routing-corpus.py` -> `FileNotFoundError: [Errno 2] No such file or directory: '/Users/michelkerkmeester/MEGA/Development/Code_Environment/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py'`; source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/score-routing-corpus.py:20-33`
- Detail: The empirical harness for false-positive/false-negative rates is currently broken because `REPO_ROOT = SCRIPT_DIR.parents[6]` resolves one directory above `Public`. That prevents the scorer from loading `skill_advisor.py`, so the advertised corpus metrics cannot be produced read-only from the current workspace.
- Fix sketch: Resolve the repo root by walking upward to `.opencode/skills` or use the correct parent index for `SCRIPT_DIR`.

## [P1][BROKEN-FEATURE] Hook brief renderer misses score-only ambiguity

- Evidence: Implementation dual margin: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:7-34`; renderer confidence-only checks: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:166-174`, `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts:95-98`; feature claim: `.opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/ambiguity.md:22-27`
- Detail: The scorer marks ambiguity when either score gap or confidence gap is within 0.05, but the hook brief path decides ambiguity from confidence gap only. A real score-near-tie with confidence gap above 0.05 will carry scorer ambiguity yet render as a singular `use <skill>` brief, creating a false negative in the user-visible ambiguity signal.
- Fix sketch: Make brief/token-cap rendering consume `ambiguousWith` or the shared dual-margin predicate instead of rechecking confidence only.

## [P2][REFINEMENT] No empirical ambiguity FP/FN slice exists

- Evidence: Single synthetic fixture: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:422-430`, exposed as `top2Within005`: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:575-578`; corpus metrics are top-1/unknown/false-fire only: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:258-292`; corpus source mix command output: `{'rows': 193, 'source_type': Counter({'synthetic-realistic': 96, 'synthetic-edge': 48, 'paraphrased-realistic': 37, 'synthetic-command': 12})}`
- Detail: Current validation proves the ambiguity predicate on a fixture but does not measure false-positive or false-negative ambiguity rates over labeled real session prompts. The routing corpus also has no `real-session` source type and no ambiguity label, so it cannot answer the angle’s empirical calibration question.
- Fix sketch: Add an ambiguity-labeled session-prompt slice with expected ambiguous/non-ambiguous outcomes and report FP/FN counts separately from top-1 routing accuracy.

## [P2][BROKEN-FEATURE] Python fallback ambiguity abstention is confidence-only

- Evidence: Python fallback claims TS parity and clusters by confidence only: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2966-2991`; TypeScript dual-margin source: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:22-34`
- Detail: The fallback scorer’s low-information ambiguity path only considers candidates within 0.05 confidence and does not account for the score-margin side of the native predicate. During native-unavailable fallback, score-only near-ties can avoid abstention and produce a false-negative ambiguity behavior relative to TypeScript.
- Fix sketch: Either port a score-equivalent field into the Python fallback ambiguity path or explicitly restrict the fallback contract and tests to confidence-only behavior.

## [P2][DOC-DRIFT] Validation baseline docs name obsolete output fields

- Evidence: Docs request `slices.corpus.topOne`, `slices.holdout.topOne`, `slices.parity.passed`, `slices.safety.violations`, `telemetry.unknownCount`, `telemetry.lanesDominantCount`: `.opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:76-85`; actual schema uses `full_corpus_top1`, `holdout_top1`, `explicit_skill_top1_regression`, `adversarial_stuffing_blocked`, and `telemetry.diagnostics/outcomes`: `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:355-401`
- Detail: Operators following the calibration docs will look for fields that no longer exist in `advisor_validate`. This makes baseline collection harder and obscures the absence of ambiguity-specific FP/FN metrics.
- Fix sketch: Update the validation baseline reference to the current schema and add explicit guidance for any new ambiguity calibration slice.
