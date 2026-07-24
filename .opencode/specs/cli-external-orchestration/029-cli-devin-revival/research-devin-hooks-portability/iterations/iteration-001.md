# Iteration 1 — Inventory enumeration and initial portability matrix

## Focus

Enumerate the live Claude Code hook registrations, all OpenCode plugin entrypoints and registrations, the seven shared guard cores named by the Codex hook contract, and the current Devin CLI hook surface. Produce an initial port verdict for every source item, before adapter implementation.

## Actions Taken

- Read the packet state first: `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl`, `findings-registry.json`, and phase 001's contract summary.
- Read the local hook contract at `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md` and the OpenCode plugin README.
- Inspected `.claude/settings.json`, every non-test `*.js` entrypoint under `.opencode/plugins/`, and the seven Claude hook wrappers/shared cores.
- Checked the current Devin documentation for lifecycle payloads, hook entry shape, Claude-settings import, matcher semantics, output semantics, and exit behavior: <https://docs.devin.ai/cli/extensibility/hooks/overview>, <https://docs.devin.ai/cli/extensibility/hooks/lifecycle-hooks>.

## Findings

### A. Claude Code hook inventory

The live `.claude/settings.json` has eight event keys and 19 command handlers. Devin's native import can see the seven matching event names, but `PreCompact` is not a Devin event; its closest Devin event is `PostCompaction`, which fires after compaction rather than before it.

