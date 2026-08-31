# Rule: Evidence and proof

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before making any claim
> that someone will act on.

---

## Fires when

- You are about to say "done", "complete", "works", "fixed", "passing", or "no
  regressions".
- You are about to report a result, a number, a file path, or command output.
- A tool, a sub-agent, or a reviewer reports success or a finding, and you are
  about to act on it.
- You are about to write an acceptance-criteria row, a checklist tick, or a
  completion summary.

## The rule

**A claim is only as strong as the observation behind it. Every load-bearing claim
carries its receipt, or is explicitly labeled as inferred.**

---

## 1. Three tiers, and how to write each

| Tier | Meaning | How it must appear |
|------|---------|--------------------|
| **OBSERVED** | You ran it and read the output and the exit status | Cite the receipt: the command, the `file:line`, the artifact path |
| **DERIVED** | Follows necessarily from something observed | Show the observation and the step from it |
| **INFERRED** | Plausible, unverified | Say so, and say what would confirm it |

Prose that mixes the three without marking them reads as if all of it were
observed. That is how a confident summary certifies work nobody checked.

---

## 2. Command evidence

**A command counts as evidence only after its output and its exit status have been
read.** Not launched. Not assumed. Read.

- Never report output you did not see. Never report the output you *expected*.
- **Exit 0 with no output is a suspicious pass, not a pass.** A runner that failed
  to start, a script that no-oped on a symlinked path, a matcher that selected zero
  files, and a stale build that refused to run all exit 0 or print nothing.
- **Verify by content, not by exit code.** Confirm the expected lines actually
  appeared. Require the affirmative marker (`RESULT: PASSED`, the test count, the
  file listing), not merely the absence of the failure marker.
- During repair, run focused checks. Before claiming completion, **re-run the whole
  authoritative gate** — a focused pass is not a gate pass.

## 3. The four ways a green run lies

Check each before believing one:

1. **It did not run.** Stale build, refused start, missing binary, guard clause,
   crashed before the first test body.
2. **It ran on the wrong thing.** Wrong path, wrong branch, wrong working
   directory, a symlink that resolved elsewhere, a filter that matched nothing.
3. **It ran on stale artifacts.** Cached output, an old compiled bundle,
   pre-change fixtures, a metadata fingerprint that no longer attests its source.
4. **It asserted nothing.** A test with no assertion, a mocked subject, a snapshot
   auto-updated, an empty parametrization.

---

## 4. The negative control

**Before the fix, reproduce the exact failing symptom with the exact check you will
use to prove the fix.** Then the same check proves the change.

A check that passed before your change and passes after it proves nothing about
your change. If reproducing is unsafe or destructive, say so and name what you used
instead.

## 5. Baselines

"No regressions" is a comparison, and a comparison needs a before.

1. Capture the real starting numbers — pass/fail counts, timings, sizes — before
   changing anything.
2. Re-run the **whole** gate afterwards, not the subset you were iterating on.
3. Report the delta, including the parts that did not move.

The same applies to any performance claim: measure under stated conditions, report
baseline and delta. An unmeasured performance claim is not a caveat, it is a
fabrication.

---

## 6. A finding is a hypothesis

A sub-agent's "COMPLETE", a reviewer's "P0", a linter's error, a bot's suggestion —
each is a **claim to confirm against the real symptom**, not a fact to act on.
Confirm it first. Acting on an unconfirmed finding produces a fix for a bug that
was never there, plus a diff nobody can explain.

---

## 7. Proof plan before implementation

For anything with a machine-checkable outcome, **before changing files**, convert
the acceptance criteria into 1–5 observable pass/fail checks. Each names:

- the exact command or inspection,
- the exact path, filename, and format expected,
- the boundary case it exposes.

Deciding what would count as proof *after* you have the result is how the result
becomes the standard.

## 8. Final-state proof

Before any completion claim:

- [ ] Every required artifact exists **at its exact path** and matches the required
      format — verified by inspection, not by the fact that you wrote it.
- [ ] The proof plan from §7 and the authoritative gate both pass **from the final
      state**, and you read the output and the exit status.
- [ ] The scoped diff or status contains no task-created residue — no scratch
      files, no debug output, no unrelated file.
- [ ] Any check that fails keeps the completion claim blocked. Repair, or report
      the blocker with its evidence. There is no third option.

---

## 9. Self-check

- [ ] Every load-bearing sentence is marked OBSERVED, DERIVED, or INFERRED.
- [ ] I read the output and exit status of every command I am citing.
- [ ] I checked the green run against the four failure modes in §3.
- [ ] I have a before-number for every "no regressions" and every performance claim.
- [ ] I confirmed each external finding before acting on it.
- [ ] Nothing in my summary is a number, path, or output I did not observe.
