---
title: "Memory save"
description: "Refreshes the deep research continuity artifact through the supported generate-context.js save path."
trigger_phrases:
  - "memory save"
  - "save research context"
  - "generate-context.js"
  - "continuity artifact"
  - "preserve research packet"
version: 1.14.0.8
---

# Memory save

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Refreshes the deep research continuity artifact through the supported `generate-context.js` save path.

Memory save is the loop's final preservation step. It hands the finished packet to the broader continuity system without making the research workflow responsible for ad hoc memory authoring.

---

## 2. HOW IT WORKS

The live save contract is narrow. After synthesis, the workflows call `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json {spec_folder}` and treat that command as the supported save boundary. The loop does not define an additional indexing phase inside its own contract.

The save rules also reject manual writes under `memory/`. The command entrypoint and YAML workflows explicitly mark hand-authored continuity artifacts as unsupported for this path. The workflow expects the save script to produce the support artifact and then verifies the result instead of building those files itself.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/research.md` | Command | Defines the save phase and memory integration notes for the command entrypoint. |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md` | Reference | Defines the save phase and its verification step. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Runs `generate-context.js` in autonomous mode and marks manual memory authoring as invalid. |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Workflow | Runs the same save flow with confirm-mode review gates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/final_synthesis_memory_save_and_guardrail_behavior.md` | Manual playbook | Verifies the save phase uses the supported continuity path after synthesis. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Vitest | Verifies the command assets stay aligned on reducer execution and canonical deep-research packet references. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `loop-lifecycle/memory-save.md`
Related references:
- [synthesis.md](synthesis.md) — Synthesis
- [resource-map-emission.md](../loop_lifecycle/resource_map_emission.md) — Resource Map Emission
