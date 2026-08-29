---
id: OB-007
category: stack_standards
title: 'Stack standards routing'
description: "This scenario validates STACK_STANDARDS routing for `OB-007`. It focuses on confirming an Obsidian-API-boundary question loads the plugin API reference, the single-stylesheet and class-grammar evidence, and the platform-support standard together."
expected_surface: OBSIDIAN
expected_intent: STACK_STANDARDS
expected_resources:
  - references/obsidian-plugin-api.md
  - references/stylesheet-ownership.md
  - references/db-class-naming.md
  - references/screenshot-harness.md
  - references/standards/platform-support.md
version: 1.0.0.0
---

# OB-007: Stack standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-007`.

---

## 1. OVERVIEW

This scenario validates STACK_STANDARDS routing for `OB-007`. It focuses on confirming that a
question about the plugin's Obsidian API boundary — what `manifest.json`, `FileView`, and
`WorkspaceLeaf` actually require — classifies as `STACK_STANDARDS` and loads the API-boundary
reference together with the single-stylesheet and class-grammar evidence and the platform-support
standard, rather than the implementation or debugging evidence a change-shaped prompt would need.

### Why This Matters

`main.ts` is the single `Plugin` entry point: `NoteDatabasePlugin extends Plugin` registers
`DatabaseView` (`extends FileView`) and `DatabaseFileDashboardView` (`extends DatabaseView`) against
their `WorkspaceLeaf` view types, and `manifest.json` declares `isDesktopOnly: false` — nothing in
the tree may assume a desktop-only API. A question about this boundary is a stack-knowledge lookup,
not an edit; loading `obsidian-plugin-api.md` with `standards/platform-support.md` is what keeps the
answer scoped to what the plugin's `manifest.json` and view classes actually commit to, instead of
Obsidian's full API surface.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-007` classifies as `STACK_STANDARDS` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `STACK_STANDARDS`, and
  every path in `expected_resources`.
- Real user request: `What does manifest.json's isDesktopOnly setting actually constrain, and which WorkspaceLeaf view types does main.ts register against FileView?`
- Prompt: `What does manifest.json's isDesktopOnly setting actually constrain, and which WorkspaceLeaf view types does main.ts register against FileView?`

**Exact prompt**:
```text
What does manifest.json's isDesktopOnly setting actually constrain, and which WorkspaceLeaf view types does main.ts register against FileView?
```

- Expected execution process: the hub detects `OBSIDIAN`, the `STACK_STANDARDS` `INTENT_SIGNALS`
  keywords (`obsidian api`, `fileview`, `workspaceleaf`, `manifest.json`, ...) match the prompt, and
  every path this scenario lists under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and each one
  documents `STACK_STANDARDS` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow states that `isDesktopOnly: false` means no
  desktop-only API may be assumed anywhere in the tree, and names `DatabaseView` (`FileView`) and
  `DatabaseFileDashboardView` (extends `DatabaseView`) as the two `WorkspaceLeaf` view types `main.ts`
  registers, citing `obsidian-plugin-api.md` rather than general Obsidian API knowledge.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `STACK_STANDARDS`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What does manifest.json's isDesktopOnly setting actually constrain, and which WorkspaceLeaf view types does main.ts register against FileView?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"STACK_STANDARDS":/,/\],/p'`
3. `for p in references/obsidian-plugin-api.md references/stylesheet-ownership.md references/db-class-naming.md references/screenshot-harness.md references/standards/platform-support.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: STACK_STANDARDS`. Step 2 shows the
`STACK_STANDARDS` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all
five paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the
`RESOURCE_MAP["STACK_STANDARDS"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`STACK_STANDARDS`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `OBSIDIAN`/`STACK_STANDARDS`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["STACK_STANDARDS"]`
   excerpt — note `SKILL.md` §2b currently names `references/obsidian-api-boundary.md` and
   `references/screenshot-fixture-harness.md`, neither of which exists; the real filenames are
   `references/obsidian-plugin-api.md` and `references/screenshot-harness.md`. This scenario's set is
   a curated core subset built from the live paths, not an exact mirror of the stale map.

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
| [SKILL.md](../../SKILL.md) §1 | The `OBSIDIAN` surface-detection markers (`manifest.json`, `esbuild.config.mjs`, `from "obsidian"`) this scenario assumes |

---

## 5. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: OB-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/stack-standards-routing.md`