| Event / matcher | Handler command | Timeout / mode | Initial verdict | Evidence |
|---|---|---|---|---|
| `PreToolUse` / `Bash` | `node .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` | 5s | needs adaptation | `.claude/settings.json:15-23` |
| `PreToolUse` / `Bash` | `node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | 5s | needs adaptation | `.claude/settings.json:15-29` |
| `PreToolUse` / `Task` | `node .opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` | 5s | needs adaptation | `.claude/settings.json:31-39` |
| `PreToolUse` / `mcp__claude_ai_.*` | `node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` | 5s | needs adaptation | `.claude/settings.json:41-49` |
| `PreToolUse` / `Write\|Edit` | `node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | 5s | needs adaptation | `.claude/settings.json:51-59` |
| `UserPromptSubmit` / empty | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js` | 3s | needs adaptation | `.claude/settings.json:62-70` |
| `UserPromptSubmit` / empty | `node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | 3s | needs adaptation | `.claude/settings.json:62-77` |
| `PreCompact` / empty | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/compact-inject.js` | 3s | cannot port 1:1 | `.claude/settings.json:79-89`; Devin uses `PostCompaction` with `summary` |
| `SessionStart` / empty | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-prime.js` | 3s | needs adaptation | `.claude/settings.json:91-99` |
| `SessionStart` / empty | `bash .opencode/bin/worktree-guard.sh` | 3s | portable 1:1 via native import | `.claude/settings.json:91-104`; shell-only, cwd fallback is sufficient |
| `SessionStart` / empty | `bash .opencode/bin/check-git-hooks.sh` | 3s | portable 1:1 via native import | `.claude/settings.json:91-109`; shell-only |
| `SessionStart` / empty | `python3 .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh --all` | 5s | portable 1:1 via native import | `.claude/settings.json:91-114`; shell-only |
| `SessionStart` / empty | `node .opencode/bin/install-codex-hooks.mjs --check ...` | 5s | portable 1:1 via native import | `.claude/settings.json:91-119`; shell-only, fail-open wrapper |
| `Stop` / empty | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-stop.js` | 10s, async | needs adaptation | `.claude/settings.json:123-132`; Devin hook entries have no documented `async` field |
| `Stop` / empty | `node .opencode/skills/system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs` | 10s, async | needs adaptation | `.claude/settings.json:123-138`; Stop payload differs and async must be removed |
| `SessionEnd` / empty | `bash .opencode/scripts/session-cleanup.sh` | 10s | portable 1:1 via native import | `.claude/settings.json:142-151`; shell cleanup has no tool-payload dependency |
| `PostToolUse` / `Write\|Edit` | `node .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs` | 10s | needs adaptation | `.claude/settings.json:154-162`; Devin uses `tool_response`, and public names are `edit`, not `Write` |
| `PostToolUse` / `Write\|Edit` | `node .opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs` | 5s | needs adaptation | `.claude/settings.json:154-168`; same payload/name mismatch |
| `PostToolUse` / `Bash` | `node .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs` | 5s | needs adaptation | `.claude/settings.json:171-179`; Devin's equivalent public tool is `exec` and response is nested |

The shell-only rows are the only current 1:1 candidates. All Claude commands are wrapped with `cd "${CLAUDE_PROJECT_DIR:-$PWD}"` (`.claude/settings.json:21`, repeated throughout), so a robust adapter should prefer Devin's `DEVIN_PROJECT_DIR` or an explicit `cd` rather than relying on the current-directory fallback.

### B. OpenCode plugin inventory

There is no separate project plugin manifest in the live `.opencode/` root. The repository convention is auto-discovery of `.opencode/plugins/*.js` by default-exported factories (`.opencode/plugins/README.md:13-23`). The filesystem contains 15 non-test entrypoints; the README's tree and responsibility table list 14 and omit `mk-codex-hooks-watchdog.js` (`.opencode/plugins/README.md:100-139`; extra file `.opencode/plugins/mk-codex-hooks-watchdog.js:59-81`).

| OpenCode entrypoint | Registration surface | Runtime-neutral core / relevant implementation | Initial Devin verdict |
|---|---|---|---|
| `mk-cli-dispatch-audit.js` | `tool.execute.after` (`.opencode/plugins/mk-cli-dispatch-audit.js:45-50`) | `cli-opencode/scripts/lib/dispatch-audit.mjs` (`.opencode/plugins/mk-cli-dispatch-audit.js:24-26`) | needs adaptation: map Bash to Devin `exec`, input/result envelope, and command-hook stdout/exit semantics |
| `mk-code-graph-freshness.js` | `tool.execute.before`, `tool.execute.after`, `event` (`.opencode/plugins/mk-code-graph-freshness.js:176-233`) | `system-code-graph/runtime/lib/code-graph/freshness-core.cjs` (`.opencode/plugins/mk-code-graph-freshness.js:30-33`) | needs adaptation: Pre/PostToolUse and SessionStart/End cover the core; server/global disposal events do not |
| `mk-code-graph.js` | status `tool`, system/message transforms, compaction transform, session events (`.opencode/plugins/mk-code-graph.js:359-365`, `405-511`) | transport-backed bridge rather than a single hook core | cannot port 1:1 as a Devin hook: no plugin tool registration or OpenCode message/system transform; partial SessionStart/UserPromptSubmit/PostCompaction adapter is possible |
| `mk-completion-sentinel.js` | `event` for `session.created` and `session.idle` (`.opencode/plugins/mk-completion-sentinel.js:114-149`) | `system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs` (`.opencode/plugins/mk-completion-sentinel.js:27`) | needs adaptation: Devin has Stop, not `session.idle`, and does not provide the last assistant text in the hook payload |
| `mk-deep-loop-guard.js` | `event` plus `tool.execute.before` (`.opencode/plugins/mk-deep-loop-guard.js:52-87`) | shared dispatch-guard core imported at `.opencode/plugins/mk-deep-loop-guard.js:28` | needs adaptation: Devin subagent tooling is not the OpenCode `Task` input shape |
| `mk-dist-freshness-guard.js` | `tool.execute.before`, system transform, session/disposal events (`.opencode/plugins/mk-dist-freshness-guard.js:188-229`) | local freshness diagnostic implementation in the plugin | needs adaptation: additionalContext can replace system transform; disposal events have no direct Devin equivalent |
| `mk-goal.js` | goal tools, system transform, session/message/permission/question events (`.opencode/plugins/mk-goal.js:2793-2949`) | goal state and supervisor logic are embedded in the plugin | cannot port 1:1 as a Devin hook: Devin has no OpenCode tool registration or generic message/question lifecycle; only a reduced command/lifecycle adapter is possible |
| `mk-mcp-route-guard.js` | `tool.execute.before` (`.opencode/plugins/mk-mcp-route-guard.js:66-85`) | `mcp-code-mode/runtime/lib/mcp-route-guard.cjs` (`.opencode/plugins/mk-mcp-route-guard.js:23-26`) | needs adaptation: direct PreToolUse mapping is strong, but matcher/tool names and `DEVIN_PROJECT_DIR` must be translated |
| `mk-post-edit-quality.js` | before/after tool hooks and system transform (`.opencode/plugins/mk-post-edit-quality.js:117-183`) | `sk-code/code-quality/scripts/lib/post-edit-router.cjs` (`.opencode/plugins/mk-post-edit-quality.js:24`) | needs adaptation: use Devin Pre/PostToolUse, correlate by session/prompt or persisted call identity, and inject findings with PostToolUse `additionalContext` |
| `mk-skill-advisor.js` | status tool, system transform, session/disposal events (`.opencode/plugins/mk-skill-advisor.js:540`, `864-909`) | advisor bridge under `system-skill-advisor` | needs adaptation: UserPromptSubmit/SessionStart can carry the brief; status tool and OpenCode transform are not portable |
| `mk-spec-gate.js` | system transform, before-tool guard, session events (`.opencode/plugins/mk-spec-gate.js:160-256`) | `system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` (`.opencode/plugins/mk-spec-gate.js:28`) | needs adaptation: Devin PreToolUse/UserPromptSubmit map well, but tool names, session state, and context output need translation |
| `mk-spec-memory.js` | status tool, system transform, session/disposal events (`.opencode/plugins/mk-spec-memory.js:290`, `489-511`) | Spec Kit memory bridge | needs adaptation: lifecycle/context injection can be rebuilt; status tool and OpenCode transforms cannot be imported |
| `mk-speckit-completion.js` | read-only `tool` only (`.opencode/plugins/mk-speckit-completion.js:45-70`) | completion scripts invoked by the tool | cannot port 1:1 as a hook: Devin has no equivalent plugin tool registration; expose as a script/skill or omit |
| `session-cleanup.js` | session events, system transform, `dispose` (`.opencode/plugins/session-cleanup.js:98-191`) | shell guard/cleanup scripts called by the adapter | needs adaptation: SessionStart/SessionEnd cover the useful behavior; host `dispose` does not exist |
| `mk-codex-hooks-watchdog.js` | session-start event (`.opencode/plugins/mk-codex-hooks-watchdog.js:59-81`) | inline check wrapper around `install-codex-hooks.mjs --check` | portable behavior via Devin SessionStart command, but not as an OpenCode plugin |

OpenCode's host-specific registration vocabulary is broader than Devin's hook vocabulary: `tool`, `experimental.chat.system.transform`, `experimental.chat.messages.transform`, `experimental.session.compacting`, arbitrary `event`, and `dispose` are documented in `.opencode/plugins/README.md:81-94`. Devin can approximate lifecycle context with `additionalContext`, but it cannot import these registrations or expose the plugin tools directly.

### C. Seven guard cores and Devin adapter boundary

The local Codex contract explicitly identifies the seven cross-runtime guard families and their adapters (`.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:81-102`). The Claude/OpenCode implementations point to these reusable cores:

| Guard family | Shared core | Claude wrapper | Devin fit |
|---|---|---|---|
| spec-gate enforce/classify | `system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` | `runtime/hooks/claude/spec-gate-enforce.mjs:12`; `spec-gate-classify.mjs:13` | needs thin stdin/env/output adapter; PreToolUse and UserPromptSubmit exist |
| dispatch-preflight-lint | `cli-opencode/scripts/lib/dispatch-rule-checks.mjs` plus `dispatch-audit.mjs` | `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:10-11` | needs adaptation; PreToolUse exists but `Bash`/Claude input becomes Devin `exec`/`tool_input` |
| post-edit-quality | `sk-code/code-quality/scripts/lib/post-edit-router.cjs` | `sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs:23` | needs adaptation; PostToolUse response envelope and path extraction differ |
| code-graph-freshness | `system-code-graph/runtime/lib/code-graph/freshness-core.cjs` | `system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs:19` | needs adaptation; PostToolUse maps, disposal and exact tool matcher do not |
| dispatch-audit | `cli-opencode/scripts/lib/dispatch-audit.mjs` | `cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs:14` | needs adaptation; Devin's `tool_response` must be normalized |
| completion-evidence-sentinel | `system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs` | `system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs:22` | needs adaptation; Stop maps, but the assistant claim/transcript source is not in the Devin Stop payload |
| mcp-route-guard | `mcp-code-mode/runtime/lib/mcp-route-guard.cjs` | `mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs:14` | needs adaptation; Devin's public MCP tool names are `mcp__server__tool` and matcher regex must be retargeted |

The cores are the right reuse boundary. Porting the OpenCode or Claude transport wrappers themselves would preserve the wrong host contract.

### D. Devin CLI hook contract surface

The current lifecycle page documents eight events and event-specific stdin fields. The overview page's summary table currently omits `PostCompaction` (`overview` lines 150-163), while the dedicated lifecycle page includes it (`lifecycle-hooks` lines 80-87 and 271-291); this is documentation drift, not grounds to drop the event because phase 001 independently pinned all eight.

Common envelope:

```json
{
  "hook_event_name": "<event>",
  "session_id": "session-uuid",
  "prompt_id": "turn-uuid"
}
```

`prompt_id` is per-turn and absent for events before the first prompt. Command hooks also receive `DEVIN_PROJECT_DIR` in the environment (`overview` lines 194-212). Event-specific fields are:

| Event | Required/event-specific stdin fields | Output relevant to porting | Evidence |
|---|---|---|---|
| `PreToolUse` | `tool_name: string`, `tool_input: object` | top-level `decision`; `hookSpecificOutput.updatedInput` or `additionalContext` | lifecycle lines 105-153; overview lines 215-246 |
| `PostToolUse` | `tool_name`, `tool_input`, `tool_response: {success:boolean, output:string, error:string|null}` | `additionalContext` for findings/logging | lifecycle lines 158-180 |
| `PermissionRequest` | `tool_name`, `tool_input` | top-level `decision: approve\|block` | lifecycle lines 185-207 |
| `UserPromptSubmit` | `prompt: string` | `hookSpecificOutput.additionalContext` tagged `UserPromptSubmit` | lifecycle lines 211-239 |
| `Stop` | `stop_hook_active: boolean` | top-level decision/reason; avoid infinite blocking | lifecycle lines 244-266 |
| `PostCompaction` | `summary: string|null` | context/logging output; this is after compaction | lifecycle lines 271-291 |
| `SessionStart` | `source: string` | `additionalContext` tagged `SessionStart` | lifecycle lines 296-325 |
| `SessionEnd` | `reason: string` | cleanup/logging | lifecycle lines 331-338 |

The hook registration shape is:

```json
{
  "PreToolUse": [{
    "matcher": "^exec$",
    "hooks": [{
      "type": "command",
      "command": "./.devin/hooks/portable-router.sh",
      "timeout": 5
    }]
  }]
}
```

A fully populated all-event example for this repository's adapter layer is:

```json
{
  "PreToolUse": [{"matcher":"^(exec|edit|mcp__.*)$","hooks":[{"type":"command","command":"./.devin/hooks/pre-tool-use.sh","timeout":5}]}],
  "PostToolUse": [{"matcher":"^(exec|edit)$","hooks":[{"type":"command","command":"./.devin/hooks/post-tool-use.sh","timeout":10}]}],
  "PermissionRequest": [{"matcher":"^(exec|edit|mcp__.*)$","hooks":[{"type":"command","command":"./.devin/hooks/permission-request.sh","timeout":5}]}],
  "UserPromptSubmit": [{"matcher":"","hooks":[{"type":"command","command":"./.devin/hooks/user-prompt-submit.sh","timeout":3}]}],
  "Stop": [{"matcher":"","hooks":[{"type":"command","command":"./.devin/hooks/stop.sh","timeout":10}]}],
  "PostCompaction": [{"matcher":"","hooks":[{"type":"command","command":"./.devin/hooks/post-compaction.sh","timeout":3}]}],
  "SessionStart": [{"matcher":"","hooks":[{"type":"command","command":"./.devin/hooks/session-start.sh","timeout":5}]}],
  "SessionEnd": [{"matcher":"","hooks":[{"type":"command","command":"./.devin/hooks/session-end.sh","timeout":10}]}]
}
```

The public Devin matcher is a regex over `tool_name`, not a permission glob (`lifecycle-hooks` lines 365-388). The public tool names include `read`, `edit`, `grep`, `glob`, `exec`, and `mcp__<server>__<tool>`; therefore the repo's Claude `Bash`, `Write`, `Task`, and `mcp__claude_ai_.*` matchers cannot be copied unchanged.

### E. Native `read_config_from.claude:true` viability

Native import is useful but not a complete adapter. Devin documents `.claude/settings.json` as a project hook source and says `.claude` hooks are loaded when `read_config_from.claude` is enabled, with the default enabled (`overview` lines 260-284). That can cover registration for the seven common lifecycle keys and lets the four shell-only SessionStart/SessionEnd candidates run without duplicating entries.

It does not cover:

- the repo's `PreCompact` key as a before-compaction hook; the Devin equivalent is after-compaction `PostCompaction`;
- OpenCode plugin factories, registered tools, `experimental.chat.*` transforms, `session.idle`, arbitrary OpenCode disposal events, or `dispose`;
- Claude-specific matcher names (`Bash`, `Write`, `Edit`, `Task`, `mcp__claude_ai_.*`) when the Devin tool names are different;
- the Claude `CLAUDE_PROJECT_DIR` wrapper and `async: true` fields without a compatibility decision;
- payload normalization where the scripts expect Claude fields or Claude output semantics.

Preliminary ADR-001 recommendation: enable native Claude import for the compatible baseline, then add explicit Devin adapters for the seven guard cores, `PreCompact`/`PostCompaction`, the non-shell handlers, and all OpenCode-only behaviors. Keep `.devin/hooks.v1.json` authoritative for any Devin-specific matcher or output behavior so import cannot silently mask a missing adapter.

## Questions Answered

- Q1: Answered for the live `.claude/settings.json`: 19 command handlers across eight keys, with event, matcher, command, timeout, and async flags enumerated above.
- Q2: Answered for the live `.opencode/plugins/`: 15 auto-discovered entrypoints, including the README-omitted watchdog, with registration surfaces and core boundaries enumerated above.
- Q3: Answered from the current Devin lifecycle contract: eight events, event-specific stdin schemas, common correlation fields, output controls, matcher semantics, and a complete example config.
- Q4: Initial per-source verdicts produced for all Claude handlers, all OpenCode plugins, and all seven guard cores.
- Q5: Answered provisionally: native Claude import is a useful baseline for compatible command hooks, not a substitute for the adapter layer.
- Q6: ADR-001-ready evidence table is present, with the remaining verification caveats called out instead of hidden.

## Questions Remaining

- Verify the exact behavior of Devin's Claude-settings import against this repository with `/hooks`, especially whether unsupported `PreCompact` entries are ignored or surfaced as warnings.
- Confirm the exact Devin tool name and payload for subagent dispatch before deciding whether the `Task` guard can be adapted to `PreToolUse`.
- Smoke-test command stdout/exit handling for the imported Claude shell wrappers and the seven new Devin adapters; this iteration intentionally did not implement or run them.

## Next Focus

Iteration 2 should validate the import boundary and payload normalization experimentally: inspect Devin's `/hooks` output for this `.claude/settings.json`, then trace one representative PreToolUse, PostToolUse, UserPromptSubmit, Stop, PostCompaction, SessionStart, and SessionEnd invocation against the shared guard cores. Use those observations to turn the provisional rows into confirmed ADR-001 decisions.

## SCOPE VIOLATIONS

None. Only the iteration narrative, state-log append, and per-iteration delta were written.
