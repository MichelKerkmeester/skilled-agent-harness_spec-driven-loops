---
title: "Templates"
description: "Spec Kit template folder for packet document templates, the level manifest, rendered examples and maintainer references."
trigger_phrases:
  - "templates"
  - "template system"
  - "spec kit templates"
  - "template manifest"
---

# Templates

---

## 1. OVERVIEW

`templates/` contains the markdown templates and manifest data used by the Spec Kit packet scaffolder and validator. It is a content folder rather than a runtime package, but it still has a strict structure because scripts read its files directly.

Current state:

- `spec-kit-docs.json` maps public Levels to required docs, add-on docs, lazy docs and section gates.
- `core/`, `addons/` and `packet-types/` `*.md.tmpl` files contain gated markdown blocks rendered by the inline-gate renderer.
- `examples/` stores rendered reference packets for each supported Level.

---

## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────╮
│                         TEMPLATES                          │
╰────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────┐
│ create.sh        │ ───▶ │ manifest JSON    │
│ packet scaffold  │      │ level contracts  │
└──────────────────┘      └────────┬─────────┘
                                    │
                                    ▼
┌──────────────────┐      ┌──────────────────┐
│ renderer script  │ ───▶ │ *.md.tmpl        │
│ IF-gate pruning  │      │ packet docs      │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ output packet    │      │ validate.sh      │
│ specs/...        │ ◀─── │ same contract    │
└──────────────────┘      └──────────────────┘

Dependency direction:
scripts read templates and manifest data
templates do not call scripts or import runtime modules
```

---

## 3. PACKAGE TOPOLOGY

```text
templates/
├── core/                  │ The required documents every packet carries
├── addons/                │ Optional and on-demand documents
├── packet-types/          │ Templates for special packet shapes
├── spec-kit-docs.json     │ The level contract
├── CONTRACT.md            │ Maintainer guide for the contract
├── examples/              │ Pre-rendered reference packets
├── changelog/             │ Template change records
├── stress-test/           │ Deep-review grading materials
└── scratch/               │ Local debug space, gitignored
```

Allowed dependency direction:

```text
scripts/spec/create.sh → templates/spec-kit-docs.json
scripts/templates/inline-gate-renderer.* → templates/manifest/*.md.tmpl
scripts/spec/validate.sh → the level contract at templates/spec-kit-docs.json
docs → examples and maintainer guides
```

Disallowed dependency direction:

```text
templates/ → generated spec packets
templates/ → runtime engine modules
examples/ → scaffolder input
```

---

## 4. DIRECTORY TREE

```text
templates/
├── README.md
├── spec-kit-docs.json
├── core/
│   ├── spec.md.tmpl
│   ├── plan.md.tmpl
│   ├── tasks.md.tmpl
│   └── implementation-summary.md.tmpl
├── addons/
│   ├── acceptance-criteria.md.tmpl
│   ├── decision-record.md.tmpl
│   ├── handover.md.tmpl
│   ├── debug-delegation.md.tmpl
│   ├── research.md.tmpl
│   ├── resource-map.md.tmpl
│   ├── before-after.md.tmpl
│   ├── timeline.md.tmpl
│   └── roadmap.md.tmpl
├── packet-types/
│   ├── phase-parent.spec.md.tmpl
│   ├── review.spec.md.tmpl
│   └── context-index.md.tmpl
├── examples/
│   ├── level-1/
│   ├── level-2/
│   ├── level-3/
│   └── level_3+/
├── changelog/
├── stress-test/
└── scratch/
```

---

## 5. KEY FILES

| File                                      | Responsibility                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| `spec-kit-docs.json`             | Defines Level contracts, document registry, template versions and section gates. |
| `core/spec.md.tmpl`                   | Renders feature specification documents.                                         |
| `packet-types/review.spec.md.tmpl`            | Renders review-record specifications for the `review` packet type.               |
| `core/plan.md.tmpl`                   | Renders implementation plan documents.                                           |
| `core/tasks.md.tmpl`                  | Renders task breakdown documents.                                                |
| `core/implementation-summary.md.tmpl` | Renders delivery summaries and continuity anchors.                               |
| `addons/acceptance-criteria.md.tmpl`    | Renders the closure-gating acceptance criteria for Levels 2, 3 and 3+.           |
| `addons/decision-record.md.tmpl`        | Renders architecture decision records.                                           |
| `addons/handover.md.tmpl`               | Renders handover documents for memory-save workflows.                            |
| `addons/resource-map.md.tmpl`           | Renders optional path ledgers for larger packets.                                |
| `EXTENSION-GUIDE.md`                      | Explains how maintainers add a new document type.                                |
| `examples/`                               | Shows rendered output for Levels 1, 2, 3 and 3+. Phase-parent scaffolding is defined by the manifest template contract. |

---

## 6. BOUNDARIES AND FLOW

| Boundary  | Rule                                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Imports   | Scripts read this folder as data. Template files do not import code.                                                                                 |
| Exports   | Rendered packet docs are written into `specs/` by `create.sh`, not by this folder directly.                                                          |
| Ownership | Template content, Level contracts and rendered examples belong here. Runtime validation logic belongs in `scripts/` and `runtime/lib/templates/`. |

Render flow:

```text
╭──────────────────────────────────────────╮
│ create.sh receives Level and target path │
╰──────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────┐
│ resolver reads spec-kit-docs.json        │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ renderer applies IF gates to .md.tmpl    │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ scaffold writes rendered docs to specs/  │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ validate.sh checks the same contract     │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint                                  | Type              | Purpose                                                  |
| ------------------------------------------- | ----------------- | -------------------------------------------------------- |
| `spec-kit-docs.json`               | Data file         | Primary Level and document contract consumed by scripts. |
| `core/`, `addons/` and `packet-types/` `*.md.tmpl`                        | Template files    | Rendered into packet markdown files.                     |
| `examples/level_*`                          | Reference folders | Show expected rendered output by Level.                  |
| `scripts/spec/create.sh`                    | Script caller     | Reads this folder to scaffold packets.                   |
| `scripts/spec/validate.sh`                  | Script caller     | Reads the same contract to validate packets.             |
| `scripts/templates/inline-gate-renderer.sh` | Script caller     | Renders gated template blocks for a selected Level.      |

---

## 8. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/example --strict
```

Expected result for a real spec folder: the validator reads the manifest contract and reports no missing required docs or gated sections.

For template changes, also run the template and resolver test suite used by the repository.

---

## 9. RELATED

- [Contract Guide](./CONTRACT.md)
- [Extension Guide](./EXTENSION-GUIDE.md)
- [Migration Guide](./MIGRATION.md)
- [System Spec Kit Skill](../SKILL.md)
- [Template Resolver](../runtime/lib/templates/level-contract-resolver.ts)
- [Spec Scaffolder](../scripts/spec/create.sh)
- [Spec Validator](../scripts/spec/validate.sh)
