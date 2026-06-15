# Deep-Review Strategy — skill:deep-improvement (MiMo-v2.5-pro (run 2))

## Scope
Target: `skill:deep-improvement` — review `.opencode/skills/deep-improvement/` (SKILL.md + references/ + assets/ + scripts/).

## Focus (the just-shipped v1.11.1.0 remediation — review with extra scrutiny)
- Dimension-aware grader: `scripts/model-benchmark/scorer/grader/harness.cjs` (dimId threading, normalizeParsedPayload, --append-system-prompt, fallback dim_id stamping).
- Answer fairness + parsing: `scripts/skill-benchmark/live-executor.cjs` (GRADED_RESPONSE_MAX_CHARS, collectBraceBalancedObjects, model default).
- Hardening: `scripts/model-benchmark/dispatch-model.cjs` (shellQuote, loadConfig diagnostic); `scripts/model-benchmark/scorer/score-model-variant.cjs` (criteriaExecAllowed gate).
- Maintainability refactor: `scripts/skill-benchmark/score-skill-benchmark.cjs` (scoreScenario split — verify byte-identical behavior); `scripts/skill-benchmark/d4-ablation.cjs` + `scripts/model-benchmark/sweep-benchmark.cjs` (de-dup helpers).
- Docs vs code: `SKILL.md` (router runtime_assets branch + §11 script list), `README.md` (counts/tables/triggers), `references/skill-benchmark/scoring_contract.md`, `changelog/v1.11.1.0.md`.

## Dimensions
correctness, security, traceability, maintainability (risk-ordered).

## Known Context
Full suite green (358/0) + drift 4/4 at review start; the remediation claims behavior-preserving. Reviewer = MiMo-v2.5-pro (run 2) (smaller model; format/lean profile — expect strong structural/consistency findings).