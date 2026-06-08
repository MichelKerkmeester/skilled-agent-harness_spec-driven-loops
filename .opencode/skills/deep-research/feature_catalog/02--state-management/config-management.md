---
title: "Config management"
description: "Defines the immutable deep-research loop contract, file protections, and runtime capability pointers."
trigger_phrases:
  - "config management"
  - "deep-research-config.json"
  - "manage research config"
  - "runtime capability matrix"
  - "immutable loop contract"
---

# Config management

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Defines the immutable deep-research loop contract, file protections, and runtime capability pointers.

Config management keeps the packet honest about what may change during the loop and what must stay fixed. It is also where runtime-specific mirrors are described without changing the core packet shape.

---

## 2. HOW IT WORKS

`deep-research-config.json` is created during initialization and then treated as immutable. It stores the topic, iteration and time budgets, convergence and stuck thresholds, `progressiveSynthesis`, execution mode, lineage state, reducer file paths, pause sentinel path, archive root, migration window, and file-protection rules such as append-only JSONL and auto-generated dashboard or registry outputs.

The config also points at the runtime capability matrix and resolver script. `runtime_capabilities.json` lists the OpenCode, Claude, and Codex mirrors with their tool surfaces, hook behavior, and schema-adaptation notes. `runtime-capabilities.cjs` loads and validates that machine-readable matrix so the runtime documentation stays synchronized with the same capability source.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-research/assets/deep_research_config.json` | Asset | Defines the default config fields, reducer paths, file protections, and optimizer-managed knobs. |
| `.opencode/skills/deep-research/references/state/state_format.md` | Reference | Defines the config schema, field meanings, and file-protection map. |
| `.opencode/skills/deep-research/assets/runtime_capabilities.json` | Asset | Defines the machine-readable runtime capability matrix for supported mirrors. |
| `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs` | Script | Loads and validates the capability matrix and resolves runtime records by ID. |
| `.opencode/skills/deep-research/SKILL.md` | Skill | Publishes the live lifecycle modes, capability-path references, and optimizer-managed config fields. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-research/manual_testing_playbook/01--entry-points-and-modes/parameterized-invocation-max-iterations-convergence.md` | Manual playbook | Verifies runtime flags reach the live config surface. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Vitest | Verifies canonical artifacts, command assets, and runtime capability matrix references stay aligned. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/config-management.md`
Related references:
- [strategy-tracking.md](strategy-tracking.md) — Strategy tracking
