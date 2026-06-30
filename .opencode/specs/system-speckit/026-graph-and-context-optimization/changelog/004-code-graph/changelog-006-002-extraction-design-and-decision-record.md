---
title: "Code Graph Phase 006-002: Design and ADR for Code-Graph Extraction"
description: "3-iteration deep-research investigation produced ADR-001, resource-map.md plus a research synthesis locking 8 architectural decisions for the system-code-graph extraction. No code was moved."
trigger_phrases:
  - "code graph extraction design ADR"
  - "code graph extraction decision record"
  - "system-code-graph ADR-001"
  - "code graph topology co-resident decision"
  - "code graph tool-id stability research"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation/002-extraction-design-and-decision-record` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation`

### Summary

The code-graph subsystem (111 source files, 12 MCP tools, 7 SQLite tables, a 55+ MB live index) had no locked architectural plan for its extraction into a first-class `system-code-graph` skill. Eight decisions covering database ownership, MCP server topology, tool-id stability, cross-subsystem import direction, plugin bridge disposition, phase decomposition plus risk handling were all unresolved. Without these decisions, subsequent implementation children could not scaffold safely.

A 3-iteration deep-research loop surveyed 280+ touchpoints across handlers, hooks, agents, commands, tests, docs plus plugin bridges. The loop converged at iteration 3 with all 8 questions answered. ADR-001 locked the co-resident MCP topology (no standalone process), stable `code_graph_*` and `ccc_*` tool ids, moved database with `SPECKIT_CODE_GRAPH_DB_DIR` env fallback, sibling-skill imports, code-graph-specific plugin bridge moves plus a 6-phase implementation sequence (002-006). The risk catalog covers 6 risks each with a detection signal, mitigation plus rollback path.

No code was moved. The packet recalibrated after a manual filesystem reorg. ADR-001 Q3 (MCP topology) was later superseded by ADR-002 in child 014/007. ADR-001 Q1, Q2, Q4, Q5, Q6, Q7 plus Q8 remain the active decisions.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Historical docs preserved | PASS | spec.md, plan.md, tasks.md, checklist.md plus decision-record.md were not rewritten during recalibration |
| Metadata recalibrated | PASS | graph-metadata.json derived status set to complete |
| Continuity updated | PASS | _memory.continuity completion_pct at 100 with 2026-05-14 backfill timestamp |
| All 8 questions answered | PASS | Q1-Q8 in decision-record.md with alternatives tables and 5-6 scoring criteria each |
| Touchpoint count verified | PASS | 280+ touchpoints confirmed across 20 categories in resource-map.md |
| Research synthesis present | PASS | research/research.md with 3 iterations in research/iterations/ |
| No code changes | PASS | git diff limited to packet-scope docs only |
| Strict validation | PASS | 0 errors, 1 advisory warning (spec_doc_sufficiency) |

### Files Changed

| File | What changed |
|------|--------------|
| `002-extraction-design-and-decision-record/decision-record.md` (NEW) | ADR-001 locking all 8 architectural decisions with alternatives scoring tables and risk catalog |
| `002-extraction-design-and-decision-record/resource-map.md` (NEW) | Tabular catalog of 280+ touchpoints across 20 categories with move, update, stay-and-rewire, never-move dispositions |
| `002-extraction-design-and-decision-record/research/research.md` (NEW) | Deep-research narrative synthesis with convergence rationale |
| `002-extraction-design-and-decision-record/research/iterations/iteration-001.md` (NEW) | Iteration 1: code-graph source tree inventory (111 files) |
| `002-extraction-design-and-decision-record/research/iterations/iteration-002.md` (NEW) | Iteration 2: consumer grep results (169 import matches) |
| `002-extraction-design-and-decision-record/research/iterations/iteration-003.md` (NEW) | Iteration 3: ADR scoring and convergence |

### Follow-Ups

- ADR-001 Q3 (MCP topology) is superseded by ADR-002 in 014/007. Verify downstream children reference the updated topology decision before executing child 004 rewire work.
- Child 005 doc-migration judgment on the 33+30 category-22 docs split between code-graph core and shared context and hooks should be re-evaluated against the actual file list at migration time.
