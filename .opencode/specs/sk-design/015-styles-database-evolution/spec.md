---
title: "Spec: sk-design styles database evolution — JS-first, measurement-gated roadmap"
description: "Phased roadmap to evolve the sk-design styles database with new capabilities and measurement plumbing built JS-first; Rust is a conditional, measurement-gated late option, not a rewrite."
trigger_phrases:
  - "styles database evolution roadmap"
  - "sk-design styles db phased plan"
  - "styles db rust conditional roadmap"
  - "js-first styles database features"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution"
    last_updated_at: "2026-07-20T06:36:16Z"
    last_updated_by: "spec-author"
    recent_action: "Author the styles-DB evolution roadmap spec (Level 2, PLANNED) from the 013 research verdict"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md for this packet"
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

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: sk-design styles database evolution — JS-first, measurement-gated roadmap

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Packet:** 015-styles-database-evolution
- **Level:** 2 (planning packet; nothing built yet)
- **Status:** PLANNED
- **Source research:** sk-design/013-styles-database-rust-opportunities (20-iteration deep-research; two independent GPT-5.6-SOL lineages; no early convergence)
- **Sibling precedent:** sk-code/018-rust-standards-for-code-opencode (the Rust adoption standard this roadmap defers to)

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The styles database (`styles/_db/`, SQLite + FTS5 + a rebuildable vector projection over ~1,290 style bundles / ~135 MiB) works, but its evolution is undecided. The 013 study assessed whether Rust could ADD or IMPROVE capabilities. Both lineages independently converged: NO Rust rewrite now. Storage and FTS5 lexical search already run natively inside `node:sqlite`; the only JS-resident compute is a brute-force cosine (`retrieval.mjs:232-249`), the weighted-RRF fusion (candidate-bounded at `MAX_CANDIDATE_K = 200`, ~600 contributions regardless of corpus growth), and a regex tokenizer — tiny, parity-sensitive, and off by default behind the `legacy|shadow|persistent` adapter. By the repo's own when-to-use-Rust gates (JS-resident + materially costly + at scale, per sk-code/018), a straight port is NOT justified.

### Purpose

Encode a phased roadmap that delivers NEW capabilities + measurement plumbing JS-first, and admits Rust ONLY where a measured SLO crossing justifies it. This packet is the roadmap; nothing is being built yet. A valid future outcome is "no Rust."

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 4-phase roadmap (Phase 0 evidence/contract foundation → Phase 1 JS capabilities → Phase 2 measured native experiments → Phase 3 growth architecture) with per-phase entry/exit gates.
- The two governing constraints: the "Rust only if measured" gate and the parity/rollback invariant.
- Residency-honest measurement: no credit for already-native FTS5/SQLite work.

### Out of Scope
- Building any of it now - each phase is a future packet gated on this roadmap.
- A Rust-first rewrite - the source research explicitly rejected a straight port.
- Porting the already-native FTS5/SQLite work or the tiny cosine/RRF/tokenizer math as-is - not justified by the repo's own Rust-adoption gates.

### Files to Change

