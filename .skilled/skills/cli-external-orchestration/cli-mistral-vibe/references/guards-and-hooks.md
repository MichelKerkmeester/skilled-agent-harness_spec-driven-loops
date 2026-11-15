---
title: "Mistral Vibe - Guards and Hooks"
description: "The seven Vibe hook types, which accept `strict`, where a project declares a hook and when it loads, which of the 21 OpenCode plugins port to each type, and the wire format a keyed fixture recorded."
trigger_phrases:
  - "vibe hooks"
  - "vibe hooks.toml"
  - "vibe strict hook"
  - "vibe pre_tool hook"
  - "vibe post_agent"
  - "vibe guard porting"
importance_tier: normal
contextType: implementation
version: 1.3.5.0
---

# Mistral Vibe - Guards and Hooks

A Vibe hook is a command the runtime runs at one of seven moments, not a plugin it loads. Read this before deciding that a repository guard can run inside a Vibe session: the moment a guard needs and the moment Vibe offers are rarely the same one, and the two turn-stopping guards have no moment at all.

---

## 1. OVERVIEW

### Purpose

Records the seven hook types, which accept `strict`, where a project declares one and when that file loads, and which of the 21 OpenCode plugins port to which type.

### When to Use

- Deciding whether a repository guard can run inside a Vibe session.
- Writing or reviewing `.vibe/hooks.toml`.
- Checking why a declared hook never fired.
- Planning a guard port against the recorded wire format (section 5).

### Status

`.vibe/hooks.toml` declares the guard bundle under `.vibe/plugins/repo-guards/` and one `session_start` entry for the goal and context hook. The project file loads only from a trusted project root (section 3), so it reaches a Vibe session opened in the trusted checkout. A dispatch from a scratch cwd and a fan-out lineage get the same hooks another way: `render-home-hooks.cjs` writes them into the run's disposable `VIBE_HOME` with every script anchored to the checkout by absolute path, and Vibe loads the home file whatever the cwd. A keyed scratch-cwd run proved the home copy: the journal's `pre_tool_call` and `post_tool_call` requests name the `user:` guard bindings, the first turn carried the goal slice, and a child write went through. The wire-format fixture under `.vibe/plugins/repo-guards/fixtures/wire-format/` has run keyed sessions on 3.1.2: one hook captured its `pre_tool` input and denied a shell call, and an allow-only hook gave `NOT-DENIED`. Phases 014 to 019 replaced the rest of the seam map with recorded runs: the turn-start composer and its advisor, dist, completion, save and compaction parts; the turn-end composer and its ask-surface reprompt; the decision-capture adapter and its save-time sweep; the compaction re-injection; and the command-only relaunch tier. Each row in section 4 names the run that proved it. The strict rules below remain source readings from the validator and the harness runner, except the `pre_tool` deny the wire fixture observed and the `post_agent` retry cap phase 014 recorded.

### Evidence Base

