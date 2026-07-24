# Iteration 2 — Devin subagent dispatch contract and Task-guard portability

## Focus

Confirm the exact Devin CLI subagent dispatch tool and input shape, then decide whether the repository's Claude `PreToolUse(Task)` guard can target Devin `PreToolUse` without changing the shared policy core.

## Actions Taken

- Re-read the active research state, strategy, registry, phase 001 contract summary, and iteration 001 before investigating the carried-forward question.
- Read the current Devin lifecycle-hook and subagent documentation.
- Inspected the installed Devin CLI v3000.2.17 binary's embedded tool-schema strings to recover the dispatch input field names that the public subagent page does not enumerate.
- Compared that contract with `.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs`, the OpenCode deep-loop plugin adapter, and the live Claude `Task` matcher in `.claude/settings.json`.
- Checked the local Devin CLI surface for `/hooks` support. A live `/hooks` verification was not possible: `devin auth status` currently aborts while initializing its rolling log file with `PermissionDenied`, before reporting authentication state.

## Findings

### 1. Devin's dispatch tool is `run_subagent`, not `Task`

The current Devin subagent documentation names the built-in dispatch tool as `run_subagent` and the companion inspection/resume tool as `read_subagent`. It also states that `run_subagent` selects a profile rather than a model. The installed v3000.2.17 binary contains the following input descriptions for `SubagentInput`:

