---
title: "Per-iteration memory upsert"
description: "Indexes each completed iteration into Spec Kit Memory before the next prompt is rendered."
trigger_phrases:
  - "per-iteration memory upsert"
  - "step_memory_upsert_iteration"
  - "memory_context refresh"
  - "memory_save iteration file"
  - "incremental research memory"
version: 1.14.0.13
---

# Per-iteration memory upsert

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Indexes each completed iteration into Spec Kit Memory before the next prompt is rendered.

The upsert step reduces the loss window for interrupted loops. Iteration evidence can reach memory as the run progresses instead of waiting for final synthesis and the end-of-run continuity save.

---

## 2. HOW IT WORKS

The auto workflow runs `step_memory_upsert_iteration` after iteration validation, reducer refresh, and graph upsert. The step calls `memory_save({ filePath: "{state_paths.iteration_pattern}" })` on the canonical iteration evidence file and treats MCP errors or timeouts as advisory rather than fatal.

Before the next dispatch prompt is rendered, `step_refresh_memory_context` calls `memory_context()` in focused mode. If that refresh succeeds, its concise summary becomes the `memory_context_prompt_line` for the next iteration; if it fails, the workflow keeps the previous context line and continues.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Adds the iteration memory upsert and focused memory-context refresh steps. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts` | Vitest | Verifies step ordering, non-fatal behavior, and prompt context injection. |
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis-save-and-guardrails/per-iteration-memory-upsert.md` | Manual playbook | Verifies incremental memory persistence and context refresh behavior. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `loop-lifecycle/per-iteration-memory-upsert.md`
Related references:
- [memory-save.md](memory-save.md) - Memory save
- [iteration-dispatch.md](iteration-dispatch.md) - Iteration dispatch
