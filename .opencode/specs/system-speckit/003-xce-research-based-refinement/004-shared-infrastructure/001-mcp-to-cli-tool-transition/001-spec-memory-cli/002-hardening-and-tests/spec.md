---
title: "Feature Specification: Phase 2: Hardening and Tests [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec]"
description: "Regression-lock the dual-stack guarantees: dual-simultaneous-spawn and dual-client MCP+CLI vitests, CLI-spawn idle-cleanup coverage, all-37 parity suite, and exit-69 recovery documentation."
trigger_phrases:
  - "cli hardening tests"
  - "dual simultaneous spawn test"
  - "dual client mcp cli test"
  - "cli parity suite"
  - "hardening phase"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-06T12:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase after 001-cli-core ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-spec-memory-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-002-hardening-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: Hardening and Tests

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-cli-core |
| **Successor** | 003-runtime-integration |
| **Handoff Criteria** | All new suites green; zero orphaned daemons after suite runs; parity suite enumerates 37/37 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Dual-stack spec-memory CLI implementation: daemon-backed CLI alongside the MCP registration specification.

**Scope Boundary**: Test suites and recovery documentation only — no CLI feature work (phase 1), no runtime integration (phase 3).

**Dependencies**:
- 001-cli-core shipped (the binary under test must exist)
- Existing vitest harness and the bridge multi-client tests as the base to extend
- Current daemon-lifecycle baseline (packets 026/027/140/030): re-election is gated by `SPECKIT_DAEMON_REELECTION` (set on in the runtime configs, off by code default); lease reclaim is CAS via owner-lease `wx`/atomic-rename keyed on owner-pid signal-0 + heartbeat-TTL (2×60s) + ppid-reparent; reaping requires N consecutive deep-probe failures (default 2, `SPECKIT_LEASE_PROBE_RETRIES`), serialized under the respawn lock (SIGTERM→7s→SIGKILL), with warm-daemon adoption on stale reclaim. mk-spec-memory transparent-recycles its child on SIGTERM (crash-loop guard). Tests MUST pin `SPECKIT_DAEMON_REELECTION` explicitly and assert against these mechanisms.

**Deliverables**:
- Dual-simultaneous-spawn integration test (research delta D1)
- Dual-client MCP+CLI coexistence test (research delta D2)
- CLI-spawn idle-cleanup/orphan-reaping coverage (research delta D7)
- All-37 subcommand parity suite extension
- Exit-69 recovery documentation (research delta D5)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research verdict is conditional on a set of acceptance-test deltas that do not exist yet: the spawn-race and coexistence guarantees are code-traced but not regression-locked, and the orphan-reaping behavior on the CLI-spawn path has a real-world failure precedent (six orphaned launcher processes observed on this host). Until these suites exist, any refactor can silently reopen a closed risk.

### Purpose
Convert every verified-by-code-trace guarantee into a verified-by-test guarantee, so the dual-stack safety properties survive future change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- D1: dual simultaneous auto-spawn test — two `spec-memory.cjs` invocations against the same missing/dead socket; assert exactly one owner lease (owner-lease `wx`-exclusive acquire + respawn-lock + bootstrap-lock serialization), one context-server child, the secondary bridges through the reconnecting session proxy (retryable-recycle, not error), no stale locks; pin `SPECKIT_DAEMON_REELECTION` (cover on and off); include the divergent `SPECKIT_IPC_SOCKET_DIR` case
- D2: dual-client test — MCP client + CLI client against one IPC server; assert both receive valid responses and daemon identity stays stable
- D7: CLI-spawn lifecycle coverage — backend-only `stdin: null`, IPC client disconnect, `fatalShutdown`, bridge close, lease cleanup; assert idle self-shutdown reaps the daemon (no orphans) under the current contract — reap gated on N consecutive deep-probe failures (default 2) and serialized under the respawn lock (SIGTERM→7s→SIGKILL); run the idle-reap assertion with `SPECKIT_DAEMON_REELECTION` OFF so no daemon respawns, and cover spec-memory's SIGTERM transparent-recycle as a separate (non-idle) case
- Parity suite: enumerate and invoke all 37 subcommands against a live daemon, asserting schema-valid round-trips
- D5: exit-69 recovery documentation in CLI help/docs — rebuild, update client/protocol, or check socket/config depending on mismatch class

### Out of Scope
- New CLI features or flag changes — phase 001 owns the surface
- CI pipeline restructuring — suites slot into the existing vitest harness
- Load/soak benchmarking beyond the dual-client contention case — not a research-identified risk

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp_server tests (dual-spawn suite) | Create | D1 race regression test |
| mcp_server tests (dual-client suite) | Create | D2 MCP+CLI coexistence test |
| mcp_server tests (lifecycle suite) | Create | D7 idle-cleanup/orphan coverage |
| mcp_server tests (parity suite) | Create | All-37 subcommand round-trip |
| CLI help/docs | Modify | D5 exit-69 recovery guidance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | D1 dual-spawn test exists and passes | Both orderings (race won/lost) asserted; no stale lock artifacts after run |
| REQ-002 | D2 dual-client test exists and passes | Concurrent MCP + CLI calls both succeed against one daemon |
| REQ-003 | D7 lifecycle coverage exists and passes | A CLI-spawned daemon with no clients self-shuts down within its idle window (reap gated on N-probe + respawn-lock; re-election pinned OFF for this assertion); zero orphan processes post-suite |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | All-37 parity suite | Suite fails if a tool is added/removed/renamed without codegen re-run |
| REQ-005 | D5 exit-69 recovery docs | Each mismatch class has a named recovery action in help output or docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All new suites green in the standard vitest run
- **SC-002**: Zero orphaned daemon/launcher processes after the full suite (process-table assertion)
- **SC-003**: Parity suite count locked at 37 and breaks loudly on drift
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001-cli-core shipped | Suites have nothing to test | Phase ordering enforced by parent handoff criteria |
| Risk | Race tests are timing-flaky | Med | Assert on lock/lease artifacts and process state, not wall-clock timing |
| Risk | Test daemons leak into the host process table | Med | Suite-level teardown asserts process reaping (the D7 property itself) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Delta specifications are pinned in `../000-spec-memory-cli-research/research/research.md` §14 (Required Deltas); remaining detail is planning-level.
<!-- /ANCHOR:questions -->
