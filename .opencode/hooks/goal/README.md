---
title: "Goal Hooks: Session-Isolated Cross-Runtime Goals"
description: "Packet-bound goals: the packet goal.md is the directive, a per-session record holds the pointer and liveness, and Pi, Cursor, Devin and OpenCode inject the stripped durable slice."
trigger_phrases:
  - "cross-runtime goal core"
  - "goal manage cli"
  - "session goal isolation"
  - "legacy active goal migration"
  - "packet goal binding"
  - "goal durable slice"
---

# Goal Hooks: Session-Isolated Cross-Runtime Goals

---

## 1. OVERVIEW

`.opencode/hooks/goal/` provides passive goal steering for runtimes that can supply a verified native session identity. Each supported read or mutation resolves one composite scope:

```text
workspace + runtime + native session id -> one opaque state file and one archive namespace
```

There is no default session and no process-global current-goal pointer. Missing identity makes reads return no goal and makes management fail with a stable error. The legacy singleton `active-goal.json` is diagnostic input only and is never an injection fallback.

The directive itself lives in the packet. A session binds to a spec packet, and that packet's `goal.md` is the single source of the goal: the record under the state root keeps only the pointer, an operator copy derived from the file, liveness, telemetry and the hash of the slice last resent in chat. Rendering reads the file every time, so editing `goal.md` changes what the model sees on the next turn, and a bound record whose document is gone injects nothing rather than a stale copy. The frontmatter never leaves the file: `lib/goal-slice.cjs` draws the boundary once for every surface, the CommonJS core and the ESM plugin alike.

The core (`lib/goal-core.cjs`) was ported from the OpenCode `opencode-goal` plugin's session state machine, template, and prompt-injection hardening. OpenCode's `.opencode/plugins/opencode-goal.js` remains a separate, larger native implementation with its own per-OpenCode-session files, fixed opaque SHA-256 state keys, token accounting, lifecycle events, and guarded continuation. The two share the kill switch, the state-directory contract, the packet slice module and the locked packet-log append; the OpenCode plugin requires `lib/goal-slice.cjs` and `appendPacketLog` from `lib/goal-core.cjs`, and nothing else from this tree.

---

## 2. WHAT IT DOES

The core owns scope validation, opaque path resolution, atomic state I/O, the goal lifecycle, the rendered steering block, the heuristic verifier, diagnostics, and legacy quarantine. It never writes stdout or stderr.

**Injection.** `renderGoalBrief()` produces a bounded `[active_goal:<goal-id>] ... [/active_goal]` block whose markers and field-line labels (`status:`, `objective:`, `goal_prompt:`, `last_check:`, `usage:`, `directive:`) match `opencode-goal`'s `renderGoalInjection` byte-for-byte. The `usage:` line reports `turn-count-estimate` honestly, since no native token feed exists outside OpenCode. Only `active` records inject; paused, completed, cleared, missing, malformed, unbound, or legacy-only state produces no block. A compact fallback block (same shape as `opencode-goal`'s fallback) is used when the full block would exceed the char budget. Objective and role-like input is normalized before storage: `normalizeUserAuthoredText` does NFKC normalization, strips bidi/zero-width control characters, redacts forged `[active_goal]` markers, downgrades fenced code blocks, folds homoglyph role tokens (Cyrillic/Greek → Latin), and redacts common instruction-override phrasing.

**Goal prompt.** `buildGoalPrompt()` builds a RICCE skeleton (Role / Objective / Context / Method / Success Criteria / Stop Conditions) with the Role line parameterized per runtime (`opencode-goal` hardcodes "OpenCode execution agent"). Focus hints are derived from the objective's keywords (fix → root-cause-first, implement → smallest-correct, test → run-verification, review → ground-in-evidence).

**Verification.** `verifyGoalHeuristic()` is ported from `opencode-goal`'s default heuristic supervisor. Blocking language (`blocked`, `error`, `failed`, `cannot`, `incomplete`, `pending`, ...) → `not-met`; an explicit completion signal (`done`, `completed`, `shipped`, `tests passed`, ...) tied to the objective's keywords → `met` (confidence 0.72); ambiguous or mixed evidence stays `unclear` rather than `met`. It never forces continuation: non-OpenCode runtimes have no native continuation surface.

**State layout.** The default state root is `.opencode/skills/.state/goal/` (override with `OPENCODE_GOAL_STATE_DIR` for tests/probes):

