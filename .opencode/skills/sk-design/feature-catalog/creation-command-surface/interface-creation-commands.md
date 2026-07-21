---
title: "Interface Creation Commands"
description: "Five canonical /interface:* creation commands sharing one nine-stage contract. The former /design:* alias namespace is retired — /interface:* is the sole creation surface."
trigger_phrases:
  - "Interface Creation Commands"
  - "interface command surface"
  - "design command retirement"
  - "shared creation contract"
version: 1.0.0.0
---

# Interface Creation Commands

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The canonical creation-command surface is `/interface:{design,foundations,motion,audit,design-reference}`. These commands map to the existing `interface`, `foundations`, `motion`, `audit` and `md-generator` workflow modes without renaming the internal IDs.

The former `/design:{interface,foundations,motion,audit,md-generator}` alias namespace is retired: `/interface:*` is the sole public creation surface. The alias wrappers, their assets, and the registry alias plumbing have been removed end-to-end; the alias era is preserved only in the historical changelog.

---

## 2. HOW IT WORKS

Each canonical command has an auto workflow, a confirm workflow and a presentation contract. All five reference `shared/creation-contract.md`, which defines the common nine-stage lifecycle, rather than copying mode-specific design judgment into command wrappers.

The shared contract keeps responsibilities separate: commands own intake and lifecycle, the selected stable mode owns judgment and proof definition, transports own retrieval, rendering or extraction, and `sk-code` owns application-code mutation and stack verification.

The command registries record only the canonical `/interface:*` commands, each mapped one-to-one to its stable mode. There is no alias layer — the retirement removed the alias-reconciliation machinery so the surface carries exactly one namespace.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/creation-contract.md` | Shared contract | Defines the nine-stage creation lifecycle and responsibility boundaries. |
| `.opencode/commands/interface/*.md` | Canonical routers | Exposes the five `/interface:*` creation commands. |
| `.opencode/commands/interface/assets/*` | Workflow assets | Supplies auto, confirm and presentation contracts per command. |
| `.opencode/skills/sk-design/command-metadata.json` | Metadata | Registers the canonical `/interface:*` commands per stable mode. |
| `.opencode/skills/sk-design/hub-router.json` | Router map | Records the canonical-by-mode command mappings. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Test harness | Validates the canonical command packages, metadata and mode parity. |
| `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | Automated test | Covers routes, outputs, trust, evidence and amendment behavior. |

---

## 4. SOURCE METADATA

- Group: Creation Command Surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `creation-command-surface/interface-creation-commands.md`

Related references:
- [../../shared/creation-contract.md](../../shared/creation-contract.md) - Shared lifecycle used by every canonical creation command.
