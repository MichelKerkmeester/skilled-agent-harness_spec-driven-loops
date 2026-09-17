---
id: FG-R05
category: intra_routing_recall
stage: routing
title: 'MCP context routing'
description: "This scenario validates MCP_CONTEXT routing for `FG-R05`. It focuses on confirming the mcp-figma smart router's INTENT_MODEL classifier and RESOURCE_MAP load the Code Mode Framelink wiring reference, the paste-ready manual and .env snippets, and the CLI baseline for an optional MCP-context-pull prompt."
expected_intent: MCP_CONTEXT
expected_resources:
  - references/mcp-wiring.md
  - assets/utcp-figma-manual.md
  - assets/env-template.md
  - references/figma-cli-reference.md
version: 1.0.0.1
---

# FG-R05: MCP context routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-R05`.

---

## 1. OVERVIEW

This scenario validates MCP_CONTEXT routing for `FG-R05`. It focuses on confirming that a prompt about pulling design context through Code Mode via the `figma-developer-mcp` wiring scores highest against `INTENT_MODEL["MCP_CONTEXT"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["MCP_CONTEXT"]` set, not on actually invoking a Code Mode tool, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

MCP_CONTEXT is the only intent whose `RESOURCE_MAP` entry loads `assets/` snippets (`SKILL.md` §2 Resource Loading Levels, CONDITIONAL row). Verifying this scenario's four-path set keeps the optional Code Mode path (Framelink `figma` manual, `figma_FIGMA_API_KEY` .env line) discoverable without pulling it into every CLI-only route.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `FG-R05` classifies as `MCP_CONTEXT` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `MCP_CONTEXT` and every path in `expected_resources`
- Real user request: `Pull design context through code mode via the figma-developer-mcp wiring.`
- Prompt: `Pull design context through code mode via the figma-developer-mcp wiring.`

**Exact prompt**:
```text
Pull design context through code mode via the figma-developer-mcp wiring.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "mcp", "code mode", and "figma-developer-mcp" each match `MCP_CONTEXT` keywords and no other intent scores as high, so `MCP_CONTEXT` becomes the primary intent and `RESOURCE_MAP["MCP_CONTEXT"]` loads all four declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, and each documents `MCP_CONTEXT` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the Framelink wiring reference, the paste-ready manual and .env snippets, and the CLI baseline, then discovers the live `figma` manual through Code Mode (`list_tools`/`search_tools`/`tool_info`) before invoking any tool
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `MCP_CONTEXT`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Pull design context through code mode via the figma-developer-mcp wiring.`

### Commands

1. `sed -n '1,17p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/mcp-context.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"MCP_CONTEXT":/p'`
3. `for p in references/mcp-wiring.md assets/utcp-figma-manual.md assets/env-template.md references/figma-cli-reference.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: MCP_CONTEXT` in the frontmatter. Step 2 shows the `INTENT_MODEL["MCP_CONTEXT"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 4 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["MCP_CONTEXT"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `MCP_CONTEXT`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `MCP_CONTEXT`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["MCP_CONTEXT"]` excerpt and the `RESOURCE_MAP["MCP_CONTEXT"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.
3. If the Code Mode `figma` manual itself is unavailable (not registered, or `figma_FIGMA_API_KEY` missing from `.env`), that blocks live discovery specifically -- record it as a SKIP for the live-discovery follow-up, not as a FAIL of this static path-resolution scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | `INTENT_MODEL`/`INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | Activation triggers this scenario's prompt assumes |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: FG-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/mcp-context.md`
