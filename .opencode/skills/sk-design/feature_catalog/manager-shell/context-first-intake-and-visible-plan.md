---
title: "Context-First Intake And Visible Plan"
description: "Current-state reference for the sk-design hub's manager intake and visible plan contract before substantial design work."
trigger_phrases:
  - "context-first intake and visible plan"
  - "sk-design manager intake"
  - "design visible plan"
  - "mode routing plan"
version: 1.0.0.0
---

# Context-First Intake And Visible Plan

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `sk-design` hub gathers enough context to avoid generic design output before routing or transport work.

The intake captures goal, surface, inputs, constraints, and proof expectations. When a missing fact would change routing or acceptance, the hub asks one focused question; otherwise it proceeds with a stated assumption.

---

## 2. HOW IT WORKS

The hub reads `mode-registry.json` and resolves the smallest useful mode: `interface`, `foundations`, `motion`, `audit`, or `md-generator`. Generic "make it look good" prompts default to `interface`; explicit static-system, temporal, audit, or extraction language routes to the matching mode.

Before substantial design direction, build-ready guidance, implementation handoff, or transport work, the hub shows a concise plan naming the selected mode or bundle, loaded or missing context, intended design moves or audit dimensions, proof required before ready, and any handoff target.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/SKILL.md` | Shared | Defines manager intake, mode resolution, visible plan, and smallest-useful-mode routing. |
| `.opencode/skills/sk-design/mode-registry.json` | Shared | Stores the registry-driven mode contract the hub resolves through. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/SKILL.md` | Manual playbook | The visible-plan and intake requirements are reviewable in the hub routing contract. |

---

## 4. SOURCE METADATA

- Group: Manager Shell
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `manager-shell/context-first-intake-and-visible-plan.md`

Related references:
- [proof-gates-and-verifier-cadence.md](proof-gates-and-verifier-cadence.md) - Proof required before ready claims.
- [transport-vs-taste-separation.md](transport-vs-taste-separation.md) - Transport boundary for evidence and artifacts.
