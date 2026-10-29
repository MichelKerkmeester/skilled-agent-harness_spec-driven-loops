---
title: "system-spec-kit v2.12.25.0, dedicated router file"
description: "The machine router now lives in ROUTER.md, and documents that linked to it inside SKILL.md now point there."
trigger_phrases:
  - "system-spec-kit v2.12.25.0"
  - "system-spec-kit 2.12.25.0"
  - "dedicated router file"
importance_tier: "normal"
contextType: "general"
version: 2.12.25.0
---

# A Dedicated Home for the Router

The `SKILL.md` SMART ROUTING section is now short prose with a line linking to `ROUTER.md`. The dedicated file holds the skill's machine router.

&nbsp;

## What's New at a Glance

- **The routing map stays complete.** `ROUTER.md` follows a short overview and intent model with the intent map, resource map, default resource, loading levels and routing pseudocode.
- **The skill's documents follow the new router.** The authoring-card feature-catalog entry and the authoring-card playbook scenario now point to `ROUTER.md`.
- **Parsed routing stays consistent.** It matches the previous edition, so runtime behavior is unchanged.
- **The card check reads the router where it now lives.** `check-card-sync.sh` checks the four authoring intents and the on-demand list in `ROUTER.md`, reports a missing router instead of aborting on the first read, and its test copies that file into the skill root it builds. Before this, the check found no intent in `SKILL.md` and failed.
- **Every router reader now finds the router.** The skill README, `ARCHITECTURE.md`, the CLI smart-router reference, both authoring playbook scenarios, the template guide and the rename pattern now name `ROUTER.md`, the router analyzer and the measurement harness read it beside the instructions, and the Hermes sync copies it beside each generated `SKILL.md`.

&nbsp;

## Upgrade

No migration required.
