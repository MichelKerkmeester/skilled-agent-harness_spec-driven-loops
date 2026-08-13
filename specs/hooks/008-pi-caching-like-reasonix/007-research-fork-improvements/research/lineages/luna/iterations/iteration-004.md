# Iteration 004 — Telemetry and observability surfaces

## Focus

Trace which runtime counters reach each report, what survives a restart, and whether the output is structured enough for non-interactive diagnosis without exposing prompts or credentials.

## Actions Taken

- Compared DeepPi's report input with the counters maintained by its stability and storm-breaker modules.
- Compared DeepPi's text report with the optimizer's `/cache-optimizer stats` output.
- Traced optimizer recent samples from `message_end` into in-memory trend output and persistent aggregate buckets.
- Inspected persistence failure handling and the user-visible diagnostic boundary.

## Findings

### F-014 — DeepPi maintains diagnostic counters that never reach `/deeppi`

The storm-breaker state tracks `errorsEnhanced`, and the stability state tracks `prunedThinking` and `preservedThinking`, but `deepPi` passes only transform errors, guard/abort counts, and hashline counters into `formatDeepPiReport`. The report therefore cannot distinguish a quiet loop-guard run from one that repeatedly rewrote errors, or show how much thinking content was pruned versus preserved. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts:25-52,140-158] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stability.ts:140-155,170-204] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64-80] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:80-118]

Improvement opportunity: define a report field inventory from the state owners, then expose the missing counters in both structured and text projections. Keep counters separate by subsystem so a combined “retry statistics” number does not hide whether the intervention was a guard, abort, or error enhancement.

### F-015 — Both command reports are text-only projections with no versioned machine-readable contract

DeepPi's formatter returns newline-delimited text and `/deeppi` sends it through `ctx.ui.notify`. The optimizer's stats builder also returns formatted text and its command sends that text through `ctx.ui.notify`. Neither surface defines a versioned JSON envelope with model identity, units, missing-data state, or schema evolution rules. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:94-118] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64-80] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3747-3783,7659-7705]

Improvement opportunity: make a small, privacy-safe report object the canonical boundary, with `schemaVersion`, provider/model identity, numeric token/cost fields, failure counters, and explicit `unknown`/`unavailable` markers. Render the existing human text from that object and add a JSON/RPC command mode. This resolves parsing brittleness without forcing prompt or payload data into telemetry.

### F-016 — Optimizer trend samples disappear across restart even though aggregate stats persist

The optimizer intentionally keeps at most 50 numeric `CacheUsageSample` records per model in memory and labels them “not persisted.” `message_end` records missing-usage and hit/write samples there, while the persistence format stores only aggregate `CacheStats` buckets and totals. After a restart, `/cache-optimizer stats` retains cumulative counts but loses recent-window trend and missing-field evidence. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:350-385] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3747-3783] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7614-7642] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:324-356,4066-4103]

Improvement opportunity: choose an explicit retention policy. Either persist a bounded numeric-only ring buffer with versioned truncation, or persist rolling 10/30-request aggregates and missing-field counts. The second option minimizes disk churn while preserving enough evidence to diagnose cold starts and proxy usage-field regressions.

### F-017 — Persistence failures fall back to memory but are not durable or reportable health state

When an optimizer write fails, the code logs the error, sets a recovery flag for the next write, and shows a one-time warning that the process is using in-memory stats. The state file and `/cache-optimizer stats` output do not retain a last-success timestamp, failure count, or recovery status, so a restart can erase the only evidence that persistence was unreliable. DeepPi has no comparable persistence-health field because its telemetry is process-local. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7007-7052] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:27-45]

Improvement opportunity: expose persistence health as a small operational section: last successful write, consecutive failures, pending flush, and whether current output is memory-only. Do not store exception text or paths containing secrets; log detailed diagnostics locally and keep the report fields numeric/boolean.

## Questions Answered

- What telemetry fields and retention policy support cost decisions without leaking prompts or credentials? Partially answered: both forks already use numeric counters, and the optimizer explicitly excludes prompts, payloads, headers, keys, and outputs from samples; missing subsystem counters and a bounded retention decision remain.
- How can non-interactive reporting improve? Answered: use one versioned report object with text and JSON projections, then test the real host transport separately.

## Questions Remaining

- Which changes have measurable cost or latency impact?
- Which maintainability boundaries should be shared, simplified, or documented across the forks?
- What exact pricing assumptions are needed for comparable economics across cache read, write, uncached input, and output tokens?

## Ruled Out Directions

- Persisting raw messages, prompts, provider payloads, headers, API keys, or model outputs is ruled out; the optimizer's sample contract explicitly excludes them and numeric-only retention is sufficient for diagnosis. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:370-382]
- Adding another human-only report formatter without a shared data object is ruled out because it would preserve the same parsing and schema-drift problem in both forks. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:94-118] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3747-3783]

## Next Focus

Cost economics and measurement: pricing equations, cold versus warm behavior, retry/error accounting, latency overhead, and a credential-aware benchmark matrix.

## Scope Violations

None. Only lineage research artifacts were written.