None in this packet beyond the spec-folder docs it authors. The table below names future-phase target surfaces for reference only; neither is modified here.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Reference only (not modified) | Future-phase target surface named for context. |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Reference only (not modified) | Future-phase target surface named for context. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance |
|----|--------------|------------|
| REQ-001 | Phase 0 evidence & contract foundation | A versioned multi-artifact "generation manifest" (atomically publishes SQLite + screenshot features + model profiles + optional index under ONE pointer, with rollback), stage telemetry across the indexer + query lanes, a pinned TypeScript differential oracle freezing current outputs, representative 1x/10x/100x replay fixtures, and labeled relevance judgments all exist and gate Phases 1-3. |
| REQ-002 | "Rust only if measured" gate | No native/Rust experiment begins unless a named stage crosses a MEASURED SLO against the oracle; "no Rust" is an explicitly valid outcome; every latency/perf claim respects the residency gate (no credit for already-native FTS5/SQLite work). |
| REQ-003 | Parity + rollback invariant | Any native OR approximate capability MUST pass byte-for-byte parity vs the pinned TS oracle (DTO shape, errors, hashes, numeric spelling, ordering, tie-breaks) OR ship as a separately-versioned approximate capability with exact re-score + exact fallback; every generation is atomically publishable AND rollback-able via the manifest pointer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance |
|----|--------------|------------|
| REQ-004 | Phase 1 JS capability features | DOM-derived responsive layout fingerprints (crawler already captures rectangles/padding/margins/gaps/flex/grid/landmarks across 5 viewports); screenshot palette/statistics + perceptual dedupe (via native-backed sharp/libvips; pHash used ONLY for near-duplicate detection, NEVER as a semantic style ranker); a shadow multimodal (text+image / CLIP) retrieval lane over the existing Node ONNX / Transformers.js (onnxruntime-node) stack; a batched embedding queue (replacing today's one-embedder-call-per-job draining); an auto-reindex watcher (Chokidar + periodic reconciliation, where reconciliation is authority and the watcher is only a trigger); and an OPTIONAL parsed-projection cache built only if Phase 0 cold-build telemetry proves value. All JS; no Rust. |
| REQ-005 | Phase 2 measured native experiments (conditional) | ONLY if a stage crosses a measured SLO: evaluate maintained sqlite-vec / native EXACT vector search (removes JSON-parse + JS-sort); a supervised Rust `ort` inference sidecar for crash/RSS/deployment ISOLATION (NOT presumed speed - both Node and Rust wrap the same native ONNX kernels); a bounded Rust parse core. Each must beat the TS oracle end-to-end AND pass byte-for-byte parity, following sk-code/018 (TS stays the shell; thin napi-rs adapter; pure `#![forbid(unsafe_code)]` core owning exactly one measured kernel). |
| REQ-006 | Phase 3 growth architecture (10x-100x only) | FIRST fix the eligible-ID SQL-parameter shape (broad queries can exceed SQLite's 32,766-variable limit at ~25% eligibility) - correctness before ANN. THEN maintained HNSW/ANN with filter-aware recall + an explicit approximation/byte-parity contract (separately-versioned; exact re-score + exact fallback). Custom Rust ANN is a last resort for a PROVEN capability gap; a shared cross-skill Rust core requires a real SECOND consumer (spec-memory), never one (system-code-graph is explicitly excluded). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The roadmap encodes all 4 phases with explicit entry/exit gates and the two governing constraints (Rust-only-if-measured; parity/rollback) [VERIFIED: plan.md phases + checklist].
- **SC-002**: Every task in tasks.md maps to a phase + a REQ and is PLANNED (nothing built) [VERIFIED: tasks.md].
- **SC-003**: The plan is residency-honest: no perf claim credits already-native FTS5/SQLite work [VERIFIED: REQ-002].
- **SC-004**: A future implementer can start Phase 0 without re-litigating the Rust decision [VERIFIED: this spec + linked 013 research].

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** a future phase skips Phase 0 and builds capability without an oracle/telemetry. Mitigated - REQ-001 is a hard blocker gating REQ-004/REQ-005/REQ-006.
- **Risk:** perf claims credit already-native SQLite/FTS5 work. Mitigated - the residency gate (REQ-002).
- **Risk:** ANN approximation silently breaks byte-parity expectations. Mitigated - the separately-versioned approximation contract (REQ-003/REQ-006).
- **Risk:** a shared Rust core is built for a single consumer. Mitigated - the "real second consumer (spec-memory)" gate (REQ-006); system-code-graph is explicitly excluded.
- **Dependency:** the sk-code/018 Rust standard; the existing Node ONNX/Transformers.js stack; SQLite + FTS5 via `node:sqlite` (native, unchanged); the 013 research findings.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

Planning-only; no runtime change. Future wins must be quantified against a REAL residency decomposition (SQLite/FTS5 native; only vector-JSON fetch + cosine + sort + RRF are JS-resident at ~1,290 bundles / ~135 MiB), not hand-waved "Rust is faster." RRF is candidate-bounded (`MAX_CANDIDATE_K = 200`).

### Security

Any future Rust boundary follows sk-code/018 (`#![forbid(unsafe_code)]` in core, owned boundary DTOs, JS-controlled input never reaching `unwrap`/`panic`).

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- At 100x scale (~129,000 bundles), the eligible-ID host-parameter shape can exceed SQLite's 32,766-variable limit at ~25.4% eligibility - a correctness bug, and Phase 3's first fix, before ANN.
- Do NOT conflate the two distinct "25%" figures: (a) ~25.4% eligibility vs the 32,766-parameter limit; (b) a SEPARATE provisional threshold where JSON fetch/decode consuming ≥25% of end-to-end p95 latency triggers a 10x pilot. Different gates.

### Error Scenarios
- Approximate ANN results are non-identical to exact results - must ship as a separately-versioned capability with exact re-score + exact fallback, never a silent swap of the exact path.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Implementation complexity is deferred to future per-phase packets; this packet writes NO runtime code.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 0 LOC changed (planning only); 4 phases / 6 REQs / ~19 tasks scoped across future packets. |
| Risk | 10/25 | A wrong roadmap misallocates future effort; the conditional Rust gate and parity/rollback invariant carry real technical risk if a future phase skips them. |
| Research | 3/20 | Upstream investigation already complete in sk-design/013 (20-iteration deep-research); this packet synthesizes, not investigates. |
| **Total** | **21/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does any opportunity clear the materiality gate at the current ~1,290-bundle scale, or only under 10x-100x growth? (To be answered by Phase 0 telemetry.)
- Is a shared cross-skill Rust search core worth the coordination cost, given spec-memory is the only plausible second consumer and system-code-graph is excluded?
- Which stage (if any) crosses a measured SLO first — JSON-fetch/decode, cosine+sort, or embedding throughput?
<!-- /ANCHOR:questions -->
