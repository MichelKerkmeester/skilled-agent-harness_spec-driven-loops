---
title: "Code Graph Test Fixtures: Reusable Test Helpers"
description: "Reusable TypeScript fixtures for code-graph Vitest suites."
trigger_phrases:
  - "code graph fixtures"
  - "index scope fixture"
  - "test helpers"
---

# Code Graph Test Fixtures: Reusable Test Helpers

> Reusable TypeScript helpers for test-only policy and behavior fixtures.

---

## 1. OVERVIEW

`tests/__fixtures__/` contains reusable TypeScript helpers that model test-only behavior. These helpers keep repeated setup out of Vitest files while staying separate from production code under `../lib/`.

Current state:

- `index-scope.ts` mirrors scan-scope policy in a compact fixture form for indexer tests.
- Fixtures are imported by tests only. Production modules must not import from this folder.
- Static JSON assets live in `../assets/`.

---

## 2. DIRECTORY TREE

```text
__fixtures__/
+-- index-scope.ts  # Test-only scan scope policy fixture
`-- README.md
```

---

## 3. KEY FILES

| File | Purpose |
|---|---|
| `index-scope.ts` | Provides `IndexScopePolicy` and `shouldIndexForCodeGraph` fixture logic for indexer tests. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Vitest files may import fixtures. Production files may not. |
| Drift | Keep fixture behavior intentionally small. When production policy changes, update tests that prove the real behavior too. |
| Assets | Use `../assets/` for JSON or other static files. Keep executable helper code here. |

---

## 5. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run mcp_server/tests/code-graph-indexer.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp_server/tests/__fixtures__/README.md
```

Expected result: Vitest exits `0`, and the README validator reports no blocking errors.

---

## 6. RELATED

| Document | Purpose |
|---|---|
| [../README.md](../README.md) | Parent test-suite overview. |
| [../assets/README.md](../assets/README.md) | Static test data fixtures. |
| [../../lib/shared/README.md](../../lib/shared/README.md) | Production scan-scope helper package. |
