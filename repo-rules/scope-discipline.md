---
title: "Rule: Scope discipline"
description: "The requested scope is the deliverable; adjacent problems get named, not fixed."
trigger_phrases:
  - "frozen scope"
  - "scope lock"
  - "scope drift"
  - "out of scope"
  - "in scope"
  - "while I was in there"
  - "noticed in passing"
  - "adjacent defect"
  - "adjacent code cleanup"
  - "touch a file outside the ask"
  - "rename reformat delete"
  - "deviate from the approved plan"
  - "amendment over absorption"
  - "plan before acting"
  - "what needs a yes first"
  - "no early stop"
  - "natural checkpoint"
  - "good stopping point"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: Scope discipline

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before touching anything you were not asked to touch.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- You notice a defect, a smell, or a stale comment outside the files in scope.
- The fix would be easier if you also changed something else.
- Renaming, moving, reformatting, or deleting beyond the named area.
- Deviating from an approved plan, or substituting your approach for the agreed one.
- Part of the work is blocked and you are deciding what to do with the rest.

## The rule

**The requested scope is the deliverable. Do not narrow it, widen it, or transform it.
Adjacent problems get named, not fixed.**

---

## 1. THE THREE DRIFTS

| Drift | What it looks like | Why it costs |
|-------|-------------------|--------------|
| **Narrowing** | Delivering the easy half and framing it as a checkpoint | The operator believes work is done that is not |
| **Widening** | "While I was in there I also…" | Unreviewable diffs; a fix and an unrelated regression ship together |
| **Transforming** | Solving the problem you find more interesting than the one asked | The stated problem is still there, and now there is new code too |

Narrowing is the most common and least visible, because it is easy to mistake for
restraint. Restraint governs *how much you build*, never *how much of the ask you
deliver*.

---

## 2. WHAT COUNTS AS "EXPLICITLY IN SCOPE"

Law 2 freezes the scope; this section never widens it, it only says how to read it.
Inside the frozen scope these are the *same* change, not adjacent ones:

- The files named in the request, or the ones it unambiguously implies.
- **Direct callers the change would break** a change that leaves the tree broken is
  not finished.
- The test covering the behavior you changed.
- Imports, type signatures, and generated files that mechanically follow.

Anything else is adjacent and goes to §4, including a caller the change does *not* break.

---

## 3. WHAT ALWAYS NEEDS A YES FIRST

- Adding a dependency.
- Creating a file outside the area the request named.
- Deleting code you did not write in this task.
- A rename or move that touches other files.
- A formatting, lint, or import-ordering sweep over untouched code.
- Rewriting git history, force-pushing, or touching branches and reflogs.
- Anything in `blast-radius.md`'s irreversible tier.

---

## 4. THE ADJACENT-DEFECT PROTOCOL

You will find real problems outside scope. Finding them is good; fixing them silently
is not.

1. **Stop.** Do not edit it.
2. **Record it** in one line: `file:line, what is wrong, why it is out of scope`.
3. **Finish the in-scope work.**
4. **Report it in close-out** as a separate list from what you changed.

Fold it in only if the operator says so, or if leaving it makes the in-scope change
incorrect, in which case it was never adjacent, it was a caller, and §2 covers it.

---

## 5. DEVIATING FROM AN APPROVED PLAN

The protocol is `AGENTS.md` §1 PLAN-WORKFLOW LOCK, a hard blocker that outranks this
file. Read it there. This section deliberately does not restate it: a hard blocker
copied into a tier-3 document reads as though an operator instruction could outrank it.
What this file adds is the adjacent case, a frozen **scope** you believe is wrong.

---

## 6. AMENDMENT OVER ABSORPTION

Do not quietly build what you think was meant. Build what was specified, and in the
same response say what is wrong, what you would change it to, and what it would cost.
The operator decides.

---

## 7. FINISHING

`AGENTS.md` §3 Ownership & Completion binds: no early stop, no "natural checkpoint" on
incomplete work, no asking permission to continue an approved, in-scope step. Two
things are worth stating in scope terms:

- **When one part is genuinely blocked, finish every other part in full** then say
  explicitly what you left out and why. Scaling the work down is the operator's call.
- Proceeding without asking never waives a **mandatory wait** Gate 3, a
  PLAN-WORKFLOW LOCK approval, the worktree-versus-branch choice, the remote-push
  go-ahead, and every `blast-radius.md` stop-for-yes still block.

---

## 8. PLAN BEFORE ACTING

Scope you have not thought through is scope you will discover mid-edit, which is where
drift starts. Before the first change on any multi-step work, decide three things and
say them:

1. **Which files you will read first.** Reading first is `prevent-overengineering.md` §2's
   pre-write pass, and it is not repeated here, but *which* files is a scope decision,
   because the set you read is the set you will feel entitled to change.
2. **Which tools or commands will do the work.** Naming them up front is what catches
   the case where the plan needs something outside the frozen scope, while it is still
   cheap to raise.
3. **How the result will be verified.** `evidence-and-proof.md` §8 owns the proof plan;
   what belongs here is that a change with no named check is a change with no defined
   edge, and an undefined edge is where "while I was in there" gets in.

Three sentences is a plan. The failure this prevents is not disorganization, it is the
mid-task realization that the work needs a file nobody scoped, discovered at the moment
when editing it feels easier than asking.

---

## 9. SELF-CHECK

- [ ] Every file in my diff is in scope by §2, or has an explicit yes.
- [ ] Adjacent defects are recorded and reported, not fixed.
- [ ] Everything asked for is delivered, or listed as not delivered with a reason.
- [ ] No formatting or cleanup noise rides along with the real change.
- [ ] I named the files, the tools, and the check before the first edit.
- [ ] Nothing entered the plan that was not in the frozen scope.
