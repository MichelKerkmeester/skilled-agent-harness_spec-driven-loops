---
title: "Feature Specification: Rust Backend Rewrite Research Phase Parent"
description: "Phase parent for a deep-research investigation into whether, where, and how the system-spec-kit code backend (mcp_server / scripts / shared, ~244K LOC TypeScript) would benefit from a Rust rewrite — grounded in the current native-primitive boundary (sqlite-vec, better-sqlite3, @huggingface/transformers, web-tree-sitter) and the pure-TS compute core (fusion, reranking, embeddings, indexing)."
trigger_phrases:
  - "030 rust backend rewrite"
  - "rust rewrite spec kit"
  - "speckit rust backend research"
  - "rust vs typescript backend"
  - "rust rewrite deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-rust-backend-rewrite-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase parent and the 001-research charter for a pre-planned 20-round deep-research pass on a Rust backend rewrite"
    next_safe_action: "Human review of the 20-round charter; then launch 001-research/research via /deep:research"
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "001-research/plan.md"
      - "001-research/research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-029-rust-backend-rewrite-research-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Rust Backend Rewrite Research Phase Parent

## How to read this packet

Use this root `spec.md` as the current phase map. The research subject is **our own** `system-spec-kit` backend — the authored TypeScript under `.opencode/skills/system-spec-kit/` (`mcp_server/`, `scripts/`, `shared/`) — evaluated against a hypothetical **Rust** reimplementation. The detailed 20-round deep-research charter and its predefined angles live in the phase child `001-research/`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Not Started |
| **Created** | 2026-07-11 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-spec-kit` backend is ~244K LOC of authored TypeScript across ~1,487 files (`mcp_server/`, `scripts/`, `shared/`), run as a long-lived MCP server over `StdioServerTransport` (`mcp_server/context-server.ts`). Its performance-critical primitives are *already native*: vector search via `sqlite-vec` on `better-sqlite3`, local embeddings via `@huggingface/transformers` (ONNX), and code parsing via `web-tree-sitter` (WASM). The genuinely CPU-bound TypeScript is a minority — fusion/ranking math (`shared/algorithms/rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts`, `shared/ranking/learned-combiner.ts`, `matrix-math.ts`) and extraction (`shared/trigger-extractor.ts`, `shared/chunking.ts`) — while the retrieval stack (`mcp_server/lib/search/`) is already extremely feature-rich.

The question "should we rewrite the backend to Rust?" therefore has **no obvious answer from first principles**. A naive full rewrite spends enormous effort re-porting glue code that sits in front of already-native primitives; but a *targeted* native module (or a specific feature that TS makes impractical) may unlock real wins. We need cited, code-referenced evidence — not vibes — before anyone commits engineering time.

### Purpose
Provide the root purpose, child map, and cross-packet boundary for packet 030. This parent routes to the research child that runs a **pre-planned 20-round deep-research pass** with predefined angles, each tied to concrete files/features in the current backend, to answer three linked questions: (1) what *improvements* would Rust give and where, with references; (2) what *new features* become possible; and (3) what is genuinely *hard or impossible* in TypeScript that Rust unlocks — culminating in a ranked, decision-ready recommendation (full rewrite / targeted native module / do-not-rewrite).

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. The substantive charter, the 20-round plan, and the predefined angles live in the phase child below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for packet 030 phase children.
- Holding the current `system-spec-kit` backend (`mcp_server/`, `scripts/`, `shared/`) as the research subject.
- A phase-documentation map pointing to the research child (and any later planning/PoC children).

### Out of Scope
- Writing any Rust, scaffolding a crate, or wiring a native module (research-only at this stage).
- Editing the current TypeScript backend as part of this packet.
- Committing to a rewrite decision before the research produces cited evidence.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | parent | Root purpose and child map |
| `description.json` | Create | parent | Search metadata for the parent |
| `graph-metadata.json` | Create | parent | Child identity and parent graph metadata |
| `001-research/spec.md` | Create | 001 | Rust-rewrite research charter (predefined angles) |
| `001-research/plan.md` | Create | 001 | 20-round loop plan + executor config + round→angle allocation |
| `001-research/tasks.md` | Create | 001 | Research execution checklist |
| `001-research/research/deep-research-strategy.md` | Create | 001 | Charter: key questions, non-goals, stop conditions |
| `001-research/research/deep-research-fanout-config.json` | Create | 001 | Executor config (20 iterations) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research/` | 20-round deep-research pass (8 survey + 12 deep-validation rounds) over the current TS backend vs a Rust reimplementation: per-angle improvement/feature/impossibility analysis with file-cited evidence, an improvement matrix, a new-feature-feasibility matrix, a risk register, and a ranked rewrite recommendation | Not Started |

### Phase Transition Rules

- Child 001 is research-only: it reports findings and a recommendation; it writes no Rust and touches no backend source.
- A later `002-*` phase (PoC / boundary spec / targeted native module) is opened **only if** 001's recommendation warrants it.
- The current backend under `.opencode/skills/system-spec-kit/` is read-only research material for this packet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | 001-research | Research charter authored with predefined angles | `001-research/spec.md` §7 lists the 16 angles and the 20-round allocation |
| 001-research | decision | Loop converged or hit 20 rounds | `001-research/research/research.md` exists with cited findings + ranked recommendation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. The substantive questions and the 16 predefined research angles live in `001-research/spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research child**: `001-research/`
- **Research subject**: `../../../skills/system-spec-kit/` (`mcp_server/`, `scripts/`, `shared/`)
- **Sibling precedent**: `../029-headroom-utilization/` (same phase-parent + 20-iteration research pattern)
- **Graph metadata**: `graph-metadata.json`
