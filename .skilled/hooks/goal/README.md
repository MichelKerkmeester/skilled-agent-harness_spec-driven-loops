---
title: "Goal Hooks: Session-Isolated Cross-Runtime Goals"
description: "Packet-bound goals: the packet goal.md is the directive, a per-session record holds the pointer and liveness, while Pi, Cursor, Devin and OpenCode inject the objective slice built from it, and DSH and Vibe inject the chat slice."
trigger_phrases:
  - "cross-runtime goal core"
  - "goal manage cli"
  - "session goal isolation"
  - "legacy active goal migration"
  - "packet goal binding"
  - "goal durable slice"
  - "opencode goal plugin"
  - "native goal tools"
  - "plugin mirror link"
---

# Goal Hooks: Session-Isolated Cross-Runtime Goals

---

## 1. OVERVIEW

> **The word "goal" names more than one thing here.** This document is about the session
> goal: a packet's `goal.md` and the engine that serves it. A deep-review scope manifest
> called `goal-file-manifest.txt` and a third-party integration's own goals feature share the
> word and share nothing else. Check which one a document means before acting on it.

`.skilled/hooks/goal/` gives passive goal steering to runtimes that supply a verified native session identity. Each read or mutation resolves one composite scope:

```text
workspace + runtime + native session id -> one opaque state file and one archive namespace
```

There is no default session and no process-global current-goal pointer. Missing identity makes reads return no goal and makes management fail with a stable error. The legacy singleton record is diagnostic input only and is never an injection fallback.

The directive lives in the packet. A session binds to a spec packet, and that packet's `goal.md` is the single source of the goal. The record under the state root keeps only the pointer, the objective slice (`objective_slice`) derived from the file, liveness, telemetry and the hash of the slice last resent in chat.

Rendering reads the file every time, so editing `goal.md` changes what the model sees on the next turn. A bound record whose document is gone injects nothing rather than a stale copy. The frontmatter never leaves the file. `lib/goal-slice.cjs` draws that boundary once for every surface, the CommonJS core and the ESM plugin alike.

The core (`lib/goal-core.cjs`) is runtime-neutral. Its session state machine, template and prompt-injection hardening match the OpenCode `opencode-goal` plugin's. `.opencode/plugins/opencode-goal.js` remains a separate, larger native implementation with its own per-OpenCode-session files, fixed opaque SHA-256 state keys, token accounting, lifecycle events and guarded continuation.

The two share the kill switch, the state-directory contract, the packet slice module and the locked packet-log append. The OpenCode plugin requires `lib/goal-slice.cjs` and, from `lib/goal-core.cjs`, `appendPacketLog` and the hand-over switch and packet check only.

---

## 2. HOW IT WORKS

The core owns scope validation, opaque path resolution, atomic state I/O, the goal lifecycle, the rendered steering block, the heuristic verifier, diagnostics and legacy quarantine. It never writes stdout or stderr.

**Injection.** `renderGoalBrief()` produces a bounded `[active_goal:<goal-id>] ... [/active_goal]` block. Its markers and field-line labels (`status:`, `objective:`, `criteria:`, `goal_prompt:`, `last_check:`, `usage:`, `directive:`) match `opencode-goal`'s `renderGoalInjection` byte for byte. The `usage:` line reports `turn-count-estimate` honestly, since no native token feed exists outside OpenCode.

Only `active` records inject. Paused, complete, cleared, missing, malformed, unbound or legacy-only state produces no block. A compact fallback block, the same shape as `opencode-goal`'s fallback, is used when the full block would exceed the char budget.

Objective and role-like input is normalized before storage. `normalizeUserAuthoredText` does NFKC normalization and strips bidi and zero-width control characters. It also redacts forged `[active_goal]` markers, downgrades fenced code blocks, folds homoglyph role tokens from Cyrillic and Greek to Latin and redacts common instruction-override phrasing.

**Goal prompt.** `buildGoalPrompt()` builds a RICCE skeleton with Role, Objective, Context, Method, Success Criteria and Stop Conditions. The Role line is parameterized per runtime, where `opencode-goal` hardcodes "OpenCode execution agent". Focus hints come from the objective's keywords. Fix means root-cause-first, implement means smallest-correct, test means run-verification and review means ground-in-evidence.

