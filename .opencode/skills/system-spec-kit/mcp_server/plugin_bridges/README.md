---
title: "Plugin Bridges: OpenCode Helper Scripts"
description: "Executable helper scripts used by OpenCode plugins to call Spec Kit runtime surfaces."
trigger_phrases:
  - "plugin bridge"
  - "opencode helper script"
---

# Plugin Bridges: OpenCode Helper Scripts

> OpenCode helper-script boundary for plugin code that needs built Spec Kit runtime surfaces without turning helper files into discoverable plugins.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. DIRECTORY TREE](#2-directory-tree)
- [3. KEY FILES](#3-key-files)
- [4. BOUNDARIES](#4-boundaries)
- [5. VALIDATION](#5-validation)
- [6. RELATED](#6-related)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW

`plugin_bridges/` contains Node `.mjs` helper scripts that sit outside `.opencode/plugins/`. The scripts let plugin entrypoints call built MCP server and advisor surfaces while keeping OpenCode plugin discovery limited to real plugin files.

Current state:

- Spec-memory plugin bridge lives here as `mk-spec-memory-bridge.mjs` and routes through the daemon-backed `spec-memory.cjs` CLI.
- Message-shape helpers for safe synthetic text-part insertion live here.
- Code-graph bridge lives at `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`.
- The goal plugin `.opencode/plugins/mk-goal.js` is intentionally absent from this directory because it is a standalone local OpenCode plugin, not a daemon bridge. Its operator contract lives in `../../references/hooks/goal_plugin.md`.

---

## 2. DIRECTORY TREE

```text
plugin_bridges/
+-- mk-spec-memory-bridge.mjs              # Calls the spec-memory CLI front door for plugin payloads
+-- spec-kit-opencode-message-schema.mjs    # Validates OpenCode message parts and markers
`-- README.md
```

Note: the code-graph bridge now lives at `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` and was renamed from `spec-kit-compact-code-graph-bridge.mjs`.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `mk-spec-memory-bridge.mjs` | Reads bridge input from stdin, calls `.opencode/bin/spec-memory.cjs` over the warm daemon CLI path, and emits one JSON response. |
| `spec-kit-opencode-message-schema.mjs` | Defines message-anchor checks, synthetic text-part creation and unsafe part detection. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | May import built runtime files from `mcp_server/dist/` and local schema files needed by plugin bridges. |
| Exports | Message schema helpers export functions for plugin code. Executable bridges communicate through stdin, stdout and stderr. |
| Ownership | Owns subprocess and plugin-adapter glue. Core MCP behavior stays in handlers, session libraries and advisor compat modules. |
| Non-bridge plugins | Local plugin state machines such as `mk-goal.js` stay in `.opencode/plugins/` and are documented by hook references rather than bridge scripts. |

---

## 5. VALIDATION

Run from the repository root.

```bash
npm test -- --runInBand
```

Expected result: Plugin bridge smoke tests and related advisor or message-schema tests pass.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../skill_advisor/README.md`](../../../system-skill-advisor/mcp_server/README.md)
- Code-graph bridge: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/`
- Goal plugin contract: `../../references/hooks/goal_plugin.md`
