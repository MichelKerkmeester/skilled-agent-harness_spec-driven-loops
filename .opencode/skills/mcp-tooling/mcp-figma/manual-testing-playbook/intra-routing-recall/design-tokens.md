---
id: FG-R02
category: intra_routing_recall
stage: routing
title: 'Design system tokens routing'
description: "This scenario validates DESIGN_SYSTEM_TOKENS routing for `FG-R02`. It focuses on confirming the mcp-figma smart router's INTENT_MODEL classifier and RESOURCE_MAP load the CLI/daemon baseline and the tool-surface gating taxonomy for a token/variable-collection prompt."
expected_intent: DESIGN_SYSTEM_TOKENS
expected_resources:
  - references/figma-cli-reference.md
  - references/tool-surface.md
version: 1.0.0.1
---

# FG-R02: Design system tokens routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-R02`.

---

## 1. OVERVIEW

This scenario validates DESIGN_SYSTEM_TOKENS routing for `FG-R02`. It focuses on confirming that a prompt about tokens, variables, and shadcn collections scores highest against `INTENT_MODEL["DESIGN_SYSTEM_TOKENS"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["DESIGN_SYSTEM_TOKENS"]` set, not on actually building the collection, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

DESIGN_SYSTEM_TOKENS is also a mutating, design-affecting phase (`SKILL.md` §2 Phase 3) and `SKILL.md` §4 requires grounding token and variable choices in a measured Style Reference before authoring. Loading `tool-surface.md` alongside `figma-cli-reference.md` is what tells a bundled workflow that creating a token collection or binding `var:name` is a gated mutation, not a read.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `FG-R02` classifies as `DESIGN_SYSTEM_TOKENS` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `DESIGN_SYSTEM_TOKENS` and every path in `expected_resources`
- Real user request: `Extract the design system color tokens and variables into a shadcn collection.`
- Prompt: `Extract the design system color tokens and variables into a shadcn collection.`

**Exact prompt**:
```text
Extract the design system color tokens and variables into a shadcn collection.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "token", "variable" ("variables" contains it), "design system", and "collection" each match `DESIGN_SYSTEM_TOKENS` keywords and no other intent scores as high, so `DESIGN_SYSTEM_TOKENS` becomes the primary intent and `RESOURCE_MAP["DESIGN_SYSTEM_TOKENS"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, and each documents `DESIGN_SYSTEM_TOKENS` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the CLI/daemon baseline and the tool-surface gating taxonomy before proposing any token or variable-collection change, and treats it as a gated, design-affecting mutation
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `DESIGN_SYSTEM_TOKENS`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Extract the design system color tokens and variables into a shadcn collection.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/design-tokens.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"DESIGN_SYSTEM_TOKENS":/p'`
3. `for p in references/figma-cli-reference.md references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: DESIGN_SYSTEM_TOKENS` in the frontmatter. Step 2 shows the `INTENT_MODEL["DESIGN_SYSTEM_TOKENS"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["DESIGN_SYSTEM_TOKENS"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `DESIGN_SYSTEM_TOKENS`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `DESIGN_SYSTEM_TOKENS`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["DESIGN_SYSTEM_TOKENS"]` excerpt and the `RESOURCE_MAP["DESIGN_SYSTEM_TOKENS"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: FG-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/design-tokens.md`
