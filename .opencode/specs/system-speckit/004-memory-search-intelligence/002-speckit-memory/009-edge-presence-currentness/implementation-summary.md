---
title: "Implementation Summary: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)"
description: "Implementation summary for the five temporal candidates. C3-A edge-presence currentness shipped default-off behind SPECKIT_EDGE_PRESENCE_CURRENTNESS with a focused test (commit cb92f2f211) then was kept off and removed in the flag-resolution reckoning (reconciliation repaired 0 rows, integrity-only). The remaining four candidates (C3-C, memory_history, CG-temporal-query-extraction, M-unforget-channel-disjointness) stay pending their schema, benchmark and shared-infra gates."
trigger_phrases:
  - "implementation summary edge presence currentness"
  - "temporal recall replan summary"
  - "pending temporal candidates status"
  - "028 001 008 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/009-edge-presence-currentness"
    last_updated_at: "2026-07-06T19:16:29.660Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "C3-A shipped then kept off as integrity-only, 4 candidates pending"
    next_safe_action: "Land C3-C TemporalMode and memory_history after the C3-B substrate lands"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-008-replan"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-edge-presence-currentness |
| **Status** | in-progress |
| **Level** | 3 |
| **Scope** | Five temporal candidates, C3-A shipped and four pending |
| **Branch** | system-speckit/004-memory-search-intelligence |
| **HEAD** | cb92f2f211 shipped C3-A (temporal-edges, vector-index-schema, search-flags, 241-line test) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

C3-A edge-presence currentness shipped behind `SPECKIT_EDGE_PRESENCE_CURRENTNESS` (default-off), committed at `cb92f2f211`. The candidate adds the read-side currentness reconciliation in `temporal-edges.ts`, the schema migration in `vector-index-schema.ts` and the flag in `search-flags.ts`, verified by a 241-line passing test (`tests/edge-presence-currentness.vitest.ts`, 3 pass). When the flag is off the reconciliation is a no-op, so default recall stays byte-identical. The phase also carries the Level-3 planning set (spec, plan, tasks, checklist, decision-record) that sequenced the gate-aware plan for all five candidates.

**Phase disposition (status nuance for re-derive):** the phase is **complete** as a concluded decision, not as five shipped features. C3-A was built and shipped default-off, then **kept off and removed** in the flag-resolution reckoning because the reconciliation pass repaired 0 rows on the live graph, an integrity pass and not a recall lever (see `../../007-kept-off-flag-resolution/`). The other four candidates (C3-C, memory_history, CG-temporal-query-extraction, M-unforget-channel-disjointness) are **deferred by decision** behind their schema, benchmark and shared-infra gates, none was started. The clean phase enum is `complete` (the decision concluded with a no-go on C3-A as a recall lever plus four gated deferrals). The default-off, benchmark-gated, shadow/integrity-only and per-candidate breakdown detail lives in this body and in §Candidate Status below so the enum stays closed on a future re-derive.

The remaining four candidates stay **PENDING** behind their schema, benchmark and shared-infra gates.

### Candidate Status

| # | Candidate | Status | Gate | Evidence |
|---|-----------|--------|------|----------|
| 1 | C3-A edge-presence currentness | DONE, default-off | flag-gated (SPECKIT_EDGE_PRESENCE_CURRENTNESS) | shipped at cb92f2f211: temporal-edges.ts + vector-index-schema.ts + search-flags.ts + 241-line test (3 pass) |
| 2 | C3-C TemporalMode | PENDING | schema (AsKnownAt needs C3-B), Current/AsOf/History buildable now | not started |
| 3 | memory_history as-of tool | PENDING | shared-infra (C3-A read path for currentness-correct chains) | not started |
| 4 | CG-temporal-query-extraction | PENDING | needs-benchmark (range-filter precision) | not started |
| 5 | M-unforget-channel-disjointness | PENDING | needs-benchmark + shared-infra (needs both unforget channel and erasure) | not started |

