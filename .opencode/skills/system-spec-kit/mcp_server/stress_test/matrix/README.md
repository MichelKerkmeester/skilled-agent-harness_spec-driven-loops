---
title: "Matrix Stress Tests: Shadow Comparison"
description: "Stress coverage for shadow-comparison matrix behavior in the MCP server stress-test suite."
trigger_phrases:
  - "matrix stress tests"
  - "shadow comparison stress"
---

# Matrix Stress Tests: Shadow Comparison

---

## 1. OVERVIEW

`stress_test/matrix/` contains matrix-style stress coverage. It currently focuses on shadow-comparison behavior across generated or observed advisor outputs.

Current state:

- Stores one shadow comparison stress suite.
- Keeps matrix-style stress logic separate from package unit tests.
- Supports broader comparison scenarios that need stress-test isolation.

---

## 2. DIRECTORY TREE

```text
matrix/
+-- shadow-comparison.vitest.ts   # Shadow comparison matrix stress suite
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `shadow-comparison.vitest.ts` | Exercises shadow-comparison behavior under matrix-style stress scenarios. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Stress tests may import comparison helpers and fixtures needed for shadow analysis. |
| Exports | This folder exports no runtime code. |
| Ownership | Put matrix-style stress cases here. Put skill-advisor package tests in `../../skill_advisor/tests/`. |

Main flow:

```text
shadow comparison inputs
  -> matrix stress test
  -> comparison result
  -> assertion on stable delta behavior
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `shadow-comparison.vitest.ts` | Test file | Matrix stress coverage for shadow comparison. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../skill-advisor/README.md`](../skill-advisor/README.md)
- [`../search-quality/README.md`](../search-quality/README.md)
