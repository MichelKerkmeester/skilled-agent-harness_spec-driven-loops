---
title: "Code Graph Test Assets: Static Verification Data"
description: "Static JSON fixtures used by code-graph verification and gold-query battery tests."
trigger_phrases:
  - "code graph test assets"
  - "gold query fixture"
  - "verification battery"
---

# Code Graph Test Assets: Static Verification Data

> Small checked-in data files used by verification tests.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tests/assets/` stores static data fixtures that need to be loaded from disk by tests. The files here are intentionally small and deterministic so verification coverage can exercise file loading without relying on the live code graph database.

Current state:

- `code-graph-gold-queries.json` contains a minimal gold-query battery.
- The asset schema mirrors the verification battery contract used by `gold-query-verifier.ts`.
- Tests should treat these files as read-only fixtures.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
assets/
+-- code-graph-gold-queries.json  # Minimal verification battery fixture
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Purpose |
|---|---|
| `code-graph-gold-queries.json` | Provides a schema-versioned verification battery with pass policy and expected symbols. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Mutability | Tests must not rewrite assets in place. Create temp copies when mutation is needed. |
| Scope | Keep only static fixtures here. Test helper code belongs in `../__fixtures__/` or `../lib/`. |
| Size | Keep assets small enough to inspect in review. Large generated batteries belong in spec assets or external test data. |

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run from the repository root.

```bash
python3 -m json.tool .opencode/skills/system-code-graph/mcp_server/tests/assets/code-graph-gold-queries.json >/dev/null
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp_server/tests/assets/README.md
```

Expected result: JSON parsing exits `0`, and the README validator reports no blocking errors.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED

| Document | Purpose |
|---|---|
| [../README.md](../README.md) | Parent test-suite overview. |
| [../../lib/README.md](../../lib/README.md) | Library modules that consume verification fixtures. |
| [../../lib/gold-query-verifier.ts](../../lib/gold-query-verifier.ts) | Verification module that reads gold-query batteries. |

<!-- /ANCHOR:related -->
