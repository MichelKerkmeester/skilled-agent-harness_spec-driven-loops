---
id: OC-001
category: language_standards
title: 'TypeScript standards routing'
description: "This scenario validates TYPESCRIPT routing for `OC-001`. It confirms a TypeScript implementation prompt loads the strict-mode style guide, type-system quality standards, and tsconfig/module quick reference instead of a generic implementation checklist."
expected_surface: OPENCODE
expected_intent: TYPESCRIPT
expected_resources:
  - references/typescript/style-guide/overview-strict-and-naming.md
  - references/typescript/style-guide/formatting-imports-and-coexistence.md
  - references/typescript/quality-standards/overview-and-type-system.md
  - references/typescript/quality-standards/tsdoc-errors-and-async.md
  - references/typescript/quality-standards/tsconfig-and-modules.md
  - references/typescript/quick-reference/template-naming-and-types.md
  - references/typescript/quick-reference/imports-errors-and-tsconfig.md
version: 1.0.0.0
---

# OC-001: TypeScript standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-001`.

---

## 1. OVERVIEW

This scenario validates `TYPESCRIPT` routing for `OC-001`. It focuses on confirming that the exact prompt
below classifies as `TYPESCRIPT` and loads the full 7-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

A TypeScript task mis-routed to the generic `IMPLEMENTATION` universal-patterns tier would skip the strict-mode naming rules, the TSDoc/error/async quality standards, and the tsconfig/module boundary contract in `references/typescript/`, letting an author-side pass claim standards were checked when only the language-agnostic organization tier was ever loaded.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-001` classifies as `TYPESCRIPT` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `TYPESCRIPT`, and every path in
  `expected_resources`.
- Real user request: `For an OpenCode TypeScript module, apply the typescript .ts standards before I implement a feature.`
- Prompt: `For an OpenCode TypeScript module, apply the typescript .ts standards before I implement a feature.`

**Exact prompt**:
```text
For an OpenCode TypeScript module, apply the typescript .ts standards before I implement a feature.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `TYPESCRIPT`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `TYPESCRIPT` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `TYPESCRIPT` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `TYPESCRIPT`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `For an OpenCode TypeScript module, apply the typescript .ts standards before I implement a feature.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/typescript-standards.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"TYPESCRIPT"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"TYPESCRIPT": \[/,/\],/p'`
4. `for p in references/typescript/style-guide/overview-strict-and-naming.md references/typescript/style-guide/formatting-imports-and-coexistence.md references/typescript/quality-standards/overview-and-type-system.md references/typescript/quality-standards/tsdoc-errors-and-async.md references/typescript/quality-standards/tsconfig-and-modules.md references/typescript/quick-reference/template-naming-and-types.md references/typescript/quick-reference/imports-errors-and-tsconfig.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: TYPESCRIPT` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["TYPESCRIPT"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["TYPESCRIPT"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["TYPESCRIPT"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `TYPESCRIPT`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `TYPESCRIPT`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/typescript/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["TYPESCRIPT"]` excerpt to see
   whether the drift is a stale scenario file or a stale `SKILL.md` map.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `TYPESCRIPT` resource set |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `language-standards/typescript-standards.md`
