---
title: Frontmatter Description Budget Fixtures
description: Fixed input documents for the description-budget scenarios, so a trim is graded against the same text every time.
trigger_phrases:
  - "frontmatter description fixtures"
  - "over budget description fixture"
  - "description trim fixture"
  - "description budget scenario input"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Description budget fixtures

Two fixed inputs for the description-budget scenarios in this packet's playbook.

---

## 1. OVERVIEW

`over-budget-description.md` carries one description of 547 characters, written to hold every category on the drop list and every token on the keep list. `under-budget-trim-lost-tokens.md` carries the same description alongside a 56-character trim that satisfies the length check by deleting keep-list tokens.

Each fixture states its own character counts, so a run can be graded on the same numbers the next run sees.

---

## 2. WHICH SCENARIO USES WHICH

| Fixture | Scenario | What it supplies |
|---|---|---|
| [`over-budget-description.md`](over-budget-description.md) | `FMB-001` | The description to trim |
| [`under-budget-trim-lost-tokens.md`](under-budget-trim-lost-tokens.md) | `FMB-002` | The original and the trim to reject |

---

## 3. WHY THE SUBJECT SITS IN A FENCED BLOCK

Each fixture's own frontmatter is inside budget and passes every check this packet runs. The description under test is carried in the body, inside a fenced block. A fixture whose own frontmatter broke the rule would be a live defect in a shipped skill: the versioning engine, the document validators and any fleet-wide sweep all read it as a real document, and none of them can tell a deliberate fixture from a mistake.
