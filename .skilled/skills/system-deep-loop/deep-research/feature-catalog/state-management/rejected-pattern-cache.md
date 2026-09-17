---
title: "Rejected-pattern cache"
description: "Builds a bounded reducer-owned cache that suppresses rejected candidates before they re-enter focus selection."
trigger_phrases:
  - "rejected-pattern cache"
  - "idea_rejected suppression"
  - "rejectedPatternIndex"
  - "suppressedCandidates"
  - "rejected idea reset"
version: 1.14.0.13
---

# Rejected-pattern cache

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Builds a bounded reducer-owned cache that suppresses rejected candidates before they re-enter focus selection.

Rejected ideas and rejected question patterns become durable state instead of disappearing into prose. The loop can avoid repeating work the operator already ruled out while still allowing explicit removal or reset events.

---

## 2. HOW IT WORKS

The JSONL protocol accepts `idea_rejected`, `idea_rejected_removed`, and `idea_rejected_reset` events, with legacy camelCase aliases still replayable. The reducer derives `rejectedPatternIndex` from those events, caps the active cache at 100 entries, and evicts the oldest active entry with a warning when the cap is exceeded.

Candidate filtering checks exact normalized text first, then applies category-compatible fuzzy matching using `rejectedPatternFuzzyThreshold` when present. The auto workflow consults reducer-derived `rejectedPatterns`, `rejectedPatternIndex`, and `suppressedCandidates` before next-focus, recovery, or ideas-backed candidates are dispatched.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer | Derives the bounded rejected-pattern index and filters rejected candidates. |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md` | Reference | Defines rejected-pattern lifecycle event records. |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Reference | Documents suppression ordering, fuzzy matching, and overflow policy. |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Workflow | Runs the rejected-pattern check before candidate selection. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Vitest | Verifies exact suppression, removal, reset, bounded derivation, and fuzzy category matching. |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/rejected-pattern-cache.md` | Manual playbook | Verifies rejected candidates stay out until removed or reset. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-management/rejected-pattern-cache.md`
Related references:
- [ideas-backlog-lifecycle.md](../../feature-catalog/state-management/ideas-backlog-lifecycle.md) - Ideas backlog lifecycle
- [strategy-tracking.md](../../feature-catalog/state-management/strategy-tracking.md) - Strategy tracking
