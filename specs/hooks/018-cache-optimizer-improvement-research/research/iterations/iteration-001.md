No files were changed. The extension’s cache-affecting path is:

- `PI_CACHE_RETENTION=long` is requested at load time: `.pi/extensions/pi-cache-optimizer/index.ts:36-115`.
- `before_agent_start` strips session churn, compresses skills, and moves selected “stable” text ahead of dynamic text: `:9115-9198`.
- `before_provider_request` repairs Anthropic TTL order, strips unsafe retention parameters, and injects an OpenAI-compatible `prompt_cache_key`: `:9201-9260`.
- `message_end` normalizes usage and updates stats: `:9429-9516`.

## Ranked findings

### 1. P0 — Separate “cache miss” from “cache signal unavailable”

- **Evidence / gap:** A normalized response with `input` but no cache fields is treated as a full miss: `:2478-2501`. The raw OpenAI, Anthropic, and Gemini readers do the same when cache fields are absent, while the DeepSeek reader returns `undefined` without its cache-hit field: `:2505-2621`. Any non-error usage snapshot increments `totalRequests`, even when its counters are all zero: `:4183-4197`, `:9432-9443`. The “missing usage” flag only exists in recent in-memory samples, not the cumulative counters: `:4269-4297`, `:9480-9496`.

- **Failure addressed:** The reported miss rate cannot distinguish a genuine cache miss, unsupported cache telemetry, and an empty/partial usage record. Provider rates are also inconsistent across adapters.

- **Proposed change:** Add an explicit usage quality field, such as `cacheSignal: 'hit' | 'miss' | 'unreported'`. Keep unreported requests out of hit-rate denominators and persist an `unmeasuredRequests` counter. Render `N/A` rather than `0%` when cache evidence is absent.

- **Risk:** Requires stats-schema migration and will make historical rates appear lower-volume, but it prevents false optimization conclusions.

### 2. P0 — Gate stable-prefix lifting on cross-turn stability

- **Evidence / gap:** `buildStableCandidates` treats custom prompts, appended prompts, tool snippets, guidelines, context files, and skills as candidates: `:691-740`. `optimizeSystemPrompt` only checks whether each candidate occurs exactly once in the current prompt before moving it to the front: `:837-884`. Its integrity guard verifies marker presence, not whether content remains semantically attached to its original block: `:809-835`, `:886-930`.

- **Failure addressed:** “Unique in this prompt” is not the same as “stable across requests.” A one-off guideline or dynamic custom prompt can be promoted into the cache prefix; when it changes, the earliest cache bytes change and the whole prefix may miss.

- **Proposed change:** Require a candidate to have the same normalized value across two consecutive turns before lifting it, or restrict lifting to known-stable context files and deterministic skill indexes. Add a test where a candidate occurs once but changes between turns.

- **Risk:** Truly static custom instructions may be lifted one turn later; the first-turn behavior becomes more conservative.

### 3. P0 — Make economics useful with explicit local pricing

- **Evidence / gap:** Pricing is resolved only from `model.cost` or a registry model’s `cost` block: `:4123-4158`. The tests explicitly treat missing pricing and `cacheRead: 0` as unpriced: `.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:22-77`.

- **Cheapest change:** Add a `cost` block for the models actually used in the local Pi model registry. No pricing engine or provider lookup is needed; the existing resolver already consumes that shape.

- **Small code improvement:** Accept an explicitly present zero `cacheRead` rate as valid pricing. A free cached read is economically meaningful; “missing” and `0` should not be conflated.

- **Risk:** User-supplied prices can become stale. Do not hardcode rates or silently infer them.

### 4. P1 — Add provider capability gates instead of treating adapters as cache guarantees

- **Evidence / gap:** The adapter table recognizes provider/model families and normalizes usage: `:3054-4020`. The prompt rewrite is broadly provider-agnostic: `:9115-9136`. The request hook has explicit cache mutations for Anthropic TTL ordering and OpenAI retention/key handling, but no Gemini-specific cache creation or cache-content path: `:9201-9260`.

