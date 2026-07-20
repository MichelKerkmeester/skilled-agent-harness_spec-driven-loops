---
title: "sk-design styles-database evolution (phase parent)"
description: "Phase-parent packet: the measurement-gated roadmap that turns the 013 Rust-opportunities research into a phased, JS-first evolution of the styles database, with Rust as a conditional late phase."
trigger_phrases:
  - "styles database evolution roadmap parent"
  - "styles db phased plan foundation js native growth"
  - "rust conditional late phase styles"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Restructure 015 into a phase parent over four phase children"
    next_safe_action: "Plan/build phase 001-foundation first; later phases gate on its measurement plane"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-codex/research.md"
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->

# sk-design styles-database evolution

## 1. METADATA

- **Track:** sk-design
- **Packet:** 015-styles-database-evolution (phase parent)
- **Source research:** `sk-design/013-styles-database-rust-opportunities` (20-iteration deep research; two independent GPT-5.6-SOL lineages; no early convergence)

## 2. PROBLEM & PURPOSE

The 013 study concluded: **no Rust rewrite now** — SQLite/FTS5 are already native and the JS math is tiny and parity-sensitive over ~1,290 bundles. The value is new **JS-first** capabilities plus a measurement plane, with Rust reserved as a **measured, conditional** late option. This packet sequences that verdict into four gated phases so each is independently plannable, buildable, and reversible; the two governing invariants — **"Rust only if measured"** and **parity/rollback** — thread every phase.

## 3. SCOPE

- **In:** the phased roadmap and its entry/exit gates, decomposed into the four phase children below.
- **Out:** building anything in this parent; a Rust-first rewrite; porting already-native FTS5/SQLite work.

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

| Phase | Child | Purpose | Gate | Status |
|---|---|---|---|---|
| 0 | `001-foundation` | Versioned generation manifest, stage telemetry, pinned TS differential oracle, 1x/10x/100x fixtures, labeled relevance judgments. | **Hard blocker** — gates all later phases. | Planned |
| 1 | `002-js-capabilities` | DOM layout fingerprints, screenshot palette/dedupe, shadow multimodal/CLIP lane, batched embedding queue, auto-reindex watcher. | Foundation in place; no Rust. | Planned |
| 2 | `003-measured-native` | sqlite-vec exact search, Rust `ort` sidecar (isolation, not speed), bounded Rust parse core. | Only if a stage crosses a measured SLO; byte-parity + "no Rust" valid. | Planned |
| 3 | `004-growth` | Fix the eligible-ID SQL-parameter ceiling first, then maintained HNSW/ANN under an approximation/parity contract; shared cross-skill core. | 10x-100x growth only. | Planned |

<!-- /ANCHOR:phase-map -->

## 5. PHASE TRANSITION & HANDOFF

Phases are strictly ordered: each later phase's entry gate is the prior phase's exit evidence. Phase 0 must ship the manifest + telemetry + oracle before any Phase 1 feature is measured; Phase 2 native experiments require a Phase-0 SLO breach; Phase 3 requires measured 10x-100x growth. Resume follows `graph-metadata.json.derived.last_active_child_id`.

## 6. OPEN QUESTIONS

- Which Phase-1 features clear a value/effort bar worth a measured Phase-2 native experiment?
- Does any stage breach an SLO at current scale, or only under growth?

## 7. RELATED DOCUMENTS

- Research: `../013-styles-database-rust-opportunities/`.
- Phase children: `001-foundation/`, `002-js-capabilities/`, `003-measured-native/`, `004-growth/`.
