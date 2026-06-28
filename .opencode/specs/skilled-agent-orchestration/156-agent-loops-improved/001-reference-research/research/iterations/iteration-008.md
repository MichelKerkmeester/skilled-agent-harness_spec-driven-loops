# Iteration 8: S1-08 Serialize-Diff Persistence

## Focus

Dimension: D1 source-mining.

Focus area: [S1-08] How `loop-cli-main` avoids redundant daemon state writes by serializing a loop snapshot and writing only when that serialized snapshot changes, mapped to `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.

## Actions Taken

- Read the current research state log and strategy, then searched prior iteration files for `S1-08`, `serialize`, `state.ts`, and `atomic-state` to avoid duplicating earlier findings.
- Source-mined `loop-cli-main` daemon persistence across `src/daemon/manager.ts`, `src/daemon/state.ts`, and `src/shared/fs-utils.ts`.
- Compared the reference mechanism with our atomic writer in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` and its current tests in `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts`.

## Findings

1. Reference mechanism: the serialize-diff gate is not actually in `src/daemon/state.ts`; it lives one layer up in `LoopManager`. The manager keeps `lastSerialized` per loop [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:23`], fans multiple lifecycle events into one `persist` callback [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:263`], builds a `LoopMeta`, serializes it, returns early when unchanged, and only then calls `saveLoop` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:279`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. Add a reusable `writeStateIfChangedAtomic`-style helper that canonicalizes the payload, compares against a caller-owned or module-owned cache, and returns whether it wrote. Port difficulty: easy. Tag: quick-win. Why it helps: deep-loop reducers and fanout merge paths can suppress duplicate whole-snapshot rewrites without each caller reinventing an ad hoc `JSON.stringify` cache.

2. Reference mechanism: `state.ts` is the persistence sink, not the diff owner. It reads the whole `loops.json` array with corrupt-read fallback to `[]` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/state.ts:29`], serializes arrays with pretty JSON before atomic write [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/state.ts:40`], and `saveLoop` performs whole-array upsert before writing [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/state.ts:87`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. Keep the diff decision as a wrapper around state serialization, not inside every caller's domain-specific upsert logic. Port difficulty: med. Tag: quick-win. Why it helps: our workflow-owned registry/dashboard writes can stay full-snapshot and simple while gaining no-op suppression at the shared persistence layer.

3. Reference mechanism: the diff cache is intentionally ephemeral. The manager deletes the per-loop cached serialization when a loop is deleted [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:238`], but it does not seed `lastSerialized` from disk during `init`; the first post-restart persist will write, then later identical snapshots no-op [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:38`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:281`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts`. Add tests for unchanged repeat writes, first-write-after-empty-cache, and cache invalidation/forced-write behavior. Port difficulty: easy. Tag: quick-win. Why it helps: the current atomic-state tests cover replacement and temp cleanup [TARGET: `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:29`], but not no-op semantics or cache lifecycle.

4. Reference mechanism: `loop-cli-main` combines diff suppression with a minimal atomic rename helper that writes a temp sibling and renames it [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/shared/fs-utils.ts:9`]. Our writer is already stronger: it writes a temp file, fsyncs it, renames, then attempts to fsync the parent directory [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:58`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. Port only the serialize-diff gate and preserve our existing temp+fsync+rename durability contract. Port difficulty: easy. Tag: quick-win. Why it helps: we reduce write amplification without weakening crash-safety guarantees that deep-loop-runtime already advertises.

## Questions Answered

- [S1-08] Answered. `loop-cli-main` does write-only-on-change by keeping an in-memory `Map<loopId, serializedMeta>`, serializing `toMeta(...)` with `JSON.stringify`, skipping when the new string matches the cached string, and delegating actual persistence to `saveLoop` only on change.
- The prompt premise was partly off: `state.ts` owns whole-array persistence and atomic replace; `manager.ts` owns the serialize-diff comparison.

## Questions Remaining

- Whether our shared helper should use caller-provided cache state, an internal path-keyed cache, or both. Caller-provided cache is safer for tests and long-running reducers; internal path-keyed cache is more ergonomic but needs explicit invalidation.
- Whether no-op suppression should be limited to JSON state snapshots or also exposed for text outputs through `writeTextAtomic`.

## Next Focus

[S1-09] How `loop-cli-main` guarantees single-flight via socket-bind-before-init in `src/daemon/server.ts`, and how that compares with `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
