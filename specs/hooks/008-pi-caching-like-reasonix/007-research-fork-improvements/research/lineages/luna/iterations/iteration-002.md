# Iteration 002 — Correctness boundaries in usage, eligibility, and retries

## Focus

Trace cache-write accounting, failed-response handling, model eligibility, and retry-state transitions.

## Actions Taken

- Compared DeepPi's usage recorder with the optimizer's normalized usage and aggregation semantics.
- Compared both forks' model ownership predicates and their test matrices.
- Compared DeepPi's message-end handling with the optimizer's explicit error/abort filtering.
- Read the storm-breaker implementation and its focused tests for batch ordering and reset behavior.

## Findings

### F-005 — DeepPi can drop a pure cache-write response and undercount the cold start

DeepPi rejects usage when `input + cacheRead === 0`, even though its public `PiUsage` contract includes `cacheWrite`. It then increments `missTokens` only from `input`, excludes `cacheWrite` from the hit-rate denominator, and excludes `cacheWrite` from actual input cost. A normalized first request represented as `input=0, cacheRead=0, cacheWrite=N` is therefore marked unavailable instead of counted. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:4-10,47-67]

The optimizer explicitly treats `cacheRead` or `cacheWrite` as a cache signal and computes `totalInput = input + cacheRead + cacheWrite`; its stats retain separate cache-write and total-input counters. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2147-2168] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3630-3667]

Improvement opportunity: define one normalized accounting equation for both forks and add a cold-start test with nonzero `cacheWrite` and zero `cacheRead`. This directly addresses the supplied cold-start characterization gap and prevents a false “warming” or unavailable result on the first write.

### F-006 — DeepPi does not exclude failed or aborted message-end events before recording usage

DeepPi's telemetry hook records any matching `message_end` event that carries usage. It does not inspect `stopReason`. The optimizer explicitly skips `error` and `aborted` messages because Pi auto-retry can emit a failed attempt before the successful replacement; counting that attempt inflates request and hit-rate statistics. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:130-185] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7566-7577]

Improvement opportunity: add a shared test fixture for failed, aborted, retried, and successful message sequences, then make each fork's policy explicit. DeepPi should either skip those records or report them in a separate failed-attempt counter rather than mixing them into cache economics.

### F-007 — Ownership is duplicated as two exact model-ID lists

DeepPi enables its behavior only for `deepseek-v4-flash` and `deepseek-v4-pro`; the optimizer independently hardcodes the same two IDs as DeepPi-owned. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-17] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1275-1281]

The conservative exact match is safer than auto-enabling every model whose name contains `deepseek`, but the duplicated list can drift. Adding a new supported DeepSeek model to one fork first would create a period where both extensions disagree about ownership, allowing prompt/cache transformations or accounting to run twice or not at all.

Improvement opportunity: define a versioned ownership/capability registry or a contract test that imports both predicates and asserts equivalence for every supported ID plus provider and alias negatives. Do not replace exact opt-in with name-based auto-activation.

### F-008 — DeepPi's numeric input contract is trusted more than the optimizer's normalizer

DeepPi accepts numeric usage values directly and has no finite/nonnegative validation before mutating counters. The optimizer normalizes provider fields with nonnegative-number helpers, reconstructs totals defensively, and records missing-field samples separately. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:47-67] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2151-2168,371-382]

Improvement opportunity: validate usage at the telemetry boundary and preserve a rejected-sample counter. This prevents malformed provider data from producing negative totals, `NaN` rates, or misleading cost output while keeping raw payloads out of telemetry.

## Questions Answered

- Which runtime paths can produce incorrect cache eligibility, cache accounting, or guarded DeepSeek behavior? Partially answered: cache-write omission, retry inflation risk, and duplicated ownership are concrete boundaries.
- Which untested seams and live checks provide the highest-value regression coverage? Answered for this focus: cold-write, failed/aborted, model-ownership, and invalid-number fixtures.

## Questions Remaining

- How do hashline edits and prompt stability behave under races, malformed tool payloads, and mixed message shapes?
- Which non-interactive report and persistence tests are missing?
- What telemetry fields and retention policy support cost decisions without leaking prompts or credentials?
- Which changes have measurable cost or latency impact?
- Which abstractions can be shared without coupling the forks incorrectly?

## Ruled Out Directions

- Assuming `cacheWrite` is always zero is ruled out: both the DeepPi interface and optimizer normalizer model it explicitly. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:4-10] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2151-2168]
- Auto-enabling DeepPi from a broad `deepseek` name match is ruled out because provider and model identity are part of the safety boundary. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:14-17] [SOURCE: .pi/extensions/deep-pi/tests/eligibility.test.ts:14-39]

## Next Focus

Test coverage and fault-injection seams, including cold-start persistence, malformed state, report transport, hashline races, and host integration.

## Scope Violations

None. No target extension or test file was modified.
