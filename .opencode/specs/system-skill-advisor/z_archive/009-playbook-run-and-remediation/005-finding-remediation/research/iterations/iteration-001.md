# Focus

F1 - corpus accuracy regression in `advisor_validate`: full-corpus top-1 is 98/193 (50.78%) and holdout top-1 is 17/40 (42.5%) against the documented 80.5%/77.5% baseline.

# Actions Taken

1. Read the TypeScript validation handler and confirmed the corpus source, holdout selection, strict gold-label matching, and regression-suite matching paths.
2. Read the scorer projection and alias code to check whether `sk-deep-research`/`sk-deep-review` are treated as aliases for `deep-research`/`deep-review` during validation.
3. Counted full-corpus and holdout gold labels for `sk-deep-research` and `sk-deep-review`, then reran the dist scorer with strict matching and alias-normalized matching.
4. Inspected the requested P0 cases and classified each as label drift, genuine scorer regression, or currently passing.

# Findings

## F1.1 Root-cause mechanism

The primary mechanism is validation-time strict string comparison against stale gold labels, not absence of aliases in the scorer library.

Evidence:
- `advisor_validate` loads the validation corpus from `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` at `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:159-163`.
- The handler treats `skill_top_1` as the gold skill ID, with only `none` normalized to `null`, at `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:214-216`.
- Full-corpus scoring compares `result.topSkill === expected` directly and increments per-skill matches only on the same direct equality at `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:265-275`.
- Regression cases also use direct membership, `expected.includes(top.skill)`, at `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:361-371`.
- The alias table already maps `sk-deep-research` into the `deep-research` group and `sk-deep-review` into the `deep-review` group at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13-26`, with alias helpers exported at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:47-56`.
- Those alias helpers are tested in `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:347-356`, but they are not imported or used in the validation handler. The repo-wide search found direct validation comparisons in `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:270`, `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:274`, and `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:370`.
- Live skill IDs are `deep-research` and `deep-review`, not `sk-deep-*`, from `.opencode/skills/deep-research/SKILL.md:2` and `.opencode/skills/deep-review/SKILL.md:2`. The projection uses `metadata.skill_id` or the directory name as `skillId` at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:254-278`.

## F1.2 Quantified share attributable to skill-ID drift

The full corpus has 53/193 stale deep-loop labels: 34 `sk-deep-research` and 19 `sk-deep-review`. The holdout has 11/40 stale deep-loop labels: 7 `sk-deep-research` and 4 `sk-deep-review`.

Evidence:
- The first stale deep labels appear in `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:18` and `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:24-26`.
- The deep-loop section continues through `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:161-172`.
- The validation holdout algorithm is deterministic and stratified at `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:218-233`.

Measured impact from the current dist scorer:
- Strict full-corpus accuracy: 98/193 = 50.78%.
- Alias-normalized full-corpus accuracy: 143/193 = 74.09%.
- Net recovered by alias-normalizing gold comparison: 45 cases, or 23.31 percentage points.
- Against the 80.5% baseline, the observed full-corpus drop is about 29.72 percentage points; alias drift accounts for 23.31 of those points, about 78% of the drop.
- Strict holdout accuracy: 17/40 = 42.5%.
- Alias-normalized holdout accuracy: 26/40 = 65.0%.
- Net recovered in holdout: 9 cases, or 22.5 percentage points. Against the 77.5% baseline, that is 9 of 14 missing holdout hits, about 64% of the drop.

Not every stale deep label becomes correct after alias normalization: 45/53 stale deep-loop rows are recovered, leaving 8 deep-loop rows that are genuine routing misses even after ID canonicalization.

## F1.3 P0-case classification

The regression fixture has 12 P0 JSONL rows. The harness can execute both `inprocess` and `subprocess` runners, so those rows become 24 P0 executions when `--runner both` is used.

Evidence:
- P0 rows are lines `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:1-12`.
- The runner expansion happens at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py:265-277`.
- None of the 12 P0 rows expects `sk-deep-research` or `sk-deep-review`; therefore 0/12 P0 rows and 0/24 two-runner P0 executions map to the stale deep-loop labels.