```text
.state/goal/
+-- <sha256-of-canonical-scope>.json
+-- .locks/
|   `-- <sha256-of-lock-identity>.lock/
+-- .archive/
|   +-- <sha256-of-canonical-scope>/
|   |   `-- active-goal-<safe-goal-id>-<record-digest>.json
|   `-- .legacy/
|       `-- active-goal-<goal-id-or-content-digest>.json
`-- active-goal.json                    # legacy, diagnostic-only when present
```

The canonical scope digest hashes the unambiguous JSON serialization of the resolved repository root, runtime, and native session id. Raw identities never appear in filenames or aggregate diagnostics. State files use mode `0600`; created directories use mode `0700`; writes use a temporary file, `fsync`, and atomic rename. Lifecycle mutations take cross-process filesystem locks. The previous runtime-plus-session-digest layout is adopted only under the matching workspace-default state root, where ownership is unambiguous.

**Packet binding.** `bind <packet-path>` resolves the path inside the workspace, refuses anything outside it or without a `goal.md`, derives the operator copy (the pointer first, the binding sentence when the packet is phased, then the completion criteria copied out) and stores the pointer. `resent` records the current durable-slice hash so the reminder stops; `resendPending` compares that hash with the file, and a log append or a reflow never changes it while a decision, binding row or criterion does. `log` appends one row to the packet's progress table under a per-packet lock, keyed on the packet's real path and held under the workspace's own state root, which deliberately ignores the record-store override: mutual exclusion over a shared file cannot depend on where each session keeps its private records, and honoring the override gives each session its own lock and loses rows, and refuses any write that would alter the durable slice; a CRLF document keeps CRLF. `unbind` drops the pointer and keeps the record. A text `set` carrying a new objective replaces the record and drops the pointer with it, because the session is then following the text you gave rather than a packet; re-setting the same objective refreshes in place and keeps the binding. `packet <path>` is a session-free read of a packet's slice, hash and size, and `packet-log <path> <item> | <state> | <evidence>` is the session-free append through the same lock, for a runtime with no management surface or a packet no session is bound to. Adapters append `renderResendReminder()` to the injection while the copy is behind: one line, never a block, naming the exact command on that runtime that records the resend (`/goal-pi resent`, `/goal-opencode resent`, or the scoped CLI line on Cursor and Devin). `show` reports `packet_state=bound|missing|unbound`, with a hint when the bound document is gone, and a text `set` past 4000 characters reports the truncation instead of clamping silently.

**Manage CLI.** `bin/goal.cjs` is a thin router over the core for runtimes with no plugin tool surface. Current-session actions (`set`, `bind`, `unbind`, `resent`, `log`, `show`, `history`, `clear`, `complete`, `pause`, `resume`) require `--runtime`, `--session`, and `--workspace`; `packet` and `packet-log` need only `--workspace`. A rebind to a different packet archives the prior record. `doctor` and `health` are aggregate-only (counts and legacy classification, no raw identities). Legacy actions are explicit: `legacy-inspect` (non-mutating classification), `legacy-migrate` (bind a valid legacy record to this exact native session: refuses an occupied target, never replaces another session's goal, moves the singleton to `.archive/.legacy/` only after the scoped record is written), and `legacy-archive` (preserve bytes without assigning an owner). Malformed legacy data cannot migrate; it can only be inspected and archived.

---

## 3. PER-RUNTIME DELIVERY

The core is runtime-neutral; each adapter binds it to a native lifecycle event and supplies the session identity.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Pi** | `pi/goal-context.ts` | `input` + `session_start` + `turn_end`; registers `/goal-pi` command, discovered via `.pi/extensions/` | `ctx.sessionManager.getSessionId()` for native identity; `ctx.cwd` for workspace | `input` → `{action: "transform", text: ...}` (per-turn injection, chains additively). `session_start` → restore via `pi.sendMessage`. `turn_end` → heuristic verify, observe-only nudge via `pi.sendMessage` when not met, records turn. `/goal-pi` shells to `bin/goal.cjs` with scope flags. |
| **Cursor** | `cursor/goal-inject.mjs` | `sessionStart` only | `session_id` then `conversation_id` fallback; `workspace_roots[0]` for workspace | `{permission: 'allow', agent_message: brief + reminder}`. Injection-only: management needs identity the prompt command does not carry, so `/goal-cursor` answers only `packet <path>`, a session-free read. No mid-session refresh, no verify/continue. Model-visibility is recorded-evidence, not a proven end-to-end guarantee. |
| **Devin** | `devin/goal-inject.mjs` | `SessionStart` + `UserPromptSubmit` in `.devin/hooks.v1.json` | `session_id`; `cwd` or `DEVIN_PROJECT_DIR` for workspace | `{hookSpecificOutput: {hookEventName, additionalContext: brief + reminder}}`. Injection-only: the repository exposes no Devin prompt-command surface. |
| **OpenCode** | `.opencode/plugins/opencode-goal.js` (mirrored at `opencode/`) | Native OpenCode plugin, outside this core | Owns per-OpenCode-session files, token accounting, lifecycle events | Native `/goal-opencode` tools with `bind`, `resent` and `packet`, native verifier, guarded continuation. A separate implementation that shares the kill switch, the state-directory contract and `lib/goal-slice.cjs`. |
| **Claude** | — | native goal command | — | Keeps its host goal command. The speckit workflows render the parent goal's durable slice, frontmatter excluded, and hand it over to be set; the `AGENTS.md` goal posture row binds the agent on every turn. |
| **Codex** | — | native goal command | — | Same as Claude. |

A runtime is not called fully supported unless injection and management bind the same native current-session identity. Cursor and Devin therefore remain injection-only, and `/goal-cursor` fails closed for anything but the packet read. Pi and OpenCode bind injection and management to the same native identity; Pi also carries a heuristic verify surface.

OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/opencode-goal.js` is a browsability-only symlink back into that folder and nothing loads through it. Pi loads in the other direction: the real `pi/goal-context.ts` lives here, and `.pi/extensions/` holds the relative symlink Pi discovers.

