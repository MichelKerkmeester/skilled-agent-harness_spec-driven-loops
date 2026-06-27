---
title: "Changelog: Retrieval Floor Experiment [005-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment]"
description: "Chronological changelog for the Retrieval Floor Experiment phase."
trigger_phrases:
 - "phase changelog"
 - "nested changelog"
 - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. The prod path guarantees a never-cut-below-3 minimum, not a cap, then narrows the set through a cliff-conditional confidence cut that returns 3 to 20 and a token budget that is the real prod-limiting stage. This experiment raises the floor and budget across a small sweep to read whether the recovered tail is signal or noise, and it consumes the C2 gate unchanged.

### Added

- No new additions recorded.

### Changed

- Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fixed

- No fixes recorded.

### Verification

- A no-flag run uses the never-cut-below-3 minimum and the literal 3 at confidence-truncation.ts:35 is unchanged by diff - PLANNED, not yet run
- The driver reads only the prod completeRecall@3 column and refuses an eval-lens input - PLANNED, not yet run
- The driver fails closed when the env override is set but the floor did not move - PLANNED, not yet run
- The report states the threshold before the numbers and one prod-column delta per floor setting against the C2 baseline - PLANNED, not yet run
- On signal the report names the Tier-C items to re-evaluate and on noise it records the 3-floor confirmation - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts` | Planned modify | Default-off env read for DEFAULT_MIN_RESULTS and the token budget, on-disk default stays 3 |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs` | Planned create | Floor sweep driver reading only the prod-lens completeRecall@3 column against the C2 baseline |
| `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment/floor-experiment-report.md` | Planned create | Per-setting prod-column recall deltas and the one signal-or-noise verdict |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Planned reuse | Consumed unchanged through the C2 export for the prod lens and the measurability classes |

### Follow-Ups

- Build per plan.md. This phase is foundational and the dependents sequenced behind it are listed in `028-governance-rollout`.
