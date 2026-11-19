---
title: "Tasks: Phase 18: ollama-lane-off-and-daemon-liveness"
description: "Baselines and the none-gold fire count first, then one Luna leaf per change behind a failing test, then every suite, the merge and the routing probe on main."
trigger_phrases:
  - "ollama lane off and daemon liveness tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: ollama-lane-off-and-daemon-liveness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-skill-advisor/runtime`. `L` is `.skilled/bin/system-skill-advisor-launcher.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the suite baselines from main at `62a9359e60a` (`R`, `.skilled/bin`, the spec-kit launcher and embedder suites). Verify: `implementation-summary.md` lists runtime 2533 passed and 8 skipped, Python 122, bin 79, DSH 18 and spec-kit 202 passed and 2 skipped. Evidence: baselines in implementation-summary.md Verification.
- [x] T002 Count fires on none-gold labeled prompts with the lane at 0.05 and at 0, set through `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` (`R/scripts`). Verify: `implementation-summary.md` records both counts and the REQ-005 outcome. Evidence: 5 none-gold fires at 0.05 and at 0, both regimes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Zero-weight guard ahead of the test bypass, with a test that stubs `VITEST` off and counts embed calls (`R/lib/scorer/lanes/semantic-shadow.ts`). Verify: the new test fails before the guard and passes after. Evidence: guard test red 1 of 2, green 2 of 2.
- [x] T004 Default `semantic_shadow` weight 0, `live: true` kept, and the moved pins re-baselined (`R/lib/scorer/lane-registry.ts`). Verify: `rg -n "id: 'semantic_shadow'" R/lib/scorer/lane-registry.ts` shows `defaultWeight: 0`. Evidence: defaultWeight: 0; fixtures recaptured.
- [x] T005 `lane_weight_zero` in `advisor_status` with `laneEnabled: false`, and no recommend warning for it (`R/handlers/advisor-status.ts`, `R/handlers/advisor-recommend.ts`). Verify: the new tests fail before and pass after. Evidence: status pair red 8 of 40, green 40 of 40.
- [x] T006 Unresolved pointer set to the one registered manifest without the cascade (`R/lib/embedders/schema.ts`). Verify: a test with an `auto` pointer passes and the cascade spy records no call. Evidence: pointer test red 3 of 5, green 5 of 5.
- [x] T007 Legacy embedding refresh and read removed (`R/lib/skill-graph/skill-graph-db.ts`). Verify: `rg -c refreshSkillEmbeddingsLegacy R/lib` prints nothing and `refresh-roundtrip` passes. Evidence: legacy tests red 3 of 8, green 8 of 8.
- [x] T008 hf model-server spawner off when its flag is unset, on at `1` (`L`). Verify: a bin test for both settings fails before and passes after. Evidence: hf test red 5 of 13, green 13 of 13.
- [x] T009 Parent-death check in the server (`R/advisor-server.ts`). Verify: a test with a changed parent pid sees `shutdownAdvisor` called. Evidence: liveness tests pass; live SIGKILL proof 6 s.
- [x] T010 Heartbeat writer in the server and the watchdog in the launcher (`R/advisor-server.ts`, `L`). Verify: tests cover a stale heartbeat (child stopped), a fresh one (kept) and no file yet (kept). Evidence: watchdog test red 7 of 7, green 7 of 7.
- [x] T011 Docs, `SKILL.md` 1.2.0.0, `changelog/v1.2.0.0.md`, ENV-REFERENCE and the v4.1.0.0 release entry. Verify: `rg -n 'defaultWeight|0\.05' ` over the advisor docs shows no stale semantic weight. Evidence: docs leaf accept checks pass; SKILL.md 1.2.0.0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun every baseline suite and the none-gold count on the final tree. Verify: each suite matches its baseline plus the new tests, or each moved pin is named. Evidence: all suites green, see Verification.
- [x] T013 Merge to main, push, restart the daemon and run the parent goal's routing probe. Verify: the probe lists `sk-code` first. Evidence: merged as `62d69f4bb7d`, pushed `62a9359e60a..62d69f4bb7d`; after the restart the probe lists sk-code 0.82 first.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: no security, path or parser change.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Base `62a9359e60a`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-19
<!-- /ANCHOR:summary -->

---
