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

## Evidence status — corrected after review

An independent review falsified two of the claims below. They are corrected here rather than
edited away, because the original readings looked convincing and the reason they were wrong is the
useful part.

| Item | Status | Basis |
|------|--------|-------|
| W1 unreported is not a miss | **Migration proven; classification not exercised** | Real pre-change record migrated. The "did not misfire" claim was vacuous |
| W2 explicit zero prices | **Proven** | Fixture plus a control that fails without the change |
| W3 capability flag | **Proven at the stats layer** | Declaring model routed to unmeasured; the handler path is untested |
| W4 cross-turn stability | **NOT proven. Never executed** | See below |
| W5 persisted rejection | **Round-trip only** | Learning from a real 400 was never reachable |
| Quality | **Inconclusive by construction** | See below |

## W4 — the test never ran the code it was testing

`before_agent_start` is documented in Pi's own types as "Fired after user submits prompt but before
agent loop". It fires **once per prompt**, not once per provider request. Every task was a separate
one-shot `pi -p` process, so each process saw exactly one observation, never reached the second, and
lifted nothing. The "gate on" arm was reordering *off*.

The 98.6% versus 78.0% cache share therefore measured something else: the unlifted prompt was
byte-identical to prompts already warm in the provider's cache that day, while the neutralised arm
shipped different bytes and took a cold miss. The gap is warm-versus-cold prefix, and it points the
way the confound predicts.

**W4 also carries a cost the commit understated.** Turn 1 ships unlifted and turn 2 ships lifted, so
the head of the prompt changes once per session and invalidates the cached conversation at that
point. Before the change, lifting happened from turn 1 and stayed stable. The premise — that lifting
a candidate which later changes costs more than that guaranteed break — remains unmeasured.

## Quality — inconclusive, not negative

Same firing rule. No run in either arm lifted a prefix, so 18 of 18 compares near-identical bytes.
The result does not show the extension preserves quality; it shows two conditions that barely
differed produced the same answers.

A discriminating design needs: at least two user prompts per task with judging on turn 2 or later;
the shipped system prompt captured at `before_provider_request` and asserted to differ between arms;
order-sensitive tasks where a lifted instruction moves above something that qualifies it; paired
scoring over roughly thirty tasks; and a third arm that lifts from turn 1, to separate the gate from
reordering itself.

## W1 — narrower than claimed

Pi's `Usage` type requires the cache fields, so the normalized reader effectively always sees them
present and the unmeasured branch is reachable only through the raw fallbacks. "Classification did
not misfire" was true but empty. The migration evidence stands.

## W5 — a design gap the review surfaced

The learned list is monotonic: nothing deletes from it, `reset` does not clear it, and the writer
merges on-disk entries, so clearing memory cannot remove one. A single 400 from a transiently
misconfigured proxy disables key injection for that model permanently, until the state file is
edited by hand.

## Residue that was left behind, and removed

The W2 and W3 fixtures wrote fabricated numbers into cumulative stats: a priced request and a
$0.0061 baseline for the gateway DeepSeek route from an invented cost block, and an unmeasured
request for GLM from an invented flag, in both the totals and two session buckets. They were scrubbed
after the review named them. Configuration files were already restored and verified byte-identical;
this was recorded state, which the earlier cleanup check did not cover.
