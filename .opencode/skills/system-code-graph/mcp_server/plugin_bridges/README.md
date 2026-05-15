---
title: "plugin_bridges: CLI bridge connecting spec-kit session resume to code-graph runtime"
description: "Initializes code-graph runtime and outputs transport payload for spec-kit plugin injection during context compaction."
trigger_phrases:
  - "spec-kit compact code graph bridge"
  - "code graph plugin bridge"
  - "context compaction code graph injection"
---

# plugin_bridges: CLI bridge connecting spec-kit session resume to code-graph runtime

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder owns the CLI bridge that connects spec-kit session resume operations to the code-graph MCP server runtime, enabling plugin injection during context compaction.

`spec-kit-compact-code-graph-bridge.mjs` initializes the code-graph runtime (vector index and session manager), calls the session resume handler, and outputs the transport payload on stdout. It lives outside the `.opencode/plugins/` directory to avoid OpenCode plugin discovery, serving as a targeted integration point for spec-kit context compaction workflows.

- The bridge requires the compiled `dist/` directory from the MCP server to be present.
- Runtime initialization must succeed before session resume is called.
- Output is JSON text payload on stdout, errors on stderr.
- Supports `--minimal` and `--spec-folder` flags.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

Single-file standalone CLI bridge. Initializes the code-graph runtime components (vector index and session manager), calls the session resume handler from `dist/handlers/`, and outputs the resulting transport payload as JSON. Serves as a targeted integration point for spec-kit context compaction. Lives outside the OpenCode plugin discovery path.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

Single-file folder, no internal topology. `spec-kit-compact-code-graph-bridge.mjs` is the sole file.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

| File | Role |
|------|------|
| `spec-kit-compact-code-graph-bridge.mjs` | CLI entrypoint that initializes code-graph runtime, calls session resume handler, and outputs the transport payload for spec-kit plugin injection |

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|------|---------------|
| `spec-kit-compact-code-graph-bridge.mjs` | Initializes vector index and session manager from `dist/`, calls session resume handler, outputs JSON transport payload to stdout |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|----------|------|
| Internal imports | `../dist/handlers/session-resume.js`, `../dist/lib/search/vector-index.js`, `../dist/lib/session/session-manager.js` |
| External imports | None |
| Ownership | Owns the CLI bridge logic for spec-kit to code-graph integration during context compaction |
| Callers | Invoked by spec-kit during context compaction to retrieve code-graph context for injection into the compacted session |
| Exit contract | JSON transport payload on stdout. Errors on stderr. Exit code 0 on success. |

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|------------|------|---------|
| `spec-kit-compact-code-graph-bridge.mjs` | CLI | CLI executable that bridges spec-kit session resume to code-graph runtime, supporting `--minimal` and `--spec-folder` flags |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

```bash
node .opencode/skills/system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs --help
```

Expected: help text on stdout showing supported flags.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [Parent: mcp_server](../README.md)
- [Skill README](../../README.md)
- [Handlers](../handlers/README.md)
<!-- /ANCHOR:related -->
