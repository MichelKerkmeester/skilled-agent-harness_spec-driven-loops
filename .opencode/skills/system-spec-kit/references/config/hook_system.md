---
title: Hook System Reference
description: Current hook registration, runtime vocabulary, lifecycle behavior, and fallback contracts for Spec Kit prompt-time and session hooks.
trigger_phrases:
  - "hook system reference"
  - "hook registration matrix"
  - "runtime hook vocabulary"
  - "hook lifecycle behavior"
  - "codex timeout fallback"
importance_tier: important
contextType: implementation
version: 3.6.0.34
---

# Hook System Reference

Current hook registration, runtime vocabulary, lifecycle behavior, and fallback contracts for Spec Kit prompt-time and session hooks.

---

## 1. OVERVIEW

The hook system provides automated context preservation at hook-capable prompt-time and lifecycle boundaries. Prompt delivery, startup wiring, compaction, and shutdown handling differ by runtime, but they call the same retrieval primitives and fail open to the same operator recovery path.

---

## 2. HOOK REGISTRATION

Claude Code hooks are registered in `.claude/settings.local.json`. Under the normalized Claude schema, `UserPromptSubmit` is the prompt hook, while `PreCompact`, `SessionStart`, and `Stop` are lifecycle hooks:

```json
{
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js", "timeout": 3 }] }],
    "PreCompact": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js", "timeout": 3 }] }],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js", "timeout": 3 }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js", "async": true, "timeout": 10 }] }]
  }
}
```

Copilot registration is owned by the Copilot-local README at `mcp_server/hooks/copilot/README.md`. Copilot does not use the Claude Code `.claude/settings.local.json` nested hook block and must not add top-level `type`, `bash`, or `timeoutSec` wrapper fields there. The current Copilot path runs Copilot-supported writer scripts, including the checked-in `.github/hooks/superset-notify.json` wrapper where available, and refreshes the managed custom-instructions block for the next prompt. Copilot advisor freshness is NEXT-PROMPT: the current prompt sees the PRIOR turn's brief.

Codex registration is owned by the user/workspace Codex runtime config, not by the repo template alone. The checked-in `.codex/settings.json` is an example hook template for the project commands. Live native Codex readiness requires `[features].codex_hooks = true` in `~/.codex/config.toml` or an equivalent `--enable codex_hooks` launch flag, plus `~/.codex/hooks.json` or workspace `hooks.json` registration for the compiled Spec Kit hooks.

### Codex Hook Contract Versions

| Contract | Date / version note | Registration point | Trigger | Status |
| --- | --- | --- | --- | --- |
| Legacy repo template | Retained for repo examples and local policy shape | `.codex/settings.json` | None by itself; copy/adapt into live Codex hook registration | Example only |
| Current native hook contract | Active runtime contract as of 2026-04-29 | `~/.codex/config.toml` with `[features].codex_hooks = true` plus `~/.codex/hooks.json` or workspace `hooks.json` | Codex `SessionStart`, `UserPromptSubmit`, and optional `PreToolUse` native hooks | Authoritative live registration |
| Fallback prompt wrapper | Compatibility behavior | `hooks/codex/prompt-wrapper.ts` when native hook readiness reports unavailable | Explicit wrapper invocation | Fallback, not native hook registration |

---

## 3. CANONICAL RUNTIME HOOK VOCABULARY

Use support names first, then map to the runtime-local surface below when wiring or validating a specific runtime:

| Support | Claude / Codex / Copilot | OpenCode | Trigger / fallback |
| --- | --- | --- | --- |
| Prompt-time advisor | `UserPromptSubmit` | `experimental.chat.system.transform` | Runtime prompt hook; Copilot is NEXT-PROMPT freshness, so current prompt sees PRIOR turn's brief; fallback is explicit `skill_advisor.py` or advisor MCP tooling |
| Session priming | `SessionStart` | `event` startup handlers | Runtime startup hook; fallback is `/speckit:resume` or `session_bootstrap()` |
| Compaction | `PreCompact` | `event` compact handlers / compact plugin | Runtime compaction event; fallback is resume ladder |
| Session cleanup | `Stop` | `event` cleanup handlers | Runtime session-end event where supported; fallback is `/memory:save` |

