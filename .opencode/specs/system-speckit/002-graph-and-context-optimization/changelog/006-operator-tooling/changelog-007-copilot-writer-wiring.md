---
title: "Hook Parity Phase 007: Copilot writer wiring"
description: "Routed Copilot userPromptSubmitted and sessionStart hooks to the system-spec-kit Copilot writers by replacing bash true no-ops in .claude/settings.local.json with actual writer commands. The managed copilot-instructions block Refreshed timestamp now advances per-prompt."
trigger_phrases:
  - "phase 009/007 changelog"
  - "copilot writer wiring"
  - "copilot refreshed timestamp"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity` (Level 1)
> Parent packet: `002-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

After phase 006 fixed the Copilot schema crash, the `userPromptSubmitted` hook still did not refresh the managed `SPEC-KIT-COPILOT-CONTEXT` block in `$HOME/.copilot/copilot-instructions.md`. The Superset wrapper at `~/.superset/bin/copilot` rewrites `.github/hooks/superset-notify.json` on every launch to point `userPromptSubmitted` at `~/.superset/hooks/copilot-hook.sh`, which only posts Superset notifications and never invokes the system-spec-kit writer. This phase replaced the no-op `bash: "true"` on the `UserPromptSubmit` and `SessionStart` matcher wrappers with the actual Copilot writer commands, routing through `.claude/settings.local.json` (which Copilot also merges).

### Added

- Top-level `bash` writer commands on `UserPromptSubmit` (pointing to `dist/hooks/copilot/user-prompt-submit.js`) and `SessionStart` (pointing to `dist/hooks/copilot/session-prime.js`) in `.claude/settings.local.json`.
- `timeoutSec: 5` on both writer wrappers (matching `.github/hooks/superset-notify.json` precedent).

### Changed

- `.claude/settings.local.json` `UserPromptSubmit[0]` now has the Copilot writer invocation as its top-level `bash` field (previously `bash: "true"`).
- `.claude/settings.local.json` `SessionStart[0]` now has the Copilot session-prime invocation as its top-level `bash` field (previously `bash: "true"`).
- `Stop` and `PreCompact` retain their defensive `bash: "true"` wrappers (no corresponding Copilot writers needed).

### Fixed

- The `Refreshed:` timestamp in `$HOME/.copilot/copilot-instructions.md` now advances per-prompt under Copilot. Previously it was frozen at whatever last wrote the file (typically a past sessionStart).
- The `Source:` line in the managed block now reads `system-spec-kit copilot userPromptSubmitted hook` after a user prompt (not just sessionStart).
- No new `Neither 'bash' nor 'powershell'` errors in Copilot logs (phase 006 condition still holds).

### Verification

- `git show 162a6cb16c -- .claude/settings.local.json`: PASS (shows writer commands landing)
- `git show 6cd00aa51b -- .claude/settings.local.json`: PASS (shows removal, then reapply)
- `jq` queries confirm current file restores top-level writer commands on both `UserPromptSubmit` and `SessionStart`
- Standalone writer probe (historical from 2026-04-22): PASS

### Files Changed

| File | What changed |
|------|--------------|
| `.claude/settings.local.json` | `UserPromptSubmit` and `SessionStart` top-level `bash` fields changed from `"true"` to the actual Copilot writer command paths. `timeoutSec` set to 5 on both. |

### Follow-Ups

- Cross-runtime smoke matrix should be re-run now that both phases 006 and 007 are live.
