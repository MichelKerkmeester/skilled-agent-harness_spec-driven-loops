---
title: "Changelog: Phase 3: goal-command [002-goal-opencode-plugin/003-goal-command]"
description: "Chronological changelog for the Phase 3: goal-command phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/003-goal-command` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin`

### Summary

The passive goal feature now has a root command. /goal is a thin router that selects one plugin tool call, and the tools own session resolution, state mutation, status rendering, and the exact injection preview.

### Added

- Create .opencode/commands/goal.md.
- Add mk_goal tool with set, show, clear, complete, and pause.
- Add mk_goal_status read tool.
- Add injection_preview and state fields to tool output.
- Add command hard rules forbidding direct state edits, shell execution, and session-id inference.

### Changed

- Define root /goal argument routing rules.
- Reuse state helpers and injection renderer.
- [P] Define status and failure output envelopes.
- Verify set, status, preview, transform parity, and clear through tests.
- Verify tool-context session resolution.
- Run full plugin unit tests.

### Fixed

- No fixes recorded.

### Verification

- node --test .opencode/plugins/__tests__/*.test.cjs - PASS, 5/5 plugin test files.
- node --check .opencode/plugins/mk-goal.js - PASS.
- node --check .opencode/plugins/__tests__/mk-goal-state.test.cjs && node --check .opencode/plugins/__tests__/mk-goal-tool-path.test.cjs - PASS.
- Tasks complete - 14 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/goal.md` | Created | Adds the root /goal command router and command safety rules. |
| `.opencode/plugins/mk-goal.js` | Modified | Adds mk_goal, mk_goal_status, action execution, status lines, and failure envelopes. |
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Created | Verifies tool set/status/clear behavior and injection_preview. |
| `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` | Created | Verifies tool-context session resolution for mutation paths. |

### Follow-Ups

- Command behavior depends on plugin tools being available. The markdown router intentionally has no fallback path to read or edit goal state directly.