---

## 4. HOOK LIFECYCLE

1. **Prompt-time advisor** — `UserPromptSubmit` in Claude, Codex, and Copilot; `experimental.chat.system.transform` in OpenCode. Claude, Codex, and OpenCode can inject runtime-visible advisor context in-turn. Copilot uses the same logical surface to refresh managed custom instructions and returns `{}`; this is NEXT-PROMPT freshness, so the current prompt sees the PRIOR turn's brief.
2. **Compaction** — `PreCompact` in Claude, compact `event` handlers in OpenCode, and limited wrapper-only parity in Copilot. Stdout is not injected on the precompute phase.
3. **SessionStart** — Fires on session start. Routes by source:
   - `compact`: Reads cached PreCompact payload, injects via stdout
   - `startup`: Primes with Spec Kit Memory overview
   - `resume`: Loads prior session state — respects the phase-parent pointer redirect documented in `references/hooks/skill_advisor_hook.md`. When the resume target is a phase parent and `derived.last_active_child_id` is fresh (<24h), priming surfaces the active child rather than the parent's listing
   - `clear`: Minimal output
   Copilot keeps runtime-specific transport output, but can forward the same session and spec-folder startup scope used by Claude when that input is available. Codex only reports live native-hook readiness when `[features].codex_hooks = true` is enabled in `~/.codex/config.toml` or equivalent launch flags and a user/workspace `hooks.json` is wired. Repo `.codex/settings.json` is a template/example, not the live readiness predicate.
4. **Session cleanup** — `Stop` in Claude and cleanup `event` handlers in OpenCode. Parses transcript JSONL for token usage, calculates cost estimates, and stores snapshots when the runtime supports it.

---

## 5. HOOK STATE

