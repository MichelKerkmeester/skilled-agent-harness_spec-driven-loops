---
title: "Feature Specification: Phase 3: deep-review-case-rule"
description: "The review mode refuses any finding that has no reproducing case, but the deep-review agent's finding format, which every /deep:review iteration follows, still asks only for a title, a location, a description and three fix-completeness lines. A deep-review finding can therefore be reported with no input or situation that shows it."
trigger_phrases:
  - "deep review case rule"
  - "phase 3 deep review case rule"
  - "deep-review finding reproducing case"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: deep-review-case-rule

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/003-deep-review-case-rule` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-quality-report-listing |
| **Successor** | 004-agents-md-pointers |
| **Handoff Criteria** | Step 7 of both hand-kept agent files carries the `Case:` rule, the Codex and Pi mirrors are in sync, the five deep-review test files pass including the new reducer test, and the Hermes copy follows the orchestrator's single generator run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Round two follow-ups specification.

**Scope Boundary**: One new required line, `Case:`, in Step 7 of the deep-review agent and its Claude fork, the generated mirrors that follow from it, and one reducer test that proves the deep-loop readers tolerate the line. No reader, schema, prompt pack or ledger change.

**Dependencies**:
- The case wording in `.skilled/skills/sk-code/sk-code-review/SKILL.md` (the `- Case:` line of the Phase 4 output contract and the Phase 3 step 5 sentence "A finding with no case is not reported"), which the new line must match
- The orchestrator's single Hermes generator run after all five children are built

**Deliverables**:
- A fourth required finding line in Step 7 of `.skilled/agents/deep-review.md` and `.claude/agents/deep-review.md`
- The Codex and Pi mirrors regenerated from the canonical agent
- One reducer test showing an iteration whose findings carry a `Case:` line reduces to the same finding count and severities as one without it

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review mode now requires a `- Case:` line for every finding ("A finding with no case is not reported"), but Step 7 of the deep-review agent, which each `/deep:review` iteration follows, still asks only for `N. **Title** -- file:line -- Description` and the three fix-completeness lines `Finding class:`, `Scope proof:` and `Affected surface hints:`. A deep-review finding can be reported with no input or situation that shows it, which is the failure the review rule exists to prevent. The change must not disturb the readers of the iteration narrative: one counts every numbered line under `## Findings` as a finding, so the new line has to be shaped so no reader takes it for one.

### Purpose
A deep-review finding carries the case that proves it, in the same words the review mode uses, and the deep-loop readers reduce it exactly as before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a fourth required line, `Case: ...`, to every finding in Step 7 of `.skilled/agents/deep-review.md`, with the rule that a finding with no case is not reported at any severity (P2 included, as in the review mode)
- Apply the identical edit to the hand-kept fork `.claude/agents/deep-review.md`
- Regenerate the Codex and Pi mirrors with their generators
- Add one reducer test proving a `Case:` line under each finding changes neither the finding count nor the severities
- Record the Hermes regeneration as a task for the orchestrator

