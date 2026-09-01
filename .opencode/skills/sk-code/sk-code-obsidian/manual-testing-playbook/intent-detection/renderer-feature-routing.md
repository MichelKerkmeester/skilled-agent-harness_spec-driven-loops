---
id: OB-001
category: implementation
title: 'Renderer feature routing'
description: "This scenario validates IMPLEMENTATION routing for `OB-001`. It focuses on confirming the sk-code-obsidian surface's OBSIDIAN detection and INTENT_SIGNALS classifier load the view-renderer, data-layer, and class-grammar evidence a new row-pipeline column type needs."
expected_surface: OBSIDIAN
expected_intent: IMPLEMENTATION
expected_resources:
  - references/view-renderer-architecture.md
  - references/data-layer.md
  - references/db-class-naming.md
  - references/stylesheet-ownership.md
version: 1.0.0.0
---

# OB-001: Renderer feature routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-001`.

---

## 1. OVERVIEW

This scenario validates IMPLEMENTATION routing for `OB-001`. It focuses on confirming that once the
hub resolves the `OBSIDIAN` surface (`SKILL.md` §1), a new-column-type prompt loads the
`src/views/*Renderer.ts` architecture, the `src/data/` pipeline evidence, the `.db-*` class grammar,
the single-stylesheet ownership model, and the shared implement doctrine — not on building the
column type directly, since this scenario only exercises which evidence the bundled workflow loads.

### Why This Matters

A new row-pipeline column type touches `TableRenderer.ts` (or a peer renderer), `RowPipeline.ts` in
`src/data/`, and whatever `.db-*` classes the renderer emits. Loading `view-renderer-architecture.md`
and `data-layer.md` together with `db-class-naming.md` and `stylesheet-ownership.md` is what stops a
bundled workflow (`sk-code-quality` or `sk-code-review`) from inventing a class outside
`styles.css`/`src/` or adding a component-scoped style where the plugin has exactly one stylesheet.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-001` classifies as `IMPLEMENTATION` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `IMPLEMENTATION`, and
  every path in `expected_resources`.
- Real user request: `Add a new computed-percentage column type to the table renderer's row pipeline, reusing the existing .db-* cell classes rather than inventing new ones.`
- Prompt: `Add a new computed-percentage column type to the table renderer's row pipeline, reusing the existing .db-* cell classes rather than inventing new ones.`

**Exact prompt**:
```text
Add a new computed-percentage column type to the table renderer's row pipeline, reusing the existing .db-* cell classes rather than inventing new ones.
```

- Expected execution process: the hub detects `OBSIDIAN` from the task's plugin-repository context
  (`manifest.json`'s `minAppVersion`, `esbuild.config.mjs`, `from "obsidian"` imports), the
  `IMPLEMENTATION` `INTENT_SIGNALS` keywords (`new column type`, `row pipeline`, `implement`, ...)
  match the prompt, and every path this scenario lists under `expected_resources` resolves under the
  skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and each one
  documents `IMPLEMENTATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow extends `RowPipeline.ts` and the chosen
  renderer with the new column type, reuses an existing `.db-*` class rather than inventing one, and
  can point to the specific `styles.css` rule or `src/` literal each reused class comes from before
  any completion claim.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `IMPLEMENTATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a new computed-percentage column type to the table renderer's row pipeline, reusing the existing .db-* cell classes rather than inventing new ones.`

### Commands

1. `sed -n '1,16p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"IMPLEMENTATION":/,/\],/p'`
3. `for p in references/view-renderer-architecture.md references/data-layer.md references/db-class-naming.md references/stylesheet-ownership.md references/workflow-implement.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: IMPLEMENTATION`. Step 2 shows the
`IMPLEMENTATION` `INTENT_SIGNALS`/`RESOURCE_MAP` entry this scenario's set derives from. Step 3
prints `OK` for all five paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["IMPLEMENTATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`IMPLEMENTATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `OBSIDIAN`/`IMPLEMENTATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["IMPLEMENTATION"]`
   excerpt to see whether the drift is a stale scenario file or a stale `SKILL.md` map — note the two
   sets are not required to be identical (`expected_resources` is a curated core subset, not an exact
   mirror), and that `SKILL.md` §2b currently names `references/single-stylesheet-ownership.md` and
   `assets/renderer-implementation-checklist.md`, neither of which exists in the shipped tree; the
   real filenames are `references/stylesheet-ownership.md` and the checklists under `assets/`.

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
| [SKILL.md](../../SKILL.md) §1 | The `OBSIDIAN` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: OB-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/renderer-feature-routing.md`
