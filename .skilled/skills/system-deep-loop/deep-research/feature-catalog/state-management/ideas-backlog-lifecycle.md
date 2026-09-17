---
title: "Ideas backlog lifecycle"
description: "Separates one-off idea observations from reducer-promoted backlog candidates and durable rejection state."
trigger_phrases:
  - "ideas backlog lifecycle"
  - "idea_observed"
  - "idea_promoted"
  - "minIdeaObservations"
  - "reducer-promoted ideas"
version: 1.14.0.13
---

# Ideas backlog lifecycle

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Separates one-off idea observations from reducer-promoted backlog candidates and durable rejection state.

The ideas backlog lets the loop remember useful tangents without letting a single leaf-agent observation become an authoritative next focus. Promotion is threshold-gated and reducer-owned.

---

## 2. HOW IT WORKS

Leaf agents may append `idea_observed` rows only when the dispatch explicitly allows packet-local idea capture. They must not append `idea_promoted` or `idea_rejected`; the reducer owns promotion, ranking, and suppression.

`reduce-state.cjs` groups observations by idea id, applies the configured `minIdeaObservations` threshold, and emits one idempotent `idea_promoted` event when the threshold is reached. Promoted ideas are ranked by observation count, latest observation, and first observation. `idea_rejected` integrates with the rejected-pattern cache so rejected ideas disappear from promoted lists and future focus candidates until a removal or reset event clears the active rejection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer | Accumulates observations, emits idempotent promotions, ranks ideas, and suppresses rejected ideas. |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Reference | Documents observed, promoted, and rejected lifecycle semantics. |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md` | Reference | Defines idea lifecycle event payloads. |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Workflow | Reads idea thresholds and checks promoted or suppressed idea counts before dispatch. |
| `.opencode/agents/deep-research.md` | Agent | Allows leaf agents to emit `idea_observed` only under explicit dispatch permission. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Vitest | Verifies threshold promotion, idempotence, ranking, and rejection suppression. |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/ideas-backlog-lifecycle.md` | Manual playbook | Verifies observed-only leaf behavior and reducer-owned promotion. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-management/ideas-backlog-lifecycle.md`
Related references:
- [rejected-pattern-cache.md](../../feature-catalog/state-management/rejected-pattern-cache.md) - Rejected-pattern cache
- [strategy-tracking.md](../../feature-catalog/state-management/strategy-tracking.md) - Strategy tracking
