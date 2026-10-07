---
title: "Feature Specification: Review and hardening research for the series parent rule"
description: "Phase 6 shipped the series parent rule, the recent-packets listing and seeded trigger phrases without an independent review. This phase reviews that work and researches how to harden the rule and improve its user experience."
trigger_phrases:
  - "series parent review and hardening research"
  - "phase 7 series parent review and hardening research"
  - "harden the series parent rule"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Review and hardening research for the series parent rule

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 12 |
| **Predecessor** | 006-series-parent-rule-and-sibling-listing |
| **Successor** | 008-series-parent-review-fixes |
| **Handoff Criteria** | A review report with a verdict and a research report with ranked hardening and UX recommendations, both cited to file and line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the spec folder tooling parent. Phase 6 added the series parent rule, the recent-packets listing in `create.sh`, seeded trigger phrases and the `template-default` judge class. This phase checks that work and looks for ways to make it stronger.

**Scope Boundary**: read-only review and research. The loops write only under this folder's `review/` and `research/` directories. No code or rule doc changes here; any fix becomes its own phase.

**Dependencies**:
- Phase 6 commits `6a21c6b5311`, `bff396f481e`, `f53d63e4615`, `a3bec035edc` on main.

**Deliverables**:
- `review/review-report.md` from a 3-iteration `/deep:review` run.
- `research/research.md` from a 10-iteration `/deep:research` run.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 6 was built by DeepSeek workers and checked by one orchestrator, so it has had one review lens. Nobody has yet asked whether agents will actually follow the series parent rule, whether the listing is noticed, or whether the rule can be gamed into a catch-all bucket.

### Purpose
Know whether the Phase 6 work is correct, and have a ranked, cited list of ways to harden the rule and improve how the tooling steers an agent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deep review of the Phase 6 changes: rule docs, `create.sh`, `phrase-judge.mjs` and their tests.
- Deep research on the series parent rule, the listing and related existing logic: Gate 3 option text, the Gate 3 classifier, phase thresholds, `recommend-level.sh`, the trigger index and the advisor.

### Out of Scope
- Changing any code or rule doc - fixes get their own phase after the reports.
- Regrouping existing packets - each needs an operator decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/` | Create | Deep review state and report |
| `research/` | Create | Deep research state and report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 3 review iterations with convergence unable to stop the loop early | The review state log holds 3 iteration records and the report states a verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Run 10 research iterations with convergence unable to stop the loop early | The research state log holds 10 iteration records and `research.md` ranks recommendations with citations |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every finding and recommendation cites a file and line that the orchestrator has opened and confirmed.
- **SC-002**: The operator can pick the next phase from the two reports without rereading the code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi providers `openai` and `opencode-go` | A quota or auth failure stops an iteration | Check each iteration's artifacts, not the exit code, and re-dispatch on a failed one |
| Risk | One model family per loop is one opinion | Med | The review and the research use different model families, and the orchestrator verifies citations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How to harden the series parent rule, the recent-packets listing and the seeded trigger phrases, and how to make grouping related work the default for agents.

**Research Context**: deep-research is active for this topic. `research/research.md` is the canonical output.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Research findings** (10 iterations, stop reason `maxIterationsReached`, 7 of 7 questions answered; full ranking and evidence in `research/research.md`):

- Grouping becomes the default only where the folder is chosen. The series-parent clause lives in `AGENTS.md` option C, but the runtime Gate 3 menu, the Pi dialog and both speckit confirmations still offer a plain related-folder option.
- The `create.sh` recent-packets listing prints to stderr inside the run that creates the folder, after the choice, and it is blind to topic, phase children and packets without `description.json`.
- Required next work: one byte-pinned change set for the menu wording, a runnable series-parent recipe, a topic-ranked lister with visible failure paths, and sibling evidence at `/speckit:plan` intake.
- Supporting work: a seeder drift guard, seeding or classing the phase-parent placeholder phrases, wiring the unused phase-parent health advisory, a decision on trigger-index CI cadence, and a read-only census before any backfill.
- Ruled out: pre-selecting option C, sibling rows inside the hashed Gate 3 constants, an automatic regroup command and a SessionStart census.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
