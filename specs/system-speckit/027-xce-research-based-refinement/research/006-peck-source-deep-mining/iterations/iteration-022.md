# Iteration 022 — Rollout sequencing & backward-compat

**Focus:** the concrete phased rollout (order, flags, grandfathering, coordination).
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written). **Status:** complete. **newInfoRatio:** 0.36 (synthesis-grade).

## Findings (rollout plan — full table in `prompts/iteration-022.out`)
- **Phase 0** — land pending `001/002-self-check-templates` first OR lock one shared-template edit window (`spec.md.tmpl`/`checklist.md.tmpl` are shared with 011). Gate: fresh scaffold passes strict.
- **Phase 1** — ship **010** reviewer test-bench. Flag `SPECKIT_REVIEWER_BENCHMARKS`. Gate: fixtures cover stale-verdict/softened-Fail/over-read/AC cases.
- **Phase 2** — ship **009** in WARN mode (`SPECKIT_COMPLETION_FRESHNESS=true`, `..._ENFORCE=false`). Grandfather old completions; freshness warn-first. Gate: 010 regressions green.
- **Phase 3** — ship **011** phases 001-002 (AC-format + traceability table). `SPECKIT_AC_TRACEABILITY_TEMPLATE`. Legacy folders warn-only.
- **Phase 4** — `AC_COVERAGE` WARNING, floor 0.9 (`SPECKIT_AC_COVERAGE=true`, `..._ENFORCE=false`, `..._FLOOR=0.9`). L2+ + lifecycle in-progress+ only; L1 exempt.
- **Phase 5** — promote `AC_COVERAGE`/freshness to ERROR after a warn-only window; legacy folders still exempt unless touched.

## Precedent to copy
**`SPECKIT_SAVE_QUALITY_GATE`** — default-on/graduated, 14-day warn-only window, logs would-reject without blocking, persists activation timestamp so restart doesn't reset graduation (`save-quality-gate.ts:12-20,151-153,269-272`; `ENV_REFERENCE.md:48-49`). The exact pattern for the freshness + AC rollout.

## Coordination
Fold T14 → pending `001/003`, T12(a,b) → pending `001/004` (not new packets). Dependency order **010 → 009 → 011**; 011 also waits on the pending-002 shared-template window.

## Verdict contribution
Rollout = automation-lands-early / friction-lands-late (behind flags + warn-mode), copying the proven `SPECKIT_SAVE_QUALITY_GATE` graduation. Directly seeds the integration-plan rollout timeline + each packet's rollout section.
