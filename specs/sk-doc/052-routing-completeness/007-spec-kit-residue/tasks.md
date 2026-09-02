---
title: "Tasks: Phase 7: spec-kit-residue [template:level-3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "adr disposition"
  - "049 supersession"
  - "coverage graph repoint"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-02T23:50:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Closed every ADR: two implemented, five superseded by 049, one already shipped"
    next_safe_action: "Rule on adjacent findings A1 and A2"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-residue-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: spec-kit-residue

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
## Phase 1: Decide each ADR against 049

Every ADR is checked file-by-file against the `Delete` list in
`specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/spec.md` §3
before any code moves. Inside the delete means superseded, not implemented.

- [x] T001 ADR-001 BM25 default. Superseded: all four subject files under `mcp-server/` (`decision-record.md` ADR-001 Resolution)
- [x] T002 ADR-002 channel representation. Superseded: all three subject files under `mcp-server/`
- [x] T003 ADR-003 `enforceSearchTokenBudget`. Superseded: handler and test under `mcp-server/`
- [x] T004 ADR-004 `anchor_id` fixture. Superseded: fixture and module under `mcp-server/`
- [x] T005 ADR-006 `clearBudget` loop. Accepted, and shipped earlier in `59a597e37d`
- [x] T006 ADR-007 database resolver. Split, and nothing survives: the five tests are under `mcp-server/`, and `shared/paths.ts` survives with no surviving subject
- [x] T007 Daemon recycle. Superseded: 049 phase 003 deletes the launcher, the plugin and `.opencode/hooks/spec-memory/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 ADR-005 repoint `coverage-graph-integration`, `coverage-graph-cross-layer` and `graph-convergence-parity` at `system-deep-loop/runtime/lib/coverage-graph/` (`scripts/tests/`)
- [x] T009 ADR-005 delete `scripts/tests/session-isolation.vitest.ts`, whose `handlers/coverage-graph/*` imports name a retired surface with no relocated equivalent
- [x] T010 ADR-008 give `main()` a defaulted `projectRoot`, bound into `CONFIG` before parsing (`scripts/memory/generate-context.ts`)
- [x] T011 ADR-008 rebuild the CLI-authority fixture as a throwaway packet under a temp root, track metadata included (`scripts/tests/generate-context-cli-authority.vitest.ts`)
- [x] T012 Record the two coverage-graph contract drifts the repoint surfaced as adjacent findings rather than editing the assertions
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Red baseline captured for both ADRs before any edit (ADR-005: 4 files, `Tests  no tests`. ADR-008: 7 failed | 4 passed)
- [x] T014 Green re-run after the edits (ADR-005: 47 passed, 2 failed on named drift. ADR-008: 11 passed, exit 0)
- [x] T015 `npm run typecheck` in `system-spec-kit/scripts`, exit 0
- [x] T016 Packet docs reconciled and `validate.sh --strict` run from the final state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every ADR ends the phase implemented, superseded or already shipped
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
- [x] CHK-003 [P1] Dependencies identified: 049's delete list is the gating input, read before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` exit 0 in `system-spec-kit/scripts`
- [x] CHK-011 [P0] No new warnings in either test run
- [x] CHK-012 [P1] `main()` keeps its existing catch-and-exit path. The new parameter is defaulted
- [x] CHK-013 [P1] The root is bound through `CONFIG`, which the module already documents as mutable runtime config
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Acceptance criteria reconciled in `acceptance-criteria.md`. AC-001 to AC-003 stay open with reasons
- [x] CHK-021 [P0] Both suites run before and after, output and exit status read
- [x] CHK-022 [P1] The ADR-008 fixture covers stdin, inline JSON, argv, and three failure paths
- [x] CHK-023 [P1] The three exit-non-zero tests still fail closed against the temp root
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] ADR-005 is `test-isolation`. ADR-008 is `test-isolation` with a one-parameter seam change
- [x] CHK-FIX-002 [P0] The stale `mcp-server/lib/coverage-graph` import was grepped across `scripts/tests/`: four files, all four handled
- [x] CHK-FIX-003 [P0] `main()` has one production call site, the module's own entry guard. The parameter is defaulted so it does not move
- [x] CHK-FIX-004 [P0] Not applicable: no security, path-parsing or redaction surface changed. The write guard itself is untouched
- [x] CHK-FIX-005 [P1] Not a matrix fix. The two axes are the two ADRs and their named files
- [x] CHK-FIX-006 [P1] The ADR-008 tests read and mutate `process.argv` and `CONFIG`. Each test builds and removes its own temp root
- [ ] CHK-FIX-007 [P1] Deferred: this packet is uncommitted, so the evidence is the working-tree diff rather than a SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added
- [x] CHK-031 [P0] `assertSpecWriteAllowed` and the containment check in `resolveExistingSpecFolderPath` are unchanged
- [x] CHK-032 [P1] Not applicable: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` reconciled in this pass
- [x] CHK-041 [P1] Both new comments state the durable why. Neither names a spec path or an ADR id
- [x] CHK-042 [P2] Not applicable: no README in scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run output went to the session scratchpad, not the packet
- [x] CHK-051 [P1] `git status` for this packet shows only authored documents
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 14/15 |
| P2 Items | 8 | 2/8 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Eight ADRs plus the daemon-recycle entry documented in `decision-record.md`
- [x] CHK-101 [P1] Every ADR carries `Accepted` or `Superseded`. None is left `Proposed`
- [x] CHK-102 [P1] Each ADR keeps its alternatives table and its rejection rationale
- [x] CHK-103 [P2] Not applicable: nothing migrates
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Not applicable: no runtime performance surface changed
- [x] CHK-111 [P1] Not applicable
- [ ] CHK-112 [P2] Not applicable
- [ ] CHK-113 [P2] Not applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback is a revert of the working-tree diff. Each ADR states its own rollback
- [x] CHK-121 [P0] Not applicable: no flag
- [x] CHK-122 [P1] Not applicable: no deployed service
- [x] CHK-123 [P1] Not applicable
- [ ] CHK-124 [P2] Not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No security surface changed. The write guard and path containment are untouched
- [x] CHK-131 [P1] No dependency added
- [ ] CHK-132 [P2] Not applicable
- [ ] CHK-133 [P2] Not applicable
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] Every packet document updated in this pass
- [x] CHK-141 [P1] The `main()` signature change is recorded in ADR-008's Outcome
- [ ] CHK-142 [P2] Not applicable: no user-facing surface
- [x] CHK-143 [P2] The two open contract questions are written up as adjacent findings A1 and A2
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decision owner | [x] Approved, decisions recorded per ADR | 2026-09-02 |
| Operator | Adjacent findings A1, A2 | [ ] Pending a ruling | |
<!-- /ANCHOR:sign-off -->


