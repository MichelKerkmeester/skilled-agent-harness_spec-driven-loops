---
title: "Decision Record: Ledger v2 Schema and Identity-Verified PID Helpers"
description: "Ratification notes for implementing arc 010/004/001 ADR-002, ADR-003, and ADR-005 in the ledger foundation phase."
trigger_phrases:
  - "arc 010 005 001 decision record"
  - "ledger v2 identity pid adr"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid"
    last_updated_at: "2026-05-23T11:30:00Z"
    last_updated_by: "codex"
    recent_action: "accepted-ledger-v2-ratification"
    next_safe_action: "Parent agent commit handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100050010100050010100050010100050010100050010100050010100050010"
      session_id: "010-005-001-ledger-v2-identity-pid"
      parent_session_id: null
    completion_pct: 100
---

# Decision Record: Ledger v2 Schema and Identity-Verified PID Helpers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Ratify Binding Reaper Foundation ADRs

**Status:** Accepted
**Date:** 2026-05-23

### Context

Arc 010/004/001 produced the binding reaper contract. This child phase owns only the ledger foundation subset: ADR-002 identity-verified PID liveness, ADR-003 ledger schema extension, and ADR-005 shared parity fixtures.

### Decision

Implement the predecessor ADRs without semantic refinement:

- Use ADR-003 ledger payload shape `{"version": 2, "sidecars": [...]}` for production writes.
- Preserve `ownerToken` and add per-row owner identity records.
- Use ADR-002 liveness reasons exactly: `ok`, `pid-recycled`, `kill-0-eperm`, `kill-0-esrch`, and `unknown`, plus the prior structured-liveness orphan reason `pid-1-orphaned` required by this packet.
- Add a shared JSON fixture matrix for later JS parity tests.

### Consequences

Later launcher and app phases can depend on stable Python helpers and fixture semantics. This packet intentionally does not change launcher behavior, app self-reaping, shell env forwarding, or operator docs.

### Evidence

- `../../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/decision-record.md`
- `../../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/research/research.md`
- `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity/decision-record.md`
