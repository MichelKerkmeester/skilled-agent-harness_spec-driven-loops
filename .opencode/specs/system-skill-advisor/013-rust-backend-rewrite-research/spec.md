---
title: "Feature Specification: Rust Skill-Advisor Backend Rewrite Research Phase Parent"
description: "Phase parent for a two-phase deep-research investigation into whether, where, and how the system-skill-advisor backend (mcp_server, ~51K LOC TypeScript across ~268 files) would benefit from a Rust rewrite — grounded in the current native boundary (SQLite store, ONNX/vector search) versus the JS-resident scoring, matching, and ranking compute."
trigger_phrases:
  - "013 rust skill advisor rewrite"
  - "rust rewrite skill advisor"
  - "skill advisor rust backend research"
  - "rust vs typescript skill advisor"
  - "skill advisor rust deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-rust-backend-rewrite-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase parent over two research children (001 scorer/ranking, 002 embedder/vector/serving) written by a GPT-5.6-sol agent swarm"
    next_safe_action: "Human review of both 16-round charters; then launch each child's research via /deep:research"
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "002-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-skill-advisor-013-rust-backend-rewrite-research-parent"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Rust Skill-Advisor Backend Rewrite Research Phase Parent

## How to read this packet

Use this root `spec.md` as the current phase map. The research subject is **our own** `system-skill-advisor` backend — the authored TypeScript under `.opencode/skills/system-skill-advisor/` (`mcp_server/`) — evaluated against a hypothetical **Rust** reimplementation. The detailed deep-research charters and their predefined angles live in the two phase children, split by backend half: `001-research/` (scoring & ranking core) and `002-research/` (embeddings, vector & serving).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Not Started |
| **Created** | 2026-07-11 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-skill-advisor` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-skill-advisor` backend is ~51K LOC of authored TypeScript across ~268 files (`mcp_server/`), run as a long-lived MCP server (plus a daemon-backed CLI front door) that routes a request to the matching skill. Its retrieval-adjacent primitives lean on native code — the SQLite store via `better-sqlite3`, and embedding/vector similarity through ONNX / vector-index paths — while the routing decision itself is JS-resident scoring math: feature extraction, trigger/vocabulary matching, executor-delegation scoring, and result ranking.

The question "should we rewrite the skill-advisor backend to Rust?" therefore has **no obvious answer from first principles**. The scorer is the strongest pure-compute rewrite candidate, but much of the embedding/vector hot path may already be native — meaning the honest finding may be "little JS-resident compute to reclaim on that half." We need cited, code-referenced evidence, not vibes, before anyone commits engineering time.

### Purpose
Provide the root purpose, child map, and cross-packet boundary for this packet. This parent routes to two research children that each run a **pre-planned 16-round deep-research pass** with predefined angles tied to concrete files, answering three linked questions per half: (1) what *improvements* would Rust give and where, with references; (2) what *new features* become possible; and (3) what is genuinely *hard or impossible* in TypeScript that Rust unlocks — each culminating in a ranked, decision-ready recommendation (full rewrite / targeted native module / Rust sidecar / do-not-rewrite).

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. The substantive charters, the round plans, and the predefined angles live in the phase children below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for this packet's phase children.
- Holding the current `system-skill-advisor` backend (`mcp_server/`) as the research subject.
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
| `001-research/**` | Create | 001 | Scoring & ranking research charter (feature extraction, matcher, trigger/vocabulary matching, executor-delegation, ranking math) |
| `002-research/**` | Create | 002 | Embeddings, vector & serving research charter (embedder stack, vector index, skill-graph, daemon/MCP/CLI transport & determinism) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research/` | 16-round deep-research pass over the **scoring & ranking core**: feature extraction, trigger/vocabulary/intent matching, executor-delegation scoring, and the ranking math that turns a prompt into a ranked skill recommendation — with an improvement matrix, a new-feature-feasibility matrix, a risk register, and a ranked recommendation | Not Started |
| 002 | `002-research/` | 16-round deep-research pass over the **embeddings, vector & serving** half: the embedder stack, the vector index / similarity search, the skill-graph tools, and the daemon/MCP/CLI transport & determinism layer — with the same four deliverables | Not Started |

### Phase Transition Rules

- Both children are research-only: they report findings and a recommendation; they write no Rust and touch no backend source.
- The two halves are disjoint by design — 001 owns the scoring/matching compute, 002 owns the embedding/vector/transport path — so they can run and converge independently.
- A later `003-*` phase (PoC / boundary spec / targeted native module) is opened **only if** a child's recommendation warrants it.
- The current backend under `.opencode/skills/system-skill-advisor/` is read-only research material for this packet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | 001-research | Scoring/ranking charter authored with predefined angles | `001-research/spec.md` §7 lists the angles and the 16-round allocation |
| root | 002-research | Embedder/vector/serving charter authored with predefined angles | `002-research/spec.md` §7 lists the angles and the 16-round allocation |
| child | decision | Loop converged or hit the round cap | the child's `research/research.md` exists with cited findings + ranked recommendation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. The substantive questions and the predefined research angles live in `001-research/spec.md` and `002-research/spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research children**: `001-research/` (scoring & ranking core), `002-research/` (embeddings, vector & serving)
- **Research subject**: `../../../skills/system-skill-advisor/` (`mcp_server/`)
- **Sibling precedent**: `../../system-speckit/030-rust-backend-rewrite-research/` (same Rust-rewrite research pattern)
- **Graph metadata**: `graph-metadata.json`
