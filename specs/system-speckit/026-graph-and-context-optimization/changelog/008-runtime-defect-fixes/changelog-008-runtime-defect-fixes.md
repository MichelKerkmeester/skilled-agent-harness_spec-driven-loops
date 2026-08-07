---
title: "Runtime Defect Fixes: Codex Hooks, Doc Corrections, and an Honest Bridge Revert"
description: "Codex SessionStart/UserPromptSubmit rewired to the Codex-native adapters and the unsupported PreCompact registration removed; two doc corrections; the code-graph bridge import fix attempted, smoke-verified, and reverted as a dual-writer hazard."
trigger_phrases:
  - "008 runtime defect fixes changelog"
  - "codex hooks rewiring shipped"
  - "bridge fix reverted"
  - "026 008 shipped"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes` (Level 1)

### Summary

Four live integration defects surfaced during internal MCP-reliability research were triaged in place. Three shipped: Codex sessions now run the Codex-native `SessionStart` and `UserPromptSubmit` adapters instead of Claude's scripts (with the unsupported `PreCompact` registration removed entirely), the Codex MCP config's backwards code-graph DB-path note was corrected to match the launcher source, and the skill-advisor Gemini hook catalog now distinguishes the active implementation from the spec-kit shim. The fourth — re-pointing the code-graph plugin bridge's three dead imports — was applied, smoke-verified (exit 0, correct transport payload), and then deliberately reverted after a fresh-model review flagged that the runnable bridge initializes the memory database directly in its own process, outside the daemon's single-writer lease. A planned orphan-launcher sweep was executed as a verified no-op: all nine running launchers belonged to live sessions.

### Changed

- `.codex/hooks.json` — `SessionStart` → `hooks/codex/session-start.js`, `UserPromptSubmit` → `hooks/codex/user-prompt-submit.js`; `PreCompact` registration removed (Codex compaction unsupported per the hook contract)
- `.codex/config.toml` — code-graph DB-path note corrected: skill-local is the default, the shared path is the auto-migrated legacy location
- `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/gemini-hook.md` — implementation/shim rows corrected

### Fixed

- Codex sessions were primed through Claude-envelope hook scripts; both rewired adapters smoke-tested with sample stdin envelopes

### Reverted

- `mk-code-graph-bridge.mjs` import re-point — mechanically working but a second direct writer on the daemon-owned memory DB (the corruption class the owner lease exists to prevent); the bridge stays inert until an IPC-backed transport replaces the direct imports

### Verification

- Codex `session-start` emits a valid envelope (466-byte context); `user-prompt-submit` emits a valid fail-open envelope; `hooks.json` parses with exactly the two supported events
- Bridge working tree confirmed reverted; packet decision record carries the dual-writer reasoning
- Orphan sweep: parent-PID classification across 9 launchers — 6 live Claude sessions, 1 live OpenCode TUI; zero kills
- Packet passes `validate.sh --strict` (0 errors, 0 warnings); independent gpt-5.5 xhigh review's P0/P1 findings all remediated
