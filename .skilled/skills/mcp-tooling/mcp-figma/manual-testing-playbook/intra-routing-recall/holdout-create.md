---
id: FG-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout: build a screen'
description: "This scenario is the natural-phrasing holdout for `FG-R01`. It focuses on confirming a prompt written in plain user language, avoiding most of INTENT_MODEL's CREATE_RENDER vocabulary, still routes to CREATE_RENDER and resolves the same RESOURCE_MAP set."
expected_intent: CREATE_RENDER
expected_resources:
  - references/figma-cli-reference.md
  - references/tool-surface.md
blindToRouterKeywords: true
version: 1.0.0.1
---

# FG-H01: Blind holdout: build a screen

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-H01`.

---

## 1. OVERVIEW

This scenario is the natural-phrasing holdout for `FG-R01` (`blindToRouterKeywords: true`). It focuses on confirming that a prompt phrased the way a real user would ask for a new screen -- not the router's own vocabulary -- still classifies as `CREATE_RENDER` per `SKILL.md` §2 and resolves the same `RESOURCE_MAP["CREATE_RENDER"]` set as `FG-R01`, not on actually building the screen.

### Why This Matters

A router that only fires on its own keyword list is brittle: real users say "build me a new screen," not "create a frame." This holdout checks the classifier generalizes past its literal `CREATE_RENDER` keyword list -- "build" is the one direct hit, while "new screen," "call-to-action," and "laid out in columns" carry the same intent without matching "frame"/"layout" literally, which is what makes it a decontamination check rather than a restatement of `FG-R01`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact holdout prompt for `FG-H01` classifies as `CREATE_RENDER` and resolves the same declared resource set as its fitted counterpart `FG-R01`.

- Objective: confirm the natural-phrasing prompt routes to intent `CREATE_RENDER` and every path in `expected_resources`, decontaminating `FG-R01`
- Real user request: `Build me a new screen with a call-to-action and a set of navigation links laid out in columns.`
- Prompt: `Build me a new screen with a call-to-action and a set of navigation links laid out in columns.`

**Exact prompt**:
```text
Build me a new screen with a call-to-action and a set of navigation links laid out in columns.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "build" is the one literal `CREATE_RENDER` keyword hit, and no other intent's keyword list matches any word in the prompt, so `CREATE_RENDER` remains the sole scoring intent and `RESOURCE_MAP["CREATE_RENDER"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, the frontmatter intent is `CREATE_RENDER`, and the resolved set matches `FG-R01`'s
- Desired user-visible outcome: the bundled workflow classifies the natural-phrasing request the same way it classifies the keyword-heavy `FG-R01` prompt, loading the same CLI/daemon baseline and tool-surface gating taxonomy
- Pass/fail: PASS if every listed path exists, the frontmatter intent is `CREATE_RENDER`, and the resolved set matches `FG-R01`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Build me a new screen with a call-to-action and a set of navigation links laid out in columns.`

### Commands

1. `sed -n '1,16p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/holdout-create.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"CREATE_RENDER":/p'`
3. `for p in references/figma-cli-reference.md references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CREATE_RENDER` in the frontmatter. Step 2 shows the `INTENT_MODEL["CREATE_RENDER"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["CREATE_RENDER"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root, the frontmatter's `expected_intent` matches `CREATE_RENDER`, and the set matches `FG-R01`
- **Fail**: any listed path is missing, the frontmatter intent disagrees with `CREATE_RENDER`, or the resolved set diverges from `FG-R01` without explanation

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Compare this file's `expected_resources`/`expected_intent` against `create-render.md` (`FG-R01`) directly -- a divergence between the fitted and holdout scenario for the same intent points to a routing regression, not a stale path.

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
- Playbook ID: FG-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-create.md`
