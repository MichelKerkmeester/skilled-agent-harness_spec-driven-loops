---
id: CU-R01
category: intra_routing_recall
stage: routing
title: 'CUPT daily routing'
description: "This scenario validates the SKILL.md Smart Router's CUPT_DAILY intent for `CU-R01`. It confirms a realistic daily-ops task-queue prompt scores CUPT_DAILY and loads exactly RESOURCE_MAP['CUPT_DAILY']."
expected_intent: CUPT_DAILY
expected_resources:
  - references/cupt-commands.md
version: 1.1.0.0
---

# CU-R01: CUPT daily routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CU-R01`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-click-up` Smart Router's `CUPT_DAILY` intent signal fires on a
realistic daily task-queue request, and that the router loads exactly `RESOURCE_MAP["CUPT_DAILY"]` —
`references/cupt-commands.md` alone — per `SKILL.md` §2's `INTENT_SIGNALS`/`RESOURCE_MAP` tables.

### Why This Matters

`CUPT_DAILY` is the router's highest-traffic lane: the everyday `cupt` CLI workflow of listing,
completing, timing, and tagging tasks. `route_clickup_resources()` also runs a hard tie-break — a
`TROUBLESHOOT` score above 3 or an `INSTALL` score above 4 overrides any other intent regardless of
its own score. This scenario proves a routine daily-ops prompt, with no error or setup language in
it, resolves to `CUPT_DAILY` cleanly rather than being pulled off course by that tie-break.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `CUPT_DAILY` under `SKILL.md` §2's weighted keyword model
and that the router's `RESOURCE_MAP["CUPT_DAILY"]` entry matches this scenario's declared
`expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["CUPT_DAILY"]` selects
  `CUPT_DAILY` as the routed intent, that no `TROUBLESHOOT`/`INSTALL` tie-break keyword fires, and
  that the mapped resource exists on disk.
- Real user request: `Show me my task list for today, mark the ones I finished as done, then log time against them and add a priority tag.`
- Prompt: `Show me my task list for today, mark the ones I finished as done, then log time against them and add a priority tag.`

**Exact prompt**:
```text
Show me my task list for today, mark the ones I finished as done, then log time against them and add a priority tag.
```

- Expected execution process: the router scores every intent's keyword set (weight 5 per hit) against
  the lowercased prompt; `show`, `list`, `done`, `log time`, and `tag` are all literal
  `INTENT_SIGNALS["CUPT_DAILY"]` keywords, none of `TROUBLESHOOT`'s or `INSTALL`'s keywords appear, so
  the tie-break at `SKILL.md` §2 falls through to `max(scores, key=scores.get)` and selects
  `CUPT_DAILY`.
- Expected signals: `SKILL.md` §2 lists `CUPT_DAILY` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["CUPT_DAILY"]` names exactly `references/cupt-commands.md`; the file exists.
- Desired user-visible outcome: the router states plainly that this request routes to `CUPT_DAILY`
  and bundles the `cupt` command reference before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `CUPT_DAILY` keywords, no `TROUBLESHOOT`/`INSTALL`
  keyword is present in the prompt, and the mapped resource exists; FAIL if the keyword weights or
  `RESOURCE_MAP["CUPT_DAILY"]` entry in `SKILL.md` no longer matches this scenario's frontmatter, or
  the resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me my task list for today, mark the ones I finished as done, then log time against them and add a priority tag.`

### Commands

1. `sed -n '1,11p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/cupt-daily.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md && echo "OK references/cupt-commands.md" || echo "MISS references/cupt-commands.md"`

### Expected

Step 1 shows `expected_intent: CUPT_DAILY`. Step 2's output lists `"CUPT_DAILY"` with keywords
including `show`, `list`, `done`, `log time`, and `tag` at weight 5, and confirms none of
`TROUBLESHOOT`'s or `INSTALL`'s keywords (`error`, `failed`, `install cupt`, `setup`, ...) are present
in the exact prompt. Step 3's output shows `"CUPT_DAILY": ["references/cupt-commands.md"]`. Step 4
prints `OK`.

### Evidence

Command transcript from steps 1-4; the `INTENT_SIGNALS["CUPT_DAILY"]`/`RESOURCE_MAP["CUPT_DAILY"]`
excerpts from steps 2-3 with the matched keywords highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `CUPT_DAILY` keywords, no tie-break keyword from
  `TROUBLESHOOT`/`INSTALL` appears in the prompt, `RESOURCE_MAP["CUPT_DAILY"]` lists the resource, and
  the resource path exists.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, a `TROUBLESHOOT`/`INSTALL` keyword unexpectedly fires the tie-break, or the resource
  path does not resolve.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["CUPT_DAILY"]` keyword list against this
   scenario's quoted matches to see which keyword moved or was reworded.
2. Re-run step 4 and confirm whether `references/cupt-commands.md` was renamed or removed.
3. If the prompt instead scored `TROUBLESHOOT` or `INSTALL`, re-read `SKILL.md` §2's tie-break rule
   (`scores.get("TROUBLESHOOT", 0) > 3` / `scores.get("INSTALL", 0) > 4`) for an unexpected keyword hit.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §16 routing-recall index |
| `holdout-daily.md` | The blind holdout counterpart for the same `CUPT_DAILY` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `CUPT_DAILY` `INTENT_SIGNALS` keywords, `RESOURCE_MAP` entry, and tie-break rule this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CU-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/cupt-daily.md`
