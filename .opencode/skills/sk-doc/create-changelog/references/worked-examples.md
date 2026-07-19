---
title: Changelog Worked Examples
description: Fully written global and packet-local changelog entries with annotations explaining why each is shaped the way it is.
trigger_phrases:
  - "changelog creation examples"
  - "global changelog example"
  - "packet local changelog example"
  - "worked changelog entry"
  - "annotated changelog sample"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Changelog Worked Examples

Two filled-in changelog entries — one global component entry, one packet-local nested entry — each with annotations.

---

## 1. OVERVIEW

These examples illustrate the shared format in [../../shared/assets/changelog-template.md](../../shared/assets/changelog-template.md) applied to a real change. They do not replace the blank template or the [../SKILL.md](../SKILL.md) workflow; the seven-step workflow is authoritative. Open this file when you want a filled-in entry to model, not the blank template.

---

## 2. GLOBAL ENTRY EXAMPLE

This example mirrors the compact style used by `sk-doc` changelog entries such as `v1.8.0.0` and `v1.8.1.0`. It starts with the summary paragraph, not with a version heading, matching the shared changelog template.

```markdown
sk-doc's changelog creation workflow now has a dedicated packet that separates the contract from the long-form examples authors need when choosing output mode, version bump, and release behavior.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent` (Level 1)

---

## What Changed

#### Documentation

- **New `create-changelog` packet** -- changelog authoring now has its own sk-doc workflow packet instead of relying on scattered command knowledge. The packet keeps the numbered workflow short and points to these references for examples and edge cases.
- **Overflow references** -- the reference set explains global versus packet-local placement, version bump choices, topology edge cases, and optional release publishing. This keeps the `SKILL.md` readable while preserving the nuance needed for correct output.

#### Commands

- **Workflow alignment** -- the packet follows the existing `/create:changelog` auto and confirm YAMLs: gather context, resolve component or nested output, calculate version when needed, generate content from the template, validate, then write.

## Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/sk-doc/create-changelog/SKILL.md` | Primary numbered workflow for changelog creation |
| `.opencode/skills/sk-doc/create-changelog/references/` | Route-map plus worked examples, version-bump, and edge-case files |
| `.opencode/commands/create/assets/create-changelog-auto.yaml` | Existing autonomous workflow source |
| `.opencode/commands/create/assets/create-changelog-confirm.yaml` | Existing checkpointed workflow source |

## Upgrade

No migration required.
```

**Annotations**:
- The first paragraph explains why the release matters, not only what files changed.
- The spec-folder blockquote mirrors real sk-doc entries.
- `#### Documentation` and `#### Commands` use the shared category vocabulary.
- Technical file paths stay in the table, not in the summary prose.
- This is a global example because it would write to a component changelog folder with a `vX.Y.Z.W.md` filename.

---

## 3. PACKET-LOCAL ENTRY EXAMPLE

Packet-local changelogs do not use the global component version sequence. The YAML routes nested mode to the spec-kit generator and reads the spec-kit root or phase template instead of the global template.

```markdown
# Changelog - sk-doc parent root

This packet adds the `create-changelog` sub-skill to the sk-doc parent hub and records the work needed to keep changelog creation topology-aware.

## Summary

- Added a dedicated creation packet for changelog authoring.
- Kept the packet `SKILL.md` focused on the primary workflow.
- Moved longer examples and pitfalls into the `references/` route-map and its concern files.

## Changed Files

| File | Change |
|---|---|
| `.opencode/skills/sk-doc/create-changelog/SKILL.md` | New packet contract |
| `.opencode/skills/sk-doc/create-changelog/references/` | Supplemental reference set |

## Validation

- Confirmed the reference set is grounded in the existing changelog template and command YAMLs.
```

**Annotations**:
- The exact packet-local shape is owned by `.opencode/skills/system-spec-kit/templates/changelog/root.md` and `phase.md`.
- Use the nested generator: `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <spec-folder> --write`.
- The output filename is deterministic, such as `changelog-<packet>-root.md` or `changelog-<packet>-<phase-folder>.md`.
- Do not invent a `vX.Y.Z.W.md` filename for packet-local output.

---

## 4. RELATED

- [README.md](README.md) - reference route-map
- [version-bump-rules.md](version-bump-rules.md) - choosing and calculating the global four-part version
- [topology-edge-cases.md](topology-edge-cases.md) - placement, back-dating, source conflicts, and release edge cases
- [../SKILL.md](../SKILL.md) - authoritative packet workflow
