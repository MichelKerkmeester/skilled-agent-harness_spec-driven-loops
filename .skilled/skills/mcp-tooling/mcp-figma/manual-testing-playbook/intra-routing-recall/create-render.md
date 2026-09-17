---
id: FG-R01
category: intra_routing_recall
stage: routing
title: 'Create/render routing'
description: "This scenario validates CREATE_RENDER routing for `FG-R01`. It focuses on confirming the mcp-figma smart router's INTENT_MODEL classifier and RESOURCE_MAP load the CLI/daemon baseline and the read-only/mutating/destructive tool-surface taxonomy for an author/modify prompt."
expected_intent: CREATE_RENDER
expected_resources:
  - references/figma-cli-reference.md
  - references/tool-surface.md
version: 1.0.0.1
---

# FG-R01: Create/render routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-R01`.

---

## 1. OVERVIEW

This scenario validates CREATE_RENDER routing for `FG-R01`. It focuses on confirming that a prompt asking to build new Figma structure (frame, component, icon, layout) scores highest against `INTENT_MODEL["CREATE_RENDER"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["CREATE_RENDER"]` set, not on actually authoring the frame, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

CREATE_RENDER is a mutating, design-affecting phase (`SKILL.md` §2 Phase 3): it renders JSX, creates frames/components/icons, and sets properties. Before any authoring happens, the router must load `tool-surface.md` (the read-only/mutating/destructive gating taxonomy) alongside `figma-cli-reference.md`, or a bundled workflow could run a mutating verb without the gate that requires confirmation and a stated rollback.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `FG-R01` classifies as `CREATE_RENDER` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `CREATE_RENDER` and every path in `expected_resources`
- Real user request: `Create a new frame with a button component and an icon in a two-column layout.`
- Prompt: `Create a new frame with a button component and an icon in a two-column layout.`

**Exact prompt**:
```text
Create a new frame with a button component and an icon in a two-column layout.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "create", "frame", "component", "icon", "layout", and "button" each match `CREATE_RENDER` keywords and no other intent scores as high, so `CREATE_RENDER` becomes the primary intent and `RESOURCE_MAP["CREATE_RENDER"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, and each documents `CREATE_RENDER` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the CLI/daemon baseline and the tool-surface gating taxonomy before proposing any frame/component/icon creation, and treats the render as a gated, design-affecting mutation
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `CREATE_RENDER`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a new frame with a button component and an icon in a two-column layout.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/create-render.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"CREATE_RENDER":/p'`
3. `for p in references/figma-cli-reference.md references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CREATE_RENDER` in the frontmatter. Step 2 shows the `INTENT_MODEL["CREATE_RENDER"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["CREATE_RENDER"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `CREATE_RENDER`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `CREATE_RENDER`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["CREATE_RENDER"]` excerpt and the `RESOURCE_MAP["CREATE_RENDER"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: FG-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/create-render.md`
