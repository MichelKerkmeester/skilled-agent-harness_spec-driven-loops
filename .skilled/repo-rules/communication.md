---
title: "Rule: Communication"
description: "Write so the reader can act after one pass: no table in a reply, nothing that does not carry information."
trigger_phrases:
  - "cut filler"
  - "empty opener"
  - "match length to the question"
  - "no tables"
  - "can you say that more plainly"
  - "I don't follow"
  - "too abstract"
  - "number the steps"
  - "item cap"
  - "reply too long"
  - "say each fact once"
  - "one idea per sentence"
  - "plain words"
  - "em dash"
  - "reads like terminal output"
  - "concise is not compressed"
  - "recommend one option"
  - "buried the verdict"
  - "say where you are going"
  - "time estimate"
importance_tier: important
contextType: reference
version: 1.5.0.0
---

# Rule: Communication

> Routed from [`REPO RULES.md`](../../REPO%20RULES.md). Load before writing any substantive reply.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to write any substantive reply, an answer, an explanation, a close-out, a status.
- Drafting or editing a sentence a reader will read.
- About to present a recommendation, a fork, or a trade-off.
- About to start a multi-step stretch of work the reader will not see inside.
- About to report what a long autonomous run found.
- The reader says they did not follow or asks for a plainer version.

## The rule

**Write so the reader can act after one pass: the answer first, and nothing in the reply
that does not carry information.**

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

**Choose by reader impact before you write.** Decide who will read this and what they already hold. Keep what the reader would notice, act on or
decide differently because of. Merge the items that have the same effect for them. How the
work was done stays out unless it changes how far the reader can trust the result.

**Concise is not compressed.** Concise cuts what the reader does not need and stops. Compressed cuts further and takes the connective tissue with it: the because, the second half of a contrast, the noun that a later "this" points back to. After a cut, check the joints. Every cut this file asks for answers to that floor.

The failure this prevents: the answer is in there, and they did not find it, under a
record of the work they never needed. Or the cut went too far, and the reader rebuilds the
argument the reply no longer states.

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
- **Vague warnings:** "be careful with this", "this can be tricky", naming no failure. A caveat earns its place by naming a failure that can happen here.
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

## 4. THE ANSWER FIRST

