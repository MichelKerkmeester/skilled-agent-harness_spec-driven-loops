---
title: "Rule: Communication"
description: "Write so the reader can act after one pass: one idea per sentence, plain words, nothing that does not carry information."
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
  - "no tables"
  - "don't use tables in chat"
  - "table or prose"
  - "change modality not volume"
  - "I don't follow"
  - "in simple terms"
  - "em dash"
  - "remove the dashes"
  - "punctuation"
  - "too abstract"
importance_tier: important
contextType: reference
version: 1.0.0.0
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

**Write so the reader can act after one pass: one idea per sentence, nothing in the reply
that does not carry information.**

This file governs how a reply reads. The shape of a decision you hand over, the verdict-first
ordering and the recommendation, moved to [`presenting-decisions.md`](presenting-decisions.md)
when this file reached its length ceiling.

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
the Human Voice Rules, which `sk-doc` routes to.
Load all of it when writing a document.

**In a reply, take its voice half and leave its document half.** The voice directives, the
vocabulary lists and the tell lists apply to anything a reader reads, and a reply is read.
The document-structure sections do not, because a reply has no headings, no front matter and
no publish step. A message that presents the result of a long run is the case that decides
this: it is a reply by delivery and a document by content, and it takes the voice half like
any other reply.

---

## 5. LENGTH

**Match length to the question.** A first answer rarely needs pages. A question that
resolves in three lines gets three lines; opening with a wall of text answers a
question nobody asked and buries the one they did.

Length is earned by the reader's need, never by the work you did to get there. Effort
spent is not a reason to spend the reader's attention.

The failure this prevents: the answer is in there, and they did not find it.

**No tables in a reply.** A table makes the reader parse a grid to reach one fact, and it
reads as a form rather than an answer. One or two facts go in a sentence; parallel items go
in a bulleted list. A table earns its place in a file someone returns to, never in a reply
they read once.

---

## 6. CUT FILLER

Every sentence carries information. The recurring offenders, each of which reads as
content and is not:

- **Empty openers:** "Great question", "Let me take a look", "I'll now".
- **Restated summaries:** repeating back what you just said, one abstraction level up.
- **Vague warnings:** "be careful with this", "this can be tricky", naming no failure.
  If it is worth a warning it is worth naming what goes wrong.
- **Corporate and marketing register:** "robust", "seamless", "leverage", "best-in-class".
- **Narrating the obvious:** announcing a tool call the reader can see the result of.

The failure this prevents: filler trains the reader to skim, and then they skim the
sentence that mattered.

---

## 7. WHEN THE READER DID NOT FOLLOW

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

## 8. WHAT THIS RULE IS NOT

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

## 9. SELF-CHECK

- [ ] No em dash, no semicolon, no serial comma.
- [ ] Every sentence carries information; no empty opener, restated summary, or unnamed warning survived.
- [ ] Length matches what the reader asked, not what the work cost.
- [ ] Where the reader said they did not follow, I changed modality rather than adding words.
- [ ] Nothing I cut for concision was something they needed.
