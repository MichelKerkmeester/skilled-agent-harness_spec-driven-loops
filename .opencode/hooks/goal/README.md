---
title: "Goal Hooks: Session-Isolated Cross-Runtime Goals"
description: "Session-scoped goal storage, native runtime bindings, explicit legacy quarantine, and verification for Pi and Cursor."
trigger_phrases:
  - "cross-runtime goal core"
  - "goal manage cli"
  - "session goal isolation"
  - "legacy active goal migration"
---

# Goal Hooks: Session-Isolated Cross-Runtime Goals

---

## 1. OVERVIEW

`.opencode/hooks/goal/` provides passive goal steering for runtimes that can supply a verified native session identity. Each supported read or mutation resolves one composite scope:

```text
workspace + runtime + native session id -> one opaque state file and one archive namespace
```

There is no default session and no process-global current-goal pointer. Missing identity makes reads return no goal and makes management fail with a stable error. The legacy singleton `active-goal.json` is diagnostic input only and is never an injection fallback.

The core (`lib/goal-core.cjs`) was ported from the OpenCode `opencode-goal` plugin's session state machine, template, and prompt-injection hardening. OpenCode's `.opencode/plugins/opencode-goal.js` remains a separate, larger native implementation with its own per-OpenCode-session files, fixed opaque SHA-256 state keys, token accounting, lifecycle events, and guarded continuation. The two share the same kill switch and the same state-directory contract, but the OpenCode plugin does not import this core.

---

## 2. WHAT IT DOES

The core owns scope validation, opaque path resolution, atomic state I/O, the goal lifecycle, the rendered steering block, the heuristic verifier, diagnostics, and legacy quarantine. It never writes stdout or stderr.

**Injection.** `renderGoalBrief()` produces a bounded `[active_goal:<goal-id>] ... [/active_goal]` block whose markers and field-line labels (`status:`, `objective:`, `goal_prompt:`, `last_check:`, `usage:`, `directive:`) match `opencode-goal`'s `renderGoalInjection` byte-for-byte. The `usage:` line reports `turn-count-estimate` honestly, since no native token feed exists outside OpenCode. Only `active` records inject; paused, completed, cleared, missing, malformed, unbound, or legacy-only state produces no block. A compact fallback block (same shape as `opencode-goal`'s fallback) is used when the full block would exceed the char budget. Objective and role-like input is normalized before storage: `normalizeUserAuthoredText` does NFKC normalization, strips bidi/zero-width control characters, redacts forged `[active_goal]` markers, downgrades fenced code blocks, folds homoglyph role tokens (Cyrillic/Greek → Latin), and redacts common instruction-override phrasing.

**Goal prompt.** `buildGoalPrompt()` builds a RICCE skeleton (Role / Objective / Context / Method / Success Criteria / Stop Conditions) with the Role line parameterized per runtime (`opencode-goal` hardcodes "OpenCode execution agent"). Focus hints are derived from the objective's keywords (fix → root-cause-first, implement → smallest-correct, test → run-verification, review → ground-in-evidence).

**Verification.** `verifyGoalHeuristic()` is ported from `opencode-goal`'s default heuristic supervisor. Blocking language (`blocked`, `error`, `failed`, `cannot`, `incomplete`, `pending`, ...) → `not-met`; an explicit completion signal (`done`, `completed`, `shipped`, `tests passed`, ...) tied to the objective's keywords → `met` (confidence 0.72); ambiguous or mixed evidence stays `unclear` rather than `met`. It never forces continuation — non-OpenCode runtimes have no native continuation surface.

**State layout.** The default state root is `.opencode/skills/.goal-state/` (override with `OPENCODE_GOAL_STATE_DIR` for tests/probes):

```text
.goal-state/
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

**Manage CLI.** `bin/goal.cjs` is a thin router over the core for runtimes with no plugin tool surface. Current-session actions (`set`, `show`, `history`, `clear`, `complete`, `pause`, `resume`) require `--runtime`, `--session`, and `--workspace`. `doctor` and `health` are aggregate-only (counts and legacy classification, no raw identities). Legacy actions are explicit: `legacy-inspect` (non-mutating classification), `legacy-migrate` (bind a valid legacy record to this exact native session — refuses an occupied target, never replaces another session's goal, moves the singleton to `.archive/.legacy/` only after the scoped record is written), and `legacy-archive` (preserve bytes without assigning an owner). Malformed legacy data cannot migrate; it can only be inspected and archived.

---

## 3. PER-RUNTIME DELIVERY

The core is runtime-neutral; each adapter binds it to a native lifecycle event and supplies the session identity.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Pi** | `pi/goal-context.ts` | `input` + `session_start` + `turn_end`; registers `/goal-pi` command, discovered via `.pi/extensions/` | `ctx.sessionManager.getSessionId()` for native identity; `ctx.cwd` for workspace | `input` → `{action: "transform", text: ...}` (per-turn injection, chains additively). `session_start` → restore via `pi.sendMessage`. `turn_end` → heuristic verify, observe-only nudge via `pi.sendMessage` when not met, records turn. `/goal-pi` shells to `bin/goal.cjs` with scope flags. |
| **Cursor** | `cursor/goal-inject.mjs` | `sessionStart` only | `session_id` then `conversation_id` fallback; `workspace_roots[0]` for workspace | `{permission: 'allow', agent_message: brief}`. Injection-only — no management (prompt commands don't receive native identity), no mid-session refresh, no verify/continue. Model-visibility is recorded-evidence, not a proven end-to-end guarantee. |
| **OpenCode** | `.opencode/plugins/opencode-goal.js` (mirrored at `opencode/`) | Native OpenCode plugin, outside this core | Owns per-OpenCode-session files, token accounting, lifecycle events | Native `/goal-opencode` tools, native verifier, guarded continuation. A separate implementation that shares the kill switch and state-directory contract but does not import this core. |
| **Claude** | — | — | — | `by-design`: goal state ships only on native session-bound goal surfaces. No adapter in this core. |
| **Codex** | — | — | — | `by-design`: same. No adapter. |
| **Devin** | — | — | — | `by-design`: same. No adapter. |

A runtime is not called fully supported unless injection and management bind the same native current-session identity. Cursor therefore remains injection-only, and its `/goal-cursor` prompt fails closed instead of invoking an unbound CLI. Pi is the only runtime here with both injection and management bound to the same native identity, plus a heuristic verify surface.

OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/opencode-goal.js` is a browsability-only symlink back into that folder and nothing loads through it. Pi loads in the other direction: the real `pi/goal-context.ts` lives here, and `.pi/extensions/` holds the relative symlink Pi discovers.

