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

The coverage is uneven because the six runtimes have different event surfaces and different extension models; a concern's adapter appears only where it can attach and where it isn't already handled elsewhere.

---

## 1. OVERVIEW

### Principle

A concern gets an adapter on a runtime only when three things line up:

1. **The runtime fires an event the concern needs.** No event, no adapter.
2. **The concern isn't already handled by a different adapter there.** If another hook already does the work on that runtime, a second adapter would just duplicate it.
3. **The runtime's extension model wires it as a discrete, per-concern entry.** Some runtimes bundle several concerns into one adapter — those show up under the bundle, not as their own folder.

**Most of the visible asymmetry is #3 — a factoring difference between three extension models — not a capability gap.** A runtime that "lacks" a concern is usually running the same logic, just folded into a different adapter. Where a real capability *is* missing (Codex has no permission or agent-spawn event), that is called out explicitly below.

### The per-cell authority

The `✓ covered` / `by-design` / `n/a` / `~ partial` / `unverified` grid lives in [`README.md`](./README.md). This doc explains the *why* behind each non-`✓` cell.

---

## 2. THE THREE EXTENSION MODELS

Almost every asymmetry falls out of which of these a runtime uses:

- **Config-invoked discrete hooks — Claude, Codex, Cursor, Devin.** Each fires named lifecycle events (`SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `PreCompact`; Claude and Devin also `SessionEnd`/`PermissionRequest`) and runs one file per matcher, wired in `settings.json` / `hooks.json`. Because a matcher runs a **shell command**, these runtimes wire each concern — including standalone `.sh` guards — as its own discrete entry. This is why they get a separate folder per concern.
- **In-process event-bus plugins — OpenCode.** A plugin exports a single `event` handler subscribed to one stream and branches on `eventType` (`session.created`, `session.resumed`, `session.compacted`, `tool.execute`, …). Concern logic is factored **per plugin** (`mk-spec-memory`, `mk-goal`, `mk-completion-sentinel`, `mk-dist-freshness-guard`, …), each owning the events it needs. There is no per-event file, so session-boundary work is distributed across the plugins that consume it rather than centralized.
- **TypeScript session-bound extensions — Pi.** Extensions register on `session_start`, `session_compact`, `prompt`, `tool_call`, `turn_end` with a native command identity, and can shell out with `ctx.exec()`. Like OpenCode, Pi tends to **bundle** several startup guards into one extension rather than wiring each as its own entry.

The consequence: the four discrete-hook runtimes wire many small per-concern adapters (and get many folders); OpenCode and Pi run the same work but fold it into a few bundled plugins/extensions (and get fewer folders).

---

## 3. PER-CONCERN RATIONALE

Only concerns with uneven coverage appear here. The six covered on all runtimes — `completion`, `dispatch`, `mcp-route-guard`, `post-edit-quality`, `skill-advisor`, `spec-gate` — need no explanation.

**`spec-memory` — folder only on opencode.** Continuity retrieval is OpenCode's `mk-spec-memory` plugin, which subscribes to `session.created` / `session.resumed` / `session.compacted` on the event bus and injects prior-session context. The four discrete-hook runtimes do the *identical* injection inside their `session-lifecycle` session-start hook, so a separate spec-memory adapter there would be redundant — it is the same work, folded into session-lifecycle. Only OpenCode ships it as a standalone plugin, so only OpenCode gets the folder. *(This is the mirror image of the next entry.)*

**`session-lifecycle` — folder on all but opencode.** The discrete-hook runtimes fire one named event per boundary (`SessionStart`, `Stop`, `PreCompact`) and wire one file each; that file set *is* session-lifecycle, and it carries the continuity and goal priming. OpenCode has no per-event files — its session events arrive on one bus and are consumed by whichever plugin needs them (`mk-spec-memory` on compaction, `mk-goal` on session start). A standalone session-lifecycle plugin would only duplicate subscriptions those plugins already own, so OpenCode's session-boundary behavior is distributed across them and indexed under `spec-memory` / `goal`, not under one folder.

**`worktree-guard` and `git-hooks-check` — folder on claude/codex/cursor/devin only, but OpenCode and Pi run them too.** These are `.sh` scripts in `.opencode/bin`. The four discrete-hook runtimes wire each as its own hook entry (a separate symlink per guard), so each guard gets a per-runtime folder. OpenCode and Pi run the **same** scripts, just bundled into one session-start adapter: OpenCode's `session-cleanup` plugin executes `worktree-guard.sh` at startup (`session-cleanup.js:32`), and Pi's `session-start-advisories.ts` runs `worktree-guard.sh` and `check-git-hooks.sh` via `ctx.exec()` (`.pi/extensions/README.md:66`). So the missing `worktree-guard/opencode` folder is a factoring artifact — bundled vs. discrete — not a gap in what runs.

**`dist-freshness` — folder on all but pi, but Pi runs the check.** The real rebuild-on-stale projection is OpenCode's `mk-dist-freshness-guard` plugin; the four editor runtimes wire the lightweight `check-dist-staleness.sh` as a discrete startup hook; Pi runs the same `check-dist-staleness.sh --all` inside `session-start-advisories.ts`. Pi has no separate dist-freshness folder because the check is bundled into its session-start extension, not because Pi can't see stale builds.

**`session-cleanup` — folder on all but pi.** The shared `session-cleanup.sh` (startup guards plus teardown) is a discrete hook on the four editor runtimes and an OpenCode plugin. Pi runs the startup-guard portion inside `session-start-advisories.ts` but wires no discrete session-cleanup adapter and no teardown extension, so it has no folder here.

**`codex-watchdog` — folder only on opencode.** `mk-codex-hooks-watchdog` is an OpenCode plugin that audits whether Codex's `hooks.json` is correctly installed. It lives in OpenCode because a long-lived in-process plugin is where you poll another runtime's on-disk config; Codex cannot reliably audit its own not-yet-installed hooks, and no other runtime has a stake in Codex's install state.

**`directive-lifecycle` — folder only on claude.** The advisor's three constant directives are appended in every runtime's `user-prompt-submit` path and de-duped to once per boundary. Claude additionally carries a discrete `directive-lifecycle-boundary` adapter because Claude's host lifecycle events advance the de-dup's durable state independently of the prompt payload (per the module: *"Host lifecycle hooks advance durable policy state independently of prompt payloads"*) — a separate concern only under Claude's discrete-hook model. On the others the same de-dup lives inside the prompt path: `prompt-advisor.ts` (Pi), `mk-skill-advisor` lifecycle state (OpenCode), the shared `user-prompt-submit` (Codex, Cursor, Devin).

**`permission-policy` — folder only on devin.** Devin exposes a dedicated `permission-request` callback that returns an approve/block decision (`permission-request-policy.mjs`). Codex fires **no** permission event at all (its six events are `SessionStart`, `Stop`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PreCompact`) — a genuine capability gap. Claude *does* fire `PermissionRequest`, but the repo already gates mutations through Claude's `PreToolUse` deny in `spec-gate-enforce` (wired to `Write|Edit`), so a second Claude permission adapter would duplicate that gate. Devin is the one runtime whose approval decision isn't already covered by a `PreToolUse` gate, so it is the only one with a dedicated permission-policy adapter.

