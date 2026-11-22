---
title: "Skill Advisor Skill-Graph Tests"
description: "Folder README for advisor skill-graph tests, which now run from the package-level skill-graph-db suite."
trigger_phrases:
  - "skill graph tests"
  - "advisor skill graph tests"
  - "skill graph database tests"
---

# Skill Advisor Skill-Graph Tests

---

## 1. OVERVIEW

`tests/skill-graph/` once held targeted regression tests for advisor skill-graph database flows. It now holds only this README, and the database cases run from the package-level `../skill-graph-db.vitest.ts`.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Test fixtures | Skill advisor tests | Created under temporary directories. |
| Runtime DB files | Runtime state | Do not commit SQLite outputs from these tests. |

---

## 3. KEY FILES

No test file lives in this folder now. The skill-graph database cases run from `../skill-graph-db.vitest.ts`.

---

## 4. BOUNDARIES

- Keep tests deterministic and offline-safe.
- Use temporary workspaces and databases.
- Put reusable fixtures in `../fixtures/` when shared by multiple suites.

---

## 5. ENTRYPOINTS

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/skill-graph-db.vitest.ts
```

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/skill-graph-db.vitest.ts
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/README.md
```

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../lib/skill-graph/README.md`](../../lib/skill-graph/README.md)
