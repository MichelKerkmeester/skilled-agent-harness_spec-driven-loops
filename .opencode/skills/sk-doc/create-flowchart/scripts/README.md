---
title: "Create Flowchart Scripts: ASCII flowchart validator"
description: "Shell script that checks a markdown flowchart for box-width consistency, missing arrows, unlabeled decisions, nesting depth and overall size."
---

# Create Flowchart Scripts

---

## 1. OVERVIEW

`create-flowchart/scripts/` holds the single validator for the `/create:flowchart` workflow. `validate-flowchart.sh` runs five checks against one flowchart file and reports errors and warnings without needing any other file.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `validate-flowchart.sh` | Checks box-width consistency, arrow/connector presence, decision-branch labeling, nesting depth and file size for a markdown flowchart. |

## 3. VALIDATION

Run from the repository root.

```bash
.opencode/skills/sk-doc/create-flowchart/scripts/validate-flowchart.sh <flowchart.md>
```

Expected result: exit 0 with `Flowchart validation passed` when there are no errors, warnings still pass. Exit 1 when any error is found.

## 4. RELATED

- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
