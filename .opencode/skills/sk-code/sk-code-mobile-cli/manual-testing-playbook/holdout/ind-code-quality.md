---
id: PR-H04
category: holdout
title: 'Independent holdout — CODE_QUALITY (keyword-blind)'
description: "This scenario validates an independent, keyword-blind CODE_QUALITY probe for `PR-H04`. Authored without consulting the CODE_QUALITY INTENT_SIGNALS keyword list, it confirms the classifier still resolves the full guardrail-and-folder-docs resource set from a fence/organization concern phrased in plain language."
expected_surface: PI_REMOTE
expected_intent: CODE_QUALITY
expected_resources:
  - references/conventions/editability-guardrails.md
  - references/design-system/css-class-naming-bem.md
  - references/conventions/comment-grammar.md
  - references/conventions/folder-docs.md
  - references/component-story-upkeep.md
  - assets/guardrail-audit-checklist.md
  - assets/bem-rename-checklist.md
  - assets/story-coverage-checklist.md
version: 1.0.0.0
---

# PR-H04: Independent holdout — CODE_QUALITY (keyword-blind)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-H04`.

---

## 1. OVERVIEW

Authored blind to the `CODE_QUALITY` `INTENT_SIGNALS` keyword list in `SKILL.md` §2b. This is an
independent probe for `PR-H04` — distinct from the natural-phrasing rewrites (`PR-H01`..`PR-H03`), which
start from an existing fitted scenario and reword it. This prompt was composed from the surface's plain
concerns (security-sensitive code stayed untouched; the component's files are still organized correctly)
without first reading which literal words the router matches on.

### Why This Matters

A natural-phrasing rewrite can still unconsciously echo the fitted scenario's structure. An independently
authored, keyword-blind prompt is a stronger generalization test because it was never derived from the
router's own vocabulary or from an existing fitted scenario at all.

---

## 2. SCENARIO CONTRACT

Operators confirm the independently authored prompt for `PR-H04` classifies as `CODE_QUALITY` and resolves
the full eight-path `RESOURCE_MAP["CODE_QUALITY"]` set.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `CODE_QUALITY`, and every path
  in `expected_resources` resolves.
- Real user request: `Can you make sure nothing in the security-sensitive parts of this component got touched by the recent styling pass, and that the file organization for this feature is still tidy?`
- Prompt: `Can you make sure nothing in the security-sensitive parts of this component got touched by the recent styling pass, and that the file organization for this feature is still tidy?`

**Exact prompt**:
```text
Can you make sure nothing in the security-sensitive parts of this component got touched by the recent styling pass, and that the file organization for this feature is still tidy?
```

- Expected execution process: the hub detects `PI_REMOTE`; the request's shape (confirm a frozen-boundary
  fence held, confirm file/folder organization) resolves to `CODE_QUALITY`; every path this scenario
  lists under `expected_resources` resolves.
- Expected signals: the resolved intent and resource set match the full `RESOURCE_MAP["CODE_QUALITY"]`
  entry, despite the prompt never using the words "guardrail," "quality gate," or "folder docs."
- Desired user-visible outcome: the bundled workflow re-counts the `Do not edit —` fences, checks the
  file-naming grammar, and confirms folder-docs pairing, exactly as `PR-003`/`PR-009` describe.
- Pass/fail: PASS if every listed path exists and the resolved intent matches `CODE_QUALITY`; FAIL if the
  resolved intent diverges or a listed path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Can you make sure nothing in the security-sensitive parts of this component got touched by the recent styling pass, and that the file organization for this feature is still tidy?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/ind-code-quality.md`
2. `for p in references/conventions/editability-guardrails.md references/design-system/css-class-naming-bem.md references/conventions/comment-grammar.md references/conventions/folder-docs.md references/component-story-upkeep.md assets/guardrail-audit-checklist.md assets/bem-rename-checklist.md assets/story-coverage-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 prints `OK` for all eight paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the dispatch transcript's resolved
intent.

### Pass / Fail

- **Pass**: the resolved intent is `CODE_QUALITY` and every listed path exists.
- **Fail**: the resolved intent diverges from `CODE_QUALITY`, or a listed path is missing.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
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
- Playbook ID: PR-H04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/ind-code-quality.md`
