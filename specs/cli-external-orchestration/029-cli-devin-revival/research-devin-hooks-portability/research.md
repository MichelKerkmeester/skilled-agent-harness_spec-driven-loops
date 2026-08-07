---
title: "Deep Research: Devin hooks vs. Claude Code hooks / OpenCode plugins portability"
description: "10-iteration forced-depth research (GPT-5.6-LUNA, xhigh, cli-codex) into which of this repo's Claude Code hooks and OpenCode plugins can be ported to Devin CLI's native hook contract, feeding phase 004-devin-hook-adapter-layer ADR-001."
trigger_phrases: ["devin hooks portability research", "claude hooks devin port", "opencode plugins devin port", "ADR-001 evidence"]
importance_tier: important
contextType: research
---

# Deep Research: Devin Hooks vs. Claude Code Hooks / OpenCode Plugins Portability

> **Compilation note**: this file was compiled manually from the completed research packet (`iterations/iteration-001.md` through `iteration-010.md`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`) after the automated `/deep:research:auto` synthesis step crashed post-iteration-10 without writing this file. All 10 iterations completed successfully with real, cited evidence (confirmed via the JSONL state log and iteration files on disk) — only the final compilation step failed. No content here is fabricated; every claim traces to iteration 009's consolidated evidence pack (itself built by reconciling iterations 001-008) and iteration 010's convergence pass.

## 1. Session Metadata

| Field | Value |
|---|---|
| Session ID | `dr-devin-hooks-portability-2026-07-24-001` |
| Executor | `cli-codex`, model `gpt-5.6-luna`, reasoning-effort `xhigh`, service-tier `fast` |
| Iterations run | 10 of 10 (config `maxIterations: 10`) |
| Stop policy | `max-iterations` (forced-depth — convergence signals treated as telemetry only, per explicit "don't converge early" instruction) |
| Started | 2026-07-24T04:06:41.346Z |
| Target packet | `cli-external-orchestration/029-cli-devin-revival` (root-spec target) |

## 2. ADR-001 Recommendation (the answer to the research question)

**Use explicit Devin adapters as the authoritative path.** Enable `read_config_from.claude:true` only as a compatibility probe or optional baseline for simple shell lifecycle commands and prompt-context candidates — never as the enforcement path. Native import does not rewrite Claude matcher names, normalize payloads or environment variables, translate Claude output envelopes, supply missing `Stop` evidence, rename `PreCompact` to `PostCompaction`, or load OpenCode plugin factories.

The reusable boundary is **the runtime-neutral policy core plus a thin Devin transport adapter** — exactly the same shape this repo already uses for the `cli-codex` hook-adapter-layer. The adapter owns Devin matcher selection, `DEVIN_PROJECT_DIR` anchoring, stdin normalization, exit-policy preservation, and Devin decision/context output.

## 3. Claude Settings Hooks — Port Verdict Table (C-01 through C-20)

The repository has **7 Claude settings hook keys and 19 command handlers** (`.claude/settings.json:14-180`). `PermissionRequest` (C-20) is listed to make the Devin coverage gap explicit — there is no Claude source handler for it.

| ID | Claude registration | Handler | Devin verdict → target event | Native import | Rationale |
|---|---|---|---|---|---|
| C-01 | `PreToolUse` / `Bash` | `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` | Needs adaptation → `PreToolUse(^exec$)` | No effective coverage | `Bash` doesn't select Devin `exec`; deny envelope is Claude-specific |
| C-02 | `PreToolUse` / `Bash` | `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Needs adaptation → `PreToolUse(^exec$)` | No effective coverage | Policy reusable; matcher + permission output don't select/block Devin shell calls |
| C-03 | `PreToolUse` / `Task` | `system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` | Needs adaptation → `PreToolUse(^run_subagent$)` | No effective coverage | Devin dispatch is `run_subagent` w/ `profile`/`is_background`/`resume`; wrapper expects `task`/`subagent_type` |
| C-04 | `PreToolUse` / `mcp__claude_ai_.*` | `mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` | Needs adaptation → `PreToolUse(^mcp__.*$)` | Partial at best | Claude registration hard-codes one server family; Devin exposes generic MCP namespace |
| C-05 | `PreToolUse` / `Write\|Edit` | `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Needs adaptation → `PreToolUse(^edit$)` | No effective coverage | Devin's mutation tool is `edit`; path extraction + deny output need normalization |
| C-06 | `UserPromptSubmit` | `user-prompt-submit.js` | Needs adaptation → `UserPromptSubmit` | Conditional candidate | Devin supplies `prompt` + context output; project discovery not live-import verified |
| C-07 | `UserPromptSubmit` | `spec-gate-classify.mjs` | Needs adaptation → `UserPromptSubmit` | Conditional candidate | Event/prompt field align; cwd/state/output normalization remain runtime-specific |
| C-08 | `PreCompact` | `compact-inject.js` | **Cannot port 1:1** — replacement is `PostCompaction` | No | Devin has no before-compaction event; after-compaction summary can't preserve the timing invariant |
| C-09 | `SessionStart` | `session-prime.js` | Needs adaptation → `SessionStart` | Conditional only | Event exists; handler reads Claude-oriented session/context state |
| C-10 | `SessionStart` | `worktree-guard.sh` | Needs adaptation (production parity) → `SessionStart` | Conditional baseline | Shell-only, event-compatible, but relies on inherited cwd — anchor at `DEVIN_PROJECT_DIR` |
| C-11 | `SessionStart` | `check-git-hooks.sh` | Needs adaptation (production parity) → `SessionStart` | Conditional baseline | Same cwd issue as C-10; warning must stay advisory |
| C-12 | `SessionStart` | `check-dist-staleness.sh --all` | Needs adaptation (production parity) → `SessionStart` | Conditional baseline | Relative launcher + stdout warning need project-root anchoring |
| C-13 | `SessionStart` | `install-codex-hooks.mjs --check ...` | Needs adaptation (production parity) → `SessionStart` | Conditional baseline | Cwd-independent after normalization; drift must stay advisory (exit 2 non-blocking) |
| C-14 | `Stop` (`async:true`) | `session-stop.js` | Needs adaptation → `Stop` | No authoritative parity | `async` undocumented on Devin; Stop payload smaller than Claude owner expects |
| C-15 | `Stop` (`async:true`) | `completion-evidence-stop.cjs` | Needs adaptation → `Stop` | No effective evidence parity | Devin `Stop` lacks `last_assistant_message` — need a safe claim/state source |
| C-16 | `SessionEnd` | `session-cleanup.sh` | Needs adaptation (production parity) → `SessionEnd` | Conditional baseline | Event-compatible + fail-open; Devin has no documented OS PID bridge — keep safe no-op/orphan-only unless explicit PID supplied |
| C-17 | `PostToolUse` / `Write\|Edit` | `claude-posttooluse.cjs` | Needs adaptation → `PostToolUse(^edit$)` | No effective coverage | Matcher/edit fields Claude-shaped; Devin adds `tool_response` |
| C-18 | `PostToolUse` / `Write\|Edit` | `code-graph-freshness.cjs` | Needs adaptation → `PostToolUse(^edit$)`, optional `SessionStart` | No effective coverage | OpenCode timer/disposal behavior has no Devin equivalent |
| C-19 | `PostToolUse` / `Bash` | `dispatch-audit-posttooluse.mjs` | Needs adaptation → `PostToolUse(^exec$)` | No effective coverage | Devin equivalent is `exec` with a Devin response envelope |
| C-20 | *(no Claude source item)* | — | No source to port; Devin exposes `PermissionRequest` but nothing imports into it | N/A | Adding one would be new Devin-specific behavior, not a port |

**Verdict summary: 0 of 19 real handlers are portable 1:1 without adaptation. 1 (C-08) cannot port at all. The remaining 18 all need a thin Devin transport adapter** — matcher rename, payload/env normalization, and/or output-envelope translation.

## 4. OpenCode Plugin Entrypoints — Port Verdict Table (P-01 through P-15)

The live directory contains **15 non-test default-exported plugin entrypoints**. Devin hooks can rebuild selected lifecycle *behavior*, but **cannot import OpenCode's plugin factory, callable tool registry, transform containers, message stream, or disposal lifecycle** — that entire mechanism has no Devin analog.

| ID | OpenCode plugin | Devin verdict → useful target | Recommended boundary |
|---|---|---|---|
| P-01 | `mk-cli-dispatch-audit.js` | Needs adaptation → `PostToolUse(^exec$)` | Reuse audit core; normalize command/response/session identity |
| P-02 | `mk-code-graph-freshness.js` | Needs adaptation → `PostToolUse(^edit$)`, optional `SessionStart` | Reuse freshness policy; omit OpenCode disposal/timer semantics |
| P-03 | `mk-code-graph.js` | **Cannot port 1:1** | Use code-graph MCP/daemon CLI; optional bounded prompt/post-compaction context adapters |
| P-04 | `mk-codex-hooks-watchdog.js` | Needs adaptation → `SessionStart` | Rebuild as a Devin command hook, not an imported plugin |
| P-05 | `mk-completion-sentinel.js` | Needs adaptation → `Stop` | Reuse sentinel only after defining Devin claim/spec-folder lookup |
| P-06 | `mk-deep-loop-guard.js` | Needs adaptation → `PreToolUse(^run_subagent$)` | Map `profile`/prompt/background/resume deliberately |
| P-07 | `mk-dist-freshness-guard.js` | Needs adaptation → `PreToolUse(^exec$)`, optional `SessionStart` | Devin context output for bounded warnings |
| P-08 | `mk-goal.js` | **Cannot port 1:1** | Devin rule/skill + project-owned state + explicit CLI/MCP status; external orchestration needed for auto-continuation |
| P-09 | `mk-mcp-route-guard.js` | Needs adaptation → `PreToolUse(^mcp__.*$)` | Strong mapping to shared warn-only route core |
| P-10 | `mk-post-edit-quality.js` | Needs adaptation → `PreToolUse`/`PostToolUse(^edit$)` | Devin edit input avoids the OpenCode correlation map |
| P-11 | `mk-skill-advisor.js` | Needs adaptation → `UserPromptSubmit`, optional `SessionStart` | Register via MCP or warm CLI; prompt hook only for bounded briefs |
| P-12 | `mk-spec-gate.js` | Needs adaptation → `UserPromptSubmit`, `PreToolUse(^(exec\|edit)$)` | Reuse spec-gate core; Devin owns tool mapping/state/output |
| P-13 | `mk-spec-memory.js` | Needs adaptation → `SessionStart`, `UserPromptSubmit`, optional `PostCompaction` | Spec Memory MCP/CLI as primary; adapters inject bounded context |
| P-14 | `mk-speckit-completion.js` | **Cannot port 1:1** | Use `.opencode/bin/speckit-completion.cjs` from a Devin skill/script, or expose via MCP |
| P-15 | `session-cleanup.js` | Needs adaptation → `SessionStart`/`SessionEnd` | Port cleanup explicitly; OpenCode disposal is an omitted host feature |

**Native Claude import covers zero OpenCode plugin registrations** — `.opencode/plugins/*.js` is entirely outside the Claude config-import boundary. 3 of 15 (P-03, P-08, P-14) cannot port at all and need an MCP/CLI/rule-based alternative instead of a hook.

## 5. Seven Repo Guard Cores — Port Verdict Table (G-01 through G-07)

These are the runtime-neutral cores already shared across `cli-codex`'s own hook-adapter-layer (`hook-contract.md`). **All seven are reusable, but none of their current transports is authoritative under Devin without an adapter:**

| ID | Runtime-neutral core | Devin verdict → target | Adapter responsibility |
|---|---|---|---|
| G-01 | `spec-gate-enforce/classify` | Needs adaptation → `UserPromptSubmit` + `PreToolUse(^(exec\|edit)$)` | Map Devin tool names, paths, session gate state, cwd, deny/context output |
| G-02 | `dispatch-preflight-lint` | Needs adaptation → `PreToolUse(^exec$)` | Read `tool_input.command`, evaluate shared rules, emit Devin blocking semantics |
| G-03 | `post-edit-quality` | Needs adaptation → `PostToolUse(^edit$)` | Extract Devin edit paths + `tool_response`; retain warn-only behavior |
| G-04 | `code-graph-freshness` | Needs adaptation → `PostToolUse(^edit$)`, optional `SessionStart` | Normalize paths; omit OpenCode disposal timers |
| G-05 | `dispatch-audit` | Needs adaptation → `PostToolUse(^exec$)` | Normalize command/output/session/call identity; stay silent, fail-open |
| G-06 | `completion-evidence-sentinel` | Needs adaptation → `Stop` | Obtain claim text + active spec folder from a safe Devin-owned source, or leave advisory |
| G-07 | `mcp-route-guard` | Needs adaptation → `PreToolUse(^mcp__.*$)` | Widen matcher, resolve `DEVIN_PROJECT_DIR`, translate advisory context |

## 6. Native `read_config_from.claude:true` Import — Coverage Decision

| Coverage class | Rows | Decision |
|---|---|---|
| Conditional shell baseline | C-10–C-13, C-16 | May reduce registration duplication, but production parity still needs `DEVIN_PROJECT_DIR`, output, exit-policy, cleanup-identity checks |
| Closest prompt-context candidates | C-06–C-07 | `UserPromptSubmit`/`prompt` align, but runtime state + output normalization unverified |
| Matcher mismatch | C-01–C-05, C-17–C-19 | Import preserves `Bash`/`Write`/`Edit`/`Task`/`mcp__claude_ai_.*`; Devin calls `exec`/`edit`/`run_subagent`/generic `mcp__.*` |
| Missing fields/output | C-02, C-05, C-14–C-15, C-17–C-19 | Claude-specific permission envelopes, `last_assistant_message`, `async`, path fields, response layout aren't normalized |
| Lifecycle gap | C-08 + post-compaction recovery | No import turns before-compaction `PreCompact` into after-compaction `PostCompaction` parity |
| OpenCode plugins | P-01–P-15 | Zero coverage — outside the Claude config-import boundary entirely |

**Bottom line: native import is a useful compatibility probe and a conditional baseline for a handful of simple shell/prompt hooks — it is never a substitute for hand-built adapters, and this must not become the default enforcement path.**

## 7. Bash-Only Hooks — cwd / Environment / Exit Contract

- Devin guarantees `DEVIN_PROJECT_DIR`; it does **not** guarantee command hooks start in the project root, that `PWD` is project-root, or that every event has a universal stdin `cwd` field.
- Anchor all repository-relative commands at `DEVIN_PROJECT_DIR`.
- Exit `0` continues, exit `2` blocks, other nonzero exits fail open while logging a hook error.
- Do not forward exit `2` from an advisory check the Claude wrapper intentionally made non-blocking.
- Plain stdout/stderr is not the documented agent-context injection path — convert agent-facing warnings to `hookSpecificOutput.additionalContext` when they must be visible in-session.
- Session cleanup cannot infer an OS process tree from Devin's `session_id` — keep cleanup safe no-op/orphan-only, or supply an explicit PID owned by the Devin adapter.

## 8. `PreCompact` → `PostCompaction` — Why the Handler Isn't Portable As-Is

Claude's `compact-inject.js` reads `session_id`/`transcript_path`/`trigger`, tails the transcript, writes `pendingCompactPrime`, and deliberately emits no stdout — Claude later delivers the cache via `SessionStart(source=compact)`. Devin's `PostCompaction` supplies `session_id` and a possibly-null `summary`, but **not** the transcript path, trigger, or a guaranteed Claude-style follow-up event.

A Devin adapter must instead:
1. Retain `summary` as the first recovery section.
2. Rehydrate authoritative continuity from active session/spec state.
3. Fall back to bounded `memory_context(mode=resume)` (or equivalent) when `summary` is null/incomplete.
4. Apply provenance/semantic-safety filtering before model-visible injection.
5. Emit bounded `hookSpecificOutput.additionalContext` directly from `PostCompaction` (rather than relying on a synthesized follow-up event).

Exact before-compaction timing is unavailable under Devin — this is a genuine, permanent semantic gap, not an implementation shortfall.

## 9. OpenCode "Cannot Port 1:1" — Recommended Alternatives

| Plugin | Why no Devin hook can host it | Alternative |
|---|---|---|
| `mk-code-graph.js` | No callable status tool, mutable system/message/compaction containers, or plugin-cache lifecycle | Existing code-graph MCP/daemon CLI + optional bounded prompt/post-compaction context hooks |
| `mk-goal.js` | No OpenCode goal tools, message-part stream, permission/question events, idle verifier, hidden continuation loop | Devin rule/skill + project-owned goal state + explicit CLI/MCP status + external orchestration for continuation |
| `mk-skill-advisor.js` | No system transform, status tool, client history lookup, disposal callback | Devin MCP/skill; warm CLI call from `UserPromptSubmit` only for bounded briefs |
| `mk-spec-memory.js` | No per-transform injection or in-process cache/disposal lifecycle | Spec Memory MCP/CLI + resume skill/rule + optional prompt/post-compaction context adapters |
| `mk-speckit-completion.js` | Devin hooks can't register the OpenCode callable-tool schema | Existing `speckit-completion.cjs` script/skill, or a Devin MCP wrapper |

## 10. Proposed `.devin/hooks.v1.json` Skeleton (research artifact, not implemented)

This is one concrete registration shape covering all 8 Devin event keys, using only necessary matchers, and deliberately omitting the cannot-port rows (`PreCompact` isn't a Devin event; no OpenCode-only plugin factory is represented; `PermissionRequest` has no source handler and stays empty). Adapter script paths below are **proposed boundaries for phase 004 to implement**, not files that exist yet.

```json
{
  "PreToolUse": [
    { "type": "command", "matcher": "^exec$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin-dispatch-preflight-lint.mjs", "timeout": 5 },
    { "type": "command", "matcher": "^exec$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs", "timeout": 5 },
    { "type": "command", "matcher": "^edit$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs", "timeout": 5 },
    { "type": "command", "matcher": "^run_subagent$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs", "timeout": 5 },
    { "type": "command", "matcher": "^mcp__.*$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs", "timeout": 5 }
  ],
  "PostToolUse": [
    { "type": "command", "matcher": "^edit$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/sk-code/code-quality/scripts/hooks/devin-posttooluse.cjs", "timeout": 10 },
    { "type": "command", "matcher": "^edit$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs", "timeout": 5 },
    { "type": "command", "matcher": "^exec$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin-dispatch-audit-posttooluse.mjs", "timeout": 5 }
  ],
  "PermissionRequest": [],
  "UserPromptSubmit": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.js", "timeout": 3 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs", "timeout": 3 }
  ],
  "Stop": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-stop.js", "timeout": 10 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs", "timeout": 10 }
  ],
  "PostCompaction": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs", "timeout": 5 }
  ],
  "SessionStart": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/bin/worktree-guard.sh", "timeout": 3 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/bin/check-git-hooks.sh", "timeout": 3 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh --all", "timeout": 5 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/bin/install-codex-hooks.mjs --check", "timeout": 5 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-prime.js", "timeout": 3 }
  ],
  "SessionEnd": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/scripts/session-cleanup.sh || true", "timeout": 10 }
  ]
}
```

The concrete adapter commands still require implementation-phase smoke tests for stdin fields, stdout/exit handling, process cwd, `run_subagent`, file-write vocabulary, and the Stop/PostCompaction evidence sources (see §12 below).

## 11. Convergence Report

| Metric | Value |
|---|---|
| Stop reason | `max-iterations` reached (10/10) — stop-policy forced continuation past the natural convergence signal (iteration 9 already showed newInfoRatio 0.31, iteration 10 showed 0.08) |
| Total iterations completed | 10 |
| newInfoRatio trend | 0.94 → 0.78 → 0.82 → 0.86 → 0.88 → 0.84 → 0.90 → 0.92 → 0.31 → 0.08 (avg **0.733**) |
| Key findings recorded | 53 (per dashboard) / 45 promoted registry entries / 83 unique evidence-graph nodes |
| Questions answered (in research) | **6/6** — see §12 for the important caveat |
| Questions answered (registry-promoted) | 0/6 — the automated reducer's promotion step never ran because synthesis crashed before it (see note below) |

**Important honesty note carried forward from iteration 10 itself**: the research substantively answers all 6 key questions with cited, reproducible evidence (§3-§10 above). However, the automated reducer's mechanical "mark as resolved" step in `findings-registry.json` never ran (`resolvedQuestions: []`, every question still `resolved:false`) because the synthesis step crashed before that reconciliation pass. This file is the manual substitute for that crashed step. The underlying research is real and complete; only the bookkeeping field was left stale by the crash.

## 12. Remaining Gaps — Live Verification Required Before Phase 004 Implementation

None of these change the ADR-001 recommendation; they are implementation-time smoke tests against an **authenticated** Devin session (this machine is not logged in — see `001-devin-contract-pin`):

1. Run authenticated Devin `/hooks` in this repository and record whether an imported `PreCompact` entry is ignored, warned on, or rejected, and how `async` is handled.
2. Smoke-test plain stdout, stderr, exit `2`, and top-level JSON decisions for imported commands and explicit adapters.
3. Capture one live `PreToolUse(run_subagent)` event to confirm required fields and the runtime representation of `resume`.
4. Confirm Devin's live file-write vocabulary and whether `tool_use_id`/`cwd` are present on every relevant post-tool event.
5. Confirm the actual process cwd used by Devin command hooks (docs guarantee `DEVIN_PROJECT_DIR`, not inherited cwd).
6. Determine the safe Devin-owned source for the final assistant claim and active spec folder at `Stop`.
7. Smoke-test `PostCompaction` context injection, including the null-summary case, and verify whether a follow-up `SessionStart`/`UserPromptSubmit` fires.
8. Confirm the live `mcpServers` registration shape for this repo's daemon launchers (relative working directory, env propagation).

## 13. Recommended Phase 004 Implementation Order

1. Run the 8 live smoke tests above against an authenticated Devin session.
2. Freeze the adapter contract for `DEVIN_PROJECT_DIR`, `exec`, `edit`, `run_subagent`, generic `mcp__.*`, and the actual Stop/PostCompaction evidence inputs.
3. Implement thin adapters around the 7 neutral guard cores (G-01–G-07), starting with `UserPromptSubmit`/`PreToolUse`/`PostToolUse`, then `Stop`/`PostCompaction`/`SessionEnd`.
4. Keep native Claude import (`read_config_from.claude:true`) opt-in and diagnostic until live `/hooks` evidence proves a specific row's fidelity — never the default enforcement path.

## Sources

- `001-devin-contract-pin/implementation-summary.md` (live Devin CLI v3000.2.17 contract — hooks, config, permissions, models, auth)
- `.claude/settings.json:14-180` (7 hook keys, 19 handlers)
- `.opencode/plugins/*.js` (15 plugin entrypoints) + `.opencode/plugins/README.md`
- `cli-codex/references/hook-contract.md` (the 7 runtime-neutral guard cores, existing adapter precedent)
- [Devin lifecycle hooks](https://docs.devin.ai/cli/extensibility/hooks/lifecycle-hooks) · [Devin hooks overview and import behavior](https://docs.devin.ai/cli/extensibility/hooks/overview)
- `research/iterations/iteration-001.md` through `iteration-010.md` (full iteration-by-iteration trail)
- `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-strategy.md`, `research/deep-research-dashboard.md`
