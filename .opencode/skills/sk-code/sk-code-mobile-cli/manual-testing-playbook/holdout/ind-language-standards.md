---
id: PR-H06
category: holdout
title: 'Independent holdout — LANGUAGE_STANDARDS (keyword-blind)'
description: "This scenario validates an independent, keyword-blind LANGUAGE_STANDARDS probe for `PR-H06`. Authored without consulting the LANGUAGE_STANDARDS INTENT_SIGNALS keyword list, it confirms the classifier still resolves the full references-only convention set from a plain-language naming-and-styling-location question."
expected_surface: PI_REMOTE
expected_intent: LANGUAGE_STANDARDS
expected_resources:
  - references/design-system/token-library.md
  - references/design-system/component-tokens.md
  - references/design-system/theme-remap.md
  - references/design-system/scoped-style-ownership.md
  - references/design-system/css-class-naming-bem.md
  - references/svelte/svelte-runes-effects.md
  - references/conventions/comment-grammar.md
  - references/conventions/folder-docs.md
version: 1.0.0.0
---

# PR-H06: Independent holdout — LANGUAGE_STANDARDS (keyword-blind)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-H06`.

---

## 1. OVERVIEW

Authored blind to the `LANGUAGE_STANDARDS` `INTENT_SIGNALS` keyword list in `SKILL.md` §2b. This is an
independent probe for `PR-H06`, composed from the plain question a new contributor to this codebase would
actually ask — what do I name a new file, and where does its styling live — without first reading which
literal words the router matches on.

### Why This Matters

`PR-006`/`PR-008` prove this intent resolves correctly when a prompt names "CSS custom-property" or
"kebab-case" directly. A genuinely new contributor asking the same question in plainer terms is the more
common real-world case, and it is the scenario most likely to expose a classifier that only recognizes its
own jargon back at itself.

---

## 2. SCENARIO CONTRACT

Operators confirm the independently authored prompt for `PR-H06` classifies as `LANGUAGE_STANDARDS` and
resolves the full eight-path, references-only `RESOURCE_MAP["LANGUAGE_STANDARDS"]` set.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `LANGUAGE_STANDARDS`, and
  every path in `expected_resources` resolves, with zero `assets/` paths.
- Real user request: `What's this codebase's rule for how a new UI file should be named, and where would its styling actually live — in its own file or a shared one?`
- Prompt: `What's this codebase's rule for how a new UI file should be named, and where would its styling actually live — in its own file or a shared one?`

**Exact prompt**:
```text
What's this codebase's rule for how a new UI file should be named, and where would its styling actually live — in its own file or a shared one?
```

- Expected execution process: the hub detects `PI_REMOTE`; the request's shape (a naming-convention and
  styling-location question, not an action to execute) resolves to `LANGUAGE_STANDARDS`; every path this
  scenario lists under `expected_resources` resolves, with zero `assets/` paths.
- Expected signals: the resolved intent and resource set match the full `RESOURCE_MAP["LANGUAGE_STANDARDS"]`
  entry, despite the prompt never using the words "kebab-case," "scoped style," or "app.css."
- Desired user-visible outcome: the answer states the kebab-case naming grammar and the scoped-`<style>`
  versus `app.css` ownership rule, exactly as `PR-006`/`PR-008` describe.
- Pass/fail: PASS if every listed path exists, no `assets/` path is loaded, and the resolved intent
  matches `LANGUAGE_STANDARDS`; FAIL if the resolved intent diverges, an `assets/` path loads, or a listed
  path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What's this codebase's rule for how a new UI file should be named, and where would its styling actually live — in its own file or a shared one?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/ind-language-standards.md`
2. `for p in references/design-system/token-library.md references/design-system/component-tokens.md references/design-system/theme-remap.md references/design-system/scoped-style-ownership.md references/design-system/css-class-naming-bem.md references/svelte/svelte-runes-effects.md references/conventions/comment-grammar.md references/conventions/folder-docs.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 prints `OK` for all eight paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the dispatch transcript's resolved
intent.

### Pass / Fail

- **Pass**: the resolved intent is `LANGUAGE_STANDARDS`, no `assets/` path loads, and every listed path
  exists.
- **Fail**: the resolved intent diverges from `LANGUAGE_STANDARDS`, an `assets/` path loads, or a listed
  path is missing.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed under
   `references/`.
2. If the resolved intent drifted elsewhere, compare this prompt's actual language against every declared
   intent's keyword list in `SKILL.md` §2b to see whether it accidentally matched a different intent's
   keyword by coincidence, since this prompt was composed independently of that list.

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
| [SKILL.md](../../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli holdout
- Playbook ID: PR-H06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/ind-language-standards.md`
