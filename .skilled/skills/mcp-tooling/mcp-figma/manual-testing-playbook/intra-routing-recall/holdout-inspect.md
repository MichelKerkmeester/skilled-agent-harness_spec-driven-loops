---
id: FG-H02
category: intra_routing_recall
stage: holdout
title: 'Blind holdout: measurements'
description: "This scenario is the natural-phrasing holdout for `FG-R03`. It focuses on confirming a prompt written in plain user language, avoiding most of INTENT_MODEL's INSPECT_EXPORT vocabulary, still routes to INSPECT_EXPORT and resolves the same RESOURCE_MAP set."
expected_intent: INSPECT_EXPORT
expected_resources:
  - references/figma-cli-reference.md
  - references/tool-surface.md
blindToRouterKeywords: true
version: 1.0.0.1
---

# FG-H02: Blind holdout: measurements

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-H02`.

---

## 1. OVERVIEW

This scenario is the natural-phrasing holdout for `FG-R03` (`blindToRouterKeywords: true`). It focuses on confirming that a prompt phrased the way a real user would ask for measurements, a picture, and accessibility notes -- not the router's own vocabulary -- still classifies as `INSPECT_EXPORT` per `SKILL.md` §2 and resolves the same `RESOURCE_MAP["INSPECT_EXPORT"]` set as `FG-R03`, not on actually running the inspect.

### Why This Matters

"Grab the measurements and a picture" is how a real user asks for what the router calls "inspect" and "export," and "accessibility notes" is how they ask for an a11y audit. This holdout checks the classifier generalizes past its literal `INSPECT_EXPORT` keyword list -- "accessibility" is the one direct hit -- which is what makes it a decontamination check rather than a restatement of `FG-R03`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact holdout prompt for `FG-H02` classifies as `INSPECT_EXPORT` and resolves the same declared resource set as its fitted counterpart `FG-R03`.

- Objective: confirm the natural-phrasing prompt routes to intent `INSPECT_EXPORT` and every path in `expected_resources`, decontaminating `FG-R03`
- Real user request: `Grab the measurements and a picture of the selected element and write up its accessibility notes.`
- Prompt: `Grab the measurements and a picture of the selected element and write up its accessibility notes.`

**Exact prompt**:
```text
Grab the measurements and a picture of the selected element and write up its accessibility notes.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "accessibility" is the one literal `INSPECT_EXPORT` keyword hit, and no other intent's keyword list matches any word in the prompt, so `INSPECT_EXPORT` remains the sole scoring intent and `RESOURCE_MAP["INSPECT_EXPORT"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, the frontmatter intent is `INSPECT_EXPORT`, and the resolved set matches `FG-R03`'s
- Desired user-visible outcome: the bundled workflow classifies the natural-phrasing request the same way it classifies the keyword-heavy `FG-R03` prompt, loading the same CLI/daemon baseline and tool-surface taxonomy, and treats the whole request as read-only
- Pass/fail: PASS if every listed path exists, the frontmatter intent is `INSPECT_EXPORT`, and the resolved set matches `FG-R03`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Grab the measurements and a picture of the selected element and write up its accessibility notes.`

### Commands

1. `sed -n '1,16p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/holdout-inspect.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"INSPECT_EXPORT":/p'`
3. `for p in references/figma-cli-reference.md references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: INSPECT_EXPORT` in the frontmatter. Step 2 shows the `INTENT_MODEL["INSPECT_EXPORT"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["INSPECT_EXPORT"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root, the frontmatter's `expected_intent` matches `INSPECT_EXPORT`, and the set matches `FG-R03`
- **Fail**: any listed path is missing, the frontmatter intent disagrees with `INSPECT_EXPORT`, or the resolved set diverges from `FG-R03` without explanation

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Compare this file's `expected_resources`/`expected_intent` against `inspect-export.md` (`FG-R03`) directly -- a divergence between the fitted and holdout scenario for the same intent points to a routing regression, not a stale path.

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
- Playbook ID: FG-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-inspect.md`
