---
id: OB-003
category: code_quality
title: 'DB class rename routing'
description: "This scenario validates CODE_QUALITY routing for `OB-003`. It focuses on confirming a .db-* class-rename prompt loads the class grammar, the single-stylesheet ownership model, and the db-class-rename/fixture-authoring checklists instead of the plain-implementation evidence."
expected_surface: OBSIDIAN
expected_intent: CODE_QUALITY
expected_resources:
  - references/db-class-naming.md
  - references/stylesheet-ownership.md
  - references/comment-grammar.md
  - assets/db-class-rename-checklist.md
  - assets/fixture-authoring-checklist.md
version: 1.0.0.0
---

# OB-003: DB class rename routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-003`.

---

## 1. OVERVIEW

This scenario validates CODE_QUALITY routing for `OB-003`. It focuses on confirming that a
naming-shaped prompt — renaming a `.db-*` class across `styles.css` — classifies as `CODE_QUALITY`,
not `IMPLEMENTATION`, and loads the class grammar, the single-stylesheet ownership evidence, and the
rename/fixture-authoring checklists a safe rename needs, since the class also appears in fixture
markup under `tools/screenshots/`.

### Why This Matters

`styles.css` is 18,931 lines with 1,196 distinct `.db-*` classes; a rename that only touches the
declaration and misses a dynamic construction site or a fixture reference orphans a rule silently —
there is no scoped-style build to catch the miss the way CSS Modules would. Loading
`db-class-rename-checklist.md` alongside `db-class-naming.md` is what makes the rename's map
injective (old and new both checked) instead of a single grep-and-replace that trusts its own byte
count as proof.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-003` classifies as `CODE_QUALITY` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `CODE_QUALITY`, and every
  path in `expected_resources`.
- Real user request: `Rename .db-board-card-field to .db-board-card-cell-field across styles.css and every fixture that references it.`
- Prompt: `Rename .db-board-card-field to .db-board-card-cell-field across styles.css and every fixture that references it.`

**Exact prompt**:
```text
Rename .db-board-card-field to .db-board-card-cell-field across styles.css and every fixture that references it.
```

- Expected execution process: the hub detects `OBSIDIAN`, the `CODE_QUALITY` `INTENT_SIGNALS`
  keywords (`naming`, ...) match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and each one
  documents `CODE_QUALITY` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow renames `.db-board-card-field` everywhere it is
  declared or referenced — `styles.css`, any dynamic construction site in `src/`, and every fixture
  under `tools/screenshots/scenarios/` — and can show a zero-hit grep for the old name before any
  completion claim.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `CODE_QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Rename .db-board-card-field to .db-board-card-cell-field across styles.css and every fixture that references it.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/db-class-rename-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"CODE_QUALITY":/,/\],/p'`
3. `for p in references/db-class-naming.md references/stylesheet-ownership.md references/comment-grammar.md assets/db-class-rename-checklist.md assets/fixture-authoring-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: CODE_QUALITY`. Step 2 shows the
`CODE_QUALITY` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all
five paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["CODE_QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`CODE_QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `OBSIDIAN`/`CODE_QUALITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Confirm `.db-board-card-field` is still a real class (`grep -n "\.db-board-card-field" styles.css`);
   if it has since been renamed by other work, swap the example class for another live `.db-*` class
   rather than inventing one, per `SKILL.md` §3.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §3 | The "never invent a `.db-*` class" rule this scenario's checklist pair enforces |

---

## 5. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: OB-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/db-class-rename-routing.md`
