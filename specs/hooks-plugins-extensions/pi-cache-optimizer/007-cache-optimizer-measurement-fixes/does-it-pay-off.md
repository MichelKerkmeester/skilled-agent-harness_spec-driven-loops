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

Yes, and by a wide margin on the route in heaviest use. Corrected after the operator pointed out
that the gateway bills per token, which a reference document had wrongly recorded as a flat-price
subscription.

## The numbers, on the routes actually in daily use

Rates come from the gateway's own `/v1/models` endpoint, not from a guess or a fixture: DeepSeek
V4 Flash Vision at $0.14 per million prompt tokens with cached reads at $0.0028, GLM-5.3-Flash at
$0.088 with cached reads at $0.025. Those are normal API list rates; the plan buys credits at a 3x
bonus, so real out-of-pocket is a third of the billed figure.

| | deepseek-v4-flash-vision-exp | glm-5.3-flash |
|---|---|---|
| requests, all priced | 7 | 6 |
| input tokens | 172,000 | 140,317 |
| served from cache | 169,728 (98.7%) | 95,296 (67.9%) |
| billed | $0.000793 | $0.006344 |
| the same tokens uncached | $0.024080 | $0.012348 |
| **saved** | **96.7%** | **48.6%** |

## The finding worth keeping

**A cache hit is worth wildly different amounts depending on the provider's cached-read discount.**
DeepSeek charges 2% of the prompt rate for a cached read, so a 98.7% hit rate converts almost
directly into a 96.7% saving. GLM charges 28%, so a 67.9% hit rate yields only 48.6%. The same
optimisation, the same extension, roughly half the value — decided entirely by the rate card.

That reframes what the hit-rate number in the footer means. It is an input to the saving, not the
saving itself, and on a provider with a shallow cache discount a high hit rate is worth much less
than it looks.

## What was wrong before, and why it mattered

The cli-pi reference stated DevPass was flat-price, so an earlier version of this document argued no
dollar figure could exist for these routes and that tokens were the only honest metric. That was
wrong at the root: the routes are metered, the gateway publishes its rates, and the figures above
are ordinary measurements. The reference has been corrected in the same change.

The instinct that produced the error was still right — refusing to invent a rate. The fix was to
find the real one rather than to give up on the question.

## Limits

Thirteen requests across two models in one sitting, on prompts that share a large stable prefix,
which is the workload the extension is built for and therefore a favourable one. It shows the priced
path produces checkable numbers end to end and puts a real figure on a real cache ratio; it is not a
long-run average across mixed work.
