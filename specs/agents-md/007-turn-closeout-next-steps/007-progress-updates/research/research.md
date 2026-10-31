---
title: "Research: Forward-Looking Progress Updates, Rule or Row?"
description: "The four decision tests run against the operator's request for numbered forward-looking progress updates, with the existing-home inventory, the AGENTS.md register tension that creates the gap, and the verdict with its deciding test."
trigger_phrases:
  - "forward looking progress update"
  - "roadmap style update"
  - "what happens at each checkpoint"
  - "say the plan before working"
  - "clipped register versus a plan"
importance_tier: "important"
contextType: "research"
---

# Research: Forward-Looking Progress Updates, Rule or Row?

**The request, verbatim:** "AI should often update user in chat with a numbered bullet list with
concise bullets in HVR regarding whats planned or what he is planning to do or whats expected at
certain thresholds, kinda like roadmap and to do style."

**Restated as a behaviour:** during multi-step work, state the intended path forward as a short
numbered list, covering what is planned, what happens next, and what the reader should expect at
each checkpoint.

**Method.** The four decision tests in
`.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md`, run in order against
the live corpus: `AGENTS.md` (518 lines), `REPO RULES.md` (107 lines), all ten files under
`repo-rules/`, the anatomy and creation contracts, and the HVR standard. Read directly from the
working tree in one session. No fan-out runner was used, on the operator's instruction, because
its write containment reverts dirty files outside the lineage directory and this checkout carries
roughly 98 dirty entries.

**Precedent read first.** Phase 001 of this packet (`AGENTS.md-row`, overridden by the operator,
producing `repo-rules/handoff-and-questions.md`) and phase 006 (`deep-loop-contracts-only`,
refused outright on the four-part test). Phase 006's research at
`006-synthesis-presentation/research/lineages/pi-deepseek/research.md` is the nearest precedent and
it refuses this proposal on the same test, for a related reason.

---

## 1. TEST ONE, ALWAYS-LOADED

**Answer: the obligation must bind on read-only turns, so it belongs in `AGENTS.md`.**

The test asks what happens on a turn where nothing fires. A yes routes the content to `AGENTS.md`
as a compressed row and refuses the rule
[decision-tests.md:32-41].

Gate 5 is the only mechanism that loads `REPO RULES.md` and the files it routes to, and its trigger
is "the FIRST write of the session, in any repository whose root holds a `REPO RULES.md`. Read-only
turns never fire it" [AGENTS.md:122]. The router states the same from its own side: "Nothing fires →
`AGENTS.md` alone governs" [REPO RULES.md:18].

Now ask which turns most need a forward-looking plan. They are long multi-step turns where the
operator watches tool calls for minutes with no statement of where the work is going. A large share
of those write nothing at all: a codebase sweep, an audit, a research pass. This packet's own
sibling recorded itself as exactly that shape, "Read-only research: no file outside this lineage
directory was written"
[006-synthesis-presentation/research/lineages/pi-deepseek/research.md:15-16]. A rule file placed
behind Gate 5 goes silent precisely on the turns the operator is describing.

**The counter-argument, and why it does not rescue the rule route.** Two rule files do reach
read-only turns today, because `AGENTS.md` §8 is always loaded and instructs the load in its own
text: "How a reply reads is governed by `repo-rules/communication.md`, and it fires on every
substantive reply ... Load it before answering" [AGENTS.md:424], and "How a reply ends is governed
by `repo-rules/handoff-and-questions.md`" [AGENTS.md:426]. So an always-loaded pointer can widen a
rule's reach past Gate 5.

That is the whole difficulty. The only way to make a rule file carry this behaviour is to write the
behaviour's trigger into the always-loaded document first. Once that sentence exists in `AGENTS.md`,
the obligation is already in `AGENTS.md`, and the file below it is carrying elaboration rather than
the rule. The doctrine records the general form of this: "A total move needs a total trigger, or the
content goes quiet" [decision-tests.md:51].

**Consequence:** test one routes the obligation to `AGENTS.md`. Whether any elaboration underneath
earns its own file is what tests three and four decide.

---

## 2. TEST TWO, SCOPE BOUNDARY

**Answer: In. No fifth widening is needed, and one must not be invented.**

