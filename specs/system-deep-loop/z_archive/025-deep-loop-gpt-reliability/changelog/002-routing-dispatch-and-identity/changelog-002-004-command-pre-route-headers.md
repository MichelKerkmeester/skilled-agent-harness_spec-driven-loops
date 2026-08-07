---
title: "Changelog: Command Pre-Route Headers [031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/004-command-pre-route-headers]"
description: "Chronological changelog for the Command Pre-Route Headers phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/004-command-pre-route-headers` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Added additive "Resolved route" headers before body prose in research/review/context/ai-council prompt packs, command YAMLs, and council scripts, so route identity is explicit before a leaf agent interprets instructions.

### Added

- No new files — all edits are additive to existing prompt/command/script surfaces.

### Changed

- `prompt_pack_iteration.md.tmpl` (research, review) — resolved-route header added before body prose.
- `deep_research_auto.yaml`, `deep_review_auto.yaml`, `deep_context_auto.yaml` — route header wiring.
- `prompt_pack_round.md` (ai-council) — route header before role prose.
- `deep_ai-council_auto.yaml` — route header wiring.
- `orchestrate-session.cjs`, `orchestrate-topic.cjs` — route-config propagation into seat dispatch.
- 2 vitest files updated for coverage.

### Fixed

- Reduces GPT's route-inference burden by placing route identity ahead of body prose (targets findings F13/F14/F15/F28-F30).

### Verification

- Focused council vitest — 2 files / 8 tests, PASS.
- `node --check` syntax check — PASS.
- `npm run typecheck` — PASS.
- Route-header static check — PASS.
- Comment hygiene — PASS.
- Alignment-drift — PASS.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings.
- Checklist: P0 15/15, P1 10/10, P2 1/1.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.../deep-research/assets/prompt_pack_iteration.md.tmpl` | Modified | Research route header |
| `.../deep-review/assets/prompt_pack_iteration.md.tmpl` | Modified | Review route header |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modified | Context header (per-seat + one-shot) |
| `.../deep-ai-council/assets/prompt_pack_round.md` | Modified | Council route header before role prose |
| `.../deep-ai-council/scripts/orchestrate-topic.cjs` | Modified | Route config into seat dispatch |
| `.../deep-ai-council/scripts/orchestrate-session.cjs` | Modified | Default route config propagation |

### Follow-Ups

- Prompt-contract hardening only, not host hard identity.
- GPT smoke acceptance testing owned by the next phase (005).
- Route headers (`@ai-council`) intentionally differ in format from phase 002's route-proof state fields.
