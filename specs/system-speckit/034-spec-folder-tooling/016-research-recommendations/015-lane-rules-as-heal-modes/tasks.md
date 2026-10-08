---
title: "Tasks: Phase 15: lane-rules-as-heal-modes"
description: "The task list for Phase 15: lane-rules-as-heal-modes, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "lane rules as heal modes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: lane-rules-as-heal-modes

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup and Design

- [ ] T001 Design anchor-wrap mode: document how to detect anchors without wrapping, how to wrap them correctly, what to refuse (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, line 58 fixture pattern)
- [ ] T002 Design link-repoint mode: document unique-match detection, unlink branch, refusal criteria (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, line 59 fixture pattern)
- [ ] T003 Design continuity-placeholders mode: document placeholder detection, fixed constants (recent_action, next_safe_action per z_archive), do-not-overwrite rule (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, line 60)
- [ ] T004 Design level-from-spec mode: document derivation from packet's own docs (folder-structure.md section 3), refusal when spec.md is unreadable (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, line 61)
- [ ] T005 Design header-add mode: document how template anchor ids match section headings, wrap rules, refusal when no match (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, line 62)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Implement anchor-wrap mode with derivability check in heal-spec-docs.cjs (derive section anchors, refuse if none found) and add to discovery at line 168
- [ ] T007 Implement link-repoint mode with derivability check and unlink branch; record refusal if zero or multiple matches
- [ ] T008 Implement continuity-placeholders mode with placeholder detection and fixed constants; refuse if field is already authored (not empty placeholder)
- [ ] T009 Implement level-from-spec mode reading `<!-- SPECKIT_LEVEL: N -->` from spec.md; refuse if header missing or malformed
- [ ] T010 Implement header-add mode matching template anchor ids against section headings; refuse if no exact match exists
- [ ] T011 Integrate all five modes into upgrade-legacy.mjs repair sequence at line 507-508 (after other healing, before validator)
- [ ] T012 Record mode refusals in baseline file (upgrade-baseline.json per packet) so reviewer knows transformation was not attempted
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Idempotence and Integration Tests

- [ ] T013 Create heal-spec-docs.vitest.ts with unit tests for each mode: positive case (transformation applied), negative case (refusal recorded), idempotence case (second run changes nothing)
- [ ] T014 Test anchor-wrap idempotence: apply mode, re-validate packet, assert zero changes to anchors (test: anchor-wrap-idempotence)
- [ ] T015 Test link-repoint idempotence: apply mode, re-validate packet, assert zero changes to links (test: link-repoint-idempotence)
- [ ] T016 Test continuity-placeholders idempotence: apply mode, re-validate packet, assert zero changes to continuity fields (test: continuity-idempotence)
- [ ] T017 Test level-from-spec idempotence: apply mode, re-validate packet, assert zero changes to level (test: level-from-spec-idempotence)
- [ ] T018 Test header-add idempotence: apply mode, re-validate packet, assert zero changes to headers (test: header-add-idempotence)
- [ ] T019 Create integration test in upgrade-legacy.vitest.ts: run all five modes in sequence on a corpus of failing packets, rerun, assert no contradictions
- [ ] T020 Update .skilled/skills/system-spec-kit/runtime/cli/spec/README.md to document each new mode, its derivability rule, and when it refuses
- [ ] T021 Verify existing test suite passes with no new failures (run `npm test` in system-spec-kit)
- [ ] T022 Run upgrade-legacy --apply on a test corpus and verify per-folder validation reports no new findings on second run
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