The router's In list, quoted: "how to think and act, restraint, scope, evidence, risk, diagnosis,
honesty, the posture to hold when work is handed to another runtime, how the resulting reply reads,
what you may claim about wiring you have changed, and how a turn hands control back to the operator"
[REPO RULES.md:75-78].

The Out list, quoted: "skill routing, workflow selection, spec-folder mechanics, and the *mechanics*
of agent and CLI dispatch: which agent, which command, which model, which flags"
[REPO RULES.md:83-84].

A forward-looking progress update is reply content and reply shape, which "how the resulting reply
reads" admits directly [REPO RULES.md:77]. It selects no runtime, agent, command, model or flag, so
no Out clause reaches it. The trigger table already routes reply delivery on the matching row, "Write
any substantive reply" [REPO RULES.md:47].

**One route cleared before it is proposed.** A numbered list in chat needs no tool, so this proposal
names no surface and needs no widening. If the behaviour were later bound to a runtime's own task or
todo surface, that would be the fifth widening the router pre-refuses: "A fifth widening that let a
rule pick between runtimes would be the dissolution this one avoids" [REPO RULES.md:105-107]. That
route stays closed unless the operator overrides it the way the fourth was overridden.

**Consequence:** test two passes. Continue.

---

## 3. TEST THREE, THE FOUR-PART REFUSAL TEST

**Answer: fails part one, and part two is satisfied for the half that matters most.**

### Part 1, a trigger-shaped cluster

**Fails.** The condition fails when "It is a single row, not a cluster. One row is a section in an
existing rule" [decision-tests.md:89].

The request reads as three things and is one. "What is planned", "what I am about to do" and "what
to expect at thresholds" are three facets of a single message emitted at a single moment. They share
one trigger, one audience and one form. Nothing distinguishes them the way a rule's sections are
distinguished, where each section creates its own obligation.

The contrast with the packet's own tenth rule is the useful measure.
`repo-rules/handoff-and-questions.md` carries five separable obligations: the handback is a different
document from the status [handoff-and-questions.md:50-58], what counts as an operator action
[:68-81], nothing-to-do is also an answer [:84-93], the three-condition bar for a structured choice
[:96-116], and the per-runtime question surface [:120-136]. Each fires on its own and each can be
failed independently. Even that cluster was refused by these tests and exists on an operator
override, recorded in the parent spec [009-turn-closeout-next-steps/spec.md:147].

This proposal is thinner than the one the tests already refused.

### Part 2, no existing home

**Partly homed, and the un-homed slice is narrow.** Inventoried line by line rather than asserted.

| The ask | Carried today by | Gap |
|---|---|---|
| A numbered list of the approach | `communication.md`:195, "**DO:** state your approach in three to seven bullets" | Fires only "For a complex or ambiguous request" [:191], and only once, as a preface |
| Concise bullets | `communication.md` §2 one idea per sentence [:73-85], §5 match length to the question [:126-133], §6 cut filler [:139-150] | None. Fully carried, on every substantive reply |
| Verdict-first shape | `communication.md` §7 [:154-165] and §8 [:169-186] | None |
| HVR in the reply | `communication.md` §4 carries the punctuation subset and points at the full standard [:105-120] | Word and tell lists are document-scoped. See section 5 |
| Deciding the plan at all | `AGENTS.md`:177, "**Plan before acting** on multi-step work" | The planning obligation exists. The telling obligation does not |
| Opening a non-trivial task forward-looking | `AGENTS.md`:162, "Open non-trivial work with stakes read" | Carries risk, not route |
| What to expect at thresholds | Nothing | Zero hits for "threshold" across all ten rule files. Zero hits for roadmap or progress-update vocabulary in `AGENTS.md`, `REPO RULES.md` or `repo-rules/`. Measured this session |

So the delivery half is fully homed and the trigger half is partly homed. What is genuinely
un-carried is cadence: saying it during multi-step work rather than once in front of an ambiguous
request, and naming what the reader should expect at each checkpoint.

That residue is one sentence of obligation, not a file.

### Part 3, not design-excluded

**Passes.** Test two placed the proposal In.

### Part 4, an `AGENTS.md` anchor

**Passes, but only by adding one.** `AGENTS.md` §8 anchors both existing reply rules [:424,:426] and
§3 anchors delivery at `communication.md` [:148]. A new rule file would need a third always-loaded
pointer sentence written into §8, which is section 1's finding restated: the obligation lands in
`AGENTS.md` either way.

