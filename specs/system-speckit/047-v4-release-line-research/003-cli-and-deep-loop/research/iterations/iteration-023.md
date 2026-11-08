# Iteration 023 — Reducer and append-gateway edge cases

## Focus

Unread ground on the state pipeline: `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, the append gateway `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`, and the ledger it writes through (`runtime/lib/authorized-ledger/append-only-ledger.ts`). Five probe cases: duplicate iteration number, `status:"error"` row, delta finding rows without `"type":"finding"`, an empty or malformed delta line, and two writers appending at once.

Read-only: nothing written outside this research folder.

## Actions Taken

1. Read the append gateway end to end (526 lines): argument parsing, the five-branch event-format dispatch, the authority admission gate, the cutover binding, and the head read that seeds `prevEventHash`/`streamSequence`.
2. Read the reducer's data-loading layer rather than the whole 3,351-line file: `parseJsonlDetailed` (1107–1136), `loadDeltaPayloads` (1639–1665), `collectDeltaIterationRecords`/`mergeDeltaIterationRecord` (1667–1692), `loadDeltaSources` (1694–1735), the module entry (3062–3110), the corruption gate (3190–3191, 3311–3312).
3. Probed the reducer for every `record.type` discriminator and for the literal `'finding'` — the latter returns **zero** hits, which is the load-bearing fact for f-iter023-005.
4. Read the ledger's concurrency surfaces (`append-only-ledger.ts`: imports 23–25, frame field allowlists 61–87, prior-head validation 299, `getVerifiedHead` 373, locked append 399/432) to test the two-writer case.
5. Surveyed existing tests for coverage of each probe rather than running them: `runtime/tests/unit/deep-research-reduce-state.vitest.ts` (279–1427), `runtime/tests/unit/append-mode-event-cli.vitest.ts` (127–935).

## Findings

**f-iter023-001 — bug, P1. Delta corruption is fail-open; state-log corruption is fail-closed.**
`parseJsonlDetailed` collects a per-line `corruptionWarnings` array `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1112]` and the documented contract says the reducer exits non-zero when warnings are present unless `--lenient` (1100–1106). But `loadDeltaPayloads` consumes and discards them — one `console.warn` `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1661]` — while the exit-2 gate reads **only** the state-log warnings bound at `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3082]` and thrown at `:3190`. The delta file is the artifact the leaf contract makes primary; corruption there costs one stderr line and exit 0.
Coverage: state-log corruption has a test (`refuses a corrupt expected state log…`, `deep-research-reduce-state.vitest.ts:381`); delta corruption has none.

**f-iter023-002 — bug, P1. Duplicate iteration rows are never deduped, and the count and the "latest" both key on position, not iteration number.**
Records are filtered by `type` only, with no per-iteration reconciliation `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3093]`. Consequences: `iterationsCompleted` counts rows `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2610]`; the dashboard renders one row per record `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2911]`; and `latestIteration` is `.at(-1)` — append order — `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2520]`. A redispatch that appends a second row for iteration N therefore inflates the completed count, prints two rows numbered N, and lets whichever row was appended last drive dashboard status. The gateway does not prevent it: its idempotency key is content-derived, so a retry whose payload differs in any field is a new event.
Coverage: `append-mode-event-cli.vitest.ts:232` proves *sequential* appends of distinct records; no test asserts duplicate-iteration reconciliation.

**f-iter023-003 — bug, P2. Two spellings of one delta file collide and the loser is dropped silently.**
The delta filename gate is `/^iter-\d+\.jsonl$/` `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1646]`, so `iter-23.jsonl` and `iter-023.jsonl` both qualify. The sort is numeric-aware `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1653]`, which puts the padded name first, and `collectDeltaIterationRecords` then keeps the first and `continue`s `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1679]`. The second file's `answeredQuestions` vanish with no warning. Coverage: none — the same-named-file test at `deep-research-reduce-state.vitest.ts:280` aggregates *across lineage directories*, which is a different mechanism.

**f-iter023-004 — bug, P2. A `status:"error"` row is half-counted.**
Error rows are correctly excluded from question coverage `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2452]` but are still counted as completed iterations `[:2610]` and are still eligible to be the last-appended `latestIteration` that drives dashboard status and next focus `[:2520]`, because `deriveDashboardStatus` special-cases only `stuck` `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2300]`. The same filter line defaults a missing status to `complete` via `String(record.status || 'complete')` `[:2450]`, so a row that never carried a status silently becomes coverage-eligible.
Coverage: `append-mode-event-cli.vitest.ts:752` proves the *projection* keeps an error row across a later append — it says nothing about the counting consequence.

**f-iter023-005 — drift, P2. The delta finding discriminator is unread by the reducer.**
The literal `'finding'` appears zero times in the reducer; the only `record.type` discriminators are `event` `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:253]` and `iteration` `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1672]`. Registry findings are harvested from the iteration *markdown* `## Findings` section `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1913]` and from a record's own `findings` array `[:874]`. So the contract sentence that every finding row must carry `type:"finding"` is unenforced by any consumer read this iteration, and the asymmetry is the real risk: a leaf that writes findings only to the delta file and abbreviates the narrative section loses them from the registry, while one that omits the `type` field loses nothing.

