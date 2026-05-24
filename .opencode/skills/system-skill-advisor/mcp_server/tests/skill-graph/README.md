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

`tests/skill-graph/` contains targeted regression tests for advisor skill-graph database flows that are too specific for the broader root test suites.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Test fixtures | Skill advisor tests | Created under temporary directories. |
| Runtime DB files | Runtime state | Do not commit SQLite outputs from these tests. |
| Shared embedder mocks | Test suite | Keep tests offline-safe. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `refresh-roundtrip.vitest.ts` | Verifies active-embedder and legacy embedding refresh paths round-trip through SQLite. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Keep tests deterministic and offline-safe.
- Use temporary workspaces and databases.
- Put reusable fixtures in `../fixtures/` or `../__fixtures__/` when shared by multiple suites.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/skill-graph
```

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/skill-graph
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../../lib/skill-graph/README.md`](../../lib/skill-graph/README.md)
- [`../embedders/README.md`](../embedders/README.md)

<!-- /ANCHOR:7-related -->
