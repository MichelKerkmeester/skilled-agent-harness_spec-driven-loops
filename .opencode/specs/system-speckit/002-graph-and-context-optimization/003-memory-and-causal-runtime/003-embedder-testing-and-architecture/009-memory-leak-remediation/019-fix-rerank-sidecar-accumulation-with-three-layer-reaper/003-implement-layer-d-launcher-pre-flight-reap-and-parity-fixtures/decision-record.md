---
title: "Decision Record: Layer D Launcher Pre-Flight Reap and Parity Fixtures"
description: "Packet-local decisions for JS/Python Layer D launcher pre-flight reap, health gating, debug-row preservation, and parity testing."
trigger_phrases:
  - "arc 010 005 003 decisions"
  - "layer d launcher reap adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "recorded-layer-d-decisions"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100050030100050030100050030100050030100050030100050030100050030"
      session_id: "010-005-003-layer-d-launcher-reap"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Layer D Launcher Pre-Flight Reap and Parity Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Health-Gated Layer D Reap

**Status:** Accepted
**Date:** 2026-05-23
**Context:** 010/004/001 requires launchers to reap stale sidecars before reuse or spawn.

### Decision
Both launchers reap only when every registered owner is dead and the sidecar `/health` probe is unreachable.

### Rationale
- Owner death alone can be stale ledger state.
- Health reachability proves a sidecar is still answering and should not be killed by Layer D.
- A 100 ms default reap health timeout keeps launch latency under the NFR-P02 budget.

### Consequences
- Hung or stopped sidecars with dead owners are cleaned before a new spawn.
- Live healthy sidecars survive even when owner metadata is imperfect.

---

## ADR-002: Missing Owner List Means Debug-Safe Skip

**Status:** Accepted
**Date:** 2026-05-23
**Context:** The user contract forbids killing operator-spawned debug sidecars, and identifies rows without an owners list as debug-mode.

### Decision
Rows missing the `owners` field are skipped by launcher pre-flight. Rows with explicit `owners: []` still follow the shared fixture predicate and are reapable when health is unreachable.

### Rationale
- Missing and explicit empty owner lists carry different intent in this phase.
- Preserving missing-owner rows avoids silently converting debug rows into reap candidates.
- Healthy matching legacy rows still migrate when the launcher reuses them and registers its owner.

### Consequences
- Python needs raw ledger inspection under lock because its dataclass normalizes missing owners to an empty tuple.
- JS preserves `ownersListPresent` internally when serializing kept debug rows.

---

## ADR-003: JS Uses Current PID Identity Semantics

**Status:** Accepted
**Date:** 2026-05-23
**Context:** Python's ledger v2 helper reads identity for the actual owner PID. In Node, shell `$$` inside `execSync()` identifies the transient shell process, not the long-lived launcher process.

### Decision
The JS launcher reads `ps -p <current pid> -o lstart=,comm=` for owner identity and uses the same lstart/comm comparison as Python.

### Rationale
- Registering shell identity against the Node PID would make a live owner appear recycled.
- The parity contract is about identity semantics, not shell expansion behavior.
- Tests assert the exact PID-based command used for current owner registration.

### Consequences
- Layer B will not self-kill a sidecar merely because JS registered the wrong process identity.
- JS and Python owner records are semantically equivalent.

---

## ADR-004: Fixture Matrix Is the Cross-Runtime Contract

**Status:** Accepted
**Date:** 2026-05-23
**Context:** 010/004/001 ADR-005 requires JS and Python launchers to return identical classifications and reap decisions.

### Decision
Vitest reads the same `reaper-ledger-cases.json` consumed by `test_sidecar_ledger.py` and asserts liveness reasons plus boolean reap decisions for every case.

### Rationale
- Shared JSON avoids comment-only parity.
- The matrix covers ok, PID recycled, EPERM, ESRCH, unknown, live-owner, all-dead, and empty-owner cases.
- Launcher-specific health and migration behavior remains covered in JS tests where the launcher entrypoint is available.

### Consequences
- Adding a future liveness reason requires updating both runtimes and the fixture.
- The implementation summary must record JS and Python verdicts for all fixture cases.
