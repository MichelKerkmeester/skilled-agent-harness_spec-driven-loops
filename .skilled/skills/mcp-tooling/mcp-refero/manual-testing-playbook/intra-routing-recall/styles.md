---
id: RF-R01
category: intra-routing-recall
stage: routing
title: 'Styles routing'
description: "This scenario validates STYLES routing for `RF-R01`. It focuses on confirming the mcp-refero smart router's INTENT_MODEL classifier and RESOURCE_MAP load the tool-surface taxonomy for a visual-direction search prompt."
expected_intent: STYLES
expected_resources:
  - references/tool-surface.md
version: 1.0.0.1
---

# RF-R01: Styles routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `RF-R01`.

---

## 1. OVERVIEW

This scenario validates STYLES routing for `RF-R01`. It focuses on confirming that a prompt searching Refero for a bold editorial aesthetic to ground a landing page scores highest against `INTENT_MODEL["STYLES"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["STYLES"]` set, not on actually running the Refero search, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

STYLES is the visual-direction research intent, distinct from a concrete SCREENS lookup or a multi-step FLOWS journey. Loading `tool-surface.md` is what tells a bundled workflow which Refero tool class (read-only style search) is in play before it constructs the query.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `RF-R01` classifies as `STYLES` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `STYLES` and every path in `expected_resources`
- Real user request: `Search Refero styles for a bold editorial aesthetic to ground a saas landing page.`
- Prompt: `Search Refero styles for a bold editorial aesthetic to ground a saas landing page.`

**Exact prompt**:
```text
Search Refero styles for a bold editorial aesthetic to ground a saas landing page.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "style", "aesthetic", and "landing page" each match `STYLES` keywords and no other intent scores as high, so `STYLES` becomes the primary intent and `RESOURCE_MAP["STYLES"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-refero/`, and it documents `STYLES` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the tool-surface taxonomy and runs the editorial-aesthetic style search as a read-only Refero query
- Pass/fail: PASS if the listed path exists and the frontmatter intent is `STYLES`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Search Refero styles for a bold editorial aesthetic to ground a saas landing page.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/styles.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-refero/SKILL.md | sed -n '/"STYLES":/p'`
3. `for p in references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-refero/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: STYLES` in the frontmatter. Step 2 shows the `INTENT_MODEL["STYLES"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["STYLES"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `STYLES`
- **Fail**: the listed path is missing, or the frontmatter intent disagrees with `STYLES`

### Failure Triage

1. Re-run step 3 for `references/tool-surface.md` and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["STYLES"]` excerpt and the `RESOURCE_MAP["STYLES"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: RF-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/styles.md`
