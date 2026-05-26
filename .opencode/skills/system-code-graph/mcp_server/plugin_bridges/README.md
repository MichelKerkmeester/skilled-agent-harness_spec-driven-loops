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

---

## 1. OVERVIEW

`mcp_server/plugin_bridges/` owns the CLI bridge that connects spec-kit session resume operations to the code-graph MCP server runtime. It lives outside the `.opencode/plugins/` directory to avoid automatic OpenCode plugin discovery while still enabling targeted plugin injection during context compaction.

Current state:

- `mk-code-graph-bridge.mjs` is the only file. Intended to initialize the code-graph runtime, call the session resume handler, and output a JSON transport payload on stdout.
- The bridge supports `--minimal` and `--spec-folder` flags. Any other flag is silently ignored.
- Output is JSON text on stdout. Errors go to stderr.
- All `console.*` output from runtime modules is redirected to stderr to keep stdout pure JSON.

**Post-extraction drift status:** The bridge's `import` statements currently point at modules that moved to `system-spec-kit` during the three-way isolation refactor (v1.0.3.0). The three import targets are:

| Bridge expects (broken) | Actual current location |
|---|---|
| `../dist/handlers/session-resume.js` | `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/session-resume.js` |
| `../dist/lib/search/vector-index.js` | `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index.js` |
| `../dist/lib/session/session-manager.js` | `.opencode/skills/system-spec-kit/mcp_server/dist/lib/session/session-manager.js` |

The session-resume + context-compaction handlers stayed in `system-spec-kit` (per ADR-001 ownership boundary). The bridge needs either a cross-skill import rewrite (with the appropriate compile-time and runtime guarantees) or full retirement. Until then, the bridge is non-functional. Active callers should route through `system-spec-kit` handlers directly. Follow-on packet TBD.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `mk-code-graph-bridge.mjs` | CLI entrypoint that initializes code-graph runtime, calls session resume and outputs the transport payload. Supports `--minimal` and `--spec-folder` flags. |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Currently points at `../dist/` paths that no longer exist post-extraction. See §1 Post-extraction drift status. |
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

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `mk-code-graph-bridge.mjs` | CLI | Bridges spec-kit session resume to code-graph runtime. Supports `--minimal` and `--spec-folder` flags. |

---

## 5. VALIDATION

Build the MCP server first, then exercise the bridge against a spec folder. Run from the repository root.

```bash
cd .opencode/skills/system-code-graph && npm run build
node .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs --minimal --spec-folder <spec-folder>
```

Expected result: a single JSON document on stdout with the resume payload. Exit code 0. Any runtime initialization error exits 1 with a message on stderr.

---

## 6. RELATED

- [Parent: mcp_server](../README.md)
- [Skill README](../../README.md)
- [Handlers: handlers/](../handlers/README.md)

**Naming note:** The bridge file `mk-code-graph-bridge.mjs` matches the plugin name `mk-code-graph` and the skill folder `system-code-graph`. The underlying MCP server name is `mk-code-index` (tool prefix `mcp__mk_code_index__*`), intentionally kept stable. See ADR-002 in the 036 packet.