**Pending: 4. Done: 1.**
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning set was authored from the authoritative 028 research: the cross-cutting `research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda), the `research/synthesis/01-go-candidates.md` + `03-corrections-caveats-and-residuals.md`, the phase-local `001-speckit-memory/research/research.md` and the per-candidate iteration/delta evidence (001 iters 012/016/027/037/038, 005-revisit Q9, 007 iters 008/013/014). Each candidate's seam, `[CONFIRMED]`/`[INFERRED]` evidence, effort/leverage and roadmap corrections were pulled forward into the spec scope table and the decision record.

C3-A is implemented and committed at `cb92f2f211`. The `description.json` and `graph-metadata.json` are regenerated separately by `generate-context.js`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Treat C3-A as a read-side build, not a flag flip | Accepted | `SPECKIT_TEMPORAL_EDGES` already ON, needs read-side filter + store reconciliation |
| ADR-002 | C3-C Current reads alongside `active_memory_projection` | Accepted | M effort, byte-identical Current, AsKnownAt gated on C3-B |
| ADR-003 | temporal-query-extraction must be additive with a non-temporal fallthrough | Accepted | No regression for non-temporal queries, go is benchmark-gated |
| ADR-004 | Defer M-unforget-channel-disjointness until both an unforget channel and erasure exist | Accepted | Banks the provable half, full bare-key safety gated on the erasure packet |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship C3-A default-off, hold the other four | C3-A is buildable now as a flag-gated slice. The other four still carry schema, benchmark or shared-infra gates |
| Sequence on the C3-B substrate | AsKnownAt and the 4-channel matrix are unbuildable until the four-timestamp window lands (sibling phase) |
| Lineage is the canonical supersede writer | Prevents a third source-of-truth fork between lineage, causal `invalid_at` and the projection |
| Exclude retention TTL from the currentness model | Physical deletion is the category-opposite of edge-presence currentness |
| Cite leverage as structural inference only | No candidate has a measured before/after benefit number |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Item | Command | Result |
|------|---------|--------|
| Packet docs | `validate.sh --strict` on this phase | Target: PASS (0 errors, 0 warnings) |
| Wave-0 done-evidence | `git log --oneline 1ecc531431..ab5459fb6d` filtered for temporal/history/unforget | 0 Wave-0 matches. C3-A shipped later in the 028 phase at cb92f2f211 |
| Code verification | edge-presence-currentness test (3 pass), typecheck 0 at cb92f2f211 | C3-A shipped default-off, four candidates not started |

### Commands

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness --strict

git log --oneline 1ecc531431..ab5459fb6d | grep -iE "temporal|history|unforget|currentness|C3"
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- The task brief named "checklist.md for level 3". The `validate.sh --strict` gate additionally requires `decision-record.md` and `implementation-summary.md` for Level 3. Both were authored so the phase passes strict validation (the brief's overriding directive is "fix until it passes").
- `CG-temporal-query-extraction` carries a `CG-` prefix but is **Memory-home** (NO-TRANSFER cross-cut per 007 iter-014:20). It is scoped here, not double-counted to Code Graph or Deep Loop.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Only C3-A is implemented (default-off). The other four candidates are not started.
- AsKnownAt and the 4-channel unforget matrix are blocked on the C3-B four-timestamp window, owned by a sibling phase whose status must be confirmed.
- temporal-query-extraction's precision win over the existing recency boost is unmeasured.
- The C3-B four-timestamp additivity claim is unverified at source (no migration spec exists to read).
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Realized? | Note |
|------|-----------|------|
| Candidate mis-scoped as a flag flip | Avoided | C3-A reclassified to a read-side build per the broadening addendum |
| Store fork (lineage vs causal vs projection) | Mitigated for C3-A | C3-A's reconciliation keeps lineage canonical, shipped default-off behind the flag |
| temporal-query-extraction regresses non-temporal queries | Open | Mitigated by additive fallthrough design, needs the byte-check at build time |
<!-- /ANCHOR:risks-realized -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- Confirm the C3-B four-timestamp window status in the sibling phase before starting C3-C AsKnownAt.
- Implement C3-C (Current/AsOf/History), then memory_history, building on the shipped C3-A read path.
- Run a benefit micro-benchmark for temporal-query-extraction range-filter precision before promoting it to go.
- Track M-unforget-channel-disjointness against the erasure packet. Keep C3-D a pure decision note (no persisted erased-id deny-list).
- Run `generate-context.js` to regenerate `description.json` / `graph-metadata.json` and register this child under the `001-speckit-memory` parent's `children_ids`.
<!-- /ANCHOR:follow-up -->
