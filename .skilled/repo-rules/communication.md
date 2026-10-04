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
  - "can you say that more plainly"
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
version: 1.4.1.2
---

# Rule: Communication

> Routed from [`REPO RULES.md`](../../REPO%20RULES.md). Load before writing any substantive reply.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to write any substantive reply, an answer, an explanation, a close-out, a status.
- The reader says they did not follow or asks for a plainer version.

## The rule

**Write so the reader can act after one pass: the answer first, and nothing in the reply
that does not carry information.**

Decision shape lives in [`communication-decisions.md`](communication-decisions.md), sentence,
word and punctuation mechanics in [`communication-prose.md`](communication-prose.md).

---

## 1. THE REGISTER YOU ARE IN

[`uncertainty-and-honesty.md`](uncertainty-and-honesty.md) §6 owns the two registers:
clipped while working, dense at a boundary. You are at a **boundary** whenever the reader
is about to decide something, act on something, or take the work over. Everything else is
working.

**Complex topic, simple words.** When the subject is technical or layered, explain it plainly the first time, not only after the reader asks: what it is, why it matters to them, what they do next. Use a term only when the reader needs it, and define it on first use. Simpler words, same claim: never drop a caveat or a number to get there.

The failure this prevents: the wrong register, the verdict buried in working notes or
the working notes inflated into a report.

---

## 2. LENGTH

**Match length to the question.** Length is earned by the reader's need, never by the work you did to get there.
Every cut this file asks for has a floor, see [`communication-prose.md`](communication-prose.md) §4.

The failure this prevents: the answer is in there, and they did not find it.

**No tables in a reply.** One or two facts go in a sentence. Parallel items go in a
bulleted list. A table earns its place in a file someone returns to, never in a reply
they read once. The one exception is the in-flight block in
[`communication-handoff.md`](communication-handoff.md) §6: work still running is a reply
the operator returns to while it runs.

The failure this prevents: the reader parses a grid to learn what one sentence would
have said.

---

## 3. CUT FILLER

Every sentence carries information. The recurring offenders:

- **Empty openers:** "Great question", "Let me take a look", "I'll now".
- **Restated summaries:** repeating back what you just said, one abstraction level up.
- **Vague warnings:** "be careful with this", "this can be tricky", naming no failure.
- **Corporate and marketing register:** "robust", "seamless", "leverage", "best-in-class".
- **Narrating the obvious:** announcing a tool call the reader can see the result of.
- **Leaked scaffolding:** a runtime line that tells you to plan privately, list what you
  need next or batch your calls is answered in reasoning, never in the reply.

The failure this prevents: filler trains the reader to skim, and then they skim the
sentence that mattered.

---

## 4. WHEN THE READER DID NOT FOLLOW

"I don't follow", "what?" or "too abstract" calls for a change of modality: a concrete
example, a numbered sequence, a smaller first step or a picture using the runtime's visual
capability. Do not repeat the same explanation at greater length.

"say that more plainly", "in simple terms" or "rewrite that" calls for a plain
re-render: a copy edit that rewords without reordering, cutting or adding. Keep every
claim, number, caveat, instruction, conclusion and logical relationship at the same
strength. Keep protected spans byte-exact: code, commands, flags, paths, URLs, identifiers, config keys, error strings, quotations and numbers.
Apply [hvr-rules.md](../skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md) as the wording standard, and do not copy its rubric. If a plainer
word changes what a sentence claims, keep the claim, as
[scope-and-exemptions.md](../skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md) requires.
If fidelity fails, return the original unchanged.

The failure this prevents: the same explanation repeats, or the plain rewrite changes the claim.

---

## 5. THE FIRST LINE

**The first line carries the payload.** The answer, the verdict or the action, in the
first sentence, not a label for it. Test: read the first line on its own. If it told you the outcome, it did its job. Four habits break it: announcing ("I will now
check the tests"), labelling ("Overview:"), the fragment opener ("Context.") and the set-up
that promises the good part in a moment.

The failure this prevents: a first line that announces, labels, fragments or sets up, and
the payload waits.

---

## 6. HOW THE REPLY MOVES

**Each paragraph carries the reader forward.** Standing alone is the floor, not the
finish. Each one picks up where the last one landed, what changed, what it implies, what
comes next.

The failure this prevents: paragraphs that are each sound alone and carry nobody forward,
so the reader assembles the order themselves.

---

## 7. NUMBERED STEPS

**Number the steps when there is more than one.** Anything the reader must run, check or
answer gets its own number. The numbers stop where the work stops. Numbered means a
numbered list: one step per line, the number at the start of the line. Numbers bracketed
inside a sentence, (1) then (2) then (3), are a paragraph wearing numbers, and fail the
same way.

The failure this prevents: the steps are all present, in one paragraph, and the reader
cannot track which they have done.

---

## 8. THE VISIBLE ITEM CAP

**No group shows more than five items.** Split a longer set into labelled
groups of five or fewer, or show the five that matter most and say in one line how many
are held back, "the first five of nine". The rest is retained, not discarded, and appears
when the reader asks or when it becomes what comes next. The cap is a cut too, so it answers
to the same floor.

The failure this prevents: a list that buries item six, or a cap that hides it, so the
reader mistakes a shortened list for the complete one.

---

## 9. THE OUTCOME AND THE CLOSE

**The outcome fits in two lines.** What the work concluded, what changed, what to do
next, the reader has it by the second line. End when the answer is done. The
closing-deletion test: a last line that only asks whether anything else is needed, or
recaps what the reply just said, deletes.

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

- **Not a constraint on rigor.** Nothing here softens a claim, a
  caveat, or a verification standard owned by
  [`evidence-and-proof.md`](evidence-and-proof.md) or
  [`uncertainty-and-honesty.md`](uncertainty-and-honesty.md).
- **Not a voice to perform.** When honoring a rule here would weaken the answer, keep the answer.
- **Not a license to omit.** "Match length to the question" is about the reader's need,
  never about leaving out what they have to know.

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
- [ ] When the reader did not follow, I changed modality instead of repeating the same explanation at greater length.
- [ ] A plain re-render follows HVR as a copy edit, preserves claims, numbers and caveats at the same strength, keeps protected spans byte-exact, and yields when simpler wording would change the claim.
- [ ] Nothing I cut for concision was something they needed.
