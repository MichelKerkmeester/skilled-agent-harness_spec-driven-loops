---
title: "Per-iteration lineage context refresh"
description: "Refreshes the next prompt's context line from the lineage-local state the reducer just rewrote."
trigger_phrases:
  - "per-iteration lineage context refresh"
  - "step_refresh_lineage_context"
  - "lineage context prompt line"
  - "iteration evidence persistence"
  - "incremental research context"
version: 1.14.0.14
---

# Per-iteration lineage context refresh

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Refreshes the next prompt's context line from the lineage-local state the reducer just rewrote.

Iteration evidence is already durable the moment the iteration file and its JSONL record land in the lineage directory, so nothing has to be shipped elsewhere to survive an interrupted loop. What the loop still needs each pass is a current summary to hand the next prompt, and that comes from the same directory.

---

## 2. HOW IT WORKS

The auto workflow runs `step_refresh_lineage_context` after iteration validation, reducer refresh, and graph upsert, and before result evaluation. `step_reduce_state` has just rewritten the dashboard, the findings registry and the strategy file, so the freshest view of the lineage is on disk when this step reads it.

If the read succeeds, its concise summary becomes the `lineage_context_prompt_line` for the next iteration; if a state file is missing or unreadable, the workflow keeps the previous context line and continues. No index, daemon or network call takes part, so there is no failure mode that can stall the loop from outside the lineage directory.

An earlier version of this step indexed each iteration through an MCP memory upsert and then re-queried that index for the summary. Both halves are gone: the evidence never left the lineage directory, and the summary now comes from the reducer's own output.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Workflow | Declares the lineage context refresh step and the prompt line it feeds. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts` | Vitest | Verifies step ordering, non-fatal behavior, and prompt context injection. |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/per-iteration-memory-upsert.md` | Manual playbook | Verifies lineage-local evidence persistence and context refresh behavior. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/per-iteration-memory-upsert.md`
Related references:
- [memory-save.md](../../feature-catalog/loop-lifecycle/memory-save.md) - Continuity save
- [iteration-dispatch.md](../../feature-catalog/loop-lifecycle/iteration-dispatch.md) - Iteration dispatch
