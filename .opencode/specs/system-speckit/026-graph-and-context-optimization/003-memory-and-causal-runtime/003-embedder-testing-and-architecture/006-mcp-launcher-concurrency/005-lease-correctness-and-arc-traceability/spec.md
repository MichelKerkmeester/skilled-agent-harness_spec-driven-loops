---
title: "Lease Correctness and Arc Traceability"
description: "Close 13 P1 findings from the 29-iteration deep review of the MCP launcher concurrency arc. The packet aligns child status evidence, centralizes arc invariants, fixes resolved-DB lease ownership, widens SQLite WAL fallback handling, and adds missing launcher coverage."
trigger_phrases:
  - "012/005 lease correctness"
  - "deep-review p1 remediation"
  - "launcher lease correctness"
  - "arc traceability remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Initialized Phase 005 remediation packet"
    next_safe_action: "Run verification gates and record final evidence"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-005-lease-correctness-and-arc-traceability"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Spec folder: user supplied existing 005 phase folder"
      - "Branch policy: stay on main"
---
# Lease Correctness and Arc Traceability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 005 of 005 |
| **Predecessor** | 004-launcher-diagnostics-and-signal-coverage |
| **Handoff Criteria** | All 13 P1 deep-review findings closed; strict validation passes for 005 and the arc parent; targeted launcher vitest suites and skill-advisor typecheck pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 4-phase MCP launcher concurrency arc shipped with a CONDITIONAL deep-review verdict: no P0s, but 13 P1s remained across documentation drift, missing test evidence, and real correctness gaps. The highest-risk issue was lease ownership following workspace paths instead of the resolved SQLite database directory, allowing two workspaces that share one DB override to bypass the single-writer boundary.

### Purpose

Close the 13 P1 findings in one end-to-end remediation packet so the arc has correct invariants, test evidence, and launcher behavior across skill-advisor, code-graph, and spec-memory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Correct arc and child spec drift surfaced by P1-1, P1-2, P1-3, P1-7, P1-8, and P1-10.
- Add missing skill-advisor launcher and DB-open-path coverage for P1-4, P1-5, P1-6, and P1-9.
- Fix lease ownership, SQLite WAL fallback matching, and unconditional cleanup for P1-11, P1-12, and P1-13.
- Record verification evidence in this 005 phase packet.

### Out of Scope

- New launcher architecture beyond the requested lease-path and cleanup fixes.
- Refactors outside the frozen file list supplied for this packet.
- Optional smoke launch if it would perturb currently running MCP daemons.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../spec.md` | Modify | Add central invariants and preserve phase-map traceability. |
| `../001-concurrent-daemon-corruption-fix/spec.md` | Modify | Mark child status Complete. |
| `../001-concurrent-daemon-corruption-fix/checklist.md` | Modify | Record resolved-DB lease evidence and strict validate evidence. |
| `../002-cross-launcher-lease-propagation/spec.md` | Modify | Mark status Complete and correct race-protection wording. |
| `../003-launcher-race-and-error-surface-hardening/spec.md` | Modify | Mark status Complete and align REQ-009 with six test cases. |
| `../004-launcher-diagnostics-and-signal-coverage/checklist.md` | Modify | Record strict validate evidence for 004. |
| `.opencode/bin/mk-*-launcher.cjs` | Modify | Co-locate lease files with resolved DB directories where applicable and add unconditional cleanup. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/**` | Modify | Align daemon lease DB path and SQLite fallback error handling. |
| `mcp_server/tests/launcher-*.vitest.ts` | Modify | Add missing launcher coverage and REQ anchors. |
| `references/daemon-lease-contract.md` | Modify | State resolved-DB-dir lease boundary for skill-advisor. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Child status drift closed | 001, 002, 003, and 004 child specs all show Complete. |
| REQ-002 | Parent validate claim has evidence | 004 checklist records strict validate output or parent claim is removed. |
| REQ-003 | Arc invariants centralized | Parent spec includes Cross-Cutting Invariants after the phase map. |
| REQ-004 | Race-protection text corrected | 002 spec states atomic temp-file+rename is the race guard. |
| REQ-005 | REQ-009 test-count drift closed | 003 spec lists the six launcher-lease cases. |
| REQ-006 | Launcher tests have REQ anchors | All mapped launcher-lease test cases carry nearby REQ comments. |
| REQ-007 | Skill-advisor spawn-twice integration exists | Skill-advisor launcher-lease vitest spawns launcher #2 and asserts `LEASE_HELD_BY`. |
| REQ-008 | Stale PID reclaim is covered | Skill-advisor coverage asserts stale PID leases become reclaimable. |
| REQ-009 | All DB-open paths have WAL+busy_timeout evidence | Handler boot, watcher refresh, and rebuild-from-source paths are covered by runtime or static tests. |
| REQ-010 | Full skill-advisor vitest run documented | Implementation summary records `npx vitest --run` exit code and final count. |
| REQ-011 | Resolved DB dir owns launcher leases | Shared DB-dir overrides share one lease boundary across affected launchers. |
| REQ-012 | SQLite WAL fallback codes are version-resilient | Fallback matches SQLite base and extended READONLY/CANTOPEN/IOERR codes plus filesystem write errors. |
| REQ-013 | Lease cleanup is unconditional | All three launchers run cleanup from process exit regardless of child termination path. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-014 | Verification gates pass | 005 strict validate, arc strict validate, skill-advisor typecheck, and focused launcher vitest suites exit 0. |
| REQ-015 | Commit hygiene preserved | One conventional commit on main, explicit-path staging only, no `--no-verify`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 13 P1 findings are either closed with evidence or explicitly deferred with reason. No deferrals are expected.
- **SC-002**: The lease boundary follows the resolved SQLite DB directory whenever a DB-dir override is supported.
- **SC-003**: Focused launcher suites pass for skill-advisor, code-graph, and spec-memory.
- **SC-004**: Phase 005 and the phase parent both return `RESULT: PASSED` under strict validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dirty main worktree | Staging could capture unrelated user work | Use explicit paths only and inspect status before commit. |
| Risk | Launcher smoke can perturb active daemons | Local MCP sessions could restart unexpectedly | Treat smoke as optional and skip if targeted subprocess tests prove the behavior. |
| Dependency | better-sqlite3 behavior | WAL fallback codes vary by SQLite extended result code | Match base and extended code prefixes rather than a fixed list. |
| Dependency | Existing spec validator | Phase docs must satisfy Level 2 template contract | Use spec-kit templates and run strict validation before commit. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Scope stays within the frozen file list.
- **NFR-002**: Tests must isolate environment variables that affect launcher strict mode and DB-dir ownership.
- **NFR-003**: Documentation must distinguish verified evidence from prior claims.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Shared DB override across two workspaces**: second launcher must see the first lease and exit 0 with `LEASE_HELD_BY`.
- **Dead PID lease**: stale owner must be reported reclaimable instead of blocking forever.
- **SIGKILL backstop path**: launcher exit cleanup still attempts to remove its lease.
- **SQLite extended errors**: WAL fallback must catch future `SQLITE_IOERR_*`, `SQLITE_CANTOPEN_*`, and `SQLITE_READONLY_*` variants.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| File count | Medium | Scoped packet touches launchers, tests, docs, and phase metadata. |
| Behavioral risk | Medium | Lease path changes affect process-boundary concurrency. |
| Architecture change | Low | Existing lease and launcher patterns are preserved. |
| Verification load | Medium | Requires strict validation, typecheck, focused vitest, and full skill-advisor vitest. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The user supplied the phase folder, scope, verification gates, and commit policy.
<!-- /ANCHOR:questions -->
