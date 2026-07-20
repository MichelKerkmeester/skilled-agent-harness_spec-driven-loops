---
title: "Feature Specification: Roadmap Phase 0 — Evidence & Contract"
description: "Phase 0 of the sk-design styles-database evolution roadmap: a versioned generation manifest, residency-honest stage telemetry, a pinned TypeScript differential oracle, replay fixtures, and labeled relevance judgments that gate all later phases. HARD BLOCKER, no Rust."
trigger_phrases:
  - "styles database phase 0 foundation"
  - "generation manifest stage telemetry oracle"
  - "roadmap phase 0 evidence and contract"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/001-foundation"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 planning docs for phase 001-foundation"
    next_safe_action: "Await parent finalization (description.json, graph-metadata.json) then begin Phase A:"
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
# Feature Specification: Roadmap Phase 0 — Evidence & Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Packet:** 015-styles-database-evolution / 001-foundation
- **Parent:** 015-styles-database-evolution
- **Parent Spec:** `../spec.md`
- **Phase:** 1 of 4 (Roadmap Phase 0 — Evidence & Contract) [HARD BLOCKER]
- **Predecessor:** none — first phase
- **Successor:** 002-js-capabilities
- **Level:** 2
- **Status:** PLANNED
- **Source research:** sk-design/013-styles-database-rust-opportunities

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The styles database evolution roadmap (015) has no measurement plane. There is no versioned way to publish a new generation of SQLite + screenshot features + model profiles + optional index atomically, no per-stage latency/throughput/RSS telemetry that separates native SQLite/FTS5 compute from JS-resident work, and no frozen byte-reference for current retrieval/index output. Without these, no later phase (JS capabilities, measured-native experiments, or growth) can prove a claim, detect a regression, or roll back safely.

### Purpose
Ship the measurement and contract foundation — generation manifest, stage telemetry, pinned TypeScript differential oracle, replay fixtures, and labeled relevance judgments — so every later phase has an atomic publish/rollback unit and a byte-for-byte parity reference to replay against.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design and document the generation manifest contract (atomic publish, rollback, N-generation retention).
- Design and document stage telemetry instrumentation (indexer + query lanes, residency-honest).
- Design and document the pinned TypeScript differential oracle (frozen byte reference).
- Design and document 1x/10x/100x replay fixtures and labeled relevance judgments.
- This phase-child's own Level 2 spec-folder documentation.

### Out of Scope
- Building or shipping any of the above (this packet is PLANNED; implementation is a future session) - see `plan.md` Phase A-D.
- Any Rust work - explicitly excluded from Phase 0 (REQ-006).
- Phase 1-3 roadmap work (`002-js-capabilities`, `003-measured-native`, `004-growth`) - blocked on this phase's exit gate.

### Files to Change

None in this packet beyond its own spec-folder docs. Reference-only future surfaces (not modified this phase):

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Reference only (not modified) | Query lane the future telemetry/oracle will wrap |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Reference only (not modified) | JS-resident vector projection the oracle will snapshot |
| Indexer + publication path (styles DB build pipeline) | Reference only (not modified) | Target of the future generation manifest's atomic publish |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generation manifest — a versioned, multi-artifact manifest that atomically publishes SQLite + screenshot features + model profiles + optional index under one pointer, with rollback (N-generation retention) | A generation publishes and rolls back atomically via a single pointer flip; no partial/torn publication is observable to readers |
| REQ-002 | Stage telemetry — instrument per-stage latency/throughput/RSS across the indexer AND query lanes; residency-honest (native FTS5/SQLite compute decomposed separately from JS-resident cosine/sort/RRF) | Every indexer/query stage emits latency+throughput+RSS; native vs JS-resident compute is attributable, not blended |
| REQ-003 | Pinned TypeScript differential oracle — freeze current retrieval/index outputs as the byte reference (DTO shape, hashes, ordering, tie-breaks) | The oracle reproduces current outputs byte-for-byte and is the single parity reference all later phases replay against |
| REQ-006 | Phase 0 is a HARD BLOCKER — no Phase 1/2/3 work begins until REQ-001..005 exist and are versioned | Later phases cite Phase 0 completion as their entry gate; no capability/native work can prove a claim or roll back without this foundation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Replay fixtures — representative 1x/10x/100x deterministic corpora | Fixtures exist, are versioned, and drive deterministic replay at all three scales |
| REQ-005 | Labeled relevance judgments — retrieval-quality ground truth for regression measurement | A labeled judgment set exists and is versioned |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A generation manifest publish/rollback cycle completes with zero torn/partial state observable to any reader.
- **SC-002**: Stage telemetry attributes 100% of indexer + query lane cost to either native (SQLite/FTS5) or JS-resident compute, with no blended/opaque buckets.
- **SC-003**: The pinned TS oracle reproduces current retrieval/index outputs byte-for-byte across all three replay scales (1x/10x/100x).

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-design/013 research verdict ("no Rust rewrite now") | Foundation design must stay JS-first | Phase 0 explicitly excludes Rust (REQ-006) |
| Dependency | Current `retrieval.mjs` / `vectors.mjs` behavior | Oracle has nothing to pin against if current output is unstable | Freeze the oracle before any other phase changes retrieval code |
| Risk | Manifest publish is not atomic | Torn/partial generations corrupt readers | REQ-001 acceptance requires single-pointer-flip atomicity |
| Risk | Telemetry blends native and JS-resident cost | Later "Rust only if measured" decisions become unverifiable | REQ-002 requires residency-decomposed emission |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planning-only this phase; future wins are quantified against a real residency decomposition — SQLite/FTS5 compute is already native, only vector-JSON fetch + cosine + sort + RRF are JS-resident, with RRF candidate-bounded at `MAX_CANDIDATE_K=200`.

### Security
- **NFR-S01**: Any future Rust work (outside this phase) follows `sk-code/018` (`#![forbid(unsafe_code)]`); Phase 0 itself ships no Rust.

### Reliability
- **NFR-R01**: N/A this phase — no runtime component is deployed; reliability targets apply once the manifest/telemetry/oracle are built in a future session.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- N/A this phase — no data model ships; the manifest's artifact boundaries are defined in `plan.md` Phase A.

### Error Scenarios
- A failed or interrupted manifest publish must leave the prior generation fully intact and readable — the manifest must publish atomically at every scale (1x/10x/100x), with no torn/partial generation ever observable to a reader mid-publish.

### State Transitions
- The pinned TS oracle must be frozen before any later phase (1-3) runs, so every subsequent change replays against a stable, pre-change reference.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Docs-only this packet (0 LOC); defines the contract 3 later phases depend on |
| Risk | 15/25 | Hard blocker — an incorrect foundation invalidates every later phase's parity/rollback claims |
| Research | 15/20 | Novel manifest/telemetry/oracle design, not a port of existing code |
| **Total** | **38/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which stage (JSON-fetch/decode, cosine+sort, or embedding throughput) will telemetry surface as the first SLO-crossing candidate?
- Will cold-build telemetry justify the optional parsed-projection cache (a Phase 1 item)?

<!-- /ANCHOR:questions -->

---
