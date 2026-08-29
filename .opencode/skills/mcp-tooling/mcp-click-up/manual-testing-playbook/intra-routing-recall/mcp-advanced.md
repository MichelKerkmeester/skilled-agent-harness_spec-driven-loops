---
id: CU-R02
category: intra_routing_recall
stage: routing
title: 'MCP advanced routing'
description: "This scenario validates the SKILL.md Smart Router's MCP_ADVANCED intent for `CU-R02`. It confirms a documents/goals/bulk-create prompt scores MCP_ADVANCED and loads exactly RESOURCE_MAP['MCP_ADVANCED']."
expected_intent: MCP_ADVANCED
expected_resources:
  - references/mcp-tools.md
version: 1.1.0.0
---

# CU-R02: MCP advanced routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CU-R02`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-click-up` Smart Router's `MCP_ADVANCED` intent signal fires on
a request naming ClickUp's document, goal, and bulk-create surfaces, and that the router loads
exactly `RESOURCE_MAP["MCP_ADVANCED"]` — `references/mcp-tools.md` alone — per `SKILL.md` §2.

### Why This Matters

`MCP_ADVANCED` covers the official ClickUp MCP surface beyond everyday `cupt` CLI ops — documents,
goals/OKRs, bulk operations, webhooks, and structural changes. `route_clickup_resources()` runs a
hard tie-break that lets a `TROUBLESHOOT` score above 3 or an `INSTALL` score above 4 override any
other intent. This scenario proves a documents/goals/bulk-create prompt, with no error or setup
language in it, resolves to `MCP_ADVANCED` cleanly rather than being pulled off course by that
tie-break.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `MCP_ADVANCED` under `SKILL.md` §2's weighted keyword model
and that the router's `RESOURCE_MAP["MCP_ADVANCED"]` entry matches this scenario's declared
`expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["MCP_ADVANCED"]` selects
  `MCP_ADVANCED` as the routed intent, that no `TROUBLESHOOT`/`INSTALL` tie-break keyword fires, and
  that the mapped resource exists on disk.
- Real user request: `Create a ClickUp document, set quarterly OKR goals, and bulk-create the sprint task cards.`
- Prompt: `Create a ClickUp document, set quarterly OKR goals, and bulk-create the sprint task cards.`

**Exact prompt**:
```text
Create a ClickUp document, set quarterly OKR goals, and bulk-create the sprint task cards.
```

- Expected execution process: the router scores every intent's keyword set (weight 5 per hit) against
  the lowercased prompt; `document`, `goal`, `okr`, and `bulk` are all literal
  `INTENT_SIGNALS["MCP_ADVANCED"]` keywords, none of `TROUBLESHOOT`'s or `INSTALL`'s keywords appear,
  so the tie-break at `SKILL.md` §2 falls through to `max(scores, key=scores.get)` and selects
  `MCP_ADVANCED`.
- Expected signals: `SKILL.md` §2 lists `MCP_ADVANCED` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["MCP_ADVANCED"]` names exactly `references/mcp-tools.md`; the file exists.
- Desired user-visible outcome: the router states plainly that this request routes to `MCP_ADVANCED`
  and bundles the MCP tool reference before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `MCP_ADVANCED` keywords, no
  `TROUBLESHOOT`/`INSTALL` keyword is present in the prompt, and the mapped resource exists; FAIL if
  the keyword weights or `RESOURCE_MAP["MCP_ADVANCED"]` entry in `SKILL.md` no longer matches this
  scenario's frontmatter, or the resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a ClickUp document, set quarterly OKR goals, and bulk-create the sprint task cards.`

### Commands

1. `sed -n '1,10p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/mcp-advanced.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md && echo "OK references/mcp-tools.md" || echo "MISS references/mcp-tools.md"`

### Expected

Step 1 shows `expected_intent: MCP_ADVANCED`. Step 2's output lists `"MCP_ADVANCED"` with keywords
including `document`, `goal`, `okr`, and `bulk` at weight 5, and confirms none of `TROUBLESHOOT`'s or
`INSTALL`'s keywords are present in the exact prompt. Step 3's output shows
`"MCP_ADVANCED": ["references/mcp-tools.md"]`. Step 4 prints `OK`.

### Evidence

Command transcript from steps 1-4; the `INTENT_SIGNALS["MCP_ADVANCED"]`/`RESOURCE_MAP["MCP_ADVANCED"]`
excerpts from steps 2-3 with the matched keywords highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `MCP_ADVANCED` keywords, no tie-break keyword from
  `TROUBLESHOOT`/`INSTALL` appears in the prompt, `RESOURCE_MAP["MCP_ADVANCED"]` lists the resource,
  and the resource path exists.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, a `TROUBLESHOOT`/`INSTALL` keyword unexpectedly fires the tie-break, or the resource
  path does not resolve.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["MCP_ADVANCED"]` keyword list against this
   scenario's quoted matches to see which keyword moved or was reworded.
2. Re-run step 4 and confirm whether `references/mcp-tools.md` was renamed or removed.
3. If the prompt instead scored `TROUBLESHOOT` or `INSTALL`, re-read `SKILL.md` §2's tie-break rule
   for an unexpected keyword hit.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §16 routing-recall index |
| `holdout-advanced.md` | The blind holdout counterpart for the same `MCP_ADVANCED` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `MCP_ADVANCED` `INTENT_SIGNALS` keywords, `RESOURCE_MAP` entry, and tie-break rule this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CU-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/mcp-advanced.md`
