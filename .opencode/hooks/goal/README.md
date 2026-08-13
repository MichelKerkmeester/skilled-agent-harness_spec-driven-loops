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

## 1. OVERVIEW

`.opencode/hooks/goal/` provides passive goal steering for runtimes that can supply a verified native session identity. Each supported read or mutation resolves one composite scope:

```text
workspace + runtime + native session id -> one opaque state file and one archive namespace
```

There is no default session and no process-global current-goal pointer. Missing identity makes reads return no goal and makes management fail with a stable error. The legacy singleton `active-goal.json` is diagnostic input only and is never an injection fallback.

OpenCode's `.opencode/plugins/mk-goal.js` remains a separate native implementation. It has its own per-OpenCode-session files, fixed opaque SHA-256 state keys, token accounting, lifecycle events, and guarded continuation. Existing reversible hex-keyed files are adopted lazily after their embedded session id is validated.

## 2. RUNTIME SUPPORT

| Runtime | Injection | Current-session management | Verification / continuation | Status |
|---|---|---|---|---|
| Pi | `input`, restore on `session_start` | Native `/goal-pi` registered by the extension | Heuristic check on `turn_end`; no forced continuation | Supported |
| Cursor | `sessionStart` using `session_id`, then `conversation_id` fallback | Unavailable because prompt commands do not receive the hook's native identity | Turn touch only; no continuation | Injection-only |
| OpenCode | Native `mk-goal` plugin, outside this core | Native `/goal-opencode` tools | Native verifier and guarded continuation | Separate supported system |
| Claude Code | No adapter in this core | No repository command; live native capability unverified here | Outside this core | Not provided here |
| Codex | No adapter | None | None | Unsupported |

A runtime is not called fully supported unless injection and management bind the same native current-session identity. Cursor therefore remains injection-only, and its `/goal-cursor` prompt fails closed instead of invoking an unbound CLI.

## 3. STATE LAYOUT

The default state root is `.opencode/skills/.goal-state/`. Tests and isolated probes override it with `MK_GOAL_STATE_DIR`.

```text
.goal-state/
├── <sha256-of-canonical-scope>.json
├── .locks/
│   └── <sha256-of-lock-identity>.lock/
├── .archive/
│   ├── <sha256-of-canonical-scope>/
│   │   └── active-goal-<safe-goal-id>-<record-digest>.json
│   └── .legacy/
│       └── active-goal-<goal-id-or-content-digest>.json
└── active-goal.json                    # legacy, diagnostic-only when present
```

The canonical scope digest hashes the unambiguous JSON serialization of the resolved
repository root, runtime, and native session id. This keeps workspaces isolated even when
they share an explicit state root. The previous runtime-plus-session-digest layout is
adopted only under the matching workspace-default state root, where ownership is
unambiguous.

Raw identities never appear in filenames or aggregate diagnostics. State files use mode
`0600`; created directories use mode `0700`; writes use a temporary file, `fsync`, and
atomic rename. Lifecycle mutations take cross-process filesystem locks. Archive filenames
use segment-safe identities, and resolved targets must remain inside the real state root.

## 4. MANAGE CLI

The CLI requires native scope flags for all current-session actions:

```bash
node .opencode/hooks/goal/bin/goal.cjs \
  --runtime pi \
  --session '<native-session-id>' \
  --workspace "$PWD" \
  set 'Ship the isolated goal' --budget 500
```

Current-session actions are `set`, `show`, `history`, `clear`, `complete`, `pause`, and `resume`. `doctor` and `health` are aggregate-only and need no session binding. They report counts and legacy classification without enumerating raw identities.

Legacy actions are explicit:

```bash
# Non-mutating classification; valid records include their operator-visible objective.
node .opencode/hooks/goal/bin/goal.cjs legacy-inspect

# Bind a valid active/paused legacy record to this exact native session.
node .opencode/hooks/goal/bin/goal.cjs \
  --runtime pi --session '<native-session-id>' --workspace "$PWD" \
  legacy-migrate

# Preserve valid or malformed legacy bytes without assigning an owner.
node .opencode/hooks/goal/bin/goal.cjs legacy-archive
```

`legacy-migrate` refuses an occupied target, never replaces another session's goal, and moves the singleton into `.archive/.legacy/` only after the scoped record is written. Repeating migrate/archive after the source is gone is a successful no-op. Malformed legacy data cannot migrate; it can only be inspected and archived.

## 5. INJECTION CONTRACT

`renderGoalBrief()` produces a bounded `[active_goal:<goal-id>] ... [/active_goal]` block. Objective and role-like input is normalized before storage. Only `active` records inject; paused, completed, cleared, missing, malformed, unbound, or legacy-only state produces no block.

Non-OpenCode runtimes use turn-count estimation because they do not expose the same native token feed as OpenCode. Stored and rendered `usageSource` is `turn-count-estimate`.

## 6. FILES

| File | Responsibility |
|---|---|
| `lib/goal-core.cjs` | Scope validation, opaque paths, atomic state, lifecycle, rendering, verification, diagnostics, and legacy quarantine. |
| `bin/goal.cjs` | Stable command envelope and explicit scope/legacy actions. |
| `pi/goal-context.ts` | Pi native lifecycle binding and authoritative `/goal-pi` command. |
| `cursor/goal-inject.mjs` | Cursor session-bound injection. |
| `lib/goal-core.test.cjs` | Core, lifecycle, concurrency, legacy, hardening, and CLI contract coverage. |
| `bin/goal.test.cjs` | CLI binding, privacy, concurrency, and legacy action coverage. |

## 7. FAILURE AND ROLLBACK

- `MK_GOAL_PLUGIN_DISABLED=1` disables goal behavior and management.
- Reads fail open: missing identity, missing state, malformed scoped JSON, or adapter failure selects no goal.
- Mutations fail closed with stable `GoalError` codes and do not guess identity.
- To roll back runtime injection, disable the adapter while preserving both scoped state and legacy quarantine files. Do not merge scoped records back into a singleton.
- Pi discovery can be disabled with `-extensions/goal-context.ts` in `.pi/settings.json`; re-enable only after the integrated two-session matrix is green.

## 8. VERIFICATION

```bash
node --test \
  .opencode/hooks/goal/lib/goal-core.test.cjs \
  .opencode/hooks/goal/bin/goal.test.cjs \
  .opencode/hooks/goal/pi/goal-pi.test.mjs \
  .opencode/hooks/goal/cursor/goal-cursor.test.mjs

node --test .opencode/plugins/tests/mk-goal-*.test.cjs

python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py \
  --root .opencode/hooks/goal
```

Use temporary `MK_GOAL_STATE_DIR` paths for manual probes. Never point migration fixtures at the operator's live state root.

## 9. RELATED

- [`goal-plugin.md`](goal-plugin.md): OpenCode-native plugin contract and its relationship to this core.
- [`../injection-contract.md`](../injection-contract.md): runtime injection visibility contract.
- [`../../commands/goal-opencode.md`](../../commands/goal-opencode.md): OpenCode-native command router.