Per-session state stored at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json`.

Fields: `claudeSessionId`, `speckitSessionId`, `lastSpecFolder`, `pendingCompactPrime`, `metrics` (prompt/completion tokens, transcript offset).

---

## 6. SCRIPT LOCATIONS

Source: `mcp_server/hooks/claude/*.ts`
Compiled: `mcp_server/dist/hooks/claude/*.js`

---

## 7. TOKEN BUDGETS

- Compaction injection: 4000 tokens (`COMPACTION_TOKEN_BUDGET`)
- Session priming: 2000 tokens (`SESSION_PRIME_TOKEN_BUDGET`)
- Hook timeout: 1800ms (`HOOK_TIMEOUT_MS`, under 2s hard cap)

---

## 8. RUNTIME HOOK MATRIX

Prompt hooks and lifecycle hooks are separate support. A runtime can support prompt-time advisor context without supporting startup/code-graph lifecycle injection, and Copilot's prompt-time parity is NEXT-PROMPT freshness rather than in-turn injection; the current prompt sees the PRIOR turn's brief.

| Runtime | Prompt hook | Lifecycle hook | Compaction | Stop | Trigger / default | Manual fallback |
| --- | --- | --- | --- | --- | --- | --- |
| Claude | yes (`UserPromptSubmit`) | yes (`SessionStart`) | yes (`PreCompact`) | yes (`Stop`) | `.claude/settings.local.json` hook events | `/speckit:resume`, `/memory:save`, direct MCP tools |
| Codex | yes (`UserPromptSubmit`) | yes (`SessionStart`, live only when `codex_hooks` and `hooks.json` are both present) | no | no Spec Kit cleanup hook | `[features].codex_hooks = true` plus user/workspace `hooks.json`; `.codex/settings.json` is template-only | `/speckit:resume`, `session_bootstrap()`, prompt-wrapper fallback |
| Copilot | yes (file-based custom instructions; NEXT-PROMPT freshness; current prompt sees PRIOR turn's brief) | yes (`SessionStart` writer) | limited cache/writer path; no model-visible precompute injection | n/a | Copilot-supported writer scripts; see `mcp_server/hooks/copilot/README.md` | Managed instructions file or `/speckit:resume` |
| OpenCode | yes (`experimental.chat.system.transform`) | yes (`event` startup handlers) | yes (`event` compact handlers / compact plugin) | yes (`event` cleanup handlers) | Plugin bridge and event handlers | `/speckit:resume`, direct MCP tools |

### Codex Timeout Fallback Semantics

Codex `UserPromptSubmit` uses `SPECKIT_CODEX_HOOK_TIMEOUT_MS` (default `3000`) for the advisor builder. If the builder times out, the hook returns prompt-safe stale context with a machine-visible marker: `stale: true`, `reason: "timeout-fallback"`. The hook also writes one structured warning line (`event: "codex_user_prompt_timeout_fallback"`) before its normal prompt-safe diagnostic. Operators can run the smoke helper in `hooks/codex/lib/freshness-smoke-check.ts` to check cold-start freshness (`fresh`, `lastUpdateAt`, `latencyMs`) before adjusting timeout values.

---

## 9. CROSS-RUNTIME FALLBACK

Claude Code uses native `UserPromptSubmit`, `SessionStart`, `PreCompact`, and `Stop` hooks. Copilot CLI uses Copilot-supported writer scripts that refresh the Spec Kit managed block in `$HOME/.copilot/copilot-instructions.md`; hook output remains `{}` with NEXT-PROMPT freshness semantics, so the current prompt sees the PRIOR turn's brief, and the registration contract is documented in `mcp_server/hooks/copilot/README.md`. Do not use the stale merged `.claude/settings.local.json` wrapper shape for Copilot. OpenCode uses plugin-based transport rather than shell wrappers: `.opencode/plugins/mk-skill-advisor.js` delivers prompt-time advisor briefs through `experimental.chat.system.transform`, `.opencode/plugins/mk-spec-memory.js` bridges Spec Kit Memory tools through the warm daemon-backed spec-memory CLI, while `.opencode/plugins/mk-code-graph.js` (CLI-backed via its plugin bridge) and plugin `event` handlers cover startup, compaction, readiness, and session cleanup. Codex CLI only reports live native-hook readiness when `[features].codex_hooks = true` is enabled in `~/.codex/config.toml` or equivalent launch flags and user/workspace `hooks.json` is wired; on `UserPromptSubmit` timeout, Codex returns a stale fallback marker (`stale:true`, `reason:"timeout-fallback"`) and logs a structured warning instead of silently serving cold-start context. Use `/speckit:resume` when hooks are unavailable or disabled. If automatic hook delivery is unavailable in any runtime, or the advisor hook path is intentionally disabled (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`), fall back to the canonical operator path: start with `/speckit:resume`, rebuild packet continuity from `handover.md -> _memory.continuity -> spec docs`, then use `session_bootstrap()` or `session_resume()` only when you need lower-level structural health or merged recovery detail.

MCP remains the registered primary transport for all three daemons; the daemon-backed CLI shims (`.opencode/bin/spec-memory.cjs`, `.opencode/bin/code-index.cjs`, `.opencode/bin/skill-advisor.cjs`) are an additive dual-stack fallback over the same warm daemons. When a runtime's MCP tools are missing, fail to initialize, or return transport errors while the daemon is otherwise expected to be warm, hooks and operators route through the CLI in warm-only mode: probe the daemon IPC socket first and skip if absent — prompt-time paths must never cold-spawn a daemon — and treat exit `75` as retryable daemon/IPC unavailability rather than user error.

---

## 10. SHARED STARTUP PAYLOAD PARITY

All four supported runtimes transport the same compact startup shared-payload through their runtime-specific hooks. The payload is produced by `buildStartupBrief()`, which is defined locally in each runtime's session-prime hook and delegates to `getStartupBriefFromMarker()` in `mcp_server/lib/code-graph-boundary.ts`; it includes `graphQualitySummary` (detector provenance + edge-enrichment summary) alongside the `sharedPayloadTransport` envelope. Runtime-specific startup entrypoints:

| Runtime | Startup entrypoint | Transport | Trigger |
| --- | --- | --- | --- |
| Claude | `hooks/claude/session-prime.ts` | stdout context injection | Claude `SessionStart` |
| Copilot | `hooks/copilot/session-prime.ts` | refreshes managed block in `$HOME/.copilot/copilot-instructions.md` | Copilot-supported writer script; next prompt observes the block |
| Codex | `hooks/codex/session-start.ts` | native `SessionStart` hook | `[features].codex_hooks = true` plus user/workspace `hooks.json` |

`graphQualitySummary` is also surfaced on `code_graph_status` and `session_bootstrap()` / startup-brief responses, so operators can inspect the same quality envelope regardless of transport. `session_bootstrap()` remains a manual fallback when native startup hooks are disabled — it is no longer a Codex-only substitute.

Hooks remain in `system-spec-kit` because they own runtime lifecycle transport. Code-graph readiness, quality, and package docs are owned by the sibling `.opencode/skills/system-code-graph/` skill and imported through the co-resident MCP registration path.

---

## 11. ADVISOR BRIDGE AND THRESHOLD CONTRACT

OpenCode delivers prompt-time advisor context through a plugin-helper bridge rather than a shell wrapper:

- Plugin: `.opencode/plugins/mk-skill-advisor.js`
- Bridge entrypoint: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`
- Target: native compat entrypoint under `.opencode/skills/system-skill-advisor/mcp_server/compat/`

The bridge routes through the shared `renderAdvisorBrief(...)` invariants used by the Codex prompt-submit hook and prompt-wrapper fallback. The default OpenCode prompt-time threshold contract is **`0.8` confidence / `0.35` uncertainty**.

The public MCP contract is unified across runtime hook surfaces:

- `advisor_recommend` and `advisor_validate` accept an explicit `workspaceRoot` argument; both responses surface the resolved `workspaceRoot` and `effectiveThresholds` used for routing.
- `advisor_status` is diagnostic-only and does not rebuild. Use `advisor_rebuild({})` when status reports stale/absent/unavailable, or `advisor_rebuild({"force":true})` for an explicit live-state rebuild.
- `advisor_validate` additionally publishes `thresholdSemantics` (aggregate vs runtime) plus a prompt-safe `telemetry.outcomes.totals` block (`accepted` / `corrected` / `ignored`).
- Hook diagnostics persist to bounded JSONL sinks under the temp metrics root (`${TMPDIR}/speckit-advisor-metrics/`), so `advisor_validate` can read the sinks back across processes.

---

## 12. RETRIEVAL PRIMITIVES

The same retrieval building blocks power both hook delivery and explicit recovery:
1. `memory_match_triggers(prompt)` — Fast turn-start context
2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval

---

## 13. READ-ONLY GOVERNANCE DIAGNOSTICS

Two passive governance checks fire from existing surfaces and do not change recall or write stored memory data:

- `memory_health` includes `data.exclusionAudit`, derived from the hard-exclusion predicates exposed by `hybrid-search.ts`. `/doctor memory` reads that block through the existing health call and raises `hard_exclusion_risk` when deprecated-tier exclusions are risky or when an exclusion source is unclassified.
- The tool-ownership map is generated from `TOOL_DEFINITIONS` and checked by the project pre-commit hook. Drift between `mcp_server/tests/fixtures/tool-ownership-map.json` and the live definitions blocks commits; the map and this document are outputs, never inputs to the ownership source of truth.

---
