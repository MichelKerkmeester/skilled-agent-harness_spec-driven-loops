---
title: "MDR-007: Open Design Transport Mode Routing"
description: "Verify Open Design wiring/CLI requests resolve to the nested design-mcp-open-design transport packet, not a design-judgment mode."
version: 1.0.0.0
id: MDR-007
expected_workflow_mode: design-mcp-open-design
expected_leaf_resources: []
---

# MDR-007: Open Design Transport Mode Routing

## 1. OVERVIEW

This scenario verifies that requests to wire, connect, or drive the Open Design app's `od` CLI route through the `sk-design` hub to `workflowMode: design-mcp-open-design` — the hub's `packetKind: "transport"` entry — rather than being absorbed into a design-judgment mode or lost to the external sibling `mcp-figma`.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants to register Open Design's MCP server with their terminal agent before doing any design work.

**Exact prompt**:
```text
Wire Open Design's MCP server into opencode so I can drive od cli from the terminal.
```

**Expected mode resolution**: `design-mcp-open-design`.

**Why**:
- `mode-registry.json` lists `design-mcp-open-design` with `packetKind: "transport"` and aliases including `open design`, `od mcp`, `od cli`, `wire open design`, and `connect open design`.
- `hub-router.json` maps `design-mcp-open-design-aliases` (weight 4) plus `hub-identity` to `design-mcp-open-design`.
- The request names Open Design and a wiring action, not a visual-direction, token, motion, audit, or extraction axis, so none of the five `packetKind: "workflow"` modes should win.

**Expected packet loaded**:
- `design-mcp-open-design/SKILL.md`

**Expected shared resources loaded or cited**:
- None required. `design-mcp-open-design` is a transport packet, not a doc-guidance mode; it does not consume `shared/anti-slop-principles.md`, `shared/cognitive-laws.md`, or `shared/design-token-vocabulary.md`.

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`, with the hub then resolving `design-mcp-open-design`, not the external `mcp-figma` sibling skill.

**Expected tool surface**: `Read` and `Bash` only. The `design-mcp-open-design` registry entry forbids `Write` and `Edit`, and `mutatesWorkspace` is `false` — its `Bash` calls drive the external Open Design daemon, never this repo's own workspace.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: design-mcp-open-design`, `packetKind: "transport"`, and `packet: design-mcp-open-design`.
2. `hub-router.json` contains a `design-mcp-open-design-aliases` vocabulary class and a matching `routerSignals` entry.
3. `.opencode/skills/sk-design/design-mcp-open-design/` exists with `SKILL.md` and no `graph-metadata.json` of its own.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MDR007-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, resources, tool calls, and response in `/tmp/skd-MDR007-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `design-mcp-open-design`, packet is `design-mcp-open-design/SKILL.md`, and no `Write`/`Edit` tool call occurs.
- **FAIL** iff a design-judgment mode (`interface`/`foundations`/`motion`/`audit`/`md-generator`) wins instead, the external `mcp-figma` skill wins, or a mutating tool beyond `Bash` is used.

### Failure Triage

1. If a design-judgment mode wins instead, verify `design-mcp-open-design-aliases` keywords (`open design`, `od cli`, `od mcp`, `wire open design`, `connect open design`) are present and not shadowed by a higher-weight class.
2. If `mcp-figma` wins instead, verify the prompt names Open Design specifically and check for accidental keyword overlap between `design-mcp-open-design-aliases` and `mcp-figma`'s own vocabulary.
3. If a mutating tool call beyond `Bash` occurs, verify the registry's `toolSurface.forbidden` still lists `Write` and `Edit` for this mode.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
