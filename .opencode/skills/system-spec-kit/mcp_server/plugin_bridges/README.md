---
title: "Plugin Bridges: OpenCode Helper Scripts"
description: "Executable helper scripts used by OpenCode plugins to call Spec Kit runtime surfaces."
trigger_phrases:
  - "plugin bridge"
  - "opencode helper script"
---

# Plugin Bridges: OpenCode Helper Scripts

---

## 1. OVERVIEW

`plugin_bridges/` contains Node `.mjs` helper scripts that sit outside `.opencode/plugins/`. The scripts let plugin entrypoints call built MCP server and advisor surfaces while keeping OpenCode plugin discovery limited to real plugin files.

Current state:

- Code-graph bridge lives at `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`.
- Message-shape helpers for safe synthetic text-part insertion live here.
- Skill advisor subprocess bridge with native and local fallback paths lives here.

---

## 2. DIRECTORY TREE

```text
plugin_bridges/
+-- spec-kit-opencode-message-schema.mjs    # Validates OpenCode message parts and markers
+-- spec-kit-skill-advisor-bridge.mjs       # Calls advisor compat handlers over stdin and stdout
`-- README.md
```

Note: the code-graph bridge was relocated to `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` (renamed from `spec-kit-compact-code-graph-bridge.mjs`) as part of packet 036.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `spec-kit-opencode-message-schema.mjs` | Defines message-anchor checks, synthetic text-part creation and unsafe part detection. |
| `spec-kit-skill-advisor-bridge.mjs` | Reads bridge input from stdin, calls advisor compat modules and emits one JSON response. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | May import built runtime files from `mcp_server/dist/` and local schema files needed by plugin bridges. |
| Exports | Message schema helpers export functions for plugin code. Executable bridges communicate through stdin, stdout and stderr. |
| Ownership | Owns subprocess and plugin-adapter glue. Core MCP behavior stays in handlers, session libraries and advisor compat modules. |

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
- [`../skill_advisor/README.md`](../skill_advisor/README.md)
- Code-graph bridge: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/`
