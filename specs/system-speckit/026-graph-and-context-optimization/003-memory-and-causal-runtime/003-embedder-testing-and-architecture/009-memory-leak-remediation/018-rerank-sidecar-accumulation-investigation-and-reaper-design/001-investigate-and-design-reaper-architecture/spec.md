---
title: "Spec: Investigate Rerank-Sidecar Accumulation + Design Three-Layer Reaper Architecture"
description: "Level 3 investigation packet — map current lifecycle, verify no reaper today, evaluate three-layer GC (self-check + pre-flight reap + idle backstop), emit ≥ 5 ADRs + Files-to-Change list ready for follow-on implementation."
trigger_phrases:
  - "rerank sidecar reaper investigation"
  - "owner-liveness gc design"
  - "sidecar identity-verified pid check"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "completed-reaper-design-packet"
    next_safe_action: "open-follow-on-010-005"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions:
    open_questions: []
    answered_questions:
      - "Three-layer B+D+A design retained with refined in-flight gate and managed-sidecar policy."
      - "Identity-verified PID check uses kill(0) plus macOS ps -p PID -o lstart= -o comm=."
      - "Heartbeat default 45s, idle default 30 minutes, reap-on-launch always."
---

# Spec: Investigate Rerank-Sidecar Accumulation + Design Three-Layer Reaper Architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Investigation packet: cli-codex GPT-5.5 xhigh fast investigates why rerank_sidecar uvicorn workers accumulate (25 stale, ~16 GB on this machine), evaluates a three-layer reaper design, and emits ADRs ready for a follow-on implementation packet. No code modified.

**Key Decisions**: three-layer architecture (sidecar self-check + launcher pre-flight reap + idle backstop), identity-verified PID liveness (pid + create-timestamp + comm), ledger schema extension, parity-test contract.

**Critical Dependencies**: arc 010/002 + 010/003 hardening (F88 / F102 / F69 / F15 / F49) already shipped.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (010/004) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
25 stale rerank_sidecar workers accumulated on this machine consuming ~16 GB RAM. The cause is structural: `start_new_session=True` daemonizes the sidecar for warm-model reuse, but no reaper exists to clean up sidecars whose owner-set has emptied. Without an investigation packet that produces a binding design, the implementation packet has no contract to follow.

### Purpose
Produce an investigation deliverable that maps the exact current lifecycle (file:line citations), evaluates the proposed three-layer reaper design (sidecar self-check + launcher pre-flight reap + idle backstop), and emits ≥ 5 ADRs + concrete Files-to-Change list for the follow-on implementation packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code-evidenced lifecycle map (spawn → register → serve → exit-or-not paths) with file:line citations.
- Verify no reaper hook exists today (or surface partial reaper if found).
- Evaluate three-layer design B+D+A: pros/cons/edge cases/test contract per layer.
- Identity-verified PID-liveness design: pid + create-timestamp + comm via macOS `ps`.
- Ledger schema extension to record `(pid, create_timestamp, comm)`.
- Tunable defaults: heartbeat interval, idle threshold, reap-on-launch policy.
- Telemetry contract: `sidecar-reaper.jsonl` forensic log.
- Parity-test contract: JS + Python twins agree on identity-check semantics.
- Files-to-Change list for the follow-on implementation packet.
- ≥ 5 ADRs in decision-record.md.

