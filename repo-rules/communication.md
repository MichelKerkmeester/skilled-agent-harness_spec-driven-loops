---
title: "Rule: Communication"
description: "Write so the reader can act after one pass: no table in a reply, nothing that does not carry information."
trigger_phrases:
  - "cut filler"
  - "empty opener"
  - "corporate language"
  - "marketing language"
  - "match length to the question"
  - "wall of text"
  - "no tables"
  - "don't use tables in chat"
  - "table or prose"
  - "change modality not volume"
  - "I don't follow"
  - "in simple terms"
  - "too abstract"
  - "first line"
  - "payload not label"
  - "carry the reader forward"
  - "paragraph progression"
  - "number the steps"
  - "multi-step work"
  - "item cap"
  - "cap the list"
  - "two lines"
  - "farewell closer"
  - "tangent"
  - "offer once at the end"
importance_tier: important
contextType: reference
version: 1.4.1.0
---

# Rule: Communication

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before writing any substantive reply.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to write any substantive reply, an answer, an explanation, a close-out, a status.
- The reader has signalled they did not understand.

This file carries what `AGENTS.md` §8 used to hold in full. Its trigger is deliberately
the broadest in the set: a rule about how replies read has to load whenever a reply is
being written, or it silently stops applying to the short answers that need it most.

## The rule

**Write so the reader can act after one pass: the answer first, and nothing in the reply
that does not carry information.**

This file governs how a reply reads. The shape of a decision you hand over, the verdict-first
ordering and the recommendation, moved to [`communication-decisions.md`](communication-decisions.md)
when this file reached its length ceiling. Sentence, word and punctuation mechanics live in
[`communication-prose.md`](communication-prose.md).

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

The failure this prevents: the wrong register, the verdict buried in working notes or
the working notes inflated into a report.

---

## 2. LENGTH

**Match length to the question.** A first answer rarely needs pages. A question that
resolves in three lines gets three lines; opening with a wall of text answers a
question nobody asked and buries the one they did.

Length is earned by the reader's need, never by the work you did to get there. Effort
spent is not a reason to spend the reader's attention. The cut has a floor, see
[`communication-prose.md`](communication-prose.md) §4.

The failure this prevents: the answer is in there, and they did not find it.

**No tables in a reply.** A table makes the reader parse a grid to reach one fact, and it
reads as a form rather than an answer. One or two facts go in a sentence; parallel items go
in a bulleted list. A table earns its place in a file someone returns to, never in a reply
they read once. The one exception is the in-flight block in
[`communication-handoff.md`](communication-handoff.md) §6, and it is the same test rather
than a break from it: work still running is a reply the operator returns to while it runs.

The failure this prevents: the reader parses a grid to learn what one sentence would
have said.

---

## 3. CUT FILLER

Every sentence carries information. The recurring offenders, each of which reads as
content and is not:

- **Empty openers:** "Great question", "Let me take a look", "I'll now".
- **Restated summaries:** repeating back what you just said, one abstraction level up.
- **Vague warnings:** "be careful with this", "this can be tricky", naming no failure.
  If it is worth a warning it is worth naming what goes wrong.
- **Corporate and marketing register:** "robust", "seamless", "leverage", "best-in-class".
- **Narrating the obvious:** announcing a tool call the reader can see the result of.
- **Leaked scaffolding:** a runtime line that tells you to plan privately, list what you
  need next or batch your calls is answered in reasoning, never in the reply. A reply that
  opens "Privately, what I need next" has copied its own instructions to the reader.

Cutting these stops at the joints too, same floor, see [`communication-prose.md`](communication-prose.md) §4.

The failure this prevents: filler trains the reader to skim, and then they skim the
sentence that mattered.

---

## 4. WHEN THE READER DID NOT FOLLOW

"I don't follow", "what?", "too abstract", "in simple terms": all the same signal, and
the wrong response to every one of them is the same explanation at greater length.

