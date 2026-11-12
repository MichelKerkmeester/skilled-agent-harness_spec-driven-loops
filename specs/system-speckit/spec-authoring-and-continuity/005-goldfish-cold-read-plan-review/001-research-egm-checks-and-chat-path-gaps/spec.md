---
title: "Feature Specification: Research whether spec-kit planning should adopt fresh-context cold-read and decision-free readiness checks from the Elephant-Goldfish Model"
description: "The session that writes a plan also scores whether that plan is clear, so a plan only its author can follow passes every planning gate. This packet researches whether the Elephant-Goldfish Model's fresh-context checks close that gap inside the existing planning steps."
trigger_phrases:
  - "goldfish cold read plan review"
  - "elephant goldfish model spec kit"
  - "fresh context plan comprehension check"
  - "decision free implementation readiness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Research whether spec-kit planning should adopt fresh-context cold-read and decision-free readiness checks from the Elephant-Goldfish Model

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-11 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The planning gate in `/speckit:plan` requires only that `plan.md` exists with a technical approach, and the clarity score beside it is given by the session that wrote the plan. A plan that only its author can follow therefore reaches `/speckit:implement`, where the implementer settles the ambiguity without review. Google's Elephant-Goldfish Model answers the same gap with reviewers started in a fresh context, and nobody has checked which of its checks fit this workflow.

### Purpose
A sourced recommendation states which fresh-context checks belong in the existing planning steps, at which spec levels, and which parts of the model to leave out.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ sed -n '461,464p' .skilled/commands/speckit/assets/speckit-plan.yaml
  planning_gate:
    location: "After Step 5"
    requirements: ["spec.md exists, no [NEEDS CLARIFICATION] markers", "plan.md exists with technical approach"]
    action_if_failed: "STOP and return to incomplete step"
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Run five deep-research iterations on DeepSeek V4.1 Flash at max effort through the shared fan-out runner.
- Map each Elephant-Goldfish check to the existing step of `/speckit:plan` or `/speckit:implement` that could carry it.
- State how each check scales across spec Levels 1, 2, 3 and 3+.
- Name the parts of the model to leave out, with the reason for each.

### Out of Scope
- Editing any workflow, skill or command file - this packet researches and a later packet builds.
- A new deep mode, command or agent - the first read found the existing steps can carry the checks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/001-research-egm-checks-and-chat-path-gaps/research/research.md` | Create | The synthesized findings and recommendation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research lineage completes five iterations on the named model. | `ls research/lineages/deepseek-flash/iterations` lists five `iteration-NNN.md` files. |
| REQ-002 | A synthesis exists that answers placement, level fit and exclusions. | `research/research.md` exists and names a step for each adopted check. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Claims about this repository carry a file and line. | Each placement recommendation in `research/research.md` cites a path and line that resolves. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `ls research/lineages/deepseek-flash/iterations | wc -l` prints 5.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `pi` CLI and the LLM Gateway route for DeepSeek V4.1 Flash | The lineage cannot run without them | Stop and report, and do not re-route to another provider |
| Risk | One model family writes every iteration, so its findings are one opinion | Med | Check each cited line in this session before quoting a finding, and compare against the earlier Luna read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does a cold read on a finished packet predict the deviations its implementation summary records? No run has measured it.
- May a planning step dispatch a fresh reader, or only prompt for one? Both workflows state contracts that a dispatch would change, so this needs a decision record.
- How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible?
- Research context: deep research is active for that question, run with a fresh agent per iteration, and `research/research.md` stays the canonical source. The earlier single-session runs are in `research_archive/`.
- How can a deep loop started through natural conversation be kept on its proper workflow? Deep research is active for this question as generation 3, and `research/research.md` stays the canonical source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Source: `research/research.md`, generation 3: five iterations, each a fresh agent, stop reason `maxIterationsReached`.

- A chat-started deep-research loop in this packet bypassed its workflow by calling `fanout-run.cjs` with one lineage. One process then wrote every iteration, and no check reported it.
- Every hard check in the loop is reached from inside a workflow step, so a route that skips the workflow skips them all.
- The fix is a refusal in `fanout-run.cjs` for a research or review matrix that expands to one lineage, with an explicit escape flag. The change set is five edits in four files.
- Not fixed by that: a real fan-out still runs each lineage's iterations in one process, and the single-executor path has no runner.

Generation 2, archived at `research_archive/2026-11-11T20-11-35Z/research.md`: ten fresh-agent iterations on workflow protection for chat sessions.

- Chat sessions should not be routed into the command workflows. The missing obligation is the shape of a plan's phase lines: file named, proof command at the end.
- The edit set is seven amended lines in the authoring card, the plan template and `AGENTS.md`.
- `AGENTS.md` is 27,372 bytes and Devin reads 16,384 bytes of a rule file, so lines 184 and below never reach a Devin session.

Neither edit set has been built or tested.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
