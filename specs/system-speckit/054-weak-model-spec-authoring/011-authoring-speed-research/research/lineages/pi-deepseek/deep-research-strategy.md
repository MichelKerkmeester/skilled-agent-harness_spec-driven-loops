---
title: Deep Research Strategy - spec authoring speed (packet 054 phase 011)
description: Strategy file for the deep-research lineage that measures where spec-kit authoring time goes and ranks speed changes by quality risk.
trigger_phrases:
  - "spec authoring speed research"
  - "authoring time per level"
  - "spec kit upkeep cost"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - spec authoring speed

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration; sections 3, 6 and 7-11A are rewritten by the reducer.

### Usage

- Init populates Topic, Key Questions, Known Context, and Boundaries.
- Each iteration reads Next Focus, writes iteration evidence, and the reducer refreshes the machine-owned sections.

---

## 2. TOPIC

Where AI models spend time writing and maintaining spec-kit docs, and which concrete changes make spec authoring and upkeep faster than before packet 054 while keeping the quality, adherence and clarity 054 added. Covered surfaces: template and fill-note length per level, the authoring card, task Verify clauses, required sections and level selection, validation gates and their fix loops, derived metadata refresh after every doc edit (description.json, graph-metadata.json fingerprints), continuity saves, checklists and acceptance criteria. Each change is ranked by time saved against quality risk, names the file it touches, and flags planning ceremony that small work does not need.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How much text does each level's template and fill guidance add to a finished packet, measured as template bytes and required sections against completed-document bytes?
- [x] Which validation gates and their fix loops consume the most per-edit iteration time, and what does each gate buy in quality?
- [x] What does the level-selection and required-section path cost on small work, and which sections are ceremony rather than protection?
- [x] What do task Verify clauses, acceptance criteria checklists and the authoring card cost to author, and where do they prevent rework?
- [x] Which derived-metadata refreshes after a doc edit (description.json, graph-metadata.json fingerprints, continuity saves) are mandatory, and which are pure overhead per edit?
- [x] Which ranked changes save the most time per unit of quality risk, and which file does each touch?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement the ranked changes here. Findings only; implementation is a separate packet.
- Do not re-litigate the quality, adherence and clarity controls packet 054 added; measure their cost, do not remove them on evidence-free grounds.
- Do not propose replacing the spec-folder workflow itself, and do not evaluate model quality.

---

## 5. STOP CONDITIONS

- Hard cap: 5 iterations (stop policy max-iterations, so every iteration runs).
- An iteration that cannot cite a file path and line for its claims is widened rather than counted.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How much text does each level's template and fill guidance add to a finished packet, measured as template bytes and required sections against completed-document bytes?
- Which validation gates and their fix loops consume the most per-edit iteration time, and what does each gate buy in quality?
- What does the level-selection and required-section path cost on small work, and which sections are ceremony rather than protection?
- What do task Verify clauses, acceptance criteria checklists and the authoring card cost to author, and where do they prevent rework?
- Which derived-metadata refreshes after a doc edit (description.json, graph-metadata.json fingerprints, continuity saves) are mandatory, and which are pure overhead per edit?
- Which ranked changes save the most time per unit of quality risk, and which file does each touch?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Claiming the recommender's Level 0 is a dead end without reading the card first: the card author documents the bridge to `--level 1`, so Level 0 is a naming gap rather than a broken path. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Claiming the recommender's Level 0 is a dead end without reading the card first: the card author documents the bridge to `--level 1`, so Level 0 is a naming gap rather than a broken path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming the recommender's Level 0 is a dead end without reading the card first: the card author documents the bridge to `--level 1`, so Level 0 is a naming gap rather than a broken path.

### Counting guidance volume as a proxy for authoring cost at Level 3: the level-3 example already demonstrates 42 tasks with no Verify lines, so the cost there is a behaviour gap, not a text-volume gap. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Counting guidance volume as a proxy for authoring cost at Level 3: the level-3 example already demonstrates 42 tasks with no Verify lines, so the cost there is a behaviour gap, not a text-volume gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting guidance volume as a proxy for authoring cost at Level 3: the level-3 example already demonstrates 42 tasks with no Verify lines, so the cost there is a behaviour gap, not a text-volume gap.

### Counting guidance volume from raw template bytes without applying level gates: the gates remove a third of the spec at L1, so raw counts would overstate Level-1 cost by roughly 46% on spec alone. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting guidance volume from raw template bytes without applying level gates: the gates remove a third of the spec at L1, so raw counts would overstate Level-1 cost by roughly 46% on spec alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting guidance volume from raw template bytes without applying level gates: the gates remove a third of the spec at L1, so raw counts would overstate Level-1 cost by roughly 46% on spec alone.

### Looking for a per-change time measurement beyond the one benchmark brief series: no other authoring session in the repository was timed, so every saving outside the fill-note result is inferred from volume, round count or section count. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a per-change time measurement beyond the one benchmark brief series: no other authoring session in the repository was timed, so every saving outside the fill-note result is inferred from volume, round count or section count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-change time measurement beyond the one benchmark brief series: no other authoring session in the repository was timed, so every saving outside the fill-note result is inferred from volume, round count or section count.

