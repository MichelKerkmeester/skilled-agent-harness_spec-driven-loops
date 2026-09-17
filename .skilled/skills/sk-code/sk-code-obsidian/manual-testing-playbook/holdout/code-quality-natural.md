---
id: OB-H02
category: holdout
title: 'Holdout -- CODE_QUALITY via natural phrasing'
description: "Holdout scenario OB-H02: the fitted CODE_QUALITY answer (OB-003) restated in phrasing a real operator would use, with no literal INTENT_SIGNALS keyword from any group, measuring whether intent detection survives unseen wording."
expected_surface: OBSIDIAN
expected_intent: CODE_QUALITY
expected_resources:
  - references/db-class-naming.md
  - references/stylesheet-ownership.md
version: 1.0.0.0
---

# OB-H02: CODE_QUALITY held out (decontaminated phrasing)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-H02`.

---

## 1. OVERVIEW

Generalization probe. The correct answer is the same underlying evidence `OB-003` exercises, but the
request avoids the router's literal keyword vocabulary — no "naming", no "quality gate", no
"kebab-case". It measures whether `CODE_QUALITY` classification survives unseen wording for a
class-rename request.

### Why This Matters

`OB-H02` guards the router decision for the Holdout category's `CODE_QUALITY` case, the intent this
surface's own honesty note flags as one of the two most consequential to get right (alongside
`IMPLEMENTATION`), since the "never invent a `.db-*` class" rule sits directly on this path.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact decontaminated prompt for `OB-H02` still classifies as `CODE_QUALITY`.

- Objective: confirm the router selects `CODE_QUALITY` for a keyword-blind phrasing of the same
  underlying request `OB-003` exercises.
- Real user request: `Everywhere the board card shows a field label, I want that class called something clearer — same meaning, better word.`
- Prompt: `Everywhere the board card shows a field label, I want that class called something clearer — same meaning, better word.`

**Exact prompt**:
```text
Everywhere the board card shows a field label, I want that class called something clearer — same meaning, better word.
```

- Expected execution process: the hub detects `OBSIDIAN`; despite avoiding every literal
  `CODE_QUALITY` keyword, the request's underlying shape (relabeling a `.db-*` class everywhere it
  appears) still resolves `CODE_QUALITY`, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, matching
  `OB-003`'s underlying evidence despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow recognizes this as a rename request and reaches
  for the class-grammar and stylesheet-ownership evidence without needing the literal word "rename"
  or "naming".
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `CODE_QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Everywhere the board card shows a field label, I want that class called something clearer — same meaning, better word.`

### Note

This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are — by frontmatter/path agreement, not by a live command transcript.

### Commands

1. `sed -n '1,13p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/code-quality-natural.md`
2. `for p in references/db-class-naming.md references/stylesheet-ownership.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: CODE_QUALITY`. Step 2 prints `OK`
for both paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the routed intent from a live
dispatch of the exact prompt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists and the frontmatter's `expected_surface`/
  `expected_intent` match `OBSIDIAN`/`CODE_QUALITY`.
- **Fail**: any listed path is missing, or a live dispatch of the exact prompt resolves an intent
  other than `CODE_QUALITY`.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a live dispatch resolves the wrong intent (for example `IMPLEMENTATION`, since "clearer class"
   could misread as new styling work), compare this prompt against `OB-003`'s literal-keyword form to
   isolate which phrase difference broke classification.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../intent-detection/db-class-rename-routing.md` | The fitted `OB-003` scenario this holdout decontaminates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` this holdout deliberately avoids matching literally |
| [SKILL.md](../../SKILL.md) §3 | The "never invent a `.db-*` class" rule this holdout's underlying task touches |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: OB-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/code-quality-natural.md`
