---
title: "Goal Authoring Standards"
description: "Reader checks for goal objectives, decisions, completion criteria, logs and voice."
trigger_phrases:
  - "goal authoring standards"
  - "goal objective check"
  - "goal criteria checkability"
  - "goal log and voice"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Goal Authoring Standards

## 1. OVERVIEW

The goal template defines the structure. These checks ask whether an authored goal states its purpose and records fixed choices. They also give a reader a way to judge completion. The [Human Voice Rules](../../sk-create-with-human-voice/references/hvr-rules.md) govern the prose.

---

## 2. OBJECTIVE

Rule: Write one sentence that says what the packet exists to accomplish. State its purpose. Leave methods and progress out.

Failure it prevents: A template placeholder or work update does not tell the reader what the packet is for.

Reader check: Can you tell what the packet exists to accomplish from this sentence alone, without reading a method or progress report? Yes or no.

Example: "Produce ten iterations of evidence-cited research on a numbered, searchable commit grammar for sk-git, on how a per-commit identifier is minted without collisions across branches, and on how 9,106 commits are rewritten and their citations remapped safely." (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:43`)

---

## 3. DECISIONS

Rule: Record the frozen choices that later work must honor. State each so a reader can test work against it. Changing a choice requires an amendment.

Failure it prevents: Unstated or movable choices let later work drift without a visible decision to change.

Reader check: Can you test later work against each listed choice, and would changing one require an amendment? Yes or no.

Example: "This phase produces findings only. No file outside research/ changes." (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:53`)

---

## 4. COMPLETION CRITERIA

Rule: Write three to seven criteria. Each criterion resolves to one observable result. It may state a command's exit code or a count. It may instead name an artifact. Keep every criterion checkable without opening another file, then copy the criteria verbatim into the objective.

Failure it prevents: A vague criterion or a check that depends on another file leaves completion open. A count that conflicts with the declared scope gives two different completion targets.

Reader check: Does the goal contain three to seven self-contained criteria with an explicit result, and does the objective repeat them verbatim? Yes or no.

Example: "research/lineages/deepseek/deep-research-state.jsonl holds 10 iteration records" (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:75`). This criterion names an artifact and a count.

---

## 5. LOG

Rule: Record progress, evidence, deviations and findings only in the volatile log below the durable slice. Keep temporary status out of the objective, decisions and criteria.

Failure it prevents: Progress in the durable directive becomes stale as the work changes and can mislead a later reader about the packet's purpose or completion.

Reader check: Are all progress updates, evidence, deviations and findings below the log heading, with none in the durable directive? Yes or no.

Example: The progress row "| Phase opened | Pending | |" appears in the log (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:94`).

---

## 6. VOICE

Rule: Apply the Human Voice Rules to every sentence you author. Use plain, direct wording and support claims with specific evidence. Link to the voice standard instead of copying it here.

Failure it prevents: Vague or inflated prose hides what the packet requires and weakens the reader's ability to test its claims.

Reader check: Does each authored sentence read plainly under the Human Voice Rules, with claims backed by specific evidence? Yes or no.

Example: "This phase produces findings only. No file outside research/ changes." (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:53`)
