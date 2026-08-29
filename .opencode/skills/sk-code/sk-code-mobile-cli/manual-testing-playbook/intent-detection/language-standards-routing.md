---
id: PR-006
category: language_standards
title: 'Language standards routing'
description: "This scenario validates LANGUAGE_STANDARDS routing for `PR-006`. It focuses on confirming a naming-convention question loads the token model and theme-remap evidence instead of a retint-execution prompt's resources."
expected_surface: PI_REMOTE
expected_intent: LANGUAGE_STANDARDS
expected_resources:
  - references/design-system/token-library.md
  - references/design-system/component-tokens.md
  - references/design-system/theme-remap.md
version: 1.0.0.0
---

# PR-006: Language standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-006`.

---

## 1. OVERVIEW

This scenario validates LANGUAGE_STANDARDS routing for `PR-006`. It focuses on confirming that a
"explain the convention" question — not an edit request — classifies as `LANGUAGE_STANDARDS` and loads
the token-layer model and theme-remap evidence, since the answer requires naming the primitive → semantic
→ component layering and where a new per-surface token belongs.

### Why This Matters

`SKILL.md` §3b documents the shipped grammar: kebab-case source names, the closed prefix list for
component kinds, BEM `block--element` classes, and the three-layer token naming (`--pi-*` primitives,
semantic roles, `--model-sheet-*`/`--slash-*`/`--diff-*` component families). A `LANGUAGE_STANDARDS`
answer that skips `token-library.md` and `component-tokens.md` risks inventing a naming pattern instead
of citing the one this codebase actually uses.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-006` classifies as `LANGUAGE_STANDARDS` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `LANGUAGE_STANDARDS`, and
  every path in `expected_resources`.
- Real user request: `Explain the CSS custom-property naming convention for adding a new per-surface component token in this codebase.`
- Prompt: `Explain the CSS custom-property naming convention for adding a new per-surface component token in this codebase.`

**Exact prompt**:
```text
Explain the CSS custom-property naming convention for adding a new per-surface component token in this codebase.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `LANGUAGE_STANDARDS` `INTENT_SIGNALS`
  keywords (`app.css`, `kebab-case`, ...) match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`, and each one
  documents `LANGUAGE_STANDARDS` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the answer names the correct per-surface component-token family (e.g.
  `--model-sheet-*`), cites the semantic role it resolves through, and does not propose editing a `--pi-*`
  primitive.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `PI_REMOTE`/
  `LANGUAGE_STANDARDS`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Explain the CSS custom-property naming convention for adding a new per-surface component token in this codebase.`

### Commands

1. `sed -n '1,12p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/language-standards-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"LANGUAGE_STANDARDS":/,/\],/p'`
3. `for p in references/design-system/token-library.md references/design-system/component-tokens.md references/design-system/theme-remap.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: LANGUAGE_STANDARDS`. Step 2 shows the
`LANGUAGE_STANDARDS` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all
three paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["LANGUAGE_STANDARDS"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `PI_REMOTE`/`LANGUAGE_STANDARDS`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `PI_REMOTE`/`LANGUAGE_STANDARDS`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["LANGUAGE_STANDARDS"]`
   excerpt to see whether the drift is a stale scenario file or a stale `SKILL.md` map — the two sets are
   not required to be identical (`expected_resources` is a curated core subset, not an exact mirror).

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
| [SKILL.md](../../SKILL.md) §3b | The naming/routing grammar this answer must cite |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli routing
- Playbook ID: PR-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/language-standards-routing.md`
