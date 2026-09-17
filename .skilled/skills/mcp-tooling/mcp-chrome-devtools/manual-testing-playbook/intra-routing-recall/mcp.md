---
id: CD-R02
category: intra_routing_recall
stage: routing
title: 'MCP routing'
description: "This scenario validates MCP routing for `CD-R02`. It focuses on confirming the mcp-chrome-devtools smart router's INTENT_SIGNALS classifier and RESOURCE_MAP load the session-management and CDP patterns references for a parallel-sessions, multi-tool Code Mode prompt."
expected_intent: MCP
expected_resources:
  - references/session-management.md
  - references/cdp-patterns.md
version: 1.0.0.1
---

# CD-R02: MCP routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-R02`.

---

## 1. OVERVIEW

This scenario validates MCP routing for `CD-R02`. It focuses on confirming that a prompt about running several parallel browser sessions through Code Mode as a multi-tool workflow scores highest against `INTENT_SIGNALS["MCP"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["MCP"]` set, not on actually running the parallel sessions, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

MCP is the parallel-instance path (`mcp-parallel-instances/` category, `BDG-014`..`BDG-018`), distinct from the single-session CLI default. Confirming this prompt resolves `MCP` and not `CLI` is what proves the router picks the heavier Code Mode transport only when the prompt actually needs multiple isolated instances.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CD-R02` classifies as `MCP` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `MCP` and every path in `expected_resources`
- Real user request: `Run several parallel browser sessions through code mode as a multi-tool mcp workflow.`
- Prompt: `Run several parallel browser sessions through code mode as a multi-tool mcp workflow.`

**Exact prompt**:
```text
Run several parallel browser sessions through code mode as a multi-tool mcp workflow.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); "code mode", "multi-tool", "parallel sessions", and "mcp" each match `MCP` keywords and no other intent scores as high, so `MCP` becomes the primary intent and `RESOURCE_MAP["MCP"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-chrome-devtools/`, and each documents `MCP` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the session-management and CDP patterns references and drives the parallel sessions through Code Mode rather than the single-session `bdg` CLI
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `MCP`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run several parallel browser sessions through code mode as a multi-tool mcp workflow.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/mcp.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md | sed -n '/"MCP":/p'`
3. `for p in references/session-management.md references/cdp-patterns.md; do test -e ".opencode/skills/mcp-tooling/mcp-chrome-devtools/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: MCP` in the frontmatter. Step 2 shows the `INTENT_SIGNALS["MCP"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["MCP"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `MCP`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `MCP`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_SIGNALS["MCP"]` excerpt and the `RESOURCE_MAP["MCP"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: CD-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/mcp.md`
