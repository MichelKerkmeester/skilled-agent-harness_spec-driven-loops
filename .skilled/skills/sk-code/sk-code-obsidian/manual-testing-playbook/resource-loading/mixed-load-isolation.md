---
id: OB-010
category: resource_loading
title: 'Mixed reference-and-asset load'
description: "This scenario validates CODE_QUALITY resource-loading isolation for `OB-010`. It focuses on confirming a folder-doc-plus-banner question about src/views/modals/ loads a deliberate mix of two references and two assets, distinct from OB-004's folder-doc scenario about tools/screenshots/scenarios/."
expected_surface: OBSIDIAN
expected_intent: CODE_QUALITY
expected_resources:
  - references/folder-docs.md
  - references/comment-grammar.md
  - assets/folder-docs-checklist.md
  - assets/comment-banner-checklist.md
version: 1.0.0.0
---

# OB-010: Mixed reference-and-asset load

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-010`.

---

## 1. OVERVIEW

This scenario validates CODE_QUALITY resource-loading isolation for `OB-010`. It focuses on
confirming that a single, coherent question spanning both the folder-doc threshold and the
`MODULE:` banner grammar loads a deliberate two-reference-plus-two-asset mix — proving the router
combines resource types cleanly rather than picking one type and dropping the other. This scenario's
target folder (`src/views/modals/`) and its added banner question distinguish it from `OB-004`,
which asks the folder-doc question alone about `tools/screenshots/scenarios/`.

### Why This Matters

`src/views/modals/` is a folder this packet already flags twice elsewhere (`OB-002`'s screenshot gap,
`SKILL.md` §3b's folder-doc obligation list) — a realistic operator question about it plausibly asks
about the folder-doc pairing AND the banner convention in the same breath, since a `CODE.md` half
would restate the same banner grammar. A mixed-load regression that drops either the folder-doc pair
or the banner grammar half of the answer leaves the operator with an incomplete document.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-010` classifies as `CODE_QUALITY` and resolves both
`references/` paths and both `assets/` paths in `expected_resources`.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `CODE_QUALITY`, and every
  path in `expected_resources` resolves, with at least one `references/` path and at least one
  `assets/` path present.
- Real user request: `src/views/modals/ has 17 files and no README.md or CODE.md yet — does it owe the pair, and once we add one, does every modal file there need a MODULE banner too?`
- Prompt: `src/views/modals/ has 17 files and no README.md or CODE.md yet — does it owe the pair, and once we add one, does every modal file there need a MODULE banner too?`

**Exact prompt**:
```text
src/views/modals/ has 17 files and no README.md or CODE.md yet — does it owe the pair, and once we add one, does every modal file there need a MODULE banner too?
```

- Expected execution process: the hub detects `OBSIDIAN`, the `CODE_QUALITY` `INTENT_SIGNALS`
  keywords (`folder docs`, `module banner`, ...) both match the prompt, and every path this scenario
  lists under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`; the set
  contains at least one `references/` path and at least one `assets/` path.
- Desired user-visible outcome: the bundled workflow states that `src/views/modals/` qualifies for
  the folder-doc pair (named explicitly in `SKILL.md` §3b's measured list) and states plainly that
  the `MODULE:` banner is a target convention not yet adopted anywhere in the shipped tree (0 of 249
  files), rather than presenting it as already in force.
- Pass/fail: PASS if every listed path exists, both resource types are present, and the frontmatter
  surface/intent are `OBSIDIAN`/`CODE_QUALITY`; FAIL if any listed path is missing, one resource type
  is entirely absent, or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `src/views/modals/ has 17 files and no README.md or CODE.md yet — does it owe the pair, and once we add one, does every modal file there need a MODULE banner too?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/mixed-load-isolation.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"CODE_QUALITY":/,/\],/p'`
3. `for p in references/folder-docs.md references/comment-grammar.md assets/folder-docs-checklist.md assets/comment-banner-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`
4. `grep -c '^  - references/' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/mixed-load-isolation.md; grep -c '^  - assets/' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/mixed-load-isolation.md`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: CODE_QUALITY`. Step 2 shows the
`CODE_QUALITY` `RESOURCE_MAP` entry this scenario's set draws from. Step 3 prints `OK` for all four
paths. Step 4 prints `2` and `2`, confirming a genuine mix rather than an all-references or
all-assets set.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the two counts from step 4.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, step 4 prints a nonzero count for both resource
  types, and the frontmatter's `expected_surface`/`expected_intent` match `OBSIDIAN`/`CODE_QUALITY`.
- **Fail**: any listed path is missing, either resource type's count is `0`, or the frontmatter
  surface/intent disagree with `OBSIDIAN`/`CODE_QUALITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Confirm `src/views/modals/` still has 17 files and no `README.md`/`CODE.md` pair
   (`ls src/views/modals/*.ts | wc -l`, `ls src/views/modals/README.md src/views/modals/CODE.md`); if
   the pair now exists, the prompt's premise is stale and should be updated before re-running.

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
| [SKILL.md](../../SKILL.md) §3b | The folder-doc obligation list and the "0 of 249 files" banner-adoption fact this scenario's answer must state honestly |

---

## 5. SOURCE METADATA

- Group: Resource Loading
- Playbook ID: OB-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `resource-loading/mixed-load-isolation.md`
