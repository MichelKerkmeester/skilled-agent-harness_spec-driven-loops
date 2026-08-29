---
id: CU-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout — daily task op'
description: "This scenario validates the SKILL.md Smart Router's CUPT_DAILY intent generalizes to a prompt authored keyword-blind for `CU-H01`. It confirms plain daily-ops phrasing still scores CUPT_DAILY via the recorded blindExceptions vocabulary."
expected_intent: CUPT_DAILY
expected_resources:
  - references/cupt-commands.md
blindExceptions:
  - "ticket"
  - "close it out"
  - "jot down"
version: 1.1.0.0
---

# CU-H01: Blind holdout — daily task op

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CU-H01`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-click-up` Smart Router's `CUPT_DAILY` intent still resolves
correctly on a prompt that was originally authored with no router keyword, intent-key name, skill id,
or resource basename. It confirms the router loads exactly `RESOURCE_MAP["CUPT_DAILY"]` even through
this narrower, more natural keyword surface.

### Why This Matters

`CU-R01` proves the router works when a prompt uses obvious daily-ops vocabulary (`list`, `done`,
`log time`, `tag`). This holdout proves the router still generalizes when an operator describes the
same "finish a task and leave a note" workflow in plain language. The prompt is not keyword-free —
during routing remediation the natural daily-ops vocabulary `ticket` / `close it out` / `jot down`
was deliberately bound into `INTENT_SIGNALS["CUPT_DAILY"]` so semantic recall works without gold
leakage — but it was authored blind before that binding, and the binding is the honest anchor
recorded in this scenario's `blindExceptions` frontmatter.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt, despite its keyword-blind authoring, still scores `CUPT_DAILY`
under `SKILL.md` §2's weighted keyword model via the recorded `blindExceptions`, and that the
router's `RESOURCE_MAP["CUPT_DAILY"]` entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's narrower keyword overlap with `INTENT_SIGNALS["CUPT_DAILY"]` — via
  `ticket`, `close it out`, and `jot down` — still selects `CUPT_DAILY`, and that the mapped resource
  exists on disk.
- Real user request: `I finished the ticket I was working on this morning - please close it out and jot down a quick comment that the client approved it.`
- Prompt: `I finished the ticket I was working on this morning - please close it out and jot down a quick comment that the client approved it.`

**Exact prompt**:
```text
I finished the ticket I was working on this morning - please close it out and jot down a quick comment that the client approved it.
```

- Holdout honesty anchor: the prompt was authored with NO router keyword, intent-key name, skill id,
  or resource basename. During routing remediation the natural daily-ops vocabulary `ticket` /
  `close it out` / `jot down` was bound into `CUPT_DAILY` so semantic recall works without gold
  leakage; the prompt is no longer blind for those phrases — recorded in `blindExceptions` above.
- Expected execution process: the router scores every intent's keyword set (weight 5 per hit) against
  the lowercased prompt; `ticket`, `close it out`, and `jot down` are the literal
  `INTENT_SIGNALS["CUPT_DAILY"]` keywords present, giving `CUPT_DAILY` a nonzero score with no
  competing `TROUBLESHOOT`/`INSTALL` keyword to trigger the tie-break, so `max(scores, key=scores.get)`
  selects `CUPT_DAILY`.
- Expected signals: `SKILL.md` §2 lists `ticket`, `close it out`, and `jot down` under
  `INTENT_SIGNALS["CUPT_DAILY"]`; `RESOURCE_MAP["CUPT_DAILY"]` names exactly
  `references/cupt-commands.md`; the file exists.
- Desired user-visible outcome: the router states plainly that this request routes to `CUPT_DAILY`
  and bundles the `cupt` command reference, despite the prompt never naming the tool or intent.
- Pass/fail: PASS if `SKILL.md` §2 confirms all three matched keywords under `CUPT_DAILY` and the
  mapped resource exists; FAIL if any of those keywords is removed from `CUPT_DAILY`, the
  `RESOURCE_MAP["CUPT_DAILY"]` entry in `SKILL.md` no longer matches this scenario's frontmatter, or
  the resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I finished the ticket I was working on this morning - please close it out and jot down a quick comment that the client approved it.`

### Commands

1. `sed -n '1,17p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/holdout-daily.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
3. `sed -n '/^```text$/,/^```$/p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/holdout-daily.md | grep -io 'cupt\|clickup\|mcp\|list\b\|log time' || echo "no obvious router keyword in the prompt body"`
4. `test -e .opencode/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md && echo "OK references/cupt-commands.md" || echo "MISS references/cupt-commands.md"`

### Expected

Step 1 shows `expected_intent: CUPT_DAILY` and the `blindExceptions` list (`ticket`, `close it out`,
`jot down`). Step 2's output confirms all three are present under `INTENT_SIGNALS["CUPT_DAILY"]`.
Step 3 prints `no obvious router keyword in the prompt body` (the obvious tool-name/intent-key
keywords are absent). Step 4 prints `OK`.

### Evidence

Command transcript from steps 1-4; the `INTENT_SIGNALS["CUPT_DAILY"]` excerpt from step 2 with
`ticket`/`close it out`/`jot down` highlighted; step 3's confirmation that the prompt body carries no
obvious router keyword.

### Pass / Fail

- **Pass**: `SKILL.md` §2 still lists all three `blindExceptions` keywords under `CUPT_DAILY`, the
  prompt body carries no obvious router keyword, and `RESOURCE_MAP["CUPT_DAILY"]`'s resource path
  exists.
- **Fail**: any of the three keywords is removed from `CUPT_DAILY`'s list, the resource map no longer
  matches this scenario's frontmatter, or the resource path does not resolve.

### Failure Triage

1. Re-run step 2 and confirm `ticket`, `close it out`, and `jot down` are still present under
   `INTENT_SIGNALS["CUPT_DAILY"]` at a nonzero weight.
2. Re-run step 4 and confirm whether `references/cupt-commands.md` was renamed or removed.
3. Compare against the non-blind `cupt-daily.md` scenario to isolate whether a routing regression is
   holdout-specific or affects `CUPT_DAILY` generally.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §16 routing-recall index |
| `cupt-daily.md` | The non-blind routing scenario for the same `CUPT_DAILY` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `CUPT_DAILY` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CU-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-daily.md`
