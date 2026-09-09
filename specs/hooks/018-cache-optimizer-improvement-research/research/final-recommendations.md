---
title: "Final recommendations: pi-cache-optimizer improvement backlog"
description: "Decision document closing the eight-iteration, two-model research loop: what to build first, the resolved position on each disagreement between the legs, what not to do, and the operator questions that gate the rest."
trigger_phrases:
  - "cache optimizer final recommendations"
  - "pi cache extension backlog decision"
  - "miss vs unavailable cache signal"
  - "cache stats denominator"
importance_tier: "important"
contextType: "research"
---
# Final recommendations: pi-cache-optimizer improvement backlog

## Verdict

Build F1 first, as one change with two counters: cost and tokens always record; the hit ratio
excludes any request whose cache signal was not reported. Then F3 (a one-line pricing predicate),
the F4 slice F1 needs (one `reportsCacheUsage` flag on `CacheCompat`), then F2. Stop considering
F7: two independent reads found the retry guard correct and nobody proposes tuning it. F6 stays
listed but is not built until the operator answers Q3.

The two legs were not describing the same F1. Leg 1's F1 is "input present, cache fields absent,
counted as a miss" ([index.ts:2477-2499](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2477)). Leg 2's F1 is "defined all-zero usage inflates the denominator"
([index.ts:9483-9486](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9483), [index.ts:9509-9513](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9509)). `hasMissingUsageFields` returns
`false` whenever `input > 0` ([index.ts:4280-4282](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4280)), so leg 2's flag-wiring fix never reaches leg 1's case.
Both are real; the build covers both.

## Ranked backlog

Execution order, not severity order.

| # | Item | What it fixes | Effort | Risk | Proof that closes it | Depends on |
|---:|---|---|---|---|---|---|
| 1 | **F1 / P0** — Unreported cache signal is not a miss | (a) omitted cache fields synthesized to zero and counted as a miss [index.ts:2495-2499](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2495), also raw readers at 2541/2567/2610; (b) defined all-zero usage flagged at [index.ts:9483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9483) but still counted at [index.ts:4188](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4188) | M | High semantic: Pi may synthesize zeros before the extension sees them (comment [index.ts:2475-2478](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2475)) | `{input:500}` → `unmeasuredRequests +1`, `totalInputTokens +500`, cost recorded, `hitRequests` and measured denominator unchanged. Negative controls: explicit `{cacheRead:0, cacheWrite:0, totalInput:500}` is one measured miss; `usage === undefined` adds nothing. V6 record without the field parses to `0`. Then capture raw provider usage against `message_end` for one omitting provider. | None |
| 2 | **F3 / P0** — Accept explicit `cacheRead: 0` | `<= 0` rejects a free cached-read rate as unpriced [index.ts:4129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4129); arithmetic already handles zero [index.ts:4168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4168) | S | Low; only the registry meaning of zero is open (Q2) | Flip [cache-economics.test.ts:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:54) to expect pricing; missing and negative stay unpriced; `input: 0` stays unpriced; test `readModelInputPricing` in isolation from the registry fallback at 4144 | Q2 |
| 3 | **F4 slice / P0 companion** — `reportsCacheUsage` on `CacheCompat` | No flag among the 16 at [index.ts:246-263](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:246) says whether a model ever reports cache fields; if Q1 is "yes", this is F1's only signal source | S | Low; a `false` flag routes a model to `unmeasured`, never to `miss` | Model with `reportsCacheUsage: false` and healthy token counts lands in `unmeasuredRequests`; unset flag changes nothing | F1's vocabulary |
| 4 | **F2 / P0** — Cross-turn stability before lifting | Unique-in-this-prompt lifts immediately [index.ts:9136](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9136); churn map is model-keyed, report-only, and records empty shipments [index.ts:8485](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8485), [index.ts:9145-9151](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9145) | M | Medium/high: alters shipped prompt bytes; first turn becomes conservative | A/A/B/B: turn 1 no lift, 2 lifts, 3 no lift, 4 lifts; twice-occurring candidate stays unlifted; session B does not inherit session A's authorization; reset/disable clears state. Keep authorization state separate from churn state (iteration 004). Then compare shipped bytes with provider hits | F1 for trustworthy measurement |
| 5 | **F5 / P1** — Persist the learned `prompt_cache_key` rejection | `promptCacheKeyUnsupportedModels` is an in-process `Set` [index.ts:8456](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8456) with no persist path; every process re-learns via one 400 | S | Low; default-on injection at [index.ts:1521-1525](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:1521) is unchanged | After a matching 400, restart the process: the next request to that model omits the key without a second 400. Unrelated 400s still inject ([review-findings.test.ts:169-240](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:169) holds) | Q5 |
| 6 | **F6 / P2, gated** — Request-scoped router hints | Single `latestCacheHint` slot [index.ts:8483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8483); `getHints` guards skip when either side lacks a field [index.ts:8560-8579](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8560) | M | High if request identity is unstable; do not build against a guessed concurrency model | Two interleaved `before_agent_start` calls in one session with different routes; each `getHints` returns only its own prompt, key, and retention | Q3 answered "yes" |

