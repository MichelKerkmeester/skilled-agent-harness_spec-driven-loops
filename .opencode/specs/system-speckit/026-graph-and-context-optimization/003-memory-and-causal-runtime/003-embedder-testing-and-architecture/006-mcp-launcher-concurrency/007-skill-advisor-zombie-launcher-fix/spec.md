---
title: "Skill-Advisor Zombie Launcher Fix"
description: "Investigate and close the post-006 skill-advisor launcher zombie regression where three mk-skill-advisor-launcher instances survived while code-index and spec-memory stayed single-owner."
trigger_phrases:
  - "skill-advisor zombie launcher"
  - "mk-skill-advisor-launcher duplicates"
  - "007 zombie launcher fix"
  - "daemon sqlite launcher race"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 007 implementation"
    next_safe_action: "Commit explicit scoped paths"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-skill-advisor-zombie-launcher-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Spec folder: user supplied existing empty 007 phase folder"
      - "Branch policy: stay on main"
---
# Skill-Advisor Zombie Launcher Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 007 |
| **Predecessor** | 006-lease-canonicalization-and-cleanup-ordering |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After Phase 006 shipped, a live process audit at 2026-05-18T16:47Z still observed three `mk-skill-advisor-launcher` processes while `mk-code-index-launcher` and `mk-spec-memory-launcher` each held at one. The discrepancy exists because skill-advisor checks the daemon SQLite lease before spawn, but the daemon lease is only acquired inside the child server after startup work; loser children can remain alive in degraded mode and keep their parent launchers alive.

### Purpose

Close the skill-advisor-only zombie launcher gap at the launcher boundary, add a spawn-three regression test, and document why the daemon SQLite lease alone did not enforce the user-visible launcher process invariant.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Root-cause the difference between skill-advisor's daemon SQLite lease and the inline PID-file launchers.
- Add the minimal skill-advisor launcher guard required to reject duplicate launcher spawns before the daemon child can survive in degraded mode.
- Add focused Vitest coverage for the observed spawn-three zombie pattern.
- Record verification evidence and commit handoff in this 007 packet.

### Out of Scope

- Changes to `mk-code-index-launcher.cjs` or `mk-spec-memory-launcher.cjs`; both already satisfy the process-count invariant.
- Broader daemon lifecycle refactors in `advisor-server.ts`, `lifecycle.ts`, or watcher code.
- New feature work in the skill graph, scorer, hook, or memory systems.
- Archiving stale files; this packet deletes nothing unless the root cause requires deletion.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create | Phase 007 Level 2 packet. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Add launcher-owned PID guard before spawning the daemon-backed server. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Modify | Add spawn-three zombie-prevention coverage and align fixture ownership with the launcher. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Inspect / modify only if needed | Verify daemon SQLite path behavior; no change unless the root cause requires it. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| 007-REQ-001 | Skill-advisor rejects concurrent launcher spawns | Spawn launcher #1, wait for steady state, spawn #2 and #3, and both exit 0 with `LEASE_HELD_BY:<pid#1>` while only launcher #1 remains alive. |
| 007-REQ-002 | Launcher-boundary guard closes pre-daemon race | `mk-skill-advisor-launcher.cjs` writes an owned lease before `launchServer()` and checks that lease before duplicate spawns can reach the child server. |
| 007-REQ-003 | Existing daemon SQLite guard remains intact | The launcher still probes `lease.ts` daemon lease state, including canonical DB-dir and legacy daemon lease behavior from Phase 006. |
| 007-REQ-004 | Cleanup remains ordered before signal mirror | `clearLeaseFile()` still runs before any child signal mirror and through process-exit backstop paths. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| 007-REQ-005 | Focused tests cover the real failure shape | `launcher-lease.vitest.ts` includes a `007-REQ-001` spawn-three regression case. |
| 007-REQ-006 | Verification gates pass or blockers are documented | Strict spec validate, typecheck, focused Vitest, and smoke evidence are recorded in `implementation-summary.md`. |
| 007-REQ-007 | Scope lock preserved | Only the 007 docs plus listed skill-advisor launcher/test files change. |
| 007-REQ-008 | Commit handoff explicit if sandbox blocks Git | `implementation-summary.md` includes the exact `git add` path block if `.git/index.lock` cannot be created. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The skill-advisor launcher has the same user-visible process-count invariant as code-index and spec-memory: one live launcher per lease boundary.
- **SC-002**: Duplicate skill-advisor launches exit cleanly with `LEASE_HELD_BY:<ownerPid>` instead of spawning degraded child servers.
- **SC-003**: The new spawn-three test fails against the missing-guard behavior and passes after the fix.
- **SC-004**: Requested verification gates are run and evidence is recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## 6. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: The fix must be surgical and avoid changing working code-index/spec-memory paths.
- **NFR-002**: Lease identity must continue to use canonical DB-dir resolution for override and symlink cases.
- **NFR-003**: Duplicate launchers should exit 0 because a held lease is a handled contention state, not a crash.
- **NFR-004**: The launcher must not depend on a child daemon reaching `startSkillGraphDaemon()` before duplicates are rejected.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

- **Startup window before daemon lease acquisition**: duplicates launched after parent spawn but before child daemon acquisition must still reject.
- **Degraded daemon loser**: a child that fails to acquire the daemon lease must not keep an extra launcher process alive.
- **Legacy daemon lease path**: live legacy SQLite owners must still block rolling-start duplicates via the existing Phase 006 probe.
- **Signal mirror**: child signal exits must not bypass launcher lease cleanup.
- **Sandbox process listing**: smoke verification may need to document `ps` restrictions if the runtime blocks process-list access.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| File count | Low | One launcher, one focused test file, and the 007 packet docs. |
| Behavioral risk | Medium | Startup process ownership affects live MCP launcher behavior. |
| Architecture change | Low | Keeps the daemon SQLite lease and adds the missing launcher-boundary guard. |
| Verification load | Medium | Requires strict spec validation, typecheck, focused Vitest, and smoke launch evidence. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | State file and lease file share `.mk-skill-advisor-launcher.json` | Ready-state writes could overwrite lease ownership | Write ready state before acquiring the launcher PID guard; let the PID guard own the file while live. |
| Risk | Process-list commands blocked by sandbox | Smoke check cannot use `ps` directly | Record the sandbox error and rely on targeted subprocess assertions where process listing is unavailable. |
| Risk | Dirty worktree | Accidental staging could capture unrelated changes | Use explicit path staging only and document handoff. |
| Dependency | Built dist lease module | Launcher preflight currently requires built `lease.js` for daemon SQLite state | Keep the new launcher PID guard local to the launcher so the fix does not require committed dist output. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The user supplied the phase folder, scope, branch policy, verification gates, and commit subject.
<!-- /ANCHOR:questions -->
