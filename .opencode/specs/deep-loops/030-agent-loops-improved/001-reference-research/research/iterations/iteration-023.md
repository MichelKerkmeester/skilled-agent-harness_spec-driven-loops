# Iteration 23: S3-09 Typed Fallback Routing

## Focus

[S3-09] Should `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` adopt kasper's scope-aware reroute and loop-cli's success/failure chaining so a failed executor routes to a typed next executor rather than a flat retry?

## Actions Taken

1. Loaded the deep-research packet contract and spec-kit modification rules, then kept this pass to leaf-agent local reads and artifact writes.
2. Checked prior iteration artifacts, especially iteration 7, to avoid repeating the already-mined loop-cli chain basics.
3. Read OUR current fallback router, its tests, executor config schema, feature catalog, and playbook to establish the exact target surface.
4. Mined loop-cli's outcome-chain source lines and kasper's scope/reroute source lines, then mapped both to concrete backlog items for the router.

## Findings

### Rank 1 - Add Scope-Compatible Route Resolution

Reference mechanism: kasper tells the scorer that a current agent prompt defines the agent's role and scope, then asks suggestions to target either project-wide rules or the agent prompt [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:44`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:49`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:53`]. It also feeds both the current agent prompt and AGENTS.md into the scoring prompt so target choice is based on actual scope context [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:1433`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:1442`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`. This helps because OUR `ModelProfile` only carries `id`, `quota_pool`, and `fallback_target`, and `resolveFallback()` can only gate by pool and caller-approved model id [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:13`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:15`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:85`]. Backlog item: extend route input with typed scope metadata such as executor kind, loop type, capabilities, and allowed role, then reject or explicitly mark fallbacks that widen the failed executor's scope.

Port difficulty: med.

Tag: quick-win.

### Rank 2 - Replace Single-Hop Fallback With Outcome-Routed Next Hops

Reference mechanism: loop-cli stores `onSuccessTaskId` and `onFailureTaskId` on each task definition [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:10`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:15`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:16`]. The controller chooses the initial follow-up from the first exit code and repeats the same outcome rule after every chained task [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:394`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:444`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`. This helps because OUR route output is a flat discriminated shape with only `fallback` or `fail-fast`, one optional target, and a prose reason [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:5`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:7`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:92`]. Backlog item: introduce a typed next-hop contract, for example `onFailureTarget`, `onSuccessTarget`, `failureKind`, and `routeOutcome`, so validation failure, timeout, model mismatch, and quota exhaustion can route to different executors instead of sharing one static fallback target.

Port difficulty: med.

Tag: deep-rewrite.

### Rank 3 - Add Route Group And Hop Metadata For Auditing

Reference mechanism: loop-cli assigns one `chainGroupId` to the main run and each chained record, stores per-hop `chainName`, and the UI groups records by that id to calculate combined success, duration, log size, and running state [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:396`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:398`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:419`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/RunHistory.tsx:25`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/RunHistory.tsx:31`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`. This helps because `FallbackRoute` currently has no structured route trace fields beyond `target` and `reason` [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:7`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:10`]. Backlog item: return route trace metadata such as `routeGroupId`, `hopIndex`, `source`, `target`, `failureKind`, and `scopeDecision`; executor audit can persist those fields later without parsing reason text.

Port difficulty: easy.

Tag: quick-win.

### Rank 4 - Preflight Fallback Graphs And Make Reroutes Explicit

Reference mechanism: loop-cli's chain execution loops while `currentTargetId` exists, breaks on a missing task, and updates the next target from each chained exit code [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:400`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:402`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:403`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:444`]. Kasper adds the missing safety nuance: if an agent-prompt improvement targets a built-in agent with no real prompt file, it logs a reroute and applies or queues the update against AGENTS.md instead [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1689`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1693`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1733`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:1205`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:1221`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`. This helps because OUR current router already fails fast for one missing configured target and same-pool or unapproved substitutions [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:70`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:78`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:85`], but it has no graph preflight if routes become chained. Backlog item: add a pure `validateFallbackGraph()` next to `resolveFallback()` that reports missing targets, same-pool loops, scope-widening reroutes, cycles, and max-hop overflow before any executor dispatch.

Port difficulty: med.

Tag: quick-win.

## Questions Answered

- Yes. `fallback-router.ts` should adopt the concept, but not by copying loop-cli's runtime `while` loop. The safer port is a typed pure routing contract: scope-aware next-hop selection, outcome-specific failure routing, route trace metadata, and preflight validation before dispatch.
- The chain basics were already covered in iteration 7. The new target-mapping contribution is combining loop-cli's outcome chaining with kasper's scope-aware reroute so executor fallback does not become a blind flat retry.

## Questions Remaining

- Should `ModelProfile` grow scope/capability fields directly, or should `resolveFallback()` accept a separate route context so model registry data stays small?
- Which failure kinds deserve separate next-hop policies first: quota exhaustion, timeout, invalid output, model mismatch, or recursion guard failures?
- Should route trace persistence live in `executor-audit.ts` immediately, or wait until the router API is expanded and unit-tested?

## Next Focus

[S3-10 candidate] Map typed fallback route events into executor audit and fanout dispatch boundaries once the reducer assigns the next S3 focus.
