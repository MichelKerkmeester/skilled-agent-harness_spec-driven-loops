---
title: "Feature Specification: Phase 5: trim-duplicated-and-dead-agent-text"
description: "About a tenth of the agent text restates itself: a shared rule copied with small differences into every file, eight box-drawn summaries, and a third of `code.md` spent on two sections that repeat its rules. This phase removes the restatement without losing a rule."
trigger_phrases:
  - "trim duplicated and dead agent text"
  - "phase 5 trim duplicated and dead agent text"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: trim-duplicated-and-dead-agent-text

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/377-agent-contract-and-registry-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-agent-template-conformance-and-drift-check |
| **Successor** | 006-codex-persona-tool-mapping |
| **Handoff Criteria** | Every removed block is mapped to the line that still carries its rule, and the word count is at or below the target |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the agent contract and registry alignment packet.

**Scope Boundary**: Text that repeats a rule already stated in the same file, and the one block that every file shares. A rule stated once stays where it is.

**Dependencies**:
- Phase 4, because it moves the shared advisor block into its own section and adds the outline check this phase extends.

**Deliverables**:
- A removal map showing, for each removed block, the line that still carries its rule or why it carried none
- Eleven agent files without box-drawn summaries, with one identical copy of the shared advisor block
- A shorter `code.md` whose verification and anti-pattern sections state each rule once
- An amended agent template whose summary rule matches the files
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three-sentence advisor-context rule is copied into every agent file with small wording differences, so one edit means eleven. Eight files end with a box-drawn summary of 116 to 234 words that restates the file. In `code.md` the output verification and anti-pattern sections take 2,070 of 6,761 words and mostly repeat the rules section. A runtime loads the whole file on every dispatch, so each restated word is paid for every time and gives a later edit a second place to go stale.

### Purpose
Each agent file states each rule once, the one block all files share is identical everywhere and checked, and no rule is lost in the cut.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -l 'Treat hook-injected skill-advisor recommendations as routing hints only' .skilled/agents | wc -l
      10
$ rg -l '^│  AUTHORITY' .skilled/agents | wc -l
       8
$ cat .skilled/agents/*.md | wc -w
   52568
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write the removal map before any text is cut, one row per block, naming the surviving line or the reason the block carried no instruction
- Remove the eight box-drawn summaries and amend the agent template's summary rule to match
- Make the advisor-context block byte-identical in all eleven files and extend the outline check to compare it with the template's copy. A runtime loads one file at a time, so the block cannot be replaced by a reference
- Cut the output verification and anti-pattern sections of `code.md` to the statements its rules section does not already make
- Remove lines 429 to 437 of `context.md`, which repeat its query routing matrix

### Out of Scope
- Rewording a rule to make it shorter - a shorter rule is a changed rule and needs its own review
- Cutting text from `design.md`, `markdown.md`, `debug.md` or `prompt-improver.md` beyond the shared block and the summary - the audit found no restatement there
- Moving shared text into a file the agents load at runtime - no runtime here includes one file from another

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/agents/*.md` | Modify | Shared block made identical in eleven files, summaries removed from eight |
| `.skilled/agents/code.md` | Modify | Verification and anti-pattern sections cut to unique statements |
| `.skilled/agents/context.md` | Modify | Repeated routing list removed |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | Summary rule and the canonical advisor block |
| `.skilled/bin/sync-agent-roster.cjs` and its test | Modify | Shared-block comparison in `--check` mode |
| Six runtime trees | Regenerate | Copies of the changed agent files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | Every removed block has a row in the removal map naming the line that still carries its rule, or the reason it carried no instruction. |
| REQ-002 | A dispatched `code` agent still returns its full return contract after the cut. |
| REQ-003 | The runtime copies of the changed agent files match the canonical files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-004 | No agent file ends with a box-drawn summary. |
| REQ-005 | The advisor-context block is byte-identical in all eleven files and the check fails when one copy differs from the template's. |
| REQ-006 | The output verification and anti-pattern sections of `code.md` total 1,300 words or fewer. |
| REQ-007 | The eleven agent files total 50,000 words or fewer. |
| REQ-008 | The agent template's summary rule matches the files, so the outline check from phase 4 still passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `wc -w .skilled/agents/*.md` prints a total of 50000 or lower, down from 52,568.
- **SC-002**: `rg -l '^│  AUTHORITY' .skilled/agents` prints no path, down from 8.
- **SC-003**: `scratch/removal-map.md` has a row for every removed block and no row lacks a surviving line or a reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The agent template's summary rule | If the template keeps requiring a summary, the phase 4 check fails after the cut | The template is amended in the same commit as the first summary removal |
| Risk | A closing summary helps a model keep the file's limits in mind, and removing it changes behaviour | Med | One dispatch each of `context`, `review` and `code` is recorded before and after. A lost limit restores that agent's summary as an exception |
| Risk | A statement in the anti-pattern section looks like a repeat but adds a case the rule does not name | High | The removal map quotes both lines side by side, and a statement with no exact counterpart stays |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The eleven files total 50,000 words or fewer, so every dispatch loads less text than today.

### Security
- **NFR-S01**: No permission line and no write-boundary rule is removed. `git diff main -- .skilled/agents` shows no deleted line containing `deny`.

### Reliability
- **NFR-R01**: A removed block is restored from `scratch/removal-map.md`, which quotes it in full.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: Empty input: `design.md` and `orchestrate.md` have no box-drawn summary, so only their shared block is touched.
- Maximum input: Maximum input: `code.md` loses the most text, about 770 words, and gets the dispatch test in REQ-002.
- Failure path: Failure path: a statement with no exact counterpart is kept and marked `kept, unique` in the removal map.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 12/25 | Eleven agent files, one template, one script, about 2,600 words removed |
| Risk | 16/25 | Text that shapes what every agent does on every dispatch |
| Research | 8/20 | Side-by-side reading of three sections in `code.md` |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the summaries go at all? They restate the file, yet a closing recap may help a model hold its limits. Operator answer: remove them and test three agents before and after (2026-11-14). An agent that loses a limit gets its summary back as a named exception.
- Is 50,000 words the right target? It is the measured total less the blocks named in scope, about 2,600 words. Decision: keep it as a ceiling, not a goal. No rule is cut to reach it.
<!-- /ANCHOR:questions -->

---


