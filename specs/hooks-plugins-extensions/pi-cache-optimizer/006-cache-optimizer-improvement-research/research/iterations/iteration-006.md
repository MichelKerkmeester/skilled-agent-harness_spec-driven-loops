## Independent re-derivation — top 3, with file:line evidence

I read the source directly (`.pi/extensions/pi-cache-optimizer/index.ts`, structural scan + targeted reads of the pricing, prompt-optimization, usage-classification, and retry-guard sections; 12 tool calls used). I did **not** read the sections backing F5 (third-party `prompt_cache_key`) or F6 (router hint scoping) this iteration, so I have no independent opinion on those — not confirming, not disputing.

### #1 — Zero-priced cached reads are treated as "unpriced" (= backlog F3, P0)

`readModelInputPricing` rejects the whole pricing block whenever `cacheReadPerToken <= 0`:

```
4128  if (inputPerToken === undefined || inputPerToken <= 0) return undefined;
4129  if (cacheReadPerToken === undefined || cacheReadPerToken <= 0) return undefined;
```

A model configured with a genuine `cost.cacheRead = 0` (free cached reads) is indistinguishable from a model with no cache-read rate configured at all. Downstream, `buildStatsOutput` then prints `'Pricing: unpriced — no input/cached-read rates in the models.json cost block'` (4386-4390) instead of the real $0 cost and real savings figure. This is a plain `<=0` vs `<0`/`=== undefined` defect with a small fix and a direct hit on the extension's core value proposition (proving savings). I reach the same conclusion as the standing list here — no disagreement.

### #2 — "Stable" prefix promotion is asserted per-call, confirmed only after the fact (= backlog F2, P0)

`buildStableCandidates` (691-732) classifies content as cache-prefix material by static heuristic alone — a file-path allowlist (`isStableContextFilePath`), a fixed tool list, prompt guidelines, skills text — recomputed fresh on every call, with no reference to what was actually sent last turn.

`optimizeSystemPrompt` (837-928) then unconditionally lifts every uniquely-occurring match to the front of the prompt in that same call (874-882). There is no gate requiring the content to have been observed unchanged across turns before promoting it.

The only cross-turn signal that exists is `detectStablePrefixChurn` (4159-4161), whose own docstring says: *"Counting and reporting only — it never changes behavior."* It feeds `stats.prefixChurnCount`, surfaced only as `Prefix churn: N` in the stats output (4392) — telemetry generated **after** the reorder has already shipped to the provider, not a precondition for it. If a file matching the stable-path allowlist is actually being edited turn-to-turn in a session, the optimizer keeps re-promoting it every turn and only ever tells you about the mistake retroactively. Same conclusion as the standing list — no disagreement, and I'd keep it P0 for the same reason: this path touches every single request, not an edge case.

### #3 — Diverges from the standing list: F1 and F4 should be read as one gap, and F1-as-implemented is narrower than its title

The standing list ranks F1 ("separate reported miss from unavailable cache signal") above F4 ("explicit provider capability gates") as a second P0. My read says it's the other way around — F4 is the real gap, and F1's actual code only catches a rare corner of it.

- `CacheCompat` (246-263) carries ~13 capability flags (`supportsStore`, `supportsPromptCacheKey`, `supportsLongCacheRetention`, …) but **none** for "this model/provider ever reports cache-read/cache-write usage fields at all." There is no gate anywhere that excludes a structurally-cache-blind model from the hit-ratio denominator.
- The per-provider raw-usage fallbacks are explicit that an absent cache field alongside a normal token count is treated as a genuine miss, by design: comment at 2467-2477 ("Pi guarantees … at least as zero. When the cache keys are entirely absent but input is present, the response is a full miss … so it stays in the denominator"), implemented concretely in `getOpenAIRawUsage` (2541-2546) and `getAnthropicRawUsage` (2567-2571): `cacheRead === undefined` + real `input` → `{cacheRead: 0, cacheWrite: 0, totalInput: input}`, counted as an ordinary miss.
- The only "unavailable" classification that exists, `hasMissingUsageFields`/`missingFields` (4269-4293, 9483-9486), fires only when the usage record is fully absent or literally all three fields are zero (`usage === undefined || (cacheRead===0 && cacheWrite===0 && totalInput===0)`, 9483-9486). That's a rare degenerate response, not "provider that never implements cache reporting." A provider that structurally can't report cache activity but reports normal token counts sails straight through this check and is counted as an ordinary miss forever — the scenario F1's title names is not actually the case its code guards.

So: F1 as literally scoped patches a corner case that rarely fires; the change that would actually close the "unavailable signal" gap is a capability flag on `CacheCompat` (F4) that lets the code exclude or separately label cache-incapable models instead of quietly diluting their hit ratio. I'd merge these into one #3 item and frame the fix as "add the capability gate," not "special-case more zero-usage shapes." This is a re-framing, not a full reversal — the earlier iterations may simply have split one gap into two backlog entries; I'm flagging that the fix belongs on the F4 side.

### F7 (retry guard) — independently checked, agree with backlog's own P2/caution framing

`recordToolOutcome` (7737-7801) already separates `repeatLevel` (signature-repeat) from `streakLevel` (turn-streak) escalation, with an inline comment (7760-7765) documenting a *prior* bug where collapsing them via `max()` mis-attributed unrelated failures as "the same request re-billed" — and stating that bug is fixed. Nothing I read contradicts that. This reads as already-hardened logic, not a live defect, consistent with the backlog's own P2 "verify before tuning" (rather than "fix") framing. I did not find grounds to elevate it.
