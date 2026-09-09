---
title: "Live provider test: what the shipped changes do against real traffic"
description: "Four live turns on two providers plus a live control, recording which of the five items were actually exercised and which remain suite-only."
trigger_phrases:
  - "cache optimizer live test"
  - "live provider verification"
  - "unmeasured requests live"
  - "pricing not exercised live"
importance_tier: "important"
contextType: "implementation"
---
# Live provider test

Four turns through Pi, where the extension actually loads: two on
`openai-codex/gpt-5.6-luna` at thinking `high`, two on
`llmgateway/deepseek-v4-flash-vision-exp`. Plus one control turn. All returned their tokens.

## What the records show

| | luna via openai-codex | deepseek via llmgateway |
|---|---|---|
| requests | +2 | +2 |
| hits | 0 | 1 |
| unmeasured | 0 | 0 |
| input tokens | +41,888 | +45,268 |
| cached input | 0 | +22,528 (~50%) |
| pricedRequests | 2 | 0 |
| cost | $0.0083776, baseline identical | unpriced |

## Proven live

**The migration.** The record on disk was written before this work and carried no
`unmeasuredRequests` field. It loaded, defaulted the field to `0`, and kept its existing counters —
deepseek's 14 prior requests survived into 16. This is the one acceptance criterion that had only
unit evidence and now has real evidence.

**The classification does not fire spuriously.** Both providers report cache fields, so both
recorded `unmeasured: 0`. A change that made unmeasured too eager would have shown up here as
requests vanishing from the ratio, and none did.

**Cache reads are real on the gateway route.** Roughly half of deepseek's input tokens were served
from cache in two turns, with one hit of two.

## NOT proven live, and why

**The pricing predicate.** Luna priced, but a control turn run with the pre-change `<= 0` comparison
priced too, incrementing `pricedRequests` from 2 to 3. Luna's cost block carries a positive
cached-read rate, so it would always have priced; luna also cached nothing, so the cached-read rate
never entered the arithmetic. Validating that change live needs a model whose cost block states an
explicit zero cached-read rate AND that produces cached reads. No configured model does both:
the gateway routes that cache have no cost block at all.

**Cross-turn prefix authorization.** Each `pi -p` invocation is its own session, so authorization
never accumulates across them. Observing it needs a multi-turn session, not repeated one-shots.

**The capability flag and the persisted rejection.** Neither was reachable: no configured model
declares the flag, and no provider returned the 400 that teaches a rejection.

## The honest summary

Two of five items have live evidence. The measurement change behaves correctly on real traffic and
the migration works on a real pre-change record. The other three remain suite-only, and the reason
is availability of the triggering condition rather than any doubt about the code.
