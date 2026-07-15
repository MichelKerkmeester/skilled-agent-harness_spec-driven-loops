---
title: "021/001: Identify and Close 3 Remaining Deferred P2 Findings"
description: "P2 reconciliation sweep found 67 closed and 1 deferred (F35), not the expected 65+3. F35 was closed by replacing a misleading cardinality error message in reindex.ts with a structured diagnostic. All 68 P2 findings from the original investigation are now closed."
trigger_phrases:
  - "021 001 p2 closure"
  - "F35 cardinality error reindex"
  - "p2 reconciliation tally"
  - "deferred p2 embedder findings"
  - "reindex structured error message"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2`

### Summary

The original packet assumption was that 65 of 68 P2 findings had been closed across arcs 017/005 and 020/001-006, leaving 3 remaining. A full checklist sweep across every child packet of arcs 016 through 020 found the actual state was 67 closed and 1 deferred, not 65 and 3. The three originally guessed findings (F103, F104, F106-F108) had each been closed in earlier arcs.

F35 was the sole deferred finding. It was an embedder reindex error message that named no identifying information when a batch cardinality mismatch occurred at runtime. The fix replaced the bare `'Embedding batch cardinality mismatch'` throw with a structured message naming the failing index, which field was missing (row or embedding or both) plus the array lengths for immediate debugging. ADR-001 in the decision record documents the contract change with alternatives.

All 68 P2 findings are now closed. Combined with 39 P1 and 3 P0 closures, the complete set of 110 findings from the original deep-research investigation is closed.

### Added

- Reconciliation CSV at `scratch/p2-closure-tally.csv` with 68 rows covering all P2 findings across arcs 016-020
- `scratch/reconciliation-error.md` documenting the gate-failure explanation for the 67+1 discrepancy
- ADR-001 in `decision-record.md` documenting the structured error-message contract change for F35

### Changed

- `reindex.ts:246-260` error throw: from bare `'Embedding batch cardinality mismatch'` to structured message including the failing index plus row and embedding presence flags plus both array lengths

### Fixed

- F35 (`refinement:reindex:misleading-cardinality-error-message`): operators saw `'Embedding batch cardinality mismatch'` with no index, no field identity and no array lengths. The structured replacement message now names what is missing, where it failed plus both sides of the mismatch for immediate debugging.

### Verification

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS: errors 0, warnings 0, exit 0 |
| P2 reconciliation tally | PASS: 68 rows, 67 CLOSED, 1 DEFERRED (F35 only) |
| `typecheck @spec-kit/mcp-server` | PASS |
| Embedders vitest: `mcp_server/tests/embedders/` | PASS: 4 files, 54 tests |
| Final strict validation | PASS: errors 0, warnings 0, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Lines 246-260: structured error message with index, field presence flags plus array lengths |
| `scratch/p2-closure-tally.csv` (NEW) | Create | 68-row reconciliation table with closure status for every P2 finding |
| `scratch/reconciliation-error.md` (NEW) | Create | Gate-failure explanation for the 67+1 vs expected 65+3 discrepancy |
| `decision-record.md` | Modify | ADR-001 added: structured error-message contract change, alternatives, compatibility notes |
| `checklist.md` | Modify | Updated to reflect F35 CLOSED and 68/68 total closure |
| `implementation-summary.md` | Modify | Final state updated to reflect actual reconciliation math and F35 closure |

### Follow-Ups

- Proceed to arc 021/002 for sk-code alignment work, which was deferred pending P2 closure confirmation.