### The in-place route, and why it is closed

Part 1 routes a single row to "A section, not a file", and part 2 routes homed content to "A new
section inside the rule that already owns it" [decision-tests.md:130-133]. Both point at
`communication.md`. It measures 244 lines against a 250 ceiling, band "at the limit", and over that
the instruction is "Split it, or cut it" [rule-anatomy.md:92,105]. Measured this session:
`wc -l repo-rules/communication.md` returns 244. A new section does not fit.

`handoff-and-questions.md` at 159 lines has room, and is the wrong owner. See section 4.

### A second refusal this part surfaces, at the router rather than in the file

A new rule would need a trigger row in `REPO RULES.md` §2. Its honest trigger is "about to write a
substantive reply about multi-step work", which is a subset of the row already there, "Write any
substantive reply · present a recommendation, a fork, or a trade-off" [REPO RULES.md:47]. Two rows
where the narrower is contained by the broader makes the router ambiguous at exactly the moment it
is consulted. That is distinct from the trigger-phrase collision check in section 6, and it is not
fixable by choosing different phrases.

---

## 4. TEST FOUR, RESTRAINT

**Answer: a real failure exists, and it is located inside `AGENTS.md` rather than in the rule set.**

The test asks what fails today without this rule, and refuses "Might need it", "best practice" and
"for completeness" as answers [decision-tests.md:110-114].

**The named failure, traced to the clauses that produce it.** Three instructions correctly suppress
step-by-step narration and, between them, leave nothing that obliges a stated route:

1. `AGENTS.md`:153, "*While working:* Clipped — act, don't narrate; open with the result, not
   'I'll'/'Let me'; batch tool calls."
2. `communication.md`:142 lists "Let me take a look" and "I'll now" as empty openers, and :147 names
   "Narrating the obvious: announcing a tool call the reader can see the result of".
3. `AGENTS.md`:187, "**Do not ask for permission to continue an already-approved step that is clear
   and in scope.** Avoid `should I continue?`".

Each is right on its own terms. The combined effect on a long multi-step turn is a silent stretch:
the operator sees tool calls, then a boundary report, and never sees a point at which the intended
path was cheap to redirect. The operator asking for this behaviour is itself the evidence that the
current documents do not produce it.

**So restraint does not refuse.** It does something more useful, exactly as it did in phase 006: it
locates the fix. The counterweight to a clause in the always-loaded document has to sit beside that
clause. Placed in a trigger-loaded file it fails twice over, once because it goes quiet on read-only
turns (section 1), and once because a reader hitting `AGENTS.md`:153 with no qualifier next to it
reads the qualifier, when they eventually find it, as a contradiction rather than a boundary.

**And the size of the fix is one bullet.** Everything the operator asked for except cadence is
already obliged on every substantive reply. Writing a file to restate `communication.md` §2, §5, §6,
§7 and §9 is the failure `creation-standards.md` names directly: "Don't restate another rule. Link
instead — and expect not to need to" [creation-standards.md:138-139].

---

## 5. HOW THIS RELATES TO WHAT IS ALREADY DONE

The operator asked specifically whether this integrates with or relates to existing work. Three
relationships, each load-bearing.

### `repo-rules/handoff-and-questions.md`, phase 001's output

**Complementary, and one of them would be violated by a careless placement.** Both are
forward-looking, which is why the boundary needs stating rather than assuming.

The distinction is whose next action is being named. The handback names the operator's:
"End every turn by naming what is now the operator's to do, in the form that lets them do it"
[handoff-and-questions.md:43], and its §2 table restricts the list to "Only things the operator does,
and only things that are actually theirs" [:70]. A progress update names the AI's own next actions.

Put a progress update at the end of a turn and it becomes the failure that rule names explicitly:
"Padding the list with your own remaining work is the common failure, and it is worse than a short
list, because it trains the operator to skim the one list they need to read"
[handoff-and-questions.md:79-81]. It also risks the second misreading that rule refuses, "Not licence
to stop early ... a handback listing your own unfinished work is that refusal wearing this rule as
cover" [:143-145].

**So they are two behaviours, not one, and the separation is already written.** A progress update
belongs before and during the work. A handback belongs at the end and lists only what is the
operator's. Merging them would damage the rule that exists.

