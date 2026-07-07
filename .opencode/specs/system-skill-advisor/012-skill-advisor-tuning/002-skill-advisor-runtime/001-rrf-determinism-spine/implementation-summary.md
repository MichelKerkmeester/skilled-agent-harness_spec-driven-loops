---
title: "Implementation Summary: RRF Determinism Spine (Skill Advisor)"
description: "Implementation closeout for the advisor RRF determinism-spine sub-phase: C3 import, C2 folded deterministic order and the conflict-suppression carrier are implemented default-off behind SPECKIT_ADVISOR_RRF_FUSION. The live/default flip remains gated on routing-agreement benchmark acceptance."
trigger_phrases:
  - "implementation summary advisor rrf determinism spine"
  - "skill advisor fuseResultsMulti import closeout"
  - "advisor rrf spine pending candidates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/001-rrf-determinism-spine"
    last_updated_at: "2026-07-06T16:57:21.016Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off RRF import + deterministic rank order + conflict carrier with unit tests"
    next_safe_action: "Capture live top-1/top-3 routing-agreement benchmark before enabling RRF by default"
    blockers:
      - "Live MCP benchmark/reindex/scan was out of scope for this pass"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-rrf-determinism-spine"
      parent_session_id: null
    completion_pct: 85
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
| **Spec Folder** | system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/001-rrf-determinism-spine |
| **Authored** | 2026-06-19 |
| **Level** | 2 |
| **Scope** | Advisor RRF determinism spine: C3 (import) + C2 (folded) + conflict-suppression carrier - implemented default-off |
| **Branch** | system-speckit/027-xce-research-based-refinement |
| **Shipped via** | Commit `ce858fa165` (feat 028 build 003-skill-advisor/001-rrf-determinism-spine, touched `fusion.ts` + `graph-causal.ts` + the rrf-determinism-spine vitest). No packet 030 changes. Dependency commit `65cfcea513` remains the Memory-side `fuseResultsMulti` API extension |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This pass implements the Skill Advisor RRF spine **default-off**. The default weighted-sum scorer remains byte-stable unless `SPECKIT_ADVISOR_RRF_FUSION=true`, the opt-in path imports Memory's already-shipped `fuseResultsMulti`, adapts scorer lanes into fixed-order `RankedList`s, passes advisor-specific `ADVISOR_RRF_K = 8` and uses the shared RRF order plus an RRF rank map as the final post-bonus tiebreak. The graph_causal signed-score conflict suppression is preserved by splitting graph output into combined/positive/conflict matches and applying conflict mass as a post-fusion comparator demotion.

The live/default flip is **not accepted yet**. Packet 030 remains untouched. The required top-1/top-3 routing-agreement benchmark was explicitly out of scope for this pass and remains the gate before enabling RRF by default.

### Candidate set

| # | Candidate | Status | Gate |
|---|-----------|--------|------|
| 1 | C3 (RRF import) | **DONE DEFAULT-OFF** | needs-benchmark before live/default flip |
| 2 | C2 (byte-stable tiebreak) | **DONE DEFAULT-OFF** | folds into C3 |
| 3 | C3-RRF-advisor-import (conflict carrier) | **DONE DEFAULT-OFF** | full populated C1 remains out of scope |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation follows the authoritative 028 research and the already-authored plan. The shared `fuseResultsMulti` signature was consumed through `@spec-kit/shared/algorithms/rrf-fusion.js`, the advisor code did not fork RRF. Code changes are limited to `fusion.ts`, `graph-causal.ts` and a scorer Vitest file. Packet 030 was not modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Import, do not re-implement RRF.** The advisor consumes the shared `fuseResultsMulti` so a second RRF cannot drift from Memory's, the lane → `RankedList` adapter is 1:1 (`LaneMatch{skillId}` → `RrfItem{id}`, `001` iter-2 F17).
- **C2 folds into C3.** The byte-stable order (`1/(k+rank)` over fixed lane order + `compareFusionResults`) is C3's mechanism, not an independent candidate - they ship as one change (`003` iter-2/4).
- **Conflict suppression goes through a post-fusion re-rank, not RRF.** `fuseResultsMulti` elides negative/zero-weight lanes, so the `conflicts_with = -0.35` mass is applied in the sort comparator (mirroring `primaryIntentBonus`), positive propagation only feeding RRF (`001` iter-2 F16, `003` iter-6 F6-02).
- **Ship default-off, defer the live flip.** Because the import changes fused ordering, the RRF path is opt-in until top-1/top-3 routing agreement and `explicit_author` dominance are measured.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Typecheck**: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` → 0 errors.
- **Narrow Vitest**: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- tests/scorer/rrf-determinism-spine.vitest.ts` → 1 file, 4 passed.
- **Broad related Vitest**: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- tests/scorer stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts stress_test/skill-advisor/scorer-fusion-stress.vitest.ts stress_test/skill-advisor/scorer-extras-stress.vitest.ts` → 11 files, 72 passed, 2 skipped.
- **LEFT-PENDING**: live routing-agreement benchmark and `npm run build` were not run in this pass, the user-requested canonical gate was typecheck + broad Vitest.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No live/default flip yet.** The RRF path is default-off until the routing-agreement benchmark is captured and accepted.
- **No measured benefit number.** Every leverage/effort rating is structural inference, never a benchmarked delta (`synthesis/03` §B), the import's value is comparability + reproducibility + testability and the live flip remains needs-benchmark.
- **Conflict re-rank is a runtime no-op today.** `conflicts_with` is dormant (zero reciprocal declarations), so the carrier changes zero routing until a skill declares a reciprocal conflict, it exists so the import does not silently drop conflict suppression when data appears.
- **Downstream consumers are separate sub-phases.** C1 (full split-conflict), C6 and the query-class router (QCR) are unblocked by this spine but are out of scope here.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md` (section 13 candidate status).
- **Plan**: `plan.md`.
- **Tasks**: `tasks.md`.
- **Checklist**: `checklist.md`.
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03`, deltas `iter-002.jsonl` / `iter-006.jsonl` / `iter-010.jsonl`.
- **Shipped record (historical evidence)**: Wave-0 record (dependency commit `65cfcea513`).
