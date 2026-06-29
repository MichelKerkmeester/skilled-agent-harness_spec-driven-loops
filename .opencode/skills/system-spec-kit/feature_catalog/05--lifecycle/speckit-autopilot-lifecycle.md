---
title: "Speckit autopilot lifecycle"
description: "Documents the branch-preserved :autopilot/:unattended SpecKit command envelope for plan, implement and complete."
trigger_phrases:
  - "speckit autopilot lifecycle"
  - "speckit unattended"
  - "SPECKIT_AUTOPILOT_RESULT"
  - "branch-preserved speckit failure"
  - "unattended task metadata"
version: 3.6.0.99
---

# Speckit autopilot lifecycle

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents the branch-preserved `:autopilot`, `:unattended` and `--unattended` command envelope for `/speckit:plan`, `/speckit:implement` and `/speckit:complete`.

This is distinct from `:auto`: `:auto` removes ordinary confirmation prompts, while autopilot is the unattended lifecycle contract for scheduled or pipeline-style execution where a failure must leave a machine-readable result and preserve the working branch.

---

## 2. HOW IT WORKS

### Router Contract

The three command routers parse `:autopilot`, `:unattended` and `--unattended` as execution mode `autopilot`. They explicitly do not alias those flags to `:auto`. `/speckit:complete` and `/speckit:implement` route to their auto workflow assets with branch-preserved failure semantics, while `/speckit:plan` routes to its auto workflow with unattended task metadata required.

### Terminal Result Contract

Autopilot failures and no-op exits must emit one machine-readable line prefixed with `SPECKIT_AUTOPILOT_RESULT`. The terminal reason field is limited to `no_eligible_tasks`, `retry_exhausted`, `verification_failed` and `uncertainty_blocked`; successful completion emits `reason: null`.

### Branch Preservation

The complete workflow asset defines the unattended sequence as branch first, propose unattended work, apply unattended work, archive in place, verify clean and merge only on clean verification. On every hard failure, the branch is preserved and merge is skipped.

### Planning Metadata

When planning in autopilot mode, executable `tasks.md` rows must include `agent`, `deps` and `touched-files` metadata. If the planner cannot assign those fields with at least medium confidence, the unattended result uses `uncertainty_blocked` instead of stopping with prose-only output.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/speckit/complete.md` | Command router | Parses autopilot aliases, defines result contract and routes to the complete workflow asset |
| `.opencode/commands/speckit/plan.md` | Command router | Requires unattended task metadata for autopilot planning |
| `.opencode/commands/speckit/implement.md` | Command router | Defines branch-preserved failure semantics and terminal reason codes for implementation |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Workflow asset | Defines the unattended autopilot sequence, result schema, reason codes and task metadata contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/commands/speckit/complete.md` | Manual validation anchor | Router contract and terminal reason-code source |
| `.opencode/commands/speckit/plan.md` | Manual validation anchor | Metadata requirement source |
| `.opencode/commands/speckit/implement.md` | Manual validation anchor | Branch-preserved failure source |
| `manual_testing_playbook/05--lifecycle/speckit-autopilot-lifecycle.md` | Manual playbook | Operator scenario for unattended lifecycle validation |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--lifecycle/speckit-autopilot-lifecycle.md`

Related references:
- [async-ingestion-job-lifecycle.md](async-ingestion-job-lifecycle.md) - lifecycle-state precedent in the same category
