---
title: "Tasks: Phase 18: restore-advisor-suite-and-renew-scorer-freeze"
description: "Ordered tasks for restoring the advisor suite and renewing the scorer freeze."
trigger_phrases:
  - "advisor suite restore tasks"
  - "phase 18 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: restore-advisor-suite-and-renew-scorer-freeze

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

- [x] T001 Run the advisor suite for a baseline: 13 failures in 4 files
- [x] T002 Prove the plugin failures come from `63ad140f9b` by running the plugin before it
- [x] T003 Bisect the Python parity drop to one file and one commit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Find the source root from the repository root in the plugin (`.opencode/plugins/system-skill-advisor.js`)
- [x] T005 [P] Test a nested workspace and one outside any checkout (`runtime/tests/system-skill-advisor-plugin.vitest.ts`)
- [x] T005a Resolve the checkout root in three plugin log helpers, with a nested-project test (`.opencode/plugins/mcp-route-guard.js` and two siblings)
- [x] T006 Drop the `iteration-history` keyword, keeping `iteration-files` (`.skilled/skills/system-deep-loop/SKILL.md`)
- [x] T007 [P] Re-approve the changed ledger divergence (`runtime/tests/parity/fixtures/local-native-approved-divergences.json`)
- [x] T008 [P] Write the embeddings cache only on request (`runtime/tests/scorer/fixtures/seed-skill-embeddings.ts`)
- [x] T009 Re-mint the system-deep-loop manifest and recompile the three deep contracts
- [x] T010 Renew the scorer freeze (`frozen-scorer-pins.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the parity suites, the full advisor suite and the node gate
- [x] T012 Run the route guard, the contract drift check and the admission check
- [x] T013 Run the runtime-engine harness and record what remains
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
- **Predecessor**: See `../017-build-compiled-serving-gold-admission-checker/implementation-summary.md`
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

- [x] CHK-010 [P0] Code passes lint/format checks. Every commit passes the pre-commit gates
- [x] CHK-011 [P0] No console errors or warnings introduced
- [x] CHK-012 [P1] Error handling implemented. Not applicable: comments only
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete. The parity bisection and the freeze check
- [x] CHK-022 [P1] Edge cases tested. A workspace outside any checkout is never cached
- [x] CHK-023 [P1] Error scenarios validated. The new plugin test fails against the plugin before the fix
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class. Plugin lookup: `algorithmic`. Parity drop: `cross-consumer`. Fixture write: `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class inventory: `rg -n "findSourceRoot\("` finds ten callers. Two plugins and the installer already pass a repository root, and `rg-wrapper` documents that it receives one. Three plugin log helpers passed the raw project directory and are fixed here.
- [x] CHK-FIX-003 [P0] Consumers of `SKILL.md`: the compiled manifest, three deep contracts, both advisor scorers.
- [x] CHK-FIX-004 [P0] Path cases: a nested workspace, a nonexistent nested path, and a temporary directory outside any checkout.
- [x] CHK-FIX-005 [P1] Matrix: two keyword variants by three parity suites.
- [x] CHK-FIX-006 [P1] The parity runs pin the no-graph regime the suite uses.
- [x] CHK-FIX-007 [P1] Evidence pinned to `b9589efbd9..HEAD` on the phase branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No private home-derived path in any tracked file
- [x] CHK-032 [P1] No gate bypass variable used
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral ids in code comments
- [x] CHK-042 [P2] Fixture README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:summary -->

---
