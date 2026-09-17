---
title: "Toolset Selection And Web-Search Policy"
description: "The `-t` toolset list is a leaf's real boundary: `delegation` and `memory` are never included, a read-only lineage narrows to search and todo, and the `web` toolset follows the lineage's web-search policy."
trigger_phrases:
  - "toolset selection and web-search policy"
  - "HERMES_LEAF_TOOLSETS"
  - "HERMES_READ_ONLY_TOOLSETS"
  - "hermes web search policy"
version: 1.0.0.0
---

# Toolset Selection And Web-Search Policy (hermesToolsetsFor)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `-t` toolset list is a leaf's real boundary: `delegation` and `memory` are never included, a read-only lineage narrows to search and todo, and the `web` toolset follows the lineage's web-search policy.

Because Hermes has no confinement flag, the toolset list is the only thing that decides what a dispatched leaf can reach. It is chosen per dispatch rather than configured once.

---

## 2. HOW IT WORKS

### The Two Rosters

`HERMES_LEAF_TOOLSETS` names terminal, file, search, skills and todo. `HERMES_READ_ONLY_TOOLSETS` names search and todo. `hermesToolsetsFor` returns the read-only roster when the resolved sandbox is read-only, and otherwise returns the leaf roster with `web` appended unless the lineage's web-search policy is `disabled`.

Two stock toolsets are absent from both rosters by design. `delegation` would let a leaf spawn Hermes sub-agents outside the runner's delegation boundary, and `memory` would let prior sessions bleed into the iteration and the iteration bleed back out. Hermes's own default roster enables both, which is why every dispatch passes an explicit list rather than relying on the default.

### Web-Search Capability

Because the list is rebuilt per dispatch, Hermes is one of the few executor kinds whose web-search capability matrix records `disabled` and `live` as genuinely enforceable alongside `inherit`: `live` names the `web` toolset, `disabled` leaves it out, and `inherit` keeps the stock behavior, which carries it. Nothing caches results, so `cached` stays unsupported.

### MCP Visibility

An MCP server that the operator has configured is reachable only when its name appears in the `-t` list. A run given a narrowed list simply does not see it, with no error and no warning, so a prompt that depends on a server tool has to confirm the server is configured and named.

### MCP servers per lineage

A configured MCP server is invisible to a Hermes run unless its name is in the `-t` list, so a lineage names the servers it needs in `liveTools.mcpServers`. `hermesToolsetsFor` appends them after the base toolsets, deduplicated; `assertExecutorMcpServerCapability` in `executor-config.ts` refuses a non-empty list on any other executor kind and refuses the reserved names `delegation`, `memory` and `clarify`; `MCP_SERVER_NAME_PATTERN` rejects a name that cannot be a Hermes toolset.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | `HERMES_LEAF_TOOLSETS`, `HERMES_READ_ONLY_TOOLSETS` and `hermesToolsetsFor`. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Shared | The `cli-hermes` row of the web-search capability matrix. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/hermes-tools.md` | Handler | Per-toolset inventory and the leaf policy for each one. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md` | Handler | Why a configured server stays invisible until it is named in the toolset list. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Vitest | Covers toolset selection across sandbox and web-search combinations. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Vitest | Asserts the web-search capability matrix per executor kind. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Vitest | Checks the sandbox and policy combinations the fan-out accepts. |

---

## 4. SOURCE METADATA

- Group: Fan-out dispatch
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fanout-dispatch/toolset-and-web-search-policy.md`

Related references:
- [closed-model-roster.md](closed-model-roster.md) - the other fence the builder applies before spawning.
- [executor-audit-identity.md](executor-audit-identity.md) - the environment scoping that accompanies the toolset boundary.
