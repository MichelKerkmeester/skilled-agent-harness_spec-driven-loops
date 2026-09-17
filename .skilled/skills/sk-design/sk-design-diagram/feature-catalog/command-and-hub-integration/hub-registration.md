---
title: "Hub registration"
description: "The packet's registration in the sk-design hub: workflowMode, command, and aliases in mode-registry.json, router signals in hub-router.json, leaves in leaf-manifest.json, command metadata, and the no-packet-local-graph-metadata.json invariant."
trigger_phrases:
  - "hub registration"
  - "mode-registry.json entry"
  - "hub-router.json signals"
  - "sk-design advisor identity"
  - "packet registration"
version: 1.0.0.4
---

# Hub registration

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The packet's registration in the `sk-design` hub: `workflowMode`, command, and aliases in `mode-registry.json`, router signals in `hub-router.json`, and command choreography in `command-metadata.json`, with no packet-local advisor metadata.

`sk-design-diagram` is a nested workflow packet under the `sk-design` parent hub. It carries no independent advisor identity: discovery, routing, and command dispatch all resolve through the three hub-owned registry files, keeping `sk-design` as the single advisor root for its modes, matching the pattern the hub's other modes use.

---

## 2. HOW IT WORKS

### mode-registry.json entry

The packet registers as `workflowMode: "sk-design-diagram"`, `packetKind: "workflow"`, `backendKind: "template-scaffold"`, bound to `packet`/`packetSkillName: "sk-design-diagram"` and `command: "/design:diagram"`. Its tool surface allows `Read`/`Write`/`Edit`/`Bash`/`Grep`/`Glob`, forbids `Task`, and declares `mutatesWorkspace: true`. The entry carries 27 aliases spanning generation (`create diagram`, `diagram`, `architecture diagram`, `sequence diagram`, `ER diagram`, `state machine diagram`, `data model diagram`, `swimlane`, `venn diagram`, `org chart`, `quadrant diagram`, `gantt chart`), import/export (`draw.io`, `drawio`, `mermaid diagram`, `redraw diagram`, `export diagram`), and the merged `sk-create-flowchart` ASCII/markdown vocabulary (`create flowchart`, `flowchart`, `ASCII flowchart`, `workflow diagram`, `text diagram`, `text characters`, `decision tree`, `decision branch`, `parallel execution diagram`, `approval loop diagram`).

### hub-router.json signals

The router's `tieBreak` list includes `sk-design-diagram` alongside the hub's other modes. Its own entry under `routerSignals` (`"sk-design-diagram": { "weight": 3, "classes": ["create-diagram-aliases"], "resources": ["sk-design-diagram/SKILL.md"] }`) binds the packet to a dedicated `create-diagram-aliases` keyword class carrying the full alias set plus additional signal phrases (`entity relationship diagram`, `radar chart`, `high-level diagram`, `medallion diagram`, `data flow diagram`, `self-contained HTML diagram`, `editorial diagram`) beyond the mode-registry alias list, so natural-language requests route correctly even when they don't match an alias verbatim.

### No packet-local advisor identity

The packet root carries no `graph-metadata.json`, `description.json`, `mode-registry.json`, or `hub-router.json` of its own — advisor identity and cross-packet routing live exclusively at the `sk-design` hub root, per the standard/nested-workflow-packet contract. `validate_skill_package.py` is the packaging gate that enforces this shape at intake, and `ci-skill-root-metadata.cjs` is the fleet-wide audit that confirms the hub itself stays class H clean after the registration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/mode-registry.json` | Registry | The `sk-design-diagram` `workflowMode` entry: command, aliases, tool surface |
| `.opencode/skills/sk-design/hub-router.json` | Registry | The `create-diagram-aliases` weighted keyword class and `tieBreak` membership |
| `.opencode/skills/sk-design/command-metadata.json` | Registry | The `/design:diagram` command choreography entry |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/command-and-hub-integration/hub-registration.md` | Manual playbook | Scenario CMD-002 verifies the packet resolves through hub routing without a packet-local advisor identity |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Test harness | Packaging gate that enforces the no-packet-local-metadata invariant |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Test harness | Fleet-wide audit confirming the `sk-design` hub stays class H clean |

---

## 4. SOURCE METADATA

- Group: COMMAND AND HUB INTEGRATION
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `command-and-hub-integration/hub-registration.md`

Related references:
- [design-diagram-command.md](design-diagram-command.md) — the `/design:diagram` router this registration binds to
