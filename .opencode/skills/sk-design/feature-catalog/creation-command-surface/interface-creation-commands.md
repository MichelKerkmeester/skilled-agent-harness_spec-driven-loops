---
title: "Interface Creation Commands"
description: "Five canonical /interface:* creation commands, one shared nine-stage contract, and additive /design:* compatibility aliases."
trigger_phrases:
  - "Interface Creation Commands"
  - "interface command surface"
  - "design command aliases"
  - "shared creation contract"
version: 1.0.0.0
---

# Interface Creation Commands

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The canonical creation-command surface is `/interface:{design,foundations,motion,audit,design-reference}`. These commands map to the existing `interface`, `foundations`, `motion`, `audit` and `md-generator` workflow modes without renaming the internal IDs.

The former `/design:{interface,foundations,motion,audit,md-generator}` commands remain thin compatibility aliases. The aliases are additive and preserve arguments while executing the canonical contracts in place.

---

## 2. HOW IT WORKS

Each canonical command has an auto workflow, a confirm workflow and a presentation contract. All five reference `shared/creation-contract.md`, which defines the common nine-stage lifecycle, rather than copying mode-specific design judgment into command wrappers.

The shared contract keeps responsibilities separate: commands own intake and lifecycle, the selected stable mode owns judgment and proof definition, transports own retrieval, rendering or extraction, and `sk-code` owns application-code mutation and stack verification.

Compatibility metadata maps each `/design:*` alias one-to-one to a canonical `/interface:*` command. The alias layer does not create new modes, remove old consumers or change the stable mode roster.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/creation-contract.md` | Shared contract | Defines the nine-stage creation lifecycle and responsibility boundaries. |
| `.opencode/commands/interface/*.md` | Canonical routers | Exposes the five `/interface:*` creation commands. |
| `.opencode/commands/interface/assets/*` | Workflow assets | Supplies auto, confirm and presentation contracts per command. |
| `.opencode/commands/design/*.md` | Compatibility routers | Preserves the five `/design:*` aliases. |
| `.opencode/skills/sk-design/command-metadata.json` | Metadata | Registers canonical commands and compatibility aliases per stable mode. |
| `.opencode/skills/sk-design/hub-router.json` | Router map | Records canonical-by-mode and compatibility-alias mappings. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Test harness | Validates canonical command packages, aliases, metadata and mode parity. |
| `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | Automated test | Covers routes, outputs, aliases, trust, evidence and amendment behavior. |

---

## 4. SOURCE METADATA

- Group: Creation Command Surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `creation-command-surface/interface-creation-commands.md`

Related references:
- [../../shared/creation-contract.md](../../shared/creation-contract.md) - Shared lifecycle used by every canonical creation command.
