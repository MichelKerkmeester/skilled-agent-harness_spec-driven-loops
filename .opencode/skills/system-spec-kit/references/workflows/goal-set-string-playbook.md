---
title: "Goal Set-String Playbook"
description: "What an operator actually types when setting a packet's session goal: a pointer to the packet's goal document plus the completion criteria copied out."
trigger_phrases:
  - "set string playbook"
  - "session goal objective"
  - "goal pointer"
  - "copied completion criteria"
---

# Goal Set-String Playbook

---

## 1. OVERVIEW

A packet's goal document can be as long as it needs to be. The objective an operator sets cannot: every runtime goal surface caps what it holds, and a slice that will not fit is truncated at the tail, which is exactly where the completion criteria live.

This playbook fixes the shape of what gets typed. The rule it complements checks the file; nothing can check what an operator pastes, so this is guidance rather than a gate.

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

Leave the criteria in the file alone and the evaluator is judging a table of contents. Copy them and it can judge the packet. This is the one duplication the design accepts, and it is why the packet's own criteria must stay checkable without opening anything else.

---

## 4. WHEN IT WILL NOT FIT

The durable slice has a budget for exactly this reason, and the rule reports a slice that exceeds it. If what you want to set is too long, cut in this order:

1. **The log.** It is not part of the durable slice and never belongs in the objective.
2. **Restated child detail.** If the parent summarises what a child's goal document already says, delete the summary. The binding makes the child authoritative.
3. **Decision prose.** A decision needs to be recognisable, not argued. The argument belongs in the decision record.
4. **Criterion wording, never criterion count.** Shorten each bullet; do not drop one. A dropped criterion is a gate that stops existing.

If it still will not fit, the packet is trying to be one goal when it is two. Split it.

---

## 5. WORKED EXAMPLE

From a real four-phase packet whose durable slice measures 1,986 characters against a 3,000 budget:

```text
Execute specs/system-speckit/042-nested-goal-template-addon/goal.md.

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

## 6. RELATED

| Document | Role |
|---|---|
| [validation-rules.md](../validation/validation-rules.md) | The rule that checks the file's shape and the durable budget |
| [quick-reference.md](./quick-reference.md) | First-touch command surface |
