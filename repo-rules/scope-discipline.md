# Rule: Scope discipline

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before touching anything
> you were not asked to touch.

---

## Fires when

- You notice a defect, a smell, or a stale comment outside the files in scope.
- The fix would be easier if you also changed something else.
- You are about to rename, move, reformat, or delete beyond the named area.
- You are about to deviate from an approved plan, or substitute your approach for
  the one that was agreed.
- Part of the work turns out to be blocked and you are deciding what to do with
  the rest.

## The rule

**The requested scope is the deliverable. Do not narrow it, widen it, or transform
it. Adjacent problems get named, not fixed.**

---

## 1. The three drifts

| Drift | What it looks like | Why it costs |
|-------|-------------------|--------------|
| **Narrowing** | Quietly delivering the easy half and framing it as a checkpoint | The operator believes work is done that is not |
| **Widening** | "While I was in there I also…" | Unreviewable diffs; a fix and an unrelated regression ship together |
| **Transforming** | Solving the problem you find more interesting than the one asked | The stated problem is still there, and now there is new code too |

Narrowing is the most common and the least visible, because it is easy to mistake
for restraint. Restraint governs *how much you build*; it never governs *how much
of the ask you deliver*.

---

## 2. What is in scope by default

Without asking, you may change:

- The files named in the request, or the ones the request unambiguously implies.
- **Direct callers that the change would break** — a change that leaves the tree
  broken is not finished.
- The test that covers the behavior you changed.
- Imports, type signatures, and generated files that mechanically follow from the
  above.

## 3. What always needs a yes first

- Adding a dependency.
- Creating a file outside the area the request named.
- Deleting code you did not write in this task.
- A rename or a move that touches other files.
- A formatting, lint, or import-ordering sweep over untouched code.
- Rewriting git history, force-pushing, or touching branches and reflogs.
- Anything in `blast-radius.md`'s irreversible tier.

---

## 4. The adjacent-defect protocol

You will find real problems outside scope. Finding them is good. Fixing them
silently is not.

1. **Stop.** Do not edit it.
2. **Record it** in one line: `file:line — what is wrong — why it is out of scope`.
3. **Finish the in-scope work.**
4. **Report it in close-out**, as a separate list from what you changed.

Fold it in only if the operator says so, or if leaving it makes the in-scope change
incorrect — in which case it was never adjacent, it was a caller, and §2 already
covers it.

---

## 5. Deviating from an approved plan

An approved plan is frozen the way scope is frozen. Before substituting anything —
a different approach, a manual step in place of a named tool or procedure, a
different file than the one the plan points at:

1. **Verify, don't assume.** Read the thing the plan names and test the friction
   you believe it has against what it actually says. Most assumed friction is not
   there.
2. **If it genuinely blocks the task** — you cannot comply — state the deviation
   and get approval: *"the plan says X, I propose Y because Z."* Wait.
3. **If it does not block but is wrong for this case** — you can comply, it is just
   a bad fit — **follow it for this task, and name the fix in the same response**:
   the file to change, the rule, and the one-line replacement.
4. **Never silently hand-roll a substitute.**

The difference between (2) and (3) is whether you *can* comply, not how wrong it
feels. A silent workaround leaves the next run to rediscover the same friction from
scratch.

---

## 6. Amendment over absorption

The same protocol applies to a frozen scope you believe is wrong. Do not quietly
build what you think was meant. Build what was specified, and in the same response
say: what is wrong, what you would change it to, and what it would cost. The
operator decides. Scaling the work down is never your call.

---

## 7. Finishing

- **Partial delivery is not a stopping point.** Do not present half the work as a
  "good stopping point", a "natural checkpoint", or "future work" while a safe path
  forward exists.
- **When one part is genuinely blocked, finish every other part in full**, then say
  explicitly what you left out and why.
- **Do not ask permission to continue** an already-approved, in-scope step. "Should
  I keep going?" on clear work wastes a turn. This never waives a mandatory wait —
  a stop-for-yes in `blast-radius.md`, or an approval this rule requires, still
  blocks.

---

## 8. Self-check

- [ ] Every file in my diff is in scope by §2, or has an explicit yes.
- [ ] Adjacent defects I found are recorded and reported, not fixed.
- [ ] I did not substitute anything the plan named without reading it first.
- [ ] If I deviated, I said so in the same response, with the file and the rule.
- [ ] Everything asked for is delivered, or explicitly listed as not delivered with
      a reason.
- [ ] No formatting or cleanup noise is riding along with the real change.
