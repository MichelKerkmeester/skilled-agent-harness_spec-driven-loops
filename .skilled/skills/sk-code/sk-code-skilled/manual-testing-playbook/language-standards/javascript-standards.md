---
id: OC-010
category: language_standards
title: 'JavaScript standards routing'
description: "This scenario validates JAVASCRIPT routing for `OC-010`. It confirms a CommonJS plugin prompt loads the JavaScript style guide, the module/docs and security/exemption quality standards, and the JavaScript quick reference instead of a generic implementation or TypeScript resource set."
expected_surface: SKILLED
expected_intent: JAVASCRIPT
expected_resources:
  - references/javascript/style-guide.md
  - references/javascript/quality-standards/overview-modules-and-docs.md
  - references/javascript/quality-standards/security-testing-and-exemptions.md
  - references/javascript/quick-reference.md
version: 1.0.0.0
---

# OC-010: JavaScript standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-010`.

---

## 1. OVERVIEW

This scenario validates `JAVASCRIPT` routing for `OC-010`. It focuses on confirming that the exact prompt
below classifies as `JAVASCRIPT` and loads the full 4-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §6's machine-readable router.

### Why This Matters

`JAVASCRIPT` is the intent that carries the plugin and CommonJS rules of the Skilled surface. A JavaScript
task mis-routed to the `IMPLEMENTATION` tier would skip the no-TUI-write plugin rule, the security and
test-exemption standards and the `'use strict'`/module-boundary conventions in `references/javascript/`,
letting a plugin change claim standards were checked when only the language-agnostic tier was loaded.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-010` classifies as `JAVASCRIPT` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `SKILLED`, intent `JAVASCRIPT`, and every path in
  `expected_resources`.
- Real user request: `Review this CommonJS .cjs plugin against the javascript style guide and .mjs interop risks.`
- Prompt: `Review this CommonJS .cjs plugin against the javascript style guide and .mjs interop risks.`

**Exact prompt**:
```text
Review this CommonJS .cjs plugin against the javascript style guide and .mjs interop risks.
```

- Expected execution process: the hub detects `SKILLED` (work under `.skilled/`), the `JAVASCRIPT`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-skilled/`, and each one
  documents `JAVASCRIPT` routing per `SKILL.md` §2 or §6.
- Desired user-visible outcome: the bundled workflow cites the routed `JAVASCRIPT` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `SKILLED`/
  `JAVASCRIPT`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this CommonJS .cjs plugin against the javascript style guide and .mjs interop risks.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/language-standards/javascript-standards.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-skilled/SKILL.md | grep -F '"JAVASCRIPT"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-skilled/SKILL.md | sed -n '/"JAVASCRIPT": \[/,/\],/p'`
4. `for p in references/javascript/style-guide.md references/javascript/quality-standards/overview-modules-and-docs.md references/javascript/quality-standards/security-testing-and-exemptions.md references/javascript/quick-reference.md; do test -e ".skilled/skills/sk-code/sk-code-skilled/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: JAVASCRIPT` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["JAVASCRIPT"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["JAVASCRIPT"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["JAVASCRIPT"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `JAVASCRIPT`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `JAVASCRIPT`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/javascript/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["JAVASCRIPT"]` excerpt to see
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
| [SKILL.md](../../SKILL.md) §6 | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `JAVASCRIPT` resource set |

---

## 5. SOURCE METADATA

- Group: sk-code-skilled routing
- Playbook ID: OC-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `language-standards/javascript-standards.md`
