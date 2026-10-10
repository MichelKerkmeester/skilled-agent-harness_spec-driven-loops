---
title: "Rule: Communication handoff"
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
  - "state restatement cadence"
  - "where were we"
  - "catch me up"
  - "closing contract"
  - "one concrete next action"
  - "what is in flight"
  - "still running in the background"
  - "did it stall or is it working"
  - "will you continue on your own"
  - "waiting on me or on a machine"
  - "resume condition"
importance_tier: important
contextType: reference
version: 1.6.0.4
---

# Rule: Communication handoff

> Routed from [`REPO RULES.md`](../../REPO%20RULES.md). Load before ending a turn that leaves the operator anything to do.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to end a turn, of any kind, substantive or not.
- About to report that work is done, blocked, partially done, or waiting on something.
- About to end a turn while something you started is still running.
- About to ask the operator anything.
- About to state a fork, a trade-off, or two acceptable paths.
- About to continue past a decision that was never actually made, which is when this rule earns its load.

## The rule

**End every turn by naming what is now the operator's to do, in the form that lets them do it.**

Naming is the obligation. An action the operator has to infer from a status report is an
action that does not happen.

---

## 1. THE HANDBACK IS A SEPARATE THING FROM THE STATUS

The status `AGENTS.md` §10 and [`evidence-and-proof.md`](evidence-and-proof.md) §10 require
reports what happened. The handback reports what happens next, and it is a different document.

**Restate the state when the reader must re-orient.** It fires when the direction of the
work changes, when two attempts at the same fix have failed or when the work resumes after
a gap. The restatement says what is done, what is open and what changed, and carries the
operator's standing constraints and decisions in their own words. It replaces the previous
stated state. It does not summarize the reply.

The failure this prevents: a reader who returns mid task and trusts a stated state that
the turns since have superseded.

**Position it last**, so a reader who stops halfway through a reply has still hit it.

The close of the turn is a contract with two clauses. Completed work is shown, as the
changed file, the passing check or the output, after the outcome that
[`communication.md`](communication.md) §5 puts first. When a command ran, name the command
and its exit status or result beside the claim it supports, before your reading of it. What happens next is exactly one concrete action, in the form that lets the operator do
it, or the one line that says nothing is.

The failure this prevents: a close out the operator reads, agrees with and acts on
nothing from, because the work was claimed instead of shown and the next steps
scattered, no single concrete action among them.

---

## 2. WHAT COUNTS AS AN OPERATOR ACTION

Only things the operator does, and only things that are actually theirs.

| Is an operator action | Is not |
|---|---|
| A decision only they can make | A decision you already made and are narrating |
| A credential, an approval, an access grant | A step you could take and chose not to |
| Running something you cannot run | Work you left undone and are reframing as theirs |
| Reviewing a change before it ships | A summary of what you just did |

Padding the list with your own remaining work is the common failure: it trains the operator
to skim the one list they need to read.

---

## 3. NOTHING TO DO IS ALSO AN ANSWER

When nothing is blocked on the operator, say that in one line and stop.

The failure this prevents: an operator who reads every reply twice looking for the thing they
were supposed to notice.

---

## 4. WHEN THE THING YOU NEED IS A DECISION

**Ask as a structured choice when all three hold:**

- The alternatives are nameable, not open-ended.
- The answer changes what you do next. A question that changes nothing is a delay, per
  [`communication-decisions.md`](communication-decisions.md) §3.
- You cannot resolve it from the request, the code or a sensible default.

**Otherwise put it in prose and keep going.** `AGENTS.md` §3 already refuses "should I
continue?" for a step that is clear and in scope.

Recommend one option and say why.

The failure this prevents: two of them. A question nobody answers because it was a sentence in
a paragraph, and a menu that appears for something the operator expected you to handle.

---

## 5. THE QUESTION SURFACE IS PER RUNTIME

The posture above binds on every runtime. Resolve the surface at the runtime you are in
rather than assuming one.

| Runtime | Surface | How this is known |
|---|---|---|
| Claude Code | `AskUserQuestion` | Named in this repository |
| Pi | The `@juicesharp/rpiv-ask-user-question` extension, typed options rather than free text | Recorded as installed in `.pi/PLUGINS.md` |
| OpenCode | A built-in equivalent | Operator-reported, name not recorded here |
| Codex | `request_user_input`, only on a turn whose tool list names it. Plan mode has it, Default mode only behind a feature that ships off, and `codex exec` never | Read from the Codex 0.160.1 binary's own instructions |
| Anything else | No native surface assumed | Use the fallback below |

**A runtime with no such surface is not exempt.** It falls back to a numbered list of named
options with the recommendation marked.

Do not invent a tool name to fill a gap in that table. An invented name fails silently, the
question is never asked, and the turn ends looking complete. Where the row says unverified,
check first or use the fallback.

---

## 6. WHAT IS STILL RUNNING, AND WHAT RESUMES YOU

**Name what is in flight.** Anything you started that is still running and not yet
reportable: a background agent, a dispatched lane, a watcher, a long suite, a build. One
item is a line. More than one is a small table, the item and the state it is actually in.
That table is this rule's one carve-out from [`communication.md`](communication.md) §2.
The state is the payload: what it is doing now, how far in it is, what it is waiting on.

**Say what resumes you.** One line, of the shape "I will continue autonomously when …",
naming the event that unblocks you: a lane returning, a suite going green, a watcher firing.

**Neither is ceremony.** A turn with nothing running writes no table and claims no resume
condition. A turn that genuinely needs a decision says so and stops, and never claims it
will continue by itself.

The failure this prevents: a turn that goes quiet while work is still running, leaving the
operator unable to tell whether anything is happening or whether it is their move.

---

## 7. WHAT THIS RULE IS NOT

- **Not licence to ask more.** The bar in §4 is narrow on purpose, and `AGENTS.md` §2
  consolidates whatever survives it into a single prompt.
- **Not licence to stop early.** Naming what is left is never a substitute for finishing what
  is yours, and `AGENTS.md` §3 refuses partial work framed as a checkpoint.
- **Not a template.** No heading is required, no fixed wording. A reader who can act is the
  only test.

---

## 8. SELF-CHECK

- [ ] The turn ends by naming what is the operator's to do, or by saying nothing is.
- [ ] Every item on that list is theirs, not mine reframed.
- [ ] The handback is last, and survives a reader who stops halfway.
- [ ] Anything asked as a structured choice passes all three conditions in §4.
- [ ] Any choice I offered carries a recommendation and a reason.
- [ ] Nothing was handed back that I could have decided or done myself.
- [ ] No question-tool name appears that I did not confirm for the runtime I am in.
- [ ] Where the direction changed, two fixes failed or the work resumed after a gap, I restated what is done, what is open and what changed.
- [ ] Anything I started that is still running is named with the state it is in, and nothing appears there that has already finished.
- [ ] A claim that I will continue on my own names the event that resumes me, and no such claim stands on a turn that needs an operator decision.