### Out of Scope
- Implementing the reaper (deferred to follow-on packet 010/005).
- Modifying any source files in this packet — investigation only.
- Changing `start_new_session=True` intent.
- Adopting launchd / atexit alternatives (rejected upstream).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `<this-folder>/research/` | Create | iter-001.md investigation + research.md synthesis |
| `<this-folder>/decision-record.md` | Create | ≥ 5 ADRs |
| `<this-folder>/implementation-summary.md` | Create | Completion record |
| `<this-folder>/plan.md` + `tasks.md` + `checklist.md` | Create | Canonical-anchor scaffold (codex authors) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Code-evidenced lifecycle map | `research/research.md` cites ≥ 8 file:line locations across launcher (.cjs + .py), uvicorn app, ledger, and client.py |
| REQ-002 | ≥ 5 ADRs in decision-record.md | Topics: three-layer architecture, identity-verified PID, ledger schema, tunable defaults, parity-test contract, telemetry, in-flight-request gate |
| REQ-003 | Files-to-Change list for follow-on packet | Concrete absolute paths + per-file change-type + per-file invariant |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Edge-case inventory | ≥ 6 edge cases covered (multi-owner partial death, last-owner-during-request, PID reuse, sidecar in SIGSTOP, ledger race, operator-spawned debug) |
| REQ-005 | Strict validate exit 0 | `validate.sh <packet> --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Investigation deliverable produces a binding contract for follow-on implementation.
- **SC-002**: ≥ 5 ADRs with explicit alternatives-considered + consequences.
- **SC-003**: Strict validate exit 0.
- **SC-004**: Goal alignment: design provably achieves "every worker killed when inactive or terminal closed".
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Three-layer design over-engineered; one layer might suffice | Med | Evaluate each layer's marginal coverage; reject any layer whose contribution is already covered |
| Risk | Identity-verified PID check too brittle (macOS `ps` format quirks) | Med | Specify exact `ps` flag set + parse contract; fixture test in implementation packet |
| Risk | Reaper kills in-flight request | High | ADR mandates in-flight-request gate before self-exit |
| Dependency | Arc 010/002 + 010/003 lifecycle hardening must remain stable | Low | All shipped; not at risk |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Heartbeat overhead ≤ 0.1% CPU per sidecar.
- **NFR-P02**: Reap-on-launch latency ≤ 200ms added to ccc search cold-launch.

### Reliability
- **NFR-R01**: ZERO false-positive kills of live-owner sidecars across 100-fixture test matrix.
- **NFR-R02**: 100% kill rate for owners-all-dead sidecars within `max(heartbeat_interval, idle_timeout, next_launch_interval)`.

---

## 8. EDGE CASES

### Data Boundaries
- Multi-owner with one dying: ✓ sidecar continues for live owners.
- Last owner dies mid-request: ✓ in-flight-request gate delays self-exit.
- PID reuse (OS recycles dead owner's PID): ✓ identity check via create-timestamp + comm rejects recycled PIDs.

### Error Scenarios
- Sidecar in SIGSTOP / D-state: D-layer pre-flight reap catches at next launch.
- Ledger race during reap: F69 flock parity already in place.
- Operator manually spawned debug sidecar (no ledger entry): NOT reaped — manual ownership respected.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Investigation only; no code edits |
| Risk | 6/25 | Cosmetic packet risk; impl risk deferred |
| Research | 18/20 | Deep investigation + design |
| Multi-Agent | 4/15 | Single cli-codex dispatch |
| Coordination | 6/15 | Parent agent + 1 dispatch |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Codex hallucinates lifecycle paths | H | M | Require file:line evidence per claim |
| R-002 | Investigation chooses single-layer design that misses edge cases | M | L | Explicit edge-case checklist in checklist.md |

---

## 11. USER STORIES

### US-001: Investigation deliverable drives implementation packet (Priority: P0)

**As a** parent agent dispatching the follow-on implementation packet, **I want** a binding ADR set + Files-to-Change list, **so that** I can hand off to cli-codex with zero ambiguity.

**Acceptance Criteria**:
1. Given the deliverable, When the implementation packet's spec.md references it, Then every Files-to-Change entry has a corresponding ADR.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Resolved: three-layer B+D+A is justified because each layer has non-zero marginal coverage.
- Resolved: heartbeat default is 45 seconds.
- Resolved: idle backstop default is 30 minutes.
- Resolved: reaper telemetry should be JSONL runtime evidence, not automatic memory writes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Memory note**: `project_ccc_search_orphan_root_cause`
- **Predecessor hardening**: arc 010/002 + 010/003
