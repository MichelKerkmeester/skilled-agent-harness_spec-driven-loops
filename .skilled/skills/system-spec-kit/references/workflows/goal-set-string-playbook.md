---
title: "Goal Set-String Playbook"
description: "What an operator actually types when setting a packet's session goal: a pointer to the packet's goal document plus the completion criteria copied out."
trigger_phrases:
  - "set string playbook"
  - "set the goal"
  - "bind a packet goal"
  - "update the goal"
  - "resend the goal"
  - "goal log"
  - "packet goal"
  - "durable slice"
importance_tier: normal
contextType: implementation
version: 3.12.0.0
---

# Goal Set-String Playbook

---

## 1. OVERVIEW

A packet's goal document can be as long as it needs to be. The objective an operator sets cannot: every runtime goal surface caps what it holds, and a slice that will not fit is truncated at the tail, which is exactly where the completion criteria live.

Goal authoring belongs to `sk-create-goal`, run through `/create:goal`. Its [budget-and-handoff.md](../../../sk-doc/sk-create-goal/references/budget-and-handoff.md) holds the budget, the one cut order and what a parent goal sent in chat contains, and its [parent-and-nested-goals.md](../../../sk-doc/sk-create-goal/references/parent-and-nested-goals.md) holds precedence and amendments. This playbook covers what system-spec-kit owns: the set string a runtime binds and when a changed goal is resent.

This playbook fixes the shape of what gets typed. The rule it complements checks the file: a phase parent or top-level `goal.md` has one limit, 4,000 durable characters, measured from the frontmatter's closing fence to the log anchor. Up to 4,000 passes and past it fails. Nothing can check what an operator pastes, so the shape below is guidance rather than a gate.

---

## 2. THE SHAPE

```text
Execute specs/<track>/<packet>/goal.md.

BINDING: read each phase's goal.md before working that phase; its criteria bind
as if written here. PRECEDENCE: parent decisions outrank child detail; child
detail outranks any summary of it.

DONE WHEN:
- <criterion copied verbatim from the packet's goal document>
- <criterion>
- <criterion>
```

Three parts, in this order:

1. **The pointer.** One line naming the packet's goal document. Roughly 60 characters.
2. **The binding and precedence sentence.** Two sentences that turn the reference into an obligation. Without them the pointer is a citation, and a citation gets skimmed.
3. **The completion criteria, copied.** Not referenced. Copied.

---

## 3. WHY THE CRITERIA ARE COPIED

Nothing dereferences a path inside an objective string. Every goal surface in this repository is string-in, string-out: the working agent can open the file because it has tools, but whatever judges completion sees only the stored string.

Leave the criteria in the file alone and the evaluator is judging a table of contents. Copy them and it can judge the packet. This is the one duplication the design accepts. The rules for writing criteria that survive the copy are section 4 of `sk-create-goal`'s [authoring-standards.md](../../../sk-doc/sk-create-goal/references/authoring-standards.md).

---

## 4. WHEN IT WILL NOT FIT

The validator fails a parent past 4,000 durable characters. That is the one limit, with no warning tier below it, so a parent under 4,000 needs no cutting. Which goals carry it is section 2 of [budget-and-handoff.md](../../../sk-doc/sk-create-goal/references/budget-and-handoff.md): a child is unbounded unless it is itself a phase parent. When a parent is over, cut it in the order section 3 of [budget-and-handoff.md](../../../sk-doc/sk-create-goal/references/budget-and-handoff.md) gives, which is the one full cut order.

---

## 5. RESENDING THE PARENT GOAL

The objective the operator set is a copy of the parent goal, and copies drift.
The goal document is the source, so the agent working the packet owns the resync:

1. Whenever anything above the log changes (the objective, a decision, the
   binding table, a criterion), resend the parent's `chat_slice`, unprompted,
   so the operator can paste it over the session objective. `node
   .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo root>`
   prints it, JSON-quoted. What that slice contains, and the `packet_budget=ok`
   check before it is sent, are section 4 of [budget-and-handoff.md](../../../sk-doc/sk-create-goal/references/budget-and-handoff.md). It
   is a different payload from the Section 2 shape, which is what a runtime
   stores when it binds the packet. Keep reminding while it stays unset. Never
   stop work because it is unset: only the operator stops work. After the
   operator sets it, acknowledge in one line and continue.
2. A child `goal.md` change that alters a parent decision or criterion is a
   parent amendment, handled as section 6 of
   [parent-and-nested-goals.md](../../../sk-doc/sk-create-goal/references/parent-and-nested-goals.md) says. A child change that stays inside
   its own phase needs no resend.
3. Log entries never trigger a resend, because the log is not part of the objective.

---

## 6. CREATING THE FILE

Nothing writes `goal.md` unasked. Two paths exist:

1. `create.sh ... --with-goal` scaffolds it with the other packet documents.
   With `--phase` it writes a `goal.md` into each new child only.
   `--level phase-parent --with-goal` writes a parent goal.
2. `/create:goal <packet> <operation>` authors any goal from `sk-create-goal`'s
   per-kind templates: `phase-parent` for a parent, `phase-add` or `child` for
   a new phase, `amend` for a change and `retrofit` for a packet that has none.

The `goal.md` in a packet and the session objective an operator sets with the
goal command are two different things that share a word. The document is the
source: it lives in the packet, carries the durable slice and the log, and is
what this playbook describes. The session objective is a string the runtime
holds for the current session and judges completion against. Nothing copies
one into the other. The resync rule in Section 5 is the bridge, and the
operator's hands carry it.

---

## 7. WORKED EXAMPLE

From a real four-phase packet whose durable slice measures 1,986 characters, well under the 4,000 limit:

```text
Execute specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md.

BINDING: read each phase's goal.md before working that phase; its criteria bind
as if written here. PRECEDENCE: parent decisions outrank child detail; child
detail outranks any summary of it.

DONE WHEN:
- validate.sh --strict recursive over this packet exits 0
- Every phase reports its acceptance criteria closeable
- The document resolves to a template at 1/2/3/3+/phase and to nothing at review
- A packet with no goal document validates exactly as before
```

That set string is 529 characters. The packet's goal document is 4,243. The
difference is what the pointer buys.

---

## 8. RELATED

| Document | Role |
|---|---|
| [validation-rules.md](../validation/validation-rules.md) | `SPEC_DOC_SUFFICIENCY`, whose goal diagnostics check the durable budget and the binding table |
| [quick-reference.md](./quick-reference.md) | First-touch command surface |
| [budget-and-handoff.md](../../../sk-doc/sk-create-goal/references/budget-and-handoff.md) | `sk-create-goal`: the budget, the one cut order and what a parent goal sent in chat contains |
| [parent-and-nested-goals.md](../../../sk-doc/sk-create-goal/references/parent-and-nested-goals.md) | `sk-create-goal`: parent, child, phase-add and retrofit authoring, precedence and amendments |
