---
title: "Deep Research Iteration 004 — Native Claude Import Coverage Matrix"
description: "Evidence-backed coverage matrix for importing this repository's Claude hooks into Devin CLI."
---

## Focus

Iteration 4 — determine what Devin's native `read_config_from.claude:true` path does to every hook in `.claude/settings.json`, with particular attention to matcher translation, cwd/env assumptions, `async`, `PreCompact`, and output envelopes.

## Actions Taken

- Enumerated the live Claude hook registrations in `.claude/settings.json:14-180`: 19 command handlers across `PreToolUse`, `UserPromptSubmit`, `PreCompact`, `SessionStart`, `Stop`, `SessionEnd`, and `PostToolUse`.
- Confirmed the installed CLI is `devin 3000.2.17 (2c489dfc)`.
- Read the current Devin hook and configuration-import documentation. The hooks page says Claude settings are discovered when `read_config_from.claude` is enabled; the configuration-import page lists the same files under Claude MCP-server import but does not describe hook normalization. This is a documentation inconsistency, not proof that either path rewrites entries.
- Inspected all 15 JavaScript entrypoints under `.opencode/plugins/` and the OpenCode registration vocabulary in `.opencode/plugins/README.md:81-94`.
- Read the existing Claude wrappers to compare their matchers, environment fallbacks, stdin fields, and output envelopes against Devin's documented contract. No production or adapter files were changed.

## Findings

### Native-import rules established by current Devin documentation

The current Devin hooks page documents `.claude/settings.json` and `.claude/settings.local.json` as hook sources when Claude import is enabled, and documents the hook entry fields as `type`, `matcher`, `command` or `prompt`, and `timeout`. It does not document any rewrite of matcher strings, command text, environment variables, or output envelopes. The lifecycle page defines matchers as regexes over Devin's externally visible `tool_name`; the documented names include `exec`, `edit`, and `mcp__<server>__<tool>`.

The same documentation says Devin provides `DEVIN_PROJECT_DIR`, while this repository's imported shell wrappers all use `CLAUDE_PROJECT_DIR` with `$PWD` as fallback. The documented Devin output contract uses top-level `decision` and `reason`, or `hookSpecificOutput` with `hookEventName`, `additionalContext`, and `updatedInput`. The Claude wrappers that can deny instead emit nested `hookSpecificOutput.permissionDecision` fields. Therefore native import can preserve an entry without preserving its enforcement semantics.

`async` is present on both Claude `Stop` entries (`.claude/settings.json:123-138`) but is absent from Devin's documented hook-entry schema. The actual handling of an unknown field—ignored, warned, or rejected—remains unverified. The safe ADR interpretation is “unsupported field; do not rely on it,” not “confirmed silently ignored.”

`PreCompact` is a hard lifecycle gap. Devin documents `PostCompaction`, which fires after compaction and receives `summary`; it does not expose a before-compaction event. An imported `PreCompact` registration therefore cannot preserve the original timing, regardless of whether `/hooks` displays or drops the entry.

### Claude hook coverage matrix

All commands below use the same wrapper cwd: `cd "${CLAUDE_PROJECT_DIR:-$PWD}"`. “Partial” means the registration may load, but effective Devin coverage needs a matcher, payload, cwd/env, or output adaptation. “Effective drop” means the entry may be accepted as configuration but will not observe the equivalent Devin event/tool under the current matcher or event name.

