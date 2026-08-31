---
title: "Rule: Evidence and proof"
description: "A claim is only as strong as the observation behind it; distinguish observed from derived from inferred."
trigger_phrases:
  - "observed derived inferred"
  - "how a green run lies"
  - "exit 0 with no output"
  - "negative control"
  - "watch it fail first"
  - "baseline before no regressions"
  - "a finding is a hypothesis"
  - "the sub-agent said complete"
  - "the tool reported success"
  - "claiming done"
  - "final-state proof"
  - "proof plan before implementation"
  - "reason from data not memory"
  - "the doc disagrees with the code"
  - "honest close-out"
  - "committed pushed dirty"
  - "what only the operator can verify"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: Evidence and proof

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before making any claim someone will act on.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to say "done", "complete", "works", "fixed", "passing", or "no regressions".
- About to report a result, a number, a file path, or command output.
- A tool, sub-agent, or reviewer reports success or a finding and you are about to act on it.
- About to write a completion summary, or tick anything off as done.
- You are closing out a turn.

## The rule

**A claim is only as strong as the observation behind it. Every load-bearing claim
carries its receipt, or is explicitly labeled as inferred.**

---

## 1. THREE TIERS

| Tier | Meaning | How it must appear |
|------|---------|--------------------|
| **OBSERVED** | You ran it and read the output and exit status | Cite the receipt: the command, the `file:line`, the artifact path |
| **DERIVED** | Follows necessarily from something observed | Show the observation and the step from it |
| **INFERRED** | Plausible, unverified | Say so, and say what would confirm it |

Prose that mixes the three without marking them reads as if all of it were observed.
That is how a confident summary certifies work nobody checked.

---

## 2. COMMAND EVIDENCE

**A command counts as evidence only after its output and exit status have been read.**
Not launched. Not assumed. Read.

- Never report output you did not see, or the output you *expected*.
- **Exit 0 with no output is a suspicious pass, not a pass.** A runner that failed to
  start, a script that no-oped on a symlinked path, a matcher that selected zero files,
  and a stale build that refused to run all exit 0 or print nothing.
- **Verify by content, not exit code.** Require the affirmative marker (`RESULT: PASSED`,
  the test count, the file listing), not merely the absence of a failure marker.
- Run focused checks during repair; before claiming completion **re-run the whole
  authoritative gate**. A focused pass is not a gate pass.

---

## 3. THE FOUR WAYS A GREEN RUN LIES

1. **It did not run.** Stale build, refused start, missing binary, guard clause, crashed
   before the first test body.
2. **It ran on the wrong thing.** Wrong path, branch, or working directory; a symlink
   that resolved elsewhere; a filter that matched nothing.
3. **It ran on stale artifacts.** Cached output, an old bundle, pre-change fixtures, a
   metadata fingerprint that no longer attests its source.
4. **It asserted nothing.** A test with no assertion, a mocked subject, an auto-updated
   snapshot, an empty parametrization.

---

## 4. THE NEGATIVE CONTROL

**Before the fix, reproduce the exact failing symptom with the exact check you will use
to prove the fix.** Then the same check proves the change. A check that passed before
your change and passes after it proves nothing about your change. If reproducing is
unsafe, say so and name what you used instead.

---

## 5. BASELINES

"No regressions" is a comparison, and a comparison needs a before.

1. Capture the real starting numbers, pass/fail counts, timings, sizes, before
   changing anything.
2. Re-run the **whole** gate afterwards, not the subset you were iterating on.
3. Report the delta, including the parts that did not move.

Same for any performance claim: measure under stated conditions, report baseline and
delta. An unmeasured performance claim is not a caveat, it is a fabrication.

---

## 6. SHAPE-SPECIFIC PROOF

Three task shapes fail in ways the checks above do not catch:

- **Filter or transform:** enumerate every in-scope variant *first*, process each, then
  rescan the whole surface for residue. The variants you never enumerated are the ones
  you missed, and a clean diff does not reveal an unprocessed input.
- **Computed answer:** derive it a second way, independently, before writing the number.
  Re-reading your own arithmetic is not an independent derivation.
- **Exact artifact:** check filename, path, format and content shape directly. Having
  written it is not evidence it is there in the required shape.

---

## 7. A FINDING IS A HYPOTHESIS

A sub-agent's "COMPLETE", a reviewer's "P0", a linter's error, a bot's suggestion: each
is a **claim to confirm against the real symptom**, not a fact to act on. Acting on an
unconfirmed finding produces a fix for a bug that was never there, plus a diff nobody
can explain.

---

## 8. PROOF PLAN BEFORE IMPLEMENTATION

For anything with a machine-checkable outcome, **before changing files**, convert the
acceptance criteria into 1–5 observable pass/fail checks. Each names the exact command
or inspection, the exact path/filename/format expected, and the boundary case it exposes.

Deciding what would count as proof *after* you have the result is how the result becomes
the standard.

---

## 9. FINAL-STATE PROOF

Before any completion claim:

- [ ] Every required artifact exists **at its exact path** in the required format, verified by inspection, not by the fact that you wrote it.
- [ ] The §8 proof plan and the authoritative gate both pass **from the final state**, output and exit status read.
- [ ] The scoped diff contains no task-created residue, no scratch files, no debug
      output, no unrelated file.
- [ ] Any failing check keeps the completion claim blocked. Repair, or report the
      blocker with its evidence. There is no third option.

---

## 10. CLOSE-OUT

Every substantive turn ends with an honest status. Four things, briefly:

1. **What ran or was read, and what it returned**, with the receipts from §1.
2. **What is inferred** rather than observed.
3. **What only the operator can verify.**
4. **The state of the work:** edited / committed / pushed / dirty, and which branch.
   Four different states, routinely conflated.

And plainly: **what is not done.** If tests fail, say so and show the output. If a step
was skipped, say it was skipped. If scope was left out, name it and why. Work that is
done and verified is stated plainly, without hedging, the hedging habit devalues the
honest report when it matters.

---

## 11. REASON FROM DATA, NOT FROM MEMORY

Everything above is about proving a claim after the fact. This is about where the claim
came from. Two habits produce most of the claims that then need retracting:

**Reasoning from what the code probably does.** You have read this pattern a hundred
times, so you know what `resolveConfig` returns. Open it. The cost of being wrong here
is not one wrong sentence, it is a fix built on a wrong model, which fails in a way
that looks like a different bug.

**Reasoning from what a document says the code does.** A README, a spec, a comment, and
a prior implementation summary are all claims about the code by someone who is not the
code. They are excellent for finding *where* to look and worthless as the final word on
*what happens*. Where a doc and the code disagree, the code wins and the doc is now a
defect.

Before the change, run the checks that decide whether it is the right change at all:
does something simpler already do this, what does it cost at runtime, who maintains it
after you, and is any of it outside the frozen scope. These are cheap before the edit
and expensive after it, the same asymmetry as §8's proof plan, one step earlier.

---

## 12. SELF-CHECK

- [ ] Every load-bearing sentence is marked OBSERVED, DERIVED, or INFERRED.
- [ ] I read the output and exit status of every command I am citing.
- [ ] Checked the green run against the four failure modes in §3.
- [ ] A before-number exists for every "no regressions" and performance claim.
- [ ] The close-out says what failed and what is inferred, not only what worked.
- [ ] Every claim about behavior came from the code or a command, not from memory or a doc.
- [ ] Where a document and the code disagreed, I said so rather than trusting the document.
