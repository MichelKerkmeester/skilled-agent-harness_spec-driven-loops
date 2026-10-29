---
title: "Spec authoring card"
description: "One short card that the four authoring intents load instead of the long template guide, held in sync with the router and the checklist."
trigger_phrases:
  - "spec authoring card"
  - "authoring card"
  - "write a spec packet"
  - "fill a spec scaffold"
version: 1.0.4.0
---

# Spec authoring card

## 1. OVERVIEW

The spec authoring card is the short authoring path for a model. It lives at `references/workflows/spec-authoring-card.md` and fits in one read. The `PLAN`, `IMPLEMENT`, `INTAKE` and `TEMPLATE_AUTHORING` intents load the card. The long template guide stays reachable from the on demand list only.

The card covers the bounds of a packet write, the level choice, the scaffold command, the fill rules, the validation command and the close steps. Each step carries one action, one acceptance line and one command.

---

## 2. HOW IT WORKS

### Router Change

`RESOURCE_MAP` in [`ROUTER.md`](../../ROUTER.md) §3 MACHINE ROUTER lists the resources each intent loads. Four rows changed from the long guide to the card. The `ON_DEMAND` list keeps one guide entry, so a reader can still ask for the long path.

### Sync Guard

`runtime/cli/spec/check-card-sync.sh` reads the card, the router, the generated leaf inventory files and the authoring checklist. It runs every check and prints one `PASS` or `FAIL` line for each. It fails when any of them disagrees. The checks cover the card length, the four intent rows, the guide level, the two inventory files, the checklist's route to an example folder that exists and the card's pointer to the checklist. It exits 2 without running a check when `rg` is not on `PATH`.

### Inventory Regeneration

The card is a leaf resource, so the two generated inventory files list it. Both files are written by their generator scripts and are never edited by hand. The sync guard reads them, and the leaf inventory check reports a missing card entry.

### Authoring Use

A model reads the card, scaffolds with `create.sh`, fills every section, removes every token, and runs `validate.sh --strict --quiet`, reading the full report only on `FAILED` and stopping after three rounds. Three smoke runs measure the path, and the manual playbook holds a full end to end scenario.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Reference | The short authoring path |
| `.skilled/skills/system-spec-kit/SKILL.md` | Skill entry | Defines when the skill applies and points to the authoring card |
| `.skilled/skills/system-spec-kit/ROUTER.md` | Machine router | Intent map, resource map and loading levels |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` | Script | Compares the four surfaces and fails when any check disagrees |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/card-sync.vitest.ts` | Vitest | Runs the sync guard in the suite |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-router-intents.md` | Manual playbook | Scenario 481, the four intent rows |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md` | Manual playbook | Scenario 482, the guard on the tree and on a copy |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` | Manual playbook | Scenario 483, the end to end write |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/spec-authoring-card.md`

Related references:
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the strict run the card closes with
- [versioned-placeholder-gate.md](versioned-placeholder-gate.md) - the rule that decides when a token must be gone
