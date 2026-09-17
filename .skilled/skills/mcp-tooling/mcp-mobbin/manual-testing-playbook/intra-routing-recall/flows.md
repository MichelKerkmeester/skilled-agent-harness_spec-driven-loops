---
id: MB-R03
category: intra-routing-recall
stage: routing
title: 'Flows routing'
description: "This scenario validates FLOWS routing for `MB-R03`. It focuses on confirming the mcp-mobbin smart router's INTENT_MODEL classifier and RESOURCE_MAP load the tool-surface taxonomy for a multi-step UX flow prompt."
expected_intent: FLOWS
expected_resources:
  - references/tool-surface.md
version: 1.0.0.1
---

# MB-R03: Flows routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `MB-R03`.

---

## 1. OVERVIEW

This scenario validates FLOWS routing for `MB-R03`. It focuses on confirming that a prompt about a signup journey's multi-step progression scores highest against `INTENT_MODEL["FLOWS"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["FLOWS"]` set, not on actually pulling the flow references, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

FLOWS covers the multi-screen journey, distinct from a single SCREENS lookup. Loading `tool-surface.md` confirms the bundled workflow treats a flow request as a sequenced, multi-result Mobbin query rather than a single-screen search.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `MB-R03` classifies as `FLOWS` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `FLOWS` and every path in `expected_resources`
- Real user request: `Pull ux flow references from Mobbin for the signup process journey, including the multi-step progression.`
- Prompt: `Pull ux flow references from Mobbin for the signup process journey, including the multi-step progression.`

**Exact prompt**:
```text
Pull ux flow references from Mobbin for the signup process journey, including the multi-step progression.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "ux flow", "journey", "multi-step", "progression", and "signup process" each match `FLOWS` keywords and no other intent scores as high, so `FLOWS` becomes the primary intent and `RESOURCE_MAP["FLOWS"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-mobbin/`, and it documents `FLOWS` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the tool-surface taxonomy and runs the multi-step flow search as a read-only Mobbin query
- Pass/fail: PASS if the listed path exists and the frontmatter intent is `FLOWS`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Pull ux flow references from Mobbin for the signup process journey, including the multi-step progression.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/flows.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md | sed -n '/"FLOWS":/p'`
3. `for p in references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-mobbin/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: FLOWS` in the frontmatter. Step 2 shows the `INTENT_MODEL["FLOWS"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["FLOWS"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `FLOWS`
- **Fail**: the listed path is missing, or the frontmatter intent disagrees with `FLOWS`

### Failure Triage

1. Re-run step 3 for `references/tool-surface.md` and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["FLOWS"]` excerpt and the `RESOURCE_MAP["FLOWS"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: MB-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/flows.md`
