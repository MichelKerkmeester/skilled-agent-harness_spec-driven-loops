---
title: "Tasks: Phase 17: hop-history"
description: "Tasks for the hop history: the recorder module, its four call sites, the history subcommand, the doctor line, the notice switch, tests, docs and a live hop."
trigger_phrases:
  - "hop history tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: hop-history

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

- [x] T001 Provision worktree 175 and scaffold this phase (`specs/hooks/023-session-relaunch-loop/017-hop-history/`)
- [x] T002 Confirm the one past hop in `relaunch.log` and that it sits in a temporary directory
- [x] T003 Write the eight hop-history tests and watch them fail (`tests/hop-history.test.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Recorder, reader and notice (`lib/hop-history.cjs`)
- [x] T005 Record `handed-over`, `claimed` and `done`, and add `history [--last <count>]` (`bin/session-relaunch.cjs`)
- [x] T006 Record `timed-out` (`lib/killer.cjs`)
- [x] T007 Last-hop line in `/doctor:setup` (`setup.md`, `doctor-setup.yaml`, `doctor-setup-presentation.txt`)
- [x] T008 Notice switch row and example line (`ENV-REFERENCE.md`, `hook-flags.env.example`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Session-relaunch suite and Pi suite green
- [x] T010 Live Claude hop from worktree 175 records all three events
- [x] T011 Docs: concern README, tests README, feature catalog, root README
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 to REQ-006 in spec.md §4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md §6]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: drift guards PASS with only pre-existing warnings]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: suite output clean, 597 pass]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: `recordHop` and `notifyHandOver` catch and return false]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: module header and numbered sections match `killer.cjs`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, all rows Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: live hop at 2026-10-20T20:21Z wrote handed-over, claimed and done]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: empty history, bad `--last`, declined relaunch]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: notice off by default test, killer timeout test]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: new feature, no review finding; the gap was matrix/evidence, no record of hops]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: hop state changes are the relaunch decision, claim, complete and the killer timeout, and all four record]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: the CLI command list test now includes `history`; the CLI-copy fixture copies `hop-history.cjs`]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not a security fix; the delimiter case is covered by flattening tabs and line breaks]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: four events by one file; live proof on Claude, the other runtimes share the CLI calls]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: tests sandbox `HOME`, `XDG_RUNTIME_DIR`, `SESSION_RELAUNCH_REPO_ROOT` and `HOOK_FLAGS_CONFIG`, and clear the notice switch]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: the commit on `worktrees/175-session-relaunch-hop-history` and its merge into main]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: the module holds no credentials]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: unknown events are refused, `--last` must be a positive whole number]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: file mode 0600 in a 0700 directory]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: comments say why the file sits beside the notes and why writes never fail a hop]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: concern README Hop History section, root README bullet]
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

**Verification Date**: 2026-10-20
<!-- /ANCHOR:summary -->

---
