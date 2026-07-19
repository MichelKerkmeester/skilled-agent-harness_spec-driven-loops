---
title: "Doctor code-graph route policy"
description: "Doctor-code-graph route policy for the current read-only manifest, with future apply flags still not promoted."
trigger_phrases:
  - "doctor code graph apply"
  - "system-code-graph feature catalog"
  - "doctor apply mode"
importance_tier: "important"
version: 1.2.0.12
---

# Doctor code-graph route policy

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`/doctor code-graph` is a command-owned diagnostic policy surface. The route manifest currently marks the `- target: code-graph` block as `mutating: read-only` and grants only the shipped diagnostic flags. Apply and repair flags remain future-phase comments, not active command surface.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual slash command: `/doctor code-graph` with active target-specific flags (`--scope=stale|missed|bloat|all|excludes` and `--dry-run`) per the `.opencode/commands/doctor/_routes.yaml` `- target: code-graph` block. `--operation` and `--confirm` are not shipped active flags; they only appear in a future `phase_b` comment.

### Class

manual. Code-graph doctor diagnostics are operator-triggered. The current YAML refuses broad mutation outside packet-local scratch.

### Caveats / Fallback

The route manifest is marked `read-only` today. The current YAML keeps Phase A diagnostic-only, and apply/mutation remains a not-yet-promoted future `phase_b`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/doctor/_routes.yaml` `- target: code-graph` | Route manifest | defines the read-only mutation class, active `--scope` and `--dry-run` flags, and `mk-code-index` tool grants |
| `.opencode/commands/doctor/assets/doctor-code-graph.yaml` | Workflow YAML | states Phase A is diagnostic-only |
| `.opencode/commands/doctor/assets/doctor-code-graph.yaml` | Workflow YAML | forbids mutations outside packet-local scratch in the current workflow |
| `.opencode/commands/doctor/assets/doctor-code-graph.yaml` | Workflow YAML | defines discovery, analysis and proposal report phases |
| `.opencode/commands/doctor/assets/doctor-code-graph.yaml` | Workflow YAML | enforces approval and read-only output gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/doctor-code-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Doctor code graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `doctor-code-graph/doctor-apply-mode.md`

Related references:

- [../manual-scan-verify-status/code-graph-verify.md](../../feature-catalog/manual-scan-verify-status/code-graph-verify.md)
- [../../manual-testing-playbook/doctor-code-graph/doctor-apply-mode-policy.md](../../manual-testing-playbook/doctor-code-graph/doctor-apply-mode-policy.md)
