# Deep research — iteration 005 of 5

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

## This iteration's angle — decision-ready synthesis

Produce the final ranked backlog. One table: each item with its value, its effort, its risk, its proof, and its dependencies on other items. Order it for execution — what must land first and why. Separately and explicitly: list what this research recommends NOT doing, and the open questions that only the operator can settle. Be decisive; this is the artifact someone will act from.

## Rules

- Cite `file:line` for every claim about current behavior. Uncited = hypothesis, label it.
- Prefer being wrong loudly over vague. If an earlier finding is mistaken, say which and why.
- Do not edit any file. Research only; your reply is the artifact.
- Do not propose a rewrite. Changes must fit the existing structure.
- Budget: at most 12 tool calls. One angle done well beats a survey.


---

## Verbatim output of iteration 004 — this is the input you build on

## Verdict

Iteration 3’s three designs survive, but two need tightening:

1. Signal separation is still the highest-value change, but field presence alone is insufficient if Pi synthesizes zero-valued cache fields.
2. Cross-turn lifting has small runtime blast radius, but candidate authorization and churn tracking should not share one state field.
3. Accepting `cacheRead: 0` is surgical and locally testable; only the registry’s zero-value semantics remain externally unverified.

## 1. Cache miss vs unavailable signal

### Current behavior

`UsageSnapshot` contains only numeric counters, so it cannot distinguish “explicit zero” from “field absent” ([index.ts:427](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:427>)).

