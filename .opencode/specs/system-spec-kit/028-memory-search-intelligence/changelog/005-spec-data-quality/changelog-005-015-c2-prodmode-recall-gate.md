---
title: "Changelog: C2 Prod-Mode Recall Gate [005-spec-data-quality/015-c2-prodmode-recall-gate]"
description: "Chronological changelog for the C2 Prod-Mode Recall Gate phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/015-c2-prodmode-recall-gate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Added

- No new additions recorded.

### Changed

- Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fixed

- No fixes recorded.

### Verification

- A degraded scratch prod profile fails REGRESSION mode with the recall-verdict code - PLANNED, not yet run
- A measured prod completeRecall@3 rise passes PROMOTION mode and an unchanged profile does not - PLANNED, not yet run
- The gold set has no single-target query and every query carries a class tag - PLANNED, not yet run
- The gate refuses an eval-lens input - PLANNED, not yet run
- A missing baseline seeds a first baseline rather than scoring as complete - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json` | Planned create | Multi-target gold set, one relevance set per query across the measurability classes |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs` | Planned create | PROMOTION and REGRESSION gate reading only the prod-lens completeRecall@3 column |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json` | Planned create | Stored prod-column completeRecall@3 baseline with provenance |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Planned modify | Add a narrow export for the prod lens and classes, lenses unchanged |

### Follow-Ups

- Build this retrieval-class change per plan.md and keep it default-off.
- It earns a promotion only after the prod-mode completeRecall@3 benchmark in `015-c2-prodmode-recall-gate` shows a real move, because the truncation law makes eval-mode gains untransferable.
