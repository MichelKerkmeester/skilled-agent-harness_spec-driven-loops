---
title: "Plan: sk-design styles database evolution — 4-phase measurement-gated roadmap"
description: "The 4-phase JS-first roadmap for the styles database with per-phase architecture and entry/exit gates; Rust is conditional and gated on measurements."
trigger_phrases:
  - "styles database evolution plan"
  - "styles db 4-phase roadmap"
  - "js-first styles db plan"
  - "styles db measurement-gated rust"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution"
    last_updated_at: "2026-07-20T06:36:16Z"
    last_updated_by: "spec-author"
    recent_action: "Author the 4-phase measurement-gated roadmap plan (Level 2, PLANNED)"
    next_safe_action: "Author tasks.md, checklist.md, implementation-summary.md for this packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: sk-design styles database evolution — 4-phase measurement-gated roadmap

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node ESM) — JS-first; Rust is conditional and gated on measurement (Phase 2+) |
| **Framework** | N/A — styles database module (`sk-design/styles/_db/`) |
| **Storage** | SQLite + FTS5 via `node:sqlite`, plus a rebuildable JS-resident vector projection |
| **Testing** | `node --test`; byte-for-byte differential parity against a pinned TS oracle |

### Overview

A 4-phase roadmap to evolve the styles DB JS-first, with Rust as a CONDITIONAL late option gated on measurements. Phase 0 builds the evidence/contract foundation (a hard blocker). Phase 1 ships JS capability features. Phase 2 runs measured native experiments ONLY if a stage crosses an SLO. Phase 3 addresses 10x-100x growth (correctness first, then approximation under an explicit contract). Governing constraints: "Rust only if measured" (a valid outcome is "no Rust") and the parity/rollback invariant. Nothing is built in this packet — it is a roadmap only. Grounded in `sk-design/013` research (two GPT-5.6-SOL lineages, 20 iterations).

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- `sk-design/013` research findings available (opportunity matrix + ranked recommendation).
- The five governing gates below are understood before Phase 0 work begins.

### Definition of Done

Every phase that ships MUST satisfy all five gates:
- **Residency-honesty gate** — every perf claim decomposed against native (FTS5/SQLite) vs JS-resident (cosine/sort/RRF) compute; no credit for native work.
- **Oracle-parity gate** — any native/overlapping path replays the pinned TS oracle byte-for-byte, OR ships as a separately-versioned approximate capability with exact fallback.
- **SLO gate** — no native experiment without a measured SLO crossing on a named stage.
- **Rollback gate** — every generation atomically publishable + reversible via the manifest pointer.
- **Second-consumer gate** — no shared cross-skill Rust core without a real second consumer (spec-memory).

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

TS-shell + optional thin native adapter, per the `sk-code/018` Rust standard: TypeScript owns transport, adapter selection, flags, DB writes, publication, and fallback; any Rust component (Phase 2+) is a pure `#![forbid(unsafe_code)]` core exposed through a thin napi-rs adapter that owns exactly one measured kernel.

### Key Components

- **TS shell**: transport, `legacy|shadow|persistent` adapter selection, flags, DB writes, publication, fallback.
- **Generation manifest**: the atomic publication/rollback unit spanning SQLite + screenshot features + model profiles + optional index.
- **Pinned TS oracle**: the reference implementation for all parity checks.
- **Conditional Rust core** (Phase 2+): thin napi-rs adapter over a pure `#![forbid(unsafe_code)]` core owning exactly one measured kernel (per `sk-code/018`).
- **Retrieval lanes**: three-lane retrieval (lexical FTS5 + vector + fusion); RRF is candidate-bounded at `MAX_CANDIDATE_K = 200`.

### Data Flow

Indexing writes land in a new generation; the manifest publishes it atomically and readers select it via the `legacy|shadow|persistent` adapter. Retrieval fans out across the lexical (FTS5), vector, and RRF-fusion lanes; any candidate Rust kernel (Phase 2+) sits behind the same adapter boundary and must reproduce the pinned TS oracle before promotion.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — planning packet, not a bug fix. This document defines the phased roadmap only; no code ships in this packet, so there is no affected-surfaces inventory to complete. Each future implementation phase (0-3) authors its own `plan.md` with a populated affected-surfaces table if that phase's work turns out to be a fix or touches a governed surface.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0 — Evidence & Contract (no Rust) [BLOCKER]

- **Architecture**: versioned multi-artifact generation manifest (atomic pointer + rollback); stage telemetry across indexer/query lanes; pinned TS differential oracle (freeze current outputs); 1x/10x/100x replay fixtures; labeled relevance judgments.
- **Entry gate**: none — this is the foundation.
- **Exit gate**: manifest publishes/rolls back atomically; telemetry emits per-stage latency/throughput/RSS; oracle reproduces current outputs byte-for-byte; fixtures + judgments exist and are versioned. Phase 0 BLOCKS Phases 1-3.

### Phase 1 — JS Capability Features (no Rust)

