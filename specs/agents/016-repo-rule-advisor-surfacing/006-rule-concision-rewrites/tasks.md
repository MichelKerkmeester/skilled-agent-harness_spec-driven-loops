---
title: "Tasks: Rule concision rewrites"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rule concision rewrites tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rule concision rewrites

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

- [ ] T001 Read the `sk-create-repo-rule` mode contract and confirm its edit path for existing rules
- [ ] T002 Record the before byte table (`wc -c .skilled/repo-rules/*.md`)
- [ ] T003 Inventory every `§N` reference into a rule (`rg -n 'md\`? §[0-9]' .skilled AGENTS.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Ship `evidence-and-proof.md` from its draft with a ledger
- [ ] T005 Ship `communication.md` from its draft, restoring the three edge clauses and the failure lines
- [ ] T006 [P] Rewrite the remaining 11 rules, one commit and one ledger each
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run `check-repo-rules.cjs` after every rule
- [ ] T008 Second-reviewer comparison of each ledger with its diff
- [ ] T009 Record the after byte table and open the post-change window with the phase 004 analyzer
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Predecessor handoff criteria met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Changed scripts pass their existing lint or syntax checks
- [ ] CHK-011 [P1] New code follows the surrounding file's patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every ledger lists every dropped sentence
- [ ] CHK-021 [P0] Ten checks pass
- [ ] CHK-022 [P0] No referenced section number changed
- [ ] CHK-023 [P1] Corpus cut at least 15%
- [ ] CHK-024 [P1] No new em dash or semicolon
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Consumer inventory in `plan.md` affected surfaces is complete
- [ ] CHK-FIX-002 [P1] Evidence is pinned to a commit SHA, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No transcript text, secret or credential in any committed artifact
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary files in scratch/ only, cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 2/7 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
