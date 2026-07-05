---
title: "Verification Checklist: Router-replay surface-slice sync to code-<surface> layout"
description: "Executed Level 2 verification checklist for the Lane-C router-replay surface-slicing fix: three-site prefix sync, regression guard, leak elimination, and scoped gold/intents deferrals."
trigger_phrases:
  - "router replay surface slice checklist"
  - "surface slice sync checklist"
  - "code surface router replay verification"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-router-replay-surface-slice-sync"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Surface-slicing fix verified with leak diagnostic and guard tests"
    next_safe_action: "Run close-out validation and push; continue sk-code gold alignment separately"
---
# Verification Checklist: Router-replay surface-slice sync to code-<surface> layout

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md defines the dead `hasSurfaceLayout` problem, three prefix sites, regression guard, over-routing success criteria, risks, and out-of-scope follow-up work]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md defines targeted harness-contract repair, leak diagnostic, guard tests, harness suite comparison, rollback, and gold-limited baseline handling]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: current sk-code `RESOURCE_MAP`, router-replay harness, Vitest harness suite, and follow-up sk-code gold alignment boundary are identified]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Three resource-prefix sites re-synced [EVIDENCE: `router-replay.cjs` updated `SURFACE_PREFIXES`, `hasSurfaceLayout`, and the OpenCode language regex to `code-webflow/`, `code-opencode/`, and `code-animation/` layout]
- [x] CHK-011 [P0] Surface layout detection restored [EVIDENCE: `hasSurfaceLayout` now checks `code-webflow/references/` and `code-opencode/references/`, so it can evaluate true against the current sk-code resource map]
- [x] CHK-012 [P1] Prompt-token detectors left unchanged [EVIDENCE: `detectSurface` and `detectOpencodeLanguage` key on prompt text, not resource-folder names, so no detector edits were made]
- [x] CHK-013 [P1] Fix scope stayed surgical [EVIDENCE: packet scope is one harness script plus one regression test; no sk-code gold, router-final, or intent/mode-projection behavior was changed]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Over-routing leak eliminated [EVIDENCE: before fix 13 of 21 scored non-browser scenarios routed both `code-webflow/` and `code-opencode/`; after fix 0 of 21 did]
- [x] CHK-021 [P0] Harness Vitest suite has no new failure [EVIDENCE: baseline 1 failed / 100 passed across 101 tests in 6 files; post-fix 1 failed / 104 passed across 105 tests in 7 files]
- [x] CHK-022 [P1] Spot checks prove intended slices [EVIDENCE: SD-001 routes `code-webflow` with no `code-opencode`; CS-004 keeps `code-animation` and drops both surfaces; LS-001 routes `code-opencode` only]
- [x] CHK-023 [P1] Regression guard added and passing [EVIDENCE: `tests/surface-slice-sync.vitest.ts` adds four passing tests for WEBFLOW, OPENCODE, UNKNOWN Motion, and corpus-wide no dual-surface over-routing]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Documented contract contradiction resolved in harness [EVIDENCE: smart-routing docs assert deterministic router-replay enforces slicing; harness prefix constants now match the same `code-*` resource layout]
- [x] CHK-025 [P1] Pre-existing intents failure left out of scope with reason [EVIDENCE: DEFERRED WITH REASON — `skill-benchmark.vitest.ts` still expects `res.intents` to contain `implement`, but current `hub-router.json` returns `['code-webflow']`; this is intent/mode-projection sync, not surface-slicing]
- [x] CHK-026 [P1] sk-code gold alignment left out of scope with reason [EVIDENCE: DEFERRED WITH REASON — playbook gold still uses pre-rename paths; alignment and `benchmark/router-final/` regeneration belong to `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline`]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Fix did not touch secrets or credentials [EVIDENCE: packet changes are harness prefix constants, regression tests, and close-out docs; no env values or credential material are in scope]
- [x] CHK-031 [P1] Deterministic offline guard protects future renames [EVIDENCE: regression tests run through Vitest and fail loudly if surface folders drift again and cause cross-surface over-routing]
- [x] CHK-032 [P1] Rollback is file-local and reversible [EVIDENCE: rollback plan reverts one harness script plus one regression test, then re-runs leak diagnostic and harness Vitest baseline comparison]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec.md, plan.md, and tasks.md describe the same three-site prefix fix, guard tests, leak diagnostic, suite comparison, and deferrals]
- [x] CHK-041 [P1] Implementation summary updated with actual evidence [EVIDENCE: implementation-summary.md status Complete, completion_pct 100, Files Changed table, Verification table, Known Limitations, and Deviations-from-Plan table]
- [x] CHK-042 [P2] Close-out validation and push status recorded honestly [EVIDENCE: validate --strict is recorded as run at close-out and push is recorded as pending; no commit SHA is invented at authoring time]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Authored docs stay in the existing packet folder [EVIDENCE: plan.md, tasks.md, checklist.md, and implementation-summary.md are authored under `.opencode/specs/system-deep-loop/037-router-replay-surface-slice-sync/`]
- [x] CHK-051 [P1] Metadata artifacts accounted for without source drift [EVIDENCE: Files Changed table records existing `description.json` and `graph-metadata.json` as packet metadata outputs while this close-out authoring pass only writes the four requested docs]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-05
**Verified By**: Claude Opus

<!-- /ANCHOR:summary -->
