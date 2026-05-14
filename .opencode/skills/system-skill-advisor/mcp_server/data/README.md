---
title: "Skill Advisor Data: Shadow Delta Records"
description: "Data folder for skill-advisor shadow delta records used by comparison and diagnostics paths."
trigger_phrases:
  - "advisor data"
  - "shadow deltas"
---

# Skill Advisor Data: Shadow Delta Records

<!-- sk-doc-template: skill_readme -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`skill_advisor/data/` stores data files used by advisor diagnostics and shadow comparison paths. It currently contains JSONL shadow delta records.

Current state:

- Stores `shadow-deltas.jsonl` for shadow delta observations.
- Keeps generated or observed data separate from library modules.
- Supports comparison and diagnostics paths without exporting runtime code.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-directory-tree -->
## 2. DIRECTORY TREE

```text
data/
+-- shadow-deltas.jsonl   # Shadow comparison delta records
`-- README.md
```

---

<!-- /ANCHOR:2-directory-tree -->

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `shadow-deltas.jsonl` | Stores shadow-mode delta records for advisor comparison or diagnostics. |

---

<!-- /ANCHOR:3-key-files -->

<!-- ANCHOR:4-boundaries-and-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Data files are read by advisor diagnostics or shadow paths, not imported as modules. |
| Exports | This folder exports no runtime code. |
| Ownership | Put advisor shadow data here. Put shadow sink code in `../lib/shadow/`. |

Main flow:

```text
shadow comparison path
  -> append or read JSONL delta record
  -> diagnostic comparison
  -> report or test assertion
```

---

<!-- /ANCHOR:4-boundaries-and-flow -->

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `shadow-deltas.jsonl` | Data file | Shadow delta record store. |

---

<!-- /ANCHOR:5-entrypoints -->

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/data/README.md
```

Expected result: exit code `0`.

---

<!-- /ANCHOR:6-validation -->

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../lib/shadow/README.md`](../lib/shadow/README.md)

<!-- /ANCHOR:7-related -->
