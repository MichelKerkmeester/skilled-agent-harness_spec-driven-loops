---
title: "ADR: Anchor Ownership and Injected-Question Conflict Merge"
description: "Make key-questions a generated projection from the canonical question registry: inbox is immutable input, registry is canonical state, and the reducer is the sole renderer."
trigger_phrases:
  - "anchor ownership conflict ADR"
  - "injected question conflict"
  - "question_conflict event"
  - "key-questions generated projection"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# ADR: Anchor Ownership and Injected-Question Conflict Merge

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. Context

Injected questions from the research inbox and the reducer's `key-questions` rewrite could target the same strategy anchor in the same reduce step. Before this phase, there was no declared owner for that anchor: whichever writer ran last could silently win, with no conflict record, no event, and no durable operator decision.

The preceding inbox-provenance phase froze the inbox as an input surface. This phase needed to decide how inbox records interact with reducer-owned strategy state without reopening the inbox schema or generalizing the model across other loop modes.

---

## 2. Decision

Make `key-questions` a generated projection from the canonical question registry:

- The inbox is immutable input.
- The question registry is canonical state.
- The reducer is the sole renderer of the `key-questions` markdown section.
- `resolveQuestionConflicts()` detects disagreement between an inbox question and an existing registry entry.
- Operator decisions are recorded as `accepted`, `rejected`, `superseded`, or `needs_decision` in the registry.
- Disagreements emit a `question_conflict` JSONL event containing both the inbox value and the registry value instead of silently overwriting markdown.

Direct edits to the generated `key-questions` block are not treated as a second canonical writer; they flow through the legacy import path established by the inbox-provenance work.

---

## 3. Alternatives Considered

| Alternative | Verdict | Why |
|-------------|---------|-----|
| Keep last-writer-wins markdown behavior | REJECTED | It preserves the silent overwrite race and gives operators no audit trail for disagreements. |
| Let inbox injections write directly to `key-questions` | REJECTED | The inbox is an input queue, not canonical state; allowing direct writes would keep two owners for one anchor. |
| Block the run on every disagreement | REJECTED | Some conflicts can be carried as `needs_decision` without stopping progress; the key requirement is that they are visible and recorded. |
| Registry-owned projection rendered only by the reducer | CHOSEN | It establishes one owner for the markdown anchor while preserving inbox provenance and operator decision history. |

---

## 4. Consequences

- `key-questions` is deterministic output from registry state rather than an editable source of truth.
- Inbox/registry disagreements are observable through `question_conflict` events.
- Operator decisions become durable registry data instead of implied markdown state.
- Manual edits to generated questions require the legacy import path to become canonical.
- Unresolved conflicts can accumulate as `needs_decision`; operators must review those records instead of relying on markdown ordering.

---

## 5. Migration Guide (informational, not executed here)

Future reducer changes must preserve the ownership split: inbox records remain immutable inputs, registry rows remain canonical state, and `key-questions` remains reducer-rendered output. Any new conflict surface should emit structured events with both competing values and a durable operator decision field before changing rendered markdown.
