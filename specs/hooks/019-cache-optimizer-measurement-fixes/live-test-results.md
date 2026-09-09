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

Live turns through Pi, where the extension actually loads, across two providers, plus a control run
for every item and an enabled-versus-disabled quality comparison.

## Evidence status

| Item | Status | What established it |
|------|--------|---------------------|
| W1 unreported is not a miss | **Proven** | Migration ran on a real pre-change record; classification did not misfire on providers that do report |
| W2 explicit zero prices | **Proven** | Fixture plus a control that fails without the change |
| W3 capability flag | **Proven** | Declaring model routed to unmeasured |
| W4 cross-turn stability | **Proven, directional on effect** | Exercised in-process over multi-turn tool work; cache share measured with the gate on and off |
| W5 persisted rejection | **Partial** | Round-trip across a process boundary proven; learning from a real 400 was never reachable |
| Quality | **No degradation found** | 18 of 18 correct in both conditions |

## W1 — proven

The record on disk predated this work and carried no `unmeasuredRequests` field. It loaded,
defaulted to `0`, and kept its counters: deepseek's 14 prior requests survived into 16. Both live
providers report cache fields, so both recorded `unmeasured: 0` — an over-eager classifier would
have shown up right here as requests disappearing from the ratio.

## W2 — proven, with a control

No configured model both states a zero cached-read rate and produces cached reads, so one was
configured: a cost block with `input: 0.27` and `cacheRead: 0` on the gateway DeepSeek route, which
caches around half its input.

| | result |
|---|---|
| `pricedRequests` | 0 → 1 |
| actual input cost | $0.0000265 |
| uncached baseline | $0.0061090 |
| implied saving | 99.6% |

**Control:** the same fixture with the pre-change `<= 0` comparison recorded the request but left
`pricedRequests` at 1 — the zero rate was rejected as unpriced, which is the defect. The fixture was
removed afterwards and the configuration restored.

## W3 — proven

A model declaring `reportsCacheUsage: false` moved `unmeasuredRequests` from 0 to 1 on its next
request. That model normally reports cache fields — it carries 335 prior hits — so without the
declaration the request would have been counted as a hit or a miss rather than set aside.

## W4 — proven in-process, effect measured

Authorization state is process-scoped, so repeated one-shot invocations can never exercise it. Three
tool-driven tasks produced seven provider requests inside single processes, which does.

| | requests | input tokens | cached | share |
|---|---:|---:|---:|---:|
| gate on | 7 | 162,051 | 159,744 | **98.6%** |
| gate neutralised | 9 | 208,596 | 162,688 | 78.0% |

The direction matches the design intent, but this is one run per condition with differing turn
counts, so treat the gap as directional rather than as a measured 20-point gain.

## W5 — partial, and the control was inconclusive

A seeded rejection survived a fresh process and a real turn, so the record round-trips. The control
did **not** isolate the change: removing the in-memory contribution still left the entry, because
the writer merges what is already on disk. So what is proven is the round-trip, not that a newly
learned rejection is persisted — that needs a provider that actually rejects the key with a 400, and
none did.

## Quality — no degradation found

Nine tasks with objectively checkable answers, each run with the extension loaded and unloaded, on a
model that genuinely caches so the extension was doing real work.

- Six factual and format-constrained tasks: 6 of 6 correct in both conditions.
- Three tool-driven tasks requiring the model to read files and compare them: 3 of 3 in both.

**18 of 18 correct in both conditions.** The tool-driven half matters more than the factual half:
the extension reorders system-prompt content — tool lists, guidelines, skills text — so tool-driven
work is the surface where reordering would show up, and simple recall barely touches it.

This is evidence of no degradation at this scale, not proof of none. Nine tasks on one model cannot
detect a small regression, and nothing here probes long conversations, where a lifted prefix has
more turns in which to diverge.