### `repo-rules/communication.md` §7 through §9

**This is where the overlap is, and it is substantial.** §7 obliges the verdict first [:154-165]. §8
obliges one recommended approach with its trade-off, required work marked apart from optional, and
stated assumptions [:169-186]. §9 is the closest existing carrier of the operator's exact form:

> 1. **ASK:** restate the request in your own words. A paraphrase back, not a question back: it
>    proves you understood, and it surfaces a misreading before the work, not after.
> 2. **DO:** state your approach in three to seven bullets.
> 3. **THEN:** ask only the one or two clarifying questions that would change the approach.

[communication.md:193-198]

That is a numbered forward-looking plan in concise bullets, already obliged. Two differences from
what the operator asked for, and both are small. It fires only "For a complex or ambiguous request"
[:191], so a clear multi-step request gets no plan preface. And it is a preface, so it says nothing
about checkpoints partway through.

**Verdict on duplication: a rule file here would be roughly four fifths restatement.** That is the
single strongest argument against writing one, and it is stronger than any of the four tests taken
alone.

### Phase 006's `deep-loop-contracts-only` verdict

**The same shape of answer, reached by the same test, landing somewhere else.** 006 failed part one
and part two of the four-part test, found the in-place route closed by the same 244-line ceiling, and
routed its residue to the deep-loop presentation contracts because the un-carried content varied per
mode [006 research.md:362-371,392-400].

This proposal fails part one the same way. Its residue does not vary per mode, so it has nowhere to
go but the always-loaded document, which is where section 1 independently sent it.

**One thing 006 settled that this phase must not re-open.** The HVR boundary. HVR is document-scoped
by its own text, "Linguistic standards for all documentation output" [hvr-rules.md:17], applied "to
all AI-generated documentation: READMEs, implementation summaries, decision records, install guides
and spec folder docs" [hvr-rules.md:29]. `communication.md` §4 keeps the punctuation ban for replies
and points at the rest: "The full standard, including the vocabulary and structural tells this one
does not repeat, is `hvr-rules.md` in `sk-doc`. Load it when writing a document rather than a reply"
[communication.md:117-120].

006's answer was that the voice and tell layers can bind a reply while the document-structure layer
cannot, and that widening it generally is a one-sentence edit to §4 rather than a new section, since
the file is at 244 of 250 [006 research.md:280-282,312-317].

**That answer holds here unchanged, and it consolidates two asks into one operator decision.** Both
this request and 006's ask for HVR in a chat message. Both reach the same sentence,
`communication.md`:120. If the operator wants the HVR word and tell lists to bind replies, that is
one amendment covering both, not two.

---

## 6. THE TRIGGER-PHRASE CHECK, RUN ANYWAY

The corpus carries 182 trigger phrases across the ten files under `repo-rules/` with zero
duplicates. Measured this session by extracting every `trigger_phrases` block and running
`sort | uniq -d`, which returned nothing.

Five candidate phrases were drafted and checked against all ten files before the verdict closed the
route: "forward looking progress update", "roadmap style update", "what happens at each checkpoint",
"say the plan before working", "clipped register versus a plan". None collides. They are recorded in
this document's own frontmatter so a future proposal finds this refusal rather than re-deriving it.

The check passing changes nothing. A rule refused on part one is refused whatever its phrases are.

---

## 7. VERDICT

**Verdict: `AGENTS.md-row`.**

**Deciding test: the four-part refusal test, part one.** The proposal is a single row, not a
trigger-shaped cluster [decision-tests.md:89]. The section route that a part-one refusal normally
takes is closed by `communication.md` sitting at 244 of a 250-line ceiling [rule-anatomy.md:92,105],
and the always-loaded test independently routes the obligation to the same destination, because Gate
5 never fires on the read-only turns where the behaviour is most wanted [AGENTS.md:122].

Every route, recorded so the outcome is complete and the decision is not re-derived later:

