---
title: "Implementation Summary: RRF Determinism Spine (Skill Advisor)"
description: "Planning closeout for the advisor RRF determinism-spine sub-phase: the 3-candidate set (C3 import, C2 folded, conflict-suppression carrier) is fully specified and all PENDING — nothing shipped in Wave-0/030. Records the shared fuseResultsMulti dependency (commit 65cfcea513), the signed-score conflict caveat, the dormant-conflict-data reality, and the needs-benchmark live-flip gate."
trigger_phrases:
  - "implementation summary advisor rrf determinism spine"
  - "skill advisor fuseResultsMulti import closeout"
  - "advisor rrf spine pending candidates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-rrf-determinism-spine"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning closeout: 3 PENDING candidates fully specified; dependency + caveats recorded"
    next_safe_action: "Implement T001 baseline then T002-T006 RRF import + carrier"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-rrf-determinism-spine"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-rrf-determinism-spine |
| **Authored** | 2026-06-19 |
| **Level** | 2 |
| **Scope** | Advisor RRF determinism spine: C3 (import) + C2 (folded) + conflict-suppression carrier — all PENDING |
| **Branch** | system-speckit/027-xce-research-based-refinement |
| **Shipped via** | None yet — no advisor candidate shipped in Wave-0/030; dependency commit `65cfcea513` (Memory-side `fuseResultsMulti` API extension) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is a **planning closeout** (a re-plan), not a code-delivery summary. The sub-phase specifies the single highest-leverage foundational change to the Skill Advisor fusion scorer: replace the raw-score weighted SUM (which mixes a hint-inflated lexical overlap, a `[0.2,1]` cosine, and a signed `[-1,1]` graph propagation on one incomparable axis, `fusion.ts:366,372`) with rank-based deterministic RRF by importing Memory's already-shipped `fuseResultsMulti`, the advisor passing its own smaller `k`. The byte-stable tiebreak (C2) is C3's mechanism and folds in. The graph_causal signed-score conflict suppression is preserved via a post-fusion re-rank, because `fuseResultsMulti` is positive-only and elides negative/zero-weight lanes.

**Nothing in this sub-phase has shipped.** Packet 030 (the flat Wave-0 record) shipped only the Memory-side `fuseResultsMulti` API extension (`bonusOverChannels`, commit `65cfcea513`) that this import *consumes*; no advisor RRF candidate is in 030 section 14. All three candidates are PENDING with explicit gates.

### Candidate set (all PENDING)

| # | Candidate | Status | Gate |
|---|-----------|--------|------|
| 1 | C3 (RRF import) | **PENDING** | needs-benchmark — capture a top-1/top-3 routing-agreement baseline before any live flip (the import changes fused ordering; `synthesis/03` §B) |
| 2 | C2 (byte-stable tiebreak) | **PENDING** | folds into C3 — RRF's fixed-order rank sum + `compareFusionResults` IS the mechanism; not a separate change |
| 3 | C3-RRF-advisor-import (conflict carrier) | **PENDING** | carrier ships, full C1 deferred — `conflicts_with` is DORMANT (zero reciprocal declarations, `003` iter-10 O10-01); ship the post-fusion re-rank seam so the import is conflict-safe |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The re-plan was authored from the authoritative 028 research: the advisor `research/research.md` (Internal Baseline + Candidate Catalog), the parent `research/roadmap.md` (BROADENING + 027-REVISIT addenda), `synthesis/01-go-candidates.md` + `03`, and the per-iteration deltas (`iter-002.jsonl` F14/F16/F17/F18 + C1/C2/C3; `iter-006.jsonl` F6-01/F6-02 + the C1-rerank reframe + O6-01; `iter-010.jsonl` O10-01 dormant `conflicts_with`). The shared `fuseResultsMulti` signature and its `bonusOverChannels` extension were read directly from `shared/algorithms/rrf-fusion.ts` and the dependency commit `65cfcea513` to confirm the import shape (`RrfItem`, `RankedList`, `FuseMultiOptions.k`, `compareFusionResults`). Packet 030 section 14 was read to confirm NO advisor candidate shipped. The Level-2 doc set (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this summary) was written from the system-spec-kit templates and validated with `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Import, do not re-implement RRF.** The advisor consumes the shared `fuseResultsMulti` so a second RRF cannot drift from Memory's; the lane → `RankedList` adapter is 1:1 (`LaneMatch{skillId}` → `RrfItem{id}`, `001` iter-2 F17).
- **C2 folds into C3.** The byte-stable order (`1/(k+rank)` over fixed lane order + `compareFusionResults`) is C3's mechanism, not an independent candidate — they ship as one change (`003` iter-2/4).
- **Conflict suppression goes through a post-fusion re-rank, not RRF.** `fuseResultsMulti` elides negative/zero-weight lanes, so the `conflicts_with = -0.35` mass is applied in the sort comparator (mirroring `primaryIntentBonus`), positive propagation only feeding RRF (`001` iter-2 F16; `003` iter-6 F6-02).
- **Ship the carrier, defer the full C1.** Because `conflicts_with` is dormant in production, this sub-phase ships only the re-rank seam (so the import is conflict-safe); the populated split-conflict signal is out of scope and NOT prioritized above C4 (`003` iter-10 O10-01).
- **Gate the live flip on a benchmark.** The import changes the fused ordering (it is NOT byte-identical-by-default like the Memory tiebreaks), so a routing-agreement baseline is captured first; `explicit_author` stays dominant.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Planning/documentation**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and this summary authored from the templates; `validate.sh --strict` run on this sub-phase (structure/anchors/frontmatter/required-files).
- **Dependency confirmed**: the shared `fuseResultsMulti` API extension is shipped (`030` §14 cand 5, `65cfcea513`) and shape-compatible for the advisor (`001` iter-2 F17/F18).
- **Implementation/test verification is PENDING** (this sub-phase ships no code): the advisor typecheck/build, the fusion-mechanism + determinism + conflict-suppression Vitest, and the routing-agreement baseline gate (CHK-010..013, CHK-020..023) are verified at implementation time.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No code shipped.** All three candidates are PENDING; this is a re-plan, so the impl-summary documents the planned change and its gates, not delivered commits.
- **No measured benefit number.** Every leverage/effort rating is structural inference, never a benchmarked delta (`synthesis/03` §B); the import's value is comparability + reproducibility + testability, and the live flip is needs-benchmark.
- **Conflict re-rank is a runtime no-op today.** `conflicts_with` is dormant (zero reciprocal declarations), so the carrier changes zero routing until a skill declares a reciprocal conflict; it exists so the import does not silently drop conflict suppression when data appears.
- **Downstream consumers are separate sub-phases.** C1 (full split-conflict), C6, and the query-class router (QCR) are unblocked by this spine but are out of scope here.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md` (section 13 candidate status).
- **Plan**: `plan.md`.
- **Tasks**: `tasks.md`.
- **Checklist**: `checklist.md`.
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03`; deltas `iter-002.jsonl` / `iter-006.jsonl` / `iter-010.jsonl`.
- **Shipped record (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 (dependency commit `65cfcea513`).
