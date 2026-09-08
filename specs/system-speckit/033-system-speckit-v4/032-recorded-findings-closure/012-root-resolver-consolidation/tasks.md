---
title: "Tasks: Phase 12: root-resolver-consolidation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "root resolver consolidation tasks"
  - "eval script merge task"
  - "shared predicate audit task"
  - "parity test verification task"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: root-resolver-consolidation

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

- [x] T001 Confirm the current-state resolver inventory (7 live implementations) against `.opencode/skills/system-spec-kit`'s tree, re-verifying `profile.ts`'s removal and the wrapper status of `retrofit-convention.mjs`/`generate-trigger-index.mjs`
- [x] T002 [P] Grep every caller of `shared/config.ts`'s `PACKAGE_ROOT`/`getDbDir` and `shared/embeddings/factory.ts`'s `resolveSpecKitPackageRoot`
- [x] T003 [P] Run `npm run check` once before any edit to record the pre-change baseline result
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Merge `check-source-dist-alignment.ts:98`'s and `check-architecture-boundaries.ts:92`'s `resolvePackageRoot` into one shared helper, keeping the stricter `['shared', 'runtime', 'runtime/cli']` marker set unless T002's audit shows otherwise
- [x] T005 Decide, from T002's caller audit, whether `shared/config.ts` and `shared/embeddings/factory.ts`'s predicates collapse into one or stay separate with a documented reason
- [x] T006 Write the parity test under `.opencode/skills/system-spec-kit/runtime/cli/tests/` feeding identical fixture trees (full tree, missing `runtime/cli`, missing both) to every surviving resolver
- [x] T007 Update `.opencode/skills/system-spec-kit/shared/README.md`'s "Paths and workspace" section with the surviving count and the boundary for each
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `npm run check` and confirm the same or better result than the T003 baseline
- [x] T009 Run the new parity test and confirm every surviving resolver agrees on each fixture tree
- [x] T010 Confirm the four 035 research lanes/packets that touched these files (001, 002, 003 and the overengineering-simplification lane) still validate clean
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-006 present in spec.md's Requirements section]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md's Architecture and Affected Surfaces sections name the eval-script merge, the shared-predicate audit and the parity test]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: runtime/cli/package.json's check script and shared/workspace/repo-root.mjs both confirmed present]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: npm run check's lint step exits 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: T008's npm run check output captured with no unexpected stderr]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the merged resolvePackageRoot preserves both originals' throw-on-not-found behavior]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the merged helper keeps the existing REQUIRED_ROOT_DIRS-array-plus-walk-up shape both originals used]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md rows AC-001 through AC-006 all read Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: T002's caller audit recorded in goal.md's log]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: the parity test's missing-runtime/cli and missing-both fixture rows both pass]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: a fixture tree with neither marker present confirmed to throw or hoist consistently across resolvers]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: R6-02/R6-03 classed as class-of-bug (one duplicated-predicate pattern across multiple files) plus matrix/evidence (the marker-set divergence needs adversarial fixture rows)]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: T001's re-verified 7-implementation inventory in spec.md's Problem Statement is the complete producer list]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T002's caller audit is the consumer inventory for config.ts/factory.ts]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: the parity test's fixture-tree table covers full-tree, missing-runtime/cli and missing-both as the resolver-equivalent of those adversarial cases]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces section lists the caller-boundary x marker-strictness x fixture-shape matrix]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable, resolvers read only the filesystem, not process-wide env state]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Verification table names the closing commit SHA once implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: not applicable, resolvers walk the filesystem only]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: not applicable, no external input, only a fixed starting directory argument]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable, no auth surface touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same six files and the same REQ-001 through REQ-006 requirement set]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the merged resolvePackageRoot's header comment states which two files it replaces]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: shared/README.md's Paths and workspace section states the final count]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: T002's caller-audit notes kept under this packet's scratch/ directory]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: scratch/ directory listing empty or absent at completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
