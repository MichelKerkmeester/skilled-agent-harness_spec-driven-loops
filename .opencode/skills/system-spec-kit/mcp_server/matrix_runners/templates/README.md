---
title: "Matrix Runner Templates: F1-F14 Prompt Payloads"
description: "Prompt template directory for the F1-F14 x CLI-executor matrix, providing standardized test prompts for cross-CLI feature validation."
trigger_phrases:
  - "matrix runner templates"
  - "F1-F14 prompts"
  - "matrix manifest templates"
  - "cross CLI test prompts"
---

# Matrix Runner Templates: F1-F14 Prompt Payloads

> Template-only directory that provides standardized prompt payloads for the system-spec-kit matrix runner, enabling systematic cross-CLI feature validation across 14 key features and supported CLI executors.

---

## 1. OVERVIEW

`matrix_runners/templates/` owns the 14 prompt template files that define standardized test payloads for the matrix runner system. Each template corresponds to a feature cell (F1 through F14) and is loaded by `matrix-manifest.json` and executed by `run-matrix.ts` through executor-specific adapters.

Current state:

- 14 markdown files provide the full template surface. No subdirectories or executable code exist.
- Each template follows the naming pattern `F{N}-{feature-name}.md` and contains the exact pass signal `MATRIX_CELL_PASS F{N}`.
- Templates are inspection-only payloads. They do not modify files.
- The matrix covers 14 features across `cli-claude-code` and `cli-opencode`, producing up to 26 test cells with selective applicability rules.
- Features covered: spec folder workflow (F1), skill advisor (F2), memory search (F3), memory context (F4), code graph query (F5), code graph scan (F6), causal graph (F7), Code Graph (F8), continuity (F9), deep loop (F10), hooks (F11), validators (F12), stress cycle (F13), search W3-W13 (F14).
- Each template is self-contained and loaded independently by the matrix runner.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `F1-spec-folder.md` | Prompt template for testing spec-folder workflow across CLI executors. |
| `F2-skill-advisor.md` | Prompt template for testing skill advisor and skill graph routing. |
| `F3-memory-search.md` | Prompt template for testing memory_search functionality. |
| `F4-memory-context.md` | Prompt template for testing memory_context functionality. |
| `F5-code-graph-query.md` | Prompt template for testing code_graph_query functionality. |
| `F6-code-graph-scan.md` | Prompt template for testing code_graph_scan and verify functionality. |
| `F7-causal-graph.md` | Prompt template for testing causal graph functionality. |
| `F8-code_graph.md` | Prompt template for testing Code Graph search functionality. |
| `F9-continuity.md` | Prompt template for testing continuity and generate-context functionality. |
| `F10-deep-loop.md` | Prompt template for testing deep-research and deep-review loops. |
| `F11-hooks.md` | Prompt template for testing hook functionality. |
| `F12-validators.md` | Prompt template for testing validator functionality. |
| `F13-stress-cycle.md` | Prompt template for testing stress-test cycle patterns. |
| `F14-search-w3-w13.md` | Prompt template for testing search W3-W13 features. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `F1-spec-folder.md` through `F14-search-w3-w13.md` | Template | Standardized prompt payloads loaded by `matrix-manifest.json` and executed by `run-matrix.ts` for cross-CLI feature validation. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/matrix-adapter
```

Expected result: exit code 0, all matrix-adapter tests pass.

---

## 5. RELATED

- [Parent: Matrix Runners](../README.md)
- [Matrix Manifest](../matrix-manifest.json)
- [Skill README](../../README.md)
- [Tests: tests/](../../tests/README.md)