Closed: **F7**. Retry guard escalates `repeatLevel` and `streakLevel` separately with the earlier
collapse documented as fixed ([index.ts:7760-7767](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:7760)).

## Resolved contradictions

**1. F1's fix is a trap — what F1 is, or how it is built?** How it is built. What F1 *is* stays:
an unavailable signal must not read as a miss. The build changes twice over. Cost and tokens always
record; only `hitRequests` and the measured denominator exclude. Iteration 008's early return is
safe only for case (b), where `totalInput` is zero ([index.ts:9483-9486](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9483)); applied to case (a)
it drops real spend, which is the trap. And the classifier must be field-presence based (iteration
003's `cacheSignal`), since `hasMissingUsageFields` cannot see case (a). Keep `totalRequests` as
the snapshot count, add `unmeasuredRequests`; denominator = `totalRequests - unmeasuredRequests`.

**2. F4 — P1 standalone or P0 companion?** P0 companion, narrowed to one flag, not merged. The
comment at [index.ts:2475-2478](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2475) claims Pi always supplies cache fields, at least as zero. If that
holds, per-response presence is gone and a static declaration is F1's only signal source. Not
merged because F1 still catches the per-response case (b) with no flag. The broader capability
matrix (prefix lifting eligibility, per-provider mutations) stays P1 and is not this slice.

**3. F7 — observe or close?** Close. "No defect found twice" closes a *code* item. It does not
certify the host event contract, but that trace was only a precondition for tuning thresholds, and
no tuning is proposed. The precondition moves to the do-not list.

**4. F5 — explicit support or persist the rejection?** Persist the rejection; keep default-on.
Leg 1's own risk column concedes opt-in regresses every unconfigured proxy. The measured cost of
default-on is one 400 per unsupported model per process, and that is the whole fix surface.
Confirmed: the `Set` at [index.ts:8456](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8456) never reaches `persistCacheStats`.

**5. F6 — on the list without a trigger?** Stays, as P2 gated on Q3. Both legs confirmed the
mechanism and the consequence (another request's prompt and key served to this one) is severe. A P1
nobody can reproduce is a P2: dropping it loses a confirmed mechanism, building it now keys on a
request identity nobody has verified exists.

## Do not do

- Do not retroactively label historical aggregate records as measured; they carry no per-request
  provenance ([index.ts:419](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:419)). Report the limitation.
- Do not gate F1's exclusion on `totalInput === 0` instead of the signal; the full-miss shape with
  real tokens is already asserted legitimate ([cache-economics.test.ts:138-144](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:138)).
- Do not reuse `missingUsageFields` as F1's signal; it also fires for `usage === undefined`,
  which already returns before cumulative accounting ([index.ts:9494](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9494)).
- Do not treat missing or negative pricing as free; only an explicit zero qualifies.
- Do not infer cache reporting or cache support from adapter family or `openai-*` API naming.
- Do not flip `prompt_cache_key` injection to opt-in.
- Do not reuse a singleton router hint across requests, and do not key hints on a `requestId`
  until Q3 confirms one exists.
- Do not tune retry thresholds or add retry heuristics without a real Pi event trace.
- Do not rewrite the extension, add model-name regexes, or fetch/hardcode pricing.

## Operator questions

| # | Question | Answer shape |
|---|---|---|
| Q1 | For a provider that omits cache fields, does Pi's pipeline set `cacheRead`/`cacheWrite` to `0` on the assistant message before `message_end`? Capture one raw response and its `message_end` usage. | yes / no |
| Q2 | In the model registry schema, does `cost.cacheRead: 0` mean "free"? | yes / no |
| Q3 | Can `before_agent_start` fire for a second request in the same process before the first request's `getHints` call? If yes, name the stable request identifier. | yes / no, plus field name or "none" |
| Q4 | Which adapters, if any, contractually define omitted cache fields as a full miss, earning an override at their `normalizeWithFallback` call? | list of adapter ids, or "none" |
| Q5 | Should a persisted `prompt_cache_key` rejection expire? | TTL in days, or "never" |

## Found in the artifacts, noticed by neither leg

- `research.md` cites the `<= 0` rejection at `index.ts:4117`; the predicate is at
  [index.ts:4129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4129) (function opens at 4123). Leg 2's citation is the correct one.
- The 400-path rejection check reads `event.headers` ([index.ts:9269-9270](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9269)); the body-text path runs
  only on `message_end` via `errorMessage` ([index.ts:9395](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9395)). A proxy that names the field only in
  its response body is learned one event later than the 400 itself. I'M UNCERTAIN ABOUT THIS:
  whether that event exposes a body field the handler could read instead was not checked.