### Out of Scope
- The iteration prompt pack `prompt-pack-iteration.md.tmpl` - its output contract (item 1) names section headings only and lists no finding lines, so there is nothing to mirror, and the last edit to that file came with a deep-review version bump and changelog entry that this fix would otherwise owe
- A `case` field in the JSONL ledger, `findingDetails`, the registry or the ledger schema - recorded as a follow-up in `plan.md`
- Edits to `reduce-state.cjs`, `iteration-findings.cjs`, `deep-review-reducer.ts` and `post-dispatch-validate.ts` - read and confirmed tolerant, not changed
- A checker for deep-review narratives (the review mode has `check-review-findings.js`) - a follow-up
- Step 11, the Binary Quality Gates table and the Pre-Delivery Checklist in the agent - the format owner is Step 7; a verification line elsewhere is a follow-up
- The Hermes generator in write mode - the orchestrator runs it once after every build
- The deep-research round under `../../001-ponytail-deep-research/research/` - never read or written

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/deep-review.md` | Modify | Step 7: add the `Case:` bullet after the three-fix-completeness-lines bullet |
| `.claude/agents/deep-review.md` | Modify | The identical bullet in the hand-kept fork |
| `.codex/agents/deep-review.toml` | Regenerate | Output of `sync-agents.cjs`; never hand-edited |
| `.pi/agents/deep-review.md` | Regenerate | Output of `sync-agents-pi.cjs`; never hand-edited |
| `.hermes/skills/agent-deep-review/SKILL.md` | Regenerate (orchestrator) | Output of `sync-skills-hermes.cjs`, run once after all five builds; the builder runs only `--check` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | Append one `describe` with one test |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/003-deep-review-case-rule/tasks.md` | Modify | Tick tasks and record evidence |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/003-deep-review-case-rule/goal.md` | Modify | Fill the Log tables |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/003-deep-review-case-rule/implementation-summary.md` | Modify | Fill the scaffold after the build |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/003-deep-review-case-rule/scratch/` | Create | Baseline captures; the orchestrator removes them before the commit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Step 7 of `.skilled/agents/deep-review.md` requires a `Case: ...` line on every finding, in the review mode's words, and says a finding with no case is not reported at any severity | `rg -n 'Case:' .skilled/agents/deep-review.md` prints exactly one line, inside Step 7, and `grep -c 'A finding with no case is not reported, at any severity' .skilled/agents/deep-review.md` prints `1` |
| REQ-002 | The hand-kept fork carries the identical edit | The Step 7 range of `.claude/agents/deep-review.md` equals the canonical range (`diff` prints nothing, exit 0), and `rg -n 'Case:'` prints exactly one line in the fork |
| REQ-003 | The deep-loop readers tolerate the added line: an iteration whose findings carry a `Case:` line reduces to the same finding count and severities as one without it | The new reducer test passes, `deep-review-reducers`, `deep-review-projections-contract`, `deep-review-deltas-contract`, `deep-review-state-reducer` and `verify-iteration` vitest files pass together (`Tests  133 passed (133)`), and `git status` shows no reader file changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The generated mirrors carry the rule | `sync-agents.cjs --check` and `sync-agents-pi.cjs --check` print `PASS: 12 agents are in sync.` and exit 0; `check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0; the Hermes `--check` passes once the orchestrator has run the generator |
| REQ-005 | Nothing outside the table above changes: no prompt pack, reader, schema or ledger edit | `git status --porcelain -- .skilled/skills/system-deep-loop` shows only the one test file as new against the saved baseline |
| REQ-006 | The agent validators stay clean | `validate_document.py --type agent` prints `VALID` and `Total issues: 1` (the same one non-blocking numbering warning as before) for both agent files, and the name checker prints `PASS` |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-review finding format and the review mode state the case rule in the same words ("A finding with no case is not reported")
- **SC-002**: A finding with a `Case:` line reduces to the same count and severity as one without it, and the test would fail if the narrative reader began to count a `Case:` line
- **SC-003**: Every generated copy of the agent carries the rule once the orchestrator's Hermes run lands
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The orchestrator's single Hermes generator run | The Hermes copy of the agent stays stale and the Hermes `--check` exits 1 until it runs | The Hermes task is marked for the orchestrator, and the goal's mirror criterion passes only after that run |
| Risk | A case written as a wrapped numbered list is counted by `iteration-findings.cjs` as extra findings (a probe gave 4 findings for 2 when a case carried two numbered steps) | Medium | The rule says to write the case on one line that does not start with a number and a period; hardening the counter is a follow-up |
| Risk | The rule is prose, so nothing enforces it in the deep-review loop | Medium | Recorded as a follow-up: a narrative checker, or carrying `case` into `findingDetails` and the registry |
| Risk | `reduce-state.cjs` reads `- **F###**:` bullets only, not the `N. **Title** -- file:line` shape the agent writes, so narrative findings reach the registry through delta rows and `findingDetails` | Low | Existing behavior, found while tracing the readers; this fix neither depends on it nor changes it |
| Risk | Sibling children build in parallel, so a shared mirror check can fail on a path this fix does not own | Low | The mirror tasks name only this fix's five copies; a failure naming any other path is recorded as a sibling's and not repaired here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The P2 question is decided: the case rule applies at every severity, because the review mode's rule has no severity exception and a one-line case is cheap. See D1 in `goal.md`.
<!-- /ANCHOR:questions -->

---

