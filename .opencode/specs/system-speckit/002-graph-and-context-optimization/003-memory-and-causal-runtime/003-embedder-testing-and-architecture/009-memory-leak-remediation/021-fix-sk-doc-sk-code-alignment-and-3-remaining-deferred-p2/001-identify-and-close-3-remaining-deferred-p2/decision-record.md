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
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2"
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

### ADR-001: Close F35 — misleading cardinality error message in reindex.ts

**Status:** Accepted
**Date:** 2026-05-23
**Finding:** F35 — `refinement:reindex:misleading-cardinality-error-message`
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:246`

### Decision
Replace the misleading `Error('Embedding batch cardinality mismatch')` thrown in `getBatchPair` with a structured error message that names WHAT is missing (row, embedding, or both), WHERE (the index), and the array lengths so a debugging operator can immediately see the mismatch shape.

New message format:
```
Embedding batch entry missing at index ${index}: row=undefined, embedding=undefined (rows.length=N, embeddings.length=M)
```

### Rationale
- "cardinality" is a math/SQL term that doesn't describe what actually went wrong (a single index has a missing element).
- The original message didn't say WHICH side was missing, forcing a debugger to inspect both arrays manually.
- Adding the index + array lengths makes the failure self-diagnostic — the operator can see at a glance whether arrays drifted by one or are fundamentally unaligned.

### Alternatives Considered
- Keep the message terse + rely on stack trace: rejected because stack trace only shows the throw site, not the missing-element details that matter for debugging.
- Add a separate diagnostic logger: rejected because a clear error message is the standard pattern in this surface (see F30 canonical `{ phase, code, detail }` shape in arc 010/003/001).

### Compatibility Contract
- The thrown `Error` instance class is unchanged (still bare `Error`, not a custom class).
- Only the message text changed. Callers that do `catch (err) { ... err.message ... }` may need to update assertions; embedders vitest passed (54 tests / 4 files) after the edit so no live test asserted on the old text.

### Evidence
- Updated source: `mcp_server/lib/embedders/reindex.ts:246-260`
- Verification: `npm run typecheck --workspace=@spec-kit/mcp-server` PASS
- Verification: `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/` → 4 files / 54 tests PASS on first run (no F48 flake retry needed)

---

## DEFERRED

- None. F35 closed in this packet via the ADR above. Cumulative P2 closure: 68 of 68 (100%).