---

## 4. DIRECTORY TREE

```text
goal/
+-- lib/
|   +-- goal-core.cjs              # scope validation, opaque paths, atomic state, lifecycle, rendering, verifier, legacy quarantine
|   `-- goal-core.test.cjs         # core, lifecycle, concurrency, legacy, hardening, CLI contract coverage
+-- bin/
|   +-- goal.cjs                   # manage CLI: stable envelope + explicit scope/legacy actions
|   `-- goal.test.cjs              # CLI binding, privacy, concurrency, legacy action coverage
+-- cursor/   goal-inject.mjs       # sessionStart-only injection
+-- pi/       goal-context.ts       # Pi native lifecycle + /goal-pi command (real file; `.pi/extensions/` symlinks to it)
`-- opencode/ opencode-goal.js      # browsability symlink -> ../../../plugins/opencode-goal.js
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/goal-core.cjs` | Scope validation (`resolveGoalScope`), opaque SHA-256 path resolution, atomic state I/O (temp + fsync + rename, mode 0600/0700, cross-process locks), the goal lifecycle (`set`/`show`/`clear`/`complete`/`pause`/`resume`/`history`), `renderGoalBrief` (byte-compatible `[active_goal]` block), `buildGoalPrompt` (RICCE skeleton), `verifyGoalHeuristic`, diagnostics (`doctor`/`health`), and legacy quarantine (`legacy-inspect`/`legacy-migrate`/`legacy-archive`). Reads fail open; mutations raise stable `GoalError` codes. |
| `bin/goal.cjs` | Stable `STATUS=`/`ACTION=` command envelope and explicit scope/legacy actions. Never writes goal state directly — every mutation goes through the shared core. |
| `pi/goal-context.ts` | Pi native lifecycle binding. Registers `/goal-pi`, injects on `input`, restores on `session_start`, verifies on `turn_end`. Dynamic-imports the core (supports both canonical and discovery-symlink paths). |
| `cursor/goal-inject.mjs` | Cursor `sessionStart`-only injection. Reads the active goal, renders the brief, returns it as `agent_message`. Fails open unconditionally. |
| `lib/goal-core.test.cjs`, `bin/goal.test.cjs` | Core, lifecycle, concurrency, legacy, hardening, CLI binding, privacy, and legacy action coverage. |

`.opencode/plugins/opencode-goal.js` is the OpenCode-native plugin; it is a separate implementation that shares the kill switch and state directory but does not import this core.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `OPENCODE_GOAL_DISABLED=1` | Disables goal behavior and management across this core and the OpenCode plugin. The shared resolver (`isHookEnabled('goal')`) short-circuits every adapter. |
| `OPENCODE_GOAL_PLUGIN_DISABLED=1` | Legacy alias of the canonical flag. Also the OpenCode plugin's own `DISABLED_ENV`. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `OPENCODE_GOAL_STATE_DIR` | Override the state root (tests and isolated probes use this to avoid touching the real `.goal-state/` tree). |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session. Pi discovery can additionally be disabled with `-extensions/goal-context.ts` in `.pi/settings.json`.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins only and `../../shared/hook-flags.cjs`. Adapters import `../lib/goal-core.cjs` (Cursor via `createRequire`; Pi via dynamic `import`). Nothing imports the OpenCode plugin. |
| Scope | Every read or mutation resolves a composite `workspace + runtime + native session id` scope. No default session, no process-global current-goal pointer. Missing identity → no goal on read, stable error on mutation. |
| State | Atomic writes (temp + fsync + rename), mode 0600 files / 0700 dirs, cross-process filesystem locks. Raw identities never appear in filenames or aggregate diagnostics. |
| Failure | Reads fail open: missing identity, missing state, malformed scoped JSON, or adapter error selects no goal. Mutations fail closed with stable `GoalError` codes and do not guess identity. |
| Rollback | To roll back runtime injection, disable the adapter while preserving both scoped state and legacy quarantine files. Do not merge scoped records back into a singleton. |

---

## 8. VALIDATION

```bash
node --test \
  .opencode/hooks/goal/lib/goal-core.test.cjs \
  .opencode/hooks/goal/bin/goal.test.cjs \
  .opencode/hooks/goal/pi/goal-pi.test.mjs \
  .opencode/hooks/goal/cursor/goal-cursor.test.mjs
```

Expected result: all tests pass.

```bash
node --test .opencode/plugins/tests/opencode-goal-*.test.cjs
```

Expected result: all OpenCode plugin tests pass.

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