- **Failure addressed:** Adapter recognition proves only that stats can be normalized; it does not prove that moving system-prompt text improves that provider’s cache. If a provider does not cache the serialized system prompt as a prefix, the main optimization is ineffective.

- **Proposed change:** Add small adapter capability flags—e.g. `supportsStablePromptPrefix`, `supportsPromptCacheKey`, and `cacheSignalSemantics`—and apply only the mutations each provider contract supports.

- **Risk:** Some custom proxies may benefit despite lacking a declared capability, so this could reduce coverage until backed by wire-level fixtures.

### 5. P1 — Treat third-party `prompt_cache_key` support as an explicit capability

- **Evidence / gap:** Injection is enabled for every OpenAI-compatible API unless `supportsPromptCacheKey: false` or an opt-out is present: `:1521-1525`, `:9254-9260`. Automatic disablement happens only when the error explicitly names `prompt_cache_key`: `:9267-9273`, `:9392-9398`. Existing tests preserve injection after an unrelated 400: `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:169-240`.

- **Failure addressed:** A proxy that rejects the field with a generic 400, or accepts and ignores it, is not distinguishable from a supported provider. A generic rejection can repeat on every request.

- **Proposed change:** Keep automatic injection for official OpenAI, but require `supportsPromptCacheKey: true` for third-party endpoints—or add an explicit “unknown/unsupported” diagnostic state rather than assuming support.

- **Risk:** Existing third-party users may lose cache affinity until they configure the capability.

### 6. P1 — Make router cache hints request-scoped

- **Evidence / gap:** The protocol input has session/route/model fields but no request identifier: `:342-355`. Each prompt rewrite publishes one `latestCacheHint` snapshot: `:9158-9176`; the cache-hints service is installed as shared process-global state: `:1168-1209`.

- **Failure addressed:** If two routed requests overlap, a later prompt can overwrite the hint seen by an earlier request. This is a hypothesis about concurrent host behavior, but if true it could associate the wrong prompt, key, or upstream model with a request.

- **Proposed change:** Key hints by `requestId` when available; otherwise require a matching session and route identity and reject stale hints. Add an overlap test using two route snapshots.

- **Risk:** Older router extensions may not provide enough identity and would receive fewer hints.

### 7. P2 — Verify the retry guard’s event contract before tuning it further

- **Evidence / gap:** The guard maintains one active batch; `startToolBatch` replaces the previous expected set and outcome map: `:7725-7728`. It extracts calls only from assistant `content` blocks shaped as `{type:'toolCall', id, name}`: `:7685-7696`. The runtime handler separately consumes `tool_result` events and calls `ctx.abort()`: `:9337-9385`.

- **Unverified assumptions:** Pi emits one assistant batch before its matching results, does not interleave batches, uses that exact content shape, and `abort()` prevents the billable reissue rather than only stopping the agent loop.

- **Proposed change:** Add an integration fixture from actual Pi lifecycle events. If the host exposes a turn/request ID, key batches by it; otherwise refuse to overwrite a pending batch and report “guard state unavailable.”

- **Risk:** Defensive handling may leave some failures unguarded; incorrect assumptions currently risk either silent non-enforcement or a false abort.

## What I would not do

- Do not rewrite the extension; the existing lifecycle seams are adequate.
- Do not add more model-name regexes. Adapter selection is first-match over an already large table: `:3054-4024`.
- Do not fetch or hardcode pricing.
- Do not spend more effort on `edit_lines` for this cache objective; it is deliberately isolated behind its own registration boundary: `:8225-8237`.

The best next implementation experiment is finding 1 plus a cross-turn candidate-drift test from finding 2. Together they would establish whether reported cache outcomes are trustworthy and whether the main rewrite is helping rather than causing prefix churn.
