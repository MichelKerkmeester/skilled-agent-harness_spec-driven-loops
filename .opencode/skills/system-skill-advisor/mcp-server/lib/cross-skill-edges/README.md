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

---

## 1. OVERVIEW

`lib/cross-skill-edges/` detects missing inbound `enhances` edges from skill metadata and can apply selected high-confidence candidates back to `graph-metadata.json`. Report mode is the default; write mode must stay explicit.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Candidate detection | Skill advisor | Uses metadata signals to infer inbound edge candidates. |
| Graph metadata writes | Source skill package | Apply mode writes only selected candidates back to source metadata. |
| Edge schema | System graph contracts | Keep public `skill_graph_*` tool IDs stable. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public `propagateInboundEnhances()` orchestration. |
| `metadata-loader.ts` | Loads skill metadata and surfaces per-file parse errors. |
| `detect-inbound-enhances.ts` | Scores candidate inbound enhances edges. |
| `apply-graph-metadata-patch.ts` | Applies selected candidates with path-boundary checks. |
| `context-template.ts` | Builds candidate context text. |
| `types.ts` | Shared propagation types. |

---

## 4. BOUNDARIES

- Default to report/propose mode for diagnostics.
- Keep apply mode explicit, scoped and path-boundary checked.
- Do not rename public advisor or `skill_graph_*` MCP tool IDs from this folder.

---

## 5. ENTRYPOINTS

```text
propagateInboundEnhances(options)
```

Callers should pass `mode: "apply"` only when a selected candidate set has been reviewed.

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run typecheck
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/README.md
```

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../skill-graph/README.md`](../skill-graph/README.md)
- [`../../tools/README.md`](../../tools/README.md)
