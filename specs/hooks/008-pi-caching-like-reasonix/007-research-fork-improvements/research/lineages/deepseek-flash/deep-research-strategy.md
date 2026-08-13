# Deep Research Strategy: Pi Fork Improvements (deepseek-flash lineage)

## Research Topic

Find concrete, evidence-based improvement opportunities for the two forked Pi extensions built in packet 008 — `pi-cache-optimizer`'s DeepSeek-guard fork (`.pi/extensions/pi-cache-optimizer/`) and `deep-pi`'s hardened DeepSeek-direct fork (`.pi/extensions/deep-pi/`) — across correctness, test coverage, telemetry/observability, cost-economics, and maintainability.

This is the 4th independent lineage in a completed 3-lineage fan-out (sol/luna/grok; see `../research.md`). Its job is to independently corroborate Tier 1/2 findings from its own read of the source, or surface something genuinely new — not restate the parent synthesis.

## Known Context

- Target spec has no `resource-map.md`; the coverage-map gate is informationally skipped.
- Prior 3-lineage synthesis (Tier 1): duplicated DeepSeek-ownership predicate across both forks; `/deeppi` report is UI-notify-only; deep-pi keeps no persistent stats file; cost/savings arithmetic omits cache-write cost; both forks miss boundary/fault-injection/composition tests.
- Prior Tier 2: deep-pi's declared `benchmark:live` script does not exist; pi-cache-optimizer stats persistence has no cross-process concurrency control; vendored fork provenance/sync fully manual; pi-cache-optimizer is an 8,390-line monolith.
- Disclosed open limitations to build on: `/deeppi report` full body not surfaced non-interactively even via `pi --mode rpc`; deep-pi keeps no persistent stats file; one live regression check blocked by missing opencode credential; pi-cache-optimizer cold-start cache-write behavior for newly-added models uncharacterized.
- Non-Goals and Stop Conditions are recorded below.

<!-- ANCHOR:key-questions -->
## Key Questions (remaining)

- [x] [Q1] Which Tier 1/2 findings from the parent synthesis can be independently corroborated or refuted from this lineage's own read of the source?
- [x] [Q2] Which correctness and failure-isolation gaps remain in each fork beyond the already-disclosed set?
- [x] [Q3] Which high-value boundary, fault-injection, and live-contract tests are missing?
- [x] [Q4] How should both forks expose durable, automation-friendly telemetry without leaking sensitive content?
- [x] [Q5] Which cost claims can be measured honestly, and what does cold-start cache-write behavior require?
- [x] [Q6] Which maintainability improvements are concrete and evidence-backed beyond provenance drift?
<!-- /ANCHOR:key-questions -->

## Non-Goals

- Do not implement fixes or modify either extension, sibling packet, or target spec.
- Do not restate the parent synthesis as if new; every finding must come from this lineage's own source read.
- Do not touch any path outside `research/lineages/deepseek-flash/`.

## Stop Conditions

- Complete exactly four evidence iterations because the stop policy is `max-iterations`.
- Treat convergence before max iterations as telemetry only; broaden review angles rather than synthesizing early.
- Produce a synthesis that ranks concrete improvements, records ruled-out directions, and marks corroborated vs novel findings.

<!-- ANCHOR:answered-questions -->
## Answered Questions

- Tier 1 #1-#4 corroborated with exact line evidence (Q1): ownership predicate duplication, UI-notify-only report, per-session telemetry reset, cache-write accounting omission.
- Correctness gaps (Q2): deep-pi lacks a `stopReason` guard and a failed attempt flips `usageUnavailable` permanently; deep-pi trusts unvalidated numeric usage; `edit_lines` interior-line staleness is a new blind spot; atomicWriteFile already has post-rename verification so parent TOCTOU severity is overstated for deep-pi.
- Telemetry/observability (Q4): deep-pi's stats file should reuse its own `atomicWriteFile` with session + cumulative-daily scope and a versioned schema, not copy pco's racy read-merge-rename.
- Cost-economics (Q5): cold-start cache-write is now characterized — deep-pi silently drops the establishing cache write and flips `usageUnavailable`; pco has full instrumentation but no measurement run. DeepSeek v4 write cost is the cache-miss price; denominators diverge across forks.
- Tests (Q3): the composition-test seam already exists via `FakePi`, but the forks use divergent runners (node:test+jiti vs vitest); a runner decision must precede the combined-host test.
- Maintainability (Q6): `benchmark:live` is doubly broken (script missing AND files allowlist excludes scripts/); `before_provider_request` digests the whole conversation per request; the report command mutates telemetry; `errorsEnhanced` is maintained but un-surfaced (parent f-014 stands, this lineage's iteration-1 refutation corrected).
<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## What Worked

- Reading the two small deep-pi modules end-to-end plus targeted slices of the 8,390-line `index.ts` gave high-confidence corroboration without full monolith reads (iteration 1).
- Verifying each parent-synthesis claim against current line numbers before quoting it (iteration 1).
- Reading pi-cache-optimizer's `message_end` handler directly made deep-pi's omitted guard concrete and copyable (iteration 2).
- Combining a live DeepSeek pricing fetch with both forks' usage-normalization code made the savings-arithmetic gap concrete (iteration 3).
- Reading the stormbreaker module plus the integration harness surfaced both the `errorsEnhanced` correction and the test-runner divergence (iteration 4).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed

- Chasing `errorsEnhanced` wasted a grep in iteration 1 and produced a false negative (wrong module scope); corrected in iteration 4. Grep the whole tree before refuting a parent-synthesis counter.
- Looking for a separate DeepSeek cache-write price tier returned nothing — the finding is that write cost equals the cache-miss price, not missing data (iteration 3).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled-Out Directions

- Enforcing the ownership split via a shared runtime module: would couple the two packages; a test fixture is the correct seam (iteration 1).
- Relying on the parent synthesis's counter names without re-checking current source (`errorsEnhanced` was NOT stale — iteration-1 refutation itself corrected) (iterations 1, 4).
- Treating post-rename verification as strict CAS: it detects races after the fact but cannot prevent the mixed-file state; "verified-but-not-prevented" is the accurate framing (iteration 2).
- A single shared stats file for both extensions (iteration 3).
- Copying pi-cache-optimizer's read-merge-rename persistence into deep-pi verbatim — would import the known race instead of reusing deep-pi's superior atomicWriteFile (iteration 3).
- Treating the test-runner difference as a non-issue (iteration 4).
- Changing the report transport before separating report data from rendering (iteration 4).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## Saturated Directions And Divergence Frontier

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## Carried-Forward Open Questions

[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## Next Focus

[Synthesis complete; all tracked questions resolved across four iterations]
<!-- /ANCHOR:next-focus -->

## Research Boundaries

- Maximum iterations: 4
- Convergence threshold: 0.05 (telemetry only before iteration 4)
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 12 minutes
- Allowed writes: this lineage directory only (`research/lineages/deepseek-flash/`)
- artifact_dir: `specs/hooks/008-pi-caching-like-reasonix/007-research-fork-improvements/research/lineages/deepseek-flash`
- Current generation: 1
- Started: 2026-08-08T05:34:37Z
