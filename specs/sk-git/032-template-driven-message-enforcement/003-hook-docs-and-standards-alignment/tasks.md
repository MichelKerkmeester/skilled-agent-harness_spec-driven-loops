---
title: "Tasks: Phase 3: hook-docs-and-standards-alignment"
description: "Tasks for aligning the hook docs, code READMEs and env reference with the hooks and fixing three standards gaps."
trigger_phrases:
  - "hook docs alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: hook-docs-and-standards-alignment

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

- [x] T001 Read-only audit of the hook changes by GPT-6 Luna max via cli-codex (`scratch/audit-report.md`)
- [x] T002 Check every claim in the hook code; the "fails safe" README claim refuted, the policy fail-open claim narrowed, the Commit-Id narrowing declined
- [x] T003 List every switch the hooks read and compare with ENV-REFERENCE.md (14 missing)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each unit is one DeepSeek dispatch; the diff and suites are checked before the next.

- [x] T004 B1 unreadable blob blocks, cleanup trap (`.skilled/scripts/git-hooks/pre-commit`)
- [x] T005 B2 the same in the standalone hook (`.skilled/hooks/git/pre-commit`)
- [x] T006 B3 Spec containment and its test (`message-contract.mjs`, `message-contract.test.mjs`)
- [x] T007 B4 root README hook section (`README.md`)
- [x] T008 B5, B5b remote-branch policy (`references/remote-branch-policy.md`)
- [x] T009 B6 primary hook README (`.skilled/scripts/git-hooks/README.md`)
- [x] T010 B7 standalone hook README (`.skilled/hooks/git/README.md`)
- [x] T011 B8 pushed range and Commit-Id copy rule (catalog entries, template, SKILL.md)
- [x] T012 B9 code-folder READMEs (sk-code-quality scripts, bin/lib)
- [x] T013 B10 fourteen hook switches (`ENV-REFERENCE.md`)
- [x] T014 B11 trust note in the installer output (`install-git-hooks.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run every hook suite and sk-git node test from the final state
- [x] T016 Run the new Spec test against the old validator and confirm it fails
- [x] T017 Skill-root metadata gate, route guard, validate.sh --strict on this child and the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The new test fails on the phase 2 state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit**: `scratch/audit-report.md`
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

- [x] CHK-010 [P0] `bash -n` on both hooks and the installer (all parse)
- [x] CHK-011 [P0] A submodule entry does not block (scratch repository: mode `160000` read)
- [x] CHK-012 [P1] The temp directory has an EXIT trap in both hooks
- [x] CHK-013 [P1] No ephemeral ids in the new code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, 5 of 5 Met)
- [x] CHK-021 [P0] The new Spec test fails on the old validator (22 pass, 1 fail with the phase 2 file restored)
- [x] CHK-022 [P1] Edge cases tested (`../README.md` and `sk-git/../../README.md`; a staged submodule entry)
- [x] CHK-023 [P1] Route guard exits 0 and the skill-root metadata gate passes 15 of 15
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes: blob read instance-only in two copies; Spec containment instance-only; docs instance-only per file; env coverage class-wide (every switch the hooks read).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: both pre-commit copies of the hygiene loop changed; `rg "|| continue" ` over the hooks finds no other staged-blob read.
- [x] CHK-FIX-003 [P0] Consumer inventory: ENV-REFERENCE.md coverage derived from every `SPECKIT_*`/`SYSTEM_*` name in the hooks and their libraries, not from the audit list (which missed `SPECKIT_COMMIT_SPEC`).
- [x] CHK-FIX-004 [P0] Every doc sentence was checked against the hook line it describes before it was written.
- [x] CHK-FIX-005 [P1] Refuted and declined findings recorded with their reason in spec.md Out of Scope.
- [x] CHK-FIX-006 [P1] Hostile input executed: path traversal in a `Spec:` trailer.
- [x] CHK-FIX-007 [P1] Evidence pinned to the phase 2 commits in this worktree; the commit SHA is recorded at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] An unreadable staged file cannot skip the comment check
- [x] CHK-032 [P1] A `Spec:` trailer cannot name a path outside the packet root
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry no ephemeral ids
- [x] CHK-042 [P2] Every hook switch is in ENV-REFERENCE.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds only the audit report this phase cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---
