---
title: "Feature Specification: Phase 4: agents-md-pointers"
description: "AGENTS.md section 10 lists four close-out items while the repo rules now list five, and the copy a session reads on a read-only turn is the stale one. The audit finds one clause that a Gate 6 rule can own, so the list moves to communication-handoff.md and AGENTS.md keeps a one-line pointer."
trigger_phrases:
  - "agents md pointers"
  - "phase 4 agents md pointers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: agents-md-pointers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/004-agents-md-pointers` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-deep-review-case-rule |
| **Successor** | 005-hook-stdin-deadlines |
| **Handoff Criteria** | AGENTS.md section 10 points to communication-handoff.md section 1, which holds the five-part status. The rule-copy canary, the repo-rule checker and every AGENTS.md consumer test pass, and only three tracked files changed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Round two follow-ups specification.

**Scope Boundary**: The close-out bullet in AGENTS.md section 10 and the two repo rule files that carry the status list. Every other AGENTS.md clause is audited and, with one exception, kept.

**Dependencies**:
- `../spec.md` decision D3: AGENTS.md drops a clause only when a rule that loads in every situation the clause binds already carries it, and the rule-copy canary anchors and the 16,384-byte prefix stay intact.
- `../../008-round-two-recommendations/005-rule-amendments/`, which added the fifth close-out item to `evidence-and-proof.md` and left AGENTS.md at four.

**Deliverables**:
- An audit of every AGENTS.md clause with a KEEP or POINTER decision and a reason, in `plan.md`
- One owner for the five-part status list that loads on every turn end, and a one-line AGENTS.md pointer to it
- A second pointer in `evidence-and-proof.md` section 10 so the list is written down once
- Version bumps on both rule files and a recorded operator hand-off for the global instruction file

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
AGENTS.md section 10 (line 296) lists four close-out items. `.skilled/repo-rules/evidence-and-proof.md` section 10 now lists five, the fifth being known residual risk, so the copy that loads on every turn is the stale one. The obvious fix, a pointer to `evidence-and-proof.md`, fails the binding test: that file loads only through Gate 5 on the first write of a session, and a review, audit or explanation turn writes nothing, so the pointer would lead to a file that is not in context when the clause binds.

### Purpose
The five-part status lives in one rule file that Gate 6 loads before every turn ends, and AGENTS.md section 10 names that file in one line.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit AGENTS.md clause by clause against the rule files and decide KEEP or POINTER for each, with the load condition that decides it
- Move the five-part status list into `communication-handoff.md` section 1, which Gate 6 loads before a turn ends, and add one self-check line there
- Replace the list in `evidence-and-proof.md` section 10 with a pointer, keeping its not-done paragraph
- Replace the AGENTS.md section 10 close-out bullet with a one-line pointer that is no longer than the line it replaces
- Bump both rule file versions in the fourth segment, as the repo-rule contract asks
- Record the operator hand-off for the global instruction file in `implementation-summary.md`

