---
id: PR-018
category: token_cost_baseline
title: 'Token-cost ceiling: full-surface union load'
description: "This scenario validates the token-cost ceiling for `PR-018`. It focuses on confirming the union of every path across all six declared intents' RESOURCE_MAP entries plus DEFAULT_RESOURCE — the most this packet ever loads for one comprehensive audit — resolves in full at exactly twenty-two unique paths."
expected_surface: PI_REMOTE
expected_intent: FULL_SURFACE_UNION
expected_resources:
  - references/token-library.md
  - references/comment-grammar.md
  - references/component-tokens.md
  - references/retint-recipes.md
  - references/theme-remap.md
  - references/scoped-style-ownership.md
  - references/editability-guardrails.md
  - references/css-class-naming-bem.md
  - references/folder-docs.md
  - references/component-story-upkeep.md
  - references/verification.md
  - references/svelte-runes-effects.md
  - references/browser-free-verification-recipe.md
  - references/skill-reference-integrity.md
  - references/a11y-parity.md
  - assets/token-retint-checklist.md
  - assets/guardrail-audit-checklist.md
  - assets/bem-rename-checklist.md
  - assets/story-coverage-checklist.md
  - assets/runes-effect-audit-checklist.md
  - assets/ds-verification-checklist.md
  - assets/a11y-parity-checklist.md
version: 1.0.0.0
---

# PR-018: Token-cost ceiling: full-surface union load

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-018`.

---

## 1. OVERVIEW

This scenario validates the token-cost ceiling for `PR-018`. It focuses on confirming that a
comprehensive, cross-cutting audit request — one that genuinely needs every intent's evidence at once,
rather than a single classified intent — resolves the full union of all six `RESOURCE_MAP` entries
(`IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `LANGUAGE_STANDARDS`, `ACCESSIBILITY`)
plus `DEFAULT_RESOURCE`, deduplicated to fifteen unique `references/` paths and seven unique `assets/`
paths — twenty-two total, the ceiling against which `PR-016`'s floor (2) and `PR-017`'s median (4) are
measured.

### Why This Matters

A full-surface audit — for example, a pre-release design-system review that must touch tokens, guardrails,
naming, runes, verification, and accessibility all at once — is a real, if infrequent, request shape. This
scenario documents that its cost is bounded (twenty-two paths, not open-ended) and that the union
deduplicates correctly: several paths (`comment-grammar.md`, `component-tokens.md`, `theme-remap.md`,
`scoped-style-ownership.md`, `css-class-naming-bem.md`, `svelte-runes-effects.md`, `folder-docs.md`,
`editability-guardrails.md`, `verification.md`, `token-library.md`) are members of two or more intents'
sets and must be counted once, not once per intent.

---

## 2. SCENARIO CONTRACT

Operators confirm a comprehensive cross-cutting audit prompt resolves the full twenty-two-path union set
with no duplicate counted twice and no path from outside the six declared intents plus `DEFAULT_RESOURCE`
included.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE` and resolves the full deduplicated
  union of all six intents' `RESOURCE_MAP` entries plus `DEFAULT_RESOURCE`, at exactly 22 unique paths (15
  references, 7 assets).
- Real user request: `Run a full pre-release design-system review of this component: tokens, guardrails, naming, runes effects, verification, and accessibility — everything, before we ship.`
- Prompt: `Run a full pre-release design-system review of this component: tokens, guardrails, naming, runes effects, verification, and accessibility — everything, before we ship.`

**Exact prompt**:
```text
Run a full pre-release design-system review of this component: tokens, guardrails, naming, runes effects, verification, and accessibility — everything, before we ship.
```

- Expected execution process: the hub detects `PI_REMOTE`; the prompt's breadth (`tokens`, `guardrails`,
  `naming`, `runes effects`, `verification`, `accessibility`) matches keywords across all six declared
  intents at once; the workflow treats this as a full-surface request and loads the deduplicated union
  rather than picking one intent and dropping the rest.
- Expected signals: exactly 22 unique paths resolve — 15 under `references/`, 7 under `assets/` — with no
  path counted twice despite appearing in multiple intents' individual `RESOURCE_MAP` entries.
- Desired user-visible outcome: a pre-release reviewer gets the complete evidence set in one dispatch
  instead of six separate ones, at a documented, bounded token cost.
- Pass/fail: PASS if all 22 listed paths exist and the deduplicated count is exactly 22; FAIL if any listed
  path is missing, the count diverges from 22, or a path outside the six intents plus `DEFAULT_RESOURCE`
  appears.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a full pre-release design-system review of this component: tokens, guardrails, naming, runes effects, verification, and accessibility — everything, before we ship.`

### Commands

1. `sed -n '1,30p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`
2. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md`
3. `for p in references/token-library.md references/comment-grammar.md references/component-tokens.md references/retint-recipes.md references/theme-remap.md references/scoped-style-ownership.md references/editability-guardrails.md references/css-class-naming-bem.md references/folder-docs.md references/component-story-upkeep.md references/verification.md references/svelte-runes-effects.md references/browser-free-verification-recipe.md references/skill-reference-integrity.md references/a11y-parity.md assets/token-retint-checklist.md assets/guardrail-audit-checklist.md assets/bem-rename-checklist.md assets/story-coverage-checklist.md assets/runes-effect-audit-checklist.md assets/ds-verification-checklist.md assets/a11y-parity-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done | tee /tmp/pr018-check.txt`
4. `grep -c '^OK' /tmp/pr018-check.txt`

### Expected

Step 2 shows the full `RESOURCE_MAP` object for manual union cross-checking. Step 3 prints `OK` for all 22
paths. Step 4 prints `22`.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the full `RESOURCE_MAP` excerpt; the
`OK`-count confirmation.

### Pass / Fail

- **Pass**: all 22 listed paths exist and step 4 prints `22`.
- **Fail**: any listed path is missing, or step 4 prints a count other than `22`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If step 4 diverges from `22`, recompute the union manually from step 2's `RESOURCE_MAP` output plus
   `DEFAULT_RESOURCE`, deduplicate by path, and diff against this scenario's `expected_resources` to find
   whether a new resource was added to one intent's map or an old one was removed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `RESOURCE_MAP` (all six intents) and `DEFAULT_RESOURCE` this scenario unions |
| [SKILL.md](../../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli token-cost baseline
- Playbook ID: PR-018
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `token-cost-baseline/ceiling-load-all.md`
