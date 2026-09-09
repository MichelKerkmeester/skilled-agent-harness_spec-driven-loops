---
title: "Does the extension pay off: the first real savings figure"
description: "A measured cost saving on a genuinely metered route, and why the same number cannot exist for the operator's daily-driver routes."
trigger_phrases:
  - "cache optimizer savings measured"
  - "does the cache extension pay off"
  - "flat price route savings"
  - "metered route cost saving"
importance_tier: "important"
contextType: "implementation"
---
# Does the extension pay off

Nothing had ever measured whether the caching saves money on real traffic: of roughly 412 recorded
requests only 3 were ever priced, because the routes in daily use carry no cost block.

## The measurement

Three turns on `opencode-go/deepseek-v4-flash-vision-exp`, a metered route whose rates come from the
bundled catalog rather than from anything configured for this test.

| | |
|---|---|
| requests priced | 3 of 3 |
| input tokens served from cache | 46,080 of 68,784 (67%) |
| actual input cost | $0.00531744 |
| the same tokens billed uncached | $0.01513248 |
| **saved** | **$0.00981504, or 64.9%** |

That is the extension's value stated in the unit that matters, on real traffic, with prices nobody
invented for the occasion.

## Why the daily-driver routes cannot produce this number

The obvious next step looked like adding cost blocks for the two gateway models in daily use. That
would have been wrong. The cli-pi reference states plainly that those routes bill flat-rate:
DeepSeek V4 Flash Vision runs "at the same effective cost since DevPass is flat-price". On a
subscription there is no per-token spend for a cached read to avoid, so any rate written against
those models would manufacture a saving that never happened — the same defect as the earlier test
fixture, wearing more plausible numbers.

**On a flat-price plan the honest metric is tokens, not dollars**, and the extension already reports
it: cached input against total input, which on those routes has been running between 50 and 94
percent. The dollar figure above is what that token ratio is worth when tokens are actually billed.

## The route that could not be used

`openrouter/deepseek/deepseek-v4-flash-vision-exp` carries catalog pricing and would have served as
a second data point, but the account returned `402: This request requires more credits`. Not a
capability gap — a balance.

## What this does and does not establish

One route, three turns, one session. It shows the priced path produces a checkable number end to
end, and it puts a real figure on a real cache ratio. It is not a claim about long-run savings
across a workload, and the 67% cache share here is lower than the 94% those gateway routes have
sustained, so this is a conservative sample rather than a favourable one.