`getPiNormalizedUsage` returns zero-valued cache counters whenever an input count exists without cache fields ([index.ts:2485](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2485>), [index.ts:2495](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2495>)). The OpenAI, Anthropic, and Gemini raw readers make the same full-miss assumption ([index.ts:2541](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2541>), [index.ts:2567](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2567>), [index.ts:2610](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2610>)). Normalized usage wins before raw fallback is attempted ([index.ts:2623](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2623>).

The lifecycle records recent samples, then counts the snapshot in session, process, and cumulative buckets ([index.ts:9480](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9480>), [index.ts:9494](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9494>), [index.ts:9505](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9505>)). `addUsageToCacheStats` currently increments hit, token, and pricing counters for that zero-valued miss ([index.ts:4188](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4188>), [index.ts:4193](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4193>)).

### Blast radius

This touches:

- All `CacheProviderAdapter.normalizeUsage` implementations ([index.ts:456](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:456>)).
- `message_end`, recent samples, cumulative stats, and economics.
- `/cache-optimizer stats` and doctor diagnosis, whose current denominators use all requests/samples ([index.ts:4217](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4217>), [index.ts:4303](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4303>), [index.ts:4346](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4346>), [index.ts:5461](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:5461>)).

The proposed design has one missing consumer change: `formatRecentTrendSummary` receives `CacheUsageSample[]`, not `CacheStats`. Since samples currently contain only `missingUsageFields`, it cannot calculate `measuredRequests` from the new aggregate counter ([index.ts:444](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:444>)). Add a per-sample `unmeasured`/`cacheSignal` field, or explicitly exclude those samples before formatting.

Do not reuse `missingUsageFields` as that signal: `usage === undefined` is also recorded as a zero sample for diagnostics but returns before cumulative accounting ([index.ts:9480](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9480>), [index.ts:9494](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9494>)).

### Persistence and migration

The structural migration is small. V6 stores stats inside `sessions`, `totalsByModel`, and `legacyFamily` ([index.ts:4978](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4978>)). `parseCacheStats` already defaults absent newer fields to zero ([index.ts:4451](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4451>)), and the parser accepts V1 through V6 migration paths ([index.ts:4645](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4645>), [index.ts:4688](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4688>), [index.ts:4715](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4715>), [index.ts:4728](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4728>)).

Therefore no version bump is required for shape compatibility. However, old records cannot be made historically truthful: they contain aggregate counters but no per-request signal. Defaulting `unmeasuredRequests` to zero means historical requests are treated as measured. That must be reported as a limitation, or an explicit legacy/unknown measurement marker is needed.

The parser should also validate:

- `unmeasuredRequests <= totalRequests`
- `hitRequests <= totalRequests - unmeasuredRequests`

The totals merger must sum the new field with the other counters ([index.ts:4477](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4477>)).

### Proof

Fail-before/pass-after test:

- Change the existing full-miss test at [cache-economics.test.ts:138](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:138>) to expect `cacheSignal: 'unreported'` for `{ input: 500 }`.
- Add a stats test expecting `totalRequests: 1`, `unmeasuredRequests: 1`, zero measured hit/token/economics counters.
- Add a lifecycle test asserting that an input-only response appears in diagnostics but does not enter the measured denominator.

Negative controls:

- Explicit `{ cacheRead: 0, cacheWrite: 0 }` must be `reported` and count as one measured miss.
- No usable input must still return `undefined` and add no cumulative request ([cache-economics.test.ts:156](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:156>)).

Migration proof:

- Extend the existing V6 migration test to assert `unmeasuredRequests === 0` for records without that field ([cache-economics.test.ts:284](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:284>)).

### Correctness not demonstrable by unit tests

The code comments claim Pi always supplies normalized cache fields, possibly as zeros ([index.ts:2474](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2474>)). If that is true, checking normalized object presence cannot establish provider availability.

Required observation: capture the raw provider usage and the `message_end` usage object for:

- Explicit cache zeroes
- Omitted cache fields
- Positive cache hits

If the two first cases become identical before the extension sees them, the signal must come from raw provider metadata or a host-provided provenance flag. The repository tests alone cannot establish that contract.

## 2. Cross-turn stability before prefix lifting

### Current behavior

Candidates include prompts, appended prompts, tools, guidelines, and selected context files ([index.ts:691](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:691>)). The optimizer counts occurrences only within the current prompt and lifts a unique candidate immediately ([index.ts:857](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:857>), [index.ts:875](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:875>)).

The current prefix map is keyed only by model, not session ([index.ts:8484](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8484>), [index.ts:9143](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9143>)). It also stores an empty string whenever no non-empty prefix was shipped ([index.ts:9141](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9141>), [index.ts:9151](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9151>)).

### Blast radius

The behavior change is confined to `before_agent_start`, but that hook controls the system prompt returned to Pi ([index.ts:9062](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9062>)).

It also affects:

- The latest router/cache hint exposed through the hint service ([index.ts:8551](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8551>)).
- The published prompt-cache key and hint payload ([index.ts:9154](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9154>)).
- `prefixChurnCount`, which is incremented in session, process, and cumulative stats buckets ([index.ts:9141](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9141>)).

### Persistence and migration

The candidate state itself is in-memory only, so no persisted schema migration is needed. Existing `prefixChurnCount` values remain valid historical counters; they should not be recalculated. The state must nevertheless be cleared on session reset and disable paths.

Currently, `resetCurrentSessionStats` clears stats and recent samples but not the prefix map ([index.ts:8714](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8714>)). The bypass and disable paths return early ([index.ts:9101](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9101>), [index.ts:9111](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9111>), and the enable/disable commands call only the stats reset ([index.ts:9555](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9555>), [index.ts:9564](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9564>)).

### Design correction

The proposed `{ previousCandidates, lastShippedPrefix }` shape is insufficient if churn must retain its current “consecutive requests” meaning. If empty shipments are no longer recorded, a prefix from several turns ago may be compared against a later prefix and reported as consecutive churn.

Use separate concepts:

- `previousCandidates`: authorization state, replaced every eligible turn.
- `lastObservedPrefix` plus an initialization flag: churn state, updated every eligible turn, including empty output.

Also store only candidates actually observed in the previous eligible prompt, not merely candidates present in `systemPromptOptions`. Current candidate collection can produce values that are not present in the prompt; occurrence filtering happens later ([index.ts:849](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:849>)).

### Proof

Fail-before/pass-after test:

- Change the immediate-lift test at [review-findings.test.ts:44](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:44>):
  - First identical observation: unchanged prompt, `changed === false`.
  - Second identical observation: candidate lifts, `changed === true`.

Add to the lifecycle test around [cache-economics.test.ts:243](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:243>):

- Turn 1: candidate A, no lift.
- Turn 2: candidate A, lift.
- Turn 3: candidate B, no lift.
- Turn 4: candidate B, lift.

Negative controls:

- A candidate occurring twice must remain unlifted, preserving the existing ambiguity guard ([review-findings.test.ts:25](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:25>)).
- After stabilizing a candidate in session/model A, the same candidate must not lift on its first observation in session/model B.
- After bypass or disable, the next eligible observation must again be treated as first observation.

### Correctness not fully demonstrable by unit tests

Unit tests can prove the local two-observation state machine. They cannot prove that `before_agent_start` occurs exactly once per logical turn, or that lifting improves provider cache hits.

Required observations:

- Trace Pi event order for retries and multi-request turns, including session ID and request ID.
- Compare shipped prompt bytes with provider-reported cache hits across repeated turns.

## 3. Explicitly free cached-read pricing

### Current behavior

`readModelInputPricing` requires both input and cached-read rates to be strictly positive ([index.ts:4117](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4117>), [index.ts:4128](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4128>)). The existing test explicitly expects `cacheRead: 0` to be unpriced ([cache-economics.test.ts:54](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:54>).

Once pricing resolves, the arithmetic already supports a zero cached-read rate ([index.ts:4168](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4168>)). Pricing is used in `message_end` for all three stats buckets ([index.ts:9501](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9501>)) and in the stats command ([index.ts:9604](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9604>).

### Blast radius

This is limited to pricing resolution and persisted economics fields:

- `inputCostUsd`
- `uncachedBaselineCostUsd`
- `pricedRequests`

Those fields are part of every persisted `CacheStats` record ([index.ts:265](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:265>), [index.ts:4978](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4978>)).

Hit counters, prompt rewriting, provider selection, and cache-key publication are unaffected.

### Persistence and migration

No migration is required. Existing cost totals remain historical; only future requests with an explicit free cached-read rate become priced. The existing parser already preserves cost fields and defaults absent older fields ([index.ts:4451](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4451>)).

One caller nuance matters: if the model’s direct cost block is rejected, `resolveModelPricing` may fall back to registry pricing ([index.ts:4144](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4144>)). The direct-zero test should therefore isolate `readModelInputPricing`, and a separate integration test should verify the intended registry behavior.

### Proof

Fail-before/pass-after test:

- Change the `cacheRead: 0` assertion at [cache-economics.test.ts:54](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:54>) to expect a pricing object.
- Verify that a usage sample with cached reads produces zero cost for those reads while uncached tokens still use the input rate.

Negative controls:

- Missing `cacheRead` remains unpriced.
- Negative `cacheRead` remains unpriced.
- `input: 0` remains unpriced.
- A positive registry fallback remains usable.

The unit test proves implementation behavior, but not the meaning of zero. That requires an authoritative registry schema or real registry entry showing that `cacheRead: 0` means “free,” not “unknown.”
