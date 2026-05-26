---
title: "Plugin Bridges: Skill Advisor Bridge"
description: "Subprocess bridge between the mk-skill-advisor OpenCode plugin and the standalone mk_skill_advisor MCP server."
trigger_phrases:
  - "plugin bridge"
  - "mk-skill-advisor bridge"
  - "advisor plugin bridge"
---

# Plugin Bridges: Skill Advisor

---

## 1. OVERVIEW

`plugin_bridges/` contains the Node `.mjs` subprocess bridge between `.opencode/plugins/mk-skill-advisor.js` and the standalone `mk_skill_advisor` MCP server.

The bridge reads stdin JSON (prompt, workspaceRoot, thresholdConfidence), probes the advisor daemon, calls `advisor_recommend`, renders a brief and emits a single stdout JSON envelope (`{ status, brief, metadata }`). It fails open on all errors so the OpenCode plugin never blocks on advisor unavailability.

This bridge was moved from `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/` (pre-extraction legacy) to proper advisor ownership per ADR-003.

---

## 2. FILE INVENTORY

| File | Responsibility |
|---|---|
| `mk-skill-advisor-bridge.mjs` | Stdin-to-stdout bridge: parses input, probes advisor, calls recommend, renders brief, emits JSON. |
| `README.md` | This file. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | May import MCP SDK client, `compat-contract.json` and the advisor launcher path. Does not import TypeScript source. |
| Exports | `buildBrief`, `buildLegacyBrief`, `buildNativeBrief`, `createChildEnv`, `parseInput`, `renderAdvisorBrief`, `response`, exported for testability. |
| Ownership | Owned by `system-skill-advisor`. The bridge is the sole subprocess entrypoint the plugin uses. |

---

## 4. VALIDATION

Run from the repository root:

```bash
npx vitest run .opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge.vitest.ts
npx vitest run .opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge-smoke.vitest.ts
```

Both must pass with the bridge at its current path.

---

## 5. RELATED

- [`../../plugins/README.md`](../../../../plugins/README.md)
- [`../../mcp_server/README.md`](../README.md)
- [`../../../system-spec-kit/mcp_server/plugin_bridges/README.md`](../../../system-spec-kit/mcp_server/plugin_bridges/README.md)
