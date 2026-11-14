---
title: "Feature Specification: Keep a packet's core purpose across handovers and compactions"
description: "A packet keeps its mechanics across relaunch hops and compactions but loses why the work exists and whom it serves. This research packet finds where the purpose drops and names the smallest change that keeps it."
trigger_phrases:
  - "purpose retention across handovers"
  - "keep a packet s core purpose across handovers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Keep a packet's core purpose across handovers and compactions

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The operator reported on 2026-11-13 that the core reason, problem, purpose or user need behind a piece of work gets lost after several in-session handovers (relaunch hops) or context compactions. The session keeps the mechanics, such as files, commits and the next action, and loses why the work exists and whom it serves.

Observed in the reporting session:
- The context recovered after a compaction listed active files, word-reference counts and recent topics, and carried no statement of the work's purpose.
- The `_memory.continuity` frontmatter block in `implementation-summary.md` has the fields `packet_pointer`, `recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions` and `answered_questions`. None of them holds the problem or the purpose.
- `templates/core/spec.md.tmpl` and `templates/packet-types/phase-parent.spec.md.tmpl` both already have a "PROBLEM & PURPOSE" section with "Problem Statement" and "Purpose", so the purpose is written once at authoring time.
- `templates/addons/handover.md.tmpl` has "Handover Summary", "Context Transfer" and "For Next Session" and no heading for the problem or purpose.
- `templates/addons/acceptance-criteria.md.tmpl` exists and is scaffolded from Level 2. `templates/addons/goal.md.tmpl` carries a "Durable Directive".

All template paths are under `.skilled/skills/system-spec-kit/`.

### Purpose
Find where a packet's problem, purpose and user need are dropped on each hop, and name the smallest change to system-spec-kit logic or templates that keeps them in front of the next session.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -n '^## [0-9]' .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl
37:## 1. Handover Summary
50:## 2. Context Transfer
84:## 3. For Next Session
107:## 4. Validation Checklist
121:## 5. Session Notes
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Read `.skilled/skills/system-spec-kit/`, `.skilled/commands/speckit/`, `.skilled/skills/system-deep-loop/` and `specs/` without changing them.
- Trace each hop surface and record what it reads, what it emits and whether the purpose travels.
- Sample real packets under `specs/` to measure whether the purpose is restated, shortened or absent after hops.
- Cite every claim as `[SOURCE: path:line]` in `research/research.md`.

### Out of Scope
- Any edit outside this packet's `research/` folder - this run is read-only research.
- Any implementation - a later packet plans and builds what the research recommends.
- Any change to Barter repositories - they are outside this repository.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | The synthesis that answers the five research questions |
| `research/resource-map.md` | Create | The map of files the lineages read |
| `research/lineages/` | Create | One folder per lineage with its iteration state |

No file outside this packet changes.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `research/research.md` answers all five open questions with resolvable citations | Each of the five questions has its own answer in `research/research.md`, and every `[SOURCE: path:line]` opens to the cited line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `research/research.md` names one recommended change with its cost and how to validate it | `research/research.md` holds one recommendation with a cost and a validation step |
| REQ-003 | `research/research.md` lists what was ruled out and why | `research/research.md` holds a ruled-out list with one reason per item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `research/research.md` answers the five questions, and every citation the orchestrating session opens resolves to the cited line.
- **SC-002**: `research/research.md` names one recommended change with its cost and validation, and lists what was ruled out.
- **SC-003**: `git status --short` shows no change outside this packet after the run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-deepseek-harness` on `deepseek-v4.1-flash-1017` | The run cannot start | Stop and report to the operator, and do not swap the executor |
| Risk | Both lineages run the same model, so agreement between them is not corroboration | High | The orchestrating session opens the citations itself before it trusts a finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

1. Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated?
2. For each hop surface, what does it read and what does it emit, and does the purpose travel? Surfaces: the Claude compaction hooks (`runtime/hooks/claude/compact-inject.ts`, `session-prime.ts`) and their counterparts for other runtimes under `runtime/hooks/`, `/speckit:resume`, `/speckit:handoff` and the session relaunch, `/speckit:save` with `generate-context.js`, the deep-loop iteration prompts and child-dispatch briefs.
3. In real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose or drift from it?
4. Which candidate change closes the measured gap at the lowest cost? The operator's candidates, to be tested and not assumed: acceptance criteria at the parent spec level, a user story or purpose and problem section at the parent level and an improved parent-specific spec template. Add any other candidate the evidence supports, for example a purpose field in the continuity block or in the compaction brief.
5. What is ruled out, and why?

### Research Context

Deep research runs against this packet with `/deep:research`, and `research/research.md` is the canonical findings source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings of the 2026-11-13 deep-research run, two lineages of five iterations on the same model, abridged from `research/research.md`.

- The purpose is written once, in `spec.md` section 2, and no automatic hop reads it back. The compaction "Goal" facet is filled from `next_safe_action`, the default Claude compaction brief is transcript-only and the resume brief has no purpose row.
- Phase parents often carry no real purpose, because nothing flags an unfilled parent purpose and the validator exempts parents from anchor checks.
- The lineages split on the fix. The adjudicated recommendation quotes the packet's existing Purpose in the resume brief, the compaction brief and the relaunch note's Goal, and makes an unfilled parent purpose fail a check. A purpose field in `_memory.continuity` is held.
- Ruled out: parent-level acceptance criteria, a new parent purpose section (one already exists) and a template or validator change alone.
- Full answers, orchestrator citation checks and limits: `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---



<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-parent-purpose-scaffold/ | An unfilled purpose in a new phase parent fails a check | Pending |
| 2 | 002-resume-purpose-row/ | The `/speckit:resume` brief shows the packet purpose | Pending |
| 3 | 003-relaunch-goal-quote/ | The relaunch note Goal opens with the packet purpose | Pending |
| 4 | 004-compaction-purpose-line/ | The context injected after a compaction carries the packet purpose, and the shared purpose helper | Pending |
| 5 | 005-continuity-purpose-field/ | The continuity block carries the purpose and the recovery Goal shows it | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-parent-purpose-scaffold | 002-resume-purpose-row | None. The two phases touch different files and can ship in either order | Each phase passes `validate.sh --strict` on its own |
| 002-resume-purpose-row | 003-relaunch-goal-quote | None. The relaunch note text does not depend on the resume brief | Each phase passes `validate.sh --strict` on its own |
| 003-relaunch-goal-quote | 004-compaction-purpose-line | None. The compaction hook does not depend on the relaunch note | Each phase passes `validate.sh --strict` on its own |
| 004-compaction-purpose-line | 005-continuity-purpose-field | Phase 004 is built and merged, because phase 005 imports the purpose helper that 004 creates | `runtime/lib/spec/packet-purpose.ts` exists and its tests pass |
<!-- /ANCHOR:phase-map -->
