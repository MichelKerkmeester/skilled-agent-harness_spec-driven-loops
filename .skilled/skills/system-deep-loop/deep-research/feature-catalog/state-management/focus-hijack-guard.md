---
title: "Next Focus free-text guard"
description: "Deep-research Next Focus skips answered questions and status sentences and reads the latest leaf's Recommended Next Focus, so free text cannot hijack the next focus."
trigger_phrases:
  - "next focus free text"
  - "next focus hijack"
  - "answered questions next focus"
  - "Recommended Next Focus"
version: 1.0.0.0
---

# Next Focus free-text guard

## 1. OVERVIEW

The research next focus comes from the carried-forward open questions and the latest leaf. Answered questions and status sentences are dropped from the carried-forward list, and the focus reads the leaf's `Recommended Next Focus`. Free text in a status line does not replace the focus.

## 2. HOW IT WORKS

### Carried-Forward Questions

`buildCarriedForwardOpenQuestions` in `runtime/lib/deep-loop/continuity-thread.cjs` drops answered keys and applies a question-shape rule, so a status sentence is not carried forward as an open question.

### Focus Derivation

`deriveNextFocusFromContinuity` in the same file derives the focus from the continuity thread. `resolveNextFocus` in `deep-research/scripts/reduce-state.cjs` derives it from the latest leaf's `Recommended Next Focus`, and the registry build passes the answered and resolved question set into the carried-forward list.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` | Shared | Carried-forward question filter and continuity-thread focus derivation. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Script | Next Focus resolution from the latest leaf and the answered-question input to the registry. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/continuity-thread.vitest.ts` | Vitest | Order, question-shape and answered-filter cases. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Vitest | Answered-filter, stale-status-sentence and leaf-reader cases. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | Manual playbook | DR-066: Next Focus skips answered free text and status sentences. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-management/focus-hijack-guard.md`

Related references:
- [question-conflict-ownership.md](question-conflict-ownership.md) - Question conflict ownership
- [strategy-tracking.md](strategy-tracking.md) - Strategy tracking
