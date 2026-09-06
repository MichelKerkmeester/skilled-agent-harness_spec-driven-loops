---
title: "Directive Lifecycle Hooks: Boundary-Gated Directive Delivery"
description: "Tracks per-session directive delivery so the constant advisor directives are shown once per startup/compaction boundary instead of on every turn."
trigger_phrases:
  - "directive lifecycle boundary"
  - "directive dedup"
  - "directives every message"
importance_tier: "important"
contextType: "reference"
---

# Directive Lifecycle Hooks: Boundary-Gated Directive Delivery

---

## 1. OVERVIEW

`directive-lifecycle/` is the index for the concern that keeps the Skill Advisor's constant directive block from being re-injected on every turn. The advisor brief appends a block of constant directives (comment-hygiene) after a `\nDirectives:` separator. Without dedup, that block rides along on every prompt. This concern records, per session, whether the block has already been delivered, and re-arms full delivery only on a lifecycle boundary (`startup` / `resume` / `compact` / `clear` / `post-compact`): so the directives appear at startup and after a compaction, not on every turn.

Two pieces cooperate. A **decision** function (`decideDirectiveLifecycleDelivery`, in the advisor's `lib/`) runs inside each runtime's prompt-submit path and chooses `full` or `suppressed` delivery against a durable, file-backed per-session store. A **boundary** adapter (`directive-lifecycle-boundary.ts`) runs on host lifecycle events and advances the store, bumping one session's epoch when identity is known, or invalidating every older record (a generation bump) when it is not, so a resume, compact, or clear forces the next prompt to re-deliver the full block.

The single most important property is that it **fails open**. A missing session id, an unconfirmed session, an invalid transcript, a clock mismatch, a store-set failure, or any internal error resolves to full delivery, so the guardrails are never silently lost. The boundary adapters emit no model-visible output at all; they only advance durable state.

The real code lives in `system-skill-advisor` (the canonical boundary adapter and the `lib/` decision + store) and `system-spec-kit` (a bridge shim that spawns the canonical target). This folder holds relative symlinks into both, indexed by runtime.

---

## 2. WHAT IT DOES

### Decision (runs in the prompt-submit path)

`decideDirectiveLifecycleDelivery(context, input)` splits the brief at the `\nDirectives:` separator into a `head` and a `directives` block, then decides per session:

| Condition | Decision |
|---|---|
| Kill-switch disabled, no separator, empty head, no session id, session unconfirmed, or invalid transcript | `full`: deliver the complete brief (fail open) |
| Lifecycle boundary event (`startup` / `resume` / `compact` / `clear`) | `full`, re-arm and commit a fresh record |
| No existing record, clock mismatch, directives text changed, transcript path changed, or transcript bytes went backwards (rollback) | `full`, re-deliver and commit |
| Same directives, same transcript path, transcript advanced, record committed | `suppressed`: deliver the `head` only, drop the directive block |

The store is bounded to 64 sessions (`MAX_DIRECTIVE_LIFECYCLE_SESSIONS`) with LRU eviction, schema version 2. A double-read clock check guards against concurrent generation bumps: if the store generation changes between the two reads, the decision falls open to full delivery.

### Boundary (runs on host lifecycle events)

`advanceDirectiveLifecycleBoundary(state, sessionId)` is the boundary entrypoint. With a non-empty session id it advances that session's epoch (`advanceSessionEpoch`); with no identity it bumps the whole store generation (`advanceGeneration`), invalidating every older record so the next prompt in any session re-delivers full. The Spec-Kit bridge shim (`speckit-directive-lifecycle-boundary.ts`) resolves the compiled canonical target by walking up to the `.opencode` ancestor and spawns it with a 500 ms timeout, 64 KiB stdio cap, and `SIGKILL` on timeout: fail-open on any resolution, spawn, or exit failure.

---

## 3. PER-RUNTIME DELIVERY

The decision logic is the same `lib/directive-lifecycle.ts` everywhere it runs. What differs is whether a runtime carries a separately indexed boundary adapter or reaches the behavior embedded in its shared prompt-submit lifecycle.

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/directive-lifecycle-boundary.ts` (Skill Advisor, canonical) + `claude/speckit-directive-lifecycle-boundary.ts` (Spec-Kit bridge) | Host lifecycle events; the bridge spawns the compiled canonical target | Advances durable state; emits no model-visible output |
| **Codex** | — | — | `by-design`: embedded in the shared `user-prompt-submit` lifecycle (the advisor handler calls `decideDirectiveLifecycleDelivery` directly) |
| **Cursor** | — | — | `by-design`: embedded in the shared `user-prompt-submit` lifecycle |
| **Devin** | — | — | `by-design`: embedded in the shared `user-prompt-submit` lifecycle |
| **OpenCode** | — | — | `by-design`: embedded in `system-skill-advisor` lifecycle state (the plugin bridge) |
| **Pi** | — | — | `by-design`: embedded in `prompt-advisor.ts` directive de-dup |

Only Claude carries a separately indexed boundary adapter. The other runtimes reach the same decision function inside their existing prompt-submit path, so no standalone adapter is wired for them (see the hub coverage matrix).

---

## 4. DIRECTORY TREE

```text
directive-lifecycle/
+-- README.md
`-- claude/
    +-- directive-lifecycle-boundary.ts        # symlink -> system-skill-advisor canonical boundary adapter
    `-- speckit-directive-lifecycle-boundary.ts # symlink -> system-spec-kit bridge shim
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` | Canonical boundary adapter. Reads a bounded stdin JSON (`session_id`, `boundary`), checks the kill-switch, and calls `advanceDirectiveLifecycleBoundary` against the default file-backed store. Emits no model-visible output. |
| `system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` | Spec-Kit bridge shim. Resolves the compiled canonical target by walking up to the `.opencode` ancestor (install-anchored, override via `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET`), spawns it with a 500 ms timeout and `SIGKILL`, and relays success. Fail-open on any error. |
| `system-skill-advisor/hooks/lib/directive-lifecycle.ts` | The decision core: `decideDirectiveLifecycleDelivery` (full vs suppressed), `advanceDirectiveLifecycleBoundary`, the `InMemoryDirectiveLifecycleStore`, and the default file-backed store handle. |
| `system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts` | Constants and types: `DIRECTIVE_SEPARATOR` (`\nDirectives:`), `MAX_DIRECTIVE_LIFECYCLE_SESSIONS` (64), `DIRECTIVE_LIFECYCLE_SCHEMA_VERSION` (2), `DIRECTIVE_LIFECYCLE_DEDUP_ENV`. |
| `system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` | The cross-process durable file-backed store the default handle wraps. |

The hub entries under `claude/` are relative symlinks into those two skills; edit the source, not the symlinks.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED=1` | Canonical kill-switch. The boundary adapters short-circuit (`directiveLifecycleEnabled()` returns false); the shared resolver disables the decision path. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` | Dedup toggle (default on). False-like values (`0`, `false`, `off`, `no`) restore complete delivery on every turn without disabling the kill-switch plumbing. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=<path>` | Overrides the durable store directory. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET=<path>` | Overrides the compiled boundary target the Spec-Kit bridge spawns (must exist). |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory only | Suppressing a repeat drops only the directive block; the prompt always proceeds. The boundary adapters emit no model-visible output: they advance durable state only. |
| Fail-open | Missing identity, unconfirmed session, invalid transcript, clock mismatch, store-set failure, missing target, spawn failure, timeout, or non-zero exit all resolve to full delivery (decision) or a no-op (boundary). |
| Bounded | Decision stdin 64 KiB; bridge child timeout 500 ms, stdio cap 64 KiB, `SIGKILL` on timeout; store bounded to 64 sessions with LRU eviction. |
| State | File-backed durable store, schema version 2, process-local handle with cross-process persistence. A double-read clock check detects concurrent generation bumps. |
| Imports | Adapters import Node builtins only, plus `../lib/directive-lifecycle.js` (canonical) and the shared `hook-flags.cjs` resolver via `createRequire`. Nothing outside the repo. |
| Real code | Stays in `system-skill-advisor` and `system-spec-kit`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

Build the advisor package (produces the compiled boundary target the bridge spawns):

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build
```

Expected result: build succeeds and `dist/hooks/claude/directive-lifecycle-boundary.js` is produced.

Run the advisor package test suite (covers the directive-lifecycle decision core and store):

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server test -- --reporter=default
```

Expected result: all tests pass.

Smoke-test the canonical boundary adapter (advances the store, exits 0):

```bash
printf '%s' '{"session_id":"smoke","boundary":"startup"}' | \
  node .opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/directive-lifecycle-boundary.js
echo "exit: $?"
```

Expected result: `exit: 0`.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../../skills/system-skill-advisor/hooks/skill-advisor-hook.md`](../../skills/system-skill-advisor/hooks/skill-advisor-hook.md): the advisor hook contract whose brief this concern dedups.
- [`../../skills/system-skill-advisor/hooks/lib/`](../../skills/system-skill-advisor/hooks/lib/): the decision core, contract, and file-backed store.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
