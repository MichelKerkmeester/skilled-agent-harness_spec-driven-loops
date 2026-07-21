---
title: "Implementation Plan: Roadmap Phase 0 — Evidence & Contract"
description: "Phase A-D sequencing for Phase 0 (Roadmap Evidence & Contract): the generation manifest, stage telemetry, pinned TS differential oracle, and replay fixtures, with entry/exit gates that block Phases 1-3."
trigger_phrases:
  - "phase 0 foundation implementation plan"
  - "generation manifest telemetry oracle rollout"
  - "styles db phase A B C D sequencing"
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
      - ".opencode/skills/sk-design/styles/lib/database/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Roadmap Phase 0 — Evidence & Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node ESM) |
| **Framework** | sk-design styles DB module (`.opencode/skills/sk-design/styles/_db/`) |
| **Storage** | SQLite + FTS5 via `node:sqlite`, plus a rebuildable JS vector projection |
| **Testing** | `node --test`; byte-for-byte differential parity vs the pinned TS oracle |

### Overview
This phase builds and ships the measurement and contract foundation for the styles-database evolution roadmap: a versioned generation manifest, residency-honest stage telemetry, a pinned differential oracle (JS/ESM golden bytes), and replay fixtures with an honestly-labeled relevance-judgment seed. No Rust in Phase 0 — SQLite/FTS5 are already native, and the roadmap's own verdict is "Rust only if measured."

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..006, proven by the build's `node --test` suite)
- [ ] Tests passing (`node --test './__tests__/*.test.mjs'`, zero regressions vs the pre-change baseline)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measurement/contract foundation built directly on the existing `_db/` publish + retrieval pipeline — it reuses the pipeline's atomic-flip and N-generation retention machinery rather than introducing a new runtime pattern.

### Key Components
- **Generation Manifest**: atomic publish/rollback pointer spanning SQLite + screenshot features + model profiles + optional index.
- **Stage Telemetry**: residency-honest per-stage instrumentation across the indexer and query lanes.
- **Pinned TS Oracle**: frozen byte-for-byte parity reference for current retrieval/index output.
- **Replay Fixtures**: 1x/10x/100x deterministic corpora plus a labeled relevance judgment set.

### Data Flow
Indexing writes land in a new generation, the manifest publishes it atomically, readers/telemetry observe per-stage cost, and the oracle snapshots current outputs as the frozen byte reference that fixtures replay against.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Feature build, not a bug fix. All affected surfaces live under `.opencode/skills/sk-design/styles/_db/`:

- **New:** `generation-manifest.mjs`, `stage-telemetry.mjs`, `canonical.mjs`, `oracle/{differential-oracle,query-set,replay-fixtures,relevance-judgments}.mjs`, `oracle/golden/`, `oracle/relevance-judgments.seed.json`, and five `__tests__/*.test.mjs` suites.
- **Modified:** `indexer.mjs`, `schema.mjs`, `operator.mjs`, `retrieval.mjs`, `__tests__/index.mjs`, `README.md`.
- **Reference (read-only):** `vectors.mjs` — the JS-resident vector projection the oracle snapshots and telemetry attributes.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Generation Manifest
- [ ] Atomic publish pointer (single-flip semantics)
- [ ] Rollback support
- [ ] N-generation retention policy

### Phase B: Stage Telemetry
- [ ] Instrument indexer lane (per-stage latency/throughput/RSS)
- [ ] Instrument query lane (per-stage latency/throughput/RSS)
- [ ] Residency decomposition (native SQLite/FTS5 vs JS-resident)

### Phase C: Pinned TS Oracle
- [ ] Freeze current retrieval/index outputs as the byte reference
- [ ] Differential replay harness (DTO shape, hashes, ordering, tie-breaks)

### Phase D: Fixtures & Judgments
- [ ] 1x/10x/100x deterministic replay fixtures
- [ ] Labeled relevance judgment set

### Entry Gate
None — this is the foundation phase.

### Exit Gate
Manifest publishes/rolls back atomically; telemetry emits per-stage latency/throughput/RSS; oracle reproduces current outputs byte-for-byte; fixtures + judgments exist and are versioned. **Phase 0 BLOCKS Phases 1-3.**

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Manifest publish/rollback, telemetry emission | `node --test` |
| Differential | Oracle byte-for-byte parity vs current outputs | `node --test` + pinned JS/ESM golden bytes |
| Replay | 1x/10x/100x fixture corpora | Deterministic replay harness |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-design/013 research verdict | Internal | Green | Foundation design has no Rust-rewrite justification without it |
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Internal | Green | Oracle has nothing to freeze without current retrieval behavior |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Internal | Green | Telemetry residency decomposition needs the JS vector projection boundary |
| `node:sqlite` (native SQLite + FTS5) | External | Green | Manifest cannot publish a SQLite artifact without it |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped `_db/` artifact regresses the oracle or breaks the `node --test` suite.
- **Procedure**: `git revert` the build commit(s); the generation manifest additionally supports runtime rollback — flip the pointer back to a retained prior generation with no data loss (generations are immutable and content-addressed).

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (Manifest) ──────┐
                         ├──► Phase C (Oracle) ──► Phase D (Fixtures)
Phase B (Telemetry) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A (Manifest) | None | C, D |
| B (Telemetry) | None | C |
| C (Oracle) | A, B | D |
| D (Fixtures) | C | Phases 1-3 (roadmap) |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| A: Generation Manifest | Medium | This session — reuses the existing atomic-flip / retention machinery |
| B: Stage Telemetry | Medium | This session — additive side-channel instrumentation, DTO unchanged |
| C: Pinned Oracle | Medium | This session — freeze/replay over the shared canonicalizer |
| D: Fixtures & Judgments | Low-Medium | This session — seeded generator + honestly-labeled seed |
| **Total** | | **One build session (this session); no hour estimate — effort is bounded by reuse of the existing publish/retrieval code** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (N/A — generations are immutable and content-addressed; the prior manifest is retained by policy)
- [ ] Feature flag configured (telemetry is off by default; enabling it is a no-op on the retrieval DTO)
- [ ] Monitoring alerts set (Phase B stage telemetry emits per-stage latency/throughput/RSS once wired)

### Rollback Procedure
1. Runtime: flip the manifest pointer back to the retained prior generation (no data loss).
2. Code: `git revert` the build commit(s) that landed the `_db/` changes.
3. Verify: re-run `node --test './__tests__/*.test.mjs'` and confirm the oracle replays against the retained generation.
4. Notify: none required — the styles DB is internal tooling with no external consumers.

### Data Reversal
- **Has data migrations?** No — the SQLite DB is rebuildable from the flat-file corpus, and generations are immutable and content-addressed.
- **Reversal procedure**: flip the manifest pointer to the prior generation, or rebuild from the corpus via the indexer.

<!-- /ANCHOR:enhanced-rollback -->

---
