---
title: create-changelog References
description: Routing hub for create-changelog overflow — worked examples, version-bump nuance, and topology and release edge cases.
trigger_phrases:
  - "changelog creation examples"
  - "create changelog edge cases"
  - "changelog version bump examples"
  - "packet local changelog placement"
  - "github release changelog option"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# create-changelog References — Overflow Map

Routing hub for the `create-changelog` overflow set. The packet contract at [../SKILL.md](../SKILL.md) is authoritative: it holds the seven-step creation workflow, required inputs, topology and target resolution, the format contract, validation, and the always/never/escalate rules. The shared changelog format lives in [../../shared/assets/changelog_template.md](../../shared/assets/changelog_template.md). These reference files carry only supplementary detail that would bloat the SKILL.md — worked examples, version-bump nuance, and placement and release edge cases.

---

## 1. OVERVIEW

Open a reference here only when the SKILL.md workflow is clear but you need a concrete example or a decision aid. Nothing in this set overrides `../SKILL.md` or the shared template; when they conflict, those two win and the conflict is recorded, not resolved by inventing a hybrid.

Each file is scoped to one concern:

- concrete, filled-in changelog entries for both output modes
- how to choose and calculate the four-part global version
- where a changelog goes, plus the edge cases around placement, back-dating, source conflicts, and optional release

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **Worked examples** — a fully written global component entry and a packet-local nested entry, each annotated for why it is shaped that way | [worked_examples.md](worked_examples.md) | Modeling a real entry and you want a filled-in example, not the blank template |
| **Version-bump rules** — concrete major/minor/patch/build examples, real sk-doc release shapes, the first-entry case, and the "major means breaking, not large" distinction | [version_bump_rules.md](version_bump_rules.md) | Choosing or calculating a global four-part version and the SKILL.md bump table is not concrete enough |
| **Topology and edge cases** — the output-mode placement table, hub-versus-packet judgment, back-dating, source-format conflicts, and the optional GitHub release flow with its unknowns | [topology_edge_cases.md](topology_edge_cases.md) | Deciding where a changelog belongs, or handling release, back-dating, or format-conflict edge cases |

---

## 3. RELATED RESOURCES

### Packet contract
- [../SKILL.md](../SKILL.md) - authoritative seven-step workflow, versioning, topology, validation, and rules
- [../README.md](../README.md) - packet overview and quick start

### Shared format
- [../../shared/assets/changelog_template.md](../../shared/assets/changelog_template.md) - canonical global changelog and release-note format (compact and expanded)

### Command surface
- `.opencode/commands/create/changelog.md` - thin router for `/create:changelog`
- `.opencode/commands/create/assets/create_changelog_auto.yaml` - autonomous workflow source
- `.opencode/commands/create/assets/create_changelog_confirm.yaml` - checkpointed workflow source
- `.opencode/commands/create/assets/create_changelog_presentation.txt` - setup fields, release prompt, and result display

### Packet-local (nested) output
- `.opencode/skills/system-spec-kit/templates/changelog/root.md` - packet-local root template
- `.opencode/skills/system-spec-kit/templates/changelog/phase.md` - packet-local phase template
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js` - packet-local generator

### Real entries to model
- `.opencode/skills/sk-doc/changelog/v1.8.0.0.md` - versioning standard, engine, and enforcement rollout
- `.opencode/skills/sk-doc/changelog/v1.8.1.0.md` - validator and create-machinery improvement

---

*End of create-changelog reference map — depth lives in the three concern files above.*
