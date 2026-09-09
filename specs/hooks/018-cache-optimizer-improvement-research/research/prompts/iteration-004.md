# Deep research — iteration 004 of 5

Continuing a research loop on improving the Pi extension `pi-cache-optimizer`
(`.pi/extensions/pi-cache-optimizer/index.ts`, ~9,400 lines, plus `tests/`).

## Findings already on the table (from earlier iterations)

  - 1. P0 — Separate “cache miss” from “cache signal unavailable”
  - 2. P0 — Gate stable-prefix lifting on cross-turn stability
  - 3. P0 — Make economics useful with explicit local pricing
  - 4. P1 — Add provider capability gates instead of treating adapters as cache guarantees
  - 5. P1 — Treat third-party `prompt_cache_key` support as an explicit capability
  - 6. P1 — Make router cache hints request-scoped
  - 7. P2 — Verify the retry guard’s event contract before tuning it further

Do not re-derive these. Build on them.

## This iteration's angle — blast radius and proof

For each design from iteration 3: what is its blast radius, which callers or persisted records does it touch, and what would a migration of existing data have to handle? Then define the proof: the specific test that fails before the change and passes after, plus a negative control. Flag any design whose correctness cannot be demonstrated by a test, and say what observation would be needed instead.

## Rules

- Cite `file:line` for every claim about current behavior. Uncited = hypothesis, label it.
- Prefer being wrong loudly over vague. If an earlier finding is mistaken, say which and why.
- Do not edit any file. Research only; your reply is the artifact.
- Do not propose a rewrite. Changes must fit the existing structure.
- Budget: at most 12 tool calls. One angle done well beats a survey.


---

## Verbatim output of iteration 003 — this is the input you build on

## Iteration 003 — minimal surviving design

Iteration 2 confirmed only:

1. Cache miss vs unavailable signal.
2. Cross-turn stability before prefix lifting.
3. The narrower economics defect: explicit `cacheRead: 0`.

Findings 4–7 were not re-confirmed, so I would not design them yet.

### 1. Separate cache miss from unavailable signal

