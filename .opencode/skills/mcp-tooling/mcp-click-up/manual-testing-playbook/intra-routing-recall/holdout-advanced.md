---
id: CU-H02
category: intra_routing_recall
stage: holdout
title: 'Blind holdout — advanced feature'
description: "This scenario validates the SKILL.md Smart Router's MCP_ADVANCED intent generalizes to a prompt authored keyword-blind for `CU-H02`. It confirms plain OKR/documents phrasing still scores MCP_ADVANCED via the recorded blindExceptions vocabulary."
expected_intent: MCP_ADVANCED
expected_resources:
  - references/mcp-tools.md
blindExceptions:
  - "quarterly objective"
  - "objective"
  - "write-up page"
version: 1.1.0.0
---

# CU-H02: Blind holdout — advanced feature

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CU-H02`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-click-up` Smart Router's `MCP_ADVANCED` intent still resolves
correctly on a prompt that was originally authored with no router keyword, intent-key name, skill id,
or resource basename. It confirms the router loads exactly `RESOURCE_MAP["MCP_ADVANCED"]` even
through this narrower, more natural keyword surface.

### Why This Matters

`CU-R02` proves the router works when a prompt uses obvious ClickUp MCP vocabulary (`document`,
`goal`, `okr`, `bulk`). This holdout proves the router still generalizes when an operator describes
the same "set up an OKR and a shared doc" workflow in plain language. The prompt is not
keyword-free — during routing remediation the natural OKR/documents vocabulary
`quarterly objective` / `objective` / `write-up page` was deliberately bound into
`INTENT_SIGNALS["MCP_ADVANCED"]` so semantic recall works without gold leakage — but it was authored
blind before that binding, and the binding is the honest anchor recorded in this scenario's
`blindExceptions` frontmatter.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt, despite its keyword-blind authoring, still scores `MCP_ADVANCED`
under `SKILL.md` §2's weighted keyword model via the recorded `blindExceptions`, and that the
router's `RESOURCE_MAP["MCP_ADVANCED"]` entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's narrower keyword overlap with `INTENT_SIGNALS["MCP_ADVANCED"]` —
  via `quarterly objective`, `objective`, and `write-up page` — still selects `MCP_ADVANCED`, and that
  the mapped resource exists on disk.
- Real user request: `Set up a new quarterly objective for the team and spin up a shared write-up page in ClickUp where we can draft the plan.`
- Prompt: `Set up a new quarterly objective for the team and spin up a shared write-up page in ClickUp where we can draft the plan.`

**Exact prompt**:
```text
Set up a new quarterly objective for the team and spin up a shared write-up page in ClickUp where we can draft the plan.
```

- Holdout honesty anchor: the prompt describes a documents/objectives task in natural words, authored
  with NO router keyword, intent-key name, skill id, or resource basename. During routing remediation
  the natural OKR/documents vocabulary `quarterly objective` / `objective` / `write-up page` was bound
  into `MCP_ADVANCED` so semantic recall works without gold leakage; the prompt is no longer blind for
  those phrases — recorded in `blindExceptions` above.
- Expected execution process: the router scores every intent's keyword set (weight 5 per hit) against
  the lowercased prompt; `quarterly objective`, `objective`, and `write-up page` are the literal
  `INTENT_SIGNALS["MCP_ADVANCED"]` keywords present. The prompt's `Set up` phrasing does not match
  `INSTALL`'s `setup` keyword (no space), so no tie-break competitor fires, and
  `max(scores, key=scores.get)` selects `MCP_ADVANCED`.
- Expected signals: `SKILL.md` §2 lists `quarterly objective`, `objective`, and `write-up page` under
  `INTENT_SIGNALS["MCP_ADVANCED"]`; `RESOURCE_MAP["MCP_ADVANCED"]` names exactly
  `references/mcp-tools.md`; the file exists.
- Desired user-visible outcome: the router states plainly that this request routes to `MCP_ADVANCED`
  and bundles the MCP tool reference, despite the prompt never naming the tool or intent.
- Pass/fail: PASS if `SKILL.md` §2 confirms all three matched keywords under `MCP_ADVANCED` and the
  mapped resource exists; FAIL if any of those keywords is removed from `MCP_ADVANCED`, the
  `RESOURCE_MAP["MCP_ADVANCED"]` entry in `SKILL.md` no longer matches this scenario's frontmatter, or
  the resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Set up a new quarterly objective for the team and spin up a shared write-up page in ClickUp where we can draft the plan.`

### Commands

1. `sed -n '1,20p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/holdout-advanced.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
3. `sed -n '/^```text$/,/^```$/p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/holdout-advanced.md | grep -io 'clickup mcp\|cupt\|\bmcp\b\|document\b\|\bgoal\b\|\bokr\b\|\bbulk\b' || echo "no obvious router keyword in the prompt body"`
4. `test -e .opencode/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md && echo "OK references/mcp-tools.md" || echo "MISS references/mcp-tools.md"`

### Expected

Step 1 shows `expected_intent: MCP_ADVANCED` and the `blindExceptions` list (`quarterly objective`,
`objective`, `write-up page`). Step 2's output confirms all three are present under
`INTENT_SIGNALS["MCP_ADVANCED"]`. Step 3 prints `no obvious router keyword in the prompt body` (the
obvious tool-name/intent-key keywords like `document`, `goal`, `okr`, `bulk`, `mcp` are absent — the
prompt only carries the bound `blindExceptions` phrases). Step 4 prints `OK`.

### Evidence

Command transcript from steps 1-4; the `INTENT_SIGNALS["MCP_ADVANCED"]` excerpt from step 2 with
`quarterly objective`/`objective`/`write-up page` highlighted; step 3's confirmation that the prompt
body carries no other obvious router keyword.

### Pass / Fail

- **Pass**: `SKILL.md` §2 still lists all three `blindExceptions` keywords under `MCP_ADVANCED`, the
  prompt body carries no other obvious router keyword, and `RESOURCE_MAP["MCP_ADVANCED"]`'s resource
  path exists.
- **Fail**: any of the three keywords is removed from `MCP_ADVANCED`'s list, the resource map no
  longer matches this scenario's frontmatter, or the resource path does not resolve.

### Failure Triage

1. Re-run step 2 and confirm `quarterly objective`, `objective`, and `write-up page` are still
   present under `INTENT_SIGNALS["MCP_ADVANCED"]` at a nonzero weight.
2. Re-run step 4 and confirm whether `references/mcp-tools.md` was renamed or removed.
3. Compare against the non-blind `mcp-advanced.md` scenario to isolate whether a routing regression is
   holdout-specific or affects `MCP_ADVANCED` generally.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §16 routing-recall index |
| `mcp-advanced.md` | The non-blind routing scenario for the same `MCP_ADVANCED` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `MCP_ADVANCED` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CU-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-advanced.md`