---

## 4. DIRECTORY TREE

```text
goal/
+-- lib/
|   +-- goal-core.cjs              # scope validation, opaque paths, atomic state, lifecycle, packet binding, rendering, verifier, legacy quarantine
|   +-- goal-core.test.cjs         # core, lifecycle, concurrency, legacy, hardening, packet, CLI contract coverage
|   +-- goal-slice.cjs             # packet goal.md projections: frontmatter split, durable and chat slices, objective slice, hash
|   `-- goal-slice.test.cjs        # no-leak, slice boundary, nested versus singular, hash stability, unbound paths
+-- bin/
|   +-- goal.cjs                   # manage CLI: stable envelope + explicit scope/legacy actions
|   `-- goal.test.cjs              # CLI binding, privacy, concurrency, legacy action coverage
+-- cursor/   goal-inject.mjs       # sessionStart-only injection plus the resend reminder
+-- devin/    goal-inject.mjs       # SessionStart + UserPromptSubmit injection plus the resend reminder
+-- pi/       goal-context.ts       # Pi native lifecycle + /goal-pi command (real file; `.pi/extensions/` symlinks to it)
`-- opencode/ opencode-goal.js      # browsability symlink -> ../../../plugins/opencode-goal.js
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/goal-core.cjs` | Scope validation (`resolveGoalScope`), opaque SHA-256 path resolution, atomic state I/O (temp + fsync + rename, mode 0600/0700, cross-process locks), the goal lifecycle (`set`/`show`/`clear`/`complete`/`pause`/`resume`/`history`), packet binding (`bindGoal`/`unbindGoal`/`noteResent`/`resendPending`/`appendGoalLog`/`describePacketGoal`), `renderGoalBrief` (byte-compatible `[active_goal]` block, rendered from the packet when bound) and `renderResendReminder`, `buildGoalPrompt` (RICCE skeleton), `verifyGoalHeuristic`, diagnostics (`doctor`/`health`), and legacy quarantine (`legacy-inspect`/`legacy-migrate`/`legacy-archive`). Reads fail open; mutations raise stable `GoalError` codes. |
| `lib/goal-slice.cjs` | The one definition of where a goal document's frontmatter ends and its durable slice begins. Produces the measured slice, the chat slice, the objective slice and the slice hash; reads a packet's goal inside the workspace and nowhere else. Imported by the core and by the OpenCode plugin. |
| `bin/goal.cjs` | Stable `STATUS=`/`ACTION=` command envelope and explicit scope/legacy actions. Never writes goal state directly: every mutation goes through the shared core. |
| `pi/goal-context.ts` | Pi native lifecycle binding. Registers `/goal-pi`, injects on `input`, restores on `session_start`, verifies on `turn_end`. Dynamic-imports the core (supports both canonical and discovery-symlink paths). |
| `cursor/goal-inject.mjs` | Cursor `sessionStart`-only injection. Reads the active goal, renders the brief and the resend reminder, returns them as `agent_message`. Fails open unconditionally. |
| `devin/goal-inject.mjs` | Devin `SessionStart` and `UserPromptSubmit` injection. Same brief and reminder, returned as `additionalContext` in Devin's `hookSpecificOutput` envelope. Fails open to `{}`. |
| `lib/goal-core.test.cjs`, `bin/goal.test.cjs` | Core, lifecycle, concurrency, legacy, hardening, CLI binding, privacy, and legacy action coverage. |

`.opencode/plugins/opencode-goal.js` is the OpenCode-native plugin; it is a separate implementation that shares the kill switch, the state directory, `lib/goal-slice.cjs` and the core's `appendPacketLog`, and imports nothing else from this tree.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `OPENCODE_GOAL_DISABLED=1` | Disables goal behavior and management across this core and the OpenCode plugin. The shared resolver (`isHookEnabled('goal')`) short-circuits every adapter. |
| `OPENCODE_GOAL_PLUGIN_DISABLED=1` | Legacy alias of the canonical flag. Also the OpenCode plugin's own `DISABLED_ENV`. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `OPENCODE_GOAL_STATE_DIR` | Override the state root (tests and isolated probes use this to avoid touching the real `.state/goal/` tree). |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session. Pi discovery can additionally be disabled with `-extensions/goal-context.ts` in `.pi/settings.json`.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins, `../../shared/hook-flags.cjs` and `./goal-slice.cjs`. Adapters import `../lib/goal-core.cjs` (Cursor and Devin via `createRequire`; Pi via dynamic `import`). The OpenCode plugin imports `goal-slice.cjs` and the core's `appendPacketLog` only. Nothing imports the plugin. |
| Scope | Every read or mutation resolves a composite `workspace + runtime + native session id` scope. No default session, no process-global current-goal pointer. Missing identity → no goal on read, stable error on mutation. A packet is shared content; which packet a session is bound to is per-session state. |
| Directive | The bound packet's `goal.md` is the source. Tooling writes only its log, below the durable slice, and only through the locked append. Decisions, binding rows and criteria are the operator's to change, and every change is resent in chat with the frontmatter stripped. |
| State | Atomic writes (temp + fsync + rename), mode 0600 files / 0700 dirs, cross-process filesystem locks. Record locks live in the session's state dir; packet-log locks live under the workspace's default state root, keyed on the packet's real path and never redirected by `OPENCODE_GOAL_STATE_DIR`, so an alias and its target, and two sessions with different record stores, all contend on one lock. Raw identities never appear in filenames or aggregate diagnostics. |
| Failure | Reads fail open: missing identity, missing state, malformed scoped JSON, or adapter error selects no goal. Mutations fail closed with stable `GoalError` codes and do not guess identity. |
| Rollback | To roll back runtime injection, disable the adapter while preserving both scoped state and legacy quarantine files. Do not merge scoped records back into a singleton. |

---

## 8. VALIDATION

```bash
node --test \
  .opencode/hooks/goal/lib/goal-slice.test.cjs \
  .opencode/hooks/goal/lib/goal-core.test.cjs \
  .opencode/hooks/goal/bin/goal.test.cjs \
  .opencode/hooks/goal/pi/goal-pi.test.mjs \
  .opencode/hooks/goal/cursor/goal-cursor.test.mjs \
  .opencode/hooks/goal/devin/goal-devin.test.mjs
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
python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py \
  --root .opencode/hooks/goal
```

Expected result: no alignment drift. Use temporary `OPENCODE_GOAL_STATE_DIR` paths for manual probes; never point migration fixtures at the operator's live state root.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`goal-plugin.md`](goal-plugin.md): OpenCode-native plugin contract and its relationship to this core.
- [`../injection-contract.md`](../injection-contract.md): runtime injection visibility contract.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../../commands/goal-opencode.md`](../../commands/goal-opencode.md): OpenCode-native command router.
- [`../../skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`](../../skills/system-spec-kit/references/workflows/goal-set-string-playbook.md): what an operator sets, the durable budget and the resend rule.
