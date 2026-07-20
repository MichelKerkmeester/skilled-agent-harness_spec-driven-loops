---
title: "JS Capability Features (Roadmap Phase 1)"
description: "Level 2 spec for Roadmap Phase 1 of the sk-design styles-database evolution roadmap: five JS-only capability features plus one telemetry-gated optional cache, every feature shadow/flag-gated, no Rust."
trigger_phrases:
  - "js capability features roadmap phase 1"
  - "styles db phase 1 requirements no rust"
  - "shadow flag layout fingerprints multimodal batched embedding watcher"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/002-js-capabilities"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec-folder docs (spec/plan/tasks/checklist/implementation-summary) for"
    next_safe_action: "Plan and build 001-foundation (Phase 0) first; 002-js-capabilities remains PLANNED until Phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: JS Capability Features (Roadmap Phase 1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Packet:** 015-styles-database-evolution / 002-js-capabilities
- **Parent:** 015-styles-database-evolution
- **Parent Spec:** `../spec.md`
- **Phase:** 2 of 4 (Roadmap Phase 1 — JS Capability Features)
- **Predecessor:** 001-foundation
- **Successor:** 003-measured-native
- **Level:** 2
- **Status:** PLANNED
- **Source research:** `sk-design/013-styles-database-rust-opportunities`

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Once Phase 0 (`001-foundation`) ships its measurement plane, the 013 research identified six concrete JS-only capability opportunities the styles database does not yet have: DOM-derived layout fingerprints, screenshot-based palette/dedupe, a shadow multimodal retrieval lane, batched embeddings, an auto-reindex watcher, and (conditionally) a parsed-projection cache. None of these require Rust.

### Purpose
Sequence these six capabilities into Roadmap Phase 1, each shipped behind a shadow/flag path with parity guarantees where it overlaps an existing output, so the styles database gains new JS-first capabilities without risking the default read path or repeating the "Rust rewrite" temptation the 013 research explicitly ruled out for this phase.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Defining and documenting the five JS-only Phase 1 capability features (REQ-001 through REQ-005) as shadow/flag-gated additions to the existing Node stack
- Documenting the entry gate (Phase 0 complete) and the optional, telemetry-gated parsed-projection cache (REQ-006)
- Establishing the JS-only / no-Rust and no-regression invariants (REQ-007) that govern every feature in this phase

### Out of Scope
- Building or shipping any of the five features — this packet is planning-only (Status: PLANNED)
- Rust of any kind — reserved for the conditional, measured `003-measured-native` phase
- Growth-scale work (HNSW/ANN, SQL parameter ceiling fixes) — reserved for `004-growth`
- Phase 0 itself (manifest, telemetry, oracle, fixtures) — owned by `001-foundation`, this phase's entry gate

### Files to Change

**None in this packet** — Phase 1 is planning-only; the only files created are this packet's own five spec-folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`).

**Future surfaces (reference only, not modified in this packet):**

| File / Path | Change Type | Description |
|-----------|-------------|-------------|
| Crawler / DOM-capture path | Reference only (not modified) | Source of per-viewport rectangles/padding/margins/gaps/flex/grid/landmarks for REQ-001 layout fingerprints |
| Screenshot pipeline (sharp/libvips) | Reference only (not modified) | Palette/stats + pHash near-dup dedupe for REQ-002 |
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Reference only (not modified) | Default read path the REQ-003 shadow multimodal lane must never touch |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Reference only (not modified) | Embedding/vector surface relevant to REQ-004's batched queue |
| Embedding queue | Reference only (not modified) | Target of REQ-004's batch-aware scheduling |
| Watcher (Chokidar) + reconciliation pass | Reference only (not modified) | Target of REQ-005's auto-reindex trigger + authoritative reconciliation |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Entry gate + JS-only + no-regression invariant | Phase 0 cited as entry gate; no feature regresses the default path; zero Rust in Phase 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DOM-derived responsive layout fingerprints | A layout fingerprint per bundle across 5 viewports, derived from existing crawl data, shipped behind a shadow/flag path |
| REQ-002 | Screenshot palette/statistics + perceptual dedupe | Palette/stat features + a pHash near-dup signal; pHash is not wired into semantic ranking anywhere |
| REQ-003 | Shadow multimodal (text+image / CLIP) retrieval lane | A shadow multimodal lane runs off the existing ONNX stack without touching the default read path |
| REQ-004 | Batched embedding queue | The embedding queue drains in batches; throughput measured against Phase 0 telemetry; outputs parity-equal to the per-call path |
| REQ-005 | Auto-reindex watcher | File changes trigger reindex; a periodic reconciliation pass is authoritative and corrects any missed/incorrect watcher events |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Optional parsed-projection cache | Implemented only on a positive cold-build telemetry signal; otherwise explicitly deferred |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five Phase 1 features (REQ-001–REQ-005) are shipped behind shadow/flag paths with zero default-path regression
- **SC-002**: Every feature that overlaps an existing output achieves measured parity before promotion is considered
- **SC-003**: Zero Rust code is introduced anywhere in this phase

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 0 (`001-foundation`) manifest/telemetry/oracle/fixtures | Cannot measure parity or entry-gate this phase | Hard blocker — do not start Phase 1 build until Phase 0 ships |
| Dependency | Existing Node ONNX/Transformers.js (onnxruntime-node) stack | Shadow multimodal lane has no runtime | Already present in the repo; no new native dependency |
| Dependency | sharp/libvips | Screenshot palette/stats + pHash dedupe has no runtime | Already present; native-backed, no Rust needed |
| Risk | pHash misused as a semantic ranker | Would corrupt retrieval relevance | Explicit invariant (REQ-002): pHash is dedupe-only, never wired into ranking |
| Risk | Watcher-only reindexing misses events | Silent staleness in the index | Reconciliation pass is the authority, not the watcher (REQ-005) |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planning-only in this packet — no runtime performance claims yet; new lanes will be measured against Phase 0 telemetry baselines once built
- **NFR-P02**: Residency-honest — no capability in this packet claims credit for work that is already native (e.g., existing SQLite/FTS5)

### Security
- **NFR-S01**: Any future Rust component (none exist in Phase 1) must follow the sk-code/018 Rust-integration policy

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Shadow lanes must never affect default reads**: every Phase 1 feature runs behind a flag; the default retrieval/read path must be provably unaffected until a lane is promoted
- **Batched embedding queue must be parity-equal to per-call**: batching changes only throughput, never the resulting embeddings

### Error Scenarios
- **The auto-reindex watcher may miss events**: the Chokidar watcher is a best-effort trigger only; periodic reconciliation is the correctness authority and must catch any missed or incorrect watcher-driven reindex

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Scope** | 8/25 | Six features (layout fingerprints, screenshot dedupe, shadow multimodal, batched queue, watcher, optional cache) — the largest capability surface in the 015 roadmap |
| **Risk** | 10/25 | Low for these docs (0 LOC, planning-only); build-time risk is medium — new lanes must not regress the default read path |
| **Research** | 3/20 | Grounded in `sk-design/013-styles-database-rust-opportunities`; open questions on viewport/feature signal and multimodal promotion remain |
| **Total** | **21/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

## 10. OPEN QUESTIONS

- Which viewports/features carry the most retrieval signal?
- Does the shadow multimodal lane earn promotion? **Deferred to measured evaluation, gated by Phase 0 relevance judgments**
- Does cold-build telemetry justify the parsed-projection cache (REQ-006)?

<!-- /ANCHOR:questions -->
