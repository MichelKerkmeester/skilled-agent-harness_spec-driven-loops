---
title: "Registry-Driven Prompt Packet Routing"
description: "How the sk-prompt hub dispatches a single advisor identity to one of two workflow packets, distinguished by backendKind rather than a surface/workflow split."
trigger_phrases:
  - "registry-driven prompt packet routing"
  - "sk-prompt discriminator"
  - "prompt-improve prompt-models routing"
  - "sk-prompt smart routing"
version: 1.0.0.0
---

# Registry-Driven Prompt Packet Routing (sk-prompt)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The skill advisor routes any prompt-engineering query to the single identity `sk-prompt`; the hub then picks the packet. `mode-registry.json` is the single source of truth for the mapping — the hub reads it and does not re-derive routing logic in prose.

Both packets are `packetKind: "workflow"`; there is no surface axis at this hub. They are distinguished instead by `backendKind`.

---

## 2. HOW IT WORKS

### The Discriminator

`workflowMode` is the public packet key (`prompt-improve` or `prompt-models`). `prompt-models` is `workflow`, not `surface`, because its real consuming workflow — `cli-opencode`'s pre-dispatch step — lives outside this hub; the surface-packet contract requires the consumer to be a same-hub primary workflow, which `prompt-models` does not have. `backendKind` is `prompt-engine` for `prompt-improve`'s DEPTH/CLEAR pipeline and `profile-lookup` for `prompt-models`'s read-only per-model reference.

### Routing Rule

The hub resolves `SKILL_ROOT` to the directory containing its own `SKILL.md`, reads `mode-registry.json` and `hub-router.json` as guarded, in-skill data, and loads only the resolved packet's declared resources — never a keyed `references/<key>/` or `assets/<key>/` subtree outside what the resolved packet itself owns.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-prompt/SKILL.md` | Shared | States the discriminator and the routing rule. |
| `.opencode/skills/sk-prompt/mode-registry.json` | Shared | Declarative registry for the two packets. |
| `.opencode/skills/sk-prompt/hub-router.json` | Shared | Router signal data consumed alongside the registry. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the tool-surface-union invariant. |

---

## 4. SOURCE METADATA

- Group: Registry-Driven Prompt Packet Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `prompt-packet-routing/prompt-packet-routing.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven routing when enabled.