### Looking for a per-rule remediation table: no mapping from rule id to fix instruction exists in the authoring card, which is why a failure sends the author into the 42,755-byte validation reference. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a per-rule remediation table: no mapping from rule id to fix instruction exists in the authoring card, which is why a failure sends the author into the 42,755-byte validation reference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-rule remediation table: no mapping from rule id to fix instruction exists in the authoring card, which is why a failure sends the author into the 42,755-byte validation reference.

### Looking for a Verify-clause example anywhere in the addon templates: the acceptance-criteria template carries a verification column but no task-level example, so the model has no worked `Verify:` line to copy. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a Verify-clause example anywhere in the addon templates: the acceptance-criteria template carries a verification column but no task-level example, so the model has no worked `Verify:` line to copy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a Verify-clause example anywhere in the addon templates: the acceptance-criteria template carries a verification column but no task-level example, so the model has no worked `Verify:` line to copy.

### Measuring the fix loop by running the validator here: the packet's own validator is out of this lineage's write authority, so the loop is priced from the documented contract and the benchmark's round counts instead. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Measuring the fix loop by running the validator here: the packet's own validator is out of this lineage's write authority, so the loop is priced from the documented contract and the benchmark's round counts instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring the fix loop by running the validator here: the packet's own validator is out of this lineage's write authority, so the loop is priced from the documented contract and the benchmark's round counts instead.

### Proposing a rewrite of the validator rule set: 16 of 41 rules police derived files, but each has a writer, and the cost is the round trips, not the rule count. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Proposing a rewrite of the validator rule set: 16 of 41 rules police derived files, but each has a writer, and the cost is the round trips, not the rule count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing a rewrite of the validator rule set: 16 of 41 rules police derived files, but each has a writer, and the cost is the round trips, not the rule count.

### Ranking the single-document quick packet first on raw saving: it removes a protection surface, so it loses to changes that save less and risk less. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Ranking the single-document quick packet first on raw saving: it removes a protection surface, so it loses to changes that save less and risk less.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking the single-document quick packet first on raw saving: it removes a protection surface, so it loses to changes that save less and risk less.

### Reading the refresh as free: it is cheap per run but it is a second write to two files per packet, so it is counted as churn and merge risk, not as compute. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading the refresh as free: it is cheap per run but it is a second write to two files per packet, so it is counted as churn and merge risk, not as compute.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the refresh as free: it is cheap per run but it is a second write to two files per packet, so it is counted as churn and merge risk, not as compute.

### Recommending that authors run `repair-derived.cjs` after each document edit: the save already refreshes the same files, and the repair CLI's dry-run contract exists for structural moves, not for prose edits. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Recommending that authors run `repair-derived.cjs` after each document edit: the save already refreshes the same files, and the repair CLI's dry-run contract exists for structural moves, not for prose edits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending that authors run `repair-derived.cjs` after each document edit: the save already refreshes the same files, and the repair CLI's dry-run contract exists for structural moves, not for prose edits.

### Recommending that authors run the metadata repair CLI after each edit: the save already refreshes those files. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Recommending that authors run the metadata repair CLI after each edit: the save already refreshes those files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending that authors run the metadata repair CLI after each edit: the save already refreshes those files.

### Searching for a documented "refresh only packets whose prose changed" mode in the repair tooling: the CLI takes explicit folders and roots, and no timestamp or hash filter exists, so the loop stays explicit. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching for a documented "refresh only packets whose prose changed" mode in the repair tooling: the CLI takes explicit folders and roots, and no timestamp or hash filter exists, so the loop stays explicit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a documented "refresh only packets whose prose changed" mode in the repair tooling: the CLI takes explicit folders and roots, and no timestamp or hash filter exists, so the loop stays explicit.

### Searching for a per-level authoring-time measurement inside the packet: no wall-clock authoring session exists in the repository, so time must be inferred from volume and fix-loop counts and has to be labelled as inference. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a per-level authoring-time measurement inside the packet: no wall-clock authoring session exists in the repository, so time must be inferred from volume and fix-loop counts and has to be labelled as inference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a per-level authoring-time measurement inside the packet: no wall-clock authoring session exists in the repository, so time must be inferred from volume and fix-loop counts and has to be labelled as inference.

### Treating `validate.sh --strict` passing as evidence of packet quality: two independent measured gaps (placeholder warnings at Draft, anchors not checked) put the recurring failure mode outside the gate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `validate.sh --strict` passing as evidence of packet quality: two independent measured gaps (placeholder warnings at Draft, anchors not checked) put the recurring failure mode outside the gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `validate.sh --strict` passing as evidence of packet quality: two independent measured gaps (placeholder warnings at Draft, anchors not checked) put the recurring failure mode outside the gate.

### Treating the continuity fingerprint as a live cost: it is opt-in and inert today, so pricing it as current overhead would overstate the time saved. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the continuity fingerprint as a live cost: it is opt-in and inert today, so pricing it as current overhead would overstate the time saved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the continuity fingerprint as a live cost: it is opt-in and inert today, so pricing it as current overhead would overstate the time saved.

