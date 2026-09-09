---
title: "Research: improving the pi-cache-optimizer extension"
description: "Five bounded iterations on where the Pi cache extension is weakest, what survived adversarial verification, and the ordered backlog that came out of it."
trigger_phrases:
  - "cache optimizer improvement research"
  - "pi cache extension findings"
  - "cache measurement provenance"
  - "prefix lifting stability"
importance_tier: "important"
contextType: "research"
---
# Research: improving the pi-cache-optimizer extension

## Provenance

Eight iterations in two legs, sixteen dispatch receipts.

Iterations 1-5 ran on `cli-codex` with `gpt-5.6-luna` at reasoning effort `max`, `fast` service
tier. Iterations 6-8 are a second opinion from a different model: `cli-claude-code` with
`claude-sonnet-5` at effort `xhigh`, on a separate account. Both legs went through the audited
executor path with intent and completion receipts per iteration. Stop policy was `max-iterations`
throughout, so no iteration was skipped by early convergence.

| Iteration | Angle | Outcome |
|---|---|---|
| 001 | Ground truth and highest-value gaps | 7 ranked findings |
| 002 | Adversarial verification of the P0s | 2 CONFIRMED, 1 REFUTED as stated |
| 003 | Minimal design for what survived | Designs fitted to existing structure |
| 004 | Blast radius, migration, and proof | Per-design test and negative control |
| 005 | Decision-ready synthesis | Ordered backlog below |
| 006 | Independent re-derivation (Sonnet 5) | Same top 3 by different route; F5/F6 not covered, and said so |
| 007 | Attack the backlog (Sonnet 5) | Retargets F1, promotes F4, drops F7 |
| 008 | Specify rank 1 to buildable detail (Sonnet 5) | F1 spec, test, negative control |

The refutation in iteration 002 is the reason the loop was worth running: the third P0 from
iteration 001 did not survive being traced, and the design effort went elsewhere.

## Execution order

**F1 → F3 → F4 → F2 → F5 → F6 → F7.** This is execution order, not severity order. F1 comes first
because it defines the vocabulary the others measure against.

| Rank | Item | Value | Effort | Risk | Proof / exit gate | Dependencies |
|---:|---|---|---|---|---|---|
| 1 | **F1 / P0 — Separate reported miss from unavailable cache signal** | Forecast: very high; prevents false misses, denominators, and savings. Confirmed: normalized and raw readers synthesize zero cache counters when fields are absent [index.ts:2474](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2474) [index.ts:2541](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2541). | M | High semantic risk; provenance may already be lost before the extension sees the message. | Input-only usage becomes `unreported`; explicit zeroes remain a measured miss; unavailable samples leave measured denominators and economics untouched. Verify raw provider usage against `message_end`. | None. Foundation for F3 and for evaluating F2/F4/F5/F6. |
| 2 | **F3 / P0 — Accept explicit zero cached-read pricing** | Forecast: high value at low scope. Confirmed: `cacheRead <= 0` is rejected [index.ts:4117](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4117), although cost arithmetic already supports a zero rate [index.ts:4168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4168). | S | Low/medium; only the registry meaning of zero is unresolved. | Change the zero-rate test, verify cached reads cost zero while uncached input remains priced, and retain missing/negative-rate rejection. Test direct pricing separately from registry fallback [index.ts:4144](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4144). | F1 for meaningful aggregate savings; otherwise independent. |
| 3 | **F4 / P1 — Add explicit provider capability gates** | Forecast: high; prevents adapter recognition from being treated as a cache guarantee. Confirmed: adapters expose matching and normalization but no cache capability contract [index.ts:456](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:456), despite the extension describing caching as best-effort [index.ts:109](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:109). | M/L | High; false negatives disable useful behavior, while false positives preserve current errors. | Build a small capability matrix for official providers, proxies, custom providers, and unknowns. Unknown must fail closed for optional cache behavior; stats must remain distinguishable from “miss.” | Align with F1’s unknown/unreported vocabulary. Unlocks F2 and F5; informs F6. |
| 4 | **F2 / P0 — Require cross-turn stability before prefix lifting** | Forecast: very high safety value. Confirmed: lifting occurs during each eligible `before_agent_start` call [index.ts:9132](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9132); the current test expects immediate lifting [review-findings.test.ts:44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:44). The churn map is model-keyed [index.ts:8484](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8484) and records empty shipments [index.ts:9141](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9141). | M | Medium/high; first-turn behavior changes and stale authorization can alter prompts. | Turn sequence A/A/B/B: first observation unchanged, second lifts; ambiguity remains unlifted; session/model isolation and reset/disable clearing pass. Then compare shipped prompt bytes with provider cache hits. | F1 for trustworthy measurement; F4 should define which providers are eligible before broad rollout. |
| 5 | **F5 / P1 — Make third-party `prompt_cache_key` support explicit** | Forecast: high reliability value. Confirmed: the existing flag is only a negative opt-out—OpenAI-compatible models are accepted unless `supportsPromptCacheKey === false` [index.ts:1521](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:1521)—and injection is attempted from the provider hook [index.ts:9254](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9254). Reactive 400 handling already exists [index.ts:9267](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9267). | S/M | Medium; conservative defaults may reduce cache benefit for unconfigured proxies. | Matrix-test official OpenAI, third-party with no flag, explicit true, explicit false, and observed 400. | F4’s capability contract. |
| 6 | **F6 / P1 — Make router cache hints request-scoped** | Forecast: high value for concurrent or multi-request routing. Confirmed: hints are stored in one `latestCacheHint` slot [index.ts:8483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8483); consumers filter session/model/provider fields but not request ID [index.ts:8551](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8551). The route resolver currently passes only the session hash [index.ts:1073](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:1073). | M | High if request identity is unavailable or unstable; fail closed rather than reuse stale hints. | Interleave two requests in one session with different routes; assert each receives only its own prompt, key, and retention hint. | External confirmation of stable Pi `requestId`; coordinate with F4. |
| 7 | **F7 / P2 — Verify the retry guard’s event contract before tuning** | Forecast: medium safety value, but high downside if wrong. Confirmed: the guard depends on assistant `message_end`, `tool_result`, and `abort()` [index.ts:9337](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9337) [index.ts:9354](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9354). | S to observe; M to change | High false-abort/false-reset risk if thresholds are tuned against simulated events. | Trace real Pi events for normal retries, one retry then success, and repeated whole-batch failure. Prove batch identity, ordering, one escalation, and one abort before changing thresholds. | None. Observation may run in parallel, but tuning remains last. |


