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
    last_updated_at: "2026-07-21T12:26:00Z"
    last_updated_by: "implementer"
    recent_action: "Built + verified the Phase-0 plane; 69/69 tests pass."
    next_safe_action: "Run generate-context.js parent-save to refresh the fingerprint."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 97
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
- **Status:** COMPLETE
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
- Build and ship the generation manifest — a versioned, multi-artifact pointer with atomic publish, rollback, and N-generation retention (REQ-001).
- Build and ship stage telemetry across the indexer AND query lanes, residency-honest (native SQLite/FTS5 vs JS-resident compute attributed separately) (REQ-002).
- Build and ship the pinned differential oracle — a freeze/replay harness over frozen JS/ESM golden bytes; no TypeScript toolchain is introduced (REQ-003).
- Build and ship 1x/10x/100x deterministic replay fixtures and a versioned, honestly-labeled relevance-judgment seed set (REQ-004, REQ-005).
- This phase-child's own Level 2 spec-folder documentation.

### Out of Scope
- Any Rust work - explicitly excluded from Phase 0 (REQ-006); SQLite/FTS5 are already native.
- Introducing a TypeScript build step (`tsc` / `tsconfig`) - the oracle ships as pinned JS/ESM golden bytes.
- Human-authored gold relevance labels - this phase ships an honestly-labeled seed (authored-similar + silver-heuristic) and flags that human labeling is still required (REQ-005).
- Phase 1-3 roadmap work (`002-js-capabilities`, `003-measured-native`, `004-growth`) - blocked on this phase's exit gate.
- Any change outside the `.opencode/skills/sk-design/styles/_db/` tree and this packet's own docs.

### Files to Change

