---
title: "Tasks: skills-root state consolidation"
description: "Ordered relocation tasks and the verification checklist, with observed command evidence against each gate."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: skills-root state consolidation

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Enumerate every reference to the seven directories, by class (source, build output, test, doc)
- [x] T002 Identify the single owning resolver for each of the seven directories (`goal-core.cjs`, `dispatch-guard.cjs`, `spec-gate-core.mjs`, `completion-evidence-sentinel.cjs`, `resolve-authority-root.ts`)
- [x] T003 Separate tracked documentation from disposable runtime files (`git ls-files` per directory)
- [x] T004 Name the rollback before any destructive step (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Dry-run the path rewrite and review the affected set before applying (`scratch/`)
- [x] T006 Apply the rewrite across source, tests and documentation (`.opencode/`)
- [x] T007 Create `.state/` and move the seven tracked READMEs as renames (`.opencode/skills/.state/`)
- [x] T008 Remove the old directories, discarding the thirty untracked runtime files (`.opencode/skills/`)
- [x] T009 Scan for residual references to any old path (`.opencode/`)
- [x] T010 Rebuild the three affected packages from source and re-scan their outputs
- [x] T011 Replace the fifteen ignore rules with an exclusion plus a negation (`.gitignore`)
- [x] T012 Re-point the relative links in the seven relocated READMEs (`.opencode/skills/.state/*/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Read or call each of the seven resolvers and confirm a `.state/` path
- [x] T014 Exercise the advisor and observe the write landing under `.state/`
- [x] T015 Fix the spec-gate fail-open fixtures to derive the parent from the resolved path (`spec-gate-core.test.mjs`)
- [x] T016 Run the workspace test gate to zero failures (`.opencode/scripts/run-node-tests.mjs`)
- [x] T017 Run the markdown link guard across the repository (`.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`)
- [x] T018 Verify ignore semantics in both directions (`.gitignore`)
- [x] T019 Diagnose the recreated old directory and confirm it is a pre-change daemon, not a missed reference (`implementation-summary.md`)
- [x] T020 Stage by explicit pathspec, excluding three concurrent sessions' in-flight work (`.gitignore`, `.opencode/`, `specs/system-speckit/038-skills-state-consolidation/`)
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-008
- [x] CHK-002 [P0] Technical approach defined in plan.md — one owning constant per subsystem
- [x] CHK-003 [P1] Dependencies identified — three build toolchains, git ignore semantics, concurrent sessions, daemons
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Workspace gate green — `73 files · 750 pass · 0 fail`; vitest `101 pass · 0 fail`
- [x] CHK-011 [P0] Build outputs regenerated, not edited — all three rebuilt; zero old-path references in any dist
- [x] CHK-012 [P1] Fail-open behavior preserved — spec-gate unwritable-directory tests pass at the new depth
- [x] CHK-013 [P1] Fixtures derive the parent from the resolved path rather than a hardcoded segment count
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-008 verified
- [x] CHK-021 [P0] Runtime observed — the advisor wrote `skill-graph-generation.json` under `.state/advisor/`
- [x] CHK-022 [P1] Residual scan returns zero references to any old path
- [x] CHK-023 [P1] Link guard: `8561 files, 13956 links checked, 0 broken`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` — one relocation observed by four subsystems, their build outputs, tests and docs.
- [x] CHK-FIX-002 [P0] Same-class producer inventory complete: the seven directories are the entire set of runtime state at the skills root.
- [x] CHK-FIX-003 [P0] Consumer inventory complete across source, build outputs, tests, fixtures and documentation, rebuilt in Python after the wrapped shell tooling returned false zeros.
- [x] CHK-FIX-004 [P0] Path-handling adversarial cases exercised: state directory occupied by a plain file, and an unwritable directory, both still fail open.
- [x] CHK-FIX-005 [P1] Matrix axes listed: seven directories by four reference classes; every cell enumerated before editing.
- [x] CHK-FIX-006 [P1] Process-wide state variant executed — a pre-change daemon was found recreating an old directory and diagnosed rather than assumed away.
- [x] CHK-FIX-007 [P1] Evidence pinned to observed command output in this packet, not to a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets involved — the change moves directories, it does not alter content
- [x] CHK-031 [P0] Runtime state stays outside version control; verified with `git check-ignore`
- [x] CHK-032 [P1] No auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] The ignore-rule and fixture comments record why the shape is what it is, not what changed
- [x] CHK-042 [P2] Seven relocated READMEs updated and link-verified
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The migration script lived outside the repository, in the session scratchpad
- [x] CHK-051 [P1] No task-created residue: staging verified by explicit pathspec, three concurrent sessions' changes excluded
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented — four ADRs
- [x] CHK-101 [P1] All ADRs carry a status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] No migration path by design; regeneration was the chosen strategy
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01 met — one extra path segment, no added resolution work
- [x] CHK-111 [P1] N/A — no throughput surface
- [x] CHK-112 [P2] N/A — no load surface
- [x] CHK-113 [P2] N/A — no performance claim made
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback documented and named before the destructive step
- [x] CHK-121 [P0] N/A — no feature flag; the path is unconditional
- [x] CHK-122 [P1] Leaving the old paths un-ignored is the monitor: a recreated directory shows up as untracked
- [x] CHK-123 [P1] Operator action recorded — daemons started before the change must restart
- [x] CHK-124 [P2] N/A — no deployment step
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No security surface changed; only the location of machine-local files
- [x] CHK-131 [P1] No dependency added
- [x] CHK-132 [P2] N/A — no network or input-handling surface
- [x] CHK-133 [P2] Discarded data was machine-local and regenerable, per the operator's chosen strategy
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] N/A — no API surface
- [x] CHK-142 [P2] Twenty-seven documents updated to the new paths
- [x] CHK-143 [P2] The gitignore negation constraint and the daemon caveat are recorded for the next maintainer
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


