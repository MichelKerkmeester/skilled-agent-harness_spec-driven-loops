---
title: "Changelog: RRF Determinism Spine (Skill Advisor) [003-skill-advisor/001-rrf-determinism-spine]"
description: "Chronological changelog for the RRF Determinism Spine (Skill Advisor) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-rrf-determinism-spine` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

This pass implements the Skill Advisor RRF spine default-off. The default weighted-sum scorer remains byte-stable unless SPECKIT_ADVISOR_RRF_FUSION=true; the opt-in path imports Memory's already-shipped fuseResultsMulti, adapts scorer lanes into fixed-order RankedLists, passes advisor-specific ADVISOR_RRF_K = 8, and uses the shared RRF order plus an RRF rank map as the final post-bonus tiebreak. The graph_causal signed-score conflict suppression is preserved by splitting graph output into combined/positive/conflict matches and applying conflict mass as a post-fusion comparator demotion.

### Added

- [B] Record dormant-data reality — the re-rank is a no-op while conflicts_with is DORMANT (zero reciprocal declarations); ship the carrier seam, defer the full populated split-conflict signal (full C1) (REQ-006) [DONE/documented — carrier implemented; full C1 remains out of scope].
- The RRF import is implemented default-off; the routing-agreement baseline gate remains pending before any live/default flip.
- CHK-004 The signed-score conflict-suppression caveat is named as a requirement before implementation.
- CHK-005 Candidate seams identified before implementation.
- CHK-012 The advisor imports the shared fuseResultsMulti; it does NOT re-implement or fork RRF.
- CHK-040 No secrets introduced.

### Changed

- C3 RRF import — import fuseResultsMulti from shared/algorithms/rrf-fusion.ts; replace the weightedScore-sum in the opt-in path; pass the advisor's own smaller k via FuseMultiOptions.k (REQ-001/002) [DONE DEFAULT-OFF — SPECKIT_ADVISOR_RRF_FUSION=true, ADVISOR_RRF_K=8; default weighted path retained pending benchmark].
- graph-causal emit split — split graph-causal.ts so positive propagation feeds the RRF lane and the conflicts_with negative mass is surfaced separately (graph-causal.ts) [DONE — scoreGraphCausalLaneSplit() exposes combined/positive/conflict matches].
- Post-fusion conflict re-rank (carrier) — apply the conflicts_with demotion in the sort comparator, mirroring primaryIntentBonus, outside the lane sum, preserving explicit_author dominance (REQ-003) [DONE DEFAULT-OFF — conflict-specific index preserves negative mass for comparator adjustment].
- Author spec.md from the system-spec-kit Level-2 template (3-candidate set, per-candidate PENDING status with research-cited acceptance criteria).
- Author plan.md, tasks.md, checklist.md from the system-spec-kit Level-2 templates.
- Re-confirm against 030 section 14 that NO advisor RRF candidate shipped; record the dependency commit 65cfcea513 (the Memory-side fuseResultsMulti API extension this import consumes).

### Fixed

- C3 lane → RankedList adapter — adapt each lane's LaneMatch[] to a RankedList{source, results} (LaneMatch{skillId} → RrfItem{id}, 1:1) (fusion.ts) [DONE DEFAULT-OFF — fuseAdvisorLaneRanks() builds fixed-order ranked lists].
- C2 byte-stable tiebreak (folds into C3) — rely on RRF's fixed-order rank sum + the shared compareFusionResults order (rrf-fusion.ts:163-176) (REQ-004) [DONE DEFAULT-OFF — opt-in comparator uses the RRF rank map as final post-bonus tiebreak].
- Determinism check — confirm identical inputs produce byte-identical recommendation order across two runs (RRF fixed-order rank sum + compareFusionResults) (REQ-004); confirm a populated conflicts_with fixture is demoted via the post-fusion re-rank, not dropped (REQ-003) [DONE — rrf-determinism-spine.vitest.ts plus broad scorer suite].
- Run validate.sh --strict on this sub-phase and fix structure issues.
- CHK-022 Conflict-suppression carrier: a populated conflicts_with fixture is demoted via the post-fusion re-rank, NOT dropped.
- CHK-FIX-001 Each candidate has a final disposition.

### Verification

- Tasks complete - 16 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-011 Advisor MCP build passes.
- CHK-023 Routing-agreement baseline captured before any live flip; explicit_author stays dominant.
- No live/default flip yet. The RRF path is default-off until the routing-agreement benchmark is captured and accepted.
- No measured benefit number. Every leverage/effort rating is structural inference, never a benchmarked delta (synthesis/03 §B); the import's value is comparability + reproducibility + testability, and the live flip remains needs-benchmark.
- Conflict re-rank is a runtime no-op today. conflicts_with is dormant (zero reciprocal declarations), so the carrier changes zero routing until a skill declares a reciprocal conflict; it exists so the import does not silently drop conflict suppression when data appears.
- Downstream consumers are separate sub-phases. C1 (full split-conflict), C6, and the query-class router (QCR) are unblocked by this spine but are out of scope here.
