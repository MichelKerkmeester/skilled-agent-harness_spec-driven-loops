---
title: "create-diagram command"
description: "The /create:diagram router - a thin router that loads a presentation contract, resolves :auto or :confirm mode, and executes the bound workflow YAML."
trigger_phrases:
  - "create-diagram command"
  - "/create:diagram"
  - "diagram command router"
  - "create diagram auto confirm mode"
  - "presentation contract"
version: 1.0.0.0
---

# create-diagram command (/create:diagram)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `/create:diagram` router — a thin router that loads a presentation contract, resolves `:auto` or `:confirm` mode, and executes the bound workflow YAML.

The command is a thin router, not the workflow itself. It separates execution routing from user-facing presentation: the router loads the presentation contract, resolves the execution mode, and binds a workflow YAML, while every prompt, setup/status dashboard, and result display comes from the presentation contract. The caller is a user invoking `/create:diagram <target>.html [description] [--import source] [--type type] [:auto|:confirm]`, and the main failure mode is a missing owned asset, which stops the router with the missing path reported.

---

## 2. HOW IT WORKS

### Router contract

The router owns three assets: the presentation contract (`create-diagram-presentation.txt`), the auto workflow (`create-diagram-auto.yaml`), and the confirm workflow (`create-diagram-confirm.yaml`). If any referenced asset is missing, the router stops and reports the missing path. It reads the presentation contract, runs its Phase 0 verification and setup resolution, resolves the execution mode from `$ARGUMENTS` or the setup answer (`:auto` or `:confirm`), loads the workflow YAML bound to that mode, and executes it step by step.

### Modes and workflow

`:auto` executes autonomously with pre-bound setup answers for non-interactive setup; `:confirm` (or an omitted mode) runs the same steps as an interactive, checkpointed workflow, so it is the default. The bound workflow runs the diagram pipeline: detect the generate/import/export request shape, load the style guide plus the matching `references/types/type-*.md` or import/export reference, draw or redraw against the shared design system and complexity budget, and validate the accessible-SVG contract before delivery. The `--import` and `--type` arguments route directly into shape detection and type selection.

### Presentation boundary

User-facing wording — startup questions, Phase 0 verification, the setup dashboard, confirmation prompts, status display, completion display, and next-step text — lives only in `create-diagram-presentation.txt`. The router never invents visible wording for those surfaces; it only selects the workflow YAML and execution mode. The command's metadata registers the same choreography in `command-metadata.json`: load the `sk-doc` hub routing table, load the `sk-create-diagram` mode contract, then load the presentation contract before resolving setup and execution mode.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/create/diagram.md` | Handler | The `/create:diagram` router contract: owned assets, mode routing, execution targets, and the presentation boundary |
| `.opencode/commands/create/assets/create-diagram-auto.yaml` | Shared | The bound workflow executed in `:auto` mode |
| `.opencode/commands/create/assets/create-diagram-confirm.yaml` | Shared | The bound workflow executed in `:confirm` mode (also the default when mode is omitted) |
| `.opencode/commands/create/assets/create-diagram-presentation.txt` | Shared | The presentation contract that owns all user-facing wording |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/command-and-hub-integration/create-diagram-command.md` | Manual playbook | Scenario CMD-001 verifies the router loads the presentation contract, binds the correct workflow YAML, and produces the diagram without inventing prompts |
| `.opencode/skills/sk-doc/command-metadata.json` | Reference | Anchor for the `/create:diagram` command metadata and choreography |

---

## 4. SOURCE METADATA

- Group: COMMAND AND HUB INTEGRATION
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `command-and-hub-integration/create-diagram-command.md`

Related references:
- [hub-registration.md](hub-registration.md) — the hub registration that binds the `/create:diagram` command to this packet
