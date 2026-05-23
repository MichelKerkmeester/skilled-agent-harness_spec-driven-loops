---
title: "Decision Record: Identify and Close 3 Remaining Deferred P2 Findings"
description: "ADRs for the P2 reconciliation sweep and per-finding closure or DEFERRED-AGAIN outcomes."
trigger_phrases:
  - "021 001 ADR"
  - "remaining deferred p2 ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2"
    last_updated_at: "2026-05-23T13:00:00Z"
    last_updated_by: "codex"
    recent_action: "Reconciliation halted"
    next_safe_action: "Resolve 67+1 vs expected 65+3 discrepancy before closure"
    blockers:
      - "P2 tally reconciled to 67 CLOSED + 1 DEFERRED instead of 65 CLOSED + 3 DEFERRED"
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0210010210010210010210010210010210010210010210010210010210010210"
      session_id: "021-001-identify-close-remaining-p2"
      parent_session_id: null
    completion_pct: 40
---
# Decision Record: Identify and Close 3 Remaining Deferred P2 Findings

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-000: Reconcile before implementation

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** All P2 findings from arc 015

### Decision
No source file is edited until the 015 registry and required child checklists reconcile to exactly 68 P2 findings, with 65 CLOSED and 3 DEFERRED.

### Rationale
- The user provided a high-confidence prior, not a substitute for the sweep.
- Closing the wrong finding would corrupt the final P2 audit trail.
- The CSV creates a packet-local artifact without mutating frozen predecessor docs.

### Alternatives Considered
- Trust the prior IDs and patch immediately: rejected because the prompt forbids touching code before reconciliation.
- Edit historical checklists to mark missed closures: rejected because arc 010/016/017/018/019/020 docs are frozen.

### Compatibility Contract
This decision changes only packet-local evidence production. It has no runtime compatibility impact.

### Evidence
- `scratch/p2-closure-tally.csv` contains 68 P2 rows.
- `scratch/reconciliation-error.md` records observed math: 67 CLOSED + 1 DEFERRED.
- The only DEFERRED row is F35 at `017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/checklist.md:84`.

---

## Per-Finding ADRs

Per-finding closure ADRs were not appended because the reconciliation gate failed before the closure phase.

## DEFERRED

- None. The run halted at reconciliation rather than entering per-finding closure or DEFERRED-AGAIN classification.