| Devin tool | Input fields exposed by the installed schema | Evidence | Port implication |
|---|---|---|---|
| `run_subagent` | `title`, `prompt`, `profile`, `is_background`, `resume` | `strings ~/.local/share/devin/cli/_versions/3000.2.17/bin/devin` around the embedded `SubagentInput` help | Match `^run_subagent$`; map `prompt` and `profile`; do not look for Claude's `subagent_type` or `run_in_background`. |
| `read_subagent` | Companion tool named by the public subagent docs; no dispatch decision is made here | [Devin Subagents](https://docs.devin.ai/cli/subagents), lines 154 and 245-249 | Do not attach the dispatch guard to this tool unless a separate resume/read policy is intended. |

The binary inspection establishes the field names for this installed version, but it does not prove which fields are optional or the exact runtime value constraints. That is the remaining payload-level caveat.

### 2. The existing Claude Task guard cannot be imported 1:1

The Claude registration matches `Task` at `.claude/settings.json:31-39`. The guard itself exits early unless `payload.tool_name.toLowerCase() === "task"` and then reads `tool_input.subagent_type`/`subagentType`, `tool_input.prompt`, `session_id`, and `cwd` or `CLAUDE_PROJECT_DIR` (`task-dispatch-guard.cjs:35-46`). Devin supplies `run_subagent`, `profile`, `prompt`, `is_background`, `resume`, `session_id`, and `DEVIN_PROJECT_DIR` instead.

Therefore:

| Source surface | Devin mapping | Verdict | Rationale |
|---|---|---|---|
| Claude `PreToolUse(Task)` registration | `PreToolUse` matcher `^run_subagent$` | needs adaptation | Native Claude import preserves the `Task` matcher, so it cannot see Devin's `run_subagent`. |
| Claude `task-dispatch-guard.cjs` transport boundary | Devin command hook | needs adaptation | The shared policy can remain reusable, but the adapter must map `profile` to the policy's subagent-type input, read `DEVIN_PROJECT_DIR`, and emit Devin's top-level `decision`/`reason` or `hookSpecificOutput` form. |
| Shared `dispatch-guard.cjs` policy | Normalized `{subagentType, prompt, sessionID, projectDir, env}` object | portable core, not portable transport | The policy's normalized input is already runtime-neutral; the current Claude/OpenCode wrappers are the non-portable layer. |
| OpenCode `mk-deep-loop-guard.js` | OpenCode `tool.execute.before` for `task` | needs adaptation | It has the same policy intent but receives `input.tool` and `output.args`; Devin receives hook stdin with `tool_name` and `tool_input`, and its dispatch tool is `run_subagent`. |

The recommended adapter matcher is `^run_subagent$`, not `run_subagent` or `Task`, because Devin documents hook matchers as regular expressions over the externally visible `tool_name`. The public tool list names `read`, `edit`, `grep`, `glob`, and `exec`, while noting that the complete set varies by mode and integrations; the installed CLI schema is the stronger evidence for the subagent tool name.

### 3. Payload normalization has one semantic gap, not just a naming gap

`profile` is the Devin concept closest to Claude's `subagent_type`, but it is not necessarily the same domain. Devin documents built-in `subagent_explore` and `subagent_general` profiles plus custom profiles. The existing dispatch policy should therefore receive either a deliberate profile-to-policy mapping or the raw profile as a newly supported normalized field; silently treating arbitrary Devin profiles as Claude agent types would make the guard's route checks under-specified.

`is_background` is also not the Claude field name `run_in_background`. `resume` can identify a continuation of an existing subagent rather than a new hand-off. The adapter must decide whether the guard applies the same repeated-dispatch policy to resumed calls or bypasses that policy for an existing subagent. This is an implementation decision for the adapter layer, not evidence that the policy core is unusable.

### 4. Native Claude import is a baseline, not a substitute for the adapter layer

Devin documents that Claude settings are loaded when `read_config_from.claude` is enabled (the default), and the hooks overview lists `.claude/settings.json` as a supported hook source. That makes native import useful for compatibility testing and for the simplest shell-only lifecycle commands.

It does not remove the adapter requirement:

- `Task`, `Bash`, `Write|Edit`, and `mcp__claude_ai_.*` are Claude matcher names. Devin's matching surface is `run_subagent`, `exec`, `edit`, and Devin-visible MCP names, so imported matchers do not select the same calls.
- `UserPromptSubmit` has a matching Devin event, but imported handlers must consume Devin's `prompt` payload and Devin output semantics; an empty matcher alone does not normalize Claude-specific fields.
- `PreCompact` has no Devin equivalent. Devin exposes `PostCompaction`, which runs after compaction and supplies `summary`; it cannot preserve a before-compaction invariant through import.
- OpenCode plugins are not imported as plugins. Devin's configuration-import reference lists OpenCode MCP-server import, not OpenCode plugin factories, `tool.execute.before/after`, chat transforms, session events, or disposal hooks.
- The imported shell wrappers use `CLAUDE_PROJECT_DIR` but fall back to `$PWD`, while Devin documents `DEVIN_PROJECT_DIR`. This is a plausible compatibility path for cwd-only scripts, not a confirmed 1:1 contract for all wrappers.
- Devin documents `command`, `prompt`, `matcher`, and `timeout` in its hook entry shape; the repository's Claude `async` fields and Claude-specific decision/output forms still require live compatibility testing.

The ADR-level decision from this iteration is: enable native Claude import only as a compatibility baseline for candidate shell hooks; keep explicit Devin adapters authoritative for deny-capable policy hooks, payload normalization, and any event with changed timing or missing Devin coverage.

### 5. Live import behavior remains unverified

The Devin binary exposes an interactive `/hooks` command, but this environment has no usable live session for exercising it. `devin auth status` aborted before the auth check because the CLI could not initialize its rolling log file (`PermissionDenied`). No hook configuration was created or modified during this iteration, and no imported hook was executed.

This leaves one narrow unknown: whether the current importer ignores, warns on, or rejects the unsupported `PreCompact` entry in this repository's `.claude/settings.json`. The static contract already establishes that it cannot become a true before-compaction hook; only the importer's user-visible handling is unknown.

## Questions Answered

- The exact Devin dispatch tool is `run_subagent`; `read_subagent` is the companion control/read tool.
- The installed Devin v3000.2.17 schema exposes `title`, `prompt`, `profile`, `is_background`, and `resume` for subagent dispatch input. Requiredness and value constraints remain unverified.
- The Claude `Task` guard can be adapted to Devin `PreToolUse`, but not imported 1:1. The adapter matcher should be `^run_subagent$`.
- The runtime-neutral dispatch policy is reusable after normalization; the Claude and OpenCode transport adapters are not directly reusable without a Devin adapter.
- Native `read_config_from.claude:true` import can serve as a baseline for compatible command hooks, but it cannot replace explicit adapters for the Task guard, OpenCode plugins, `PreCompact`, or Claude-specific payload/output semantics.

## Questions Remaining

- Run Devin `/hooks` against this repository with a working session and determine whether the imported `PreCompact` entry is ignored, warned, or rejected, and whether `async` is ignored or surfaced.
- Smoke-test stdout/exit handling for the imported shell wrappers and the future Devin adapters, especially top-level `decision` versus Claude `hookSpecificOutput.permissionDecision`.
- Confirm `run_subagent` required fields and the runtime representation of `resume` with one real `PreToolUse` capture; the installed binary schema names the fields but does not expose all validation constraints through `strings`.
- Fold this confirmed subagent row into the complete per-hook/per-plugin matrix and ADR-001 evidence table in a later synthesis pass.

## Next Focus

Validate the native Claude-settings import boundary and command-hook output semantics, then use those observations to finalize the complete adapter/import matrix.

## SCOPE VIOLATIONS

None. Only the iteration narrative, append-only state record, and this iteration's delta file are written.