### Out of Scope
- Any AGENTS.md clause other than line 296: the audit keeps them, each with a reason, and a gate, hard blocker, delivery-prefix anchor or unconditional standard never moves
- The global `~/.claude/CLAUDE.md`: it is the operator's file, and it is a symlink to the main checkout's AGENTS.md, so it is never edited here
- `REPO RULES.md` and the trigger index: both stay unchanged, because no firing condition changes
- Every consumer of AGENTS.md text (check-rule-copies.js and its self-test, sync-gate1-pointers.cjs, the vitest and pytest files): read and run only, never edited
- The Hermes generator in write mode: no SKILL.md or agent file changes, and the orchestrator runs it once after every build
- Everything under `../../001-ponytail-deep-research/research/`, which another agent is writing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Section 10 close-out bullet (line 296) becomes a one-line pointer to `communication-handoff.md` section 1 |
| `.skilled/repo-rules/communication-handoff.md` | Modify | Section 1 owns the five-part status, section 8 gains one self-check line, version 1.6.0.4 becomes 1.6.0.5 |
| `.skilled/repo-rules/evidence-and-proof.md` | Modify | Section 10 swaps the five-item list for a pointer to the owner, version 1.1.1.3 becomes 1.1.1.4 |
| `implementation-summary.md` | Modify | Build record, decision verdicts, operator hand-off and limitations |
| `tasks.md` | Modify | Task checkboxes and evidence |
| `goal.md` | Modify | Log rows |
| `scratch/` | Create | Before copies, check outputs and scope baselines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | AGENTS.md section 10 holds no four-item list and points to the owner of the five-item list. No other AGENTS.md line changes, and the file is no larger than before. | `diff scratch/before/AGENTS.md AGENTS.md` shows only `296c296`, the new line names `.skilled/repo-rules/communication-handoff.md` and section 1, and `wc -c AGENTS.md` is at most 27266 |
| REQ-002 | `communication-handoff.md` section 1 holds all five status parts, and `evidence-and-proof.md` section 10 points to it instead of listing them. Both versions move one step in the fourth segment. | Five numbered parts at `communication-handoff.md` lines 67 to 72, no `Known residual risk.` item left in `evidence-and-proof.md`, versions 1.6.0.5 and 1.1.1.4 |
| REQ-003 | The delivery-prefix canary and its self-test pass, and the prefix report still lists all 21 anchors under 16,384 bytes with the same end bytes as before | `check-rule-copies.js` exits 0 with `21 delivery-prefix anchor(s)`, the self-test prints `All rule-canary test cases passed`, and the prefix report equals the saved one |
| REQ-004 | The repo-rule contract holds: the corpus checker passes, the added lines follow the house prose rule, and no Fires-when section changed | `check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)`, the prose scan of added lines prints nothing, and the Fires-when diffs print nothing |
| REQ-005 | Every AGENTS.md consumer stays green | `sync-gate1-pointers.cjs --check` exits 0, the three vitest files report 12 tests passed, and the two pytest files report 13 passed |
| REQ-006 | Only the three tracked files change, and the global `~/.claude/CLAUDE.md` is untouched | `git status --porcelain` over the guarded paths shows exactly three ` M` lines, and `ls -l ~/.claude/CLAUDE.md` still shows the symlink |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The audit in `plan.md` gives every AGENTS.md clause a KEEP or POINTER decision, every KEEP a reason, and every POINTER is applied | The row count, the POINTER count of 1 and the `296c296` diff agree |
| REQ-008 | `implementation-summary.md` records the operator hand-off for the global instruction file, with the symlink fact | The summary names `~/.claude/CLAUDE.md`, the symlink target and the one action that belongs to the operator |
| REQ-009 | No index or mirror work is needed: the trigger index does not carry the rule files, and the Hermes copy check is recorded | `rg -c -F '.skilled/repo-rules/' trigger-index.json` prints nothing and exits 1, and the Hermes `--check` result is in the summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five-part status is written in exactly one file, and a search for its fifth item finds only `communication-handoff.md`
- **SC-002**: The pointer's claim is true: Gate 6 in AGENTS.md lists `communication-handoff.md` as loaded before ending a turn
- **SC-003**: No count word for the close-out list ("things, briefly", "five parts") remains in AGENTS.md or the rule files, so no number can drift against the list
- **SC-004**: This folder passes the placeholder search, `check-goal.cjs` and `validate.sh --strict`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gate 6 loads `communication-handoff.md` before a turn ends (AGENTS.md line 106) | The pointer would be dead if that line changed | SC-002 reads line 106 after the build |
| Risk | The Blast-Radius Management anchor ends at byte 16,373, 11 bytes under the 16,384 prefix | Any added byte before it fails the canary | The only AGENTS.md edit is line 296, past every anchor, and it removes 14 bytes |
| Risk | `communication-handoff.md` grows from 198 to 210 lines and enters the 201 to 250 band | The contract asks a rule at the limit to say why it needs the room | Content moved down from AGENTS.md is the reason the contract names, and it is recorded in the summary |
| Risk | Rule files are symlinked into sibling repositories | Their AGENTS.md copies keep their own close-out text | Recorded as a limitation; those copies were already out of step before this phase |
| Risk | The global `~/.claude/CLAUDE.md` is a symlink to the main checkout's AGENTS.md | A copy step would write through the symlink into the main checkout | The builder never touches it, and the operator action is to land this branch in the main checkout |
| Risk | Other children build in parallel in the same worktree | A shared-path edit could collide | The three files are disjoint from the other four children, and the scope check compares against a baseline saved first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The orchestrator answered all four on 2026-10-10, before the build:
- **Q1, answered: confirmed.** `communication-handoff.md` section 1 owns the five-part status, because Gate 6 loads it before every turn ends, read-only turns included; a pointer straight to `evidence-and-proof.md` is rejected because that file loads only through Gate 5.
- **Q2, answered: confirmed.** `evidence-and-proof.md` section 10 shrinks to a pointer, so the list has one copy and cannot drift again; the two EVIDENCE edits in `tasks.md` stay.
- **Q3, answered: no copy.** `~/.claude/CLAUDE.md` is a symlink to the main checkout's `AGENTS.md`, so the change reaches it when the branch lands; the summary records the symlink fact.
- **Q4, answered: keep.** The Goal Posture clause restates a skill reference that loads only when its skill is routed, while the clause binds every turn; a pointer pass over skill references would be a separate fix.
<!-- /ANCHOR:questions -->

---

