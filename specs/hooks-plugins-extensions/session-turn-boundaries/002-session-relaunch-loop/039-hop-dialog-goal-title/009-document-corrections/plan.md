---
title: "Implementation Plan: Phase 9: document-corrections"
description: "Correct five session relaunch documents from the 2026-11-13 research, keep every fact tied to a saved command output or a commit, and prove each folder with strict validation. No code and no test changes."
trigger_phrases:
  - "document corrections plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: document-corrections

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents, JSON derived metadata and three text evidence files |
| **Framework** | None |
| **Storage** | The packet documents, the sk-git skill, two manual playbooks and `scratch/` |
| **Testing** | `validate.sh --strict`, `check-goal.cjs`, `goal.cjs packet` and the saved suite runs |

### Overview
Five document groups are corrected. The 002 parent goal gains binding rows for phases 038 and 039. Phase 033 is marked Complete. The sk-git rebase sentence and two limitation rows in the 038 child 011 summary match the code. Two playbooks name real test cases and use `cp`. The proof is the saved command output in `scratch/`, the commit stat and strict validation of every touched folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The 2026-11-13 research names all five defects in section 6 and section 9 ranks 11, 12, 13, 17 and 23

### Definition of Done
- [x] All acceptance criteria met
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first document correction.

### Key Components
- **The 002 parent goal**: binds the two phase goals that hold a `goal.md` and keeps the recorded exception for the phases that do not. Without the rows, 038 and 039 have no binding target.
- **The phase 033 status and goal**: state Complete only where the recursive validation and the saved runs prove it. Criterion 4 stays open because no `relaunch.log` line exists.
- **The sk-git skill sentence**: tells a reader what the commit hook does on a rebase, so a lost id is expected and not treated as a defect.
- **The 038 child 011 summary**: states the two live facts that were recorded after the build, so a reader does not repeat a finished check.
- **The two playbooks**: name cases that exist once in their test files and use a copy where a symbolic link fails.

### Data Flow
The research names a defect and its evidence. The editor reads the current document and the source or saved run, writes the smallest sentence that matches, and saves the command output under `scratch/`. Validation then reads each folder, and the commit carries the document changes and the derived metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `002-session-relaunch-loop/goal.md` | Holds the binding table and the durable decisions | update | `scratch/goal-002-parent.txt` shows 3,993 characters, `packet_budget=ok` and 22 missing rows under the exception |
| `033-research-remediation/spec.md` and `goal.md` | State the phase status and its five criteria | update | `scratch/validate-033.txt` shows ten PASSED lines, and the goal log names criteria 1, 2, 3 and 5 |
| `.skilled/skills/sk-git/SKILL.md:322` | States the commit-id rule for a rebase | update | `rg -n 'A rebase keeps an id only' .skilled/skills/sk-git/SKILL.md` prints line 322 |
| `038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md` | Records the live permission-mode facts | update | Rows 1 and 3 name `scratch/live-checks.md` and the test `a live default permission mode replaces the launch mode` |
| Two manual playbooks | Name the cases a manual run follows | update | Every named case exists once in its test file, and the versions read 1.0.23.0 and 1.0.22.0 |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/` | Holds a copy of the old sk-git sentence | unchanged | `git show --stat be1aebb9f3` lists no file under the fixture folder |

Required inventories:
- Same-class producers: `rg -n 'A rebase keeps an id' .skilled/skills/sk-git .skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert` lists the corrected skill sentence and the untouched fixture copy.
- Consumers of changed symbols: the 002 parent goal binds phases through its table, so `check-goal.cjs` reads the two new rows and still reports the recorded exception.
- Matrix axes: each of the five document groups is present or stale, and each corrected group cites a saved run, a commit or a test line. No runtime input axis applies.
- Algorithm invariant: a corrected sentence states only what a saved command output, a commit or a test file line shows.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the research, the current documents and the source of each claim. Implementation makes the five document edits and saves three evidence files. Verification runs the parent goal measurement, the phase 033 recursive validation, the suites, the commit stat and strict validation of this folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. No code or test changes, so this child has no failing-first test under parent D1 | Not applicable |
| Integration | Every touched folder under strict validation | `validate.sh --strict` |
| Manual | The parent goal budget and the check-goal finding count | `goal.cjs packet` and `check-goal.cjs` |

The saved proof is `scratch/goal-002-parent.txt` for the parent goal, `scratch/validate-033.txt` for ten PASSED lines from the recursive run, and `scratch/criterion-5-033.txt` for 1026 of 1026 and 62 of 62.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The 2026-11-13 research sections 6 and 9 | Internal | Green | The defects would need rediscovery |
| The nine phase 033 children at Complete | Internal | Green | The parent status could not say Complete |
| The live checks of 038 child 011 | Internal | Green | The two limitation rows would stay stale |
| The test files each playbook names | Internal | Green | A case name could not be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a corrected document states a fact that a command contradicts, or the 002 parent goal exceeds its budget.
- **Procedure**: revert commit `be1aebb9f3`. No code, test or record format changes, so a revert restores the earlier documents without a runtime effect.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The 2026-11-13 research and the current documents | Implementation |
| Implementation | The source or saved run behind each corrected sentence | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
