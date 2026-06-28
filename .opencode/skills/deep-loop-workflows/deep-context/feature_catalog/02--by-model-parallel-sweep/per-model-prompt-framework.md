---
title: "Per-Model Prompt Framework"
description: "Applies the correct prompt framework to each seat's rendered prompt based on model identity before dispatch: COSTAR for MiMo, TIDD-EC for MiniMax/DeepSeek, no wrapper for native seats."
trigger_phrases:
  - "per-model prompt framework"
  - "COSTAR prompt"
  - "TIDD-EC prompt"
  - "prompt framing deep context"
  - "sk-prompt-models seat"
  - "lineage prompt contract"
version: 1.2.0.3
---

# Per-Model Prompt Framework

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Applies the correct prompt framework to each seat's rendered prompt based on its model identity before dispatch.

Every seat in the heterogeneous pool receives a prompt built from the same four-part lineage contract, but the wrapper framework differs by model. A seat told only "analyze" returns generic noise; the correct framework channels each model's strengths toward the structured finding schema the host expects. Per-model framing is resolved via `sk-prompt-models` before any seat is dispatched.

---

## 2. HOW IT WORKS

### Lineage Contract (Mandatory for All Seats)

Every seat prompt must carry four elements in order:
1. **gather-subject** — the feature/area the pool is gathering context for
2. **scope/slice** — the shared current_focus for this iteration (identical for all seats)
3. **known-context** — prior confirmed reuse candidates and frontier state
4. **output schema** — the exact structured finding JSON the host expects back

Omitting any element degrades the seat's output quality and reduces its agreement contribution.

### Framework Resolution

`step_render_seat_prompts` reads each seat's `promptFramework` field from `config.fanout.executors` and resolves the wrapper via `sk-prompt-models`:

| Model Family | Framework | Notes |
|---|---|---|
| MiMo-v2.5-Pro (Xiaomi) | COSTAR | Best framework per benchmark; applied to cli-opencode MiMo seats |
| MiniMax M3/M2.7 | TIDD-EC | Applied to cli-opencode MiniMax seats |
| DeepSeek-v4-pro | TIDD-EC | Applied to cli-opencode DeepSeek seats |
| GPT (cli-codex) | None | codex exec carries its own alignment; no framework wrapper |
| Native @deep-context | None | Agent SKILL.md contract is the framework; no additional wrapper |

### Rendered Prompt Storage

Each seat's rendered prompt is stored at `{prompt_dir}/iter-{NNN}/{seat.label}.md` before any dispatch begins. CLI seat invocations source the prompt body from this file path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_render_seat_prompts` — per-seat prompt rendering and framework resolution |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Reference | Canonical model-to-framework mapping and per-model dispatch guidance |
| `.opencode/commands/deep/context.md` | Command | Per-model prompt framing note in PRE-BOUND SETUP ANSWERS schema and pool resolution section |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/02--by-model-parallel-sweep/per-model-prompt-framework.md` | Manual playbook | Verifies framework assignment per model and four-part lineage contract presence in rendered prompts |

---

## 4. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--by-model-parallel-sweep/per-model-prompt-framework.md`

Related references:
- [cli-council-seats.md](cli-council-seats.md) — CLI seats that receive the rendered prompt body
- [native-task-batch.md](native-task-batch.md) — Native seats that receive the rendered prompt as their context_source
