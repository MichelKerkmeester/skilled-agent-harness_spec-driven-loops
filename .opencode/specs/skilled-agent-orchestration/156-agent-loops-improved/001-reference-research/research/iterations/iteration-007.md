# Iteration 7: S1-07 Conditional Follow-Up Task Chains

## Focus

[S1-07] How does `loop-cli-main` chain conditional follow-up tasks through `onSuccessTaskId` / `onFailureTaskId` and `chainGroupId`, and what does that imply for `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`?

## Actions Taken

1. Loaded the deep-research quick reference and output-file contract to keep this pass inside the iteration artifact format.
2. Searched `loop-cli-main` for `onSuccessTaskId`, `onFailureTaskId`, `chainGroupId`, and chain-loop vocabulary, then checked prior iteration artifacts for duplication.
3. Inspected `loop-cli-main` task types, chain execution, TUI task form behavior, and daemon task persistence to distinguish real chain guards from UI-only constraints.
4. Inspected our `fallback-router.ts` and its unit tests to map source mechanisms to exact backlog targets.

## Findings

1. Reference mechanism: `loop-cli-main` models task chains as nullable success/failure pointers on the task definition, then selects the first chain target from the initial task's exit code [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/types.ts:10`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/types.ts:15`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:394`]. It then repeats the same outcome-selection rule after each chained command [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:423`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:444`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
   - Backlog item: add an outcome-routed route contract, such as success/failure next-target metadata, before turning executor fallback into a multi-step router.
   - Port difficulty: med
   - Tag: deep-rewrite

2. Reference mechanism: all follow-up task records share a generated `chainGroupId`; the main record receives the group id, and each chained record gets the group id plus a `chainName` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:396`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:398`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:411`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:419`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:420`]. Our current `FallbackRoute` only returns `action`, optional `target`, and `reason` [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:7`; SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:10`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
   - Backlog item: return route-trace metadata, such as `routeGroupId` and ordered hops, so chained executor fallback can be audited without parsing prose reasons.
   - Port difficulty: easy
   - Tag: quick-win

3. Reference mechanism: `loop-cli-main` executes chains by repeatedly resolving `currentTargetId`; missing tasks break the loop, and `null` success/failure pointers stop it [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:400`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:402`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:403`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:444`]. This is not a robust infinite-chain guard: the task form filters direct self-selection in edit mode [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/board/components/TaskForm.tsx:155`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/board/components/TaskForm.tsx:158`], but daemon updates persist arbitrary success/failure pointers without transitive cycle validation [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/task-manager.ts:37`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/task-manager.ts:42`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
   - Backlog item: if fallback routing becomes chained, add explicit `visited` and `maxHops` guards in the pure router instead of copying the source loop as-is.
   - Port difficulty: med
   - Tag: quick-win

4. Reference mechanism: `loop-cli-main` discovers an invalid chain pointer at runtime and silently stops when `taskResolver(currentTargetId)` returns no task [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:402`; SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:403`]. Our current fallback router already fails fast for one missing configured target [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:70`; SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:75`], and tests cover the single-hop missing-target case [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:90`; SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:94`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
   - Backlog item: preserve the fail-fast posture for all configured chain pointers, preferably through a preflight validator that returns every missing or cyclic edge before dispatch.
   - Port difficulty: med
   - Tag: quick-win

## Questions Answered

Answered S1-07. `loop-cli-main` chains tasks by following outcome-selected task ids after each command and groups the resulting run-history records with `chainGroupId`. It does not have a strong executor-level infinite-chain stop; termination is `null`, missing task, or external cancellation, with only a UI-level direct-self filter on task editing.

## Questions Remaining

- Whether our backlog should model chained fallback as executable dispatch or keep it as pure planning metadata until the executor layer can emit per-hop audit events.
- Whether chain validation belongs only in `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` or also in the registry-loading path that constructs `ModelRegistry`.
- [S1-08] remains open: how `loop-cli-main` daemon state implements serialize-diff persistence and whether `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` should adopt a write-only-on-change snapshot path.

## Next Focus

[S1-08] How does `loop-cli-main`'s daemon state implement serialize-diff persistence, and how should that map to `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`?