- **Architecture**: DOM responsive layout fingerprints (5 viewports; crawler already captures rectangles/padding/margins/gaps/flex/grid/landmarks); screenshot palette/statistics + perceptual dedupe (sharp/libvips; pHash = near-duplicate detection only, NOT a semantic ranker); shadow multimodal (text+image/CLIP) lane over the existing Node ONNX/Transformers.js stack (`onnxruntime-node`); batched embedding queue (replace one-call-at-a-time draining); auto-reindex watcher (Chokidar + periodic reconciliation, reconciliation is authority); optional parsed-projection cache (only if cold-build telemetry proves value).
- **Entry gate**: Phase 0 complete (oracle + telemetry + fixtures + manifest).
- **Exit gate**: each feature ships behind the shadow/flag path with parity where it overlaps existing outputs; new lanes measured against telemetry; no regression to the default path.

### Phase 2 — Measured Native Experiments (conditional)

- **Architecture**: ONLY if a stage crosses a measured SLO. Evaluate a maintained `sqlite-vec` / native EXACT vector search (removes JSON-parse + JS-sort); a supervised Rust `ort` inference sidecar for crash/RSS/deployment ISOLATION (NOT presumed speed — both Node and Rust wrap the same native ONNX kernels); a bounded Rust parse core. Each candidate must beat the TS oracle end-to-end AND pass byte-for-byte parity. Shape per `sk-code/018`: TS shell + thin napi-rs adapter + pure `forbid(unsafe_code)` core owning one kernel. A valid outcome is "no Rust."
- **Entry gate**: a Phase 0 telemetry SLO crossing on a specific stage.
- **Exit gate**: the candidate beats the oracle end-to-end AND passes byte parity, OR is rejected with "no Rust" recorded.

### Phase 3 — Growth Architecture (10x-100x only)

- **Architecture**: FIRST fix the eligible-ID SQL-parameter shape (broad queries exceed SQLite's 32,766-variable limit at ~25% eligibility) — correctness before ANN. THEN a maintained HNSW/ANN with filter-aware recall plus an explicit approximation/byte-parity contract (separately-versioned; exact re-score + exact fallback). Custom Rust ANN is a last resort for a proven capability gap. A shared cross-skill Rust core requires a real second consumer (spec-memory); system-code-graph is excluded.
- **Entry gate**: measured 10x-100x corpus growth pressure.
- **Exit gate**: SQL-param correctness fixed FIRST; any ANN ships under the approximation contract with exact fallback verified.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Differential testing vs the pinned TS oracle (byte-for-byte) for every native/overlapping path.
- 1x/10x/100x replay fixtures for scale behavior.
- Labeled relevance judgments for retrieval-quality regression.
- Telemetry assertions for per-stage SLOs.
- Approximation-contract tests (recall + exact-fallback verification) for any ANN.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-code/018` Rust standard (adapter/core/parity model).
- Existing Node ONNX / Transformers.js stack (`onnxruntime-node`).
- SQLite + FTS5 via `node:sqlite` (native; unchanged).
- sharp/libvips (image stats); Chokidar (watcher).
- `sk-design/013` research findings (grounding).
- spec-memory as the only sanctioned second consumer for a shared Rust core.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a published generation, shadow lane, or native experiment fails parity, breaches an SLO, or produces incorrect results.
- **Procedure**: repoint the manifest to the prior generation (atomic); disable the shadow/feature flag to revert to the legacy path. No phase overwrites the default path until parity + telemetry gates pass, so rollback never requires a code revert — only a pointer/flag flip.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Evidence & Contract) ──► Phase 1 (JS Capability) ──► Phase 2 (Native, conditional: SLO crossing)
                               └────────────────────────────► Phase 3 (Growth, conditional: 10x-100x)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0 — Evidence & Contract | None | Phase 1, Phase 2, Phase 3 |
| Phase 1 — JS Capability Features | Phase 0 | Phase 2 (capabilities measured before any native extraction) |
| Phase 2 — Measured Native Experiments | Phase 0, Phase 1 (SLO crossing) | None |
| Phase 3 — Growth Architecture | Phase 0 (SQL-param correctness precedes any ANN) | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Phase 0 — Evidence & Contract | Medium | Foundational; moderate — manifest + telemetry + oracle + fixtures + judgments |
| Phase 1 — JS Capability Features | Medium-High | Largest capability surface (six features); incremental delivery |
| Phase 2 — Measured Native Experiments | Conditional | Effort incurred only on a measured SLO crossing |
| Phase 3 — Growth Architecture | Conditional | SQL-param correctness fix is small; ANN work is larger |
| **Total** | — | Not estimated at this planning level — each phase is scoped as its own future packet |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Manifest supports N-generation retention (rollback beyond the immediately prior generation).
- [ ] Shadow lane is flag-gated and does not affect default reads.
- [ ] Parity evidence (byte-for-byte vs the TS oracle) collected before any promotion.

### Rollback Procedure

1. Disable the feature flag / shadow lane for the affected capability.
2. Repoint the generation manifest to a prior retained generation (N-generation retention supports multi-step rollback).
3. For an approximate ANN capability, disable that specific version; exact search remains intact and unaffected.
4. Verify default reads are unaffected (parity spot-check against the TS oracle).

### Data Reversal

- **Has data migrations?** No — additive; new generations do not mutate prior ones.
- **Reversal procedure**: repoint the manifest pointer to the prior generation; there is no destructive migration to reverse.

<!-- /ANCHOR:enhanced-rollback -->
