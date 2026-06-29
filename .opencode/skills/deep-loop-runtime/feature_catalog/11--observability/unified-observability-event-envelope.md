---
title: "Unified observability event envelope"
description: "Adds a unified observability event envelope and routes core runtime emitters through it without migrating legacy rows."
trigger_phrases:
  - "unified observability event envelope"
  - "unified-observability-event-envelope"
  - "unified observability event envelope deep-loop-runtime"
  - "observability unified observability event envelope"
version: 1.4.0.15
---

# Unified observability event envelope

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a unified observability event envelope and routes core runtime emitters through it without migrating legacy rows.

This feature belongs to the observability group and is catalogued as F047 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

`observability-events.cjs` normalizes payloads into `schema_version`, `event_id`, `producer`, `stream`, `subject`, `event`, `status`, and native `payload`; fanout-run, convergence, status, council round-state, and research YAML producers append through it.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/observability-events.cjs` | Runtime | unified observability event envelope. |
| `lib/council/round-state-jsonl.cjs` | Runtime | unified observability event envelope. |
| `scripts/convergence.cjs` | Runtime | unified observability event envelope. |
| `scripts/fanout-run.cjs` | Runtime | unified observability event envelope. |
| `scripts/status.cjs` | Runtime | unified observability event envelope. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Integration | unified observability event envelope. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/observability-events.vitest.ts` | Test | Primary regression coverage for Unified observability event envelope. |
| `tests/integration/status-script.vitest.ts` | Test | Primary regression coverage for Unified observability event envelope. |

---

## 4. SOURCE METADATA

- Group: Observability
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F047
- Feature file path: `11--observability/unified-observability-event-envelope.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/006-ux-observability-automation/003-unified-observability-event-envelope`
- Primary sources: `lib/deep-loop/observability-events.cjs`, `lib/council/round-state-jsonl.cjs`, `scripts/convergence.cjs`, `scripts/fanout-run.cjs`, `scripts/status.cjs`, `.opencode/commands/deep/assets/deep_research_auto.yaml`, `tests/unit/observability-events.vitest.ts`, `tests/integration/status-script.vitest.ts`
Related references:
- [observability](../11--observability/) — Observability category
