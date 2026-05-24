---
title: "Skill Advisor Data: Static Runtime Inputs"
description: "Data folder for tracked advisor JSON inputs plus ignored runtime shadow delta logs."
trigger_phrases:
  - "advisor data"
  - "shadow deltas"
---

# Skill Advisor Data: Static Runtime Inputs

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

`skill_advisor/data/` stores tracked JSON inputs copied into advisor dist during build. Shadow delta JSONL logs may appear here at runtime, but they are ignored runtime state.

Current state:

- Tracks `prompt-policy.default.json` as the default prompt policy input.
- Copies tracked `*.json` files into `dist/mcp_server/data` during `npm run build`.
- Ignores `shadow-deltas.jsonl` because it is observed runtime telemetry.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-directory-tree -->
## 2. DIRECTORY TREE

```text
data/
+-- prompt-policy.default.json  # Tracked prompt policy input copied into dist
+-- shadow-deltas.jsonl         # Ignored runtime telemetry when shadow mode writes
`-- README.md
```

---

<!-- /ANCHOR:2-directory-tree -->

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `prompt-policy.default.json` | Default prompt policy input copied into build output. |
| `shadow-deltas.jsonl` | Ignored runtime shadow-mode delta records for comparison or diagnostics. |

---

<!-- /ANCHOR:3-key-files -->

<!-- ANCHOR:4-boundaries-and-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | JSON data files are read by advisor runtime code, not imported as modules. |
| Exports | This folder exports no runtime code. |
| Ownership | Track static JSON inputs here. Put runtime logs here only as ignored local state via `.opencode/.gitignore`. |

Main flow:

```text
build or runtime path
  -> read tracked JSON input
  -> copy to dist/mcp_server/data during build
  -> append ignored shadow telemetry only when enabled
```

---

<!-- /ANCHOR:4-boundaries-and-flow -->

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `prompt-policy.default.json` | Data file | Default prompt policy input. |
| `shadow-deltas.jsonl` | Runtime file | Ignored shadow delta record store. |

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
