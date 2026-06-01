---
title: "Hook Parity Phase 006: Copilot wrapper schema fix"
description: "Eliminated the 'Neither bash nor powershell' error that Copilot CLI threw on every user prompt by adding top-level Copilot-safe fields to the Claude-style matcher wrappers in .claude/settings.local.json."
trigger_phrases:
  - "phase 009/006 changelog"
  - "copilot wrapper schema fix"
  - "copilot neither bash nor powershell"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `026-graph-and-context-optimization/007-hook-parity/006-copilot-wrapper-schema-fix` (Level 1)
> Parent packet: `026-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

Copilot CLI 1.0.34 (and earlier versions back to 1.0.14) logged `Neither 'bash' nor 'powershell' specified in hook command configuration` on every user prompt. Root cause: Copilot merges hook configs from both `.github/hooks/*.json` and `.claude/settings.local.json`. The Claude-style matcher wrappers in `settings.local.json` lacked top-level `bash`/`powershell` fields. Copilot's executor `g2()` threw because the outer wrapper had no shell alias. This blocked per-prompt refresh of the managed `SPEC-KIT-COPILOT-CONTEXT` block because the `userPromptSubmitted` hook crashed before the writer could run.

### Added

- Top-level Copilot-safe fields (`type: "command"`, `bash: "true"`, `timeoutSec: 3`) on the `PreCompact` and `Stop` matcher wrappers (defensive insurance).
- Top-level writer-command fields on `UserPromptSubmit` and `SessionStart` wrappers (pointing to Copilot writer dist entrypoints with `timeoutSec: 5`).

### Changed

- `.claude/settings.local.json`: all four event blocks (`UserPromptSubmit`, `SessionStart`, `PreCompact`, `Stop`) now carry top-level Copilot-safe fields alongside the nested Claude `hooks[0].command` entries. Claude Code executes only the nested command. Copilot executes the top-level `bash` field.

### Fixed

- Copilot no longer throws `Neither 'bash' nor 'powershell'` on `userPromptSubmitted` events. The error had existed since Copilot 1.0.14.
- The `sessionStart` event escaped the crash because it filters entries by `type === "command"` before `g2()`, but `userPromptSubmitted` did not. Both are now safe.

### Verification

- `python3 -m json.tool .claude/settings.local.json`: PASS (valid JSON)
- `jq` queries confirmed top-level `type/bash/timeoutSec` present on all four wrappers
- `git log --oneline` shows the patch landed in `162a6cb16c`, was reverted in `6cd00aa51b`, then reapplied

### Files Changed

| File | What changed |
|------|--------------|
| `.claude/settings.local.json` | Added top-level `type`/`bash`/`timeoutSec` fields to all four matcher wrappers. `UserPromptSubmit` and `SessionStart` carry actual Copilot writer commands; `PreCompact` and `Stop` carry defensive `bash: "true"`. |

### Follow-Ups

- Phase 007 (`copilot-writer-wiring`) replaces the no-op `bash: "true"` on `UserPromptSubmit` and `SessionStart` with the actual Copilot writer invocations so the managed block refreshes per-prompt.
