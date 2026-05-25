---
title: "Code Graph Stress Tests: Pressure And Degraded-Mode Coverage"
description: "Stress tests for code-graph scanning, context assembly, degraded behavior, change detection, diagnostics and resource caps."
trigger_phrases:
  - "code graph stress tests"
  - "code graph context stress"
  - "detect changes stress"
  - "doctor apply stress"
---

# Code Graph Stress Tests: Pressure And Degraded-Mode Coverage

> Vitest stress coverage for broad scans, degraded responses, context pressure and doctor apply-mode policy.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`stress_test/code-graph/` contains Vitest stress coverage for scan breadth, context generation, degraded-mode behavior, change detection, manual diagnostics and denial-of-service caps. These tests exercise paths that are broader or more adversarial than normal unit tests.

Current state:

- Covers scan, context, degraded sweep, change detection and manual diagnostics behavior.
- Covers deep-loop graph scenarios.
- Exercises walker caps and doctor apply-mode policy in disposable temp workspaces.
- Exports no runtime code.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
code-graph/
+-- budget-allocator-stress.vitest.ts
+-- code-graph-context-stress.vitest.ts
+-- code-graph-degraded-sweep.vitest.ts
+-- code-graph-scan-stress.vitest.ts
+-- context-handler-normalization-stress.vitest.ts
+-- deep-loop-crud-stress.vitest.ts
+-- deep-loop-graph-convergence-stress.vitest.ts
+-- detect-changes-preflight-stress.vitest.ts
+-- doctor-apply-mode-stress.vitest.ts
+-- manual-diagnostics-stress.vitest.ts
+-- walker-dos-caps.vitest.ts
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `code-graph-scan-stress.vitest.ts` | Stresses scan behavior and broad traversal paths. |
| `code-graph-context-stress.vitest.ts` | Stresses context assembly and budget behavior. |
| `code-graph-degraded-sweep.vitest.ts` | Stresses degraded-mode sweep behavior. |
| `context-handler-normalization-stress.vitest.ts` | Stresses context handler normalization paths. |
| `detect-changes-preflight-stress.vitest.ts` | Stresses diff-to-symbol preflight behavior. |
| `doctor-apply-mode-stress.vitest.ts` | Stresses doctor apply-mode policy and rollback simulation. |
| `manual-diagnostics-stress.vitest.ts` | Stresses manual diagnostics output. |
| `walker-dos-caps.vitest.ts` | Verifies traversal cap behavior under pressure. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Stress tests may import graph, context, diagnostics and command-policy modules needed for pressure scenarios. |
| Exports | This folder exports no runtime code. |
| Ownership | Keep code-graph pressure cases here. Put ordinary unit tests in `../../tests/`. |
| State | Tests should use temporary workspaces and must not depend on a developer's live graph database. |

Main flow:

```text
large, stale or adversarial fixture
  -> code-graph scan, context, diagnostic or apply path
  -> capped output, degraded response or stress result
  -> assertion on safety and behavior
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `code-graph-scan-stress.vitest.ts` | Test file | Scan stress coverage. |
| `code-graph-context-stress.vitest.ts` | Test file | Context stress coverage. |
| `detect-changes-preflight-stress.vitest.ts` | Test file | Change detection stress coverage. |
| `doctor-apply-mode-stress.vitest.ts` | Test file | Doctor apply-mode policy coverage. |
| `walker-dos-caps.vitest.ts` | Test file | Traversal cap coverage. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run stress_test/code-graph
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md
```

Expected result: stress tests pass or explicitly skipped cases remain documented, and the README validator reports no blocking errors.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

| Document | Purpose |
|---|---|
| [../../../README.md](../../../README.md) | Skill-level overview and operator guide. |
| [../../tests/README.md](../../tests/README.md) | Unit and integration test map. |
| [../../lib/README.md](../../lib/README.md) | Runtime modules under stress coverage. |
| [../../../manual_testing_playbook/manual_testing_playbook.md](../../../manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenario index. |

<!-- /ANCHOR:related -->