Real build surfaces this session, all under `.opencode/skills/sk-design/styles/_db/` (plus this packet's docs):

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `_db/generation-manifest.mjs` | New | Versioned multi-artifact manifest: atomic publish, rollback, N-generation retention (REQ-001) |
| `_db/stage-telemetry.mjs` | New | Residency-tagged per-stage latency/throughput/RSS recorder (REQ-002) |
| `_db/canonical.mjs` | New | Shared canonicalizer (stable-JSON + length-framed digest) hoisted so the oracle cannot diverge from production serialization (REQ-003) |
| `_db/oracle/differential-oracle.mjs` | New | Freeze/replay harness asserting byte-for-byte parity (REQ-003) |
| `_db/oracle/query-set.mjs` | New | Fixed query matrix driving the oracle (REQ-003) |
| `_db/oracle/replay-fixtures.mjs` | New | Deterministic 1x/10x/100x fixture generator (REQ-004) |
| `_db/oracle/relevance-judgments.mjs` | New | Judgment loader + provenance schema (REQ-005) |
| `_db/oracle/golden/` | New | Frozen canonical golden bytes replayed against (REQ-003) |
| `_db/oracle/relevance-judgments.seed.json` | New | Small versioned seed (authored-similar + silver-heuristic); human labeling flagged (REQ-005) |
| `_db/__tests__/manifest.test.mjs` | New | Atomic publish/rollback/retention + legacy-pointer tests (REQ-001) |
| `_db/__tests__/telemetry.test.mjs` | New | Per-stage emission, no-blended-bucket, DTO-unchanged tests (REQ-002) |
| `_db/__tests__/oracle.test.mjs` | New | Freeze/replay byte-parity + perturbation negative test (REQ-003) |
| `_db/__tests__/fixtures.test.mjs` | New | Regenerate-and-hash determinism at 1x/10x/100x (REQ-004) |
| `_db/__tests__/judgments.test.mjs` | New | Provenance-on-every-row + authored-similar traceability (REQ-005) |
| `_db/indexer.mjs` | Modified | Emit the generation manifest on publish; wrap lifecycle stages with telemetry; use the shared canonicalizer (REQ-001, REQ-002, REQ-003) |
| `_db/schema.mjs` | Modified | Generalize the single-file pointer into a multi-artifact manifest target; keep immutable-generation guards (REQ-001) |
| `_db/operator.mjs` | Modified | Extend retention/rollback to flip and prune whole manifests (REQ-001) |
| `_db/retrieval.mjs` | Modified | Optional side-channel telemetry hook (DTO bytes unchanged); use the shared canonicalizer (REQ-002, REQ-003) |
| `_db/__tests__/index.mjs` | Modified | Register the five new test suites (REQ-001..005) |
| `_db/README.md` | Modified | Document the manifest, telemetry, oracle, fixtures, and judgment-seed provenance |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generation manifest — a versioned, multi-artifact manifest that atomically publishes SQLite + screenshot features + model profiles + optional index under one pointer, with rollback (N-generation retention) | Built in `_db/`: a `node --test` suite proves a generation publishes and rolls back via a single manifest-pointer flip, an interrupted publish leaves the prior manifest fully readable, retention keeps N generations, and legacy single-file pointers still open |
| REQ-002 | Stage telemetry — instrument per-stage latency/throughput/RSS across the indexer AND query lanes; residency-honest (native FTS5/SQLite compute decomposed separately from JS-resident cosine/sort/RRF) | Built and tested: every indexer/query stage emits latency+throughput+RSS through the recorder; native and JS-resident buckets sum to the total with zero unattributed cost; telemetry-off leaves the retrieval DTO byte-identical to the oracle golden |
| REQ-003 | Pinned differential oracle (JS/ESM golden bytes) — freeze current retrieval/index outputs as the byte reference (DTO shape, hashes, ordering, tie-breaks) via the shared canonicalizer | Built and tested: `freeze()` writes canonical golden bytes and `replay()` re-derives them byte-for-byte; a deliberate ordering/tie-break/field perturbation fails the oracle; no TypeScript toolchain is introduced |
| REQ-006 | Phase 0 is a HARD BLOCKER — no Phase 1/2/3 work begins until REQ-001..005 are built, tested, and versioned | Later phases cite Phase 0 completion as their entry gate; no capability/native work can prove a claim or roll back without this foundation; Phase 0 itself ships no Rust |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Replay fixtures — representative 1x/10x/100x deterministic corpora | Built and tested: a deterministic generator materializes 1x/10x/100x corpora to temp dirs, regenerate-and-hash proves byte-determinism, and the oracle replays at all three scales |
| REQ-005 | Labeled relevance judgments — retrieval-quality ground truth for regression measurement | A versioned judgment seed exists where every row carries `label_source ∈ {authored-similar, silver-heuristic}` and provenance; authored rows trace to real `style_relationships`; the header flags that human gold labeling is still required and no row is presented as human gold |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A generation manifest publish/rollback cycle completes with zero torn/partial state observable to any reader.
- **SC-002**: Stage telemetry attributes 100% of indexer + query lane cost to either native (SQLite/FTS5) or JS-resident compute, with no blended/opaque buckets.
- **SC-003**: The pinned oracle (JS/ESM golden bytes) reproduces current retrieval/index outputs byte-for-byte across all three replay scales (1x/10x/100x).

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
| Scope | 14/25 | Real build across the `_db/` tree (generation manifest, stage telemetry, oracle, fixtures, judgments + tests); no longer 0 LOC, but reuses existing atomic-flip/retention machinery |
| Risk | 15/25 | Hard blocker — an incorrect foundation invalidates every later phase's parity/rollback claims |
| Research | 15/20 | Novel manifest/telemetry/oracle design, not a port of existing code |
| **Total** | **44/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which stage (JSON-fetch/decode, cosine+sort, or embedding throughput) will telemetry surface as the first SLO-crossing candidate?
- Will cold-build telemetry justify the optional parsed-projection cache (a Phase 1 item)?

<!-- /ANCHOR:questions -->

---
