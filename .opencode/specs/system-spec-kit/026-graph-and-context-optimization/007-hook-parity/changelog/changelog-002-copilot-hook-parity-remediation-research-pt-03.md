---
title: "Hook Parity Phase 002 Research Pt-03: Copilot wrapper schema crash root cause"
description: "Research-only phase. An 8-iteration deep research investigation traced the 'Neither bash nor powershell' Copilot crash to .claude/settings.local.json matching CoPilot merging hooks from both sources, producing a wrapper object that lacked top-level shell alias fields."
trigger_phrases:
  - "phase 009/002 research pt-03 changelog"
  - "copilot schema crash research"
  - "copilot neither bash nor powershell"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `026-graph-and-context-optimization/007-hook-parity/002-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03` (Level 2)
> Parent packet: `026-graph-and-context-optimization/007-hook-parity/002-copilot-hook-parity-remediation`

### Summary

An 8-iteration deep research session converged on the root cause of the `Neither 'bash' nor 'powershell' specified in hook command configuration` error that Copilot CLI 1.0.34 threw on every user prompt. The crash was traced to Copilot merging hook configs from both `.github/hooks/*.json` and `.claude/settings.local.json`. The Claude-style matcher wrappers had no top-level `bash` or `powershell` field, and Copilot's executor `g2()` threw when processing those wrappers. The `sessionStart` event escaped because it filters by `type === "command"` before `g2()`, but `userPromptSubmitted` does not. The error had existed since Copilot 1.0.14 and was not a 1.0.34 regression.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

- Research report at `002-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/research.md` (8 iterations, converged at iter-8).
- Findings directly produced the patch specification for phase 006 (`copilot-wrapper-schema-fix`).
- Also identified the secondary writer-wiring gap (Superset wrapper clobbers per-prompt refresh), addressed in phase 007 (`copilot-writer-wiring`).

### Files Changed

Research-only phase. No production code or documentation files changed.