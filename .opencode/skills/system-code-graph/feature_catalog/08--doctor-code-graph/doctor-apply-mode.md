---
title: "Doctor code-graph route policy"
description: "Doctor-code-graph route policy that exposes mutating flags in the manifest while the current YAML keeps Phase A diagnostic-only until apply workflow promotion."
trigger_phrases:
  - "doctor code graph apply"
  - "system-code-graph feature catalog"
  - "doctor apply mode"
importance_tier: "important"
---

# Doctor code-graph route policy

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`/doctor code-graph` is a command-owned diagnostic and repair policy surface. The route manifest exposes future apply flags and `mk-code-index` tool grants. The current YAML keeps Phase A diagnostic-only and writes only packet-local scratch reports.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual slash command: `/doctor code-graph` with target-specific flags (`--scope`, `--operation`, `--dry-run`, `--confirm`) per `.opencode/commands/doctor/_routes.yaml:54-79`.

### Class

manual. Code-graph doctor diagnostics are operator-triggered. The current YAML refuses broad mutation outside packet-local scratch.

### Caveats / Fallback

The route manifest is marked `mutates` because it grants apply flags and future repair operations. The current YAML states Phase A is diagnostic-only at `.opencode/commands/doctor/assets/doctor_code-graph.yaml:20-23`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/doctor/_routes.yaml:54-79` | Route manifest | defines code-graph flags, mutation class and `mk-code-index` tool grants |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml:20-23` | Workflow YAML | states Phase A is diagnostic-only |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml:76-86` | Workflow YAML | forbids mutations outside packet-local scratch in the current workflow |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml:131-187` | Workflow YAML | defines discovery, analysis and proposal report phases |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml:191-206` | Workflow YAML | enforces approval and read-only output gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/08--doctor-code-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Doctor code graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--doctor-code-graph/doctor-apply-mode.md`

Related references:

- [../02--manual-scan-verify-status/code-graph-verify.md](../02--manual-scan-verify-status/code-graph-verify.md)
- [../../manual_testing_playbook/08--doctor-code-graph/doctor-apply-mode-policy.md](../../manual_testing_playbook/08--doctor-code-graph/doctor-apply-mode-policy.md)
