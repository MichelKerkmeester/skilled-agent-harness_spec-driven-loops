---
title: "Template Examples"
description: "Reference examples showing expected spec documentation depth by level."
trigger_phrases:
  - "template examples"
  - "level examples"
  - "documentation depth"
importance_tier: "normal"
contextType: "general"
---

# Template Examples

---

## 1. OVERVIEW

`templates/examples/` contains filled reference examples for system-spec-kit documentation levels. Use these examples to compare depth, section coverage and evidence style after choosing a level from the real task scope.

Current responsibilities:

- Show how Level 1 through Level 3+ documentation scales.
- Provide comparison material for authors and reviewers.
- Keep examples separate from templates that users copy for new work.

---

## 2. ARCHITECTURE

```text
level templates
        │
        ▼
filled examples by level
        │
        ▼
authors compare scope, depth and evidence before editing their own spec docs
```

---

## 3. PACKAGE TOPOLOGY

```text
examples/
+-- README.md
+-- level-1/      # Minimal scope and lightweight planning example
+-- level-2/      # Verification-focused example
+-- level-3/      # Architecture and decision-record example
`-- level_3+/     # Governance and coordination example
```

Example folders mirror level contracts, but they are not source templates. Source templates live under `templates/manifest/*.md.tmpl`, and the manifest maps public levels to those templates.

---

## 4. DIRECTORY TREE

```text
examples/
+-- README.md
+-- level-1/
|   +-- spec.md
|   +-- plan.md
|   +-- tasks.md
|   `-- implementation-summary.md
+-- level-2/
|   `-- level docs with checklist.md
+-- level-3/
|   `-- level docs with decision-record.md
`-- level_3+/
    `-- level docs with governance depth
```

---

## 5. KEY FILES

| Path | Responsibility |
|---|---|
| `level-1/` | Shows the smallest complete spec packet shape. |
| `level-2/` | Shows checklist-backed validation depth. |
| `level-3/` | Shows decision records and architecture-level planning. |
| `level_3+/` | Shows expanded coordination and governance depth. |

---

## 6. BOUNDARIES AND FLOW

Use this directory for reference only. Do not start new specs by copying from `examples/`, because examples may include filled content that does not match the new task.

Recommended flow:

```text
choose level from task risk -> render templates from manifest -> author spec docs -> compare against examples -> validate
```

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/templates/examples/README.md
```

For spec packet validation, run the system-spec-kit validator against the target spec folder rather than this examples directory.

---

## 8. RELATED

- `../README.md`
- `../manifest/README.md`
- `../manifest/spec-kit-docs.json`
