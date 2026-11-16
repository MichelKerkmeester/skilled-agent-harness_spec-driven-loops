---
title: "Directive Lifecycle Hooks: Boundary-Gated Directive Delivery"
description: "Tracks per-session directive delivery so the constant advisor directives appear once per startup or compaction boundary instead of on every turn."
trigger_phrases:
  - "directive lifecycle boundary"
  - "directive dedup"
  - "directives every message"
  - "claude directive lifecycle boundary"
  - "directive lifecycle bridge"
  - "speckit directive boundary"
importance_tier: "important"
contextType: "reference"
---

# Directive Lifecycle Hooks: Boundary-Gated Directive Delivery

---

## 1. OVERVIEW

`directive-lifecycle/` indexes one concern. It keeps the Skill Advisor's constant directive block from repeating on every turn. The advisor brief appends that block after a `\nDirectives:` separator. Without a record, the block rides along on every prompt.

The concern records, per session, whether the block was already delivered. It re-arms full delivery only on a lifecycle boundary. Those boundaries are `startup`, `resume`, `compact`, `clear` and `post-compact`. So the directives appear at startup and after a compaction, not on every turn.

The concern splits into a decision and a boundary. The decision function, `decideDirectiveLifecycleDelivery`, runs inside each runtime's prompt-submit path. It chooses `full` or `suppressed` delivery against a durable, file-backed per-session store. The boundary adapter, `directive-lifecycle-boundary.ts`, runs on host lifecycle events and advances that store.

The adapter bumps one session's epoch when identity is known. With no identity it invalidates every older record, a generation bump. Either way the next prompt re-delivers the full block.

The single most important property is that it fails open. A missing session id, an unconfirmed session, an invalid transcript, a clock mismatch, a store-set failure or any internal error resolves to full delivery. The guardrails are therefore never silently lost. The boundary adapters emit no model-visible output at all. They only advance durable state.

The real code lives in `system-skill-advisor` and `system-spec-kit`. This folder holds relative symlinks into both, indexed by runtime.

---

## 2. HOW IT WORKS

`decideDirectiveLifecycleDelivery(context, input)` splits the brief at the `\nDirectives:` separator into a `head` and a `directives` block. It then decides per session.

| Condition | Decision |
|---|---|
| De-dup switch off, no separator, empty head, no session id, session unconfirmed or invalid transcript | `full`: deliver the complete brief (fail open) |
| Lifecycle boundary event (`startup`, `resume`, `compact`, `clear`) | `full`, re-arm and commit a fresh record |
| No existing record, clock mismatch, directives text changed, transcript path changed or transcript bytes went backwards (rollback) | `full`, re-deliver and commit |
| Same directives, same transcript path, transcript advanced, record committed | `suppressed`: deliver the `head` only, drop the directive block |

Suppressing a repeat drops only the directive block. The prompt always proceeds.

The store is bounded to 64 sessions (`MAX_DIRECTIVE_LIFECYCLE_SESSIONS`) with LRU eviction, at schema version 2. A double-read clock check guards against concurrent generation bumps. If the store generation changes between the two reads, the decision falls open to full delivery.

`advanceDirectiveLifecycleBoundary(state, sessionId)` is the boundary entrypoint. With a non-empty session id it advances that session's epoch through `advanceSessionEpoch`. With no identity it bumps the whole store generation through `advanceGeneration`. That invalidates every older record, so the next prompt in any session re-delivers full.

The Spec-Kit bridge shim, `speckit-directive-lifecycle-boundary.ts`, resolves the compiled canonical target. It walks up to the `.opencode` ancestor and spawns that target. The child gets a 500 ms timeout, a 64 KiB stdio cap and `SIGKILL` on timeout. Any resolution, spawn or exit failure is fail-open.

No hook registration names either boundary file. The bridge exports `notifyDirectiveLifecycleBoundary`, which the session-start and compaction adapters import and call directly:

- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/cursor/session-start.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/cursor/precompact.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/devin/session-start.ts`

`.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` loads the compiled `directive-lifecycle-boundary.js` instead. It passes `post-compact` as the boundary.

The canonical adapter imports Node builtins and the decision core. It loads `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` by its compiled `.js` name. The shared `hook-flags.cjs` resolver arrives through `createRequire`. The bridge imports Node builtins and the spec-kit helpers `esm-entry.js` and `shared-stdin.js`. It never imports the canonical core. Nothing outside the repo is imported.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | None registered | `claude/directive-lifecycle-boundary.ts` | `.skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` | Nothing. It advances durable state and exits 0 or 1. |
| Claude | None registered | `claude/speckit-directive-lifecycle-boundary.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` | Nothing. It spawns the compiled target and exits 0 or 1. |
| Codex | None registered | None | `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` | Nothing from the boundary. The adapter calls the bridge at startup. |
| Cursor | None registered | None | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/session-start.ts` | Nothing from the boundary. The adapter calls the bridge at startup. |
| Devin | None registered | None | `.skilled/skills/system-spec-kit/runtime/hooks/devin/session-start.ts` | Nothing from the boundary. The adapter calls the bridge at startup. |
| Vibe | None registered | None | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | Nothing from the boundary. The detector rebuilds the goal slice and the open handoff pointer after a compaction. |
| OpenCode | None registered | None | `.opencode/plugins/system-skill-advisor.js` | The route line only, on a confirmed repeat. |
| Pi | None registered | None | `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Nothing, on a proven same-content repeat. |
| DSH | None registered | None | `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` | The routing head only, while the same block is still in context. |

No registration names a path in this folder. The two links exist for browsing. Nothing loads through them. The missing entries are `by-design`.

Claude, Codex, Cursor and Devin reach the boundary through the Spec-Kit bridge. Their session-start and compaction adapters call `notifyDirectiveLifecycleBoundary` directly. Devin's post-compaction adapter spawns the compiled bridge instead.

Vibe advances the boundary itself, through `advanceDirectiveLifecycleBoundary` in `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`. It imports the compiled module and fails open when the import fails.

The decision logic is the same on every runtime except Pi. Claude, Codex, Cursor and Devin reach it inside the shared `user-prompt-submit` lifecycle. OpenCode mirrors it in `system-skill-advisor` lifecycle state, inside the plugin. DSH runs the shared decision, then de-dups the block again under the `directive-lifecycle` concern.

Pi uses its own in-memory check in `prompt-advisor.ts`. It drops its whole contribution on a proven same-content repeat. `SPECKIT_PI_DIRECTIVE_DEDUP` toggles that in-memory check, which is on by default.

---

## 4. DIRECTORY TREE

```text
directive-lifecycle/
+-- README.md
`-- claude/
    +-- directive-lifecycle-boundary.ts -> ../../../skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts
    `-- speckit-directive-lifecycle-boundary.ts -> ../../../skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` | Canonical boundary adapter. It reads a bounded stdin JSON (`session_id`, `boundary`) up to 64 KiB. It checks the kill-switch through `directiveLifecycleEnabled()` and calls `advanceDirectiveLifecycleBoundary` against the default file-backed store. It emits no model-visible output. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` | Spec-Kit bridge shim. It resolves the compiled canonical target by walking up to the `.opencode` ancestor, then spawns it with a 500 ms timeout and `SIGKILL`. The override is `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET`. An override that is not an absolute regular file is ignored. The bridge then falls back to the install-anchored walk from its own folder, not the working directory. Any error is fail-open. |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` | The decision core. It holds `decideDirectiveLifecycleDelivery`, `advanceDirectiveLifecycleBoundary`, the `InMemoryDirectiveLifecycleStore` and the default file-backed store handle. |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts` | Constants and types. It holds `DIRECTIVE_SEPARATOR` (`\nDirectives:`), `MAX_DIRECTIVE_LIFECYCLE_SESSIONS` (64), `DIRECTIVE_LIFECYCLE_SCHEMA_VERSION` (2) and `DIRECTIVE_LIFECYCLE_DEDUP_ENV`. |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` | The cross-process durable file-backed store the process-local default handle wraps. |

The entries under `claude/` are relative symlinks into those two skills. Edit the source, not the symlinks.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on`, in any case, for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED=1` | Canonical kill-switch. It stops the boundary adapters and the DSH de-dup. The shared prompt-submit decision obeys only `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` | Dedup toggle, on by default. False-like values (`0`, `false`, `off`, `no`) restore complete delivery on every turn without disabling the kill-switch plumbing. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=<path>` | Overrides the durable store directory. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET=<path>` | Overrides the compiled boundary target the Spec-Kit bridge spawns. The path must be absolute and must name a regular file. |

Set a flag inline for one command, export it for a session or persist it in `.skilled/hooks/hook-flags.env`. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for one session.

---

## 7. VALIDATION

Build the advisor package first. It produces the compiled boundary target the bridge spawns.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

Expected result: the build succeeds and `dist/hooks/claude/directive-lifecycle-boundary.js` is produced.

Run the advisor package test suite. It covers the decision core and the store.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime test -- --reporter=default
```

Expected result: all tests pass.

The decision core tests are `.skilled/skills/system-skill-advisor/runtime/tests/hooks/directive-lifecycle.vitest.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/hooks/directive-lifecycle-boundary.vitest.ts`. The bridge test is `.skilled/skills/system-spec-kit/runtime/tests/directive-lifecycle-boundary-bridge.vitest.ts`.

Smoke-test the canonical boundary adapter. It advances the store and exits 0.

```bash
printf '%s' '{"session_id":"smoke","boundary":"startup"}' | \
  node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/directive-lifecycle-boundary.js
echo "exit: $?"
```

Expected result: `exit: 0`.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the kill-switch index and the coverage matrix.
- [`../../skills/system-skill-advisor/hooks/skill-advisor-hook.md`](../../skills/system-skill-advisor/hooks/skill-advisor-hook.md): the advisor hook contract whose brief this concern dedups.
- [`../../skills/system-skill-advisor/hooks/lib/`](../../skills/system-skill-advisor/hooks/lib/): the decision core, the contract and the file-backed store.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
