---
title: "Feature Specification: Phase 2: resume-purpose-row"
description: "The /speckit:resume brief reports confidence, the current step and the next action, and never says why the packet exists. This phase adds a one-sentence Purpose row quoted from the packet's spec.md and makes the resume workflow read spec.md so the row has a source."
trigger_phrases:
  - "resume purpose row"
  - "phase 2 resume purpose row"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: resume-purpose-row

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/371-purpose-retention-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-parent-purpose-scaffold |
| **Successor** | 003-relaunch-goal-quote |
| **Handoff Criteria** | Both resume YAML assets and the presentation file carry the Purpose row. `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` reports 5 pass and 0 fail. The four mirror checks print PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The `/speckit:resume` command assets only. The relaunch note, the compaction brief, the scaffold script and the continuity record belong to phases 001, 003, 004 and 005.

**Dependencies**:
- None that blocks the build. Phase 001 stops new generic parent purposes, and this phase already skips the generic sentence that existing parents still carry.

**Deliverables**:
- A Purpose row in the resume brief contract of both workflow YAML assets and the presentation file.
- `spec.md` named in the resume read order, plus a rule that reads the Purpose even when a fresh handover answers everything else.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The parent packet exists to find where a packet's problem, purpose and user need drop on each hop and to name the smallest change that keeps them in front of the next session.

On the resume hop the purpose drops because the brief has no row for it. Both workflow assets define the reply as Confidence, Context source, Now, Last confirmed and Next safe action, and the presentation template has no purpose line. The read order also leaves `spec.md` out: `context_loading_priority` in both assets names tasks, plan, decision-record and resource-map. The autonomous step 2 list names five docs without `spec.md`. A session that resumes after a relaunch hop or a compaction is told what to do next and never told why the packet exists.

