---
title: "Changelog: Deep-Loop Router Deprecation [031-deep-loop-gpt-reliability/007-compiled-contract-compiler/002-deep-loop-router-deprecation]"
description: "Chronological changelog for the deep-loop router deprecation child of the compiled-contract compiler track."
trigger_phrases:
  - "phase changelog"
  - "deep-loop router deprecation changelog"
  - "compiled contract router changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/002-deep-loop-router-deprecation` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Deprecated the dead `deep-loop` primary router agent after compiled command contracts and direct `/deep:*` leaf dispatch made the router hop vestigial. The phase deleted the runtime mirror agent files and reworded orchestrate's boundary lines to preserve direct leaf dispatch without naming a removed agent.

### Added

- No new behavior added. This was a deletion and boundary-wording phase.

### Changed

- Reworded orchestrate guidance in all three runtime mirrors to say `/deep:*` leaves are resolved directly from the priority table and dispatched at depth 1.

### Fixed

- Removed a dead primary-agent surface that no live dispatcher targeted and that could mislead users into invoking an obsolete router manually.

### Verification

- Pre-delete live-dispatch sweep found no live router dispatcher.
- `.opencode` and `.claude` agent basenames matched after deletion.
- `check-agent-mirror-sync.cjs` reported `2 agent(s) checked - all mirrors in sync - OK`.
- Post-change reference sweep found the router dereferenced outside historical spec artifacts.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/agents/deep-loop.md` | Deleted | Removed tracked OpenCode router mirror |
| `.claude/agents/deep-loop.md` | Deleted | Removed tracked Claude router mirror |
| `.codex/agents/deep-loop.md` | Deleted | Removed untracked local runtime mirror |
| `.opencode/agents/orchestrate.md` | Modified | Generalized boundary wording |
| `.claude/agents/orchestrate.md` | Modified | Generalized boundary wording |
| `.codex/agents/orchestrate.md` | Modified | Generalized boundary wording |

### Follow-Ups

- Historical spec artifacts still name the router as point-in-time records and were intentionally left alone.
- The broader 14-agent pointer rewrite and AGENTS.md thinning remain separate follow-ups.
