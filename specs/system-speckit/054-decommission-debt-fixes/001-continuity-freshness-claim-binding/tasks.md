---
title: "Tasks: Phase 1: continuity-freshness-claim-binding"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: continuity-freshness-claim-binding

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
## Phase 1: Setup

- [ ] T001 Capture the baseline `validate.sh --strict` output for `052-memory-decommission-landing` and `053-spec-kit-runtime-rename` (no file change)
- [ ] T002 Capture the baseline `continuity-freshness.vitest.ts` run (`scripts/tests/continuity-freshness.vitest.ts`)
- [ ] T003 [P] Re-run the live reproduction (`SPECKIT_COMPLETION_FRESHNESS=1 node continuity-freshness.ts --folder specs/system-speckit/052-memory-decommission-landing --json`) and save its output alongside T001
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Reorder `validateContinuityFreshness` (`.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:376-382`) so a `pass`-status completion verdict returns directly instead of falling through to the timestamp-staleness branch
- [ ] T005 Add the skip code family recognition to `printBridgeOutput`/the CLI JSON shape so `no_completion_claim`, `missing_fingerprint`, `zero_fingerprint`, `missing_frontmatter`, `missing_graph_metadata`, `missing_graph_timestamp`, `implementation_summary_missing` and `not_opted_in` are carried through distinguishably (`continuity-freshness.ts`)
- [ ] T006 Update `parseShellRuleOutput`/`mapShellRuleStatus` (`.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`) to preserve the skip signal in the `ValidationEntry` details/message without changing the top-level pass/warn/fail mapping for any existing code
- [ ] T007 Add the fingerprint-stamp trigger to the continuity writer (`scripts/memory/generate-context.ts`, `scripts/core/memory-metadata.ts:185`) so a document carrying a completion claim is stamped with a real `session_dedup.fingerprint` via `buildContinuityFingerprint`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add the four new/extended cases to `continuity-freshness.vitest.ts`: claim-with-fingerprint (`fresh_completion`), claim-without-fingerprint (`missing_fingerprint`, distinguishable skip), zero-fingerprint placeholder (`zero_fingerprint`), CLI opt-out vs unguarded function (`not_opted_in`)
- [ ] T009 Run `generate-context-cli-authority.vitest.ts` and `generate-context-save-lock.vitest.ts` and confirm the pass count is unchanged plus the new fingerprint-stamp assertion passes
- [ ] T010 Re-run `validate.sh --strict` on `052-memory-decommission-landing` and `053-spec-kit-runtime-rename` and diff the exit code and summary counts against the T001 baseline - must match exactly
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
| P0 Items | 9 | 0/9 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