| What it pins | Path |
|---|---|
| The seven types, the strict set, the hook fields and the default timeout | `vibe/core/hooks/models.py:20-27,31-35,65,71-78,94-101` |
| The `[[hooks]]` file shape, parse issues and duplicate names | `vibe/core/hooks/config.py:17-24,49-91,94-116` |
| The trust gate and the hook file list | `vibe/core/config/harness_files/_harness_manager.py:99-106,119-144` |
| Run order across project and user files | `vibe/app_server/_runtime.py:2741-2753` |
| Host-hook behavior and the host stdout reader | `vibe/app_server/_host_hooks.py:1-14,65-83,178-202` |
| The engine-hook runner and its fail actions | `mistralai_vibe_local_harness/vibe/_foreign_hooks.py:1-25` |
| The parity table and the eliminated alternatives | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/research.md` sections 6 and Eliminated Alternatives |
| The port this file plans | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/008-vibe-repo-guards/spec.md` |
| The `post_agent` retry cap and the stable turn id | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/014-vibe-journal-fixture-and-reader/scratch/facts.md` Q1 and Q2 |
| The turn-start, turn-end, decision-capture, compaction and relaunch runs | The `implementation-summary.md` verification tables in `015-vibe-turn-start-advisor-and-dist` through `019-vibe-relaunch-command-tier` |

The package paths are relative to `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/`, the install under study at `vibe 3.1.2`.

---

## 2. HOOK TYPES

`HookType` declares seven members (`models.py:20-27`). Three accept `strict` (`models.py:31-35`), and the model validator raises a `strict is only valid for ... hooks` error on any other type (`models.py:94-98`).

| Type | `strict` | Fires | What it can decide |
|---|---|---|---|
| `pre_tool` | yes | Before a tool call | Refuse the call (`_foreign_hooks.py:14`). The only pre-execution seam a guard can use. |
| `post_tool` | yes | After a tool call | Blank the tool result on a strict failure (`_foreign_hooks.py:15`); no run has shown it. |
| `pre_agent` | yes | Before an agent turn | Block the message before the turn runs (`_foreign_hooks.py:16-17`). |
| `post_agent` | no | After an agent turn | A deny sends a retry message the model answers, capped at three retries per turn; the fourth invocation is force-accepted. `strict` is rejected on a declared hook (`_foreign_hooks.py:18-20`), so the deny is the seam, not a held turn (phase 014 recorded `retry, retry, retry, accept`). |
| `notification` | no | An approval or question opens; the main turn completes or fails | Nothing: it runs in the background and its output is ignored (`_host_hooks.py:6-8`). |
| `session_start` | no | A session opens: `startup`, `resume`, `clear` or `fork` | Add `additional_context` to the session's next user message (`_host_hooks.py:9-12,65-83`). |
| `session_end` | no | A session closes: `exit`, `clear` or `other` | Nothing: it runs in the background and its output is ignored (`_host_hooks.py:13-14`). |

The last three are host hooks: the app server fires them outside the engine's turn (`models.py:37-42`). The first four are engine hooks, and only the engine hooks can refuse work.

### What `strict` Buys

`strict` declares that a failing hook blocks instead of letting the call through. The validator enforces which types may carry it (`models.py:94-98`), and the harness runner's docstring maps a strict failure to a deny at `pre_tool`, a blanked result at `post_tool` and a blocked message at `pre_agent` (`mistralai_vibe_local_harness/vibe/_foreign_hooks.py:9-20`). `post_agent` rejects `strict`, but its conforming deny is not inert: Vibe returns the reason as a retry message, repeats the turn and force-accepts the fourth invocation. Phase 014's `DENY_MODE=always` fixture recorded `retry, retry, retry, accept`, and `turn_id` stayed the same on all four (`scratch/journal-excerpts/deny-always-hook-outcomes.jsonl`). That retry is the seam the turn-end composer uses (section 4), not a held turn. No run has shown a strict failure at any type; the `pre_tool` deny the wire fixture observed is a conforming deny.

### Protocols

`HookProtocol` declares `vibe`, `claude_code` and `kimi_code` (`models.py:59-63`), so a Claude-format hook script is a candidate porting source. `protocol` is a runtime field on `RuntimeHookDefinition` (`models.py:113`), not a `HookConfig` field (`models.py:71-78`), and the default file loader ignores keys it does not model (`config.py:17-24`). A `protocol = "claude_code"` line in `hooks.toml` is therefore not how the protocol is selected; the loader or plugin that registers the hook sets it.

---

## 3. DECLARATION AND LOADING

### The File

A project declares hooks in `.vibe/hooks.toml` at the project root; discovery is root-only, like the rest of `.vibe/` ([runtime-folder-and-sync.md](./runtime-folder-and-sync.md) section 2). The file holds a `[[hooks]]` array (`config.py:17-24`), and each entry carries these fields (`models.py:71-78`):

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Unique across every loaded file; a duplicate is dropped with an issue (`config.py:105-113`). |
| `type` | yes | One of the seven in section 2. |
| `command` | yes | A non-blank command string, run as a subprocess. |
| `match` | no | An optional selector string; it must not be blank when set (`models.py:87-92`). |
| `timeout` | no | Seconds; defaults to 60.0 (`models.py:65,99-101`). |
| `strict` | no | Defaults to false; only the three types in section 2 accept it. |
| `description` | no | Free text. |

### The Trust Gate

The project file loads only in a trusted folder. `_trusted_workdir` returns `None` when the project source is disabled or the cwd is not in the trust store (`_harness_manager.py:99-106`), and `hook_files` builds `<root>/.vibe/hooks.toml` from the project roots (`_harness_manager.py:137-144`). The roots are the trusted cwd plus every `--add-dir` path (`_harness_manager.py:119-135`), so an add-dir root contributes its own file because the operator named it, even when the cwd is untrusted; `$VIBE_HOME/hooks.toml` loads from the home when the user source is enabled (`_harness_manager.py:142-143`).

Project hooks sit behind the same trust gate as `.vibe/config.toml` ([runtime-folder-and-sync.md](./runtime-folder-and-sync.md) section 2): the folder holding the file must be trusted. `--trust` from a subdirectory trusts only that subdirectory, so a run that must load the repository's hooks lists the checkout root in its home's `trusted_folders.toml`. An untrusted run loads none of them, and no error says so. The home file is the way around the gate: `$VIBE_HOME/hooks.toml` loads under the user source, which is on by default, with no trust entry. The project file names its scripts through `$(git rev-parse --show-toplevel)`, which fails outside the checkout, so the home copy replaces that expression with the resolved root, and the renderer refuses the operator's own `~/.vibe`, where the guards would reach every Vibe session on the machine.

### Load Order and Failures

Hooks run project file, project plugins, user file, then global plugins (`_runtime.py:2752-2753`). A duplicate `name` keeps the first and records an issue for the rest (`config.py:105-113`). A file that fails to parse contributes no hooks and records why (`config.py:56-61,69-75`); the session surfaces those issues as config notices rather than dropping them silently (`_runtime.py:2709-2715`).

A declared hook that never fires is the failure mode to check first: an untrusted folder, a `type` Vibe rejected, or a duplicate name all leave the call unguarded while the run continues.

---

## 4. PLUGIN CLASSIFICATION

Vibe never imports or evaluates OpenCode's JavaScript or TypeScript plugins (`vibe/core/plugins/_foreign.py:310`, research section 6), so every plugin in `.opencode/plugins/` is re-expressed as a hook, a skill or nothing. The table classifies all 21; the verdict names the seam, and the reason sits in the row.

| Plugin | What it does | Verdict | Vibe event |
|---|---|---|---|
| `system-spec-gate.js` | Classifies the operator prompt for file-mutation intent and denies a Write/Edit while the session gate is open and unanswered. | hook — a `pre_tool` hook never sees the prompt, so a `pre_agent` hook classifies it and persists the gate state the strict `pre_tool` half reads. A child session, marked by the inherited `AI_SESSION_CHILD=1` or a parent id in the payload, is never denied | `pre_agent`, `pre_tool` (strict) |
| `cli-dispatch-audit.js` | Denies a Bash dispatch that breaks a skill's hard rules, then appends one redacted audit line per completed dispatch. | hook | `pre_tool` (strict) |
| `env-secret-guard.js` | Denies a call that would read or write a dotenv file, and registers three value-free dotenv inspection tools. | hook | `pre_tool` (strict) |
| `overlay-guard.js` | Denies a write to a file a vendored tree's overlay owns and names the overlay file to edit instead. | hook | `pre_tool` (strict) |
| `mcp-route-guard.js` | Logs a routing advisory when a native external MCP call has a Code Mode manual registered for its family; the port refuses the call instead of logging it. | hook | `pre_tool` (strict) |
| `sk-git-message-gate.js` | Refuses a `git commit` message, `gh pr` description or branch name that breaks the repository's sk-git templates. | hook | `pre_tool` (strict) |
| `system-deep-loop-guard.js` | Blocks a `task` dispatch to a deep-loop subagent whose declared mode disagrees with `mode-registry.json`, or a repeated loop-like dispatch. | hook — Vibe spawns subagents through `agents_spawn`, so the guard matches that tool and reads `tool_input.config_name` | `pre_tool` (strict) |
| `sk-code-post-edit-quality.js` | Runs the post-edit quality router on each write and buffers the findings for the next system transform. | hook | `post_tool` (strict) |
| `opencode-goal.js` | Keeps a session goal record, refreshes it on idle and injects the packet's goal slice into the system prompt. | hook | `session_start` |
| `session-cleanup.js` | Runs the startup guards on session create and the cleanup script and process sweep on dispose. | hook — both lifecycle moments exist as host hooks | `session_start`, `session_end` |
| `system-dist-freshness-guard.js` | Warns when a session or a risky Bash command is about to trust stale local dist outputs. | hook — `session_start` injects the warning as `additional_context`, and a non-strict `post_tool` entry adds the mid-session `STALE DIST WARNING` to the tool result after a write, edit or matched shell command (phase 015's keyed child run) | `session_start`, `post_tool` |
| `system-skill-advisor.js` | Injects the skill advisor brief into each request's system text and exposes the advisor status tool. | hook — the `pre_agent` turn-start composer routes each main-session prompt through the shared advisor handler under the `vibe` label, so the brief arrives as `additional_context` (phase 015's keyed main-session run recorded `Advisor: no skill matched.`) | `pre_agent` |
| `ask-surface-guard.js` | Reopens a finished turn when it closed with a prose option menu instead of the `question` tool. | hook — a non-strict `post_agent` part reads the finished turn through the journal reader and returns the prose menu once with the `ask_user_question` reprompt (phase 016's ten fixture cases; a live TUI retry stays operator-only) | `post_agent` |
| `system-completion-sentinel.js` | Checks a turn's closing text for a completion claim and sends the evidence gap back to the model. | hook — a `post_agent` part records the gap as a pending advisory and the next turn's `pre_agent` composer delivers it once; the part never denies (phase 016's fixture suite and print-mode smoke run) | `post_agent`, `pre_agent` |
| `session-handover.js` | Arms a relaunch near the context limit, writes a hand-off note and restarts the session under a supervisor. | hook, because Vibe's turn boundaries reach it: the `pre_agent` turn-start composer runs the context part last and the `post_tool` compaction binding runs it too, so at a turn start it expands a claim seed or withdraws an armed hand-over when the operator types, and at either event it nudges once the fill passes the threshold. The fill is the newest measured `input_tokens` in the session journal and the window is Vibe's `compaction_threshold`, which `SESSION_HANDOVER_WINDOW_TOKENS` overrides. The `post_agent` turn-end composer runs the arm part last, which arms a pending record and starts the killer and never denies. It ships off by default and `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED` turns it on, and an interactive Vibe exits 0 on the killer's SIGTERM. A hand-over the operator starts by typing `/speckit-handoff` prepares with a `uuidgen` id, is not armed and prints the claim command, while a nudged hand-over carries the real id and arms | `pre_agent`, `post_tool`, `post_agent` |
| `classifier-injection-screen.js` | Screens fetched web text for instructions aimed at the agent and buffers an advisory for the next system transform. | hook — a non-strict `post_tool` hook on the fetch tool appends the advisory as `additional_context` to the result the model reads | `post_tool` |
| `decision-capture.js` | Queues each answered `question` call as a decision record and nudges the next request toward `/speckit:save`. | hook — a non-strict `post_tool` adapter on `ask_user_question` queues each answer through the shared Vibe mapper, the save-time `sweep-vibe.mjs` replays the journal when the live hook did not fire, and the turn-start part reminds the model once per rising count; the live widget is interactive-only (phase 017's fixture suites) | `post_tool`, `pre_agent` |
| `codex-hooks-watchdog.js` | Runs the Codex hook installer's `--check` at session start and logs drift in `~/.codex/hooks.json`. | not needed — it watches a file a Vibe session never reads | none |
| `sk-git-preflight-advisory.js` | Evaluates Bash git commands against the sk-git rule engine and buffers up to three advisories for the next request. | not needed — the same rules are stated in sk-git's skill docs, and no tool hook can inject an advisory | none |
| `system-speckit-completion.js` | Registers a read-only tool that returns a spec folder's level, checklist completion and placeholder percentage. | not needed — Vibe has no plugin tool registry, and the same payload comes from the spec-kit CLI the agent already runs | none |

Phase 008 builds the ten `hook` rows that guard a call or a session boundary: the seven `pre_tool` guards, the two `post_tool` hooks (post-edit quality and the injection screen) and the lifecycle cleanup hook. Phase 011 builds the `session_start` context injectors, the goal bridge and the dist-freshness warning. Phases 014 to 019 add the composition seams: the `pre_agent` turn-start composer (advisor, completion advisory, save nudge and compaction re-injection), the `post_agent` turn-end composer (completion advisory and ask-surface reprompt), the non-strict `post_tool` decision capture and compaction binding, and the command-only relaunch tier. Each landed with the run its `implementation-summary.md` records.

### Why the Deny-Capable Guards Land on `pre_tool`

The seven `pre_tool` rows all refuse a call before it runs, which is the one thing `pre_tool` does and the only engine seam that fires before a tool call. `pre_tool` also accepts `strict`, so a failing guard blocks instead of allowing. The dispatch preflight is the one row the research maps to both `pre_tool` and `pre_agent`; the classification lands it on `pre_tool` alone, because the hard-rule engine reads the Bash command, which exists only at the tool call.

The self-invocation row in research section 6 has no `.opencode/plugins/*.js` file behind it: the check is a router-level rule in the cli-claude-code packet, so it has no row above. For Vibe it is the self-invocation refusal at the top of [SKILL.md](../SKILL.md), which reads `VIBE_SESSION=1`.

### Why Post-Edit Quality Lands on `post_tool`

`sk-code-post-edit-quality.js` reads the edited file after the write, so it needs the post-call seam, and `post_tool` accepts `strict`. The OpenCode plugin splits the work across `tool.execute.before` and `tool.execute.after` because its after-hook receives no file path; Vibe's documented `post_tool` payload carries `tool_input` beside `tool_output_text` (`vibe/plugins/builtins/vibe/skills/vibe/SKILL.md:919-929`), so a hook can read the call's arguments without a stash. The fixture captured the `pre_tool` payload, not `post_tool`, so that shape is documented rather than observed.

### The Goal Bridge Is a `session_start` Hook

`opencode-goal.js` keeps a goal object and refreshes it on `session.idle` and a system-prompt transform. Vibe has no goal service that reads `goal.md`, so the port injects text instead of building an object: one `session_start` hook returns the packet's `chat_slice` as `additional_context`, and Vibe adds it to the session's next user message, out of the user's sight (`_host_hooks.py:9-12`). Phase 011 builds the goal slice and the session context as one entry.

`session_start` does not accept `strict`, and it does not need to: it injects context, and a failure loses the context rather than blocking the run (`_host_hooks.py:319-339`). It fires for a main session, not a subagent (`_host_hooks.py:9,419`), so a Vibe subagent starts without the slice. A scratch-cwd dispatch and a fan-out lineage receive the slice only through the rendered home hooks and only when `VIBE_SPEC_FOLDER` names the packet, and a session whose hook fails loses it. The prompt must always carry the task.

### What Is Not Portable

- **A hand-over started by command, and a guarded headless resume.** Vibe gives its tools no session id, so `/speckit:handoff` prepares with a `uuidgen` id, is not armed and prints the claim command, while a nudged hand-over carries the real id and arms. A guarded headless resume is UNVERIFIED: Vibe rejects `--model` on `--resume` (`--model only applies to a new session`), while the `vibe-closed-roster` rule refuses a resume without it.
- **A live `ask_user_question` capture in a headless run.** Vibe removes the question tool from a non-interactive session, so the `post_tool` adapter can only fire in the TUI. Phase 017 proved the mapper and the dedup key on fixture journals and left the live capture to an operator procedure; `sweep-vibe.mjs` replays the journal at save time, so a headless answer still reaches the queue.
- **A turn a `post_agent` deny holds open.** Vibe turns the deny into a retry message and force-accepts after three retries, so the turn-end composer can steer one retry but cannot keep the turn open. It records the completion advisory for the next turn instead of denying again (phase 016).

### A Denial Is Not a Failed Run

A refused tool call returns to the model as a tool error, and the run can still exit `0` (research section 3). The fixture run confirmed it: the deny left `exit_code` `0` and `outcome` `finished` in `export.json`, and the deny itself is recorded only in the session journal (section 5). A strict hook therefore does not make a run fail; it makes one call unavailable. The audit reads the journal for the decision and `export.json` for the run's outcome ([cli-reference.md](./cli-reference.md) section 6).

---

## 5. WIRE FORMAT

A hook is a shell command run in the session working directory. It receives one JSON object on stdin, discriminated by `hook_event_name`, and answers with an exit code plus stdout. The fixture under `.vibe/plugins/repo-guards/fixtures/wire-format/` recorded both halves in keyed `vibe -p` runs on 3.1.2: one hook captured its input and denied a shell call, and an allow-only hook gave `NOT-DENIED`.

### The Input

`captured-pre-tool-input.json` holds the object a `pre_tool` hook received:

```json
{
  "session_id": "<session_id>",
  "transcript_path": "<transcript_path>",
  "cwd": "<cwd>",
  "parent_session_id": null,
  "hook_event_name": "pre_tool",
  "tool_name": "file_system.bash",
  "tool_call_id": "<tool_call_id>",
  "tool_input": {
    "timeout": 120,
    "command": "echo fixture-ran"
  }
}
```

`tool_name` is the qualified name, `file_system.bash`, while a `match` selector accepts either that or the short `bash` (`SKILL.md:854-858`). `tool_input` holds the model's arguments, here `command` and `timeout`. `parent_session_id` is `null` in a main session and set inside a subagent.

The other six payloads are documented in the installed package's hook documentation (`vibe/plugins/builtins/vibe/skills/vibe/SKILL.md:877-930`, cited below as `SKILL.md`): `pre_agent` adds `agent_name`, `turn_id` and `prompt`; `post_tool` adds `tool_status`, `tool_output`, `tool_output_text`, `tool_error` and `duration_ms`; `session_start` carries `source`, `session_end` carries `reason`, and `notification` carries `notification_type` and `message`. Only the `pre_tool` and `post_agent` payloads were captured, so the other five are documented rather than observed.

### The Reply

A hook answers with its exit code and stdout; stderr carries diagnostics and is never parsed for control (`SKILL.md:935-943`).

| Exit | Stdout | Result |
|---|---|---|
| `0` | empty | Pass. The call proceeds. |
| `0` | a conforming JSON object | Act on its fields. `{"decision": "deny", "reason": "..."}` refuses the call, and the reason becomes the tool error the model sees. |
| `0` | anything else | Failure path: free-form text, broken JSON, a scalar, an array or a schema mismatch. |
| non-zero, timeout or spawn failure | — | Failure path. |

The fixture's hook printed this on stdout and exited `0`:

```json
{"decision": "deny", "reason": "wire-format fixture: shell calls are refused in this run"}
```

`record-and-deny.sh` writes it with one `printf`. `strict = true` is what turns the failure path into a block: a `pre_tool` failure becomes a deny with the failure reason, a `post_tool` failure clears `tool_output_text`, and a `pre_agent` failure blocks the message (`SKILL.md:1017-1029`). Without `strict`, a failure lets the call through.

### Where a Deny Is Visible

Not in `export.json`. The fixture run ended with `exit_code` `0` and `outcome` `finished`, because a denied call reaches the model as a tool error and the turn continues.

The deny is in the session journal under the run's `--output-dir`: `<output-dir>/session/journal/*.jsonl` holds an entry of type `hook_completed` whose result is

```json
{"hook": "pre_tool_call", "output": {"type": "skip", "reason": [{"type": "text", "text": "<reason>"}]}}
```

`run-fixture.sh` prints `DENIED` when that record is present and `NOT-DENIED` otherwise, and takes the reason text from it; the allow-only hook gave `NOT-DENIED`. A guard is therefore read from the journal, never from the exit code or `export.json`.

### What the Runs Pinned Beyond the Payload

| Fact | Evidence |
|---|---|
| Shell guards must match `re:bash\|process_start` | A background command goes through `process_start`, which `match = "bash"` does not catch (`SKILL.md:859-861`). The fixture's `hooks.toml` uses that selector. |
| A project hook loads only in a trusted folder, and the trust entry must be the resolved path | `run-fixture.sh` writes the project path from `pwd -P` and notes that `/var/folders` must be spelled `/private/var/folders`. An unresolved entry loaded no hook and gave no error. |
| `post_tool` fires only when the tool body ran | A `pre_tool` deny, a user denial at the approval prompt, permission `NEVER` or a cancellation before the body starts leaves it unfired (`SKILL.md:824`). |
| `post_agent` cannot be strict | The validator rejects `strict` on it (`models.py:31-35,94-98`), and its deny injects a retry message instead of holding the turn, capped at three retries per turn before force-accept (phase 014's `deny-always` fixture recorded `retry, retry, retry, accept`; `SKILL.md:987`). |
| `session_start` can add context but cannot block | It reads `additional_context` and `system_message` only (`SKILL.md:960-962`). |

### The Fixture Files

| File | What it does |
|---|---|
| `.vibe/plugins/repo-guards/fixtures/wire-format/hooks.toml` | One `[[hooks]]` entry: `name = "wire-fixture"`, `type = "pre_tool"`, `match = "re:bash\|process_start"`, `strict = true`, and a `command` that runs the script with `WIRE_LOG` set. |
| `.vibe/plugins/repo-guards/fixtures/wire-format/record-and-deny.sh` | Appends stdin to `$WIRE_LOG`, then prints the deny object. |
| `.vibe/plugins/repo-guards/fixtures/wire-format/captured-pre-tool-input.json` | The captured stdin object quoted above. |
| `.vibe/plugins/repo-guards/fixtures/run-fixture.sh` | Builds a throwaway trusted project whose `.vibe/hooks.toml` is the given file, copies the repository's model config into a fresh `VIBE_HOME`, writes `trusted_folders.toml` with the resolved project path, runs one keyed `vibe -p` turn with `--auto-approve` and `--output-dir`, then prints the export verdict and `DENIED` or `NOT-DENIED` from the journal. |

The repository guard bundle is built under `.vibe/plugins/repo-guards/` in phase 008, and each guard's decision is read the way this fixture read its deny: from the journal entry, not the exit code. A guard script may rely on the fields quoted here; a field outside them is documented rather than observed.

---

## 6. RELATED

- [cli-reference.md](./cli-reference.md) - the dispatch shape, the exit taxonomy and `export.json`, which keeps `exit_code` `0` on a run whose call was denied; the deny itself is in the session journal (section 5).
- [runtime-folder-and-sync.md](./runtime-folder-and-sync.md) - the `.vibe/` layout, the trust gate and the hand-authored guard files.
- [../../cli-deepseek-harness/references/guards-and-hooks.md](../../cli-deepseek-harness/references/guards-and-hooks.md) - the same seam map for a runtime whose hooks can be strict on more events.
- [../hard-rules.json](../hard-rules.json) - the dispatch-time rules that run before any in-session guard.
