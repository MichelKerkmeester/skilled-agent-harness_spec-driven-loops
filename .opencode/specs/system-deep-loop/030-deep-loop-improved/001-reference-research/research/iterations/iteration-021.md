# Iteration 21: S3-05 Fan-Out Salvage JSONL Merge Boundary

## Focus

[S3-05] For concurrent fan-out lineages sharing graph state, should `jsonl-repair.ts` gain kasper-style read-merge-write set-union so a salvaged lineage merges rather than overwrites?

## Actions Taken

- Checked prior S2-08 coverage to avoid repeating the broad kasper lock-held merge finding.
- Inspected kasper's lock, flush, and `mergeExternalState()` flow.
- Inspected our `jsonl-repair.ts` repair and append helpers.
- Inspected fan-out salvage and merge code to map the caller boundary for salvaged lineage records and graph-event attribution.

## Findings

1. Add a merge-aware JSONL append primitive, not just tail repair.
   - Reference mechanism: kasper acquires a state-file lock, rereads on-disk state, merges external state, and only then flushes [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:920`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:922`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:923`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts`.
   - Why it helps: the target currently truncates corrupt tails and appends blindly [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:95`] [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:105`]; a lock-held read-merge-append helper would preserve concurrent graph/state records instead of making the latest salvager depend on append timing.
   - Port difficulty: med.
   - Tag: quick-win.

2. Use stable record identity for set-union, with graph events keyed explicitly.
   - Reference mechanism: kasper unions sessions by object key, evaluated sessions through a set, and applied improvements by durable `id` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:973`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:981`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:988`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts`.
   - Why it helps: a JSONL merge API can dedupe records by `(type, iteration, focus, id/event.id)` for graphEvents and salvage events, avoiding fuzzy content dedupe while still keeping append-only source records.
   - Port difficulty: med.
   - Tag: quick-win.

3. Make fan-out salvage a caller of the safe append path.
   - Reference mechanism: kasper's merge runs inside the flush path before persistence, so every state writer uses the same reconciliation boundary [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:909`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:920`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts`.
   - Why it helps: `fanout-salvage.cjs` currently writes recovered markdown and directly appends `salvaged_from_stdout` to the lineage state log [TARGET-CALLER: `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:119`] [TARGET-CALLER: `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:128`]; routing that append through `jsonl-repair.ts` gives salvaged graph/state records the same merge protection as normal records.
   - Port difficulty: easy.
   - Tag: quick-win.

4. Keep registry-level fan-out merge separate from JSONL repair.
   - Reference mechanism: kasper merges source sessions and then recomputes aggregate state only when new sessions appeared [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:1002`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:1011`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:1013`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts`.
   - Why it helps: our cross-lineage registry merge already performs lineage set-union and attribution in `fanout-merge.cjs` [CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:258`] [CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:467`]; `jsonl-repair.ts` should only merge raw JSONL records safely, leaving registry/dashboard recomputation to existing reducers and fan-out merge.
   - Port difficulty: easy.
   - Tag: quick-win.

## Questions Answered

- S3-05: Yes, `jsonl-repair.ts` should gain a kasper-style read-merge-write set-union helper, but scoped to raw JSONL record identities and append/repair safety. The deeper registry consolidation should remain outside the repair module.

## Questions Remaining

- Confirm which fan-out paths write to a truly shared parent graph/state log versus isolated lineage logs; if all salvage writes stay isolated, this backlog item drops from correctness fix to hardening.
- Define the stable identity table for each JSONL record family before implementation, especially `graphEvents` and generic `event` records.

## Next Focus

[S3-10] Map whether `lag_ceiling_exceeded` should move from warning-only to a kasper-style stuck-watchdog abort/requeue path in `fanout-pool.cjs`.
