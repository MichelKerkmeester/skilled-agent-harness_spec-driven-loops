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

The coverage is uneven because the eight runtimes have different event surfaces and extension models. A concern's adapter appears only where it can attach and where it isn't already handled elsewhere.

---

## 1. OVERVIEW

### Principle

A concern gets an adapter on a runtime only when three things line up: the runtime **fires an event** the concern needs, the concern **isn't already handled** by another adapter there, and the runtime's extension model **wires it as its own entry** rather than bundling it.

**Most visible asymmetry is the third one: a factoring difference between the four extension models, not a capability gap.** A runtime that "lacks" a concern is usually running the same logic, just folded into a different adapter. The rare *real* capability gaps (Codex has no permission event, and its agent-spawn payload is encrypted) are flagged as such below.

To scan: read the **bold line** under each concern in Section 3 for the core reason. The sentence after it is the evidence. The per-cell grid lives in [`README.md`](./README.md).

Kill-switch names and wiring status live in the [`README.md` kill-switch index](./README.md#kill-switch-index).

---

## 2. THE FOUR EXTENSION MODELS

Almost every asymmetry falls out of which of these a runtime uses:

- **Config-invoked discrete hooks: Claude, Codex, Cursor, Devin.** Named events (`SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `PreCompact`, with Claude/Devin also `SessionEnd`/`PermissionRequest`) each run one file per matcher. The matcher runs a **shell command**, so every concern, including standalone `.sh` guards, is wired as its own discrete entry. → many small per-concern folders.
- **In-process event-bus plugins: OpenCode.** One `event` handler per plugin, branching on `eventType`. Concern logic is factored **per plugin** (`system-skill-advisor`, `opencode-goal`, …). There are no per-event files. → session work distributed across plugins, few folders.
- **TS session-bound extensions: Pi.** Extensions register on `session_start`/`session_compact`/`prompt`/`tool_call`/`turn_end` and can shell out via `ctx.exec()`. Pi bundles several SessionStart advisories into one extension, but independently gates `git-worktree-guard`, `git-hooks-check`, `dist-freshness`, and `hook-install` by their own concerns. → few folders.
- **One plugin bundle per host: DSH (Cordis) and Hermes.** DSH's guards patch inserts `.dsh/plugins/repo-guards/index.mjs`, which registers one adapter per concern on DSH events (`agent/created`, `agent/pre-step`, `tools/pre-execute`, `tools/post-execute`, `tools/result`, `agent/turn-stopping`, `agent/status`, `agent/disposed` and the `session/event` feed). Each adapter's real file sits in a `dsh/` folder in this tree or its owning skill, and the bundle reaches it through a link, the layout Pi uses. Like Pi, DSH bundles the session-start guards into one adapter and gates each by its own concern. The same bundle runs in two compositions. A fan-out leaf adds the lineage patch, whose marker row turns the writer and side-effect adapters off (advisor, goal management, session-start guards, stop autosave). An interactive session runs them all. Hermes has the same shape: one Python plugin at `.hermes/plugins/repo-guards/` registers one callback per Hermes hook and calls the same cores as subprocesses.

---

## 3. PER-CONCERN RATIONALE

Only concerns whose coverage or wiring needs explaining appear. The six covered everywhere (`completion`, `dispatch`, `mcp-route-guard`, `post-edit-quality`, `skill-advisor`, `spec-gate`) need no explanation. The sections below cover either a real gap or a factoring difference worth naming.

### `session-lifecycle`: folder on **all but opencode**
**OpenCode has no per-event files. Its session events are already consumed by the concern plugins, so nothing is left to centralize.**
The others wire one file per boundary (`SessionStart`/`Stop`/`PreCompact`). That file set *is* session-lifecycle. OpenCode's equivalent is distributed across `system-skill-advisor`, `opencode-goal`, etc.

### `git-worktree-guard` and `git-hooks-check`: folders on **claude, codex, cursor, devin**
**OpenCode and Pi run the same `.sh` guards too, just bundled into one session-start adapter instead of a folder per guard.**
OpenCode's `session-cleanup` plugin executes `worktree-guard.sh` (`session-cleanup.js:36`). Pi's `session-start-advisories.ts` runs them via `ctx.exec()` (`.pi/extensions/README.md:77`). Not a coverage gap, a factoring artifact. DSH bundles them the same way: `session-start-advisories.mjs` runs both on a fresh interactive session, each behind its own concern switch.

### `dist-freshness`: folder on **all but pi and dsh**
**Pi runs the same staleness check, bundled into `session-start-advisories`. It just has no discrete folder.**
OpenCode's `system-dist-freshness-guard` plugin owns the rebuild-on-stale projection. The four editors wire `check-dist-staleness.sh` discretely. Pi runs `check-dist-staleness.sh --all` inside its session-start extension. DSH runs the same command inside `session-start-advisories.mjs`, through `python3` because the file is a Python program behind a `.sh` name.

### `session-cleanup`: folder on **all but pi and dsh**
**Pi runs the startup-guard portion but wires no discrete cleanup/teardown adapter.**
The shared `session-cleanup.sh` (startup + teardown) is a discrete hook on the four editors plus an OpenCode plugin. Pi covers only the startup half inside `session-start-advisories.ts`. DSH matches Pi: `session-start-advisories.mjs` runs the startup guards and `session-stop-context.mjs` runs `session-stop.js` when an interactive agent closes, with no discrete cleanup adapter.

### `codex-watchdog`: folder only on **opencode**
**Only a long-lived OpenCode plugin can poll whether Codex's hooks stayed installed.**
Codex can't audit its own not-yet-installed hooks, and no other runtime has a stake in Codex's install state. `codex-hooks-watchdog` watches `hooks.json` from OpenCode's process. DSH runs `install-codex-hooks.mjs --check` once at session start, inside `session-start-advisories.mjs`, and no DSH process stays alive to poll.

### `directive-lifecycle`: folder only on **claude**
**Everyone de-dups the directives in the prompt path. Only Claude needs a separate adapter because its host lifecycle events carry the de-dup's durable state.**
Per the module: *"host lifecycle hooks advance durable policy state independently of prompt payloads."* Elsewhere the de-dup lives in `prompt-advisor.ts` (Pi), `prompt-advisor.mjs` (DSH), `system-skill-advisor` state (OpenCode), the shared `user-prompt-submit` (Codex/Cursor/Devin). The DSH adapter sends the full directive block once per session start or completed compaction and the `Advisor:` head alone while the block is unchanged, and the `directive-lifecycle` switch restores the full brief every turn.

### `permission-policy`: folder only on **devin**
**Devin is the only runtime whose approval event isn't already covered by a `PreToolUse` deny.**
Codex fires **no** permission event at all (real capability gap). Claude *has* `PermissionRequest` but already gates mutations via `PreToolUse` deny in `spec-gate-enforce`, so a second adapter would duplicate it. DSH is Claude's case with one more reason. `tools/pre-execute` already carries the spec-gate and dispatch decisions, and the `approval/request` waterfall carries the tool name, call id and reason but no tool arguments, so an adapter there would have nothing to judge (`ApprovalRequestEvent` in the installed `@deepseek-ai/dsh-user-approval` types).

### `task-dispatch`: folder on **all but codex**
**Codex fires `PreToolUse` on its `spawn_agent` tool, but the payload hides what the guard checks.**
Claude/Cursor/Devin fire a tool event for the spawn and OpenCode/Pi expose a subagent `tool_call`. A live codex-cli 0.160 capture shows the spawn reaching `PreToolUse` as `collaborationspawn_agent` with `tool_input` holding `task_name`, `fork_turns` and a `message` that is encrypted (`gAAAAA...`). The guard's mode check needs the prompt, and its loop check would read every loop-executor spawn as one no command drove, so an adapter could only stay silent or warn falsely. Codex is n/a until a payload carries the prompt in clear text. (Pi is `~ partial`: direct `subagent` calls only.) DSH evaluates `subagent` and `subagent_fork` at `tools/pre-execute`, but its guard only logs warnings and audits, so it never denies (`~ partial`). A call nested in a `workflow` run goes through the same executor call that raises that event (`dsh-tools` `pipeline.js`), so the guard sees it too. That is read from the installed code, not yet observed on a live nested dispatch.

The Claude-only `fable-subagent-guard.mjs` stays single-runtime by design: it guards Claude Code's own Agent-tool model override and its `fork` sub-agent type, both of which inherit the parent's Fable model. No other runtime has those semantics to guard.

### `goal`: folders on **cursor, devin, opencode, pi, dsh**
**Ships only where a session-bound command identity exists to drive it.**
Per the goal contract: OpenCode has `opencode-goal` + `/goal-opencode`, Pi has a native extension + `/goal-pi`, Cursor has a `sessionStart` hook plus a session-free packet read, Devin has an inject-and-record hook on `SessionStart` and `UserPromptSubmit` with no management surface. Claude and Codex keep their native host goal command and reach the packet goal through the speckit workflows. DSH has the `/goal-dsh` command and the `dsh_goal` tool over the shared manage CLI, a per-turn brief with the resend reminder and a heuristic verify note delivered at idle, all in interactive sessions. A fan-out leaf gets only the packet's chat slice from `goal-context.mjs`, because the lineage patch turns off its native goal round driver and goal tools and it must never write the operator's goal record.

### `injection-screen`: folders on **claude, devin, opencode, pi, dsh**
**Only Cursor and Codex cannot carry it, because no hook on either ever sees the fetched page text.**
Cursor's `postToolUse` payload for its `Fetch` tool carries only `url`, `status_code` and `content_length` (probed on the cursor-agent 2026.09.28 build), so there is no text to screen. Codex's only web tool is the provider-hosted `web_search`, which runs on the model provider's side, so no local hook ever sees a page. The five wired runtimes share `lib/classifier-injection-advisory.mjs`: Claude Code screens `WebFetch` at `PostToolUse`, Devin screens `webfetch` at `PostToolUse`, OpenCode screens `webfetch` in its plugin and drains the advisory through the next `experimental.chat.system.transform`, and Pi screens `fetch_content` at `tool_result`. DSH screens `web_fetch`, `web_search` and `mcp__*` results at `tools/post-execute`. Hermes runs the Devin adapter from `transform_tool_result` for `web_extract`, handing it a `webfetch`-shaped payload.

### `decision-capture`: live on **claude, devin, opencode, pi, dsh**, save-time on **codex**, **cursor** unverified
**Codex captures at save time by choice, and Cursor has never shown an answered question to capture.**
Codex's rollout holds the same answered `request_user_input` calls a `PostToolUse` hook would see (`.skilled/skills/.state/decision-capture/probe/codex.json`), and `sweep-codex.mjs` copies them into the queue when a save runs, so every answer still reaches the record. A live hook would add a fifth live mapping to keep in step with that sweep, and its only gain is a live pending-answer reminder. Without a save, neither path writes a record. Cursor stays `unverified` because no probe has observed a Cursor question tool returning an answer, and an adapter is registered only after a probe shows one. The pending-answer reminder reaches the operator on Claude, OpenCode and Pi. Devin computes it but discards Stop-hook output, so no reminder can reach a Devin operator. DSH queues an `ask_user_question` answer at `tools/result`, and a late answer to a timed question from its steered `user-question-reply` message. `sweep-dsh.mjs` recovers both from the session log at save time. DSH has no operator notice a plugin can raise, so the reminder is injected when the agent goes idle and rides with the next prompt.

### `git-preflight`: covered on **all eight** (not a gap)
**The four editors share one `shared/` adapter instead of a copy each. Only opencode, pi and dsh carry runtime-native subfolders.**
A folder scan shows just `opencode/`, `pi/` and `dsh/` because the editor adapter is centralized in `shared/git-preflight-advisory.mjs`. Hermes runs the same shared adapter from its `repo-guards` plugin.

### `git-message-gate`: covered on **all eight**, Hermes included
**Same shape as `git-preflight`: the four editors share the `shared/` gate, and only opencode, pi and dsh carry runtime-native subfolders.**
Claude, Codex, Cursor and Devin run `shared/git-message-gate.mjs` through the hook registry. The OpenCode plugin, the Pi extension and the DSH adapter import its `evaluateCommand`, and the Hermes `repo-guards` plugin runs it from `pre_tool_call`.

### `live-sync` (`git-live-follow` and `git-primary-reconcile`): covered on **all eight**, folders on all but opencode and hermes
**OpenCode and Pi run both `.sh` scripts too, one bundled into a session-start extension and one launched by a plugin, instead of a discrete folder per runtime.**
Claude, Codex, Cursor and Devin each hold a relative symlink per script and wire it at SessionStart (`git-live-follow.sh --start`, with `git-primary-reconcile.sh` detached in the background). Pi runs both inside `session-start-advisories.ts` via `ctx.exec()`. OpenCode launches both from its `session-cleanup` plugin. Hermes runs both as session-start guards in its `repo-guards` plugin. DSH runs both inside `session-start-advisories.mjs`, primary reconcile detached, and only in an interactive session: a fan-out leaf must not start background git work in the operator's checkout. Not a coverage gap, a factoring artifact. The two scripts are the follow and converge legs of the same live-sync loop, so they share this rationale.

### `session-relaunch` on **dsh**: command trigger only
**DSH gets the `/speckit:handoff` prompt but no automatic hop, because `skilled-loop` launches no DSH session.**
The wrapper's runtime list in `.skilled/bin/skilled-loop` names Claude, Pi, OpenCode, Codex, Hermes, Devin and Cursor, and the per-runtime enable switch list in `shared/hook-flags.cjs` has no DSH entry, so no relaunch could be armed. The handoff command reaches DSH as `.dsh/prompts/speckit-handoff.md`. A fan-out leaf is one-shot, and the outer deep-loop runner owns its restarts.

### `git` (commit hooks): **no runtime subfolders**
**They fire from git itself, independent of any AI runtime.**
`pre-commit` is the only hook this folder installs, into `.git/hooks` (or `core.hooksPath`), so there is no per-runtime axis to populate.

---

## 4. RELATED

- [`README.md`](./README.md): the coverage matrix (per-cell authority) and the directory tree.
- [`injection-contract.md`](./injection-contract.md): what each hook injects, per event and channel.
