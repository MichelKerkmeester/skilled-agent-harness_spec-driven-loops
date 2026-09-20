---
title: "Tasks: Roadmap Phase 0 — Evidence & Contract"
description: "Task breakdown for Phase 0 (Roadmap Evidence & Contract): T001-T010 across Setup, Implementation, and Verification, all PLANNED."
trigger_phrases:
  - "phase 0 foundation task breakdown"
  - "generation manifest telemetry oracle tasks"
  - "styles database phase 0 setup implementation verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/002-foundation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author Level 2 planning docs for phase 001-foundation"
    next_safe_action: "Await parent finalization (description.json, graph-metadata.json) then begin Phase A:"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/vectors.mjs"
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Roadmap Phase 0 — Evidence & Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description [Roadmap Phase: Px | REQ: REQ-NNN | STATUS: PLANNED]` — build+test tasks name their primary `_db/` file(s); `PLANNED` flips to `DONE` only when the verify stage confirms it with evidence. All build lands under `.opencode/skills/sk-design/styles/_db/`.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Hoist the shared canonicalizer (stable-JSON + length-framed digest) into `_db/canonical.mjs` and re-point `indexer.mjs` + `retrieval.mjs` at it with no output change [Roadmap Phase: P0 | REQ: REQ-003 | STATUS: PLANNED]
- [ ] T002 Capture the regression baseline — run `node --test './__tests__/*.test.mjs'` and record the current pass count before any change [Roadmap Phase: P0 | REQ: REQ-006 | STATUS: PLANNED]
- [ ] T003 Stand up the residency-honest telemetry recorder skeleton in `_db/stage-telemetry.mjs` (off by default, side-channel, zero cost when unused) [Roadmap Phase: P0 | REQ: REQ-002 | STATUS: PLANNED]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build `_db/generation-manifest.mjs` — versioned multi-artifact manifest doc plus read-side validation (per-artifact sha256 + realpath containment) [Roadmap Phase: P0 | REQ: REQ-001 | STATUS: PLANNED]
- [ ] T005 Generalize `schema.mjs` pointer resolution and `indexer.mjs` publish to write/flip the manifest atomically (reuse the existing temp-write → fsync → rename → dir-fsync flip); extend `operator.mjs` retention/rollback to whole manifests; keep legacy single-file-pointer back-compat [Roadmap Phase: P0 | REQ: REQ-001 | STATUS: PLANNED]
- [ ] T006 Instrument the six indexer lifecycle stages and the query lanes (eligibility → structured → fts → vector → RRF → card-assembly) with the recorder; tag every bucket native or js-resident; leave the retrieval DTO bytes unchanged (telemetry is a side channel) [Roadmap Phase: P0 | REQ: REQ-002 | STATUS: PLANNED]
- [ ] T007 Build the oracle — `_db/oracle/query-set.mjs` (fixed query matrix) and `_db/oracle/differential-oracle.mjs` `freeze()`/`replay()` writing/reading `_db/oracle/golden/` via the shared canonicalizer (deterministic embedder for the vector lane) [Roadmap Phase: P0 | REQ: REQ-003 | STATUS: PLANNED]
- [ ] T008 Build `_db/oracle/replay-fixtures.mjs` — a seeded, deterministic 1x/10x/100x corpus generator that materializes to temp dirs (no `Date.now`, no random) and cleans up [Roadmap Phase: P1 | REQ: REQ-004 | STATUS: PLANNED]
- [ ] T009 Build `_db/oracle/relevance-judgments.mjs` + `_db/oracle/relevance-judgments.seed.json` — authored-similar rows derived from real `style_relationships` plus silver-heuristic pseudo-labels; every row stamped `label_source` + `confidence`; header flags that human gold labeling is still required and presents no row as gold [Roadmap Phase: P1 | REQ: REQ-005 | STATUS: PLANNED]
- [ ] T010 Write `_db/__tests__/manifest.test.mjs` — atomic publish, rollback, N-generation retention, legacy-pointer back-compat, and interrupted-publish leaves the prior manifest readable [Roadmap Phase: P0 | REQ: REQ-001 | STATUS: PLANNED]
- [ ] T011 Write `_db/__tests__/telemetry.test.mjs` — every stage emits latency+throughput+RSS, native+js buckets sum to the total with zero unattributed cost, telemetry-off leaves the DTO byte-identical to the oracle golden [Roadmap Phase: P0 | REQ: REQ-002 | STATUS: PLANNED]
- [ ] T012 Write `_db/__tests__/oracle.test.mjs` (freeze→replay byte-for-byte + ordering/tie-break/field perturbation negative test) and `_db/__tests__/fixtures.test.mjs` (regenerate-and-hash determinism at 1x/10x/100x) [Roadmap Phase: P0 | REQ: REQ-003, REQ-004 | STATUS: PLANNED]
- [ ] T013 Write `_db/__tests__/judgments.test.mjs` (provenance present on every row; authored rows trace to real `style_relationships`) and register all five new suites in `_db/__tests__/index.mjs` [Roadmap Phase: P1 | REQ: REQ-005 | STATUS: PLANNED]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the whole suite via `node --test './__tests__/*.test.mjs'` (never the bare-directory form, which fails on this Node); confirm the T002 baseline plus the five new suites all pass with zero regressions [Roadmap Phase: P0 | REQ: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005 | STATUS: PLANNED]
- [ ] T015 Confirm no Rust and no TypeScript toolchain shipped — the oracle is pinned JS/ESM golden bytes only [Roadmap Phase: P0 | REQ: REQ-006 | STATUS: PLANNED]
- [ ] T016 Update `_db/README.md`, version all deliverables, run `validate.sh --strict` for this packet, and confirm Phase 0 gates Phases 1-3 [Roadmap Phase: P0 | REQ: REQ-006 | STATUS: PLANNED]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---
