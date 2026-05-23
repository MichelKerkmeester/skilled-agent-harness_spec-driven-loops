---
title: "Plan: Research Synthesis and Remediation Map"
description: "Implementation plan for Research Synthesis and Remediation Map."
trigger_phrases:
  - "research-synthesis-and-remediation-map"
  - "memory leak 1"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map"
    last_updated_at: "2026-05-22T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed the consolidated remediation map and source evidence index."
    next_safe_action: "Start 002-telemetry-and-process-verification-harness."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "checklist.md"
      - "decision-record.md"
      - "resource-map.md"
      - "research/remediation-map.md"
      - "research/source-evidence-index.md"
    session_dedup:
      fingerprint: "sha256:0101010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from relocated 020 and 024 source research under the parent arc."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Plan: Research Synthesis and Remediation Map

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, shell, MCP servers, local CLI runtimes |
| **Framework** | Spec Kit Memory, CocoIndex, Code Graph, deep-loop workflows |
| **Storage** | JSONL state, relocated research archives, source packet docs, SQLite/index files, sidecar ledgers, spec docs |
| **Testing** | Vitest, pytest, shell smoke checks, host telemetry harness |

### Overview
Produce one authoritative remediation map from the system-spec-kit and code-index memory-leak research packets. The phase must preserve source evidence from the research packets and avoid claiming memory relief without process and telemetry proof.
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
- [x] Runtime tests are not applicable for this docs-only synthesis; strict spec validation is the phase gate.
- [x] This phase and the parent phase map are updated with evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-first remediation with exact process/resource ownership.

### Key Components
- **Evidence sources**: Recovered packet 020 and 024 archives under `research/source-research/`.
- **Verification harness**: Process, memory, sidecar, lock, and state checks.
- **Implementation surface**: `research/remediation-map.md`, `research/source-evidence-index.md`.

### Data Flow
Research evidence selects the fix boundary, the harness proves the current failure and final behavior, then phase docs record evidence and hand off to the next phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/remediation-map.md` | Phase implementation or evidence surface | Inspect and update only within this phase scope | Strict spec validation plus manual evidence-link spot checks |
| `research/source-evidence-index.md` | Phase implementation or evidence surface | Inspect and update only within this phase scope | Strict spec validation plus manual evidence-link spot checks |

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
- [x] Implement scoped synthesis docs only; no runtime cleanup path was changed.
- [x] Keep destructive cleanup disabled unless exact ownership is proven.

### Phase 3: Verification
- [x] Run strict spec validation for this phase and parent arc.
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
| Source research evidence | Internal spec docs | Archived under phase `research/source-research/` | Phase must not proceed without source-backed scope. |
| Verification harness | Internal tooling | Next phase | Memory or cleanup claims remain unproven. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests fail, cleanup kills an expected daemon, or memory/process telemetry worsens.
- **Procedure**: Revert the phase changes, preserve telemetry logs, restore previous config flags, and rerun the before/after harness.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Unlocks |
|-------|------------|---------|
| `001-research-synthesis-and-remediation-map` | Recovered source packet 020 and 024 archives | Phase 002 harness planning |
| `002-telemetry-and-process-verification-harness` | Phase 001 source map and open verification gaps | Runtime remediation phases 003-010 |
| `003-010` | Phase 002 process/RSS/swap/sidecar gates | Safe cleanup and lifecycle fixes |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Size | Notes |
|-----------|------|-------|
| Archive relocation | M | Move source research trees and packet docs into phase 001. |
| Level 3 documentation | M | Add checklist, decision record, resource map, and metadata updates. |
| Metadata cleanup | S | Remove old packet references before deletion. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Trigger | Rollback Action | Verification |
|---------|-----------------|--------------|
| Missing source artifact | Restore from git/worktree before deleting old packets | Recheck iteration and delta counts. |
| Parent validation failure | Restore child references or update graph metadata | Re-run parent strict validation. |
| Deleted packet path required later | Recreate folder from `research/source-research/<packet>/packet-docs/` and copy archived `research/` tree | Validate restored packet. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
020 original research ─┐
                       ├─> phase 001 source archive ─> remediation map ─> phase 002 harness
024 original research ─┘                                      │
                                                               └─> phases 003-010 runtime remediation
```

Critical rule: no destructive process cleanup path can bypass the phase 002 harness and exact-owner verification.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Preserve all original research artifacts under phase 001.
2. Add Level 3 control docs and validation checklist.
3. Remove old child references from source stack parents.
4. Delete old packet directories.
5. Revalidate phase 001, arc parent, source stack parents, and umbrella parent.
6. Start phase 002 harness implementation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M1: Archive recovered | Complete | `research/source-research/` contains 020 and 024 archives. |
| M2: Level 3 docs added | Complete | `checklist.md`, `decision-record.md`, `resource-map.md`. |
| M3: Deletion readiness | Pending final validation | Parent metadata updated before deletion. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Store original research under phase-local `research/source-research/`. | Accepted |
| ADR-002 | Delete old 020 and 024 source packet folders after recovery and validation. | Accepted |
| ADR-003 | Keep phase 002 as the harness-first next phase. | Accepted |
<!-- /ANCHOR:l3-adr-summary -->
