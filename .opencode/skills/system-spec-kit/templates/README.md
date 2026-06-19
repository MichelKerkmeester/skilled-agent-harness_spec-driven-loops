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

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [Templates](#templates)
  - [TABLE OF CONTENTS](#table-of-contents)
  - [1. OVERVIEW](#1-overview)
  - [2. ARCHITECTURE](#2-architecture)
  - [3. PACKAGE TOPOLOGY](#3-package-topology)
  - [4. DIRECTORY TREE](#4-directory-tree)
  - [5. KEY FILES](#5-key-files)
  - [6. BOUNDARIES AND FLOW](#6-boundaries-and-flow)
  - [7. ENTRYPOINTS](#7-entrypoints)
  - [8. VALIDATION](#8-validation)
  - [9. RELATED](#9-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`templates/` contains the markdown templates and manifest data used by the Spec Kit packet scaffolder and validator. It is a content folder rather than a runtime package, but it still has a strict structure because scripts read its files directly.

Current state:

- `manifest/spec-kit-docs.json` maps public Levels to required docs, add-on docs, lazy docs and section gates.
- `manifest/*.md.tmpl` files contain gated markdown blocks rendered by the inline-gate renderer.
- `examples/` stores rendered reference packets for each supported Level.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
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

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
templates/
├── manifest/              │ Templates, manifest and maintainer guides
├── examples/              │ Pre-rendered reference packets
├── changelog/             │ Template change records
├── stress_test/           │ Deep-review grading materials
└── scratch/               │ Local debug space, gitignored
```

Allowed dependency direction:

```text
scripts/spec/create.sh → templates/manifest/spec-kit-docs.json
scripts/templates/inline-gate-renderer.* → templates/manifest/*.md.tmpl
scripts/spec/validate.sh → manifest contract data
docs → examples and manifest guides
```

Disallowed dependency direction:

```text
templates/ → generated spec packets
templates/ → MCP runtime modules
examples/ → scaffolder input
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
templates/
├── README.md
├── manifest/
│   ├── spec-kit-docs.json
│   ├── spec.md.tmpl
│   ├── phase-parent.spec.md.tmpl
│   ├── plan.md.tmpl
│   ├── tasks.md.tmpl
│   ├── implementation-summary.md.tmpl
│   ├── checklist.md.tmpl
│   ├── decision-record.md.tmpl
│   ├── handover.md.tmpl
│   ├── debug-delegation.md.tmpl
│   ├── research.md.tmpl
│   ├── resource-map.md.tmpl
│   ├── context-index.md.tmpl
│   ├── README.md
│   ├── EXTENSION_GUIDE.md
│   └── MIGRATION.md
├── examples/
│   ├── level_1/
│   ├── level_2/
│   ├── level_3/
│   └── level_3+/
├── changelog/
├── stress_test/
└── scratch/
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File                                      | Responsibility                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| `manifest/spec-kit-docs.json`             | Defines Level contracts, document registry, template versions and section gates. |
| `manifest/spec.md.tmpl`                   | Renders feature specification documents.                                         |
| `manifest/plan.md.tmpl`                   | Renders implementation plan documents.                                           |
| `manifest/tasks.md.tmpl`                  | Renders task breakdown documents.                                                |
| `manifest/implementation-summary.md.tmpl` | Renders delivery summaries and continuity anchors.                               |
| `manifest/checklist.md.tmpl`              | Renders verification checklists.                                                 |
| `manifest/decision-record.md.tmpl`        | Renders architecture decision records.                                           |
| `manifest/handover.md.tmpl`               | Renders handover documents for memory-save workflows.                            |
| `manifest/resource-map.md.tmpl`           | Renders optional path ledgers for larger packets.                                |
| `manifest/EXTENSION_GUIDE.md`             | Explains how maintainers add a new document type.                                |
| `examples/`                               | Shows rendered output for Levels 1, 2, 3 and 3+. Phase-parent scaffolding is defined by the manifest template contract. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary  | Rule                                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Imports   | Scripts read this folder as data. Template files do not import code.                                                                                 |
| Exports   | Rendered packet docs are written into `specs/` by `create.sh`, not by this folder directly.                                                          |
| Ownership | Template content, Level contracts and rendered examples belong here. Runtime validation logic belongs in `scripts/` and `mcp_server/lib/templates/`. |

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

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint                                  | Type              | Purpose                                                  |
| ------------------------------------------- | ----------------- | -------------------------------------------------------- |
| `manifest/spec-kit-docs.json`               | Data file         | Primary Level and document contract consumed by scripts. |
| `manifest/*.md.tmpl`                        | Template files    | Rendered into packet markdown files.                     |
| `examples/level_*`                          | Reference folders | Show expected rendered output by Level.                  |
| `scripts/spec/create.sh`                    | Script caller     | Reads this folder to scaffold packets.                   |
| `scripts/spec/validate.sh`                  | Script caller     | Reads the same contract to validate packets.             |
| `scripts/templates/inline-gate-renderer.sh` | Script caller     | Renders gated template blocks for a selected Level.      |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/example --strict
```

Expected result for a real spec folder: the validator reads the manifest contract and reports no missing required docs or gated sections.

For template changes, also run the template and resolver test suite used by the repository.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [Manifest README](./manifest/README.md)
- [Extension Guide](./manifest/EXTENSION_GUIDE.md)
- [Migration Guide](./manifest/MIGRATION.md)
- [System Spec Kit Skill](../SKILL.md)
- [Template Resolver](../mcp_server/lib/templates/level-contract-resolver.ts)
- [Spec Scaffolder](../scripts/spec/create.sh)
- [Spec Validator](../scripts/spec/validate.sh)

<!-- /ANCHOR:related -->
