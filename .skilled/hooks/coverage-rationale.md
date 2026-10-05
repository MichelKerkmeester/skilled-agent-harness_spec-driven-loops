---
title: "Hook Coverage Rationale: Why a Runtime Lacks a Concern"
description: "The actual technical reason each runtime has no adapter for a concern — driven by each runtime's event surface and extension model, not by capability. Companion to the README coverage matrix."
trigger_phrases:
  - "why does only opencode have this hook"
  - "why doesnt this runtime have this hook"
  - "hook coverage rationale"
  - "runtime extension model differences"
  - "uneven hook coverage explained"
importance_tier: "important"
contextType: "reference"
---

# Hook Coverage Rationale: Why a Runtime Lacks a Concern

The coverage is uneven because the six runtimes have different event surfaces and extension models; a concern's adapter appears only where it can attach and where it isn't already handled elsewhere.

---

## 1. OVERVIEW

### Principle

A concern gets an adapter on a runtime only when three things line up: the runtime **fires an event** the concern needs, the concern **isn't already handled** by another adapter there, and the runtime's extension model **wires it as its own entry** rather than bundling it.

**Most visible asymmetry is the third one — a factoring difference between three extension models, not a capability gap.** A runtime that "lacks" a concern is usually running the same logic, just folded into a different adapter. The rare *real* capability gaps (Codex has no permission event, and an unread agent-spawn payload) are flagged as such below.

To scan: read the **bold line** under each concern in Section 3 for the core reason; the sentence after it is the evidence. The per-cell grid lives in [`README.md`](./README.md).

