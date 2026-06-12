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

`mcp_server/plugin_bridges/` owns the prompt-safe CLI bridge that connects OpenCode plugin injection to the warm code-index daemon. It lives outside the `.opencode/plugins/` directory to avoid automatic OpenCode plugin discovery while still enabling targeted plugin injection during context compaction.

Current state:

- `mk-code-graph-bridge.mjs` is the only file. It probes the warm `mk-code-index` daemon through the daemon-backed CLI shim and outputs a JSON transport payload on stdout.
- The bridge supports `code-graph-status` by default, accepts a bounded JSON argument payload, and blocks maintenance tools during prompt-time use.
- Output is JSON text on stdout. Errors go to stderr.
- The bridge runs warm-only: missing sockets, cold daemons, stale dist, or timeouts return skipped or fail-open payloads instead of cold-spawning at prompt time.

The bridge no longer imports session-resume or vector-index internals. Its runtime path is `mk-code-graph-bridge.mjs` → `.opencode/bin/code-index.cjs` → warm daemon IPC. The session-resume and context-compaction handlers stay in `system-spec-kit`; this bridge contributes code-graph status for plugin payloads without crossing that ownership boundary.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `mk-code-graph-bridge.mjs` | CLI entrypoint that warm-probes the code-index daemon, calls the daemon-backed CLI with `--warm-only`, and outputs the transport payload. |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Does not import `system-spec-kit` resume handlers or code-index `dist/` modules directly; it routes through the committed CLI shim and launcher IPC bridge. |
| Invocation | Called by plugin/context-compaction surfaces. Not a standalone server or daemon. |
| Output | JSON text payload on stdout. Errors and diagnostics on stderr. |
| Dependencies | Requires the daemon-backed CLI assets and an already-warm `mk-code-index` daemon. Cold daemon state is reported as skipped. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ plugin/context compaction trigger        │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ mk-code-graph-bridge.mjs                 │
│ (parse payload, block maintenance tools) │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ warmProbe() checks daemon IPC socket     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ code-index.cjs --warm-only               │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ code graph status / context payload      │
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
| `mk-code-graph-bridge.mjs` | CLI | Bridges plugin payload generation to warm code-index daemon reads. |

---

## 5. VALIDATION

Start or reuse a warm code-index daemon, then exercise the bridge from the repository root.

```bash
node .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs --minimal --spec-folder <spec-folder>
```

Expected result: a single JSON document on stdout. A warm daemon returns `status: "ok"` with code-graph status details; cold or unavailable daemon state returns `status: "skipped"` or `"fail_open"` with retry metadata.

---

## 6. RELATED

- [Parent: mcp_server](../README.md)
- [Skill README](../../README.md)
- [Handlers: handlers/](../handlers/README.md)

**Naming note:** The bridge file `mk-code-graph-bridge.mjs` matches the plugin name `mk-code-graph` and the skill folder `system-code-graph`. The underlying MCP server name is `mk-code-index` (tool prefix `mcp__mk_code_index__*`), intentionally kept stable. See ADR-002 in the 036 packet.
