---
title: "Feature Specification: Growth Architecture (10x-100x Scale)"
description: "Roadmap Phase 3 of the sk-design styles-database evolution: fix the eligible-ID SQL-parameter shape before any approximate search, then introduce a maintained HNSW/ANN under an explicit approximation contract, gated on measured 10x-100x corpus growth."
trigger_phrases:
  - "growth architecture styles database 10x 100x scale"
  - "eligible-id sql parameter limit hnsw ann"
  - "approximate search contract exact fallback rust"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/004-growth"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author 004-growth Level 2 spec-folder docs"
    next_safe_action: "Await measured 10x-100x corpus-growth pressure before starting Phase A (SQL-parameter"
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
# Feature Specification: Growth Architecture (10x-100x Scale)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Packet:** 015-styles-database-evolution / 004-growth
- **Parent:** 015-styles-database-evolution
- **Parent Spec:** `../spec.md`
- **Phase:** 4 of 4 (Roadmap Phase 3 — Growth Architecture, 10x-100x only)
- **Predecessor:** 003-measured-native
- **Successor:** none — final phase
- **Level:** 2
- **Status:** PLANNED
- **Source research:** `sk-design/013-styles-database-rust-opportunities`

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
At 10x-100x corpus growth (roughly 129,000 bundles versus today's ~1,290), the eligible-ID SQL-parameter shape used for broad queries can approach or exceed SQLite's 32,766-variable limit at ~25.4% eligibility. That is a correctness bug, not a performance question, and it is easy to conflate with a separate, unrelated "25%" figure: a provisional threshold where JSON fetch/decode consuming ≥25% of end-to-end p95 latency triggers a 10x pilot. Nothing in this phase applies at the current scale.

### Purpose
Sequence Growth Architecture (Roadmap Phase 3) so correctness comes first: fix the eligible-ID SQL-parameter shape, then introduce a maintained HNSW/ANN under an explicit, separately-versioned approximation contract (exact re-score + exact fallback, never a silent swap of the exact path). Reserve a custom Rust ANN for a proven capability gap only, and gate any shared cross-skill Rust core on spec-memory materializing as a real second consumer.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The eligible-ID SQL-parameter correctness fix (REQ-001)
- A maintained HNSW/ANN with filter-aware recall, gated on measured growth (REQ-002)
- An explicit approximation/byte-parity contract with exact re-score + exact fallback (REQ-003)
- A custom Rust ANN as a documented last-resort path (REQ-004)
- Shared cross-skill Rust core scoping, gated on a real second consumer (REQ-005)
- The growth entry gate itself: confirming nothing triggers below measured 10x-100x pressure (REQ-006)

### Out of Scope
- Any implementation work in this packet - this child is PLANNED; nothing ships beyond its own spec-folder docs
- Building anything at the current ~1,290-bundle scale - none of this phase's work triggers yet
- A shared Rust core with only one consumer - system-code-graph is explicitly excluded as a qualifying second consumer
- Any silent replacement of the exact search path with an approximate one

### Files to Change

None in this packet beyond its own spec-folder documentation. The table below lists reference-only future surfaces this phase will eventually touch; nothing here is modified by this packet.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Reference only (not modified) | Eligible-ID SQL-parameter shape; the correctness-fix target (REQ-001) |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Reference only (not modified) | ANN/exact search boundary; future approximation contract (REQ-002/003) |
| (future) HNSW/Rust ANN boundary | Reference only (not modified) | Last-resort custom Rust ANN, only if a maintained ANN proves insufficient (REQ-004) |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix the eligible-ID SQL-parameter shape FIRST. Broad queries can exceed SQLite's 32,766-variable limit at ~25.4% eligibility (at ~129,000 bundles / 100x scale); correctness before any ANN | The eligible-ID parameter shape no longer risks the 32,766-variable limit at scale; the two distinct "25%" figures are explicitly disambiguated |
| REQ-003 | Ship an explicit approximation / byte-parity contract. Approximate results are non-identical to exact, shipped as a separately-versioned capability with exact re-score + exact fallback | Any ANN ships under a versioned approximate contract with exact re-score + exact fallback; the exact path is never silently replaced |
| REQ-005 | A shared cross-skill Rust core requires a real SECOND consumer (spec-memory); system-code-graph is explicitly excluded | No shared cross-skill Rust core ships without spec-memory as a committed second consumer |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Maintain HNSW/ANN with filter-aware recall, only after the SQL-param fix, only under measured 10x-100x growth pressure | Introduced only past the growth threshold and after REQ-001; recall is filter-aware |
| REQ-004 | Custom Rust ANN as a last resort only, for a proven capability gap a maintained ANN cannot meet | Pursued only after a maintained ANN is proven insufficient for a real capability gap |
| REQ-006 | Growth entry gate: measured 10x-100x corpus growth pressure; nothing in this phase triggers at the current ~1,290-bundle scale | Every Phase 3 item cites measured growth pressure as its trigger |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The eligible-ID SQL-parameter shape no longer risks SQLite's 32,766-variable limit at 100x scale (~129,000 bundles, ~25.4% eligibility)
- **SC-002**: Any ANN capability ships under a separately-versioned approximation contract with exact re-score and exact fallback verified
- **SC-003**: No Phase 3 work begins before measured 10x-100x growth pressure is confirmed

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase `003-measured-native` | Native/Rust experiment evidence and SLO breach data feed this phase's entry gate | Confirm 003 exit evidence before starting Phase 3 work |
| Dependency | `spec-memory` as a real second Rust consumer | Without it, REQ-005 (shared core) stays out of scope | Track spec-memory's own roadmap; never build a single-consumer "shared" core |
| Risk | Conflating the two "25%" figures (SQL eligibility vs. p95-latency pilot trigger) | Could misdiagnose a correctness bug as a performance-tuning question | Explicit disambiguation documented in Edge Cases (REQ-001) |
| Risk | Silent swap of the exact search path by an approximate one | Correctness regression, byte-parity loss | Approximation contract mandates exact re-score + exact fallback, separately versioned (REQ-003) |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planning-only at this stage; growth work is quantified against real scale telemetry (10x-100x), never projected or hypothetical numbers
- **NFR-P02**: Residency-honest. No performance-improvement claim ships without a measured baseline once building begins

### Security
- **NFR-S01**: Any Rust boundary introduced by this phase (custom ANN or shared core) follows sk-code/018 conventions, `#![forbid(unsafe_code)]`

### Reliability
- **NFR-R01**: N/A at the planning stage; no service is running yet. Once the maintained ANN ships, reliability targets (for example, graceful degradation to the exact fallback) are defined as part of the approximation contract (REQ-003)

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- At 100x scale (~129,000 bundles), the eligible-ID host-parameter shape can exceed SQLite's 32,766-variable limit at ~25.4% eligibility. This is a correctness bug, Phase 3's first fix, before any ANN work
- Do not conflate the two distinct "25%" figures: (a) ~25.4% eligibility vs. the 32,766-parameter limit, and (b) a separate provisional threshold where JSON fetch/decode consuming ≥25% of end-to-end p95 latency triggers a 10x pilot

### Error Scenarios
- Approximate ANN results are non-identical to exact results. Ship separately-versioned with exact re-score + exact fallback, never a silent swap of the exact path

### State Transitions
- No packet-specific state machine exists at the planning stage. Once the approximation contract ships, transitions between exact-only and approximate-with-fallback modes need explicit handling, deferred to the phase that builds REQ-002/003

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 0 LOC this packet (docs only); the SQL-param fix is small, the ANN work is larger, both conditional on measured growth |
| Risk | 8/25 | Correctness bug at scale (REQ-001) and a hard no-silent-swap constraint (REQ-003) raise the stakes once building starts |
| Research | 12/20 | Grounded in `013-styles-database-rust-opportunities`; open questions remain on ANN library choice and shared-core scoping |
| **Total** | **25/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether corpus growth ever reaches 10x-100x; if not, this phase never triggers
- Whether a maintained HNSW/ANN suffices, or a custom Rust ANN is ever warranted
- Whether spec-memory ever materializes as a real second consumer for a shared Rust core

<!-- /ANCHOR:questions -->