**`task-dispatch` — folder on all but codex.** The guard intercepts sub-agent spawns. Claude, Cursor, and Devin fire a tool event for the spawn; OpenCode and Pi expose a subagent `tool_call`. Codex fires `PreToolUse` only for its known tools (e.g. `exec`) and exposes no confirmed agent-spawn tool event, so there is nothing to intercept — the Codex adapter is `unverified`, not wired. (Pi's coverage is `~ partial`: direct `subagent` calls only, not workflow-nested dispatches.)

**`goal` — folder on cursor/opencode/pi only.** Per the goal system's own runtime contract, goal needs per-session persisted state plus a native command identity to drive continuation. OpenCode has the native `mk-goal` plugin and `/goal-opencode`; Pi has a native session-bound extension and `/goal-pi`; Cursor has a partial `sessionStart` hook (turn-touch only — *"unsupported without native command identity,"* no continuation). Claude Code is explicitly *"outside this contract — no repository command; live native capability unverified here,"* and Codex and Devin ship no adapter. So goal appears exactly where a session-bound command identity exists to run it.

**`git-preflight` — covered on all six; not a gap.** The four discrete-hook runtimes invoke one shared `shared/git-preflight-advisory.mjs` at `PreToolUse`; OpenCode (plugin) and Pi (extension) have runtime-native adapters. A folder scan shows only `opencode/` and `pi/` subfolders because the four editors share the `shared/` module instead of each carrying a copy.

**`git` (commit hooks) — no runtime subfolders at all.** `pre-commit`, `pre-push`, and `commit-msg` fire from git itself (installed to `.git/hooks` or `core.hooksPath`), independent of any AI runtime — there is no per-runtime axis to populate.

---

## 4. RELATED

- [`README.md`](./README.md) — the coverage matrix (per-cell authority) and the directory tree.
- [`injection-contract.md`](./injection-contract.md) — what each hook actually injects, per event and channel.
