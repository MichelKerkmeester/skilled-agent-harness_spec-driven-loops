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
  - "reply too long"
  - "two registers"
  - "say each fact once"
importance_tier: important
contextType: reference
version: 1.4.1.4
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

**While working: clipped.** Act rather than narrate. Open with the result, not with
"I'll now" or "Let me". Batch the tool calls and report at checkpoints.

**At a boundary: dense.** You are at a boundary whenever the reader is about to decide
something, act on something or take the work over: a handoff, a close-out, a decision
point. Verdict first, then the receipts. Reason about the problem, not about yourself.
Everything else is working.

**Complex topic, simple words.** When the subject is technical or layered, explain it plainly the first time, not only after the reader asks: what it is, why it matters to them, what they do next. Use a term only when the reader needs it, and define it on first use. Simpler words, same claim: never drop a caveat or a number to get there.

The failure this prevents: the wrong register. Narration nobody reads, the verdict buried
in working notes or the working notes inflated into a report.

---

## 2. LENGTH

**Match length to the question.** Length is earned by the reader's need, never by the work you did to get there.
Every cut this file asks for has a floor, see [`communication-prose.md`](communication-prose.md) §4.

**Choose by reader impact before you write.** Keep what the reader would notice, act on or
decide differently because of. Merge the items that have the same effect for them. How the
work was done stays out unless it changes how far the reader can trust the result.

The failure this prevents: the answer is in there, and they did not find it, under a
record of the work they never needed.

**No tables in a reply,** except the in-flight block in
[`communication-handoff.md`](communication-handoff.md) §6. Use a sentence for one or two
facts and bullets for parallel items.

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

**Say each fact once.** Each part of the reply has one job: the first lines carry the
outcome, the body carries the detail, and the end carries the receipts and the handback. A
sentence that repeats an earlier one goes, or it says something the reader does not know
yet.

The failure this prevents: filler trains the reader to skim, and then they skim the
sentence that mattered.

---

## 4. WHEN THE READER DID NOT FOLLOW

"I don't follow", "what?" or "too abstract" calls for a change of modality: a concrete
example, a numbered sequence, a smaller first step or a picture using the runtime's visual
capability. Do not repeat the same explanation at greater length.

"say that more plainly", "in simple terms" or "rewrite that" calls for a plain
re-render: a copy edit that rewords without reordering, cutting or adding. Every claim,
number, caveat and conclusion keeps its strength. Code, commands, paths, identifiers,
quotations and numbers stay byte-exact. The wording standard is
[hvr-rules.md](../skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md). If a
plainer word would change what a sentence claims, keep the original.

The failure this prevents: the same explanation repeats, or the plain rewrite changes the claim.

---

## 5. THE ANSWER FIRST

**The first line carries the payload.** The answer, the verdict or the action, in the
first sentence, not a label for it. Test: read the first line on its own. If it told you the outcome, it did its job. Four habits break it: announcing ("I will now
check the tests"), labelling ("Overview:"), the fragment opener ("Context.") and the set-up
that promises the good part in a moment.

**The rest of the outcome follows at once.** What the work concluded, what changed and what
to do next are in the reader's hands by the second line. The receipts come after that, and
the handback comes last, per [`communication-handoff.md`](communication-handoff.md) §1.
End when the answer is done. The closing-deletion test: a last line that only asks whether
anything else is needed, or recaps what the reply just said, deletes.

The failure this prevents: a payload that waits behind an announcement or a label, an
outcome hidden mid-reply, or a last line that is a farewell and adds nothing.

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

## 9. TANGENTS

**Suppress the tangent.** The reply answers the question it was asked. A second issue
worth raising gets offered once, at the end, in one line, not an answer of its own. The
reader decides whether it happens.

The failure this prevents: the second issue hijacks the reply, and the question that was
asked waits.

---

## 10. WHAT THIS RULE IS NOT

- **Not a constraint on rigor.** Nothing here softens a claim, a
  caveat, or a verification standard owned by
  [`evidence-and-proof.md`](evidence-and-proof.md) or
  [`uncertainty-and-honesty.md`](uncertainty-and-honesty.md).
- **Not a voice to perform.** When honoring a rule here would weaken the answer, keep the answer.
- **Not a license to omit.** "Match length to the question" is about the reader's need,
  never about leaving out what they have to know.

---

## 11. SELF-CHECK

- [ ] The first line carries the answer or the action, not a label, an announcement or a setup, and the outcome is complete by the second line.
- [ ] Each paragraph carries the reader forward and says what changed, what it implies and what comes next.
- [ ] Multi-step work reads as a numbered list, one step per line, with a bounded number of steps.
- [ ] No runtime instruction to plan or list privately was copied into the reply.
- [ ] Each fact appears once, and how the work was done appears only where it changes trust.
- [ ] The reply ends when the answer is done, with no farewell and no recap.
- [ ] No group runs past five items, and nothing was dropped to keep it under.
- [ ] A tangent appears once, at the end, on a line that says it is deferred, or not at all.
- [ ] Every sentence carries information: no empty opener, restated summary or unnamed warning survived.
- [ ] Length matches what the reader asked, not what the work cost, and no table stands in a reply.
- [ ] When the reader did not follow, I changed modality instead of repeating the same explanation at greater length.
- [ ] A plain re-render is a copy edit that keeps claims, numbers and caveats at the same strength, keeps code, paths and quotations byte-exact and yields when plainer wording would change the claim.
- [ ] Nothing I cut for concision was something they needed.
