---
title: "Packet-Authored, Registry-Projected Routing"
description: "How the sk-doc hub routes across twelve documentation-authoring packets, with each packet's own Keyword triggers line as the source of truth and mode-registry.json as a synchronized runtime projection."
trigger_phrases:
  - "packet-authored registry-projected routing"
  - "sk-doc discriminator"
  - "sk-doc keyword triggers source of truth"
  - "sk-doc smart routing"
version: 1.0.0.0
---

# Packet-Authored, Registry-Projected Routing (sk-doc)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`sk-doc` routing is registry-driven at runtime and packet-authored at source. Each of its twelve nested packets owns a single `Keyword triggers:` line that is the source of truth for that packet's routing vocabulary; `mode-registry.json` and `hub-router.json` are synchronized projections the hub reads without re-deriving the mapping during a request.

The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub then picks the packet.

---

## 2. HOW IT WORKS

### The Discriminator

`workflowMode` is the public packet key — `create-skill`, `create-skill-parent`, `create-readme`, `create-agent`, `create-command`, `create-feature-catalog`, `create-manual-testing-playbook`, `create-benchmark`, `create-flowchart`, `create-changelog`, `create-diff`, and `create-quality-control`. `create-skill-parent` is a second mode layered over the same `create-skill` packet rather than a distinct one. `packetKind` is `workflow` for every packet — there is no surface axis at this hub; the `create-quality-control` validate/score/optimize pipeline is universal doctrine shared from `shared/`, not orthogonal stack-evidence. `backendKind` is `template-scaffold` for every `create-*` generator and `create-quality-control` for the quality-control mode itself.

### Packet-Authored Vocabulary

Because each packet's `Keyword triggers:` line is authored at the packet, adding or changing routing vocabulary is a packet-local edit; `mode-registry.json` and `hub-router.json` are then kept synchronized as read-only runtime projections rather than a second, independently-maintained source of routing truth.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-doc/SKILL.md` | Shared | States the packet-authored/registry-projected contract and the discriminator. |
| `.opencode/skills/sk-doc/mode-registry.json` | Shared | Synchronized runtime projection of all twelve packets. |
| `.opencode/skills/sk-doc/hub-router.json` | Shared | Router signal data consumed alongside the registry. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the tool-surface-union invariant and registry/packet-vocabulary synchronization checks. |

---

## 4. SOURCE METADATA

- Group: Packet-Authored, Registry-Projected Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `packet-authored-registry-routing/packet-authored-registry-routing.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven routing when enabled.