| Candidate | Outcome | Test that decided it |
|---|---|---|
| New rule file | **Refused** | Four-part test part one, single row, not a cluster [decision-tests.md:89]. Part two adds that four fifths of it already lives in `communication.md` §2, §5, §6, §7 and §9 |
| New section in `communication.md` | **Not available** | Length ceiling, 244 of 250 [rule-anatomy.md:92,105] |
| New section in `handoff-and-questions.md` | **Refused** | Wrong owner. Its §2 restricts the handback to the operator's own actions and names AI remaining work as the common failure [handoff-and-questions.md:70,79-81] |
| Deep-loop contracts | **Not applicable** | The residue does not vary per mode, unlike phase 006's [006 research.md:396-400] |
| Fifth widening of `REPO RULES.md` §4 | **Not required** | Reply delivery is already In and this names no surface [REPO RULES.md:77,105-107] |
| **`AGENTS.md` row** | **This is the verdict** | Tests one and three both land here. The clause it qualifies is `AGENTS.md`:153, so the qualifier belongs beside it |

### The proposed row, drafted but not applied

One bullet, added under `AGENTS.md` §3 Core Principles item 2, directly beneath the "While working"
line it qualifies:

```
   - *Before a multi-step stretch:* Post the intended path first, as a short numbered list of what
     you will do and what the reader should expect at each checkpoint. Then work. Clipped means not
     narrating each step, never starting without saying where you are going.
```

Why that placement and not §10. Phase 001's close-out clause went to the §10 Communication block
[AGENTS.md:518] because §10 already carried a close-out row and the behaviour was about the turn
ending. This behaviour is about the turn's middle, §10 has no matching row, and §3 item 2 is the
clause that creates the gap. A qualifier separated from what it qualifies reads as a contradiction.

Why no further specification. Concision, numbering, verdict-first order and the punctuation subset
are already obliged for every substantive reply by `communication.md`, which `AGENTS.md`:424 loads
before answering. Repeating any of it in the row would be the restatement
`creation-standards.md`:138 refuses.

### Why it is drafted rather than applied

The row is new normative content in the always-loaded document, not a pointer. This packet's
standing constraint is that a pointer is the only mechanical `AGENTS.md` edit it may make
[009-turn-closeout-next-steps/spec.md:91]. Phase 001 hit the same boundary, added one non-pointer
clause, and raised it: that question is still open and unconfirmed in the parent spec today
[009-turn-closeout-next-steps/spec.md:149]. Adding a second unconfirmed non-pointer clause before
the first is signed off would compound an open change.

### What would overturn this verdict

Three things, stated so the operator can override cheaply, which is how the tenth rule came to exist.

1. **A cluster instead of a row.** If the behaviour grows separable obligations, for example a
   defined checkpoint cadence for bounded loops, a revision protocol for when the plan changes
   mid-work, and a rule for what a plan must never promise, part one stops refusing. On today's
   request it is one obligation.
2. **An explicit override, as in phase 001.** The tests returned `AGENTS.md-row` there too, and the
   operator chose the file. That is a legitimate call, and the cost is now measurable: an eleventh
   rule would duplicate `communication.md` more heavily than the tenth duplicated anything, and its
   trigger row would be contained by an existing row.
3. **A wider HVR ask.** If the operator wants HVR's word and tell lists binding on replies in
   general, that is `communication.md`:120, one sentence, and it settles this request and phase
   006's together.

---

## 8. VERIFICATION NOTES

- Every citation was read from the working tree in this session. Line counts were measured with
  `wc -l`: `communication.md` 244, `handoff-and-questions.md` 159, `REPO RULES.md` 107, `AGENTS.md`
  518.
- The 182-phrase, zero-collision figure was measured by extracting each file's `trigger_phrases`
  block and piping through `sort | uniq -d`, which returned no output.
- The "zero hits for threshold" and "zero hits for roadmap or progress-update vocabulary" claims were
  measured with `grep` across `repo-rules/`, `AGENTS.md` and `REPO RULES.md`.
- No fan-out runner was used. No external CLI dispatch was made. The whole finding rests on direct
  reads of this repository.
- No file under `repo-rules/`, and neither `REPO RULES.md` nor `AGENTS.md`, was modified by this
  phase. The proposed row in section 7 is a draft for the operator, not an applied edit.
- `git status` is not clean on those two root documents, and that is not this phase's doing. Both
  carry an uncommitted diff from phases 003 and 004, which wired the tenth rule. Checked by grepping
  `git diff` over both for progress, roadmap, checkpoint, threshold and intended path, which returned
  no match.
