---
id: CU-R04
category: intra_routing_recall
stage: routing
title: 'Troubleshoot routing'
description: "This scenario validates the SKILL.md Smart Router's TROUBLESHOOT intent for `CU-R04`. It confirms a failure-report prompt scores TROUBLESHOOT and loads exactly RESOURCE_MAP['TROUBLESHOOT']."
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
version: 1.1.0.0
---

# CU-R04: Troubleshoot routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CU-R04`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-click-up` Smart Router's `TROUBLESHOOT` intent signal fires on
a realistic failure-report request, and that the router loads exactly
`RESOURCE_MAP["TROUBLESHOOT"]` — `references/troubleshooting.md` alone — per `SKILL.md` §2.

### Why This Matters

`TROUBLESHOOT` sits first in `route_clickup_resources()`'s hard tie-break: a `TROUBLESHOOT` score
above 3 wins over every other intent's score outright, before the `INSTALL` check or the general
`max()` fallback even run. This scenario proves a realistic error-report prompt — HTTP status code,
"not working", and a performance complaint together — crosses that threshold cleanly and is not
diluted by any competing `CUPT_DAILY`/`MCP_ADVANCED`/`INSTALL` keyword.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `TROUBLESHOOT` under `SKILL.md` §2's weighted keyword
model, that the score exceeds the `> 3` tie-break threshold, and that the router's
`RESOURCE_MAP["TROUBLESHOOT"]` entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["TROUBLESHOOT"]` crosses the
  tie-break threshold and that the mapped resource exists on disk.
- Real user request: `The cupt command failed with a 403 error, it's not working, and every request is painfully slow.`
- Prompt: `The cupt command failed with a 403 error, it's not working, and every request is painfully slow.`

**Exact prompt**:
```text
The cupt command failed with a 403 error, it's not working, and every request is painfully slow.
```

- Expected execution process: the router scores every intent's keyword set (weight 6 per hit) against
  the lowercased prompt; `failed`, `403`, `error`, `not working`, and `slow` are all literal
  `INTENT_SIGNALS["TROUBLESHOOT"]` keywords, giving a `TROUBLESHOOT` score of 30 (> 3), so
  `SKILL.md` §2's tie-break selects `TROUBLESHOOT` directly, before any other intent's score is
  compared.
- Expected signals: `SKILL.md` §2 lists `TROUBLESHOOT` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["TROUBLESHOOT"]` names exactly `references/troubleshooting.md`; the file exists.
- Desired user-visible outcome: the router states plainly that this request routes to `TROUBLESHOOT`
  and bundles the troubleshooting reference before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `TROUBLESHOOT` keywords and the mapped resource
  exists; FAIL if the keyword weights or `RESOURCE_MAP["TROUBLESHOOT"]` entry in `SKILL.md` no longer
  matches this scenario's frontmatter, or the resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The cupt command failed with a 403 error, it's not working, and every request is painfully slow.`

### Commands

1. `sed -n '1,10p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/troubleshoot.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
4. `sed -n '/scores.get("TROUBLESHOOT"/,/intent = max/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
5. `test -e .opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md && echo "OK references/troubleshooting.md" || echo "MISS references/troubleshooting.md"`

### Expected

Step 1 shows `expected_intent: TROUBLESHOOT`. Step 2's output lists `"TROUBLESHOOT"` with keywords
including `failed`, `403`, `error`, `not working`, and `slow` at weight 6. Step 3's output shows
`"TROUBLESHOOT": ["references/troubleshooting.md"]`. Step 4 shows the
`scores.get("TROUBLESHOOT", 0) > 3` tie-break line. Step 5 prints `OK`.

### Evidence

Command transcript from steps 1-5; the `INTENT_SIGNALS["TROUBLESHOOT"]`/`RESOURCE_MAP["TROUBLESHOOT"]`
excerpts from steps 2-3 with the matched keywords highlighted; the tie-break excerpt from step 4.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `TROUBLESHOOT` keywords, the tie-break threshold quoted in
  step 4 is unchanged, `RESOURCE_MAP["TROUBLESHOOT"]` lists the resource, and the resource path
  exists.
- **Fail**: the keyword set, tie-break threshold, or resource map in `SKILL.md` no longer matches this
  scenario's frontmatter, or the resource path does not resolve.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["TROUBLESHOOT"]` keyword list against this
   scenario's quoted matches to see which keyword moved or was reworded.
2. Re-run step 4 and confirm the `> 3` threshold has not been raised past this prompt's score of 30.
3. Re-run step 5 and confirm whether `references/troubleshooting.md` was renamed or removed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §16 routing-recall index |
| `install.md` | The neighboring routing scenario sharing `references/troubleshooting.md` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `TROUBLESHOOT` `INTENT_SIGNALS` keywords, `RESOURCE_MAP` entry, and tie-break rule this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CU-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/troubleshoot.md`
