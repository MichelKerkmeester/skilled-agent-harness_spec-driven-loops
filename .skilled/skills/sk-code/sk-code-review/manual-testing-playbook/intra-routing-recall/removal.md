---
id: CR-R06
category: intra_routing_recall
stage: routing
title: 'Removal routing'
description: "This scenario validates REMOVAL routing for `CR-R06`. It confirms a removal-shaped prompt classifies as `REMOVAL` and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: REMOVAL
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - assets/removal-plan.md
version: 1.0.0.0
---

# CR-R06: Removal routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R06`.

---

## 1. OVERVIEW

This scenario validates REMOVAL routing for `CR-R06`. It confirms that a
removal-shaped prompt classifies as `REMOVAL`, not a mismatched intent, and resolves every
path this scenario declares under `expected_resources` — this scenario's set adds one checklist beyond `DEFAULT_RESOURCES`.

### Why This Matters

`REMOVAL` is the only intent whose `RESOURCE_MAP` entry is a planning template rather than a checklist: `assets/removal-plan.md`, which is *not* one of the five `DEFAULT_RESOURCES`. CR-R06 proves a removal-shaped prompt ("dead code", "cleanup", "deprecate") adds the removal-plan template on top of the ALWAYS-loaded baseline, giving the reviewer the safe-now-vs-deferred classification structure instead of a bare findings list.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CR-R06` classifies as `REMOVAL` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `REMOVAL` and every path in
  `expected_resources`.
- Real user request: `Review target proposes removing dead code and deprecating an obsolete code path.`
- Prompt: `Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.`

**Exact prompt**:
```text
Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.
```

- Expected execution process: the smart router matches the `REMOVAL` `INTENT_SIGNALS`
  keywords (`remove`, `dead code`, `cleanup`, `deprecate`) against the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-review/`, and the
  frontmatter `expected_intent` reads `REMOVAL`.
- Desired user-visible outcome: a review that classifies each removal as safe-now or deferred using the removal-plan template, on top of the baseline checks.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is
  `REMOVAL`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this cleanup plan to remove dead code and deprecate obsolete behavior safely.`

### Commands

1. `sed -n '1,18p' .opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/removal.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"REMOVAL"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"REMOVAL"'`
4. `for p in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md assets/removal-plan.md; do test -e ".opencode/skills/sk-code/sk-code-review/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: REMOVAL` and the full `expected_resources` list. Step 2 shows
the `REMOVAL` `INTENT_SIGNALS` entry (weight `3`) this scenario's prompt keywords
derive from. Step 3 shows the `RESOURCE_MAP["REMOVAL"]` entry this scenario's set is built
from. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the
`INTENT_SIGNALS["REMOVAL"]` and `RESOURCE_MAP["REMOVAL"]` excerpts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `REMOVAL`.
- **Fail**: any listed path is missing, or the frontmatter `expected_intent` disagrees with
  `REMOVAL`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed
   under `assets/` or `references/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["REMOVAL"]`
   excerpt — `assets/removal-plan.md` is additive beyond `DEFAULT_RESOURCES`, so a missing path here means the CONDITIONAL intent-specific load failed even if the ALWAYS-tier baseline is intact.

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
- Playbook ID: CR-R06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/removal.md`
