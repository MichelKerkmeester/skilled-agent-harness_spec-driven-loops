# Iteration 021 — Automation integration: auto vs semi vs manual + wiring

**Focus:** per-rule automation class + concrete wiring to existing hooks/CI/validators/flags.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written). **Status:** complete. **newInfoRatio:** 0.78.

## Findings (automation matrix — full detail in `prompts/iteration-021.out`)
- **completion-freshness → FULLY-AUTO:** plug into `validate.sh --strict` via the existing strict-only `CONTINUITY_FRESHNESS` validator (`validate.sh:716-832`, `validator-registry.json:275-281`); recompute the existing continuity fingerprint (`memory-save.ts:1006-1013`). Optional pre-commit fast gate via `SPECKIT_RULES`. Manual only for legitimate clock-drift/dirty-tree exceptions.
- **AC coverage → SEMI-AUTO:** add `AC_COVERAGE` to `validator-registry.json` (warn→error); auto-counts ACs + parses evidence; AC→test semantic classification needs the reviewer (impossible before AC-format normalization).
- **010 benchmark → SEMI-AUTO:** reuse deep-improvement **Lane B** (materializer/runner/scorer/report already exist); gate reviewer-prompt PRs via the existing pre-commit + CI prompt-drift pattern (`.github/workflows/prompt-card-sync.yml`, `git-hooks/pre-commit:57-76`). Deterministic scorer in CI; live-LLM reviewer runs stay opt-in/nightly.
- **escalation / anti-softening / read-budget → SEMI-AUTO:** auto-detectable where loops emit state (loop-count, legal-stop bundles) + enforce structured verdict fields; "same symptom", "root cause adequate", prose softening, and read-rationale quality stay human-judgment.

## Automation gaps the proposal didn't name (reuse, don't invent)
`validate.sh` registry-driven rule loader + strict TS-validator seam (both freshness + AC_COVERAGE plug in) · staged-file pre-commit trigger for prompt surfaces · CI prompt-card-sync/comment-hygiene "changed-surface gate" model · the post-mutation UX hook for surfacing freshness invalidation · the deep-review `warn`→`strict` env rollout convention.

## Verdict contribution
**Automation-first is achievable with ZERO new infra:** freshness + AC gate ride `validate.sh`/validator-registry; 010 rides Lane B + existing CI/pre-commit; rollout rides the existing warn→strict env convention. Feeds the integration-plan automation section.