| ID | Event · matcher | Imported handler | Native import verdict | Reason |
|---|---|---|---|---|
| C-01 | `PreToolUse` · `Bash` | `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` · 5s | **Partial — effective drop on `exec`** | Devin calls the shell tool `exec`, not `Bash`; the wrapper also fast-exits unless `tool_name === "Bash"`. No matcher rewrite is documented. |
| C-02 | `PreToolUse` · `Bash` | `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` · 5s | **Partial — effective drop on `exec`** | Same matcher mismatch. If manually invoked, its deny envelope uses Claude `permissionDecision`, not Devin's documented top-level `decision`. |
| C-03 | `PreToolUse` · `Task` | `system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` · 5s | **Partial — effective drop on `run_subagent`** | Devin's documented dispatch tool is `run_subagent`; `Task` is not rewritten, and the wrapper checks for `task`. |
| C-04 | `PreToolUse` · `mcp__claude_ai_.*` | `mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` · 5s | **Partial — namespace mismatch** | Devin MCP names use `mcp__<server>__<tool>`. The Claude-specific server prefix will not match a generic Devin MCP server. |
| C-05 | `PreToolUse` · `Write\|Edit` | `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` · 5s | **Partial — effective drop on `edit`** | Devin's public file mutation tool is `edit`; `Write\|Edit` is not documented as rewritten. Path extraction and deny output also need Devin normalization. |
| C-06 | `UserPromptSubmit` · empty | `system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js` · 3s | **Partial, closest native candidate** | Event, empty matcher, `prompt`, and `additionalContext` align. The imported command still depends on its project-root discovery and has no live `/hooks` confirmation. |
| C-07 | `UserPromptSubmit` · empty | `system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` · 3s | **Partial, close transport match** | Devin supplies `prompt` and accepts the documented context envelope; the wrapper's `CLAUDE_PROJECT_DIR` fallback and runtime-specific state path remain unverified. |
| C-08 | `PreCompact` · empty | `system-spec-kit/mcp-server/dist/hooks/claude/compact-inject.js` · 3s | **Dropped for effective parity** | No Devin before-compaction event exists. `PostCompaction` is after-only and supplies `summary`; it cannot run this handler at the original point. Loader warning versus silent ignore is unknown. |
| C-09 | `SessionStart` · empty | `system-spec-kit/mcp-server/dist/hooks/claude/session-prime.js` · 3s | **Partial** | `SessionStart` and `source` exist in Devin, but this compiled hook reads Claude-oriented session/context state. Native loading is not equivalent to a Devin adapter until smoke-tested. |
| C-10 | `SessionStart` · empty | `.opencode/bin/worktree-guard.sh` · 3s | **Conditional 1:1** | Shell-only and event-compatible. It is portable if the imported command starts with the project as cwd; the command does not use Devin's explicit `DEVIN_PROJECT_DIR`. |
| C-11 | `SessionStart` · empty | `.opencode/bin/check-git-hooks.sh` · 3s | **Conditional 1:1** | Same shell-only/cwd condition as C-10. |
| C-12 | `SessionStart` · empty | `sk-code/code-quality/scripts/check-dist-staleness.sh --all` · 5s | **Conditional 1:1** | Shell-only and event-compatible; cwd is the only unresolved runtime assumption. |
| C-13 | `SessionStart` · empty | `.opencode/bin/install-codex-hooks.mjs --check ...` · 5s | **Conditional 1:1** | Shell-only, fail-open command with no Claude payload dependency; cwd and command exit handling still need a live check. |
| C-14 | `Stop` · empty | `system-spec-kit/mcp-server/dist/hooks/claude/session-stop.js` · 10s, `async:true` | **Partial** | `Stop` exists, but `async` is undocumented and the Devin Stop payload is smaller than the Claude transcript-oriented input used by this owner. Do not assume async execution or full autosave parity. |
| C-15 | `Stop` · empty | `system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs` · 10s, `async:true` | **Partial — effective evidence gap** | The handler requires `last_assistant_message`; Devin's documented Stop payload only supplies `stop_hook_active`. It will usually no-op without an adapter/state lookup, even if the command runs. |
| C-16 | `SessionEnd` · empty | `.opencode/scripts/session-cleanup.sh || true` · 10s | **Conditional 1:1** | Shell-only and Devin has `SessionEnd`; the `|| true` already masks cleanup failure. Cwd remains the only import assumption. |
| C-17 | `PostToolUse` · `Write\|Edit` | `sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs` · 10s | **Partial — effective drop on `edit`** | Matcher uses Claude names; Devin emits `edit`. The post payload also uses Devin's `tool_response` envelope, so native import cannot establish check parity. |
| C-18 | `PostToolUse` · `Write\|Edit` | `system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs` · 5s | **Partial — effective drop on `edit`** | Same matcher problem; path and response normalization differ, and OpenCode-only trailing-edge disposal is not imported. |
| C-19 | `PostToolUse` · `Bash` | `cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs` · 5s | **Partial — effective drop on `exec`** | Devin's equivalent is `exec`, and its result is nested under `tool_response`; neither the matcher nor the payload rewrite is documented. |

The top-level `statusLine`, `env`, and `skillListingBudgetFraction` entries in `.claude/settings.json:2-13` are not lifecycle hook registrations. Their behavior is not covered by this matrix and must not be treated as imported guard configuration.

### OpenCode plugin coverage matrix

Native Claude import does not load `.opencode/plugins/*.js`. Devin hooks can reproduce selected lifecycle behavior, but cannot import OpenCode's plugin factory or registration vocabulary (`tool`, `tool.execute.*`, system/message transforms, compaction transform, `event`, and `dispose`) as-is.