**Change modality, not volume.** For plainer wording, route to `sk-communication`
(`/rewrite:response`). That skill is deliberately held off advisor routing, so this rule is
the only thing that reaches it. For a diagram, use the runtime's own visual capability —
`sk-communication` carried an explanation lane until it was retired, because what it produced
was fenced source rather than a rendered picture.

The failure this prevents: the second explanation fails the same way as the first,
because it was the same explanation.

---

## 5. THE FIRST LINE

**The first line carries the payload.** The answer, the verdict or the action, in the
first sentence, not a label for it. The positive test: read the first line on its own.
If it told you the outcome, it did its job. Four habits break it. Announcing: "I will now
check the tests". Labelling: "Overview:". The fragment opener, a "Context." that means
nothing until the next line arrives. The set-up that promises the good part in a moment.

The failure this prevents: a first line that announces, labels, fragments or sets up, and
the payload waits.

---

## 6. HOW THE REPLY MOVES

**Each paragraph carries the reader forward.** Standing alone is the floor, not the
finish. A paragraph that only stops does not advance the answer: each one picks up where
the last one landed, what changed, what it implies, what comes next.

The failure this prevents: paragraphs that are each sound alone and carry nobody forward,
so the reader assembles the order themselves.

---

## 7. NUMBERED STEPS

**Number the steps when there is more than one.** Multi-step work, anything the reader
must run, check or answer, gets its own number, 1, 2, 3. The numbers stop where the work
stops. The number is the reader's bookmark: it says which step they are on and which ones
they have done. Numbered means a numbered list: one step per line, the number at the
start of the line. Numbers bracketed inside a sentence, (1) then (2) then (3), are a
paragraph wearing numbers, and fail the same way.

The failure this prevents: the steps are all present, in one paragraph, and the reader
cannot track which they have done.

---

## 8. THE VISIBLE ITEM CAP

**No group shows more than five items.** When a set runs longer, split it into labelled
groups of five or fewer, or show the five that matter most and say in one line how many
are held back, "the first five of nine". The rest is retained, not discarded, and appears
when the reader asks or when it becomes what comes next. The cap is a cut too, it answers
to the same floor, see [`communication-prose.md`](communication-prose.md) §4.

The failure this prevents: a list that buries item six, or a cap that hides it, so the
reader mistakes a shortened list for the complete one.

---

## 9. THE OUTCOME AND THE CLOSE

**The outcome fits in two lines.** What the work concluded, what changed, what to do
next, the reader has it by the second line, not buried mid-reply where the skim stops.
End when the answer is done. The closing-deletion test: a last line that only asks
whether anything else is needed, or recaps what the reply just said, deletes, and what
dies with it was a closer. Two lines hold when the joints hold, the cut answers to the
same floor, see [`communication-prose.md`](communication-prose.md) §4.

The failure this prevents: the outcome hidden mid-reply, or the last line a farewell
closer that adds nothing.

---

## 10. TANGENTS

**Suppress the tangent.** The reply answers the question it was asked. A second issue
worth raising gets offered once, at the end, in one line, not an answer of its own. The
reader decides whether it happens.

The failure this prevents: the second issue hijacks the reply, and the question that was
asked waits.

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

- [ ] The first line carries the answer or the action, not a label, an announcement or a setup.
- [ ] Each paragraph carries the reader forward and says what changed, what it implies and what comes next.
- [ ] Multi-step work reads as a numbered list, one step per line, with a bounded number of steps.
- [ ] No runtime instruction to plan or list privately was copied into the reply.
- [ ] The outcome sits in the first two lines, and nothing after them is a farewell.
- [ ] No group runs past five items, and nothing was dropped to keep it under.
- [ ] A tangent appears once, at the end, on a line that says it is deferred, or not at all.
- [ ] Every sentence carries information: no empty opener, restated summary or unnamed warning survived.
- [ ] Length matches what the reader asked, not what the work cost, and no table stands in a reply.
- [ ] Where the reader said they did not follow, I changed modality rather than adding words.
- [ ] Nothing I cut for concision was something they needed.
