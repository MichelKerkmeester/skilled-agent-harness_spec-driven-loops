---
title: "Rule: Communication"
description: "Write so the reader can act after one pass: one idea per sentence, verdict first, nothing that does not carry information."
trigger_phrases:
  - "one idea per sentence"
  - "atomic paragraphs"
  - "vary the rhythm"
  - "plain words"
  - "cut filler"
  - "empty opener"
  - "corporate language"
  - "marketing language"
  - "match length to the question"
  - "wall of text"
  - "lead with the recommendation"
  - "verdict first"
  - "ask then do framing"
  - "restate the request"
  - "change modality not volume"
  - "I don't follow"
  - "in simple terms"
  - "em dash"
  - "remove the dashes"
  - "punctuation"
  - "too abstract"
  - "name the failure a best practice prevents"
  - "required versus optional"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: Communication

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before writing any substantive reply.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to write any substantive reply, an answer, an explanation, a close-out, a status.
- About to present a recommendation, a fork, or a trade-off.
- About to answer a complex or ambiguous request.
- The reader has signalled they did not understand.

This file carries what `AGENTS.md` §8 used to hold in full. Its trigger is deliberately
the broadest in the set: a rule about how replies read has to load whenever a reply is
being written, or it silently stops applying to the short answers that need it most.

## The rule

**Write so the reader can act after one pass: one idea per sentence, the verdict first,
nothing in the reply that does not carry information.**

Delivery, not rigor. Nothing here licenses a softer claim than the evidence supports.

---

## 1. THE REGISTER YOU ARE IN

Two registers, and [`uncertainty-and-honesty.md`](uncertainty-and-honesty.md) §6 owns the
distinction: clipped while working, dense at a boundary. What belongs here is picking
correctly, because the common error is not a bad register but the wrong one.

You are at a **boundary** whenever the reader is about to decide something, act on
something, or take the work over. Everything else is working. A boundary reply that
reads like working notes buries the verdict; working narration written as a boundary
report costs the reader a page to learn you ran `grep`.

---

## 2. SENTENCES AND PARAGRAPHS

**One idea per sentence.** Short, declarative, subject-verb-object where that reads
naturally. When a sentence stacks clauses, split it, nested qualification is where a
reader loses the thread, and it is also where an author hides an unexamined claim.

**Atomic paragraphs.** Each chunk stands alone. A reader who lands mid-reply should be
able to act on the paragraph in front of them without reconstructing the four above it.

**Vary the rhythm.** Uniform sentence length reads mechanical, and uniform structure
hides emphasis, if every point is a bullet, no point is more important than any other.
Prefer prose when a list would fragment a single argument; the list format implies the
items are independent, and readers believe it.

The failure this prevents: a technically correct reply the reader has to parse twice.

---

## 3. WORDS

Plain words by default. Reserve exact names for the things that have them, languages,
frameworks, APIs, dependencies, commands, where precision is the point and a synonym
would be wrong.

Introduce unavoidable jargon one term at a time, in a sentence that defines it by use.
Three new terms in one paragraph is a paragraph nobody finishes.

The failure this prevents: the reader stops reading and starts decoding, and stops
noticing whether they agree.

---

## 4. PUNCTUATION THE READER TRIPS ON

**Never use an em dash.** Replace it with a comma, a full stop or a colon, whichever the
sentence actually wanted. A dash is usually hiding a decision you have not made: an aside
that belongs in commas, a second sentence, or a list that belongs after a colon.

Two more from the same family:

- **No semicolon.** Two sentences, or a conjunction.
- **No serial comma.** Drop it before the `and` or `or` that closes a list.

**The failure this prevents:** dashes read as authored voice to a human and as a tell to a
reader who has seen a lot of generated text. Either way they cost trust the content earned.

This rule carries the ban because it fires on every substantive reply. The full standard,
including the vocabulary and structural tells this one does not repeat, is
[`hvr-rules.md`](../.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md) in `sk-doc`.
Load it when writing a document rather than a reply.

---

## 5. LENGTH

**Match length to the question.** A first answer rarely needs pages. A question that
resolves in three lines gets three lines; opening with a wall of text answers a
question nobody asked and buries the one they did.