**The first line carries the payload.** The answer, the verdict or the action, in the
first sentence, not a label for it. Test: read the first line on its own. If it told you the outcome, it did its job. Four habits break it: announcing ("I will now
check the tests"), labelling ("Overview:"), the fragment opener ("Context.") and the set-up
that promises the good part in a moment.

**The rest of the outcome follows at once.** What the work concluded, what changed and what
to do next are in the reader's hands by the second line. The receipts come after that, and
the handback comes last, per [`communication-handoff.md`](communication-handoff.md) §1.
End when the answer is done. The closing-deletion test: a last line that only asks whether
anything else is needed, or recaps what the reply just said, deletes.

**Reach the verdict by analysis, then put it first.** The order of the reply is not the order of the thinking. If you cannot state the verdict yet, say that. A named uncertainty is a verdict about the state of the evidence.

**Recommend one path.** Name its main trade-off, and mention an alternative only when it could change the decision. Mark must-do work apart from nice-to-have. State an assumption you made where evidence was missing, because the reader can correct a visible assumption and cannot correct a silent one.

**An ambiguous request still gets the answer first.** When two readings lead to different answers, answer the likelier one and say in one line which reading you took. When they lead to materially different work, ask before starting it, per [`uncertainty-and-honesty.md`](uncertainty-and-honesty.md) §1. When you deliver a different version of the ask, the first lines say what changed and why.

The failure this prevents: a payload that waits behind an announcement or a label, a survey
of options where one recommendation was owed, a swapped or misread request nobody catches,
or a last line that is a farewell and adds nothing.

---

## 5. HOW THE REPLY MOVES

**Each paragraph stands alone and carries the reader forward.** A reader who lands mid-reply can act on the paragraph in front of them, and each one picks up where the last one landed: what changed, what it implies, what comes next.

**Number the steps when there is more than one.** Anything the reader must run, check or
answer gets its own number, one step per line, the number at the start of the line. Numbers
bracketed inside a sentence, (1) then (2) then (3), are a paragraph wearing numbers.

**No group shows more than five items.** Split a longer set into labelled groups of five or
fewer, or show the five that matter most and say in one line how many are held back, "the
first five of nine". The rest is retained, not discarded, and appears when the reader asks.

**Suppress the tangent.** The reply answers the question it was asked. A second issue worth
raising gets offered once, at the end, in one line. The reader decides whether it happens.

The failure this prevents: the reader assembles the order themselves, loses track of which
step they have done, mistakes a shortened list for the complete one, or waits for the
answer behind a second issue.

---

## 6. SENTENCES AND WORDS

**One idea per sentence.** Short and declarative. When a sentence stacks clauses, split it. Vary the rhythm, and prefer prose when a list would fragment a single argument.

**State the relation between sentences.** A sentence says how it attaches to the one before: because, but, therefore, for example. When it explains how something works, it names the moving parts: what acts, what it acts on, what changes.

**Plain words by default.** Reserve exact names for the things that have them: languages, frameworks, APIs, dependencies, commands. Introduce unavoidable jargon one term at a time, in a sentence that defines it by use.

**No terse machine register.** Replace arrows and symbols standing in for verbs with action words. For stacked noun phrases, say who does what, using the [HVR nominalization guidance](../skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md#nominalization-and-stacked-compression). Explain each ID, abbreviation or status code in plain words, and say what a bare count or label measures. Turn fragments into complete sentences.

**Name an identifier only where the reader acts on it.** A path, hash, flag or ID earns its place when the reader will run, open or check it. Elsewhere, say what the thing is. Keep to one or two numbers a sentence, and when the numbers are the point, give each its own sentence or bullet.

The failure this prevents: a technically correct reply the reader has to decode, where
they supply a link the writer never stated and cannot find the few names and figures they
need.

---

## 7. PUNCTUATION THE READER TRIPS ON

- **Never use an em dash.** Use a comma, a full stop or a colon, whichever the sentence wanted.
- **No semicolon.** Two sentences, or a conjunction.
- **No serial comma.** Drop it before the `and` or `or` that closes a list.

The failure this prevents: dashes read as authored voice to a human and as a tell to a
reader who has seen a lot of generated text.

The full standard is the Human Voice Rules, which `sk-doc` routes to. Load all of it when writing a document. A reply takes its voice half, the directives, vocabulary lists and tell lists, and leaves its document-structure half.

---

## 8. LONG STRETCHES AND WHAT THEY FOUND

**Say where you are going before a long stretch.** Before work the reader cannot see inside, post the intended path: a short numbered list of what you will do and what to expect at each checkpoint. Update it when it changes. Clipped means not narrating each step. It never means starting without saying where you are going.

**Attach a concrete time estimate when the stretch is long.** Minutes or hours, based on a named earlier run, or marked as an assumption. An estimate informs and never gates. Outside that case, do not open a task with one nobody asked for, and never use one to argue against starting. When the task is too big for one pass, name the smallest slice worth delivering, start there and say what is deferred.

**A synthesis is not a file path.** When a long run produces findings, the message carries the answer, the few findings behind it, the uncertainty that matters and what was ruled out. The artifact path follows them. Per-iteration narration and internal metrics stay out. Where a run has its own completion contract, as the deep-loop modes do, that contract wins.

The failure this prevents: twenty minutes of silence, then a result the reader has to
reverse-engineer a plan from, or a path and a count handed over in place of a report.

---

## 9. WHEN THE READER DID NOT FOLLOW

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

## 10. WHAT THIS RULE IS NOT

- **Not a constraint on rigor.** Nothing here softens a claim, a caveat, or a verification standard owned by [`evidence-and-proof.md`](evidence-and-proof.md) or [`uncertainty-and-honesty.md`](uncertainty-and-honesty.md).
- **Not a voice to perform.** When honoring a rule here would weaken the answer, keep the answer.
- **Not a license to omit.** "Match length to the question" is about the reader's need,
  never about leaving out what they have to know.
- **Not licence to skip the analysis.** Verdict first is an ordering of the writing, never
  a shortcut in the reasoning.

---

## 11. SELF-CHECK

- [ ] The first line carries the answer or the action, not a label, an announcement or a setup, and the outcome is complete by the second line.
- [ ] I reached the verdict by analysis, recommended one path with its trade-off and stated the assumptions I made.
- [ ] Where the request was ambiguous or I delivered a different version of it, the first lines say which reading I took and why.
- [ ] Each paragraph stands alone and carries the reader forward, and multi-step work reads as a numbered list.
- [ ] No group runs past five items, nothing was dropped to keep it under, and a tangent appears once at the end or not at all.
- [ ] Every sentence carries information, each fact appears once, and no runtime instruction to plan privately was copied into the reply.
- [ ] Length matches what the reader asked, no table stands in a reply, and nothing was compressed past the point where the reader has to re-expand it.
- [ ] Every sentence carries one idea in plain words and says how it attaches to the one before.
- [ ] Arrows, bare IDs, counts and fragments were turned into sentences, and every path, hash or flag is one the reader will act on.
- [ ] No em dash, no semicolon, no serial comma.
- [ ] Before a long stretch I said where I was going, with a concrete time estimate when it was long, and no estimate argued against starting.
- [ ] A synthesis I reported carries its findings, not just its path and its counts.
- [ ] When the reader did not follow, I changed modality, and a plain re-render kept every claim, number and caveat at the same strength.
