---
title: "Tasks: Phase 1: broken-references"
description: "Ordered tasks and verification checklist for broken-references."
trigger_phrases:
  - "broken references tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: broken-references

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the baseline audit (`audit_readmes.py`). Verify: `broken_references` prints 119
- [x] T002 Classify every hit as gitignored, accurate, placeholder or real. Verify: classification table in implementation-summary.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite the hub path in four sk-design-md-generator READMEs. Verify: `grep -c skills/sk-design-md-generator/` prints 0 in each
- [x] T004 Point the tokens.css command at `sk-design-fundamentals/assets/`. Verify: `ls .skilled/skills/sk-design/sk-design-fundamentals/assets/tokens.css` succeeds
- [x] T005 Drop the sentence naming the removed `styles/docs/` playbook. Verify: `grep -c docs/manual-testing-playbook` prints 0
- [x] T006 Fix the relative `trigger-index.json` path in the retrieval README. Verify: `ls .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` succeeds
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Validate every edited README. Verify: `validate_document.py` prints VALID for all 7
- [x] T008 Rerun the audit. Verify: `broken_references` prints 103 and no hit is new
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited files pass their validator. Evidence: `validate_document.py` VALID on all 7 edited READMEs
- [x] CHK-011 [P0] No new validator warnings on edited files. Evidence: `validate_document.py` VALID on all 7 edited READMEs
- [x] CHK-012 [P1] Failure path handled: an unresolvable item is left and listed, not guessed. Evidence: implementation-summary.md Known Limitations
- [x] CHK-013 [P1] Edits follow the owning template. Evidence: diff review
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Diffs reviewed for lost facts and invented links. Evidence: all 7 diffs read; path edits only, one sentence removed
- [x] CHK-022 [P1] Edge cases checked. Evidence: the removed-target case rewrites the sentence instead of guessing a target
- [x] CHK-023 [P1] Before and after counts measured from reruns. Evidence: audit 119 before, 103 after
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: documentation-only diff
- [x] CHK-031 [P0] Input validation: N/A, no code changed
- [x] CHK-032 [P1] Auth/authz: N/A, no code changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: validate.sh strict
- [x] CHK-041 [P1] Code comments: N/A, no code changed
- [x] CHK-042 [P2] README updated where in scope. Evidence: Files Changed table in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept outside the repo, in the session scratchpad. Evidence: `git status` shows no stray files
- [x] CHK-051 [P1] scratch/ holds only its .gitkeep. Evidence: `ls scratch`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
