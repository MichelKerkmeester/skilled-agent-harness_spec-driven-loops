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
This phase plans the measurement and contract foundation for the styles-database evolution roadmap: a versioned generation manifest, residency-honest stage telemetry, a pinned TypeScript differential oracle, and replay fixtures with labeled relevance judgments. No Rust in Phase 0 — SQLite/FTS5 are already native, and the roadmap's own verdict is "Rust only if measured."

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (deferred — Phase A-D implementation is future work)
- [ ] Tests passing (N/A this phase — no code ships)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measurement/contract foundation — no runtime pattern ships this phase (planning packet).

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

N/A — planning packet, not a bug fix. No production code changes ship in this phase-child; the affected-surfaces inventory applies once Phase A-D are implemented in a future session.

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
| Differential | Oracle byte-for-byte parity vs current outputs | `node --test` + pinned TS oracle |
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

- **Trigger**: N/A this phase — no runtime artifact ships; documentation-only rollback is a plain revert of the spec-folder docs.
- **Procedure**: `git revert` the commit(s) that added `001-foundation/` docs; no data or runtime rollback required.

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
| A: Generation Manifest | Medium | TBD — future implementation session |
| B: Stage Telemetry | Medium | TBD — future implementation session |
| C: Pinned TS Oracle | Medium | TBD — future implementation session |
| D: Fixtures & Judgments | Low-Medium | TBD — future implementation session |
| **Total** | | **TBD — planning packet, no build session scheduled yet** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (N/A — no data migrations this phase)
- [ ] Feature flag configured (N/A — no runtime component ships this phase)
- [ ] Monitoring alerts set (N/A — telemetry itself is Phase B's future deliverable)

### Rollback Procedure
1. N/A this phase — no runtime code ships.
2. Revert code: `git revert` the doc-only commit(s) if the plan itself needs to change.
3. Verify: confirm the phase folder returns to its pre-authoring state.
4. Notify: none required — planning-only, no user-facing impact.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.

<!-- /ANCHOR:enhanced-rollback -->

---
