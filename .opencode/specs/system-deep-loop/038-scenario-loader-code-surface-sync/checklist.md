---
title: "Verification Checklist: Scenario loader code-<surface> path parsing sync"
description: "Executed Level 2 verification checklist for the Lane-C scenario loader and live-result parser fix: four regex prefix additions, forbidden-prefix export, regression guard, whole-path proof, end-to-end unblock proof, and scoped deferrals."
trigger_phrases:
  - "scenario loader code surface checklist"
  - "code surface path parse checklist"
  - "load playbook code prefix verification"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-scenario-loader-code-surface-sync"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Code-surface path parsing verified with direct parser proof and guard tests"
    next_safe_action: "Run close-out validation and push; continue sk-code gold translation separately"
---
# Verification Checklist: Scenario loader code-<surface> path parsing sync

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md defines the loader/live-result parser truncation problem, four prefix sites, regression guard, end-to-end unblock proof, risks, and out-of-scope follow-up work]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md defines targeted harness-parser repair, completeness sweep, guard tests, harness suite comparison, temporary end-to-end proof, rollback, and follow-up boundary handling]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: companion router-replay slicing fix, scenario loader, live executor, Vitest harness suite, and follow-up sk-code gold translation boundary are identified]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Four path-prefix regex sites re-synced [EVIDENCE: `load-playbook-scenarios.cjs` `extractPaths` line 135 and `extractForbiddenPrefixes` line 152, plus `live-executor.cjs` prose-fallback line 265 and observed-reads line 296, now include the `code-[a-z]+/` alternative]
- [x] CHK-011 [P0] Forbidden-prefix parsing is unit-testable [EVIDENCE: `extractForbiddenPrefixes` is exported from `load-playbook-scenarios.cjs` and covered by `tests/code-surface-path-parse.vitest.ts`]
- [x] CHK-012 [P1] Universal-tier parsing preserved [EVIDENCE: the regex change is additive; `references/`, `assets/`, and `../shared/` paths continue to parse as before]
- [x] CHK-013 [P1] Fix scope stayed surgical [EVIDENCE: packet scope is two harness scripts plus one regression test; no sk-code gold, router-final, or intent/mode-projection behavior was changed]
- [x] CHK-014 [P1] Non-surface router-doc matcher excluded with reason [EVIDENCE: `router-replay.cjs` referenced-router-doc finder line 222 locates the router doc under `references/`, not surface gold, and is not on the sk-code hub path]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Whole-path parse proven directly [EVIDENCE: after the fix, `extractPaths("- code-animation/references/decision_matrix.md ...")` returns `code-animation/references/decision_matrix.md` whole and does not emit `references/decision_matrix.md`]
- [x] CHK-021 [P0] Harness Vitest suite has no new failure [EVIDENCE: baseline 1 failed / 104 passed across 105 tests in 7 files; post-fix 1 failed / 106 passed across 107 tests in 8 files]
- [x] CHK-022 [P1] Regression guard added and passing [EVIDENCE: `tests/code-surface-path-parse.vitest.ts` adds two passing tests for whole-path extraction across `code-webflow`, `code-opencode`, and `code-animation`, plus a `code-<surface>/` forbidden glob prefix]
- [x] CHK-023 [P1] End-to-end unblock proven and reverted [EVIDENCE: with loader fixed and gold translated, recall rose from ~0 to 66% (65 of 99 gold paths) and router-mode verdict recovered from 47 FAIL to 71 CONDITIONAL with D1-intra 87, D2 79, D3 47, D5 100; temporary gold translation was reverted]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Loader-router path contract restored [EVIDENCE: code-surface packet paths now parse whole, so parsed gold can match corrected router emissions instead of collapsing to nonexistent universal-tier suffixes]
- [x] CHK-025 [P1] Pre-existing intents failure left out of scope with reason [EVIDENCE: DEFERRED WITH REASON — `skill-benchmark.vitest.ts` still expects `res.intents` to contain `implement`, but current hub router returns `['code-webflow']`; this is intent/mode-projection sync, not path parsing]
- [x] CHK-026 [P1] sk-code gold translation left out of scope with reason [EVIDENCE: DEFERRED WITH REASON — playbook gold translation and `benchmark/router-final/` regeneration belong to `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline` by operator direction]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Fix did not touch secrets or credentials [EVIDENCE: packet changes are harness parser regexes, one export, regression tests, and close-out docs; no env values or credential material are in scope]
- [x] CHK-031 [P1] Deterministic offline guard protects future renames [EVIDENCE: regression tests run through Vitest and fail loudly if code-surface packet paths are truncated again]
- [x] CHK-032 [P1] Rollback is file-local and reversible [EVIDENCE: rollback plan reverts two harness scripts plus one regression test, then re-runs direct parser proof and harness Vitest baseline comparison]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec.md, plan.md, and tasks.md describe the same four-prefix parser fix, export, guard tests, whole-path proof, suite comparison, end-to-end proof, and deferrals]
- [x] CHK-041 [P1] Implementation summary updated with actual evidence [EVIDENCE: implementation-summary.md status Complete, completion_pct 100, Files Changed table, Verification table, Known Limitations, and Deviations-from-Plan table]
- [x] CHK-042 [P2] Close-out validation and push status recorded honestly [EVIDENCE: validate --strict is recorded as run at close-out and push is recorded as pending; no commit SHA is invented at authoring time]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Authored docs stay in the existing packet folder [EVIDENCE: plan.md, tasks.md, checklist.md, and implementation-summary.md are authored under `.opencode/specs/system-deep-loop/038-scenario-loader-code-surface-sync/`]
- [x] CHK-051 [P1] Metadata artifacts accounted for without source drift [EVIDENCE: Files Changed table records existing `description.json` and `graph-metadata.json` as packet metadata outputs while this close-out authoring pass only writes the four requested docs]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-05
**Verified By**: Claude Opus

<!-- /ANCHOR:summary -->
