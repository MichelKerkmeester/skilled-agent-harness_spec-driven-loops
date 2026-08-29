---
id: AD-R03
category: intra-routing-recall
stage: routing
title: 'MCP routing'
description: "This scenario validates the SKILL.md Smart Router's MCP intent for `AD-R03`. It confirms a Code Mode tool-chaining prompt scores MCP and loads exactly RESOURCE_MAP['MCP'] as a full declared set, not a partial one."
expected_intent: MCP
expected_resources:
  - references/mcp-wiring.md
  - references/session-management.md
  - assets/utcp-aside-manual.md
version: 1.1.0.0
---

# AD-R03: MCP routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-R03`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's `MCP` intent signal fires on a
Code Mode tool-chaining request, and that the router loads exactly `RESOURCE_MAP["MCP"]` — all three
declared resources, `references/mcp-wiring.md`, `references/session-management.md`, and
`assets/utcp-aside-manual.md` — per `SKILL.md` §2.

### Why This Matters

Under this packet's `fallback-only` default-resource semantics (`SKILL.md` §2, `DEFAULT_RESOURCE_SEMANTICS
= "fallback-only"`), a scored route loads exactly its intent's declared resource set — never a partial
subset and never the unioned default. `MCP` is the one intent whose declared set has three entries
instead of two, including the `assets/utcp-aside-manual.md` UTCP manual snapshot needed for Code Mode
wiring. This scenario's gold adjudication is that the full three-resource set is bundled, not that the
router blesses or trims it to two.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `MCP` under `SKILL.md` §2's weighted keyword model and that
the router's `RESOURCE_MAP["MCP"]` entry matches this scenario's declared `expected_resources` in full.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["MCP"]` selects `MCP` as the
  top-scoring intent, and that all three mapped resources exist on disk.
- Real user request: `Run the aside mcp server over stdio and chain its repl tool with other code mode tools in one call_tool_chain block.`
- Prompt: `Run the aside mcp server over stdio and chain its repl tool with other code mode tools in one call_tool_chain block.`

**Exact prompt**:
```text
Run the aside mcp server over stdio and chain its repl tool with other code mode tools in one call_tool_chain block.
```

- Gold adjudication: under fallback-only assembly a scored route carries exactly its intent's declared
  resources, and the `MCP` intent declares `assets/utcp-aside-manual.md` (the UTCP manual needed for
  Code Mode wiring) alongside the two references — the gold lists the full declared set rather than
  blessing or omitting a partial one.
- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt and selects `MCP` because `mcp`, `code mode`, `stdio`, and `call_tool_chain` are all literal
  `INTENT_SIGNALS["MCP"]` keywords at weight 4 each.
- Expected signals: `SKILL.md` §2 lists `MCP` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["MCP"]` names exactly the three declared resources; all three files exist.
- Desired user-visible outcome: the router states plainly that this request routes to `MCP` and
  bundles all three resources — not a partial set — before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `MCP` keywords and all three mapped resources
  exist; FAIL if the keyword weights or `RESOURCE_MAP["MCP"]` entry in `SKILL.md` no longer matches
  this scenario's frontmatter, or any resource path is missing, or only a partial subset is loaded.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the aside mcp server over stdio and chain its repl tool with other code mode tools in one call_tool_chain block.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/mcp.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md && echo "OK references/mcp-wiring.md" || echo "MISS references/mcp-wiring.md"`
5. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md && echo "OK references/session-management.md" || echo "MISS references/session-management.md"`
6. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md && echo "OK assets/utcp-aside-manual.md" || echo "MISS assets/utcp-aside-manual.md"`

### Expected

Step 1 shows `expected_intent: MCP` and all three `expected_resources`. Step 2's output lists `"MCP"`
with keywords including `mcp`, `code mode`, `stdio`, and `call_tool_chain` at weight 4. Step 3's output
shows `"MCP": ["references/mcp-wiring.md", "references/session-management.md", "assets/utcp-aside-manual.md"]`.
Steps 4-6 all print `OK`.

### Evidence

Command transcript from steps 1-6; the `INTENT_SIGNALS["MCP"]`/`RESOURCE_MAP["MCP"]` excerpts from
steps 2-3 with the matched keywords and the full three-entry resource list highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `MCP` keywords and `RESOURCE_MAP["MCP"]` lists all three
  resources in full, and all three resource paths exist.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, a resource path does not resolve, or only a partial subset of the three is loaded.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["MCP"]` keyword list against this scenario's
   quoted matches to see which keyword moved or was reworded.
2. Re-run steps 4-6 and confirm whether a reference or asset file was renamed or removed.
3. If only two of the three resources loaded, confirm `RESOURCE_MAP["MCP"]` in `SKILL.md` §2 still
   declares the full three-entry set rather than a trimmed one.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |
| `install.md` | The neighboring routing scenario for the `INSTALL` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `MCP` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/mcp.md`
