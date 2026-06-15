---
title: "Contradiction Surfacing"
description: "Detects and records CONTRADICTS pairs when two executor seats assert incompatible contracts for the same unit_id, persisting them in the registry and coverage graph without silent resolution."
trigger_phrases:
  - "contradiction surfacing"
  - "contradicts pair"
  - "incompatible signatures"
  - "CONTRADICTS edge"
  - "contradiction detection"
  - "conflicting findings"
---

# Contradiction Surfacing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Detects and records `CONTRADICTS` pairs when two executor seats assert incompatible contracts for the same `unit_id`, persisting them in the registry and coverage graph without silent resolution.

Contradictions are first-class output in `deep-context`. When two seats find the same `file:symbol` but assert incompatible signatures or reuse verbs, that disagreement is more informative than either seat's individual finding. Silent resolution — picking one seat's version without flagging the conflict — hides risk and makes confidence look cleaner than the evidence warrants.

---

## 2. HOW IT WORKS

### Detection Condition

During `step_merge_findings`, when two or more seats emit findings for the same `unit_id` with incompatible values in `signature` or `reuse` (the reuse verb — extend, compose, wrap, import), the host records a `CONTRADICTS` pair. Compatible findings (same signature, same reuse verb) contribute to the agreement count normally.

### Persistence

Detected contradictions are captured in `contradictions_json` and flow into three surfaces:
1. **`findings-registry.json` `contradictions` array** — refreshed by `step_update_registry` on each iteration
2. **Coverage-graph `CONTRADICTS` edges** — written by `step_graph_upsert` via `upsert.cjs`
3. **Context Report "Gaps & Unknowns" section** — listed explicitly so downstream consumers see the conflict

### Non-Resolution Rule

Contradictions are never silently resolved in the merge layer. When the host cannot reconcile from evidence (e.g. both seats cite different file:lines that both verify), the contradiction is surfaced as-is. The `@deep-context` agent is expected to surface contradictions in its finding set rather than picking one side (per its ESCALATE rule 4).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_merge_findings` algorithm step 7: CONTRADICTS pair detection and contradictions_json output |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Shared | `ContextRelation.CONTRADICTS` — relation type for contradiction edges |
| `.opencode/agents/deep-context.md` | Agent | ESCALATE rule 4: surface evidence-contradicting-known-context pairs with citations |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/03--agreement-merge/contradiction-surfacing.md` | Manual playbook | Verifies CONTRADICTS pair detection, registry persistence, and report surface when two seats disagree on a signature |

---

## 4. SOURCE METADATA

- Group: Agreement Merge
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--agreement-merge/contradiction-surfacing.md`

Related references:
- [finding-dedup-by-symbol.md](finding-dedup-by-symbol.md) — Dedup step within which contradictions are detected
- [context-node-kinds-relations.md](../06--coverage-graph-schema/context-node-kinds-relations.md) — CONTRADICTS edge weight (0.8) in the coverage graph
