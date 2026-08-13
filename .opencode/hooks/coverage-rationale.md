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

**Most visible asymmetry is the third one — a factoring difference between three extension models, not a capability gap.** A runtime that "lacks" a concern is usually running the same logic, just folded into a different adapter. The rare *real* capability gaps (Codex has no permission or agent-spawn event) are flagged as such below.

To scan: read the **bold line** under each concern in Section 3 for the core reason; the sentence after it is the evidence. The per-cell grid lives in [`README.md`](./README.md).

---

## 2. THE THREE EXTENSION MODELS

Almost every asymmetry falls out of which of these a runtime uses:

- **Config-invoked discrete hooks — Claude, Codex, Cursor, Devin.** Named events (`SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `PreCompact`; Claude/Devin also `SessionEnd`/`PermissionRequest`) each run one file per matcher. The matcher runs a **shell command**, so every concern — including standalone `.sh` guards — is wired as its own discrete entry. → many small per-concern folders.
- **In-process event-bus plugins — OpenCode.** One `event` handler per plugin, branching on `eventType`. Concern logic is factored **per plugin** (`mk-spec-memory`, `mk-goal`, …); there are no per-event files. → session work distributed across plugins, few folders.
- **TS session-bound extensions — Pi.** Extensions register on `session_start`/`session_compact`/`prompt`/`tool_call`/`turn_end` and can shell out via `ctx.exec()`. Pi tends to **bundle** several startup guards into one extension. → few folders.

---

## 3. PER-CONCERN RATIONALE

Only concerns with uneven coverage appear. The six covered everywhere — `completion`, `dispatch`, `mcp-route-guard`, `post-edit-quality`, `skill-advisor`, `spec-gate` — need no explanation.

### `spec-memory` — folder only on **opencode**
**The same continuity injection the others fold into `session-lifecycle`; OpenCode just ships it as a standalone plugin.**
`mk-spec-memory` subscribes to `session.created` / `resumed` / `compacted` on the event bus; the discrete-hook runtimes do the identical injection inside their session-start hook, so a separate adapter there would be redundant.

### `session-lifecycle` — folder on **all but opencode**
**OpenCode has no per-event files — its session events are already consumed by the concern plugins, so nothing is left to centralize.**
The others wire one file per boundary (`SessionStart`/`Stop`/`PreCompact`) — that file set *is* session-lifecycle; OpenCode's equivalent is distributed across `mk-spec-memory`, `mk-goal`, etc.

### `worktree-guard` and `git-hooks-check` — folders on **claude, codex, cursor, devin**
**OpenCode and Pi run the same `.sh` guards too — just bundled into one session-start adapter instead of a folder per guard.**
OpenCode's `session-cleanup` plugin executes `worktree-guard.sh` (`session-cleanup.js:32`); Pi's `session-start-advisories.ts` runs them via `ctx.exec()` (`.pi/extensions/README.md:66`). Not a coverage gap — a factoring artifact.

### `dist-freshness` — folder on **all but pi**
**Pi runs the same staleness check, bundled into `session-start-advisories`; it just has no discrete folder.**
OpenCode's `mk-dist-freshness-guard` plugin owns the rebuild-on-stale projection; the four editors wire `check-dist-staleness.sh` discretely; Pi runs `check-dist-staleness.sh --all` inside its session-start extension.

### `session-cleanup` — folder on **all but pi**
**Pi runs the startup-guard portion but wires no discrete cleanup/teardown adapter.**
The shared `session-cleanup.sh` (startup + teardown) is a discrete hook on the four editors plus an OpenCode plugin; Pi covers only the startup half inside `session-start-advisories.ts`.

### `codex-watchdog` — folder only on **opencode**
**Only a long-lived OpenCode plugin can poll whether Codex's hooks stayed installed.**
Codex can't audit its own not-yet-installed hooks, and no other runtime has a stake in Codex's install state; `mk-codex-hooks-watchdog` watches `hooks.json` from OpenCode's process.

### `directive-lifecycle` — folder only on **claude**
**Everyone de-dups the directives in the prompt path; only Claude needs a separate adapter because its host lifecycle events carry the de-dup's durable state.**
Per the module: *"host lifecycle hooks advance durable policy state independently of prompt payloads."* Elsewhere the de-dup lives in `prompt-advisor.ts` (Pi), `mk-skill-advisor` state (OpenCode), the shared `user-prompt-submit` (Codex/Cursor/Devin).

### `permission-policy` — folder only on **devin**
**Devin is the only runtime whose approval event isn't already covered by a `PreToolUse` deny.**
Codex fires **no** permission event at all (real capability gap); Claude *has* `PermissionRequest` but already gates mutations via `PreToolUse` deny in `spec-gate-enforce`, so a second adapter would duplicate it.

### `task-dispatch` — folder on **all but codex**
**Codex fires no confirmed agent-spawn event, so there is nothing to intercept.**
Claude/Cursor/Devin fire a tool event for the spawn and OpenCode/Pi expose a subagent `tool_call`; Codex's `PreToolUse` only covers known tools like `exec`. (Pi is `~ partial` — direct calls only.)

### `goal` — folders on **cursor, opencode, pi**
**Ships only where a session-bound command identity exists to drive it.**
Per the goal contract: OpenCode has `mk-goal` + `/goal-opencode`, Pi has a native extension + `/goal-pi`, Cursor has a partial `sessionStart` hook; Claude is explicitly *"outside this contract,"* and Codex/Devin ship no adapter.

### `git-preflight` — covered on **all six** (not a gap)
**The four editors share one `shared/` adapter instead of a copy each; only opencode and pi carry runtime-native subfolders.**
A folder scan shows just `opencode/` and `pi/` because the editor adapter is centralized in `shared/git-preflight-advisory.mjs`.

### `git` (commit hooks) — **no runtime subfolders**
**They fire from git itself, independent of any AI runtime.**
`pre-commit`/`pre-push`/`commit-msg` install into `.git/hooks` (or `core.hooksPath`), so there is no per-runtime axis to populate.

---

## 4. RELATED

- [`README.md`](./README.md) — the coverage matrix (per-cell authority) and the directory tree.
- [`injection-contract.md`](./injection-contract.md) — what each hook actually injects, per event and channel.
