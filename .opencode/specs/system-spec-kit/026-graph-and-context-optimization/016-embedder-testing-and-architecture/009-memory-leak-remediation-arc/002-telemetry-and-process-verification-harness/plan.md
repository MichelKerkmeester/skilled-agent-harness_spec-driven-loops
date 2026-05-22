---
title: "Plan: Telemetry and Process Verification Harness"
description: "Implementation plan for Telemetry and Process Verification Harness."
trigger_phrases:
  - "telemetry-and-process-verification-harness"
  - "memory leak 2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/002-telemetry-and-process-verification-harness"
    last_updated_at: "2026-05-22T13:45:00Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-002-harness"
    next_safe_action: "start-003-cli-dispatch"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0202020202020202020202020202020202020202020202020202020202020202"
      session_id: "009-memory-leak-remediation-arc-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Telemetry and Process Verification Harness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, shell, MCP servers, local CLI runtimes |
| **Framework** | Spec Kit Memory, CocoIndex, Code Graph, deep-loop workflows |
| **Storage** | JSONL state, SQLite/index files, sidecar ledgers, spec docs |
| **Testing** | Vitest, pytest, shell smoke checks, host telemetry harness |

### Overview
Build reusable verification for process cleanup, RSS, swap, wired memory, sidecars, stale locks, and daemon identity. The phase must preserve source evidence from the research packets and avoid claiming memory relief without process and telemetry proof.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source evidence links from packets 020 and 024 are listed.
- [x] Verification commands or harness fixtures are named.
- [x] Expected daemons and destructive cleanup boundaries are explicit.

### Definition of Done
- [x] REQ-001 and REQ-002 are satisfied or explicitly deferred by the operator.
- [x] Stack-specific tests or telemetry checks pass.
- [x] This phase and the parent phase map are updated with evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-first remediation with exact process/resource ownership.

### Key Components
- **Evidence sources**: Source packets 020 and 024.
- **Verification harness**: Process, memory, sidecar, lock, and state checks.
- **Implementation surface**: `.opencode/skills/system-spec-kit/`, `.opencode/skills/mcp-coco-index/`, `.opencode/skills/system-code-graph/`.

### Data Flow
Research evidence selects the fix boundary, the harness proves the current failure and final behavior, then phase docs record evidence and hand off to the next phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/` | Phase implementation or evidence surface | Inspect and update only within this phase scope | Synthetic child/grandchild, stale lock, sidecar, and vm_stat/sysctl fixtures |
| `.opencode/skills/mcp-coco-index/` | Phase implementation or evidence surface | Inspect and update only within this phase scope | Synthetic child/grandchild, stale lock, sidecar, and vm_stat/sysctl fixtures |
| `.opencode/skills/system-code-graph/` | Phase implementation or evidence surface | Inspect and update only within this phase scope | Synthetic child/grandchild, stale lock, sidecar, and vm_stat/sysctl fixtures |

Required inventories:
- Same-class producers must be found before changing shared cleanup helpers.
- Consumers of changed process, protocol, state, or health fields must be listed.
- Matrix axes must include normal completion, timeout, parent death, stale lock, and expected-daemon cases when applicable.
- Algorithm invariant: no cleanup path may kill unknown-owner or current-session processes without exact identity.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Lock
- [x] Confirm source packet findings and unresolved gaps.
- [x] Record exact affected files and process/resource identities.

### Phase 2: Change or Harness
- [x] Implement scoped harness or remediation changes.
- [x] Keep destructive cleanup disabled unless exact ownership is proven.

### Phase 3: Verification
- [x] Run stack-specific tests and telemetry checks.
- [x] Update this phase summary and parent handoff evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Ownership, parser, protocol, or state helpers | Vitest or pytest |
| Integration | CLI/deep-loop/MCP lifecycle paths | Shell, MCP smoke checks |
| Telemetry | Process count, RSS, swap, wired memory, sidecars | Harness from phase 002 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Source research evidence | Internal spec docs | Available | Phase must not proceed without source-backed scope. |
| Verification harness | Internal tooling | Planned | Memory or cleanup claims remain unproven. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests fail, cleanup kills an expected daemon, or memory/process telemetry worsens.
- **Procedure**: Revert the phase changes, preserve telemetry logs, restore previous config flags, and rerun the before/after harness.
<!-- /ANCHOR:rollback -->
