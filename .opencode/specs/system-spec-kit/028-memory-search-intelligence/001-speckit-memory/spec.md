---
title: "Feature Specification: Spec-Kit Memory MCP Phase Parent"
description: "Phase parent for 21 Spec-Kit Memory MCP implementation plans derived from packet 028 research."
trigger_phrases:
  - "028 speckit memory implementation parent"
  - "memory mcp child phase map"
  - "memory search intelligence speckit memory"
  - "memory mcp implementation planning"
  - "028 memory mcp candidate tail"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory"
    last_updated_at: "2026-06-19T06:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Wired Spec-Kit Memory MCP as a phase parent with 21 implementation sub-phases"
    next_safe_action: "Use the child map to implement PENDING memory candidates in gate order"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "001-corpus-reindex-gate-zero/spec.md"
      - "021-residual-correctness/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-speckit-memory-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The memory research child now routes to 21 implementation child folders."
      - "Packet 030 remains the Wave-0 shipped evidence record for DONE rows."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Spec-Kit Memory MCP Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-16 |
| **Updated** | 2026-06-19 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Memory MCP research surfaced candidate work across recall retrieval, deterministic IDs, currentness, reliability and eval coverage. This parent needs to route those candidate groups to child folders so the research evidence and implementation planning stay addressable without placing task detail at the parent level.

### Purpose
Provide the subsystem root purpose and implementation phase map for the Memory MCP portion of packet 028. The child folders own the detailed specs, plans, tasks and validation evidence.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for the 21 Memory MCP implementation child folders.
- A phase-documentation map that names each implementation sub-phase and current planning status.
- A research-input pointer for the evidence packet that fed these child plans.

### Out of Scope
- Implementing the Memory MCP candidates.
- Editing packet 030.
- Rewriting the subsystem research artifacts.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify | parent | Parent purpose and child map |
| `description.json` | Refresh | parent | Search metadata for the parent |
| `graph-metadata.json` | Refresh | parent | Child identity and parent graph metadata |
| `[0-9][0-9][0-9]-*/**` | Maintain | child phases | Implementation planning owned by child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

Research input: `research/research.md` remains the subsystem source packet for candidate evidence and citations.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-corpus-reindex-gate-zero/` | Corpus scan and gate-zero recovery | Done (reindex superseded) |
| 002 | `002-determinism-content-id-foundation/` | Stable content IDs and deterministic recall spine | In Progress |
| 003 | `003-retrieval-class-routing/` | Query class router and lane policy | Partial |
| 004 | `004-graceful-degradation/` | Degraded service paths and fallback envelopes | Complete |
| 005 | `005-recall-render-escaper/` | Source-kind gated render safety | Implemented (1 candidate gated) |
| 006 | `006-redteam-probe-gate/` | Adversarial probe harness and CI gate | Partial |
| 007 | `007-bitemporal-window/` | Temporal validity windows for memory facts | Done (schema foundation) |
| 008 | `008-edge-presence-currentness/` | Presence edges and currentness checks | Partial |
| 009 | `009-derived-id-provenance/` | Derived IDs and provenance links | Done |
| 010 | `010-010-consoli<!-- pp-scan -->dation-cursor-clock/` | Cursor clock and async write follow-on | Planned |
| 011 | `011-retention-forgetting/` | Retention and forgetting policy | Partial |
| 012 | `012-procedural-reliability-benchmark/` | Procedural reliability benchmark | Partial (plumbing only, benchmark-gated) |
| 013 | `013-enrichment-observability/` | Enrichment metrics and traceability | Complete |
| 014 | `014-mem0-ranking-tweaks/` | Mem0 ranking backport choices | Partial |
| 015 | `015-summary-fusion-grounding/` | Summary fusion and grounding safeguards | In Progress |
| 016 | `016-iterative-agentic-recall/` | Agentic recall loop planning | Partial (Phase 1) |
| 017 | `017-semantic-edge-layer/` | Semantic edge representation | Partial |
| 018 | `018-018-sleeptime-consoli<!-- pp-scan -->dation/` | Sleeptime background processing | Partial (safe core) |
| 019 | `019-eval-harness-extension/` | Evaluation harness extension | Partial |
| 020 | `020-eval-calibration-ab/` | Evaluation calibration A/B plan | Partial (observe-only) |
| 021 | `021-residual-correctness/` | Residual correctness from candidate 015 | Done |

### Phase Transition Rules

- Each child folder owns its own `spec.md`, `plan.md`, `tasks.md` and level-required validation docs.
- Parent status changes only after child strict validation passes.
- Use `/speckit:resume system-spec-kit/028-memory-search-intelligence/001-speckit-memory/[NNN-phase]/` to resume a specific child.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Select the next PENDING candidate group | Child `spec.md` names gate, scope and evidence |
| child | parent | Child reaches strict validation green | `validate.sh <child> --strict` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. Candidate questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research input**: `research/research.md`
- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
