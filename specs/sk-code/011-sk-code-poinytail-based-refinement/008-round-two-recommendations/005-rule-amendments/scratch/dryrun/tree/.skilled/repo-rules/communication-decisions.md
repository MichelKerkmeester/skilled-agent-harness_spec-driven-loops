---
title: "Rule: Communication decisions"
description: "When the reader has to decide or act on what you found, lead with the verdict, recommend one path, and say where you are going before a long stretch of work."
trigger_phrases:
  - "which option should i pick"
  - "here are the trade-offs"
  - "survey of options"
  - "i listed every alternative"
  - "buried the verdict"
  - "the conclusion is at the bottom"
  - "picked the answer early"
  - "must do versus nice to have"
  - "state the assumption"
  - "which reading did you take"
  - "say where you are going"
  - "intended path"
  - "what to expect at each checkpoint"
  - "roadmap before the work"
  - "long stretch with no update"
  - "went quiet for twenty minutes"
  - "presenting a synthesis"
  - "handing over a file path"
  - "who is the reader"
  - "reader triage"
  - "what does the reader already know"
  - "time estimate"
  - "how long will this take"
  - "recommend one option"
  - "too many options"
importance_tier: important
contextType: reference
version: 1.3.0.5
---

# Rule: Communication decisions

> Routed from [`REPO RULES.md`](../../REPO%20RULES.md). Load before presenting a recommendation, a fork, a plan, or the result of a long run.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to present a recommendation, a fork, or a trade-off.
- About to answer a complex or ambiguous request.
- About to start a multi-step stretch of work the reader will not see inside.
- About to report what a long autonomous run found.
- About to list every option you considered, which is the tempting shape and usually the wrong one.

## The rule

**When the reader has to decide, put the verdict first and recommend one path.**

How the sentences read is [`communication.md`](communication.md). This file governs the
shape of the decision you are handing over.

---

## 1. LEAD WITH THE RECOMMENDATION, BUT EARN IT

Put the verdict first, the order [`communication.md`](communication.md) §5 sets for every
reply, and reach it by analysis. The order of the reply is not the
order of the thinking, and it must not become it.

If you cannot state the verdict yet, say that. A named uncertainty is a verdict about
the state of the evidence.

The failure this prevents: two of them. A reply the reader must finish before learning
what you think, and a conclusion that got picked early and defended afterwards.

---

## 2. RECOMMEND ONE APPROACH

**Recommend one.** Name its main trade-off. Mention an alternative only when it could
change the decision.

**Separate required from optional.** Mark must-do work distinctly from nice-to-have.

**Name the failure a best practice prevents.** Never cite a best practice, guardrail, or
extra layer without stating the specific bug, cost or user problem it avoids.

**State assumptions when evidence is missing.** A visible assumption can be corrected by
the reader. A silent one cannot.

---

## 3. KNOW THE READER, THEN ANSWER

**Triage the reader before you draft.** Decide who will read this and what they already
hold. Then name what they need. The gap between the two is what the reply owes. Decide
that gap, with the verdict, before the first sentence.

The failure this prevents: two of them. An accurate and complete answer pitched at a
reader nobody modeled, and a takeaway settled after the drafting, which the first
sentence misses.

**An ambiguous request still gets the answer first.** When two readings lead to different
answers, give the answer for the likelier one, then say in one line which reading you
took. When they lead to materially different work, ask before starting it, per
[`uncertainty-and-honesty.md`](uncertainty-and-honesty.md) §1. Ask only the one or two
questions that would change the approach. Consolidate them into a single prompt, per
`AGENTS.md` §2, and escalate rather than guess, per `AGENTS.md` §7.

A question that would not change what you do is not a clarifying question. It is a delay.

The failure this prevents: a reply that opens by restating the request and buries the
answer, and a misread nobody catches because the reading taken was never named.

---

## 4. SAY WHERE YOU ARE GOING BEFORE A LONG STRETCH

Before a stretch of work the reader cannot see inside, post the intended path: a short
numbered list of what you will do, and what they should expect at each checkpoint.

When the stretch is long, attach a concrete time estimate to that list. Minutes or
hours, never vague. Base it on how long a similar run took and name that run. With no
such run, say the figure is an assumption.

**Clipped means not narrating each step. It never means starting without saying where you
are going.** [`communication.md`](communication.md) §1 holds the first and this section holds the second.

Update the path when it changes.

The failure this prevents: twenty minutes of silence, then a result the reader has to
reverse-engineer a plan from in order to judge, and a duration expectation nobody
stated, which the reader meets as a surprise.

---

## 5. A SYNTHESIS IS NOT A FILE PATH

When a long run produces findings, the findings go in the message. The artifact path goes
in the message too, after them, so the reader can go deeper.

Handing over a path and a count is not a report.

What belongs in the message: the answer, the few findings that carry it, the uncertainty
that matters, and what was ruled out. What does not: per-iteration narration, internal
metrics, and the full evidence chain.

**Where the run has its own contract for this, that contract wins.** The deep-loop modes
each specify what their completion message carries. This section is the floor for everything with
no such contract.

---

## 6. WHAT THIS RULE IS NOT

- **Not licence to skip the analysis.** Verdict first is an ordering of the writing, never
  a shortcut in the reasoning.
- **Not a mandate to ask.** Section 3 caps questions at the one or two that would change
  the approach, and `AGENTS.md` §3 refuses "should I continue?" for a step
  that is already clear and in scope.
- **Not a reason to narrate.** Section 4 asks for one list before the work, not a running
  commentary during it.

---

## 7. SELF-CHECK

- [ ] The verdict is in the first few lines, and I reached it by analysis rather than committing to it early.
- [ ] I recommended one approach and named its trade-off, rather than surveying options.
- [ ] Required and optional work are visibly distinct.
- [ ] Every best practice or extra layer I recommended names the failure it prevents.
- [ ] Assumptions I made on missing evidence are stated, not silent.
- [ ] Before a long stretch, I said where I was going, and I revised it when it changed.
- [ ] A synthesis I reported carries its findings, not just its path and its counts.
- [ ] Before drafting I decided who reads this and what they hold, and the gap between that and what they need is what the reply supplies.
- [ ] A long stretch carried a concrete time estimate, in minutes or hours, based on a named earlier run or marked as an assumption.
