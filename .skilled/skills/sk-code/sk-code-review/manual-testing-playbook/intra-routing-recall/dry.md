---
id: CR-R04
category: intra_routing_recall
stage: routing
title: 'DRY routing'
description: "This scenario validates DRY routing for `CR-R04`. It confirms a duplication-shaped prompt classifies as `DRY` and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: DRY
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.0.0.0
---

# CR-R04: DRY routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R04`.

---

## 1. OVERVIEW

This scenario validates DRY routing for `CR-R04`. It confirms that a
duplication-shaped prompt classifies as `DRY`, not a mismatched intent, and resolves every
path this scenario declares under `expected_resources` — this scenario's set already carries the intent-specific checklist via `DEFAULT_RESOURCES`.

### Why This Matters

`DRY` resolves to the same `assets/code-quality-checklist.md` entry as `KISS` and `QUALITY` - duplication detection lives in the same checklist as simplicity and correctness checks. CR-R04 proves a duplication-shaped prompt ("copy-paste", "repeated logic") still classifies as `DRY` and keeps that shared checklist resolved, so a reviewer does not lose duplicate-branch detection because a narrower keyword pattern matched first.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CR-R04` classifies as `DRY` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `DRY` and every path in
  `expected_resources`.
- Real user request: `Review target has copy-pasted logic that should probably be shared.`
- Prompt: `Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.`

**Exact prompt**:
```text
Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.
```

- Expected execution process: the smart router matches the `DRY` `INTENT_SIGNALS`
  keywords (`dry`, `duplication`, `duplicate`, `copy-paste`, `repeated logic`) against the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-review/`, and the
  frontmatter `expected_intent` reads `DRY`.
- Desired user-visible outcome: a review that names duplicate branches and repeated logic using the shared code-quality checklist.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is
  `DRY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this change for DRY problems, duplication, duplicate branches, copy-paste code, and repeated logic.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/dry.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"DRY"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"DRY"'`
4. `for p in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-review/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: DRY` and the full `expected_resources` list. Step 2 shows
the `DRY` `INTENT_SIGNALS` entry (weight `3`) this scenario's prompt keywords
derive from. Step 3 shows the `RESOURCE_MAP["DRY"]` entry this scenario's set is built
from. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the
`INTENT_SIGNALS["DRY"]` and `RESOURCE_MAP["DRY"]` excerpts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `DRY`.
- **Fail**: any listed path is missing, or the frontmatter `expected_intent` disagrees with
  `DRY`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed
   under `assets/` or `references/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["DRY"]`
   excerpt — DRY, KISS, and QUALITY all resolve to the same `assets/code-quality-checklist.md` entry, so a missing path here is a shared-checklist regression, not a DRY-only one.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | `DEFAULT_RESOURCES` baseline this scenario assumes |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/dry.md`
