## Iteration 007 (Sonnet 5, second opinion) — attacking the standing backlog

12 tool calls used (2 grep, 10 targeted reads). I independently re-read the F1/F3 pricing and F2 promotion code iteration 006 already cited, and — new this iteration — read the F5 and F6 code iteration 006 explicitly skipped, plus traced where `hasMissingUsageFields`'s result actually goes. That last trace is the one that changes the picture.

### The one finding that changes the ranking: F1's flag is never wired to the numbers it's supposed to protect

`hasMissingUsageFields` (`index.ts:4269-4293`) computes a per-response boolean. Trace where it's consumed:

- `index.ts:9486` — computed as `missingUsageFields` for the sample record.
- `index.ts:8612,8625` — stored on the `CacheUsageSample` (`missingUsageFields: boolean`).
- `index.ts:4306,4313-4315` and `4399-4400` — read back out only to print a "N missing usage" footnote under **Recent trend**.
- `index.ts:9509-9513` — `addUsageToCacheStats(...)` is called **unconditionally**, with no branch on the missing flag, for every one of `sk`/process/total/adapter-level stats buckets.

`addUsageToCacheStats` (`4183-4198`) is what feeds `hitRequests`, `totalRequests`, `totalInputTokens`, `inputCostUsd`, and `uncachedBaselineCostUsd` — i.e. the entire **Economics** block (`4364-4391`) and the headline hit ratio (`4346-4349`). None of that reads `missingUsageFields`. So the classification iteration 006 called "a rare degenerate response, not a live defect" is detected but functionally inert — it decorates a trend line and does nothing to the cost/savings numbers, which is the extension's actual value proposition (`4176-4177`, "the explicit savings baseline... stated so the number is checkable"). This is *more* consequential than either the original backlog or iteration 006 credited it, not less.

**I disagree with iteration 006's proposed merge of F1 into F4.** They're not the same fix:
- F4 (capability gate on `CacheCompat`, `246-263` — confirmed no "reports cache usage at all" flag exists) is a **static, model-level** exclusion.
- F1's actual defect is **dynamic and per-response** — even a normally-compliant provider can return one malformed/incomplete record, and that shouldn't need a standing model-level compat flag to catch.

Collapsing them into "just add the capability gate" leaves the per-response gap open. Keep both as separate P0s, and retarget F1's fix description from "distinguish miss from unavailable" (already partially true — the classifier exists) to "make `missingUsageFields` actually exclude the sample from `addUsageToCacheStats`."

### Risk the backlog understates: the naive fix for F1 makes measurement worse, not better

If someone implements F1 as "skip `addUsageToCacheStats` when `missingUsageFields`," that silently drops those requests from `totalInputTokens`/`inputCostUsd`/`uncachedBaselineCostUsd` too — not just from the hit ratio. Real provider spend happened on those requests; hiding them from the denominator makes the **Baseline** and **Savings** lines (`4376-4384`) undercount actual cost, which is a worse failure mode for a tool whose stated purpose is a checkable savings number. The correct fix has to split cost-tracking (always record, regardless of cache-field availability) from hit-ratio-tracking (exclude only the ratio numerator/denominator on missing signal) — the backlog's one-line framing ("separate reported miss from unavailable") doesn't surface that these are two different counters requiring different treatment on the same code path.

### F5 — confirmed, but I'd redirect the fix, not just endorse "make it explicit"

`shouldInjectOpenAIPromptCacheKeyForModel` (`1521-1525`) gates only on API family (`isOpenAICompatibleApi`) plus an explicit `supportsPromptCacheKey === false` opt-out. Default behavior for any `openai-completions` model — which per the comment at `2684-2686` includes GPT, Kimi, Qwen, GLM, MiniMax, Mimo, Hunyuan and "any other OpenAI-compatible proxy" — is inject-by-default, with rejection learned reactively only after a live 400 whose error text matches `hasPromptCacheKeyUnsupportedSignal` (`2768-2790`, a string-match against phrases like `'unsupported parameter'`; fragile against providers that phrase rejection differently or return a generic 400). `rememberPromptCacheKeyUnsupported` (`8488-8498`) records the learned rejection into `promptCacheKeyUnsupportedModels`, an in-memory `Set` — I did not verify whether this persists across sessions/restarts (out of budget); if it doesn't, every fresh session re-learns the rejection by eating one failed request per unsupported model.

