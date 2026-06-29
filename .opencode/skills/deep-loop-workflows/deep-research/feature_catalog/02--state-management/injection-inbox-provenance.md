---
title: "Injection inbox provenance"
description: "Adds `research/inbox.jsonl` as the canonical late-question injection surface with reducer-carried provenance."
trigger_phrases:
  - "injection inbox provenance"
  - "research inbox.jsonl"
  - "question origin provenance"
  - "late question injection"
  - "legacy-import question source"
version: 1.14.0.13
---

# Injection inbox provenance

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Adds `research/inbox.jsonl` as the canonical late-question injection surface with reducer-carried provenance.

The inbox lets operators and analyst flows add questions during an active run without editing reducer-owned markdown anchors directly. Each accepted question keeps its origin so the registry, strategy, and dashboard can explain where it came from.

---

## 2. HOW IT WORKS

`inbox.jsonl` is append-only input under the research packet. Records carry `id`, `text`, `source`, `origin`, `injectedAtIteration`, and optional `promotedQuestionId`. On each reduce step, `reduce-state.cjs` reads the inbox, normalizes valid rows, and projects the questions into open and resolved question state with provenance fields intact.

Direct edits to the strategy key-question block still work as compatibility input, but they are attributed as `legacy-import`. The strategy template documents the inbox as the preferred injection path and warns that reducer-owned projections may replace direct markdown edits on the next reduce pass.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reducer | Reads `inbox.jsonl`, normalizes provenance, and carries origins into registry-derived question state. |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Asset | Documents the inbox schema and legacy-import compatibility behavior. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Vitest | Verifies inbox questions appear with provenance in registry, strategy, and dashboard output. |
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/injection-inbox-provenance.md` | Manual playbook | Verifies late-question provenance and legacy-import behavior. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/injection-inbox-provenance.md`
Related references:
- [strategy-tracking.md](strategy-tracking.md) - Strategy tracking
- [question-conflict-ownership.md](question-conflict-ownership.md) - Question conflict ownership
