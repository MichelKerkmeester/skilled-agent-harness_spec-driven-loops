---
title: "Hub registration"
description: "The packet's registration in the sk-doc hub: workflowMode, command, and aliases in mode-registry.json, router signals in hub-router.json, leaves in leaf-manifest.json, command metadata, and the no-packet-local-graph-metadata.json invariant."
trigger_phrases:
  - "hub registration"
  - "mode-registry.json entry"
  - "hub-router.json signals"
  - "sk-doc advisor identity"
  - "packet registration"
version: 1.0.0.0
---

# Hub registration

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The packet's registration in the `sk-doc` hub: `workflowMode`, command, and aliases in `mode-registry.json`, router signals in `hub-router.json`, and command choreography in `command-metadata.json`, with no packet-local advisor metadata.

`sk-create-diagram` is a nested workflow packet under the `sk-doc` parent hub. It carries no independent advisor identity — discovery, routing, and command dispatch all resolve through the three hub-owned registry files, keeping `sk-doc` as the single advisor root for every packet-scoped mode, matching the pattern every other `sk-create-*` sibling packet uses.

---

## 2. HOW IT WORKS

### mode-registry.json entry

The packet registers as `workflowMode: "sk-create-diagram"`, `packetKind: "workflow"`, `backendKind: "template-scaffold"`, bound to `packet`/`packetSkillName: "sk-create-diagram"` and `command: "/create:diagram"`. Its tool surface allows `Read`/`Write`/`Edit`/`Bash`/`Grep`/`Glob`, forbids `Task`, and declares `mutatesWorkspace: true`. The entry carries 17 aliases spanning generation (`create diagram`, `diagram`, `architecture diagram`, `sequence diagram`, `ER diagram`, `state machine diagram`, `data model diagram`, `swimlane`, `venn diagram`, `org chart`, `quadrant diagram`, `gantt chart`) and import/export (`draw.io`, `drawio`, `mermaid diagram`, `redraw diagram`, `export diagram`).

### hub-router.json signals

The router's `tieBreak` list includes `sk-create-diagram` alongside every other `sk-create-*` packet. Its own entry (`"sk-create-diagram": { "weight": 3, "classes": ["create-diagram-aliases"], "resources": ["sk-create-diagram/SKILL.md"] }`) binds the packet to a dedicated `create-diagram-aliases` keyword class carrying the full alias set plus additional signal phrases (`entity relationship diagram`, `radar chart`, `high-level diagram`, `medallion diagram`, `data flow diagram`, `self-contained HTML diagram`, `editorial diagram`) beyond the mode-registry alias list, so natural-language requests route correctly even when they don't match an alias verbatim.

### No packet-local advisor identity

The packet root carries no `graph-metadata.json`, `description.json`, `mode-registry.json`, or `hub-router.json` of its own — advisor identity and cross-packet routing live exclusively at the `sk-doc` hub root, per the standard/nested-workflow-packet contract. `validate_skill_package.py` is the packaging gate that enforces this shape at intake, and `ci-skill-root-metadata.cjs` is the fleet-wide audit that confirms the hub itself stays class H clean after the registration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-doc/mode-registry.json` | Registry | The `sk-create-diagram` `workflowMode` entry: command, aliases, tool surface |
| `.opencode/skills/sk-doc/hub-router.json` | Registry | The `create-diagram-aliases` weighted keyword class and `tieBreak` membership |
| `.opencode/skills/sk-doc/command-metadata.json` | Registry | The `/create:diagram` command choreography entry |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/command-and-hub-integration/hub-registration.md` | Manual playbook | Scenario CMD-002 verifies the packet resolves through hub routing without a packet-local advisor identity |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Test harness | Packaging gate that enforces the no-packet-local-metadata invariant |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Test harness | Fleet-wide audit confirming the `sk-doc` hub stays class H clean |

---

## 4. SOURCE METADATA

- Group: COMMAND AND HUB INTEGRATION
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `command-and-hub-integration/hub-registration.md`

Related references:
- [create-diagram-command.md](create-diagram-command.md) — the `/create:diagram` router this registration binds to