Where I'd push back on the backlog's framing: "make it explicit" should **not** mean flipping the default to opt-in. Most third-party OpenAI-compatible proxies do support `prompt_cache_key` and currently benefit from the default-on injection with zero config. Requiring an explicit `supportsPromptCacheKey: true` per model would regress caching for all of them until someone populates `models.json`. The actionable gap is narrower: persist the *learned* rejection as durable compat state instead of a session-scoped Set, so a provider that explicitly rejects it is only ever asked once, ever — not once per session.

### F6 — confirmed mechanism, severity is a hypothesis pending Pi's concurrency model

`latestCacheHint` is a single mutable slot (`8483`), overwritten unconditionally on every `before_agent_start` (`9063` clears it, `9159` republishes it) and read by the installed `getHints` service (`8554-8586`). The match logic is fail-open: each guard is `input.X && hint.X && input.X !== hint.X` (`8560-8579`) — if either side lacks a field, the mismatch check is skipped rather than treated as "unknown, don't serve." So a downstream `getHints` call missing a field the hint also lacks will pass through unfiltered. Combined with the single-slot design, two interleaved `before_agent_start` events (e.g. concurrent subagent dispatch in the same process) before the first's actual request calls `getHints` would serve the second agent's prompt/cache-key to the first's request. I could not confirm from the code whether Pi's runtime ever fires `before_agent_start` concurrently for sibling agents in one process — flagging this as the backlog's own P1, not elevating it, since I lack the evidence to say it fires in practice.

### F2, F3, F7 — re-confirmed independently, no disagreement

- **F2** (`691-928`): `buildStableCandidates` is recomputed fresh per call with no reference to what shipped last turn; `optimizeSystemPrompt` promotes any uniquely-occurring candidate unconditionally (`874-882`); `detectStablePrefixChurn` (`4159-4161`) is called only after promotion (`9145`) purely to increment `prefixChurnCount` (`9147-9149`) — telemetry, not a gate. Agree P0, no changes to iteration 006's read.
- **F3** (`4126-4129`, `4386-4390`): `<=0` rejects a genuine `cost.cacheRead = 0` identically to an absent rate. Agree P0.
- **F7** (`7737-7801`): `repeatLevel`/`streakLevel` are tracked and escalated independently, with the inline comment (`7760-7765`) documenting the prior collapse bug as fixed. This is now the **second** independent read (mine plus iteration 006's) finding no defect.

### Item I'd drop entirely: F7

Not because it's low-severity — because it's *closed*. Two independent passes across two iterations have verified the retry-guard's event contract and found it already correctly separates the two failure modes it needs to separate. Carrying it forward as a P2 "verify before tuning" line item spends a future iteration's budget re-confirming something already confirmed twice. Recommend marking it resolved-no-defect and removing it from the active backlog rather than downgrading it.

### Reprioritized backlog

| Item | Backlog rank | My rank | Change |
|---|---|---|---|
| F2 (prefix promotion needs cross-turn stability) | P0 | P0 | unchanged |
| F3 (zero cached-read pricing) | P0 | P0 | unchanged |
| F1 (miss vs unavailable) | P0 | P0, retargeted | fix must wire the flag into `addUsageToCacheStats` exclusion, not just refine classification |
| F4 (capability gate) | P1 | P0 companion to F1 | static gate, not a substitute for F1 — don't merge |
| F5 (explicit `prompt_cache_key` support) | P1 | P1, redirected | persist learned rejection; do not flip default to opt-in |
| F6 (request-scoped router hints) | P1 | P1, unconfirmed severity | mechanism confirmed; concurrency trigger unverified |
| F7 (retry guard) | P2 | **drop** | verified twice, no defect, close it |
