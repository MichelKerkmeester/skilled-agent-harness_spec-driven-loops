---
title: "Rule: Delegation and orchestration"
description: "Delegating makes you the orchestrator; brief with evidence, and no single model verdict closes a question."
trigger_phrases:
  - "orchestrate posture"
  - "one model is one opinion"
  - "second lens"
  - "diverge the lens"
  - "the brief carries evidence"
  - "don't put the conclusion in the brief"
  - "accepting a return"
  - "the delegate said complete"
  - "verify the citation"
  - "scope travels with the work"
  - "bind write authority"
  - "read the executor contract"
  - "delegate or not"
  - "cheaper to just do it"
  - "repair loop for a failed check"
  - "two delegates disagree"
  - "fan out lineage"
  - "sub-agent"
  - "CLI executor"
  - "deep loop"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: Delegation and orchestration

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before work leaves your hands.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to **decide whether** to hand work to another runtime at all, the cost question
  comes before the briefing question, and this file used to fire only after it.
- About to hand work to another runtime: a CLI executor, a sub-agent, a fan-out lineage, a deep loop.
- About to compose the prompt that a delegate will act on.
- About to accept, quote, or act on what a delegate returned.
- About to answer a judgment question, "is this the right design", "is this rule needed", "which approach is better", from your own reading alone.

## The rule

**When you hand work to another runtime you become its orchestrator, not its author:
brief it with evidence and a frozen scope, and judge what comes back against the
repository, no single model's verdict, the delegate's or your own, closes a question.**

Orchestrating is a posture, not a ceremony. It means you own the decomposition, the
brief, and the verdict, and the delegate owns exactly one bounded piece of work.

---

## 1. THE POSTURE SWITCH

The moment you delegate, three of your jobs change and one appears.

| Working alone | Orchestrating |
|---------------|---------------|
| You read the code | You decide what the delegate must read, and say so |
| You hold the scope in your head | You write the scope down, because the delegate cannot see your head |
| Your uncertainty is visible to you | The delegate's confidence tells you nothing about its accuracy |
| Nothing corresponds | You now own a verification step that did not exist before |

Before any of that, one check: **is delegating cheaper than doing it?** A dispatch costs
a brief, a wait, and a verification pass. Work you could finish in the time it takes to
write the brief is work you should finish, see [`prevent-overengineering.md`](prevent-overengineering.md).
This is the first question, not a caveat at the end.

The failure this prevents: dispatching as though the delegate were you with more time.
It is not. It has no memory of this session, and no access to what you already ruled out.

> **One lens, stated as such.** The claims in this file about how models behave under a
> vague brief are judgment from limited observation, not measurement, the disclosure
> §4 and §6 require of every judgment claim, applied here. What would change them:
> a run where a deliberately underspecified brief returned findings as well-grounded as
> a specified one.

---

## 2. BEFORE YOU DISPATCH

Five things, in order. None is optional, and the first is a hard rule elsewhere.

1. **Read the executor's own contract.** `AGENTS.md` Dispatch Rules require reading
   `cli-external-orchestration/cli-X/SKILL.md` before composing any `cli-X` prompt.
   This file does not repeat what those documents say, and neither should you, a
   dispatch flag copied into prose goes stale the next time the CLI changes.
2. **Bind the write authority.** Say where the delegate may write before it starts.
   A delegate given the repository is a delegate that will eventually edit something
   nobody reviewed.
3. **Freeze the scope in the brief itself.** See [`scope-discipline.md`](scope-discipline.md).
   Scope you did not write down is scope the delegate will infer, and it will infer wider.
4. **State the shape of an acceptable answer.** Not the answer, the shape. A file list,
   a table with named columns, a verdict plus citations. "Investigate X" returns an essay.
5. **Pre-resolve every gate the delegate cannot ask you about.** A dispatched worker reads the
   same gates you do and obeys them, including the ones that stop and wait for an operator.
   Nobody is at its prompt, so it stops forever and reports success. Setting the environment
   variable that waives a gate is not enough: it makes the waiver true, not observable, and a
   model cannot read an environment variable. Put the answer in the prompt. Give the decision,
   not permission to skip it.

---

## 3. A BRIEF CARRIES EVIDENCE, NOT PREFERENCE

A brief that says *do what you think is best* gets back what the model thinks is best,
which is a sample from a distribution, not a finding about this repository.

**Put in the brief:** the files and symbols to read, with paths; what has already been
ruled out and why; the constraint that must hold; the format of the return; the
requirement to cite `file:line` for every claim.

**Keep out of the brief:** your preferred conclusion. If you tell a delegate what you
expect, you have built a machine for confirming it. Ask the question you actually have.

The failure this prevents: a five-iteration research run that produces a fluent
restatement of the brief's own assumptions, and reads as corroboration.

---

## 4. ONE MODEL IS ONE OPINION

A delegate's output is a hypothesis. So is yours.

For a **factual** question (does this symbol exist, does this test pass, what does this
file say), one delegate is enough, because the repository can settle it and you will
check.

For a **judgment** question (is this abstraction warranted, is this rule needed, which
of two designs is better), one lens is not a finding. Do one of these, and say which:

- **Diverge the lens:** ask a second model family, or the same question framed against
  the opposite conclusion.
