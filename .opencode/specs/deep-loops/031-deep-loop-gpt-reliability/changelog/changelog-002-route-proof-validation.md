---
title: "Changelog: Route-Proof Validation [031-deep-loop-issues-with-gpt-opencode/002-route-proof-validation]"
description: "Chronological changelog for the Route-Proof Validation phase."
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

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/002-route-proof-validation` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode`

### Summary

Route-proof validation now rejects schema-valid but wrong-mode dispatch records instead of passing them, closing the false-negative (F27) that blocked trustworthy GPT smoke tests.

### Added

- `decision-record.md` recording missing prior-research packets as explicit operator-asserted axioms.

### Changed

- `post-dispatch-validate.ts`: enforces exact `mode`/`target_agent`/`agent_definition_loaded`/`resolved_route` route-proof fields.
- 4 `deep_*_auto.yaml` workflow contracts (research/review/context/ai-council) now require route proof.
- 2 prompt-pack templates (research, review) instruct leaf agents to emit route proof.
- `orchestrate-topic.cjs` now emits council route proof.
- `research-prompt.md` citation corrections.

### Fixed

- Wrong-mode schema-valid artifacts previously passed the validator as valid iterations (a genuine false negative).

### Verification

- `npm test -- post-dispatch-validate.vitest.ts` — 30/30 PASS, including wrong-mode state-log/delta rejection.
- `npm run typecheck` — PASS.
- Comment hygiene — PASS.
- `verify_alignment_drift.py` — PASS.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings.
- Checklist: P0 12/12, P1 9/9, P2 1/1.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modified | Enforces route-proof fields, adds failure reasons |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` | Modified | Covers wrong-mode rejection |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | Requires research route proof |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` | Modified | Requires council route proof |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` | Modified | Emits council route proof |
| `decision-record.md` | Created | Prior-research axiom boundary |

### Follow-Ups

- Council uses round records, not iteration/delta records — route-proof fields were added but never run through `validateIterationOutputs`.
- Prior research remains unrecovered; downstream phases must not claim it was read.
