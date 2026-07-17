---
title: "Feature Specification: Rust Code-Graph Backend Rewrite Research Phase Parent"
description: "Phase parent for a two-phase deep-research investigation into whether, where, and how the system-code-graph backend (mcp_server / scripts, ~46K LOC TypeScript across ~163 files) would benefit from a Rust rewrite — grounded in the current native boundary (web-tree-sitter WASM parsing, better-sqlite3 graph store) versus the JS-resident indexing, traversal, and ranking compute."
trigger_phrases:
  - "011 rust code graph rewrite"
  - "rust rewrite code graph"
  - "code graph rust backend research"
  - "rust vs typescript code graph"
  - "code graph rust deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/035-rust-backend-rewrite-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase parent over two research children (001 ingestion/storage, 002 query/serving) written by a GPT-5.6-sol agent swarm"
    next_safe_action: "Human review of both 16-round charters; then launch each child's research via /deep:research"
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "002-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-code-graph-011-rust-backend-rewrite-research-parent"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Rust Code-Graph Backend Rewrite Research Phase Parent

## How to read this packet

Use this root `spec.md` as the current phase map. The research subject is **our own** `system-code-graph` backend — the authored TypeScript under `.opencode/skills/system-code-graph/` (`mcp_server/`, `scripts/`) — evaluated against a hypothetical **Rust** reimplementation. The detailed deep-research charters and their predefined angles live in the two phase children, split by backend half: `001-research/` (ingestion & storage) and `002-research/` (query & serving).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Not Started |
| **Created** | 2026-07-11 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` backend is ~46K LOC of authored TypeScript across ~163 files (`mcp_server/`, `scripts/`), run as a long-lived MCP server that indexes a codebase into a queryable structural graph. Its performance-critical primitives are *already native*: source parsing runs through `web-tree-sitter` (WASM grammars) and the graph store persists through `better-sqlite3` (native addon). The genuinely CPU-bound TypeScript is the glue around those primitives — filesystem traversal, AST walking and capture normalization, node/edge construction, module/import resolution, incremental invalidation, and the query/traversal/ranking compute served over MCP.

The question "should we rewrite the code-graph backend to Rust?" therefore has **no obvious answer from first principles**. A naive full rewrite re-ports glue code that sits in front of already-native parsing and storage; but a *targeted* native module — or a capability that TS makes impractical (large-graph traversal, always-fresh incremental indexing, SIMD-scored ranking) — may unlock real wins. We need cited, code-referenced evidence, not vibes, before anyone commits engineering time.

### Purpose
Provide the root purpose, child map, and cross-packet boundary for this packet. This parent routes to two research children that each run a **pre-planned 16-round deep-research pass** with predefined angles tied to concrete files, answering three linked questions per half: (1) what *improvements* would Rust give and where, with references; (2) what *new features* become possible; and (3) what is genuinely *hard or impossible* in TypeScript that Rust unlocks — each culminating in a ranked, decision-ready recommendation (full rewrite / targeted native module / Rust sidecar / do-not-rewrite).

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. The substantive charters, the round plans, and the predefined angles live in the phase children below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for this packet's phase children.
- Holding the current `system-code-graph` backend (`mcp_server/`, `scripts/`) as the research subject.
- A phase-documentation map pointing to the two research children (and any later planning/PoC children).

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
| `001-research/**` | Create | 001 | Ingestion & storage research charter (parser, AST extraction, graph store, persistence, incremental write path) |
| `002-research/**` | Create | 002 | Query & serving research charter (query engine, traversal/impact/context, ranking, MCP transport & determinism) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research/` | 16-round deep-research pass over the **ingestion & storage** half: source discovery, tree-sitter/WASM parsing, AST→node/edge extraction, the SQLite graph store, edge lifecycle/bitemporal generations, and the incremental scan/detect-changes write path — with an improvement matrix, a new-feature-feasibility matrix, a risk register, and a ranked recommendation | Not Started |
| 002 | `002-research/` | 16-round deep-research pass over the **query & serving** half: the graph query engine, traversal/impact/context retrieval, symbol/outline/caller resolution, result ranking, query-intent classification, and the MCP transport & determinism layer — with the same four deliverables | Not Started |

### Phase Transition Rules

- Both children are research-only: they report findings and a recommendation; they write no Rust and touch no backend source.
- The two halves are disjoint by design — 001 owns the write/index path, 002 owns the read/query path — so they can run and converge independently.
- A later `003-*` phase (PoC / boundary spec / targeted native module) is opened **only if** a child's recommendation warrants it.
- The current backend under `.opencode/skills/system-code-graph/` is read-only research material for this packet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | 001-research | Ingestion/storage charter authored with predefined angles | `001-research/spec.md` §7 lists the angles and the 16-round allocation |
| root | 002-research | Query/serving charter authored with predefined angles | `002-research/spec.md` §7 lists the angles and the 16-round allocation |
| child | decision | Loop converged or hit the round cap | the child's `research/research.md` exists with cited findings + ranked recommendation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. The substantive questions and the predefined research angles live in `001-research/spec.md` and `002-research/spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research children**: `001-research/` (ingestion & storage), `002-research/` (query & serving)
- **Research subject**: `../../../skills/system-code-graph/` (`mcp_server/`, `scripts/`)
- **Sibling precedent**: `../../system-speckit/029-rust-backend-rewrite-research/` (same Rust-rewrite research pattern)
- **Graph metadata**: `graph-metadata.json`
