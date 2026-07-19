---
title: "Skill Advisor Skill-Graph Tests"
description: "Focused Vitest coverage for advisor skill-graph refresh behavior, embeddings round-trips and database invariants."
trigger_phrases:
  - "skill graph tests"
  - "advisor skill graph tests"
  - "refresh skill embeddings test"
---

# Skill Advisor Skill-Graph Tests

<!-- sk-doc-template: code_folder_readme -->

---

## 1. OVERVIEW

`tests/skill-graph/` contains targeted regression tests for advisor skill-graph database flows that are too specific for the broader root test suites.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Test fixtures | Skill advisor tests | Created under temporary directories. |
| Runtime DB files | Runtime state | Do not commit SQLite outputs from these tests. |
| Shared embedder mocks | Test suite | Keep tests offline-safe. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `refresh-roundtrip.vitest.ts` | Verifies active-embedder and legacy embedding refresh paths round-trip through SQLite. |

---

## 4. BOUNDARIES

- Keep tests deterministic and offline-safe.
- Use temporary workspaces and databases.
- Put reusable fixtures in `../fixtures/` or `../__fixtures__/` when shared by multiple suites.

---

## 5. ENTRYPOINTS

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test -- tests/skill-graph
```

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test -- tests/skill-graph
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph/README.md
```

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../lib/skill-graph/README.md`](../../lib/skill-graph/README.md)
- [`../embedders/README.md`](../embedders/README.md)