- **Ground it:** convert the judgment into something the repository can answer. "Is this
  rule needed" becomes "find the commits where its absence cost us something."
- **Escalate it:** if it is genuinely a preference, it is the operator's, not the model's.

Agreement between two runs of the same model is not corroboration. It is the same
opinion twice.

---

## 5. WHAT COMES BACK IS UNVERIFIED

A delegate reporting `COMPLETE` has reported a claim about itself. See
[`evidence-and-proof.md`](evidence-and-proof.md) §7, a finding is a hypothesis until
something you ran confirms it. Three checks before you quote a return:

- **Does the citation resolve?** Open one of them. A fabricated `file:line` is the
  cheapest thing to detect and the most expensive thing to propagate.
- **Did it stay in scope?** Diff the paths it touched against the paths you authorized.
- **Did it actually run?** An iteration count from a run's own summary is the run
  describing itself. Read the state it wrote, not the story it told.
- **Do not read the exit status as the verdict.** It has been wrong in both directions:
  a dispatch that stopped at a gate and wrote nothing exits zero, and a dispatch that
  wrote everything then hit a provider capacity limit exits one. Check that the artifacts
  exist, then check their content. The return code tells you the process ended.

The failure this prevents: a finding entering your close-out with the delegate's
confidence attached and none of your verification.

**When a check fails, there is a next step and it is not silence.** A return that fails
verification is not discarded and not quoted. Re-dispatch with the brief corrected for
what the failure revealed, or record the failure as the finding, a delegate that could
not answer is evidence about the question. What you may not do is drop it, because the
next reader cannot tell an unasked question from an unanswerable one.

**Persist your side too.** The delegate's state is written down; yours usually is not.
Keep the brief you sent, the checks you ran on the return, and the verdict you reached,
in whatever artifact owns the work. A verified return with no record of the verification
is indistinguishable, later, from an unverified one.

**When two delegates disagree, do not average them.** Disagreement means the question was
underspecified or the evidence is genuinely thin. Find which, and say which, a tally is
not a finding.

---

## 6. YOUR OWN OPINION IS ALSO ONE OPINION

The rule cuts inward. Skipping delegation because you already know the answer is the
same single-lens failure, minus the paper trail. When you are about to answer a
judgment question from your own reading alone, either ground it in the repository or
say plainly that it is your judgment and what would change it.

The failure this prevents: shipping a confident design verdict that no evidence
supports, in a session where checking would have cost one dispatch.

---

## 7. SCOPE TRAVELS WITH THE WORK

The delegate inherits your frozen scope and cannot widen it. If it comes back having
fixed something adjacent, that is not a bonus, it is an unreviewed change, and it goes
back out or gets raised as an amendment. Widening scope is the operator's call, and
delegating did not transfer that.

You also stay accountable for what the delegate did. "The sub-agent wrote it" is not a
defect report; it is the same sentence as "not my code", which
[`evidence-and-proof.md`](evidence-and-proof.md) already refuses.

**Do not commit what you did not read, and remember that staging by name is not enough.**
While a delegate is running, its edits sit in the same working tree as yours. `git add -A`
cannot tell them apart, so it is the obvious trap. The one that actually catches people is
quieter: **`git commit` commits the whole index, not the paths you just added.** A delegate
told to stage its own work as it goes, which is the right instruction, is staging into that
same index. Your next commit takes its files too, under a message about something else,
and the delegate reads the result as you having committed work it was told to leave alone.

So name the paths at commit time, not only at add time: `git commit -- <paths>` or
`git commit --only <paths>`. Check `git diff --cached --name-only` first when a delegate is
live. One catch worth knowing before it costs you a commit: a pathspec commit only sees
tracked changes, so a brand new file still needs its `git add` and silently contributes
nothing without one. When a delegate's work does belong in your commit, read it first and say so in the
message.

---

## 8. WHAT THIS RULE IS NOT

- **Not a mandate to delegate.** A dispatch that costs more than doing the work is a
  restraint failure, see [`prevent-overengineering.md`](prevent-overengineering.md). Most tasks are
  cheaper done directly.
- **Not permission to defer the verdict.** The orchestrator decides. A delegate that
  returns three options has returned three options, not a decision.
- **Not a routing document.** Which skill, which agent, which command, which flags, all of that belongs to `AGENTS.md` and the skills it routes to. This file governs
  the posture, not the plumbing.
- **Not about human collaboration.** It addresses machine delegation. The parts that
  generalize do so by accident, not by design.

---

## 9. SELF-CHECK

- [ ] I read the executor's own contract before composing the prompt.
- [ ] The brief names the files to read, the frozen scope, and the shape of the answer.
- [ ] The brief does not contain the conclusion I expect.
- [ ] Write authority was bound before the delegate started, not corrected after.
- [ ] For every judgment claim I am about to repeat, I diverged the lens, grounded it, or escalated it.
- [ ] I opened every citation I am about to repeat, not a sample, one resolved citation
      proves nothing about the others, and §5 says why that matters.
- [ ] The paths the delegate touched match the paths I authorized.
- [ ] Where I answered from my own reading alone, I said so and said what would change it.
- [ ] Delegating was cheaper than doing it, and I can say why.
- [ ] A failed verification was re-dispatched or recorded, never dropped.
- [ ] My brief, my checks, and my verdict are written down somewhere durable.
