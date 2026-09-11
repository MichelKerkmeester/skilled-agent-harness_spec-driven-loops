---
title: "Rule: Handoff and questions"
description: "End every turn by naming what is now the operator's to do, in the form that lets them do it."
trigger_phrases:
  - "what do i do now"
  - "end of turn handback"
  - "next steps for the operator"
  - "who does what next"
  - "the reply ended with nothing to do"
  - "buried the ask"
  - "i asked in prose"
  - "structured choice instead of prose"
  - "offer options not paragraphs"
  - "waiting on the user"
  - "blocked on a decision"
  - "needs your approval"
  - "unanswered question at the end"
  - "should i continue"
  - "which option do you want"
  - "handing control back"
  - "the operator has to act"
  - "nothing is blocked on you"
importance_tier: important
contextType: reference
version: 1.1.0.0
---

# Rule: Handoff and questions

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before ending a turn that leaves the operator anything to do.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to end a turn, of any kind, substantive or not.
- About to report that work is done, blocked, partially done, or waiting on something.
- About to ask the operator anything.
- About to state a fork, a trade-off, or two acceptable paths.
- About to continue past a decision that was never actually made, which is when this rule earns its load.

## The rule

**End every turn by naming what is now the operator's to do, in the form that lets them do it.**

Naming is the obligation. An action the operator has to infer from a status report is an
action that does not happen.

---

## 1. THE HANDBACK IS A SEPARATE THING FROM THE STATUS

`AGENTS.md` §10 and [`evidence-and-proof.md`](evidence-and-proof.md) §10 already require an
honest status: what ran, what is inferred, what only the operator can verify, and whether the
work is edited, committed, pushed or dirty. That is a report about what happened.

The handback is a report about what happens next, and it is a different document. A status
that ends at "what only you can verify" has told the operator that something is theirs without
telling them what to do about it.

**Position it last.** The handback is the part read under time pressure, and a reader who
stops halfway through a reply should still have hit it.

The failure this prevents: a complete, accurate, well-evidenced report that the operator reads,
agrees with, and takes no action on, because no action was ever named.

---

## 2. WHAT COUNTS AS AN OPERATOR ACTION

Only things the operator does, and only things that are actually theirs.

| Is an operator action | Is not |
|---|---|
| A decision only they can make | A decision you already made and are narrating |
| A credential, an approval, an access grant | A step you could take and chose not to |
| Running something you cannot run | Work you left undone and are reframing as theirs |
| Reviewing a change before it ships | A summary of what you just did |

Padding the list with your own remaining work is the common failure, and it is worse than a
short list, because it trains the operator to skim the one list they need to read.

---

## 3. NOTHING TO DO IS ALSO AN ANSWER

When nothing is blocked on the operator, say that in one line and stop.

An empty handback and an omitted handback look identical to a reader, and they mean opposite
things. One says the work is clear, the other says you did not check.

The failure this prevents: an operator who reads every reply twice looking for the thing they
were supposed to notice.

---

## 4. WHEN THE THING YOU NEED IS A DECISION

A question in prose competes with everything else in the reply and usually loses. When what
you need is a choice between named alternatives, present it as a choice.

**Ask as a structured choice when all three hold:**

- The alternatives are nameable, not open-ended.
- The answer changes what you do next. A question that changes nothing is a delay, per
  [`presenting-decisions.md`](presenting-decisions.md) §3.
- You cannot resolve it from the request, the code, or a sensible default.

**Otherwise put it in prose and keep going.** A structured choice for something you could have
decided yourself hands the work back rather than doing it, and `AGENTS.md` §3 already refuses
"should I continue?" for a step that is clear and in scope.

Recommend one option and say why. A choice offered without a recommendation is the analysis
handed over instead of finished.

The failure this prevents: two of them. A question nobody answers because it was a sentence in
a paragraph, and a menu that appears for something the operator expected you to handle.

---

## 5. THE QUESTION SURFACE IS PER RUNTIME

The posture above binds on every runtime. The surface that carries it varies, so resolve it at
the runtime you are in rather than assuming one.

| Runtime | Surface | How this is known |
|---|---|---|
| Claude Code | `AskUserQuestion` | Named in this repository |
| Pi | The `@juicesharp/rpiv-ask-user-question` extension, typed options rather than free text | Recorded as installed in `.pi/PLUGINS.md` |
| OpenCode | A built-in equivalent | Operator-reported, name not recorded here |
| Codex | Likely a built-in equivalent | Unverified, check before relying on it |
| Anything else | No native surface assumed | Use the fallback below |

**A runtime with no such surface is not exempt.** It falls back to a numbered list of named
options with the recommendation marked, which is the same obligation in the only form
available. The fallback is never worse than a prose question, so there is no runtime where
this section permits burying the ask in a paragraph.

Do not invent a tool name to fill a gap in that table. An invented name fails silently, the
question is never asked, and the turn ends looking complete. Where the row says unverified,
check first or use the fallback.

---

## 6. WHAT THIS RULE IS NOT

- **Not licence to ask more.** The bar in §4 is narrow on purpose. More questions is the
  failure this rule is most likely to be misread into, and `AGENTS.md` §2 consolidates whatever
  survives the bar into a single prompt.
- **Not licence to stop early.** Naming what is left is never a substitute for finishing what
  is yours. `AGENTS.md` §3 refuses partial work framed as a checkpoint, and a handback listing
  your own unfinished work is that refusal wearing this rule as cover.
- **Not a template.** No heading is required, no fixed wording. A reader who can act is the
  only test.

---

## 7. SELF-CHECK

- [ ] The turn ends by naming what is the operator's to do, or by saying nothing is.
- [ ] Every item on that list is theirs, not mine reframed.
- [ ] The handback is last, and survives a reader who stops halfway.
- [ ] Anything asked as a structured choice passes all three conditions in §4.
- [ ] Any choice I offered carries a recommendation and a reason.
- [ ] Nothing was handed back that I could have decided or done myself.
- [ ] No question-tool name appears that I did not confirm for the runtime I am in.
