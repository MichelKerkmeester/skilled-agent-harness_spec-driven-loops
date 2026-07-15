---
title: "Lease Canonicalization and Cleanup Ordering"
description: "Close the 6 P1 and 6 P2 findings from the Phase 005 council review. This packet canonicalizes lease identity by real filesystem paths, probes legacy leases for rolling starts, orders cleanup before signal mirroring, and reconciles arc documentation."
trigger_phrases:
  - "012/006 lease canonicalization"
  - "phase 006 council remediation"
  - "legacy lease probe"
  - "launcher cleanup ordering"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Initialized Phase 006 remediation"
    next_safe_action: "Run final verification gates"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-006-lease-canonicalization-and-cleanup-ordering"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Spec folder: user supplied existing empty 006 phase folder"
      - "Branch policy: stay on main"
---
# Lease Canonicalization and Cleanup Ordering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implementation Complete; Commit Blocked |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 006 |
| **Predecessor** | 005-lease-correctness-and-arc-traceability |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Phase 005 council review found that the launcher arc still had two load-bearing lease gaps: lexical path identity could let symlink aliases bypass single-writer checks, and child signal mirroring could kill the parent before cleanup ran. The same review also found traceability drift in packet docs, REQ anchors, and the skill-advisor lease reference contract.

### Purpose

Close the 6 P1 and 6 P2 council findings in one scoped remediation packet while preserving the existing launcher architecture and explicit-path commit discipline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Canonicalize lease DB and PID-file identity with real filesystem paths.
- Probe legacy lease locations before starting a new owner during rolling upgrades.
- Clear launcher leases synchronously before mirroring child exit signals.
- Add focused Vitest coverage for symlink aliases, legacy lease probes, and SIGKILL backstop cleanup.
- Reconcile Phase 005 tasks, parent invariants, 002 checklist evidence, REQ anchor namespaces, and the skill-advisor daemon lease reference.

### Out of Scope

- New launcher architecture or daemon schema migrations.
- Drive-by edits outside the frozen §3 file list.
- Direct edits to the two Phase 005 `launcher-lease.md` reference files unless the user expands scope; P2-Seat4 is documented as a scope-conflicted deferral.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create | Phase 006 Level 2 packet. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modify | Realpath canonicalization, secure lease DB perms, and legacy daemon lease probe. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Realpath DB-dir reporting, legacy marker output, cleanup-before-signal-mirror. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Realpath PID lease path, legacy PID-file probe, 0600 lease writes, cleanup ordering. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Realpath PID lease path, legacy singular-skill probe, 0600 lease writes, cleanup ordering. |
| `launcher-lease.vitest.ts` suites | Modify | Namespaced REQ anchors plus symlink, legacy, and SIGKILL-backstop cases. |
| `launcher-bootstrap.vitest.ts` | Modify | Replace brittle static DB pragma coverage with runtime rebuild-path coverage and one static wiring check. |
| `references/daemon-lease-contract.md` | Modify | Document canonical lease location, legacy probe, and cleanup ordering invariant. |
| `../spec.md`, `../002.../checklist.md`, `../005.../tasks.md` | Modify | Reconcile parent invariant and old packet evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Realpath lease canonicalization | Symlink aliases to the same DB directory share one lease key and a second launcher exits with `LEASE_HELD_BY`. |
| REQ-002 | Legacy lease probe | A live legacy owner blocks startup with `LEASE_HELD_BY:<pid> ... (legacy path)`; stale legacy owners are logged and do not migrate automatically. |
| REQ-003 | Cleanup before signal mirror | All three launchers call `clearLeaseFile()` before mirroring child exit signals. |
| REQ-004 | Phase 005 task contradiction closed | 005 `tasks.md` marks T022 complete with `bd8a90747` commit evidence and no remaining blocker. |
| REQ-005 | REQ anchors namespaced | Targeted test files use phase-qualified anchors such as `005-REQ-011`; wrong `REQ-012` mappings are corrected. |
| REQ-006 | Skill-advisor lease reference updated | `daemon-lease-contract.md` describes canonical DB-dir lease location, legacy probe, and cleanup ordering. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Lease file permissions tightened | Inline PID lease files write with `0600`; owned lease/DB dirs use `0700`; skill-advisor lease DB is chmodded `0600`. |
| REQ-008 | SIGKILL backstop covered | Launcher tests include a child fixture that ignores SIGTERM until the 5s SIGKILL backstop, then assert lease cleanup. |
| REQ-009 | Parent invariant corrected | Arc parent distinguishes inline PID-file leases from skill-advisor daemon SQLite lease DB. |
| REQ-010 | 002 checklist stale pending text fixed | Checked item no longer says "Pending" after Complete status. |
| REQ-011 | Scope-conflicted reference churn handled | P2-Seat4 is either restored within expanded scope or documented as deferred because §3 excludes those files. |
| REQ-012 | Runtime DB-pragma path covered | `advisor_rebuild` runtime path opens the DB and observes `journal_mode=wal` plus `busy_timeout=5000`; one static wiring check may remain. |
| REQ-013 | Final gates pass | 006 strict validate, arc strict validate, skill-advisor typecheck, and three focused Vitest commands exit 0. |
| REQ-014 | Commit hygiene preserved | One commit on main with explicit-path staging, no `--no-verify`, no `--no-gpg-sign`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 P1 findings are closed with code, test, or documentation evidence.
- **SC-002**: P2 findings are closed where in scope; P2-Seat4 is explicitly deferred because direct edits to the two `launcher-lease.md` files are excluded by the frozen scope.
- **SC-003**: Requested strict validations, typecheck, and focused Vitest suites pass.
- **SC-004**: The final commit contains only explicit paths from the frozen scope and generated metadata for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## 6. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Scope stays inside the frozen file list and generated 006 metadata.
- **NFR-002**: Lease identity must be deterministic across symlink aliases that resolve to the same directory.
- **NFR-003**: Compatibility probes must not mutate or migrate legacy lease files.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

- **Symlink alias DB dirs**: two different override strings pointing at one real DB directory share one lease.
- **Live legacy owner**: startup exits 0 with `LEASE_HELD_BY:<pid> ... (legacy path)`.
- **Dead legacy owner**: startup logs stale reclaim intent and proceeds with the canonical lease.
- **Child ignores SIGTERM**: parent SIGKILL backstop still clears the lease before exit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| File count | Medium | Four code files, four test files, one reference file, and packet docs. |
| Behavioral risk | Medium | Startup lease checks gate live MCP server processes. |
| Architecture change | Low | Existing lease primitives remain in place. |
| Verification load | Medium | Requires three focused Vitest workspaces plus strict spec validation. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dirty worktree with thousands of parallel changes | Accidental staging could capture unrelated work | Use explicit `git add` paths only and record the staged list. |
| Risk | Legacy lease formats differ by launcher | Probe could miss old owners | Use the exact legacy paths from council evidence and prior launcher locations. |
| Risk | 5s SIGKILL-backstop tests add runtime | Focused suites take longer | Keep tests narrow and avoid full-suite expansion beyond requested gates. |
| Dependency | Existing package installs | Vitest/typecheck need local dependencies | Use existing package scripts; no new dependencies added. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. P2-Seat4 has an internal scope conflict; this packet documents the deferral rather than editing files outside the frozen list.
<!-- /ANCHOR:questions -->
