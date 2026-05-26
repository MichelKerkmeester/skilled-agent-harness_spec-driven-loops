---
title: "Hook Parity Phase 003: Codex CLI native hook parity"
description: "Codex now receives the same dynamic context surfaces that Claude already had. SessionStart injects startup repository context and UserPromptSubmit injects the skill advisor brief through Codex-native hookSpecificOutput.additionalContext."
trigger_phrases:
  - "phase 009/003 changelog"
  - "codex hook parity"
  - "codex sessionstart hook"
  - "codex userpromptsubmit hook"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `026-graph-and-context-optimization/007-hook-parity/003-codex-native-startup-advisor-hooks` (Level 3)
> Parent packet: `026-graph-and-context-optimization/007-hook-parity`

### Summary

Codex CLI sessions previously returned no startup context and no advisor brief. This phase implemented Outcome A (full native hook parity) because Codex natively supports the hook transport through `hookSpecificOutput.additionalContext`. The new Codex hook adapters parse JSON stdin, emit JSON stdout, and fail open with `{}` on errors. Live config preserves existing Superset notification entries alongside the new Spec Kit commands.

### Added

- `hooks/codex/session-start.ts` (NEW) emits startup repository context (file count, node count, edge count, freshness) through Codex `hookSpecificOutput.additionalContext` on `SessionStart`. Accepts `startup`, `resume`, and `clear` sources.
- `hooks/codex/user-prompt-submit.ts` (NEW) emits the skill advisor brief through Codex `hookSpecificOutput.additionalContext` on `UserPromptSubmit`. Reports stale status when the skill graph is stale, without blocking the turn.
- `tests/codex-session-start-hook.vitest.ts` (NEW) and `tests/codex-user-prompt-submit-hook.vitest.ts` (NEW) parity tests.
- `~/.codex/hooks.json` entries appended alongside existing Superset `notify.sh` commands. `~/.codex/config.toml` enables `codex_hooks = true`.
- cli-codex `SKILL.md` and `README.md` document native hooks, troubleshooting, and the hook contract reference.

### Changed

- Codex hook stdout uses `hookSpecificOutput.additionalContext` (the explicit Codex hook output contract) instead of plain stdout parsing.
- The Superset `notify.sh` entries in `~/.codex/hooks.json` remain untouched. Spec Kit commands are appended, not replacing.
- Documentation stale-string sweep removed old "Codex hookless" and `hookPolicy=unavailable` wording from playbooks, catalog, and readme surfaces.

### Fixed

- Codex sessions now receive startup repository context at `SessionStart` and the advisor brief at `UserPromptSubmit`. Previously both were absent.
- Hook fail-open behavior verified: invalid or empty stdin returns `{}` and exits 0.

### Verification

- `npm run build`: PASS
- Focused vitest (3 files, 22 tests): PASS
- Live hooks JSON parse and config flag check: PASS
- Direct SessionStart smoke: PASS (emitted startup context in 42.22ms)
- Direct UserPromptSubmit smoke: PASS (emitted advisor brief in 71ms)
- Real Codex feature flag: PASS (`codex_hooks` reports true)
- Fresh real Codex smoke: PASS (returned `HOOK_SMOKE_OK` with 28,265 input tokens)
- Independent re-verification: PASS (fresh agent reproduced all checks)
- User-driven Codex session smoke: PASS (advisor brief surfaced for triggering prompts)
- Strict spec validation: PASS (0 errors, 0 warnings)

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` (NEW) | SessionStart adapter parsing Codex JSON stdin and emitting context. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` (NEW) | UserPromptSubmit adapter emitting advisor brief. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts` (NEW) | Codex SessionStart parity tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` (NEW) | Codex UserPromptSubmit parity tests. |
| `.opencode/skills/cli-codex/SKILL.md` and `README.md` | Document native hooks, troubleshooting, and contract reference. |

### Follow-Ups

- Codex hooks are still under development (`codex features list` reports `codex_hooks` as under development). Future releases may require contract re-verification.
- A downstream routing asymmetry was discovered in the skill catalog (not the hook layer). `sk-improve-prompt` was patched in a separate change.