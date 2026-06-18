---
title: "Initialization"
description: "Initializes a fresh deep-improvement runtime packet with copied control artifacts and baseline state."
trigger_phrases:
  - "initialization"
  - "agent-improvement"
  - "initialize deep-improvement run"
  - "runtime packet setup"
  - "baseline state recording"
---

# Initialization

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Initializes a fresh deep-improvement runtime packet with copied control artifacts and baseline state.

This feature covers the setup path that resolves the target, creates the runtime folders, copies the control bundle, and records the first session metadata before any candidate is proposed.

---

## 2. HOW IT WORKS

Initialization is driven from the `/deep:agent-improvement` command plus the `deep_agent-improvement_{auto,confirm}.yaml` workflow assets. Both workflows gate the run to a fresh `new` session boundary, create `{spec_folder}/improvement/` plus `candidates/` and `benchmark-runs/`, scan the target integration surface, optionally generate a dynamic profile, copy the config, charter, strategy, and manifest templates, and append baseline state before the first loop iteration.

The runtime templates still use the `improvement_*` asset names in the skill folder, but the packet-local runtime files use the `agent-improvement-*` naming family declared in the config and the quick-reference docs. That naming split is intentional in the current implementation and shows up across the YAML workflows, config paths, and operator references.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/agent-improvement.md` | Command | Collects target path, spec folder, mode, and iteration inputs before the loop starts. |
| `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml` | Workflow | Creates the runtime directories, scans integration, generates the dynamic profile, and records the baseline in autonomous mode. |
| `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml` | Workflow | Mirrors the init path in interactive mode and adds approval gates before baseline recording. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_config.json` | Runtime template | Defines runtime paths, scoring weights, stop rules, and file protection defaults. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_charter.md` | Runtime template | Freezes the mission, policy boundary, audit-trail requirements, and legal-stop gates for the run. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_strategy.md` | Runtime template | Splits operator-owned hypothesis fields from reducer-owned progress fields. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/target_manifest.jsonc` | Runtime template | Carries target classification, dynamic-profile hooks, and fixed or forbidden surfaces. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/loop_protocol.md` | Reference | Describes the initialization sequence and copied runtime artifacts. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/quick_reference.md` | Reference | Confirms the packet-local runtime layout and runtime file naming. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/initialization.md`
Related references:
- [candidate-generation.md](candidate-generation.md) — Candidate generation