**Verification.** `verifyGoalHeuristic()` judges the tail of the evidence, where completion proof lands, so the cut never reads as truncation. Blocking language (`blocked`, `error`, `failed`, `cannot`, `incomplete`, `pending`, among others) returns `not-met`. An explicit completion signal (`done`, `completed`, `shipped`, `tests passed`, among others) tied to the objective's keywords returns `met` at confidence 0.72. Ambiguous or mixed evidence stays `unclear` rather than `met`.

A transcript past 1,200 characters is judged on its last 1,200. The assistant's own text before that window is also scanned, and a blocker found there keeps the verdict `unclear`. Tool output there is not scanned, because a failure a tool printed and the turn then fixed is not an open blocker. The OpenCode plugin keeps its own copy of the heuristic, which still judges the first 1,200. It never forces continuation, because non-OpenCode runtimes have no native continuation surface.

**State layout.** The default state root is `.skilled/skills/.state/goal/`, overridable with `OPENCODE_GOAL_STATE_DIR` for tests and probes. It holds one JSON file per scope, a lock folder, an archive folder per scope and a legacy archive folder.

The canonical scope digest hashes the unambiguous JSON serialization of the resolved repository root, runtime and native session id. Raw identities never appear in filenames or aggregate diagnostics. State files use mode `0600` and created directories use mode `0700`. Writes use a temporary file, `fsync` and atomic rename. Lifecycle mutations take cross-process filesystem locks. The prior runtime-plus-session-digest layout is adopted only under the matching workspace-default state root, where ownership is unambiguous.

**Packet binding.** `bind <packet-path>` resolves the path inside the workspace. It refuses anything outside it or without a `goal.md`. The bind derives the objective slice and stores the pointer. That slice is the pointer first, the binding sentence when the packet is phased, then the completion criteria copied out. Section 4 of `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` says the slice is never pasted in chat.

`resent` records the current durable-slice hash so the reminder stops. `resendPending` compares that hash with the file. A log append or a reflow never changes it, while a decision, binding row or criterion does.

`log` appends one row to the packet's progress table under a per-packet lock. The lock is keyed on the packet's real path and held under the workspace's own state root, which deliberately ignores the record-store override. Mutual exclusion over a shared file cannot depend on where each session keeps its private records. Honoring the override gives each session its own lock and loses rows.

The append refuses any write that would alter the durable slice. It also refuses any append to a document that is not valid UTF-8, which fails with `GOAL_NOT_UTF8` and leaves the bytes untouched. A CRLF document keeps CRLF.

`unbind` drops the pointer and keeps the record. A text `set` carrying a new objective replaces the record and drops the pointer with it, because the session then follows the text you gave. Re-setting the same objective refreshes in place and keeps the binding.

`packet <path>` is a session-free read of a packet's slice, hash and size. `packet-log <path> <item> | <state> | <evidence>` is the session-free append through the same lock, for a runtime with no management surface or a packet no session is bound to.

Adapters append `renderResendReminder()` to the injection while the copy is behind. It is one line, never a block, naming the exact command that records the resend (`/goal-pi resent`, `/goal-dsh resent`, `/goal-opencode resent` or the scoped CLI line on Cursor and Devin). `show` reports `packet_state=bound|missing|unbound`, with a hint when the bound document is gone. A text `set` past 4000 characters reports the truncation instead of clamping silently.

**Manage CLI.** `bin/goal.cjs` is a thin router over the core for runtimes with no plugin tool surface. Its status envelope carries `tokens_used=` alongside `usage_source=`, the same pair the OpenCode plugin emits.

Current-session actions (`set`, `bind`, `unbind`, `resent`, `log`, `show`, `history`, `clear`, `complete`, `pause`, `resume`) require `--runtime`, `--session` and `--workspace`. `set` and `bind` also accept `--budget <n>`. `packet` and `packet-log` need only `--workspace`, and `doctor`, `health`, `legacy-inspect` and `legacy-archive` run without a session scope. A missing workspace fails with `MISSING_WORKSPACE` before any write.

A failed action prints `STATUS=FAIL` with a `code=` line and exits 1. A leading flag no action owns, such as `--help`, fails with `UNKNOWN_ACTION` instead of becoming an objective. A rebind to a different packet archives the prior record.

