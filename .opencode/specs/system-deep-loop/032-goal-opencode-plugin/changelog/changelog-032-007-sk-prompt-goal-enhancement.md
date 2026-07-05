---
title: "Changelog: Phase 7: sk-prompt-goal-enhancement [032-goal-opencode-plugin/007-sk-prompt-goal-enhancement]"
description: "Chronological changelog for the Phase 7 sk-prompt goal prompt enhancement."
trigger_phrases:
  - "phase changelog"
  - "goal prompt enhancement"
  - "sk-prompt goal"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-30

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`

### Summary

The goal plugin now turns raw `/goal set` input into a deterministic sk-prompt-style `goalPrompt` under 4000 characters. The raw objective remains available for status and auditability, while injection uses the enhanced prompt to steer the model with role, method, success criteria and stop conditions.

### Added

- Added deterministic goal prompt generation helpers to `mk-goal.js`.
- Added `goalPrompt` and `promptEnhancement` fields to stored goal records.
- Added prompt metadata status lines for framework, methodology, CLEAR score and character budget.
- Added tests for prompt generation, metadata, hard cap and injection behavior.

### Changed

- `renderGoalInjection` now injects `goal_prompt:` instead of relying only on the raw objective line.
- `renderContinuationPrompt` now carries the enhanced goal prompt into active continuation prompts.
- State normalization now backfills prompt fields for older goal records.
- Parent phase map now tracks phase 7.

### Fixed

- Raw objective text can no longer be the only model-facing guidance for vague goals.

### Verification

- `node .opencode/plugins/tests/mk-goal-state.test.cjs` - PASS.
- `node .opencode/plugins/tests/mk-goal-tool-path.test.cjs` - PASS.
- `node .opencode/plugins/tests/mk-goal-export-contract.test.cjs` - PASS.
- `node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` - PASS.
- `node .opencode/plugins/tests/mk-goal-supervisor.test.cjs` - PASS.
- `node .opencode/plugins/tests/mk-goal-continuation.test.cjs` - PASS.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins` - PASS.
- `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js` - PASS.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/032-goal-opencode-plugin --strict` - PASS.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | Adds prompt generation, prompt metadata, prompt-aware injection and compatibility normalization. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modified | Verifies prompt generation, hard cap, metadata, injection and adversarial sanitization. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modified | Verifies tool-context persistence and status output for enhanced prompts. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/` | Created | Documents phase scope, plan, tasks and implementation summary. |

### Follow-Ups

- Restart OpenCode before relying on the updated auto-loaded plugin in a new session.
