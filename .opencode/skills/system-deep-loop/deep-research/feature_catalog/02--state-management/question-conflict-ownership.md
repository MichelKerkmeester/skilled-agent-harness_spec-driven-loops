---
title: "Question conflict ownership"
description: "Makes the registry the canonical question owner and records inbox disagreements as explicit conflict events."
trigger_phrases:
  - "question conflict ownership"
  - "question_conflict event"
  - "resolveQuestionConflicts"
  - "key-questions generated projection"
  - "inbox registry conflict"
version: 1.14.0.13
---

# Question conflict ownership

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Makes the registry the canonical question owner and records inbox disagreements as explicit conflict events.

This feature removes the overwrite race between injected questions and reducer-rendered strategy anchors. Inbox rows remain immutable input, the registry owns question state, and the reducer is the only writer for the generated key-question projection.

---

## 2. HOW IT WORKS

`resolveQuestionConflicts()` compares incoming inbox records with existing registry-owned questions by promoted question id, inbox id, or normalized text identity. When a row targets an existing question but carries different text, the reducer keeps the registry value and stores a conflict record with `operatorDecision`, `inboxValue`, and `registryValue`.

The workflow surfaces those disagreements through `question_conflict` JSONL events. Supported operator decisions are `accepted`, `rejected`, `superseded`, and `needs_decision`; unresolved conflicts default to `needs_decision` so the loop does not silently choose a winner.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer | Resolves inbox and registry conflicts and emits conflict records. |
| `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_strategy.md` | Asset | Marks key questions as a generated reducer projection and documents conflict handling. |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state_reducer_registry.md` | Reference | Documents inbox, registry, and reducer ownership boundaries. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Records reducer-discovered `question_conflict` events in the loop state. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Vitest | Verifies conflict records, operator decisions, and event payload fields. |
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/question-conflict-ownership.md` | Manual playbook | Verifies conflict ownership and generated key-question behavior. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/question-conflict-ownership.md`
Related references:
- [injection-inbox-provenance.md](injection-inbox-provenance.md) - Injection inbox provenance
- [strategy-tracking.md](strategy-tracking.md) - Strategy tracking
