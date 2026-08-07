---
title: "Codex CLI Native Hook Parity: SessionStart and UserPromptSubmit Adapters"
description: "Codex CLI lacked the two context payloads Claude Code received at session start and per-prompt. This phase implemented native Codex hook adapters for SessionStart and UserPromptSubmit, wired them into the live user config, added 22 parity tests and verified parity against Codex 0.122.0."
trigger_phrases:
  - "codex hook parity"
  - "codex sessionstart hook"
  - "codex userpromptsubmit hook"
  - "codex startup context injection"
  - "codex advisor brief hook"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/003-codex-native-startup-advisor-hooks` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

Codex CLI sessions did not receive the startup repository context or skill advisor brief that Claude Code sessions received. The root cause was confirmed: Codex natively supports the hook transport via `~/.codex/hooks.json`, but no Spec Kit Memory hook command was registered. Only the Superset `notify.sh` notification script was wired.

This phase ported the Claude reference implementation to a new `hooks/codex/` adapter surface. `SessionStart` now injects startup repository context. `UserPromptSubmit` now injects the compact skill advisor brief through Codex-native `hookSpecificOutput.additionalContext`. Both adapters fail open with `{}` so Codex sessions continue if advisor retrieval fails. Live config was backed up before editing. The Superset notify entries were preserved exactly. A 22-test vitest suite covers both adapters and the existing Claude adapter. Direct smoke runs on Codex 0.122.0 confirmed `HOOK_SMOKE_OK` with a 28,265-token startup payload within 42ms for SessionStart and 71ms for UserPromptSubmit.

### Added

- `hooks/codex/session-start.ts`: Codex SessionStart adapter that parses Codex JSON stdin and emits startup repository context via `hookSpecificOutput.additionalContext`
- `hooks/codex/user-prompt-submit.ts`: Codex UserPromptSubmit adapter that emits the compact skill advisor brief with fail-open `{}` on error
- `tests/codex-session-start-hook.vitest.ts`: vitest suite for the SessionStart adapter
- `tests/codex-user-prompt-submit-hook.vitest.ts`: vitest suite for the UserPromptSubmit adapter
- `decision-record.md` (ADR-003) capturing the hook contract investigation findings and the accepted implementation path

### Changed

- `~/.codex/hooks.json`: Spec Kit Memory hook commands appended alongside the existing Superset notify entries for `SessionStart` and `UserPromptSubmit` events
- `~/.codex/config.toml`: `codex_hooks = true` enabled
- `.opencode/skills/cli-codex/SKILL.md`: Documents native hook parity, troubleshooting steps and the hook contract reference
- `.opencode/skills/cli-codex/README.md`: Updated with native `SessionStart` and `UserPromptSubmit` hook paths as the primary dispatch surface. Prompt-wrapper language retained as fallback only.

### Fixed

- Codex CLI sessions returning no startup context when asked about injected repository state
- Codex CLI sessions returning no advisor brief when asked about skill routing

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| `npx vitest run tests/codex-session-start-hook.vitest.ts tests/codex-user-prompt-submit-hook.vitest.ts tests/claude-user-prompt-submit-hook.vitest.ts` | PASS, 3 files and 22 tests |
| Live hooks JSON parse and config flag check | PASS |
| Direct SessionStart smoke | PASS, emitted startup context in 42.22ms |
| Direct UserPromptSubmit smoke | PASS, emitted `Advisor: stale; use sk-code-opencode 0.92/0.12 pass.` in 71ms |
| Real Codex feature flag (`codex features list`) | PASS, `codex_hooks` reports true |
| Fresh real Codex smoke | PASS, returned `HOOK_SMOKE_OK` with 28,265 input tokens |
| Strict spec validation (`validate.sh --strict`) | PASS, 0 errors and 0 warnings |
| Independent re-verification (2026-04-22) | PASS. Fresh agent reproduced build, vitest 22/22, strict validate 0/0, direct SessionStart smoke (28.8ms), UserPromptSubmit smoke with triggering and non-triggering prompts, `codex_hooks=true`, backup file present, Superset notify entries preserved. |
| User-driven real Codex session smoke | PASS. SessionStart context received with full repo metrics. UserPromptSubmit advisor brief surfaced for triggering prompts. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Created (NEW) | Codex SessionStart adapter parsing JSON stdin and emitting startup context via additionalContext |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Created (NEW) | Codex UserPromptSubmit adapter emitting the skill advisor brief with fail-open behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts` | Created (NEW) | vitest coverage for the SessionStart adapter |
| `.opencode/skills/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | Created (NEW) | vitest coverage for the UserPromptSubmit adapter |
| `.opencode/skills/cli-codex/SKILL.md` | Modified | Native hook documentation, troubleshooting, hook contract reference added |
| `.opencode/skills/cli-codex/README.md` | Modified | Native hook paths documented as primary. Prompt-wrapper language demoted to fallback. |
| `~/.codex/hooks.json` | Modified | Spec Kit Memory commands appended alongside Superset notify entries |
| `~/.codex/config.toml` | Modified | `codex_hooks = true` enabled |

### Follow-Ups

- Codex marks `codex_hooks` as under development in `codex features list`. Future Codex releases may change the hook contract and require re-running the stdin/stdout/timeout smoke checks.
- Memory indexing is partially degraded. `generate-context.js` exited 0 and refreshed metadata, but semantic indexing hit `E_LINEAGE` and `candidate_changed` failures for several packet docs. Strict spec validation remains clean.
- CocoIndex timed out during implementation. Future operators using this packet as a reference for hook authoring may want to wait for CocoIndex stability before relying on semantic search here.
