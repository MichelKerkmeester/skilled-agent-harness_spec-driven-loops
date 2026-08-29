---
id: CR-R03
category: intra_routing_recall
stage: routing
title: 'KISS routing'
description: "This scenario validates KISS routing for `CR-R03`. It confirms a simplicity-shaped prompt classifies as `KISS` and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: KISS
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.0.0.0
---

# CR-R03: KISS routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R03`.

---

## 1. OVERVIEW

This scenario validates KISS routing for `CR-R03`. It confirms that a
simplicity-shaped prompt classifies as `KISS`, not a mismatched intent, and resolves every
path this scenario declares under `expected_resources` — this scenario's set already carries the intent-specific checklist via `DEFAULT_RESOURCES`.

### Why This Matters

`KISS` shares its `RESOURCE_MAP` target, `assets/code-quality-checklist.md`, with `QUALITY` and `DRY` - the same checklist carries correctness, simplicity, and duplication checks together. CR-R03 proves a simplicity-shaped prompt ("over-engineered", "KISS") still resolves that shared checklist, and that the architecture lens from `SKILL.md` §1's Unknown Fallback Checklist ("KISS/DRY/SOLID strict or optional") stays attached to the resolved intent rather than being silently dropped.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CR-R03` classifies as `KISS` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `KISS` and every path in
  `expected_resources`.
- Real user request: `Review target looks more complicated than the problem it solves.`
- Prompt: `Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.`

**Exact prompt**:
```text
Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.
```

- Expected execution process: the smart router matches the `KISS` `INTENT_SIGNALS`
  keywords (`kiss`, `simple`, `simplicity`, `over-engineer`, `overengineering`) against the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-review/`, and the
  frontmatter `expected_intent` reads `KISS`.
- Desired user-visible outcome: a review that flags unnecessary complexity using the shared code-quality checklist without losing correctness coverage.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is
  `KISS`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this implementation for KISS, simplicity, and signs that it is over-engineered or overengineering the solution.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/kiss.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"KISS"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"KISS"'`
4. `for p in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-review/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: KISS` and the full `expected_resources` list. Step 2 shows
the `KISS` `INTENT_SIGNALS` entry (weight `3`) this scenario's prompt keywords
derive from. Step 3 shows the `RESOURCE_MAP["KISS"]` entry this scenario's set is built
from. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the
`INTENT_SIGNALS["KISS"]` and `RESOURCE_MAP["KISS"]` excerpts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `KISS`.
- **Fail**: any listed path is missing, or the frontmatter `expected_intent` disagrees with
  `KISS`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed
   under `assets/` or `references/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["KISS"]`
   excerpt — KISS, DRY, and QUALITY all resolve to the same `assets/code-quality-checklist.md` entry, so a missing path here is a shared-checklist regression, not a KISS-only one.

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
- Playbook ID: CR-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/kiss.md`