| Plugin | OpenCode registration surface | Devin verdict | Port boundary |
|---|---|---|---|
| `mk-cli-dispatch-audit.js` | `tool.execute.after` | **Needs adaptation** | `PostToolUse(exec)` plus `tool_response` normalization; shared audit core is reusable. |
| `mk-code-graph-freshness.js` | `tool.execute.before/after`, `event`, disposal | **Needs adaptation** | `PostToolUse(edit)` and optional `SessionStart`; no OpenCode disposal/timer lifecycle. |
| `mk-code-graph.js` | status `tool`, system/message transforms, compaction transform, session events | **Cannot port 1:1** | Transport-backed bridge and context transforms have no Devin hook equivalent; only selected lifecycle work can be rebuilt. |
| `mk-codex-hooks-watchdog.js` | session-created `event` | **Needs adaptation** | Behavior can be a Devin `SessionStart` command, not an imported plugin. |
| `mk-completion-sentinel.js` | `session.created`, `session.idle` events | **Needs adaptation** | Map to `Stop`, but obtain assistant claim text and active spec folder separately. |
| `mk-deep-loop-guard.js` | `event`, `tool.execute.before` | **Needs adaptation** | Map OpenCode task input to Devin `run_subagent`; keep the shared dispatch core. |
| `mk-dist-freshness-guard.js` | before-tool, system transform, session/disposal events | **Needs adaptation** | Use `PreToolUse` and `SessionStart`; inject diagnostics through Devin context output. |
| `mk-goal.js` | goal tools, system transform, session/message/permission/question events | **Cannot port 1:1** | Devin has no OpenCode tool registration or generic message/question lifecycle. |
| `mk-mcp-route-guard.js` | `tool.execute.before` | **Needs adaptation** | Strong `PreToolUse(mcp__.*)` mapping; translate project root and output. |
| `mk-post-edit-quality.js` | before/after tool hooks, system transform | **Needs adaptation** | Map to Devin `PreToolUse`/`PostToolUse(edit)`; use Devin context output instead of system transform. |
| `mk-skill-advisor.js` | status tool, system transform, session/disposal events | **Needs adaptation** | `SessionStart`/`UserPromptSubmit` can carry a brief; status tool and transforms are not imported. |
| `mk-spec-gate.js` | system transform, before-tool guard, session events | **Needs adaptation** | `UserPromptSubmit`/`PreToolUse` map well after tool, cwd, state, and output translation. |
| `mk-spec-memory.js` | status tool, system transform, session/disposal events | **Needs adaptation** | Rebuild lifecycle/context injection; no direct plugin import. |
| `mk-speckit-completion.js` | read-only registered `tool` | **Cannot port 1:1** | Expose as a script/skill or omit; Devin hooks do not register OpenCode tools. |
| `session-cleanup.js` | session events, system transform, `dispose` | **Needs adaptation** | `SessionStart`/`SessionEnd` cover useful cleanup; `dispose` has no direct Devin event. |

### ADR-001 implication

Native Claude import can be retained as a compatibility baseline for the four shell-only `SessionStart` commands and the shell-only `SessionEnd` cleanup, subject to the project-cwd assumption. It is also a reasonable smoke-test baseline for the two `UserPromptSubmit` handlers because Devin supplies `prompt` and supports the same context envelope. It is not sufficient as the authoritative path for the seven guard cores: the current matchers do not select Devin's tool names, Claude deny envelopes are not Devin's documented decision shape, and the completion sentinel lacks its required Stop evidence input.

The smallest safe authoritative set remains explicit Devin adapters for the seven guard cores, with `PostCompaction` handled as a separate after-compaction adapter rather than a pretend `PreCompact` import. OpenCode plugins require their own selected lifecycle adapters or an explicit omission decision; they are not covered by `read_config_from.claude`.

## Questions Answered

- Q1: The live `.claude/settings.json` contains 19 hook commands. The full event, matcher, cwd wrapper, handler, timeout, and import verdict are in the C-01–C-19 matrix.
- Q2: The live `.opencode/plugins/` directory contains 15 plugin entrypoints. Their registration surfaces and Devin verdicts are in the plugin matrix.
- Q3: Current Devin docs retain the eight-event contract used by phase 001: `PreToolUse`, `PostToolUse`, `PermissionRequest`, `UserPromptSubmit`, `Stop`, `PostCompaction`, `SessionStart`, and `SessionEnd`; the documented entry shape is `type`, optional regex `matcher`, `command` or `prompt`, and optional `timeout`.
- Q4: Every Claude hook and OpenCode plugin has a row-level verdict. The main failure modes are unchanged matchers, missing Devin payload fields, `CLAUDE_PROJECT_DIR` versus `DEVIN_PROJECT_DIR`, undocumented `async`, incompatible deny envelopes, and OpenCode-only lifecycle surfaces.
- Q5: `read_config_from.claude:true` can reduce duplication for simple lifecycle shell commands and can serve as a prompt-context compatibility baseline. It cannot replace the seven guard adapters or the OpenCode plugin ports.
- Q6: The two matrices plus the native-import rules are ready as ADR-001 evidence, with live `/hooks` behavior explicitly separated from documented or inferred behavior.

## Questions Remaining

- Run Devin `/hooks` in a real session and record whether `PreCompact` is ignored, warned, or rejected, and whether `async` is ignored or surfaced.
- Smoke-test stdout and exit handling for imported `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PostCompaction`, `SessionStart`, and `SessionEnd` commands, especially Claude nested `permissionDecision` output.
- Capture one real Devin `PreToolUse` event to confirm `run_subagent`, `edit`, tool identity, `cwd`, and the exact edit input fields.
- Decide how the completion sentinel obtains `last_assistant_message` and the active spec folder under Devin `Stop`.
- Fold the confirmed live-import result into `004-devin-hook-adapter-layer/decision-record.md` before implementation claims parity.

## Next Focus

Iteration 5 — live Devin import verification: inspect `/hooks`, then run representative command hooks to distinguish accepted-but-mismatched entries from entries that Devin drops or rejects.

## SCOPE VIOLATIONS

None. Only this iteration narrative, the append-only state record, and this iteration's delta file are in scope.