### Purpose
After `/speckit:resume`, the brief shows one sentence that says why the packet exists, quoted from its own spec.md or from the nearest phase parent's spec.md.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ A=.skilled/commands/speckit/assets; rg -n 'reply_format|Primary: supporting spec docs|Read supporting spec docs' $A/speckit-resume-auto.yaml $A/speckit-resume-confirm.yaml; rg -n -A3 '^RESUME BRIEF' $A/speckit-resume-presentation.txt; rg -c -i 'purpose' $A/speckit-resume-presentation.txt; echo "exit=$?"
.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:93:  order: ["Primary: handover.md (<24h old)", "Primary: _memory.continuity in implementation-summary.md", "Primary: supporting spec docs (tasks/plan/decision-record/resource-map)", "Secondary: graph-metadata.json packet hints", "Secondary: the packet-scoped ripgrep context recipe (retrieval-conventions.md section 2.4) for a named gap"]
.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:157:  reply_format: ["Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
.skilled/commands/speckit/assets/speckit-resume-auto.yaml:92:  order: ["Primary: handover.md (<24h old)", "Primary: _memory.continuity in implementation-summary.md", "Primary: supporting spec docs (tasks/plan/decision-record/resource-map)", "Secondary: graph-metadata.json packet hints", "Secondary: the packet-scoped ripgrep context recipe (retrieval-conventions.md section 2.4) for a named gap"]
.skilled/commands/speckit/assets/speckit-resume-auto.yaml:138:  reply_format: ["Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
.skilled/commands/speckit/assets/speckit-resume-auto.yaml:164:      - Read supporting spec docs (`tasks.md`, `acceptance-criteria.md`, `plan.md`, `decision-record.md`, `resource-map.md`) before running any search
116:RESUME BRIEF
117-Spec: [path]
118-Confidence: [high|medium|low] | Source: [handover|continuity|spec_docs|mcp_enrichment|combined]
119-Now: [phase/current task]
exit=1
```

The last `rg -c` printed nothing and exited 1, so the presentation file holds no line that says purpose. The interactive asset's step 2 at line 188 walks the full ladder, and that ladder at line 114 does list `spec.md`. The gap there is the `context_loading_priority` line only.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add a Purpose row as the first item of `reply_format` in both resume workflow assets, with a `purpose_row` rule that says where the sentence comes from and when to omit the row.
- Add `spec.md` to `context_loading_priority` in both assets and to the autonomous step 2 read list.
- Add a step 2 line in both assets that reads the Purpose on every resume, even when a fresh handover already answers the other essentials.
- Show the row in the step 4 or step 5 present activity of both assets and in the presentation file's Resume Brief template, with one note on the parent and goal labels.

### Out of Scope
- `.skilled/commands/speckit/resume.md` - the router names the assets and lists no brief rows, so it needs no edit.
- `runtime/lib/resume/resume-ladder.ts` and the `_memory.continuity` purpose field - phase 005 owns them.
- The relaunch note, the compaction brief and the purpose-resolving helper - phases 003 and 004 own them.
- The generic parent purpose in `create.sh` - phase 001 owns it.
- The dashboard layout and the feature catalog entry - neither lists the brief rows, so neither drifts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` | Modify | Read order gains `spec.md`, `reply_format` gains Purpose, new `purpose_row` rule, step 2 reads the Purpose on every run, step 4 shows the row |
| `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | Modify | The same four changes for the interactive workflow, with step 5 as the present step |
| `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` | Modify | Resume Brief template gains a Purpose line and one note on its label variants |

The runtime directories reach these assets through symlinks or through stubs that point at `.skilled/commands/speckit/resume.md`, so no mirror needs regenerating. Plan section 6 holds the evidence.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both workflow assets list Purpose first in `reply_format` and carry one `purpose_row` rule | `rg -c 'reply_format: \["Purpose \(omit when none\)"' <asset>` prints 1 and `rg -c '^  purpose_row: ' <asset>` prints 1 for each of the two assets |
| REQ-002 | The `purpose_row` rule quotes the packet's own spec.md Purpose, falls back to the nearest ancestor phase parent's Purpose with a parent label and then to the goal.md Objective. It omits the row when none exists | The rule text in both assets contains `Purpose (parent <parent-folder-name>)`, `Purpose (goal.md)`, `omit the row` and `Never print None` |
| REQ-003 | Resume reads `spec.md` on every run | Both `context_loading_priority` lines contain `spec/tasks/plan`. The autonomous step 2 list names `spec.md`. Both assets carry the `Always read the Purpose for the brief` line |
| REQ-004 | The two workflow assets stay valid YAML and the existing command tests still pass | `python3` with `yaml.safe_load` loads both files, the goal-offer test reports 5 pass and 0 fail and the phase workflow test prints `passed=148 failed=0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The presentation file's Resume Brief template shows the Purpose line directly under `Spec: [path]` | `rg -n -A1 '^Spec: \[path\]$' .skilled/commands/speckit/assets/speckit-resume-presentation.txt` prints the `Purpose:` line as the next line |
| REQ-006 | A live resume shows the row | `/speckit:resume` on a packet with a filled Purpose shows `Purpose:` with that sentence, and on a phase child with a placeholder Purpose shows `Purpose (parent ...)` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command, run again after the build, prints `"Purpose (omit when none)"` at the start of both `reply_format` lines and `spec/tasks/plan` in both order lines. Its last `rg -c` prints 2 instead of nothing.
- **SC-002**: The goal-offer test still reports 5 pass and 0 fail, the phase workflow test still prints `passed=148 failed=0` and the four mirror checks still print PASS.
- **SC-003**: A `/speckit:resume ... :auto` run on this phase child shows `Purpose:` with the Purpose sentence above, word for word.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The brief is written by the model from the YAML instructions. No code renders it | No automated test can prove the row appears in a live brief | Assert the asset text with `rg` and run one live resume on a filled packet and one on a phase child (tasks T019 and T020) |
| Risk | A bullet in a YAML block list that holds a colon followed by a space parses as a map, not a string | Med | The new step 2 line has no colon followed by a space, and T015 loads both files with `yaml.safe_load` |
| Risk | The goal-offer test fails on any `/goal.md` path in a touched command file | Low | The new text names `goal.md` only after a space or an opening parenthesis, never after a slash. T016 reruns the test |
| Risk | A parent that still carries the generic `create.sh` purpose would print layout text as the row | Low | The rule skips an ancestor Purpose that begins `Keep parent documentation lean` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the build also add a pin assertion for the Purpose row to `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`? This plan does not, because the `rg` checks in tasks prove the asset text and a pin test would repeat them. Decision for the operator. It does not block the build.
- Once phase 004 ships its purpose-resolving helper, should the resume workflow call it instead of reading spec.md by hand? Not decided here, because the helper does not exist yet.
<!-- /ANCHOR:questions -->

---
