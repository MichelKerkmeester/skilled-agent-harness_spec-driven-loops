---
title: "Tasks: Identify and Close 3 Remaining Deferred P2 Findings"
description: "Task breakdown for reconciling 68 original P2 findings and closing or ADR-deferring the 3 still-open IDs."
trigger_phrases:
  - "021 001 tasks"
  - "remaining deferred p2 tasks"
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
    key_files: []
    session_dedup:
      fingerprint: "sha256:0210010210010210010210010210010210010210010210010210010210010210"
      session_id: "021-001-identify-close-remaining-p2"
      parent_session_id: null
    completion_pct: 40
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Identify and Close 3 Remaining Deferred P2 Findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Marker | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Complete |
| `[!]` | Blocked or deferred |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Scaffold Level 2 docs and metadata without changing existing `spec.md` semantics.
- [x] T-002 Run strict validation before source edits.
- [x] T-003 Read the 015 registry and every required child checklist path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Emit `scratch/p2-closure-tally.csv` with 68 P2 rows.
- [!] T-005 Reconcile tally to 65 CLOSED and 3 DEFERRED before code edits. Observed 67 CLOSED + 1 DEFERRED; see `scratch/reconciliation-error.md`.
- [!] T-006 Close identified JS/Python parity drift findings with Python twin changes and pytest fixtures, if applicable. Halted before code edits.
- [!] T-007 Close identified zero-importer barrel export finding with consumer grep, direct test imports, and export removal, if applicable. Halted before code edits.
- [!] T-008 Write one ADR per identified finding, including DEFERRED-AGAIN rationale when closure is out of scope. Halted before closure phase.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [!] T-009 Run system-rerank-sidecar pytest. Skipped because implementation halted before code edits.
- [!] T-010 Run system-spec-kit embedders vitest. Skipped because implementation halted before code edits.
- [!] T-011 Run bin ensure-rerank-sidecar vitest. Skipped because implementation halted before code edits.
- [!] T-012 Run mcp-server typecheck. Skipped because implementation halted before code edits.
- [x] T-013 Fill checklist, implementation summary, and commit handoff with halt state.
- [x] T-014 Run final strict packet validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The exact 3 still-deferred P2 IDs are identified by sweep, not by prior guess.
- Each identified finding is CLOSED or DEFERRED-AGAIN with ADR evidence.
- Requested verification commands and strict validation exit 0 unless halt-on-first-regression is explicitly documented.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` for the identification-first scope and 68 = 65 + 3 gate.
- `../../015-deep-research-drift-and-simplification/research/findings-registry.json` for source P2 records.
- `../../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports/decision-record.md` for barrel export removal precedent.
- `../../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability/decision-record.md` for launcher filesystem durability precedent.
<!-- /ANCHOR:cross-refs -->
