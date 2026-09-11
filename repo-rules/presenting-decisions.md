---
title: "Rule: Presenting decisions"
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
  - "restate the request back"
  - "say where you are going"
  - "intended path"
  - "what to expect at each checkpoint"
  - "roadmap before the work"
  - "long stretch with no update"
  - "went quiet for twenty minutes"
  - "presenting a synthesis"
  - "handing over a file path"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: Presenting decisions

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before presenting a recommendation, a fork, a plan, or the result of a long run.
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

State the verdict first, and reach it by analysis. The order of the reply is not the
order of the thinking, and it must not become it: front-loading a conclusion in the
*writing* is a service to the reader, while front-loading one in the *reasoning* is how
you stop noticing the evidence against it.

If you cannot state the verdict yet, say that, a named uncertainty is a verdict about
the state of the evidence, and it beats a confident sentence you would have to retract.

The failure this prevents: two of them. A reply the reader must finish before learning
what you think, and a conclusion that got picked early and defended afterwards.

---

## 2. RECOMMEND ONE APPROACH

**Recommend one.** Name its main trade-off. Mention an alternative only when it could
change the decision, a survey of options the reader will not take is work handed back
rather than done.

**Separate required from optional.** Mark must-do work distinctly from nice-to-have. A
reader who cannot tell them apart does all of it or none of it.

**Name the failure a best practice prevents.** Never cite a best practice, guardrail, or
extra layer without stating the specific bug, cost, or user problem it avoids. "It's
best practice" is an appeal to authority with the authority left out, and it is how
unnecessary work enters a plan unchallenged, [`prevent-overengineering.md`](prevent-overengineering.md)
is the rule that stops it being built.

**State assumptions when evidence is missing.** A visible assumption can be corrected by
the reader. A silent one cannot, and it will be discovered as a defect later.

---

## 3. ASK THEN DO

For a complex or ambiguous request, preface the answer:

1. **ASK:** restate the request in your own words. A paraphrase back, not a question
   back: it proves you understood, and it surfaces a misreading before the work, not after.
2. **DO:** state your approach in three to seven bullets.
3. **THEN:** ask only the one or two clarifying questions that would change the
   approach. Consolidate them into a single prompt, per `AGENTS.md` §2, and escalate
   rather than guess, per `AGENTS.md` §7.

A question that would not change what you do is not a clarifying question, it is a delay.

---

## 4. SAY WHERE YOU ARE GOING BEFORE A LONG STRETCH

Section 3 fires once, on an ambiguous request. This one fires on length. Before a stretch
of work the reader cannot see inside, post the intended path: a short numbered list of
what you will do, and what they should expect at each checkpoint.

**Clipped means not narrating each step. It never means starting without saying where you
are going.** Those are different obligations and `AGENTS.md` §3 holds both.

Update the path when it changes. A roadmap nobody revised is worse than none, because the
reader is now tracking a plan you abandoned.

The failure this prevents: twenty minutes of silence, then a result the reader has to
reverse-engineer a plan from in order to judge.

---

## 5. A SYNTHESIS IS NOT A FILE PATH

When a long run produces findings, the findings go in the message. The artifact path goes
in the message too, after them, so the reader can go deeper.

Handing over a path and a count is not a report. It moves the work of reading three
hundred lines onto the person who asked you to do it.

What belongs in the message: the answer, the few findings that carry it, the uncertainty
that matters, and what was ruled out. What does not: per-iteration narration, internal
metrics, and the full evidence chain.

**Where the run has its own contract for this, that contract wins.** The deep-loop modes
each specify what their completion message carries, because what a benchmark reports and
what a review reports are different things. This section is the floor for everything with
no such contract.

---

## 6. WHAT THIS RULE IS NOT

- **Not licence to skip the analysis.** Verdict first is an ordering of the writing, never
  a shortcut in the reasoning. Section 1 exists because the two get confused.
- **Not a mandate to ask.** Section 3's third step is capped at one or two questions that
  would change the approach, and `AGENTS.md` §3 refuses "should I continue?" for a step
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