`doctor` and `health` are aggregate-only, reporting counts and legacy classification with no raw identities. Legacy actions are explicit. `legacy-inspect` classifies without mutating. `legacy-migrate` binds a valid legacy record to this exact native session. It refuses an occupied target and never replaces another session's goal. It moves the singleton to the legacy archive only after the scoped record is written. `legacy-archive` preserves bytes without assigning an owner. Malformed legacy data cannot migrate, so it can only be inspected and archived.

**Hand-over bind.** A relaunch hop starts a new session id, and a goal record is keyed by that id, so the receiver starts with no record. When the sender had a goal, the hand-over names its packet and the launcher exports it to the receiver as `SESSION_HANDOVER_GOAL_PACKET`.

Pi, Devin and Cursor bind through the core's `bindRelaunchGoal`, and OpenCode through its own. Each binds the packet once and injects from its `goal.md` like any bound session. OpenCode binds at session start. No goal text travels in chat. DSH reads the packet named by `DSH_SPEC_FOLDER` instead, so a DSH session binds nothing on its own.

The bind happens only when all of these hold, and does nothing otherwise:

- The variable names a repo-relative directory that holds a `goal.md`, inside the repository once links are followed. A missing, absolute, `..`, empty or linked-out value binds nothing.
- `SESSION_HANDOVER_GOAL` is not `0`, `false`, `off` or `no`, in the environment or in `hook-flags.env`. The receiver binds without asking, and this switch is the off setting.
- The session has no goal of its own. No live record of any status, no archived one and no record that cannot be read. A cleared or completed goal leaves an archive entry, so the session gets no second goal. The bind never overwrites, and a second turn changes nothing.
- The session is not a dispatched child. A process that runs with `AI_SESSION_CHILD=1` never binds, on any runtime, because it inherited the variable from the receiver that spawned it. The marker is the only signal the core reads, so a child launched without it still binds.
- In OpenCode, the session is also the first top-level session of the process. An in-process child is one with a parent session, and neither it nor a later session in the same process is the receiver.

The bind covers the one session that was relaunched. Pi, Devin and Cursor key the record by session id, so they cannot tell a spawned child from a receiver except through that marker. The dispatch recipes are meant to set `AI_SESSION_CHILD=1` for every child they start. A child started without it inherits the packet and binds its own record to it.

A failed bind never blocks a session. Devin and Cursor write one stderr line for an unusable packet or an unexpected error, OpenCode writes a debug line under `OPENCODE_GOAL_DEBUG` and Pi stays silent. Claude and Codex have no goal record to bind and are handled by their own commands.

**Boundaries.**

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins, `../../shared/hook-flags.cjs` and `./goal-slice.cjs`. Adapters import `../lib/goal-core.cjs`, Cursor and Devin via `createRequire` and Pi via dynamic `import`. The OpenCode plugin imports `goal-slice.cjs` and, from the core, `appendPacketLog` and the hand-over switch and packet check only. |
| Scope | Every read or mutation resolves a composite `workspace + runtime + native session id` scope. No default session and no process-global pointer. Missing identity means no goal on read and a stable error on mutation. A packet is shared content, while which packet a session is bound to is per-session state. |
| Directive | The bound packet's `goal.md` is the source. Tooling writes only its log, below the durable slice, and only through the locked append. Decisions, binding rows and criteria are the operator's to change through `/create:goal` (`sk-create-goal`), and every change is resent in chat as the chat slice. |
| State | Atomic writes, file mode 0600 and directory mode 0700, cross-process filesystem locks. Record locks live in the session's state dir. Packet-log locks live under the workspace's default state root, keyed on the packet's real path and never redirected by `OPENCODE_GOAL_STATE_DIR`. |
| Failure | Reads fail open. Missing identity, missing state, malformed scoped JSON or an adapter error selects no goal. Mutations fail closed with stable `GoalError` codes and do not guess identity. |
| Rollback | To roll back runtime injection, disable the adapter while preserving both scoped state and legacy quarantine files. Do not merge scoped records back into a singleton. |

---

## 3. RUNTIME COVERAGE

