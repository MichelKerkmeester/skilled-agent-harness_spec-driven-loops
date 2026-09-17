---
id: OB-011
category: unknown_fallback
title: 'Ambiguous multi-intent collision'
description: "This scenario validates the CODE_QUALITY+VERIFICATION ambiguous-intent case for `OB-011`. It focuses on confirming a single coherent prompt that literally matches both intents' keywords loads the union of both intents' curated evidence rather than silently collapsing to one."
expected_surface: OBSIDIAN
expected_intent: CODE_QUALITY+VERIFICATION
expected_resources:
  - references/db-class-naming.md
  - references/stylesheet-ownership.md
  - references/verification.md
  - assets/verification-checklist.md
version: 1.0.0.0
---

# OB-011: Ambiguous multi-intent collision

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-011`.

---

## 1. OVERVIEW

This scenario validates the `CODE_QUALITY`+`VERIFICATION` ambiguous-intent case for `OB-011`. It
focuses on confirming that a single prompt literally matching both intents' `INTENT_SIGNALS`
keywords (`quality gate` and `verify`) resolves to the union of both intents' curated evidence
instead of silently collapsing to whichever intent the classifier checks first. Unlike `OB-010`
(a single-intent prompt that happens to need a resource-type mix), this scenario's ambiguity is at
the intent-classification layer itself.

### Why This Matters

`SKILL.md` §2b does not define an `AMBIGUITY_DELTA` mechanism the way `sk-doc`'s router does; this
surface's `INTENT_SIGNALS` keyword sets are not mutually exclusive, and a prompt that hits two
groups at once is a real routing hazard, not a hypothetical one — a workflow that silently commits
to one intent here risks running a `.db-*` rename's quality-gate check without the verification
gate's measured baseline in view, or vice versa.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-011` matches keywords from both `CODE_QUALITY` and
`VERIFICATION`, and resolves the union `expected_resources` set spanning both.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, matches `INTENT_SIGNALS`
  keywords from both `CODE_QUALITY` and `VERIFICATION`, and every path in `expected_resources`
  resolves — spanning both intents' curated evidence rather than either alone.
- Real user request: `Run the quality gate and verify everything passes before I merge this .db-* rename.`
- Prompt: `Run the quality gate and verify everything passes before I merge this .db-* rename.`

**Exact prompt**:
```text
Run the quality gate and verify everything passes before I merge this .db-* rename.
```

- Expected execution process: the hub detects `OBSIDIAN`; `"quality gate"` matches `CODE_QUALITY`
  and `"verify"` matches `VERIFICATION` in the same sentence, alongside the `.db-*` rename context
  that touches `db-class-naming.md`; the bundled workflow surfaces both candidate intents rather
  than guessing one, and every path this scenario lists under `expected_resources` resolves under
  the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and the set
  spans both `CODE_QUALITY`-anchored evidence (rename/class-grammar) and `VERIFICATION`-anchored
  evidence (gate baseline).
- Desired user-visible outcome: the bundled workflow states that the prompt asks for both a
  `.db-*` rename's quality check and a full pre-merge verification pass, loads the class-grammar and
  stylesheet-ownership evidence for the rename alongside the gate baseline and checklist for the
  verification, and does not drop either half.
- Pass/fail: PASS if every listed path exists, the set spans both intents' curated evidence, and the
  frontmatter surface/intent are `OBSIDIAN`/`CODE_QUALITY+VERIFICATION`; FAIL if any listed path is
  missing, the set silently collapses to one intent only, or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate and verify everything passes before I merge this .db-* rename.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"CODE_QUALITY":/,/\],/p;/"VERIFICATION":/,/\],/p'`
3. `for p in references/db-class-naming.md references/stylesheet-ownership.md references/verification.md assets/verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: CODE_QUALITY+VERIFICATION`. Step 2
shows both intents' `RESOURCE_MAP` entries the union set draws from. Step 3 prints `OK` for all four
paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; both `RESOURCE_MAP` excerpts
from step 2.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root, the set spans both
  `CODE_QUALITY` and `VERIFICATION` evidence, and the frontmatter's `expected_surface`/
  `expected_intent` match `OBSIDIAN`/`CODE_QUALITY+VERIFICATION`.
- **Fail**: any listed path is missing, the set only reflects one intent, or the frontmatter
  surface/intent disagree with `OBSIDIAN`/`CODE_QUALITY+VERIFICATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed.
2. If the resolved set only reflects one intent, check whether the bundled workflow mode has a
   single-intent-only resolution path and flag it — this prompt is intentionally constructed to hit
   two `INTENT_SIGNALS` groups in the same sentence, so a single-intent result is a routing
   regression, not a stale scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises for both intents |
| [SKILL.md](../../SKILL.md) §3 | The "never invent a `.db-*` class" and gate-baseline rules this scenario's combined evidence enforces |

---

## 5. SOURCE METADATA

- Group: Unknown Fallback
- Playbook ID: OB-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `unknown-fallback/ambiguous-multi-intent.md`
