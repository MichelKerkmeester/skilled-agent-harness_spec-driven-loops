---
title: "Goal Set-String Playbook"
description: "What an operator actually types when setting a packet's session goal: a pointer to the packet's goal document plus the completion criteria copied out."
trigger_phrases:
  - "set string playbook"
  - "session goal objective"
  - "goal pointer"
  - "copied completion criteria"
  - "set the goal"
  - "bind the goal"
  - "bind a packet goal"
  - "update the goal"
  - "resend the goal"
  - "goal log"
  - "packet goal"
  - "durable slice"
version: 3.11.0.0
---

# Goal Set-String Playbook

---

## 1. OVERVIEW

A packet's goal document can be as long as it needs to be. The objective an operator sets cannot: every runtime goal surface caps what it holds, and a slice that will not fit is truncated at the tail, which is exactly where the completion criteria live.

This playbook fixes the shape of what gets typed. The rule it complements checks the file: a phase parent or top-level `goal.md` warns past 3,000 durable characters and fails past 4,000, measured from the frontmatter's closing fence to the log anchor. Nothing can check what an operator pastes, so the shape below is guidance rather than a gate.

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

The durable slice has a budget for exactly this reason: the validator warns a parent past 3,000 characters and fails it past 4,000. Children are unbounded. If what you want to set is too long, cut in this order:

1. **The frontmatter.** It is never part of the slice. It is bookkeeping for the file, and it is stripped from every chat send, injection and objective before anything is measured.
2. **The log.** It is not part of the durable slice and never belongs in the objective.
3. **Restated child detail.** If the parent summarises what a child's goal document already says, delete the summary. The binding makes the child authoritative.
4. **Decision prose.** A decision needs to be recognisable, not argued. The argument belongs in the decision record.
5. **Criterion wording, never criterion count.** Shorten each bullet; do not drop one. A dropped criterion is a gate that stops existing.

If it still will not fit, the packet is trying to be one goal when it is two. Split it.

---

## 5. KEEPING THE OPERATOR'S COPY CURRENT

The objective the operator set is a copy of the durable slice, and copies drift.
The goal document is the source, so the agent working the packet owns the resync:

1. Whenever anything above the log changes (the objective, a decision, the
   binding table, a criterion), resend the durable slice of the parent
   `goal.md` in chat, unprompted and with the frontmatter stripped, so the
   operator can paste it over the session objective. Keep reminding while it
   stays unset. Never stop work because it is unset; only the operator stops
   work. After the operator sets it, acknowledge in one line and continue.
2. A child `goal.md` change that alters a parent decision or criterion is an
   amendment to the parent: apply it there first, then resend the parent. A
   child change that stays inside its own phase needs no resend.
3. Log entries never trigger a resend; the log is not part of the objective.

The template carries this rule in its directive section, so a scaffolded goal
document tells the next agent the same thing.

---

## 6. CREATING THE FILE

Nothing writes `goal.md` unasked. Two paths exist:

1. `create.sh ... --with-goal` scaffolds it with the other packet documents,
   at any level and on phase parents.
2. For an existing packet, render it by hand:

```bash
bash .opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh \
  --level <1|2|3|3+|phase> --out-dir <packet> \
  .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl
```

The `goal.md` in a packet and the session objective an operator sets with the
goal command are two different things that share a word. The document is the
source: it lives in the packet, carries the durable slice and the log, and is
what this playbook describes. The session objective is a string the runtime
holds for the current session and judges completion against. Nothing copies
one into the other; the resync rule in Section 5 is the bridge, and the
operator's hands carry it.

---

## 7. WORKED EXAMPLE

From a real four-phase packet whose durable slice measures 1,986 characters, well under the 3,000 warning tier:

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
