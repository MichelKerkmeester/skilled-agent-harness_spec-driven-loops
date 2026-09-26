---
title: "Goal Exemplars"
description: "Cited goal passages that show where objective and completion-criteria checks pass or fail."
trigger_phrases:
  - "goal exemplars"
  - "goal rubric examples"
  - "goal objective failures"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Goal Exemplars

## 1. OVERVIEW

These excerpts show how the authoring rubric classifies goal text. Each quote stays here so the example remains readable if its source moves. The cited line identifies the original passage.

The rubric labels the named check as FAIL or PASS. The positive example passes the objective check only. Its classification does not claim that every part of its goal passes every standard.

---

## 2. TEMPLATE OBJECTIVE PLACEHOLDER

Excerpt: "**Objective:** [One sentence. What this packet is for. Not how, not progress.]" (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite/goal.md:43`)

Standard: Objective.

Rubric outcome: FAIL. This is an instruction placeholder, not a sentence that states the packet's purpose.

---

## 3. CRITERION DEPENDS ON OTHER FILES

Excerpt: "Every phase reports its acceptance criteria closeable" (`specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:89`)

Standard: Completion criteria.

Rubric outcome: FAIL. A reader must inspect phase evidence elsewhere to decide whether every phase is closeable. The criterion does not state a self-contained result.

---

## 4. CHILD COUNT DISAGREES WITH THE BINDING TABLE

Excerpt: "for the parent and all six children" (`specs/sk-git/028-crawlable-commit-history/goal.md:111`)

The same goal has eight binding rows, covering child paths from `001-research` through `008-second-pass-subjects-and-attribution` (`specs/sk-git/028-crawlable-commit-history/goal.md:83-90`).

Standard: Completion criteria.

Rubric outcome: FAIL. The criterion names six children while the binding table names eight. Its declared scope does not match the goal's own table.

---

## 5. PHASE-CHILD OBJECTIVE STATES ITS PURPOSE

Excerpt: "Produce ten iterations of evidence-cited research on a numbered, searchable commit grammar for sk-git, on how a per-commit identifier is minted without collisions across branches, and on how 9,106 commits are rewritten and their citations remapped safely." (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:43`)

Standard: Objective.

Rubric outcome: PASS for the objective check. The sentence names the work this phase exists to produce and does not report progress. This is an objective-only pass.

---

## 6. SUPPORTING CHECKS IN THE SAME GOAL

These excerpts illustrate the other standards. They are not a full-goal pass.

- Decisions: "Frozen choices. Changing one is an amendment." (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:47`) The decision table states choices a reader can test. One example is "This phase produces findings only. No file outside research/ changes." (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:53`).
- Criteria: "research/lineages/deepseek/deep-research-state.jsonl holds 10 iteration records" (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:75`) names an artifact and a count.
- Log: "## 4. LOG" (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:84`) and the excerpt "| Phase opened | Pending | |" (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:94`) show the volatile log heading and its progress row.
- Voice: "This phase produces findings only. No file outside research/ changes." (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:53`) uses direct wording and states a specific boundary.
