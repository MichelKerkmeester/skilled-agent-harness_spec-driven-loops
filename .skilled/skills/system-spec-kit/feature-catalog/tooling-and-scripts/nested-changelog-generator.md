---
title: "Nested changelog generator"
description: "Renders a packet-local changelog for a spec root or phase from the packet's own documents, with a search phrase that names the packet and frontmatter that stays valid for any title."
trigger_phrases:
  - "nested changelog generator"
  - "packet changelog identity phrase"
  - "nested-changelog.js"
  - "packet-local changelog"
version: 2.1.0.0
---

# Nested changelog generator (nested-changelog.js)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Renders a packet-local changelog for a spec root or phase from the packet's own documents, with a search phrase that names the packet and frontmatter that stays valid for any title.

A packet that has phases, or a phase inside one, records its history in the packet's own `changelog/` folder rather than in a component release. The generator reads the packet's spec, implementation summary, tasks and checklist and fills the root or phase template, so every entry has the same shape. `/create:changelog` calls it in nested mode.

---

## 2. HOW IT WORKS

### Core Behavior

The generator picks root or phase mode from the folder shape, or from `--mode`. A root entry is written to `changelog/changelog-<packet>-root.md` inside the packet, and a phase entry to `changelog/changelog-<packet>-<phase>.md` inside its parent. `--json` prints the derived payload without writing and `--write` renders and writes the entry. `--output` moves the target within the project root.

### Identity Phrase

Each entry's only trigger phrase names the packet it describes, so Gate 1 and `/speckit:search` find the entry the way they find a spec document. The phrase comes from the output path: the packet's words after its number, then the phase's words for a phase entry, then `changelog`. Words the two names share are written once. The phrase keeps at most ten words and drops packet words from the end first, so the phase words stay whole.

### Rendering

Every value lands in the template byte for byte in one pass, so a value holding `$&`, `$'` or a placeholder such as `{{DATE}}` is pasted as written. The title, description and phrase are escaped for the double-quoted YAML the templates wrap them in, so a spec title holding a quote or a backslash still yields frontmatter that parses.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Script | Derives the payload and the identity phrase, then renders the entry |
| `.skilled/skills/system-spec-kit/templates/changelog/root.md` | Shared | Root entry template |
| `.skilled/skills/system-spec-kit/templates/changelog/phase.md` | Shared | Phase entry template |
| `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` | Shared | Workflow reference and the search metadata rule |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts` | Vitest | Output paths, identity phrases, the trim rule, path containment and rendering that is literal and escaped |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/nested-changelog-generator.md` | Manual playbook | Checks a real phase's phrase, its lookup rank and the escaping test |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/nested-changelog-generator.md`

Related references:
- [spec-lifecycle-automation.md](spec-lifecycle-automation.md) - the packet lifecycle a changelog records
- [template-composition-system.md](template-composition-system.md) - how spec-kit templates are composed
