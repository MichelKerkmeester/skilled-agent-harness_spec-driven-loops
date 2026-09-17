---
id: OB-008
category: resource_loading
title: 'References-only isolation'
description: "This scenario validates STACK_STANDARDS resource-loading isolation for `OB-008`. It focuses on confirming an API-boundary question loads only references/ evidence and pulls zero assets/ checklists, distinct from OB-007's classification-correctness objective."
expected_surface: OBSIDIAN
expected_intent: STACK_STANDARDS
expected_resources:
  - references/obsidian-plugin-api.md
  - references/stylesheet-ownership.md
  - references/db-class-naming.md
  - references/screenshot-harness.md
version: 1.0.0.0
---

# OB-008: References-only isolation

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-008`.

---

## 1. OVERVIEW

This scenario validates STACK_STANDARDS resource-loading isolation for `OB-008`. It focuses on
confirming that a pure stack-knowledge question loads only `references/` evidence and pulls in
zero `assets/` checklists, since `SKILL.md` §2b's own `STACK_STANDARDS` `RESOURCE_MAP` entry is the
only intent group with no asset checklist attached. This scenario's objective differs from `OB-007`
(intent-detection/stack-standards-routing.md): `OB-007` proves the prompt classifies correctly;
`OB-008` proves the loaded set stays reference-only once it does.

### Why This Matters

A resource-loading regression that quietly pulls a checklist into a pure-knowledge question wastes
context budget and can mislead an operator into thinking a checklist-gated task (like a rename or a
verification run) is in scope when it is not. Confirming zero-asset load for `STACK_STANDARDS` is
the cheapest possible negative check for that failure mode.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-008` classifies as `STACK_STANDARDS` and resolves only
`references/` paths, with zero `assets/` paths, in `expected_resources`.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `STACK_STANDARDS`, and
  every path in `expected_resources` is a `references/` path with no `assets/` path present.
- Real user request: `Is styles.css really the plugin's only stylesheet, or is there a scoped-style build somewhere I'm missing?`
- Prompt: `Is styles.css really the plugin's only stylesheet, or is there a scoped-style build somewhere I'm missing?`

**Exact prompt**:
```text
Is styles.css really the plugin's only stylesheet, or is there a scoped-style build somewhere I'm missing?
```

- Expected execution process: the hub detects `OBSIDIAN`, the `STACK_STANDARDS` `INTENT_SIGNALS`
  keywords (`styles.css`, `single stylesheet`, ...) match the prompt, and every path this scenario
  lists under `expected_resources` resolves under the skill root with zero `assets/` entries.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/` and starts
  with `references/`; no `assets/` path is present in the set.
- Desired user-visible outcome: the bundled workflow states plainly that `styles.css` is the one
  stylesheet — 18,931 lines, 1,196 distinct classes measured, no component-scoped styles anywhere —
  and cites `stylesheet-ownership.md` and `db-class-naming.md` without pulling in a rename or
  verification checklist the question never asked for.
- Pass/fail: PASS if every listed path exists, every listed path is under `references/`, and the
  frontmatter surface/intent are `OBSIDIAN`/`STACK_STANDARDS`; FAIL if any listed path is missing,
  an `assets/` path appears in the set, or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Is styles.css really the plugin's only stylesheet, or is there a scoped-style build somewhere I'm missing?`

### Commands

1. `sed -n '1,18p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/references-only-isolation.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"STACK_STANDARDS":/,/\],/p'`
3. `for p in references/obsidian-plugin-api.md references/stylesheet-ownership.md references/db-class-naming.md references/screenshot-harness.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`
4. `grep -c '^  - assets/' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/references-only-isolation.md`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: STACK_STANDARDS`. Step 2 shows the
`STACK_STANDARDS` `RESOURCE_MAP` entry this scenario's set derives from — the one intent group with
no asset checklist. Step 3 prints `OK` for all four paths. Step 4 prints `0`, confirming zero
`assets/` entries in this file's own `expected_resources` list.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the zero-count from step 4.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, every path is under `references/` (step 4
  prints `0`), and the frontmatter's `expected_surface`/`expected_intent` match `OBSIDIAN`/
  `STACK_STANDARDS`.
- **Fail**: any listed path is missing, an `assets/` path appears in the set, or the frontmatter
  surface/intent disagree with `OBSIDIAN`/`STACK_STANDARDS`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/`.
2. If step 4 prints a nonzero count, an `assets/` path was added to this scenario's own list by
   mistake — this scenario's entire purpose is to hold zero asset paths; remove it rather than
   reclassifying the scenario.

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

- Group: Resource Loading
- Playbook ID: OB-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `resource-loading/references-only-isolation.md`