The core is runtime-neutral. Each adapter binds it to a native lifecycle event and supplies the session identity.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Pi | `input`, `session_start`, `turn_end` | `pi/goal-context.ts` | `.skilled/hooks/goal/pi/goal-context.ts` | The brief appended to the prompt text each turn, a restore message at session start and a verify nudge with the next prompt. |
| Cursor | `sessionStart` | `cursor/goal-inject.mjs` | `.skilled/hooks/goal/cursor/goal-inject.mjs` | `permission: "allow"` with one `agent_message` holding the brief and the reminder. |
| Devin | `SessionStart`, `UserPromptSubmit` | `devin/goal-inject.mjs` | `.skilled/hooks/goal/devin/goal-inject.mjs` | `hookSpecificOutput.additionalContext` holding the brief and the reminder. |
| Vibe | `session_start`, `pre_agent` | `vibe/goal-inject.mjs` | `.skilled/hooks/goal/vibe/goal-inject.mjs` | The packet `chat_slice` inside the session-start hook's `hook_specific_output.additional_context`. |
| DSH | `agent/created`, `agent/pre-step`, `agent/turn-stopping`, `agent/status` | `dsh/goal-context.mjs`, `dsh/goal-manage.mjs` | `.skilled/hooks/goal/dsh/goal-context.mjs`, `.skilled/hooks/goal/dsh/goal-manage.mjs` | An injected notice at agent creation, the brief plus reminder before an operator turn and a `[goal_verify]` note at idle. |
| OpenCode | `experimental.chat.system.transform, message.part.updated, message.updated, permission.asked, permission.replied, question.asked, question.rejected, question.replied, session.created, session.deleted, session.idle, session.status` | `opencode/opencode-goal.js` | `.opencode/plugins/opencode-goal.js` | The `[active_goal]` block in the system prompt, plus the `opencode_goal` and `opencode_goal_status` tools. |
| Claude | None | None | None | Nothing from this folder. The host goal command stays. |
| Codex | None | None | None | Nothing from this folder. Same as Claude. |

Pi binds injection and management to the same native identity. It reads `ctx.sessionManager.getSessionId()` for identity and `ctx.cwd` for the workspace. The `input` handler returns `{action: "transform", text: ...}` and chains additively with other handlers. `session_start` restores through `pi.sendMessage` with `triggerTurn: false`. `turn_end` verifies, records the turn and nudges through `pi.sendMessage` when the goal is not met. `/goal-pi` shells to `bin/goal.cjs` with scope flags.

Each Pi handler fails open. `input` returns `{action: 'continue'}`, `session_start` returns undefined and `turn_end` returns undefined, which skips the nudge. `/goal-pi` notifies `STATUS=FAIL` when the CLI prints nothing or cannot run. The nudge uses `deliverAs: 'nextTurn'`, so Pi holds it for the next prompt and never restarts a turn.

Cursor registers `sessionStart` in `.cursor/hooks.json` and fires it only. It reads `session_id` then `conversation_id` as a fallback and `workspace_roots[0]` for the workspace. It returns `{permission: 'allow', agent_message: brief + reminder}`. Management needs identity the prompt command does not carry, so `/goal-cursor` answers only `packet <path>`, a session-free read. There is no mid-session refresh and no verify or continue. Model visibility is recorded evidence, not a proven end-to-end guarantee.

Devin registers `SessionStart` and `UserPromptSubmit` in `.devin/hooks.v1.json`. It reads `session_id` and `cwd` or `DEVIN_PROJECT_DIR` for the workspace. It returns `{hookSpecificOutput: {hookEventName, additionalContext: brief + reminder}}`. The repository exposes no Devin prompt-command surface, so this runtime is injection-only.

Vibe fires `session_start` through `.vibe/hooks.toml`. `renderVibeGoalSlice` reads the packet path from `VIBE_SPEC_FOLDER` and uses no session identity. It returns no envelope of its own, because the session-start hook puts the slice in `hook_specific_output.additional_context`. There is no goal object, no `/goal` command, no goal tool and no per-turn refresh.

After a compaction the `pre_agent` turn-start hook re-injects the slice once, through `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`. The `pre_agent` entry `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` calls it.

