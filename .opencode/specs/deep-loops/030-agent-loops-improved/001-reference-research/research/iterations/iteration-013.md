# Iteration 13: S2-05 Rejected-Pattern Cache

## Focus

[S2-05] How does kasper's rejected-pattern cache (`rejected_patterns`, `MAX_REJECTED_PATTERNS`, mergeable check) permanently suppress re-proposing a rejected idea? Target mapping: deep-loop-workflows protocol for ideas and exhausted approaches.

Reference citations below use paths relative to `.opencode/specs/deep-loops/030-agent-loops-improved/`.

## Actions Taken

1. Searched the kasper reference for `rejected_patterns`, `MAX_REJECTED_PATTERNS`, and mergeable suppression paths.
2. Read the kasper state schema, state store methods, user context construction, auto-improvement filter, pending-display filter, similarity helper, and regression tests.
3. Checked the current deep-research protocol, JSONL state reference, reducer, strategy template, and auto workflow for existing ideas/exhausted behavior.
4. Compared the reference mechanism against our current `ruledOut` / `exhausted-approaches` flow to identify exact protocol and reducer targets.

## Findings

### S2-05A: Persist rejected ideas as bounded raw state, not only generated markdown

Reference mechanism: kasper stores `rejected_patterns` in the durable `KasperState` schema (`external/kasper/src/types.ts:185`, `external/kasper/src/types.ts:192`), initializes it in default state (`external/kasper/src/state.ts:36`, `external/kasper/src/state.ts:50`), normalizes missing/invalid arrays on load (`external/kasper/src/state.ts:188`), and caps the array with `MAX_REJECTED_PATTERNS = 100` (`external/kasper/src/constants.ts:17`, `external/kasper/src/state.ts:505`). `addRejectedPattern` is exact-deduped and marks state dirty only when a new rejection is stored (`external/kasper/src/state.ts:502`, `external/kasper/src/state.ts:503`, `external/kasper/src/state.ts:510`); the persistence test reloads the store and confirms the pattern survives (`external/kasper/tests/state.test.ts:603`, `external/kasper/tests/state.test.ts:614`).

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md`. Add a canonical append-only `ideaRejected` or `rejectedIdea` event record with a reducer-derived bounded rejected-idea set. Port-difficulty: med. Tag: quick-win. Why it helps: our loop currently records negative knowledge through `ruledOut` and generated exhausted markdown, but it lacks a first-class raw-state rejection cache that future focus selection can consult reliably.

### S2-05B: Check future candidates against rejected ideas with fuzzy mergeability

Reference mechanism: kasper loads durable rejections into runtime context as a `Set` (`external/kasper/src/index.ts:362`, `external/kasper/src/types.ts:405`, `external/kasper/src/types.ts:407`). Before auto-improvement proceeds, it filters candidate weaknesses against every rejected pattern and logs `improvement_rejected_cached` on a mergeable match (`external/kasper/src/evaluate.ts:1659`, `external/kasper/src/evaluate.ts:1660`, `external/kasper/src/evaluate.ts:1661`, `external/kasper/src/evaluate.ts:1662`, `external/kasper/src/evaluate.ts:1673`). The interactive pending path uses the same check before surfacing top weaknesses (`external/kasper/src/handlers.ts:419`, `external/kasper/src/handlers.ts:422`, `external/kasper/src/handlers.ts:423`). The mergeability check rejects cross-category matches unless either side is `unknown`, then falls back to similarity thresholding (`external/kasper/src/utils.ts:237`, `external/kasper/src/utils.ts:243`, `external/kasper/src/utils.ts:250`, `external/kasper/src/utils.ts:252`; thresholds at `external/kasper/src/constants.ts:56`, `external/kasper/src/constants.ts:57`, `external/kasper/src/constants.ts:58`, `external/kasper/src/constants.ts:59`).

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md`. Add a protocol rule that every next-focus, recovery, or ideas-backlog candidate is checked against the rejected/exhausted idea cache before dispatch; exact text matches are suppressed, and near matches are suppressed by a deterministic similarity/category helper. Port-difficulty: med. Tag: quick-win. Why it helps: the current protocol warns not to retry exhausted approaches, but a semantically identical focus can re-enter under different wording.

### S2-05C: Feed exhausted approaches from a reducer-owned rejected-idea index

Reference mechanism: kasper keeps rejected patterns as durable state and unions on-disk rejections during external state merge (`external/kasper/src/state.ts:994`, `external/kasper/src/state.ts:995`, `external/kasper/src/state.ts:996`), so independently written rejections are not lost. Our reducer currently builds exhausted approaches by grouping literal `deadEnds` and `ruledOut` strings from iteration markdown (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:713`, `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:717`, `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:729`, `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:735`) and then rewrites the strategy anchor (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:804`).

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`. Add reducer logic that derives a capped rejected-idea index from JSONL events, de-duplicates semantically related ideas, and feeds `buildExhaustedApproaches` from that index instead of relying only on repeated literal markdown entries. Port-difficulty: med. Tag: quick-win. Why it helps: exhausted approaches become stable across wording drift, packet resume, and concurrent or recovered iteration writes.

### S2-05D: Make suppression persistent until explicit undo/reset, not magical permanence

Reference mechanism: kasper's cache is persistent but reversible: `removeRejectedPattern` deletes one pattern (`external/kasper/src/state.ts:514`, `external/kasper/src/state.ts:515`, `external/kasper/src/state.ts:518`), while full reset clears `rejected_patterns` with the rest of transient improvement state (`external/kasper/src/state.ts:571`, `external/kasper/src/state.ts:575`). That means "permanent" suppression is actually "durable until explicit undo or reset."

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. Add an explicit state transition for undoing or clearing rejected ideas during resume/restart recovery, and keep normal iteration dispatch from clearing the cache implicitly. Port-difficulty: easy. Tag: quick-win. Why it helps: operators can revive a previously rejected research direction deliberately without the loop accidentally reintroducing it during routine stuck recovery.

## Questions Answered

- S2-05 answered: kasper suppresses re-proposal by storing rejected patterns in durable state, loading them into a runtime `Set`, and checking future candidate weaknesses through `weaknessesMergeable` before surfacing or applying improvements. The cache is bounded and deduped; it persists across reloads and state merges; it is reversible only through explicit remove/reset paths.

## Questions Remaining

- The current kasper manual rejection UX appears partly removed in current tests/docs, so follow-up synthesis should treat this as a state/filter mechanism rather than a fully live command UX.
- Our loop still needs a design decision on category labels for rejected research ideas: source area, target file, focus segment, or free-form reason.
- [S2-06] remains next: incremental fuzzy finding-merge in kasper and how it maps onto `deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`.

## Next Focus

[S2-06] How does kasper do incremental fuzzy finding-merge -- cheap similarity (`weaknessSimilarity` / `weaknessCache`) first, then LLM consolidation only on leftover duplicates? Target: `deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`.
