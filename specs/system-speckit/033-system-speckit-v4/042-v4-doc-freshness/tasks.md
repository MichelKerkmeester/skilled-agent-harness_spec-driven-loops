---
title: "Tasks: V4 Documentation Freshness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v4 doc freshness tasks"
  - "release doc research lane tasks"
  - "verdict application tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: V4 Documentation Freshness

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

- [x] T001 Record the pre-edit baseline: line and byte counts for both target documents plus `git status --short` (`specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`, `README.md`)
- [x] T002 Scaffold this packet through the governed create path at Level 2 and confirm `validate.sh --strict` (`042-v4-doc-freshness/spec.md`)
- [x] T003 Re-run the executor pre-flight (`command -v devin`, `devin auth status`) and halt rather than substitute if either fails (`042-v4-doc-freshness/plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Launch `/deep:research:auto` with the bound topic, this spec folder, ten iterations, `--stop-policy=max-iterations`, `--executor cli-devin --model=deepseek-v4-1-flash-max` (`042-v4-doc-freshness/research/`)
- [x] T005 Verify each iteration as it lands: non-empty iteration file, gateway-receipted state event, reducer refresh (`042-v4-doc-freshness/research/iterations/`)
- [x] T006 Confirm the run shape at completion: ten iterations, ten route-proof receipts, convergence report total 10 with stop reason `max_iterations` (`042-v4-doc-freshness/research/deep-research-state.jsonl`)
- [x] T007 Read the synthesis and check every finding carries a citation and no placeholder residue (`042-v4-doc-freshness/research/research.md`)
- [x] T008 Write the changelog verdict: one row per stale, missing or understated claim with cited current truth and the proposed correction (`042-v4-doc-freshness/research/verdict-changelog.md`)
- [x] T009 Write the README verdict in the same shape (`042-v4-doc-freshness/research/verdict-readme.md`)
- [x] T010 Apply only verdict-confirmed corrections to the changelog (`specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`)
- [x] T011 Apply only verdict-confirmed corrections to the root README (`README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Confirm the scoped diff: this packet plus the two target documents and nothing else (`git status --short`, `git diff --stat`)
- [x] T013 Re-verify three corrections at random against their cited commit or file (`git show`, targeted `rg`)
- [x] T014 Run the repository documentation guards the two edited documents are subject to (link and frontmatter checks)
- [x] T015 Close the packet: acceptance criteria answered with evidence and `implementation-summary.md` written (`042-v4-doc-freshness/acceptance-criteria.md`)
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
## Document Quality

- [x] CHK-010 [P0] Every correction traces to a verdict row that cites evidence
- [x] CHK-011 [P0] No correction reaches a claim the lane did not examine
- [x] CHK-012 [P1] Edited prose follows the repository communication rules
- [x] CHK-013 [P1] No packet or finding identifiers leak into the two edited documents
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Run-shape checks read from the state the run wrote, not from its summary
- [x] CHK-022 [P1] Sampled re-verification reproduces each checked correction as current truth
- [x] CHK-023 [P1] A short or failed run is reported as such rather than completed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Verdict Completeness

- [x] CHK-FIX-001 [P0] Every candidate reference in the two documents is either decided by a verdict row or explicitly recorded as not checked
- [x] CHK-FIX-002 [P0] Path claims are checked against the live tree, not against the commit that introduced them
- [x] CHK-FIX-003 [P0] A compatibility path that keeps a reference true is recorded as true, with the alias named
- [x] CHK-FIX-004 [P1] Each row states its confidence and what would overturn it
- [x] CHK-FIX-005 [P1] A rewrite recommendation, where one exists, is recorded and not executed
- [x] CHK-FIX-006 [P1] Findings the lane could not resolve are recorded as unresolved, not dropped
- [x] CHK-FIX-007 [P1] Evidence is pinned to named commits rather than to a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Boundary

- [x] CHK-030 [P0] No credential, token or seat identifier written into packet artifacts
- [x] CHK-031 [P0] The executor's write authority stayed inside this packet's `research/` directory
- [x] CHK-032 [P1] No file outside the packet and the two target documents was modified
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with what was actually done
- [x] CHK-041 [P1] Verdict rows and applied corrections agree after the edit pass
- [x] CHK-042 [P2] README updated (only where a verdict confirms it)
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
| P0 Items | 12 | [ ]/12 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:summary -->

---
