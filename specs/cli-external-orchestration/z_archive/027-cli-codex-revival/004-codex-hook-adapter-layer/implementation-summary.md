---
title: "Implementation Summary: Codex hook adapter layer"
description: "Codex hook source adapters and project registration now mirror the four Claude lifecycle events without changing neutral cores."
trigger_phrases: ["Codex hook adapter summary"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/004-codex-hook-adapter-layer"
    last_updated_at: "2026-07-13T09:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Created Codex hook adapters and project registration"
    next_safe_action: "Build dist and smoke all four events in Codex 0.144.1"
    blockers: ["Orchestrator dist build required before live hook smoke tests"]
    key_files: ["hooks/codex/shared.ts", ".codex/hooks.json", ".codex/config.toml"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-004", parent_session_id: "134-wave2" }
    completion_pct: 75
    open_questions: ["Do all four events fire once after the orchestrator builds dist?"]
    answered_questions: ["Codex 0.144.1 uses hooks.json with four PascalCase event keys"]
---
# Implementation Summary
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|---|---|
| **Spec Folder** | 004-codex-hook-adapter-layer |
| **Completed** | Source implementation 2026-07-13; live verification deferred |
| **Level** | 1 |
| **Status** | Source implemented; dist and live smoke pending |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built
Codex now has defensive source adapters for `SessionStart`, `UserPromptSubmit`, `Stop`, and `PreCompact`. Valid Codex payloads delegate to the existing Claude lifecycle owners so state, transcript, compaction, and advisor behavior stay single-sourced; injecting output is translated to Codex's `hookSpecificOutput.additionalContext` envelope, while lifecycle-only hooks emit nothing.

### Files Changed
| File | Action | Purpose |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/shared.ts` | Created | Bounded input parsing, lifecycle delegation, Codex output translation, and fail-open entrypoint handling. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Created | Translate `SessionStart` to startup-context behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Created | Translate prompt submission to advisor context. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-stop.ts` | Created | Run existing stop-state behavior without model-visible output. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/compact-inject.ts` | Created | Run existing compaction-cache behavior without model-visible output. |
| `.codex/hooks.json` | Created | Register all four Codex 0.144.1 native events. |
| `.codex/config.toml` | Created | Enable hooks and register the three project MCP launchers. |
| `tasks.md` | Modified | Record completed source work and deferred runtime verification. |
| `implementation-summary.md` | Created | Separate verified source evidence from deferred live evidence. |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered
The adapters were kept transport-only: they validate bounded Codex JSON, invoke the existing lifecycle owner, normalize output, and always fail open. JSON/TOML structure and scoped TypeScript syntax were checked without building `dist` or changing dependencies.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions
| Decision | Why |
|---|---|
| Delegate to compiled Claude lifecycle entrypoints | Their source owns non-exported state and transcript flows; delegation preserves behavior without copying logic or modifying neutral cores. |
| Emit Codex JSON only for injecting events | `SessionStart` and `UserPromptSubmit` need `additionalContext`; `Stop` and `PreCompact` are side-effect-only. |
| Keep project config minimal | The bridge enables hooks and restores the three launcher-backed MCP registrations evidenced by prior Codex config work. |
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|---|---|
| `.codex/hooks.json` parse | PASS: default `python3` loaded the JSON and printed `hooks.json OK`. |
| `.codex/config.toml` parse | PASS with `python3.11`: `tomllib` loaded the file and printed `config.toml OK`; default Python 3.9.6 lacks `tomllib`. |
| Scoped TypeScript syntax | PASS: global `tsc --ignoreConfig --noEmit --noCheck` accepted all five Codex source files. |
| Full package typecheck | BLOCKED by absent worktree dependencies/types after the existing TypeScript deprecation override; no dependency install was allowed. |
| Neutral-core status proof | PASS: `git status --porcelain .opencode/skills/system-spec-kit/mcp_server/hooks/` reports only `?? .../hooks/codex/`. |
| Dist build and live Codex event smoke | NOT RUN: explicitly deferred to the orchestrator. |
| `validate.sh --strict` | NOT RUN: explicitly excluded from this leaf task. |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations
1. **Runtime artifacts are absent.** The orchestrator must build `mcp_server/dist/hooks/codex/*.js` before any hook can execute.
2. **Live behavior is unverified.** A trusted Codex 0.144.1 session must prove each event fires once and receives the expected output shape.
3. **Full typechecking is unavailable.** The worktree lacks existing Node, Zod, and native package types; dependency installation was prohibited.
4. **Adapter telemetry uses the existing lifecycle owner.** Prompt diagnostics may retain the Claude runtime label until a runtime-neutral telemetry entrypoint exists.
<!-- /ANCHOR:limitations -->
