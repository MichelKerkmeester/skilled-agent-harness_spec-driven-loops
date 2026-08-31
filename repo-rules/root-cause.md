# Rule: Root cause and debugging

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load when something is red.
> Expands `AGENTS.md`, never overrides it — where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- Anything fails: a test, a build, a check, a runtime error, a wrong output.
- You are on the second attempt at the same fix.
- About to add a special case, a retry, a sleep, a broadened `catch`, or a loosened assertion.
- You are tempted to call a failure a flake, an infra problem, or pre-existing.

## The rule

**Fix the producer, not the symptom. Every fix names the mechanism that caused the
failure.**

If you cannot say *why* it broke in one sentence, you have not found the cause — you
have found a place where the symptom stops appearing.

---

## 1. THE LOOP

1. **Reproduce the exact symptom**, safely. Not a similar one — the same failure, the
   same message.
2. **Read the whole error.** The top line names where it surfaced; the cause is usually
   the innermost frame in code you control, and the message is usually literal.
3. **Locate the producer** — the code that created the bad value or state, not the code
   that choked on it.
4. **Trace to the consumers.** Anything else reading that producer has the same bug,
   surfaced or not.
5. **Fix at the source.**
6. **Re-run the same check that failed**, then the whole gate.

Step 1 is not optional. If you cannot reproduce it you cannot prove you fixed it, and
you should say so instead of claiming a fix (see the negative control in
`evidence-and-proof.md`).

---

## 2. SYMPTOM-FIX SMELLS

Each is evidence you are patching in the wrong place:

| Smell | What it is really telling you |
|-------|-------------------------------|
| A special case for one caller | The seam between the module and that caller is wrong |
| A retry around a deterministic operation | You do not know why it fails, and now it fails five times |
| A `sleep` | A real ordering or lifecycle bug, now timing-dependent |
| A broadened `catch` or bare `except` | The failure is now silent and the wrong answer ships |
| A widened type or an added `any` | The type was right; the value is wrong |
| Changing the expected value to match the actual | You just wrote the bug down as the specification |
| A default that papers over a missing value | The producer never set it, and now nobody will find out |

---

## 3. WHEN AN ATTEMPT REPEATS

**If an attempt repeats without producing new evidence, stop patching at the failure
site.** How many local retries you get is set outside this file; what triggers the stop
here is repetition without new evidence, not a fixed count.

Do not repeat the same guess with a variation. Instead:

1. **Restate the problem one level up** — at the interface, the data flow, or the module
   boundary rather than the line.
2. **Inspect the interface that actually exists.** Read the signature, type, schema,
   docs, caller. Most repeated failures are a wrong assumption about an API, not a wrong
   line of code.
3. **Try once from the new framing.**

Verify commands, flags, paths and APIs exist before relying on them. When an option turns
out unsupported, read the available interface and change approach — do not re-run the
same command with a different spelling.

**Naming the seam.** When a fix only works by special-casing a caller, the boundary is
wrong. Say so: **name the seam and the files a seam fix would touch**, then ask.
`scope-discipline.md` still binds — "the real fix is over there" does not grant a yes.

---

## 4. NEVER MAKE A CHECK PASS BY WEAKENING IT

Not a fix, in any circumstance: skipping, disabling, quarantining or deleting a failing
test; loosening an assertion until it passes; excluding the failing file from the linter,
type checker or matcher; committing an empty change or re-triggering a run for a
different roll.

If a test is genuinely wrong, that is a finding to raise with evidence, not a line to
edit on your way past.

---

## 5. "FLAKE" IS A CONCLUSION, NOT A STARTING HYPOTHESIS

Only two things support it: the same check passed on this exact input before, or the run
died before any test body executed (checkout, install, runner loss). Absent one of those,
treat the failure as real. One re-run to confirm, at most; a second failure is a bug.

---

## 6. OWNERSHIP

"Pre-existing." "Not caused by my changes." "Environment issue." These may be true and
are never a stopping point. Diagnose far enough to know which it is, say what you found,
then decide with the operator. A failure you walked past is a failure you shipped.

---

## 7. WHEN YOU ARE STUCK — ESCALATION FORMAT

Once repetition has replaced evidence and the retry budget is spent, escalate once:

1. **Symptom** — the exact error, verbatim.
2. **What I tried** — each attempt and the evidence it produced, not just what it was.
3. **What that rules out** — the hypotheses now eliminated.
4. **Options** — two or three, with the trade-off of each.
5. **Recommendation** — one, and why.

A stuck report without evidence per attempt asks someone else to start from zero.

---

## 8. SELF-CHECK

- [ ] Reproduced the exact symptom before changing anything.
- [ ] I can state the mechanism in one sentence.
- [ ] The fix is at the producer, not where the symptom surfaced, and I checked that
      producer's other consumers.
- [ ] No test, assertion, or check was weakened to get green.
- [ ] If I called it a flake, I have one of the two pieces of evidence.
- [ ] Re-ran the failing check *and* the whole gate.
