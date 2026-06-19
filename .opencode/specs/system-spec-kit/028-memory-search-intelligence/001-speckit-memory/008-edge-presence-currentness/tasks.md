---
title: "Tasks: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)"
description: "Task breakdown for the temporal candidates: one task group per candidate (C3-A, C3-C, memory_history, CG-temporal-query-extraction, M-unforget-channel-disjointness), with the substrate prerequisite (C3-B), per-candidate gates, and verification. C3-A is implemented in the current working tree; four candidates remain pending."
trigger_phrases:
  - "tasks edge presence currentness"
  - "temporal recall task breakdown"
  - "memory history task"
  - "temporal query extraction task"
  - "unforget disjointness task"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness"
    last_updated_at: "2026-06-19T06:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown for the five PENDING temporal candidates"
    next_safe_action: "Confirm C3-B substrate, then start C3-A read-side wiring task"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-008-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed or explicitly deferred with accepted evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or action (primary seam) [status/evidence]`

> **Status note:** Wave-0 still shipped none of these candidates. Current working-tree status: C3-A is implemented and verified locally; C3-C, memory_history, temporal-query-extraction, and unforget-disjointness remain pending behind their gates.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T003 | Substrate confirm + reconciliation decision |
| M2 | T004-T010 | Candidate implementation |
| M3 | T011-T015 | Verification + phase closeout |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm C3-B four-timestamp window status in the sibling phase (substrate prerequisite for AsKnownAt + the 4-channel matrix) [Blocked on sibling phase].
- [x] T002 Designate lineage the canonical supersede writer; confirm causal `invalid_at` is a derived projection (`vector-index-schema.ts:184-185`) [Done; evidence: `invalidation_source` marker distinguishes lineage/direct/legacy closure provenance while open edges keep NULL].
- [ ] T003 Capture the non-temporal recall baseline for additivity byte-checks [Pending].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Candidate C3-A: wire the read-side `getValidEdges` currentness filter (`AND invalid_at IS NULL`) onto the recall read path (`contradiction-detection.ts:75-77, 99-110`) [Done; evidence: `getValidEdges()` reads only `invalid_at IS NULL` edges and `tests/edge-presence-currentness.vitest.ts` covers flag-off baseline preservation].
- [x] T005 Candidate C3-A: lineage↔causal-edge store reconciliation so the canonical supersede writer and the derived projection do not fork (`vector-index-schema.ts:184-185`) [Done; evidence: schema up/backfill/rollback and flag-on reconciliation covered by `tests/edge-presence-currentness.vitest.ts`].
- [ ] T006 [P] Candidate C3-C: add the `TemporalMode` enum (Current/AsOf/AsKnownAt/History) + a `current-support` provider; Current byte-identical via `active_memory_projection`; gate AsKnownAt on C3-B (`contradiction-detection.ts` new enum/provider) [Pending].
- [ ] T007 [P] Candidate memory_history: expose the lib-only `resolveLineageAsOf`/`inspectLineageChain` (zero non-test callers) as a new MCP tool, ~5-surface parity add (`lineage-state.ts:1025-1043`) [Pending; depends on C3-A read path for currentness-correct chains].
- [ ] T008 Candidate CG-temporal-query-extraction: parse a structured `QueryInterval` from the NL query, filter events by the range, vector-rank the filtered set, fall through to normal search when no bounds (new query-time parser) [Pending; gate: benchmark needed for range-filter precision before shipping].
- [ ] T009 [B] Candidate M-unforget-channel-disjointness: extend the C3-D revision matrix 2→4 channels leaving disjoint `(expired_at,status,edge)` fingerprints + a status-ownership write-refusal guard (`temporal-edges.ts`) [Blocked: needs both an unforget channel AND erasure; only one half present].
- [x] T010 Update `spec.md` §14 candidate-status rows with final DONE / PENDING gate per candidate [Done; evidence: C3-A DONE, four candidates PENDING, Pending count 4 / Done count 1; no commit created per user request].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run Memory MCP static gates [`npm run typecheck`, `npm run build`] [Partial evidence: `npm run typecheck` exits 0; build not part of this scoped finish request].
- [ ] T012 Verify Current-mode recall byte-identical to the baseline; AsOf/History window correctness; AsKnownAt presence once C3-B lands.
- [ ] T013 Parity-test `memory_history` against the lib functions; byte-check non-temporal queries unchanged; property-test unforget disjointness (when built).
- [x] T014 Run the touched-area Vitest suite and classify any broad failures against baseline evidence [Done; evidence: `npx vitest run tests/edge-presence-currentness.vitest.ts` = 3/3 pass; `npx vitest run tests/flag-ceiling.vitest.ts` = 6/6 pass].
- [x] T015 Run strict packet validation and fix structure issues [`validate.sh --strict`] [Done; evidence: strict validation exits 0 with 0 errors / 0 warnings].
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Each candidate has a final status in `spec.md` §14 (DONE with commit, or PENDING with its gate).
- [ ] Shipped candidates have implementation, test, review, and commit evidence; Current-mode recall byte-identical.
- [ ] Deferred candidates are not disguised as incomplete work; each names its block reason (schema / benchmark / shared-infra) and path.
- [ ] Non-temporal queries verified byte-identical to baseline.
- [ ] Strict validation passes for this phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially §14 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Decision record**: `decision-record.md`.
- **Phase research**: `../research/research.md`.
- **Roadmap (authoritative)**: `../../research/roadmap.md`.
<!-- /ANCHOR:cross-refs -->
