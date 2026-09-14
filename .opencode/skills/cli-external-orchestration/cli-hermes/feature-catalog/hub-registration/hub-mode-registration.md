---
title: "Hub Mode Registration"
description: "The hub registers `cli-hermes` as a workflow mode, so a Hermes-naming request resolves through `hub-router.json` scoring and `mode-registry.json` dispatch rather than a hub default."
trigger_phrases:
  - "hub mode registration"
  - "cli-hermes mode registry entry"
  - "hermes hub routing"
  - "cli-hermes workflowMode"
version: 1.0.0.0
---

# Hub Mode Registration (cli-hermes)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The hub registers `cli-hermes` as a workflow mode, so a Hermes-naming request resolves through `hub-router.json` scoring and `mode-registry.json` dispatch rather than a hub default.

Registration is what makes the packet reachable at all. A caller never names the packet directory: it names Hermes, the hub scores that vocabulary, and the registry entry decides which packet conducts the session and what tools it may hold while doing so.

---

## 2. HOW IT WORKS

### Registry Entry

The registry entry carries `workflowMode: "cli-hermes"`, `packetKind: "workflow"` and `backendKind: "cli-dispatch"`, a tool surface of Bash, Read, Glob and Grep with `mutatesWorkspace: true`, no bound slash command, an alias list from "hermes cli" through "hermes headless", and `advisorRouting.routingClass: "metadata"`. The executor-delegation scorer sources its alias table from this file, keyed by each mode's `packetSkillName`, so the aliases here are what let a phrase such as "delegate to hermes" resolve to this mode.

### Two Routing Stages

Stage one is `hub-router.json`: `cli-hermes` appears in the hub's mode list with a weight, two vocabulary classes (`cli-hermes-aliases` and `hermes-dispatch`), and its `SKILL.md` as the resource to load. A prompt carrying only hub-identity vocabulary scores no mode and takes the hub's defer outcome instead of guessing an executor.

Stage two is `ROUTER.md` at the hub root, which holds a `HERMES` intent in the machine-readable intent block and maps it onto packet-qualified leaf resources. Both stages have to name the mode for it to be reachable; the registry entry alone is not routing.

### Packet Boundary

The packet holds the Hermes workflow contract only. It adds no advisor identity of its own, which means no `description.json` and no `graph-metadata.json` under `cli-hermes/`; the hub root owns both. The packet's own `SKILL.md` carries the hard-rule frontmatter the dispatch preflight reads, which is the one machine-consumed surface the packet does own.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | Shared | The `cli-hermes` mode entry: packet kind, tool surface, aliases, advisor routing class. |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Shared | Stage-one scoring: mode weight, vocabulary classes, and the resource to load. |
| `.opencode/skills/cli-external-orchestration/ROUTER.md` | Shared | Stage-two leaf-intent model, including the `HERMES` intent and its resource map. |
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Shared | Hub mode table and the workflow-packet classification for all seven modes. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Handler | The packet contract: activation triggers, self-invocation guard, dispatch shape, hard rules. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Operator scenarios for the shipped Hermes surface. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md` | Reference | Conductor and executor patterns the routed packet is expected to follow. |

---

## 4. SOURCE METADATA

- Group: Hub registration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hub-registration/hub-mode-registration.md`

Related references:
- [hermes-executor-kind.md](../fanout-dispatch/hermes-executor-kind.md) - the runtime layer the routed packet delegates execution to.
- [dispatch-shape-recognition.md](../dispatch-guards/dispatch-shape-recognition.md) - how a composed Hermes command is recognized once it runs.
