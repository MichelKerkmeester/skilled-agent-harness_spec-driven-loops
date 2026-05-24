---
title: "Implementation Summary: fix deep-research LG-0004 + LG-0006"
description: "Two surgical code/config fixes in deep-agent-improvement scripts from the 005 deep-research loop: requiredAggregateScore aligned to 80, and the run-benchmark default profilesDir pointed at the shipped benchmark-profiles directory."
trigger_phrases:
  - "fix benchmark threshold and profile path summary"
  - "008 remediation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/008-fix-deep-research-findings-for-benchmark-threshold-and-profile-path"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "fixes-applied-and-verified"
    next_safe_action: "optional commit + optional future config-cleanup of vestigial target-profiles refs"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008004"
      session_id: "131-000-008-remediation"
      parent_session_id: "131-000-008-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Vestigial target-profiles config refs (profileCatalog, targetProfiles) are unconsumed — noted, not churned in this 2-fix packet"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary

> **Status**: COMPLETE. Both fixes applied and verified.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/008-fix-deep-research-findings-for-benchmark-threshold-and-profile-path` |
| **Completed** | 2026-05-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two surgical fixes for the code/config gaps the 005 deep-research loop surfaced and escalated.

- **LG-0004**: `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs:270` `requiredAggregateScore` changed `75` -> `80`. The benchmark-pass threshold is now uniform at 80 across the dynamic profile, `assets/benchmark-profiles/default.json:15`, and the `run-benchmark.cjs:280` fallback. The separate `minimumAggregateScore: 85` promotion gate was left untouched (intentional two-tier).
- **LG-0006**: `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:258` default `profilesDir` changed `assets/target-profiles` -> `assets/benchmark-profiles`. `run-benchmark.cjs --profile default` with no `--profiles-dir` now resolves the shipped `benchmark-profiles/default.json` instead of a non-existent directory.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two `Edit` operations through the `sk-code` OPENCODE/JavaScript surface. Verified with: `node --check` on both scripts (pass); a consistency `grep` confirming `requiredAggregateScore` is 80 in all three live locations and no live `target-profiles` default remains in the scripts; a `run-benchmark.cjs --profile default --outputs-dir <tmp>` smoke with no `--profiles-dir` (exit 0 — profile resolution succeeds, where it previously failed at the missing `target-profiles`); and the sk-code alignment verifier (`verify_alignment_drift.py --root .opencode/skills/deep-agent-improvement` — PASS, 38 files, 0 violations). The `scripts/tests/` vitest suite was not run (see Limitations).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Align `requiredAggregateScore` to 80 (not 75, not 85) | 80 is the static-profile + runner-fallback value; the dynamic 75 was the outlier. 85 is a separate promotion-gate knob, intentionally higher (two-tier benchmark-pass < promotion). |
| Fix the code default rather than document `--profiles-dir` as required | The real defect is the code default pointing at a non-existent dir; a doc workaround would mask it. |
| Leave the vestigial `target-profiles` config refs | `profileCatalog` / `targetProfiles` are unconsumed (no script reads them; reduce-state's `targetProfiles` is an unrelated metric counter). Churning unconsumed config in a 2-fix packet is out of scope; noted for a future cleanup. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| LG-0004 applied (generate-profile.cjs 75 -> 80) | PASS |
| LG-0006 applied (run-benchmark default profilesDir -> benchmark-profiles) | PASS |
| `node --check` both scripts | PASS |
| `requiredAggregateScore` consistency (80 in all 3 live locations) | PASS |
| No live `target-profiles` default in scripts | PASS |
| run-benchmark default-path smoke (`--profile default`, no `--profiles-dir`) | PASS (exit 0; profile resolves) |
| sk-code alignment drift (`verify_alignment_drift.py`) | PASS (38 files, 0 violations) |
| vitest suite (`scripts/tests/`) | NOT RUN (see Limitations) |
| Strict validate (008 spec folder) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **vitest suite not run.** The skill's tests use a non-standard `*.vitest.ts` naming that needs a project-local vitest config; none is present in `scripts/`, and the repo-root vitest (v4.1.7) default include pattern (`*.test.ts`/`*.spec.ts`) does not match, while vitest 4 rejects a `--include` CLI override. The two changes are value-only (a number and a path string) and are not referenced by any test (grep-confirmed), so regression risk is negligible and the fixes are verified via `node --check`, the run-benchmark smoke, the alignment verifier, and the consistency grep. A future packet could add the missing vitest config to make the suite runnable.
2. **Vestigial `target-profiles` config refs.** `assets/target_manifest.jsonc:25` (`profileCatalog`) and `assets/improvement_config.json:33` (`targetProfiles`) still point at the non-existent `target-profiles` directory. They are unconsumed (no script reads them; the system uses dynamic profiling plus `benchmark-profiles` for static benchmarks), so they are harmless. Repointing or removing them is a deliberate config-cleanup call left for a follow-on, not churned here.
<!-- /ANCHOR:limitations -->