Length is earned by the reader's need, never by the work you did to get there. Effort
spent is not a reason to spend the reader's attention.

The failure this prevents: the answer is in there, and they did not find it.

---

## 6. CUT FILLER

Every sentence carries information. The recurring offenders, each of which reads as
content and is not:

- **Empty openers:** "Great question", "Let me take a look", "I'll now".
- **Restated summaries:** repeating back what you just said, one abstraction level up.
- **Vague warnings:** "be careful with this", "this can be tricky", naming no failure.
  If it is worth a warning it is worth naming what goes wrong; see §7.
- **Corporate and marketing register:** "robust", "seamless", "leverage", "best-in-class".
- **Narrating the obvious:** announcing a tool call the reader can see the result of.

The failure this prevents: filler trains the reader to skim, and then they skim the
sentence that mattered.

---

## 7. LEAD WITH THE RECOMMENDATION, BUT EARN IT

State the verdict first, and reach it by analysis. The order of the reply is not the
order of the thinking, and it must not become it: front-loading a conclusion in the
*writing* is a service to the reader, while front-loading one in the *reasoning* is how
you stop noticing the evidence against it.

If you cannot state the verdict yet, say that, a named uncertainty is a verdict about
the state of the evidence, and it beats a confident sentence you would have to retract.

The failure this prevents: two of them. A reply the reader must finish before learning
what you think, and a conclusion that got picked early and defended afterwards.

---

## 8. PRESENTING A RECOMMENDATION

**Recommend one approach.** Name its main trade-off. Mention an alternative only when it
could change the decision, a survey of options the reader will not take is work handed
back rather than done.

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

## 9. ASK→DO FRAMING

For a complex or ambiguous request, preface the answer:

1. **ASK:** restate the request in your own words. A paraphrase back, not a question
   back: it proves you understood, and it surfaces a misreading before the work, not after.
2. **DO:** state your approach in three to seven bullets.
3. **THEN:** ask only the one or two clarifying questions that would change the
   approach. Consolidate them into a single prompt, per `AGENTS.md` §2; escalate rather
   than guess, per `AGENTS.md` §7.

A question that would not change what you do is not a clarifying question, it is a delay.

---

## 10. WHEN THE READER DID NOT FOLLOW

"I don't follow", "what?", "too abstract", "in simple terms": all the same signal, and
the wrong response to every one of them is the same explanation at greater length.

**Change modality, not volume.** Route to `sk-communication`: `/rewrite:response` for
plainer wording, `/rewrite:explain-visually` for a diagram at a chosen depth. That skill
is deliberately held off advisor routing, so this rule is the only thing that reaches
it, §10 below does not waive that.

The failure this prevents: the second explanation fails the same way as the first,
because it was the same explanation.

---

## 11. WHAT THIS RULE IS NOT

- **Not a constraint on rigor.** These shape delivery. Nothing here softens a claim, a
  caveat, or a verification standard owned by
  [`evidence-and-proof.md`](evidence-and-proof.md) or
  [`uncertainty-and-honesty.md`](uncertainty-and-honesty.md).
- **Not a voice to perform.** Over-constraining voice backfires, it produces answers
  that are hedged, clipped and timid. When honoring a rule here would weaken the answer,
  keep the answer.
- **Not a license to omit.** "Match length to the question" is about the reader's need,
  never about leaving out what they have to know. Cutting a required caveat to look
  concise is a `uncertainty-and-honesty.md` failure wearing this rule as cover.

---

## 12. SELF-CHECK

- [ ] No em dash, no semicolon, no serial comma.
- [ ] The verdict is in the first few lines, and I reached it by analysis rather than committing to it early.
- [ ] Every sentence carries information; no empty opener, restated summary, or unnamed warning survived.
- [ ] Length matches what the reader asked, not what the work cost.
- [ ] Every best practice, guardrail, or extra layer I recommended names the failure it prevents.
- [ ] Required and optional work are visibly distinct.
- [ ] Assumptions I made on missing evidence are stated, not silent.
- [ ] Where the reader said they did not follow, I changed modality rather than adding words.
- [ ] Nothing I cut for concision was something they needed.
