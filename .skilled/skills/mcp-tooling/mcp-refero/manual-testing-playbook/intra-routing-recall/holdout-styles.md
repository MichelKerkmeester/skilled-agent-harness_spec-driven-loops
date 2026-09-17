---
id: RF-H01
category: intra-routing-recall
stage: holdout
title: 'Blind holdout: visual direction'
description: "This scenario is the natural-phrasing holdout for `RF-R01`. It focuses on confirming a prompt written in plain user language, avoiding most of INTENT_MODEL's STYLES vocabulary, still routes to STYLES and resolves the same RESOURCE_MAP set."
expected_intent: STYLES
expected_resources:
  - references/tool-surface.md
blindToRouterKeywords: true
version: 1.0.0.1
---

# RF-H01: Blind holdout: visual direction

This document captures the routing-recall contract, execution process, source anchors, and metadata for `RF-H01`.

---

## 1. OVERVIEW

This scenario is the natural-phrasing holdout for `RF-R01` (`blindToRouterKeywords: true`). It focuses on confirming that a prompt phrased the way a real user would ask for a marketing site's visual direction -- not the router's own vocabulary -- still classifies as `STYLES` per `SKILL.md` §2 and resolves the same `RESOURCE_MAP["STYLES"]` set as `RF-R01`, not on actually running the search.

### Why This Matters

"Visual direction" and "look and feel" are how a real user says "style" and "aesthetic" without using the router's most literal single-word keyword. This holdout checks the classifier generalizes past its narrowest `STYLES` keyword hit -- "visual direction" and "look and feel" are both direct multi-word keyword hits -- which is what makes it a decontamination check rather than a restatement of `RF-R01`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact holdout prompt for `RF-H01` classifies as `STYLES` and resolves the same declared resource set as its fitted counterpart `RF-R01`.

- Objective: confirm the natural-phrasing prompt routes to intent `STYLES` and every path in `expected_resources`, decontaminating `RF-R01`
- Real user request: `I need the visual direction for our marketing site grounded in real shipped work, with an editorial look and feel to anchor it.`
- Prompt: `I need the visual direction for our marketing site grounded in real shipped work, with an editorial look and feel to anchor it.`

**Exact prompt**:
```text
I need the visual direction for our marketing site grounded in real shipped work, with an editorial look and feel to anchor it.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "visual direction" and "look and feel" are both literal `STYLES` keyword hits, and no other intent's keyword list matches any word in the prompt, so `STYLES` remains the sole scoring intent and `RESOURCE_MAP["STYLES"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-refero/`, the frontmatter intent is `STYLES`, and the resolved set matches `RF-R01`'s
- Desired user-visible outcome: the bundled workflow classifies the natural-phrasing request the same way it classifies the keyword-heavy `RF-R01` prompt, loading the same tool-surface taxonomy
- Pass/fail: PASS if the listed path exists, the frontmatter intent is `STYLES`, and the resolved set matches `RF-R01`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I need the visual direction for our marketing site grounded in real shipped work, with an editorial look and feel to anchor it.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/holdout-styles.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-refero/SKILL.md | sed -n '/"STYLES":/p'`
3. `for p in references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-refero/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: STYLES` in the frontmatter. Step 2 shows the `INTENT_MODEL["STYLES"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["STYLES"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root, the frontmatter's `expected_intent` matches `STYLES`, and the set matches `RF-R01`
- **Fail**: the listed path is missing, the frontmatter intent disagrees with `STYLES`, or the resolved set diverges from `RF-R01` without explanation

### Failure Triage

1. Re-run step 3 for `references/tool-surface.md` and confirm whether it was renamed or removed under `references/`.
2. Compare this file's `expected_resources`/`expected_intent` against `styles.md` (`RF-R01`) directly -- a divergence between the fitted and holdout scenario for the same intent points to a routing regression, not a stale path.

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
- Playbook ID: RF-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-styles.md`
