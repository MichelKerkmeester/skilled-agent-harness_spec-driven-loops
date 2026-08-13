# Iteration 2: Correctness and Test Coverage Deep Dive

## Focus

Verify the correctness and test-coverage findings at the source level: deep-pi's `message_end` handling, numeric input validation, the hashlines edit path, and what each fork's tests actually exercise.

## Findings

1. **Corroborated with a new mechanism — deep-pi's `message_end` has no `stopReason` guard, and a failed attempt flips `usageUnavailable` permanently.** deep-pi's telemetry hook (`telemetry.ts:135-185`) records every `message_end` unconditionally. pi-cache-optimizer's equivalent hook explicitly returns early on `msgRecord?.stopReason === "error" || msgRecord?.stopReason === "aborted"` with a comment explaining Pi's auto-retry emits `message_end` for the failed attempt carrying zero-usage fields that would inflate `totalRequests` and skew hit-rate (`index.ts:7576-7579`). The new mechanistic consequence in deep-pi: a zero-usage failed attempt hits `recordUsage`'s availability check (`telemetry.ts:52`, `usage.input + usage.cacheRead === 0`) which sets `usageUnavailable = true` — a single aborted turn makes the report show "Usage unavailable: true" for the rest of the session. This is exactly the guard the parent Tier 3 flagged, now with a concrete wrong-output consequence. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:135] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7576]
2. **Corroborated — deep-pi trusts unvalidated numeric usage values.** `recordUsage` (`telemetry.ts:47-68`) mutates counters from `usage.cost.input` etc. with no `Number.isFinite`/non-negative check; pi-cache-optimizer's normalization layer validates `typeof value === "number" && Number.isFinite(value)` (`index.ts:1065`). A NaN or negative usage value would silently corrupt deep-pi's counters. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:60] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1065]
3. **NEW — `edit_lines` validates only the range endpoints, so an in-place interior-line change is silently overwritten.** `validateEdits` (`hashlines.ts:403-443`) hashes only the `from` and `to` lines. If the model reads a file, a second actor modifies an interior line *in place* (same line count, so line numbers don't shift), and the model then replaces that whole range, both endpoint hashes still match and the interior modification is clobbered without any signal. This is distinct from the documented hash-mismatch guard: it is an interior-staleness blind spot for multi-line range edits. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:403]
4. **Refinement (softens Tier 2 #7's deep-pi half) — `atomicWriteFile` already has post-rename verification.** After `rename`, the code re-reads the file and refuses to report success if the landed content differs from what was written (`hashlines.ts:96-101`). So the CAS gap is best-effort mitigated: a non-cooperating writer between check and rename is *detected after the fact* and reported as a failure, not silently accepted. The residual risk is narrow (a mixed/overwritten file on disk plus a confusing failure message), but the "silent lost update" framing from the parent synthesis overstates deep-pi's exposure here. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:91]
5. **Corroborated at the exact test level — both forks' suites omit the specific failure cases named by the parent.** deep-pi's `telemetry.test.ts` uses `cacheWrite: 0` in every usage fixture (never exercises pure-cache-write drops), never simulates `stopReason: "error"|"aborted"`, and never feeds NaN/negative usage. pi-cache-optimizer's entire suite is one 887-line file (`review-findings.test.ts`) with describe blocks only for stable prompt reordering, DeepSeek Pi-owned detection, footer stats, adaptive-thinking compat, explicit compat precedence, modelOverrides JSONC fixes, and `/cache-optimizer fix` — no persistence/restart test and no `message_end` integration test. [SOURCE: .pi/extensions/deep-pi/tests/telemetry.test.ts:14] [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:10]

## Ruled Out

- Treating the post-rename verification as a strict CAS: it detects races after the fact but cannot prevent the mixed-file state; only OS-level compare-and-swap (unavailable in Node's fs) or a lock would. Verified-but-not-prevented is the accurate description.

## Dead Ends

- Searching for `stopReason` in deep-pi's tree returns nothing — the guard genuinely does not exist there (the only hits are stability's `PrefixChurnReason`). This confirms the gap is absent rather than misnamed.

## Edge Cases

- Contradictory evidence: parent Tier 2 #7 framed deep-pi's `edit_lines` CAS as a plain TOCTOU vulnerability; the source shows an intentional post-write verification, so the severity is lower than the parent implied for deep-pi specifically (pi-cache-optimizer's stats persistence, by contrast, has no such verification).
- Partial success: `edit_lines` increments `stats.editSuccesses` only after `atomicWriteFile` resolves; a race-detected failure is counted as an error path, which is correct.

## Sources Consulted

- `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts`
- `.pi/extensions/deep-pi/tests/telemetry.test.ts`
- `.pi/extensions/pi-cache-optimizer/index.ts` (lines 1065, 7540-7620)
- `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts`

## Assessment

- New information ratio: 0.75
- Novelty justification: Two findings are direct corroborations, two sharpen/refine prior findings with a new mechanism and a severity correction, and one (`interior-line staleness`) is genuinely new.
- Questions addressed: Q2 (correctness) substantially; Q3 (tests) partially.
- Questions answered: Q2 — correctness gaps beyond the disclosed set now include the `usageUnavailable` false-positive side effect.

## Reflection

- What worked and why: reading pi-cache-optimizer's `message_end` handler directly let me see the "already-correct" reference implementation the parent synthesis referenced, which made deep-pi's omission concrete and copyable.
- What did not work and why: nothing blocked; the interior-staleness finding required reasoning about the line-shift precondition, not a grep.
- What I would do differently: cross-check the parent's framing of "TOCTOU" against the actual mitigation before accepting severity.

## Recommended Next Focus

Telemetry and observability: how each fork persists and renders economics — deep-pi's missing stats file, the report body's transport, and the cache-hit-rate denominator divergence.