Per requested P0:

- `P0-MEM-001`: currently passing, not drift. It expects `system-spec-kit` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:3`; the live scorer returns `system-spec-kit`.
- `P0-UNC-001`: genuine scorer regression, not drift. It expects no result for `api chain mcp` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:7`, but the live scorer emits `sk-code` with the prompt marked ambiguous. Ambiguity currently annotates candidates rather than suppressing them, per `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:44-57` and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:389-404`.
- `P0-UNC-002`: genuine scorer/regression-fixture mismatch, not drift. It expects `mcp-code-mode` in confidence-only mode at `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:8`, but the live scorer emits `sk-code`. The confidence-only branch widens the uncertainty threshold to `1` at `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:361-366`, so the wrong top skill still passes threshold.
- `P0-CMD-001`: currently passing, not drift. It duplicates the memory-save prompt and expects `system-spec-kit` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:9`; the live scorer returns `system-spec-kit`.
- `P0-CMD-002`: genuine command-routing regression, not drift. It expects `command-spec-kit` for `/speckit:plan create docs` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:10`, but the live scorer emits `sk-doc`. The projection contains `/speckit:plan` on `command-spec-kit` at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:47-55`, while the primary intent bonus only special-cases `/speckit:resume` at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:265-268`; there is no matching `/speckit:plan` bonus.
- `P0-CMD-003`: currently passing, not drift. It expects `system-spec-kit` for `/memory:save this context` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:11`; the live scorer returns `system-spec-kit`.

## F1.4 Concrete remediation

Use alias-aware validation first; do not relabel the corpus as the only fix.

Recommended target files:
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` or a handler-focused validator test file
- Optional corpus cleanup later: `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl`
- Genuine scorer follow-ups: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`

Rationale:
- The alias map already encodes the compatibility contract, so validation should use `skillMatchesAlias` / `skillInAliasSet` when comparing scored results to gold labels. This preserves historical corpus labels and command aliases without treating compatibility IDs as failures.
- Corpus relabel alone would improve this one dataset, but it would leave the validation handler inconsistent with the alias contract already shipped in `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13-56`.
- After alias-aware validation, full-corpus accuracy rises to 74.09%, still below the 80.5% baseline. The remaining misses are genuine scorer/routing work, especially `system-spec-kit` at 28/55 strict and unchanged by aliasing.
- `P0-UNC-001` needs an ambiguity/abstention rule: when the top passing cluster is ambiguous and the request is low-information, no default-mode recommendation should be emitted.
- `P0-UNC-002` needs either an expected label update if `mcp-code-mode` is no longer a live skill route, or scorer calibration that makes `mcp-code-mode` beat `sk-code` for `api chain mcp` under confidence-only mode.
- `P0-CMD-002` needs a `/speckit:plan` command-intent bonus, parallel to the existing `/speckit:resume` special case.

# Questions Answered

- Skill-ID drift is the primary full-corpus driver, but not the only driver.
- 53/193 corpus rows carry stale `sk-deep-research`/`sk-deep-review` labels.
- 0/24 two-runner P0 executions carry those stale deep-loop labels.
- Alias-aware matching recovers 45 full-corpus hits and 9 holdout hits.
- The requested P0 failures are not label drift; `P0-UNC-001`, `P0-UNC-002`, and `P0-CMD-002` are genuine routing/scoring failures, while `P0-MEM-001`, `P0-CMD-001`, and `P0-CMD-003` currently pass.

# Questions Remaining

- Which 8 stale deep-loop corpus rows still fail after alias normalization, and are they prompt-quality issues or scorer issues?
- Should `mcp-code-mode` be restored as a live route, or should `P0-UNC-002` be relabeled to the current intended skill?
- Should low-information ambiguity suppress all recommendations by default, or only for specific prompt shapes like `api chain mcp`?

# Next Focus

F2 - PC-005 bench. Verify whether the failing bench is testing an obsolete expectation, a real promotion latency regression, or a stale fixture path.
