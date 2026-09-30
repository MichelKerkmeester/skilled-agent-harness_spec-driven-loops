---
title: create-changelog References
description: Routing hub for create-changelog overflow: worked examples, version-bump nuance and topology and release edge cases.
trigger_phrases:
  - "changelog creation examples"
  - "create changelog edge cases"
  - "changelog version bump examples"
  - "packet local changelog placement"
  - "github release changelog option"
importance_tier: normal
contextType: implementation
version: 1.1.0.9
---

# create-changelog References. Overflow Map

Routing hub for the `create-changelog` overflow set. [../SKILL.md](../SKILL.md) holds the authoritative workflow and [../assets/changelog-template.md](../assets/changelog-template.md) the format. These files add only examples and edge cases.

---

## 1. OVERVIEW

Open a reference here when the workflow is clear but you need a filled-in example or a decision aid. Nothing here overrides `../SKILL.md` or the template. When they conflict, those two win and the conflict is recorded.

---

## 2. REFERENCE MAP

| Concern | Reference | Load When |
| --- | --- | --- |
| **Worked examples**: a lean compact entry, an expanded excerpt and a packet-local entry, each annotated | [worked-examples.md](worked-examples.md) | Modeling a real entry rather than the blank template |
| **Version-bump rules**: concrete bumps, real sk-doc release shapes, the first entry and "major means breaking, not large" | [version-bump-rules.md](version-bump-rules.md) | The SKILL.md bump table is not concrete enough |
| **Topology and edge cases**: placement, hub versus packet, back-dating, source conflicts and the release flow | [topology-edge-cases.md](topology-edge-cases.md) | Deciding where a changelog belongs, or handling a release or back-dating case |

---

## 3. RELATED RESOURCES

### Packet contract
- [../SKILL.md](../SKILL.md) - authoritative workflow, versioning, topology, validation and rules
- [../README.md](../README.md) - packet overview and quick start

### Command surface
- `.skilled/commands/create/changelog.md` - thin router for `/create:changelog`
- `.skilled/commands/create/assets/create-changelog-auto.yaml` - autonomous workflow source
- `.skilled/commands/create/assets/create-changelog-confirm.yaml` - checkpointed workflow source
- `.skilled/commands/create/assets/create-changelog-presentation.txt` - setup fields, release prompt and result display

### Packet-local (nested) output
- `.skilled/skills/system-spec-kit/templates/changelog/root.md` - packet-local root template
- `.skilled/skills/system-spec-kit/templates/changelog/phase.md` - packet-local phase template
- `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` - packet-local generator

### Real entry to model
- `.skilled/changelog/skilled/v4.0.0.0.md` - the canonical exemplar for the v4 narrative style
