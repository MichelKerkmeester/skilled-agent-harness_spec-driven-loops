---
title: "Plugin Bridges: Spec-Kit Code Graph Integration"
description: "CLI bridge that connects spec-kit session resume to the code-graph MCP server runtime, enabling plugin injection during context compaction."
trigger_phrases:
  - "code graph plugin bridge"
  - "spec-kit compact bridge"
  - "code graph session resume"
  - "context compaction plugin"
---

# Plugin Bridges: Code Graph Integration

> CLI bridge that initializes the code-graph runtime, calls session resume and outputs a transport payload for spec-kit plugin injection.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. KEY FILES](#2--key-files)
- [3. BOUNDARIES AND FLOW](#3--boundaries-and-flow)
- [4. ENTRYPOINTS](#4--entrypoints)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/plugin_bridges/` owns the CLI bridge that connects spec-kit session resume operations to the code-graph MCP server runtime. It lives outside the `.opencode/plugins/` directory to avoid automatic OpenCode plugin discovery while still enabling targeted plugin injection during context compaction.

Current state:

- `mk-code-graph-bridge.mjs` is the only file. It initializes the code-graph runtime, calls the session resume handler and outputs a JSON transport payload on stdout.
- The bridge requires a compiled MCP server. It imports from `../dist/handlers/session-resume.js`, `../dist/lib/search/vector-index.js` and `../dist/lib/session/session-manager.js`.
- Intended to be invoked by spec-kit session resume flows during context compaction to retrieve code-graph context for injection into the compacted session.
- The bridge supports `--minimal` and `--spec-folder` flags. Any other flag is silently ignored.
- Output is JSON text on stdout. Errors go to stderr.
- All `console.*` output from runtime modules is redirected to stderr to keep stdout pure JSON.

Runtime initialization must finish before the session resume call executes. The module does not import external packages beyond the MCP server runtime.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:key-files -->
## 2. KEY FILES

| File | Responsibility |
|---|---|
| `mk-code-graph-bridge.mjs` | CLI entrypoint that initializes code-graph runtime, calls session resume and outputs the transport payload. Supports `--minimal` and `--spec-folder` flags. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Only imports compiled runtime from `../dist/`. Does not import source TypeScript directly. |
| Invocation | Called by spec-kit during context compaction. Not a standalone server or daemon. |
| Output | JSON text payload on stdout. Errors and diagnostics on stderr. |
| Dependencies | Requires the MCP server to be built (`dist/` directory present). |

Main flow:

```text
╭──────────────────────────────────────────╮
│ spec-kit context compaction trigger      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ mk-code-graph-bridge.mjs                   │
│ (parse --minimal and --spec-folder)      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ vector-index.js (initialize runtime)     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ session-manager.js (load session state)  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ session-resume.js (build context)        │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ JSON transport payload on stdout         │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `mk-code-graph-bridge.mjs` | CLI | Bridges spec-kit session resume to code-graph runtime. Supports `--minimal` and `--spec-folder` flags. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Build the MCP server first, then exercise the bridge against a spec folder. Run from the repository root.

```bash
cd .opencode/skills/system-code-graph && npm run build
node .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs --minimal --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/017-code-folder-readmes
```

Expected result: a single JSON document on stdout with the resume payload. Exit code 0. Any runtime initialization error exits 1 with a message on stderr.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED

- [Parent: mcp_server](../README.md)
- [Skill README](../../README.md)
- [Handlers: handlers/](../handlers/README.md)

**Naming note:** The bridge file `mk-code-graph-bridge.mjs` matches the plugin name `mk-code-graph` and the skill folder `system-code-graph`. The underlying MCP server name is `mk-code-index` (tool prefix `mcp__mk_code_index__*`), intentionally kept stable — see ADR-002 in the 036 packet.

<!-- /ANCHOR:related -->
