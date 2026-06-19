---
title: "Implementation Summary: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)"
description: "Re-plan implementation summary for the five PENDING temporal candidates (C3-A, C3-C, memory_history, CG-temporal-query-extraction, M-unforget-channel-disjointness). No code shipped yet; this records the planning artifacts, the per-candidate gates, and the Wave-0 done-evidence cross-check that confirms none shipped."
trigger_phrases:
  - "implementation summary edge presence currentness"
  - "temporal recall replan summary"
  - "pending temporal candidates status"
  - "028 001 008 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness"
    last_updated_at: "2026-06-19T06:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored re-plan docs for five pending temporal candidates"
    next_safe_action: "Confirm C3-B substrate in the sibling phase, then start C3-A read-side wiring"
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
    completion_pct: 0
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
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness |
| **Status** | Planned (re-plan) — implementation pending |
| **Level** | 3 |
| **Scope** | Five PENDING temporal candidates |
| **Branch** | system-speckit/027-xce-research-based-refinement |
| **HEAD** | not yet implemented; no candidate commits in this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is a **re-plan**: no production code has been shipped in this phase. The deliverable is the Level-3 planning set (spec, plan, tasks, checklist, decision-record) that converts the 028 research roadmap into a sequenced, gate-aware implementation plan for the five edge-presence-currentness candidates.

All five candidates are **PENDING**. This was confirmed by cross-checking the Wave-0 shipped record and the Wave-0 commit range (`git log --oneline 1ecc531431..ab5459fb6d` = 10 commits, **zero** matching temporal / history / unforget / currentness).

### Pending Candidates

| # | Candidate | Status | Gate | 030 evidence |
|---|-----------|--------|------|--------------|
| 1 | C3-A edge-presence currentness | PENDING | schema (C3-B) + shared-infra (lineage↔causal reconciliation) | not in 030 §14; 0 commits in range |
| 2 | C3-C TemporalMode | PENDING | schema (AsKnownAt needs C3-B); Current/AsOf/History buildable now | not in 030 §14 |
| 3 | memory_history as-of tool | PENDING | shared-infra (C3-A read path for currentness-correct chains) | not in 030 §14 |
| 4 | CG-temporal-query-extraction | PENDING | needs-benchmark (range-filter precision) | not in 030 §14 |
| 5 | M-unforget-channel-disjointness | PENDING | needs-benchmark + shared-infra (needs both unforget channel AND erasure) | not in 030 §14 |

**Pending: 5. Done: 0.**
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning set was authored from the authoritative 028 research: the cross-cutting `research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda), the `research/synthesis/01-go-candidates.md` + `03-corrections-caveats-and-residuals.md`, the phase-local `001-speckit-memory/research/research.md`, and the per-candidate iteration/delta evidence (001 iters 012/016/027/037/038; 005-revisit Q9; 007 iters 008/013/014). Each candidate's seam, `[CONFIRMED]`/`[INFERRED]` evidence, effort/leverage, and roadmap corrections were pulled forward into the spec scope table and the decision record.

Implementation has not started. The `description.json` and `graph-metadata.json` are left for a separate `generate-context.js` regeneration; this re-plan authored spec docs only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Treat C3-A as a read-side build, not a flag flip | Accepted | `SPECKIT_TEMPORAL_EDGES` already ON; needs read-side filter + store reconciliation |
| ADR-002 | C3-C Current reads alongside `active_memory_projection` | Accepted | M effort, byte-identical Current; AsKnownAt gated on C3-B |
| ADR-003 | temporal-query-extraction must be additive with a non-temporal fallthrough | Accepted | No regression for non-temporal queries; go is benchmark-gated |
| ADR-004 | Defer M-unforget-channel-disjointness until both an unforget channel and erasure exist | Accepted | Banks the provable half; full bare-key safety gated on the erasure packet |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep all five candidates PENDING | Cross-check proves none shipped in Wave-0; each carries a schema / benchmark / shared-infra gate |
| Sequence on the C3-B substrate | AsKnownAt and the 4-channel matrix are unbuildable until the four-timestamp window lands (sibling phase) |
| Lineage is the canonical supersede writer | Prevents a third source-of-truth fork between lineage, causal `invalid_at`, and the projection |
| Exclude retention TTL from the currentness model | Physical deletion is the category-opposite of edge-presence currentness |
| Cite leverage as structural inference only | No candidate has a measured before/after benefit number |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Item | Command | Result |
|------|---------|--------|
| Packet docs | `validate.sh --strict` on this phase | Target: PASS (0 errors, 0 warnings) |
| Wave-0 done-evidence | `git log --oneline 1ecc531431..ab5459fb6d` filtered for temporal/history/unforget | 0 matches → all five candidates PENDING |
| Code verification | n/a | No code shipped in this re-plan phase |

### Commands

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness --strict

git log --oneline 1ecc531431..ab5459fb6d | grep -iE "temporal|history|unforget|currentness|C3"
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- The task brief named "checklist.md for level 3"; `validate.sh --strict` additionally requires `decision-record.md` and `implementation-summary.md` for Level 3. Both were authored so the phase passes strict validation (the brief's overriding directive is "fix until it passes").
- `CG-temporal-query-extraction` carries a `CG-` prefix but is **Memory-home** (NO-TRANSFER cross-cut per 007 iter-014:20); it is scoped here, not double-counted to Code Graph or Deep Loop.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- No candidate is implemented; this phase is planning only.
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
| Store fork (lineage vs causal vs projection) | Open | Mitigated in plan via lineage-canonical invariant; not yet built |
| temporal-query-extraction regresses non-temporal queries | Open | Mitigated by additive fallthrough design; needs the byte-check at build time |
<!-- /ANCHOR:risks-realized -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- Confirm the C3-B four-timestamp window status in the sibling phase before starting C3-A.
- Implement C3-A (read-side `getValidEdges` filter + lineage↔causal store reconciliation), then C3-C (Current/AsOf/History), then memory_history.
- Run a benefit micro-benchmark for temporal-query-extraction range-filter precision before promoting it to go.
- Track M-unforget-channel-disjointness against the erasure packet; keep C3-D a pure decision note (no persisted erased-id deny-list).
- Run `generate-context.js` to regenerate `description.json` / `graph-metadata.json` and register this child under the `001-speckit-memory` parent's `children_ids`.
<!-- /ANCHOR:follow-up -->
