---
id: FG-R03
category: intra_routing_recall
stage: routing
title: 'Inspect/export routing'
description: "This scenario validates INSPECT_EXPORT routing for `FG-R03`. It focuses on confirming the mcp-figma smart router's INTENT_MODEL classifier and RESOURCE_MAP load the CLI/daemon baseline and the tool-surface taxonomy for a read-only inspect/export prompt."
expected_intent: INSPECT_EXPORT
expected_resources:
  - references/figma-cli-reference.md
  - references/tool-surface.md
version: 1.0.0.1
---

# FG-R03: Inspect/export routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-R03`.

---

## 1. OVERVIEW

This scenario validates INSPECT_EXPORT routing for `FG-R03`. It focuses on confirming that a prompt about inspecting a node and exporting a screenshot plus DESIGN.md scores highest against `INTENT_MODEL["INSPECT_EXPORT"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["INSPECT_EXPORT"]` set, not on actually running the export, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

INSPECT_EXPORT is the read-only phase (`SKILL.md` §2 Phase 2): none of its verbs change the Figma document. Loading `tool-surface.md` alongside `figma-cli-reference.md` is what confirms to a bundled workflow that `inspect`/`extract`/`export` verbs stay in the read-only class and never require the mutation confirmation gate that CREATE_RENDER and DESIGN_SYSTEM_TOKENS need.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `FG-R03` classifies as `INSPECT_EXPORT` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `INSPECT_EXPORT` and every path in `expected_resources`
- Real user request: `Inspect the selected node and export a screenshot plus a design.md summary.`
- Prompt: `Inspect the selected node and export a screenshot plus a design.md summary.`

**Exact prompt**:
```text
Inspect the selected node and export a screenshot plus a design.md summary.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "inspect", "export" ("exports" contains it), and "DESIGN.md" (case-insensitively matched via the lowercased request) each match `INSPECT_EXPORT` keywords and no other intent scores as high, so `INSPECT_EXPORT` becomes the primary intent and `RESOURCE_MAP["INSPECT_EXPORT"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, and each documents `INSPECT_EXPORT` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the CLI/daemon baseline and the tool-surface taxonomy, confirms the requested verbs are read-only, and returns the inspected properties plus the exported screenshot and DESIGN.md summary
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `INSPECT_EXPORT`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Inspect the selected node and export a screenshot plus a design.md summary.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/inspect-export.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"INSPECT_EXPORT":/p'`
3. `for p in references/figma-cli-reference.md references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: INSPECT_EXPORT` in the frontmatter. Step 2 shows the `INTENT_MODEL["INSPECT_EXPORT"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["INSPECT_EXPORT"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `INSPECT_EXPORT`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `INSPECT_EXPORT`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["INSPECT_EXPORT"]` excerpt and the `RESOURCE_MAP["INSPECT_EXPORT"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: FG-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/inspect-export.md`