Kill-switch names and wiring status live in the [`README.md` kill-switch index](./README.md#kill-switch-index).

---

## 2. THE THREE EXTENSION MODELS

Almost every asymmetry falls out of which of these a runtime uses:

- **Config-invoked discrete hooks — Claude, Codex, Cursor, Devin.** Named events (`SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `PreCompact`; Claude/Devin also `SessionEnd`/`PermissionRequest`) each run one file per matcher. The matcher runs a **shell command**, so every concern — including standalone `.sh` guards — is wired as its own discrete entry. → many small per-concern folders.
- **In-process event-bus plugins — OpenCode.** One `event` handler per plugin, branching on `eventType`. Concern logic is factored **per plugin** (`system-skill-advisor`, `opencode-goal`, …); there are no per-event files. → session work distributed across plugins, few folders.
- **TS session-bound extensions — Pi.** Extensions register on `session_start`/`session_compact`/`prompt`/`tool_call`/`turn_end` and can shell out via `ctx.exec()`. Pi bundles several SessionStart advisories into one extension, but independently gates `git-worktree-guard`, `git-hooks-check`, `dist-freshness`, and `hook-install` by their own concerns. → few folders.

---

## 3. PER-CONCERN RATIONALE

Only concerns whose coverage or wiring needs explaining appear. The six covered everywhere — `completion`, `dispatch`, `mcp-route-guard`, `post-edit-quality`, `skill-advisor`, `spec-gate` — need no explanation; the sections below cover either a real gap or a factoring difference worth naming.

### `session-lifecycle` — folder on **all but opencode**
**OpenCode has no per-event files — its session events are already consumed by the concern plugins, so nothing is left to centralize.**
The others wire one file per boundary (`SessionStart`/`Stop`/`PreCompact`) — that file set *is* session-lifecycle; OpenCode's equivalent is distributed across `system-skill-advisor`, `opencode-goal`, etc.

### `git-worktree-guard` and `git-hooks-check` — folders on **claude, codex, cursor, devin**
**OpenCode and Pi run the same `.sh` guards too — just bundled into one session-start adapter instead of a folder per guard.**
OpenCode's `session-cleanup` plugin executes `worktree-guard.sh` (`session-cleanup.js:32`); Pi's `session-start-advisories.ts` runs them via `ctx.exec()` (`.pi/extensions/README.md:66`). Not a coverage gap — a factoring artifact.

### `dist-freshness` — folder on **all but pi**
**Pi runs the same staleness check, bundled into `session-start-advisories`; it just has no discrete folder.**
OpenCode's `system-dist-freshness-guard` plugin owns the rebuild-on-stale projection; the four editors wire `check-dist-staleness.sh` discretely; Pi runs `check-dist-staleness.sh --all` inside its session-start extension.

### `session-cleanup` — folder on **all but pi**
**Pi runs the startup-guard portion but wires no discrete cleanup/teardown adapter.**
The shared `session-cleanup.sh` (startup + teardown) is a discrete hook on the four editors plus an OpenCode plugin; Pi covers only the startup half inside `session-start-advisories.ts`.

### `codex-watchdog` — folder only on **opencode**
**Only a long-lived OpenCode plugin can poll whether Codex's hooks stayed installed.**
Codex can't audit its own not-yet-installed hooks, and no other runtime has a stake in Codex's install state; `codex-hooks-watchdog` watches `hooks.json` from OpenCode's process.

### `directive-lifecycle` — folder only on **claude**
**Everyone de-dups the directives in the prompt path; only Claude needs a separate adapter because its host lifecycle events carry the de-dup's durable state.**
Per the module: *"host lifecycle hooks advance durable policy state independently of prompt payloads."* Elsewhere the de-dup lives in `prompt-advisor.ts` (Pi), `system-skill-advisor` state (OpenCode), the shared `user-prompt-submit` (Codex/Cursor/Devin).

### `permission-policy` — folder only on **devin**
**Devin is the only runtime whose approval event isn't already covered by a `PreToolUse` deny.**
Codex fires **no** permission event at all (real capability gap); Claude *has* `PermissionRequest` but already gates mutations via `PreToolUse` deny in `spec-gate-enforce`, so a second adapter would duplicate it.

### `task-dispatch` — folder on **all but codex**
**Codex now fires `PreToolUse` on its `spawn_agent` tool, but what the guard needs from that payload is unconfirmed.**
Claude/Cursor/Devin fire a tool event for the spawn and OpenCode/Pi expose a subagent `tool_call`. In codex-cli 0.160 the user-global match-all hooks fire once per tool call, `spawn_agent` and `wait_agent` included, yet the session log stores the spawn `message` encrypted and records no agent type, so the guard's prompt and target checks may have nothing to read. A project hook did not capture the payload in three live attempts, so no adapter is wired until one does. (Pi is `~ partial` — direct `subagent` calls only.)

The Claude-only `fable-subagent-guard.mjs` stays single-runtime by design: it guards Claude Code's own Agent-tool model override and its `fork` sub-agent type, both of which inherit the parent's Fable model; no other runtime has those semantics to guard.

### `goal` — folders on **cursor, devin, opencode, pi**
**Ships only where a session-bound command identity exists to drive it.**
Per the goal contract: OpenCode has `opencode-goal` + `/goal-opencode`, Pi has a native extension + `/goal-pi`, Cursor has a `sessionStart` hook plus a session-free packet read, Devin has an inject-and-record hook on `SessionStart` and `UserPromptSubmit` with no management surface; Claude and Codex keep their native host goal command and reach the packet goal through the speckit workflows.

### `injection-screen` — folders on **claude, devin, opencode, pi**
**Only Cursor and Codex cannot carry it, because no hook on either ever sees the fetched page text.**
Cursor's `postToolUse` payload for its `Fetch` tool carries only `url`, `status_code` and `content_length` (probed on the cursor-agent 2026.09.28 build), so there is no text to screen; Codex's only web tool is the provider-hosted `web_search`, which runs on the model provider's side, so no local hook ever sees a page. The four wired runtimes share `lib/classifier-injection-advisory.mjs`: Claude Code screens `WebFetch` at `PostToolUse`, Devin screens `webfetch` at `PostToolUse`, OpenCode screens `webfetch` in its plugin and drains the advisory through the next `experimental.chat.system.transform`, and Pi screens `fetch_content` at `tool_result`. Hermes runs the Devin adapter from `transform_tool_result` for `web_extract`, handing it a `webfetch`-shaped payload.

### `git-preflight` — covered on **all six** (not a gap)
**The four editors share one `shared/` adapter instead of a copy each; only opencode and pi carry runtime-native subfolders.**
A folder scan shows just `opencode/` and `pi/` because the editor adapter is centralized in `shared/git-preflight-advisory.mjs`.

### `git-message-gate` — covered on **all six**, and in Hermes
**Same shape as `git-preflight`: the four editors share the `shared/` gate, and only opencode and pi carry runtime-native subfolders.**
Claude, Codex, Cursor and Devin run `shared/git-message-gate.mjs` through the hook registry. The OpenCode plugin and the Pi extension import its `evaluateCommand`, and the Hermes `repo-guards` plugin runs it from `pre_tool_call`.

### `live-sync` (`git-live-follow` and `git-primary-reconcile`) — covered on **all six**, folders on all but opencode
**OpenCode and Pi run both `.sh` scripts too — one bundled into a session-start extension, one launched by a plugin — instead of a discrete folder per runtime.**
Claude, Codex, Cursor and Devin each hold a relative symlink per script and wire it at SessionStart (`git-live-follow.sh --start`; `git-primary-reconcile.sh` detached in the background). Pi runs both inside `session-start-advisories.ts` via `ctx.exec()`; OpenCode launches both from its `session-cleanup` plugin. Hermes runs both as session-start guards in its `repo-guards` plugin. Not a coverage gap — a factoring artifact. The two scripts are the follow and converge legs of the same live-sync loop, so they share this rationale.

### `sk-vision` — folder only on **devin**
**Only Devin needs a prompt-time hook; the other runtimes either run the same runtime in process or read images natively.**
Devin has no in-process plugin, so its hook injects `<SK-VISION EVIDENCE>` at `UserPromptSubmit`. OpenCode and Pi run the local runtime in process (plugin tools plus `input.images` auto-inspect); Cursor runs the CLI from its `/vision` command because it delivers no prompt-time event. Claude Code and Codex run vision-capable models that read images natively (the `Read` tool and `view_image`), so the runtime built for text-only models is not wired there. Hermes drives the same Devin adapter from its `pre_tool_call` guard.

### `git` (commit hooks) — **no runtime subfolders**
**They fire from git itself, independent of any AI runtime.**
`pre-commit`/`pre-push`/`commit-msg` install into `.git/hooks` (or `core.hooksPath`), so there is no per-runtime axis to populate.

---

## 4. RELATED

- [`README.md`](./README.md) — the coverage matrix (per-cell authority) and the directory tree.
- [`injection-contract.md`](./injection-contract.md) — what each hook actually injects, per event and channel.
