---
id: WF-013
category: language_standards
title: 'Language standards routing'
description: "This scenario validates LANGUAGE_STANDARDS routing for `WF-013`. It confirms that a TypeScript/CommonJS docstring-and-standards prompt classifies as `LANGUAGE_STANDARDS` and loads the full CSS, HTML, and JavaScript style-guide and quality-standards set, matching `SKILL.md` §2b's `RESOURCE_MAP[\"LANGUAGE_STANDARDS\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: LANGUAGE_STANDARDS
expected_resources:
  - references/css/style-guide.md
  - references/css/quality-standards/patterns-and-naming-enforcement.md
  - references/css/quality-standards/typography-autofill-and-color.md
  - references/css/quality-standards/focus-has-print-and-quick-reference.md
  - references/css/quick-reference.md
  - references/css/patterns/tokens-state-machine-and-triggers.md
  - references/css/patterns/data-attributes-and-forms.md
  - references/css/patterns/focus-accessibility-and-mobile.md
  - references/css/patterns/designer-component-and-performance.md
  - references/css/patterns/quick-reference-and-related.md
  - references/html/style-guide.md
  - references/html/quality-standards.md
  - references/javascript/style-guide/overview-naming-and-structure.md
  - references/javascript/style-guide/formatting.md
  - references/javascript/style-guide/commenting-and-related.md
  - references/javascript/quality-standards/init-dom-error-and-async.md
  - references/javascript/quality-standards/observer-validation-and-performance.md
  - references/javascript/quality-standards/state-and-cleanup.md
  - references/javascript/quality-standards/shared-listener-and-weakmap.md
  - references/javascript/quality-standards/enforcement-and-quick-reference.md
  - references/javascript/quick-reference.md
version: 1.0.0.0
---

# WF-013: Language standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-013`.

---

## 1. OVERVIEW

This scenario validates LANGUAGE_STANDARDS routing for `WF-013`. It confirms that a TypeScript/CommonJS docstring-and-standards prompt classifies as `LANGUAGE_STANDARDS` and loads the full CSS, HTML, and JavaScript style-guide and quality-standards set, matching `SKILL.md` §2b's `RESOURCE_MAP["LANGUAGE_STANDARDS"]` entry exactly.

### Why This Matters

SKILL.md §2 states language standards should "load the detected language's trio; a frontend task legitimately spans all three." A prompt naming only TypeScript and CommonJS still routes to the full CSS/HTML/JavaScript LANGUAGE_STANDARDS set, because this surface treats frontend language standards as one combined intent rather than splitting per file extension.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-013` classifies as `LANGUAGE_STANDARDS` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `LANGUAGE_STANDARDS`, and every
  path in `expected_resources`.
- Real user request: `Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.`
- Prompt: `Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.`

**Exact prompt**:
```text
Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.
```

- Expected execution process: the hub detects `WEBFLOW`, the `LANGUAGE_STANDARDS` `INTENT_SIGNALS` keywords
  (`typescript`, `.ts`, `commonjs`, `.cjs`, `docstring`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `LANGUAGE_STANDARDS` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow checks the `.ts` helper and `.cjs` wrapper against the JavaScript style guide and quality-standards set, and loads the CSS/HTML trio alongside it because this surface treats LANGUAGE_STANDARDS as one combined frontend-language intent, not a per-language split.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `LANGUAGE_STANDARDS`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.`

### Commands

1. `sed -n '1,34p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/language-standards/language-standards-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"LANGUAGE_STANDARDS": \[/,/\],/p'`
3. `for p in references/css/style-guide.md references/css/quality-standards/patterns-and-naming-enforcement.md references/css/quality-standards/typography-autofill-and-color.md references/css/quality-standards/focus-has-print-and-quick-reference.md references/css/quick-reference.md references/css/patterns/tokens-state-machine-and-triggers.md references/css/patterns/data-attributes-and-forms.md references/css/patterns/focus-accessibility-and-mobile.md references/css/patterns/designer-component-and-performance.md references/css/patterns/quick-reference-and-related.md references/html/style-guide.md references/html/quality-standards.md references/javascript/style-guide/overview-naming-and-structure.md references/javascript/style-guide/formatting.md references/javascript/style-guide/commenting-and-related.md references/javascript/quality-standards/init-dom-error-and-async.md references/javascript/quality-standards/observer-validation-and-performance.md references/javascript/quality-standards/state-and-cleanup.md references/javascript/quality-standards/shared-listener-and-weakmap.md references/javascript/quality-standards/enforcement-and-quick-reference.md references/javascript/quick-reference.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: LANGUAGE_STANDARDS`. Step 2 shows the
`LANGUAGE_STANDARDS` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["LANGUAGE_STANDARDS"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`LANGUAGE_STANDARDS`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`LANGUAGE_STANDARDS`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["LANGUAGE_STANDARDS"]` excerpt —
   the two sets are an exact mirror for this intent, so any difference means either this scenario
   file or `SKILL.md` §2b drifted and needs reconciling, not that a subset omission is by design.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | The "load the detected language's trio; a frontend task legitimately spans all three" guidance this scenario grounds in |

---

## 5. SOURCE METADATA

- Group: Language Standards
- Playbook ID: WF-013
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `language-standards/language-standards-routing.md`