The current `UsageSnapshot` has only numeric counters, so omitted cache fields become indistinguishable from zero-valued misses ([index.ts:427](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:427>)). `getPiNormalizedUsage` explicitly converts absent cache fields into zeroes when `input` exists ([index.ts:2478](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2478>)); the OpenAI, Anthropic, and Gemini fallbacks do the same ([index.ts:2541](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2541>), [index.ts:2567](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2567>), [index.ts:2610](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2610>).

The smallest truthful representation is one signal bit:

| Evidence | Signal | Accounting |
|---|---|---|
| Cache fields explicitly present, including zero | `reported` | `cacheRead > 0` is a hit; zero is a miss |
| Cache fields omitted but input count exists | `unreported` | Count as unmeasured, never as a miss |
| No usable usage | `undefined` | Preserve current no-stats behavior |

#### Functions and call sites

Touch only:

- `UsageSnapshot` at [index.ts:427](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:427>): add `cacheSignal: 'reported' | 'unreported'`.
- `getPiNormalizedUsage`, `getOpenAIRawUsage`, `getAnthropicRawUsage`, and `getGeminiRawUsage`: set `reported` from actual field presence, not numeric value.
- `normalizeWithFallback` at [index.ts:2623](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2623>): retain its current normalized-first order.
- `CacheStats` at [index.ts:265](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:265>): add `unmeasuredRequests`.
- `emptyCacheStats`, `addUsageToCacheStats`, `parseCacheStats`, and `addCacheStatsTotals` at [index.ts:4094](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4094>), [index.ts:4183](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4183>), [index.ts:4427](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4427>), and [index.ts:4477](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4477>).
- `message_end` at [index.ts:9387](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9387>): mark an unreported sample as missing for diagnostics.
- `formatCacheStats`, `formatRecentTrendSummary`, `buildStatsOutput`, and `buildLowHitDiagnosis`: use `measuredRequests = totalRequests - unmeasuredRequests` for hit-rate thresholds and denominators. Current output uses `totalRequests` directly ([index.ts:4217](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4217>), [index.ts:4303](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4303>), [index.ts:4346](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4346>)).

`totalRequests` should remain the total number of usage snapshots for backward compatibility. For `unreported`, increment `unmeasuredRequests`, then skip hit counters, cached-token counters, and economics. This prevents the known input count from being treated as uncached input.

No persisted-version bump is needed: the latest persistence format already stores `CacheStats` objects, and missing newer fields already default during parsing ([index.ts:419](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:419>), [index.ts:4451](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4451>)). Historical records remain ambiguous and will load with `unmeasuredRequests: 0`.

The existing official-provider “omitted means full miss” behavior needs an explicit decision. The safest default is `unreported`; if that omission contract is verified for a specific adapter, add a narrow override at its `normalizeWithFallback` call. Do not infer it from the generic `openai` adapter id, because third-party adapters also use OpenAI-shaped usage.

#### Unchanged

- `undefined` usage still returns before cumulative stats ([index.ts:9494](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9494>)).
- Explicit `{ cacheRead: 0, cacheWrite: 0 }` remains a measured miss.
- Pricing lookup and arithmetic remain unchanged for measured samples.
- `/cache-optimizer stats` remains the same command; only its text gains an unmeasured qualifier.
- No new config or parallel statistics record.

#### What would make this design wrong

- Pi always supplies cache fields, including synthetic zeroes, before the extension sees the message. Then field presence cannot recover availability; the signal must come from raw provider metadata.
- Every supported provider guarantees that omission means a full miss, including proxies and routers. Then `unreported` would undercount misses rather than correct a real ambiguity.
- A zero `cacheRead` rate is actually a registry sentinel for “unknown,” not a valid free rate; that is addressed below.

Tests to change/add: the full-miss tests at [cache-economics.test.ts:138](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:138>), the stats accumulator tests at [cache-economics.test.ts:109](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:109>), and one lifecycle test asserting that an input-only response increments `unmeasuredRequests` but not the measured hit denominator.

### 2. Gate stable-prefix lifting on cross-turn stability

`optimizeSystemPrompt` currently lifts a candidate after only a single-turn occurrence check ([index.ts:857](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:857>), [index.ts:875](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:875>)). The existing per-model prefix map is report-only ([index.ts:8484](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8484>), [index.ts:9138](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9138>)).

#### Smallest design

Reuse that one in-memory map, changing its value from a string to:

```ts
{
  previousCandidates: Set<string>;
  lastShippedPrefix?: string;
}
```

Do not add persistence, config, or a new command.

#### Functions and call sites

- Extract the candidate normalization currently embedded at [index.ts:849](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:849>) into a helper reused by both the optimizer and hook.
- Extend `optimizeSystemPrompt` with a previous-candidate set. A candidate may be lifted only when:
  1. it occurs exactly once in the current prompt;
  2. it passes the existing minimum-length and marker-integrity checks; and
  3. its normalized value was present in the immediately preceding eligible turn.
- At `before_agent_start` ([index.ts:9062](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9062>)):
  1. Read the prior candidate set.
  2. Optimize using that prior set.
  3. Replace the stored set with the current candidates.
  4. Update `lastShippedPrefix` only when a non-empty stable prefix was actually shipped.
- Key the state by session plus model, so a candidate observed in one session cannot authorize lifting in another.
- Clear that state on session reset and on bypass/disable paths.

The resulting behavior is:

- First observation: candidate stays in place.
- Second consecutive identical observation: candidate may lift.
- Changed candidate: does not lift on the change turn.
- If the changed value remains unchanged on the next turn, it may lift then.

Updating `lastShippedPrefix` only for actual non-empty shipped prefixes avoids counting the first authorized lift as false churn. The current churn detector itself can remain unchanged.

#### Unchanged

- Candidate collection, context-file path filtering, occurrence counting, and structural-marker protection remain intact ([index.ts:691](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:691>), [index.ts:896](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:896>).
- Session-overview stripping and skill compression still run on eligible requests ([index.ts:9115](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9115>)).
- Responses-API bypasses, global opt-outs, cache-key publication, and router hints remain unchanged ([index.ts:9101](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9101>), [index.ts:9154](</Users/ michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9154>)).
- Prefix churn remains diagnostic only.

Tests at [review-findings.test.ts:44](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:44>) should change from “unique lifts immediately” to “first observation does not lift; second identical observation does.” The lifecycle test at [cache-economics.test.ts:231](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:231>) should add a fourth turn so the changed guideline is lifted only after it remains stable.

#### What would make this design wrong

- A changed candidate is lifted on its first new value, indicating the previous/current sets were updated in the wrong order.
- State leaks across sessions or models.
- `before_agent_start` is not one event per logical turn; then this is measuring hook invocations rather than turns and needs a host-provided request/turn identity.
- Stable candidates are rebuilt with meaningful formatting changes that the chosen normalization treats as different. That would be conservative under-lifting, not a safety failure.

### 3. Accept an explicitly free cached-read rate

`readModelInputPricing` currently rejects `cacheRead: 0` because it requires the value to be strictly positive ([index.ts:4123](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4123>)). The test codifies that rejection ([cache-economics.test.ts:54](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:54>).

Change only:

```ts
cacheReadPerToken === undefined || cacheReadPerToken < 0
```

Keep `input > 0` unchanged. `cacheWrite: 0` is already accepted as a valid zero charge ([index.ts:4130](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4130>)).

#### New behavior

A model with:

```ts
{ input: 2.5, cacheRead: 0, cacheWrite: 0 }
```

is priced. Cached reads contribute zero actual cost, while uncached input and the uncached baseline still use the input rate.

#### Unchanged

- Missing cost blocks remain `unpriced`.
- Registry fallback remains unchanged.
- No pricing source, command, or config changes.

The only condition making this wrong is if the local model schema uses zero as an “unknown” sentinel rather than as a valid free rate. The requested edge case assumes the opposite; that assumption should be confirmed against the registry contract before implementation.

No files were changed; this remains a research/design artifact.
