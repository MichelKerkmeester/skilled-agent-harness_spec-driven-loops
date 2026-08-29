---
id: MB-R02
category: intra-routing-recall
stage: routing
title: 'Screens routing'
description: "This scenario validates SCREENS routing for `MB-R02`. It focuses on confirming the mcp-mobbin smart router's INTENT_MODEL classifier and RESOURCE_MAP load the tool-surface taxonomy for a screen-example prompt."
expected_intent: SCREENS
expected_resources:
  - references/tool-surface.md
version: 1.0.0.1
---

# MB-R02: Screens routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `MB-R02`.

---

## 1. OVERVIEW

This scenario validates SCREENS routing for `MB-R02`. It focuses on confirming that a prompt asking for real shipped screen examples of an empty-state dashboard scores highest against `INTENT_MODEL["SCREENS"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["SCREENS"]` set, not on actually running the Mobbin search, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

SCREENS is the single-surface research intent, distinct from a full APPS comparison or a multi-step FLOWS journey. Confirming this prompt resolves `SCREENS` and not `APPS` (both mention "apps") is what proves the router's per-intent keyword weighting, not just presence-of-the-word-app, drives classification.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `MB-R02` classifies as `SCREENS` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `SCREENS` and every path in `expected_resources`
- Real user request: `Find screen examples of an empty state dashboard from real shipped web apps on Mobbin.`
- Prompt: `Find screen examples of an empty state dashboard from real shipped web apps on Mobbin.`

**Exact prompt**:
```text
Find screen examples of an empty state dashboard from real shipped web apps on Mobbin.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "screen examples", "empty state", and "dashboard" each match `SCREENS` keywords, outweighing the bare "apps" mention that alone would not score `APPS`, so `SCREENS` becomes the primary intent and `RESOURCE_MAP["SCREENS"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-mobbin/`, and it documents `SCREENS` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the tool-surface taxonomy and runs the screen-example search as a read-only Mobbin query
- Pass/fail: PASS if the listed path exists and the frontmatter intent is `SCREENS`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Find screen examples of an empty state dashboard from real shipped web apps on Mobbin.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/screens.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md | sed -n '/"SCREENS":/p'`
3. `for p in references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-mobbin/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: SCREENS` in the frontmatter. Step 2 shows the `INTENT_MODEL["SCREENS"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["SCREENS"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `SCREENS`
- **Fail**: the listed path is missing, or the frontmatter intent disagrees with `SCREENS`

### Failure Triage

1. Re-run step 3 for `references/tool-surface.md` and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["SCREENS"]` excerpt and the `RESOURCE_MAP["SCREENS"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: MB-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/screens.md`