DSH loads `dsh/goal-context.mjs` and `dsh/goal-manage.mjs` through `.dsh/plugins/repo-guards/index.mjs`. `goal-context` listens on `agent/created` and injects the packet `chat_slice` as a notice. `goal-manage` registers the `/goal-dsh` command and the `dsh_goal` tool, both served by the shared manage CLI. It appends the brief and reminder before an operator turn, records the turn and queues a verify note at idle. A fan-out leaf gets neither surface.

Every CLI write carries `--runtime dsh`. A failure logs `repo-guards goal-manage:` and returns the step unchanged. A leaf gets an error only from the command, which answers that the goal surface is off.

OpenCode runs the native plugin. It owns per-OpenCode-session files, token accounting, lifecycle events and guarded continuation. It exposes native `/goal-opencode` tools with `bind`, `resent` and `packet`, a native verifier and guarded continuation.

A runtime is not called fully supported unless injection and management bind the same native current-session identity. Cursor and Devin therefore carry injection without management, and `/goal-cursor` fails closed for anything but the packet read. Injection without management is not read-only, because both adapters record a turn on the bound record, which is the one write they make. Pi, DSH and OpenCode bind injection and management to the same native identity. Pi and DSH also carry a heuristic verify surface.

Claude and Codex keep their host goal command, operator-confirmed 2026-09-12 and re-checkable only against a live host. The speckit workflows render the parent goal's durable slice with the frontmatter excluded and hand it over to be set. The `AGENTS.md` goal posture row binds the agent on every turn.

OpenCode's real plugin cannot live in this tree, because its loader globs `.opencode/plugins/` by a flat pattern. So `opencode/opencode-goal.js` is a browsability-only symlink back into that folder, and nothing loads through it. Pi loads in the other direction. The real `pi/goal-context.ts` lives here, and `.pi/extensions/` holds a one-line entry file that re-exports it.

---

## 4. DIRECTORY TREE

```text
goal/
+-- README.md
+-- goal-plugin.md
+-- lib/       goal-core.cjs  goal-core.test.cjs  goal-slice.cjs  goal-slice.test.cjs
+-- bin/       goal.cjs  goal.test.cjs
+-- cursor/    goal-inject.mjs  goal-cursor.test.mjs
+-- devin/     goal-inject.mjs  goal-devin.test.mjs
+-- dsh/       goal-context.mjs  goal-manage.mjs
+-- pi/        goal-context.ts  goal-pi.test.mjs
+-- tests/     dsh-goal.test.mjs
+-- vibe/      goal-inject.mjs  goal-vibe.test.mjs
`-- opencode/  opencode-goal.js -> ../../../../.opencode/plugins/opencode-goal.js
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/goal-core.cjs` | Scope validation (`resolveGoalScope`), opaque SHA-256 path resolution, atomic state I/O, the goal lifecycle, packet binding (`bindGoal`/`unbindGoal`/`bindGoalIfUnbound`/`bindRelaunchGoal`/`noteResent`/`resendPending`/`appendGoalLog`/`describePacketGoal`), `renderGoalBrief` and `renderResendReminder`, `buildGoalPrompt`, `verifyGoalHeuristic`, diagnostics (`doctor`/`health`) and legacy quarantine. Reads fail open, while mutations raise stable `GoalError` codes. |
| `lib/goal-slice.cjs` | The one definition of where a goal document's frontmatter ends and its durable slice begins. Produces the measured slice, the chat slice, the objective slice and the slice hash, and reads a packet's goal inside the workspace and nowhere else. Imported by the core and by the OpenCode plugin. |
| `bin/goal.cjs` | Stable `STATUS=`/`ACTION=` command envelope and explicit scope and legacy actions. It never writes goal state directly, because every mutation goes through the shared core. |
| `pi/goal-context.ts` | Pi native lifecycle binding. Registers `/goal-pi`, injects on `input`, restores on `session_start` and verifies on `turn_end`. Dynamic-imports the core from this folder. The fallback `DISCOVERY_CORE_PATH` does not resolve. Binds a hand-over packet at `session_start` or the first `input`. |
| `cursor/goal-inject.mjs` | Cursor `sessionStart`-only injection. Reads the active goal, renders the brief and the resend reminder and returns them as `agent_message`. Fails open unconditionally. |
| `devin/goal-inject.mjs` | Devin `SessionStart` and `UserPromptSubmit` injection. Same brief and reminder, returned as `additionalContext` in Devin's `hookSpecificOutput` envelope. Fails open to `{}`. |
| `dsh/goal-context.mjs` | DSH `agent/created` injection. Reads `DSH_SPEC_FOLDER`, renders the packet `chat_slice` and injects it as a notice. Fails open and logs one warning. |
| `dsh/goal-manage.mjs` | DSH management surface. Registers the `/goal-dsh` command and the `dsh_goal` tool over the shared manage CLI, appends the brief before an operator turn, records the turn and queues the verify note. A fan-out leaf gets none of it. |
| `vibe/goal-inject.mjs` | Vibe `session_start` slice. Reads the packet path from `VIBE_SPEC_FOLDER` and returns exactly the `chat_slice` that `goal.cjs packet` prints. No variable means no goal text. |
| `lib/goal-core.test.cjs`, `bin/goal.test.cjs` | Core, lifecycle, concurrency, legacy, hardening, CLI binding, privacy and legacy action coverage. |

`.opencode/plugins/opencode-goal.js` is the OpenCode-native plugin. It is a separate implementation that shares the kill switch, the state directory and `lib/goal-slice.cjs`. From the core it takes `appendPacketLog` and the hand-over switch and packet check only.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on`, in any case.

