---
title: "Spec: Ledger v2 Schema and Identity-Verified PID Helpers"
description: "Level 2 child phase implementing the rerank-sidecar ledger v2 owner identity foundation and shared reaper fixture matrix."
trigger_phrases:
  - "arc 010 005 001 ledger v2"
  - "identity verified pid helpers"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid"
    last_updated_at: "2026-05-23T11:30:00Z"
    last_updated_by: "codex"
    recent_action: "completed-ledger-v2-foundation"
    next_safe_action: "Parent agent commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py"
      - ".opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py"
      - ".opencode/skills/system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json"
    session_dedup:
      fingerprint: "sha256:0100050010100050010100050010100050010100050010100050010100050010"
      session_id: "010-005-001-ledger-v2-identity-pid"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope is limited to ledger v2 helpers, Python ledger tests, shared JSON fixtures, and this packet's docs."
---

# Spec: Ledger v2 Schema and Identity-Verified PID Helpers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 foundation for arc 010/005 |
| **Status** | Completed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (010/005) |
| **Binding Contract** | Arc 010/004/001 ADR-002, ADR-003, and ADR-005 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The rerank sidecar ledger currently records sidecar rows without process-owner identities. `kill(pid, 0)` alone cannot distinguish a live original owner from a recycled PID, so the three-layer reaper needs a v2 ledger owner schema and identity-verified liveness helpers before launcher and app reaper phases can safely consume ownership data.

### Purpose

Implement the foundation layer: ledger v2 rows with owner identity entries, identity-verified PID liveness reasons, locked owner prune/register helpers, v1 compatibility, Python pytest coverage, and a shared JSON fixture matrix for later JS parity tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Modify `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`.
- Add/update `.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py`.
- Add `.opencode/skills/system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json`.
- Create this packet's Level 2 documentation and metadata.

### Out of Scope

- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` app self-reaper.
- Python and JS launcher pre-flight reaper integration.
- `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh`.
- Rerank sidecar README/SKILL operator documentation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | Modify | Add v2 owner identities, identity liveness, v1 compatibility, locked prune/register helpers. |
| `.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py` | Modify | Add pytest classes covering schema, liveness, pruning, registration, compatibility, and fixtures. |
| `.opencode/skills/system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json` | Create | Shared cross-runtime fixture matrix for owner liveness and reap decisions. |
| `<this-folder>/*` | Create | Level 2 packet docs, metadata, and scratch marker. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ledger writes use ADR-003 v2 payload. | Written payload has `version: 2` and `sidecars` rows with `owners` identity entries. |
| REQ-002 | Readers are backward compatible with v1 rows. | Missing or v1 payloads read without errors and are upgraded in memory to v2 row objects. |
| REQ-003 | PID liveness is identity-verified. | `process_liveness(pid, recorded_create_timestamp, recorded_comm)` returns ADR-002 reasons and detects PID recycling. |
| REQ-004 | Owner mutation helpers are locked. | Owner prune/register helpers execute under `fcntl.flock(LOCK_EX)`. |
| REQ-005 | Shared fixtures are language-neutral. | JSON fixture matrix covers the required live, dead, recycled, PID 1, EPERM, ESRCH, mixed, and empty-owner cases. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Pytest covers ledger foundation behavior. | Required classes exist and targeted pytest exits 0. |
| REQ-007 | Unknown liveness errors are explicit. | Unknown errno logs to stderr and returns alive fail-open with `reason: "unknown"`. |
| REQ-008 | Packet docs are synchronized. | `checklist.md` and `implementation-summary.md` record file:line evidence and verification commands. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sidecar_ledger.py` writes v2 ledgers while reading v1 rows safely.
- **SC-002**: Identity-verified liveness returns `pid-1-orphaned`, `kill-0-eperm`, `kill-0-esrch`, `pid-recycled`, `ok`, and `unknown`.
- **SC-003**: Locked owner prune/register helpers preserve concurrent ledger safety.
- **SC-004**: Shared fixture matrix is present and consumed by Python tests.
- **SC-005**: Targeted pytest and strict spec validation exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | macOS `ps` access can be blocked by sandbox. | Parser behavior could be inferred instead of verified. | Attempt empirical command, document result, and test parser with exact ADR shape. |
| Risk | v2 schema change can break existing launcher tests. | Rerank launcher reuse may regress. | Keep row dataclass backward compatible and preserve existing row fields. |
| Risk | Empty legacy rows can be misinterpreted. | Self-reaper phase could kill too aggressively. | This phase exposes explicit `should_reap_row`; later app phase owns legacy self-check policy. |
| Dependency | Arc 010/004/001 ADRs. | Contract is binding. | Implement ADR-002, ADR-003, and ADR-005 verbatim where this phase owns them. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Ledger mutation helpers must use exclusive file locking and atomic replacement.
- **NFR-R02**: Unknown liveness and unparseable identity must fail open as alive.

### Maintainability

- **NFR-M01**: Fixture cases must be readable by Python and JS without runtime-specific types.
- **NFR-M02**: Public helper names and return reasons must be stable for later phases.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Missing `version` or `version: 1` ledger payload.
- Owner entries missing `createTimestamp` or `comm`.
- Legacy rows with no `owners`.
- Multiple owners where one remains alive.

### Error Scenarios

- PID 1 owner.
- `kill(pid, 0)` returns EPERM or ESRCH.
- `kill(pid, 0)` succeeds for a recycled PID with mismatched `ps` identity.
- Unknown `OSError.errno` from `kill(pid, 0)`.
- `ps` output is empty, blocked, or unparseable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One Python module, one pytest file, one JSON fixture, packet docs. |
| Risk | 14/25 | Cross-runtime schema and process-liveness semantics affect later launcher/app phases. |
| Research | 8/20 | Binding ADRs and F69/F102 precedent are already available. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- No open product questions. The binding ADRs define the schema, liveness reasons, and fixture parity contract for this child phase.
<!-- /ANCHOR:questions -->