### Using the LOC targets as a time proxy: they are soft guidance, internally inconsistent at L3/L3+, and not enforced by any validator, so a time estimate built on them would be a guess wearing a number. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Using the LOC targets as a time proxy: they are soft guidance, internally inconsistent at L3/L3+, and not enforced by any validator, so a time estimate built on them would be a guess wearing a number.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the LOC targets as a time proxy: they are soft guidance, internally inconsistent at L3/L3+, and not enforced by any validator, so a time estimate built on them would be a guess wearing a number.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Counting guidance volume from raw template bytes without applying level gates: the gates remove a third of the spec at L1, so raw counts would overstate Level-1 cost by roughly 46% on spec alone. (iteration 1)
- Searching for a per-level authoring-time measurement inside the packet: no wall-clock authoring session exists in the repository, so time must be inferred from volume and fix-loop counts and has to be labelled as inference. (iteration 1)
- Using the LOC targets as a time proxy: they are soft guidance, internally inconsistent at L3/L3+, and not enforced by any validator, so a time estimate built on them would be a guess wearing a number. (iteration 1)
- Looking for a per-rule remediation table: no mapping from rule id to fix instruction exists in the authoring card, which is why a failure sends the author into the 42,755-byte validation reference. (iteration 2)
- Measuring the fix loop by running the validator here: the packet's own validator is out of this lineage's write authority, so the loop is priced from the documented contract and the benchmark's round counts instead. (iteration 2)
- Treating `validate.sh --strict` passing as evidence of packet quality: two independent measured gaps (placeholder warnings at Draft, anchors not checked) put the recurring failure mode outside the gate. (iteration 2)
- Claiming the recommender's Level 0 is a dead end without reading the card first: the card author documents the bridge to `--level 1`, so Level 0 is a naming gap rather than a broken path. (iteration 3)
- Counting guidance volume as a proxy for authoring cost at Level 3: the level-3 example already demonstrates 42 tasks with no Verify lines, so the cost there is a behaviour gap, not a text-volume gap. (iteration 3)
- Looking for a Verify-clause example anywhere in the addon templates: the acceptance-criteria template carries a verification column but no task-level example, so the model has no worked `Verify:` line to copy. (iteration 3)
- Reading the refresh as free: it is cheap per run but it is a second write to two files per packet, so it is counted as churn and merge risk, not as compute. (iteration 4)
- Recommending that authors run `repair-derived.cjs` after each document edit: the save already refreshes the same files, and the repair CLI's dry-run contract exists for structural moves, not for prose edits. (iteration 4)
- Searching for a documented "refresh only packets whose prose changed" mode in the repair tooling: the CLI takes explicit folders and roots, and no timestamp or hash filter exists, so the loop stays explicit. (iteration 4)
- Treating the continuity fingerprint as a live cost: it is opt-in and inert today, so pricing it as current overhead would overstate the time saved. (iteration 4)
- Looking for a per-change time measurement beyond the one benchmark brief series: no other authoring session in the repository was timed, so every saving outside the fill-note result is inferred from volume, round count or section count. (iteration 5)
- Proposing a rewrite of the validator rule set: 16 of 41 rules police derived files, but each has a writer, and the cost is the round trips, not the rule count. (iteration 5)
- Ranking the single-document quick packet first on raw saving: it removes a protection surface, so it loses to changes that save less and risk less. (iteration 5)
- Recommending that authors run the metadata repair CLI after each edit: the save already refreshes those files. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- The final ranked change list. (iteration 1)
- What Verify clauses, acceptance criteria and the authoring card cost to author. (iteration 1)
- Which derived-metadata refreshes are mandatory per edit. (iteration 1)
- What the level-selection and required-section path costs on small work. (iteration 1)
- Which validation gates and their fix loops consume the most per-edit time. (iteration 1)
- None outstanding for the ranked list. The residual is evidence class: only the fill-note wall-clock effect is measured directly, and the rest are inferred from volume and round counts. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Prior context is none for this packet beyond the packet docs themselves. The bounded snapshot below records what this lineage already knows when iteration 1 starts.

### Bounded Context Snapshot

- Source pointers:
  - `specs/system-speckit/054-weak-model-spec-authoring/spec.md` (phase parent, packet 054 goal)
  - `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/spec.md` (this phase)
  - `.skilled/skills/system-spec-kit/templates/` (core, addons, packet-types, examples)
  - `.skilled/skills/system-spec-kit/references/` (templates, structure, validation, workflows, memory)
  - `.skilled/skills/system-spec-kit/runtime/cli/` (create.sh, validate.sh, recommend-level.sh, generate-context, description/graph metadata)
- Reuse candidates: the existing level examples as the measured baseline, the authoring card as the operator-facing surface, and the reducer-owned research artifacts as the reporting shape.
- Integration points: phase 009 benchmark reports already hold measured authoring numbers; 054 feature-catalog entries record the controls this research must preserve.
- Constraints and risks: no operator, no wall-clock authoring sessions to sample, so time cost is inferred from structural volume and fix-loop counts and must be labelled as inference.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output in this lineage directory
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-10-25T21:23:12Z