| Variable | Effect |
|---|---|
| `OPENCODE_GOAL_DISABLED=1` | Disables goal behavior and management across this core and the OpenCode plugin. The shared resolver (`isHookEnabled('goal')`) short-circuits every adapter. |
| `OPENCODE_GOAL_PLUGIN_DISABLED=1` | Legacy alias, honoured by the shared resolver. Both engines print the canonical `OPENCODE_GOAL_DISABLED` in their errors, because that is the name an operator has to set. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `OPENCODE_GOAL_STATE_DIR` | Override the state root. Tests and isolated probes use this to avoid touching the real state tree. |
| `SESSION_HANDOVER_GOAL_PACKET` | Set by the relaunch launcher for a receiver session. A repo-relative packet directory the receiver binds when it has no goal of its own. Not an operator setting. |
| `SESSION_HANDOVER_GOAL=0` | Turns the hand-over bind off, in the environment or in `hook-flags.env`. On by default. |
| `AI_SESSION_CHILD=1` | Read only, never set by this concern. Marks a dispatched child session, which never binds the hand-over packet. |

Set a flag inline for one command, export it for a session or persist it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for a single session. Pi discovery can additionally be disabled with `-extensions/goal-context.ts` in `.pi/settings.json`.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test \
  .skilled/hooks/goal/lib/goal-slice.test.cjs \
  .skilled/hooks/goal/lib/goal-core.test.cjs \
  .skilled/hooks/goal/bin/goal.test.cjs \
  .skilled/hooks/goal/pi/goal-pi.test.mjs \
  .skilled/hooks/goal/cursor/goal-cursor.test.mjs \
  .skilled/hooks/goal/devin/goal-devin.test.mjs \
  .skilled/hooks/goal/vibe/goal-vibe.test.mjs \
  .skilled/hooks/goal/tests/dsh-goal.test.mjs
```

Expected result: all tests pass.

```bash
node --test .opencode/plugins/tests/opencode-goal-*.test.cjs
```

Expected result: all OpenCode plugin tests pass.

```bash
node --test .opencode/plugins/tests/opencode-goal-render-parity.test.cjs
```

Expected result: the two renderers agree on every label and the brief cache key tracks every write.

```bash
node --test .opencode/plugins/tests/goal-doc-contract.test.cjs
```

Expected result: every path this document cites exists and every kill switch it names is live.

```bash
python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py \
  --root .skilled/hooks/goal
```

Expected result: no alignment drift. Use temporary `OPENCODE_GOAL_STATE_DIR` paths for manual probes, and never point migration fixtures at the operator's live state root.

---

## 8. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`goal-plugin.md`](goal-plugin.md): OpenCode-native plugin contract and its relationship to this core.
- [`../injection-contract.md`](../injection-contract.md): runtime injection visibility contract.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../../../.opencode/commands/goal-opencode.md`](../../../.opencode/commands/goal-opencode.md): OpenCode-native command router.
- [`../../skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`](../../skills/system-spec-kit/references/workflows/goal-set-string-playbook.md): what an operator sets, the durable budget and the resend rule.