**f-iter023-006 — bug, P2. Malformed delta lines are replaced by fabricated `null` rows.**
`records.concat(new Array(n).fill(null))` `[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1663]` preserves payload length by inserting non-records, which then feed `deltaSourceCount` and every downstream delta consumer. `collectDeltaIterationRecords` guards for it `[:1672]`; the resource-map/sources extractor was not read this iteration, so a `row.sources` dereference there throwing on a null row is *inferred, not confirmed* — the check that would settle it is a delta file with one good and one broken line plus `--emit-resource-map`.

**f-iter023-007 — UX, P2. Concurrent appends cannot corrupt the ledger but report the wrong exit code.**
The ledger is genuinely fenced: imports of `FenceCapability`/`FencedLeaseCoordinator`/`ProtectedResourceKinds` `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:23]`, `fence_token` in both the frame and the header allowlists `[:78]`, a `prior_head_sequence !== frame.sequence - 1` validation `[:299]`, and `getVerifiedHead`/append both wrapped in `#store.withExclusiveLock` `[:399]`. So a head-stale writer is *rejected*, not merged. But the CLI seeds its `prevEventHash`/`streamSequence` from a head read taken before the append, has no retry, and lets the rejection escape through `main().catch` as `phase:'runtime'`, exit **1** `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:58]` — while the packing contract documents exit 2 as the refusal signal. An unattended run sees a generic runtime error instead of a fencing refusal.
Coverage: `append-mode-event-cli.vitest.ts` asserts exit 2 only for authority (412), binding (437) and mode (468) refusals, and has no concurrent-writer case.

## Questions Answered

None of the three strategy key questions in full. Partial answer to the carried question of iteration 8 (`status:"error"` counting): error rows do **not** count toward question coverage but **do** count toward `iterationsCompleted` and can occupy the `latestIteration` slot — see f-iter023-004.

## Questions Remaining

- Does the resource-map extractor dereference delta rows without a null guard (f-iter023-006)? One fixture run with `--emit-resource-map` settles it.
- Is the delta-corruption fail-open path reachable in practice, or does the gateway's projection refresh refuse first (f-iter023-001)?
- Hub canon `package_skill.py --strict` conformance; mid-run executor failure under the single-executor workflow; `--pure` validity — all carried, all untouched.

## Next Focus

Write-side containment of the reducer's own outputs (`resource-map.md`, `findings-registry.json`, `deep-research-dashboard.md`) versus the gateway's projection refresh: which of the two writers can silently overwrite the other inside one iteration, and what the containment lane records when it does.

## SCOPE VIOLATIONS

None. All reads only; the two artifacts plus the gateway append are the only writes.
