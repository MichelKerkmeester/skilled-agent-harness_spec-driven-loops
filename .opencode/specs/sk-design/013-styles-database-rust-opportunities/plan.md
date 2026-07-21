---
title: "Research Plan: Rust opportunities for the sk-design styles database"
description: "How the 20-iteration deep-research study was run and synthesized."
_memory:
  continuity:
    packet_pointer: "sk-design/013-styles-database-rust-opportunities"
    last_updated_at: "2026-07-20T07:07:01Z"
    last_updated_by: "spec-author"
    recent_action: "Document the completed research methodology"
    next_safe_action: "Commit the research packet"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-codex/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Plan: Rust opportunities for the sk-design styles database

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

A deep-research fanout assessed what a Rust component could ADD/IMPROVE for the styles database, grounded in the actual `styles/_db/` code and the `sk-code/018` Rust standard.

### Overview

Two independent GPT-5.6-SOL lineages (cli-codex + cli-opencode), 10 iterations each, run concurrently with `stop-policy=max-iterations` (no early convergence), each producing its own synthesized `research.md`.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The styles-DB residency baseline is read from real code, not assumed.

### Definition of Done

- Both lineages complete 10/10 iterations and each emits a `research.md` with a ranked opportunity matrix + recommendation.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Parallel two-executor deep-research fanout via `system-deep-loop/runtime/scripts/fanout-run.cjs`, loop-type `research`.

### Key Components

- **Executors:** `cli-codex` (gpt-5.6-sol, high, fast) + `cli-opencode` (openai/gpt-5.6-sol-fast, high), concurrency 2, `maxCostUnitsPerLineage` 250.
- **Seed:** the residency grounding (hot path already native) so iterations hunt capability-unlocks, not a port.

### Data Flow

Charter seed → `fanout-run.cjs` → per-lineage iterations write `deltas/iter-NNN.jsonl` + state → each lineage reduces to its `research.md` → operator synthesis.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Run the fanout

Launch both lineages; each runs 10 forced-depth iterations covering residency/scale, ANN, SQLite extensions, local inference, indexing automation, screenshot analysis, cross-system reuse, caches/determinism, boundary architecture, ranking.

### Phase 2: Synthesize

Each lineage reduces its deltas into a `research.md` (ranked matrix + phased path + eliminated alternatives).

### Phase 3: Record

Capture both syntheses as the packet deliverable; report findings to the operator.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Convergence is telemetry-only under `max-iterations`; correctness is judged by grounding — every performance claim traces to `retrieval.mjs`/`vectors.mjs` residency, no synthetic benchmarks treated as evidence.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

cli-codex + cli-opencode availability; GPT-5.6-SOL access; the deep-loop fanout runtime.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research-only; no runtime change to roll back. The packet is a record.

<!-- /ANCHOR:rollback -->
