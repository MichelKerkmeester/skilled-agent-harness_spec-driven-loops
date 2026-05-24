---
title: "Skill Advisor Cross-Skill Edges"
description: "Report and optional apply helpers for inferred inbound enhances edges across skill graph metadata."
trigger_phrases:
  - "cross skill edges"
  - "inbound enhances"
  - "propagate enhances"
---

# Skill Advisor Cross-Skill Edges

<!-- sk-doc-template: code_folder_readme -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`lib/cross-skill-edges/` detects missing inbound `enhances` edges from skill metadata and can apply selected high-confidence candidates back to `graph-metadata.json`. Report mode is the default; write mode must stay explicit.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Candidate detection | Skill advisor | Uses metadata signals to infer inbound edge candidates. |
| Graph metadata writes | Source skill package | Apply mode writes only selected candidates back to source metadata. |
| Edge schema | System graph contracts | Keep public `skill_graph_*` tool IDs stable. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public `propagateInboundEnhances()` orchestration. |
| `metadata-loader.ts` | Loads skill metadata and surfaces per-file parse errors. |
| `detect-inbound-enhances.ts` | Scores candidate inbound enhances edges. |
| `apply-graph-metadata-patch.ts` | Applies selected candidates with path-boundary checks. |
| `context-template.ts` | Builds candidate context text. |
| `types.ts` | Shared propagation types. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Default to report/propose mode for diagnostics.
- Keep apply mode explicit, scoped and path-boundary checked.
- Do not rename public advisor or `skill_graph_*` MCP tool IDs from this folder.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

```text
propagateInboundEnhances(options)
```

Callers should pass `mode: "apply"` only when a selected candidate set has been reviewed.

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../skill-graph/README.md`](../skill-graph/README.md)
- [`../../tools/README.md`](../../tools/README.md)

<!-- /ANCHOR:7-related -->