## Do not do

- Do not retroactively label historical aggregate records as measured; older persisted data lacks per-request provenance [index.ts:420](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:420).
- Do not treat missing or negative pricing as free; only an authoritative explicit zero qualifies [index.ts:4127](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4127).
- Do not infer cache support from adapter family or `openai-*` API naming.
- Do not inject `prompt_cache_key` for third-party providers merely because they use an OpenAI-compatible API.
- Do not reuse a singleton “latest” router hint across requests.
- Do not tune retry thresholds, add retry heuristics, or rewrite the extension before the host event trace exists.

## Operator-settled open questions

- Can Pi expose raw provenance distinguishing omitted cache fields from explicit zeroes?
- Does the model registry define `cacheRead: 0` as “free,” rather than “unknown”?
- Which providers/models officially support cache reads, writes, retention, prefix reordering, and `prompt_cache_key`?
- Should unknown third-party key support default to opt-in, or should a documented allowlist remain enabled by default?
- Is `requestId` stable across `before_agent_start`, provider requests, retries, and multi-request turns?
- What false-positive rate is acceptable before the retry guard escalates or aborts a turn?

## Second opinion (iterations 6-8, Sonnet 5)

A different model re-derived the top three from the code without adopting the ranking, then attacked
the backlog. It reached the same top three independently and changed the list in four ways:

| Item | First leg | Second opinion | Change |
|---|---|---|---|
| F2 prefix promotion | P0 | P0 | unchanged |
| F3 zero cached-read pricing | P0 | P0 | unchanged |
| F1 miss vs unavailable | P0 | P0, **retargeted** | the flag must be wired into the stats-exclusion path, not just the classifier |
| F4 capability gate | P1 | **P0 companion to F1** | a static gate, not a substitute — do not merge the two |
| F5 `prompt_cache_key` | P1 | P1, redirected | persist the learned rejection; do not flip the default to opt-in |
| F6 request-scoped hints | P1 | P1, severity unconfirmed | mechanism confirmed, concurrency trigger unverified |
| F7 retry guard | P2 | **drop** | inspected twice, no defect found; close it |

**The most useful thing it caught is a trap in F1's own fix.** Implementing F1 as "skip
`addUsageToCacheStats` when cache fields are missing" would drop those requests from
`totalInputTokens` and the cost figures as well as from the hit ratio. Real spend happened on those
requests, so hiding them understates Baseline and Savings — a worse failure than the ambiguity being
fixed, in a tool whose purpose is a checkable savings number. Cost tracking must always record;
only the ratio's numerator and denominator may exclude on a missing signal. These are two counters
on one code path and need different treatment.

Iteration 008 specifies F1 to buildable detail, with the test that fails before and passes after and
its negative control. Its own uncertainties are listed there rather than smoothed away.

## Reading these findings

Every claim above carries a `file:line` from the shipped extension and was traced rather than
inferred. Two design variants were rejected outright during iteration 003 and are recorded in
`iterations/iteration-003.md`; the per-design blast radius and proof obligations are in
`iterations/iteration-004.md`. Nothing here has been implemented.
