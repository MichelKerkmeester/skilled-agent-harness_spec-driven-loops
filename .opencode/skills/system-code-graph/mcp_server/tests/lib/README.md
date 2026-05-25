---
title: "Code Graph Test Lib: Focused Library Coverage"
description: "Focused Vitest coverage for code-graph library hardening, canonical DB paths, owner leases and IPC safety."
trigger_phrases:
  - "code graph test lib"
  - "canonical db tests"
  - "owner lease tests"
  - "security hardening tests"
---

# Code Graph Test Lib: Focused Library Coverage

> Library-level tests for filesystem, database and IPC safety contracts.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tests/lib/` contains Vitest files that target library-level safety behavior rather than MCP handler payloads. The coverage is intentionally narrow: canonical database directory resolution, DB close helpers, owner lease behavior and hardening around IPC or external binary paths.

Current state:

- Tests create temporary directories and clean them up after each case.
- Files under test live in `../lib/`, including `canonical-db-dir.ts`, `close-db-assertion.ts` and `owner-lease.ts`.
- Security hardening coverage exercises `lib/ipc/socket-server.ts` and workspace containment helpers.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
tests/lib/
+-- canonical-db-dir.vitest.ts  # Canonical DB path and symlink escape behavior
+-- close-db.vitest.ts          # DB close assertion coverage
+-- owner-lease.vitest.ts       # Owner lease acquisition and stale-state behavior
+-- security-hardening.vitest.ts # IPC and Code Graph path hardening
`-- README.md
```

Primary dependency direction:

```text
tests/lib -> ../../lib
tests/lib -> temporary filesystem state
tests/lib does not depend on the live developer database
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Coverage |
|---|---|
| `canonical-db-dir.vitest.ts` | Canonicalization, missing-directory creation and symlink escape rejection. |
| `close-db.vitest.ts` | DB close assertions and failure reporting. |
| `owner-lease.vitest.ts` | Single-owner lease behavior and stale owner recovery. |
| `security-hardening.vitest.ts` | IPC socket containment and Code Graph binary path safety. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| State | Tests must use temp dirs, not `.opencode/.spec-kit/code-graph/database`. |
| Imports | Tests may import focused internals under `../../lib` when validating safety contracts. |
| Cleanup | Temp directories and mocks must be reset after each case. |
| Runtime | Keep pressure and degraded-mode tests in `../stress_test/code-graph/`. |

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run mcp_server/tests/lib
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp_server/tests/lib/README.md
```

Expected result: Vitest exits `0`, and the README validator reports no blocking errors.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED

| Document | Purpose |
|---|---|
| [../README.md](../README.md) | Parent test-suite overview. |
| [../../lib/README.md](../../lib/README.md) | Library modules covered by these tests. |
| [../../lib/ipc/README.md](../../lib/ipc/README.md) | IPC socket bridge covered by security hardening tests. |

<!-- /ANCHOR:related -->
