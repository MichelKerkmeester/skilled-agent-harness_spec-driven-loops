---
title: "Feature Specification: Phase 6: remediation-deep-review"
description: "Five fix phases and a trigger index rebuild landed on the post-merge review's findings without a review of their own. This phase reviews those six commits in five deep-review iterations and keeps only confirmed findings."
trigger_phrases:
  - "remediation deep review"
  - "phase 6 remediation deep review"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: remediation-deep-review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/093-post-merge-deep-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-claim-corrections |
| **Successor** | None |
| **Handoff Criteria** | Five iteration records exist and `review/review-report.md` ranks every confirmed finding with its evidence and smallest fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the post-merge deep review specification.

**Scope Boundary**: The commits `1d078f3356..d1741a28f7` and the docs of phases 001 to 005. The review writes only inside this phase folder.

**Dependencies**:
- Phases 001 to 005 committed as `1d078f3356`, `e0b32e5e11`, `75289472d0`, `019b94a403` and `f4f678328b`, and the index rebuild `d1741a28f7`

**Deliverables**:
- A five-iteration deep-review packet under `review/`
- `review/review-report.md` with confirmed findings ranked P0, P1 or P2, and the refuted ones

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five fix phases changed three hooks, two checker scripts, hub docs, two recorded claims and six skill versions. Each phase checked its own goal criteria, but nothing reviewed the set for regressions, weak tests, version or changelog drift, comment hygiene or overbuilding.

### Purpose
Every defect in the remediation commits is either confirmed with a rerun or a read line and ranked with its smallest fix, or ruled out.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `/deep:review:auto` for five iterations with stop policy `max-iterations` on cli-pi DeepSeek V4.1 Flash at max
- Check correctness, regressions, test quality, version and changelog hygiene, comment hygiene and `prevent-overengineering.md`
- Check that each fix matches what its phase claims
- Synthesize confirmed findings into `review/review-report.md`

### Out of Scope
- Fixing any finding, because this phase changes no product file
- The sk-vision `resolves a built entry` test, which fails here only because `vision-runtime/dist` is not built in this worktree

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-remediation-deep-review/` | Create | Phase docs and the `review/` packet |
| `../spec.md` | Modify | Phase map row 6 |
| `../goal.md` | Modify | Binding row and recursive pass count |
| `../graph-metadata.json` | Modify | Child id |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run five review iterations on cli-pi | `review/deep-review-state.jsonl` holds five iteration records and `review/dispatch-receipts/` holds five cli-pi completion receipts |
| REQ-002 | Keep only proven findings | Each finding in `review/review-report.md` is marked CONFIRMED with a command or file:line and a smallest fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Check test quality | The report states, per new test, whether it fails against the pre-fix code |
| REQ-004 | No product change | `git show --stat` of the phase commit lists only files under the 012 packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five iteration records and a ranked report with CONFIRMED findings and refuted hypotheses
- **SC-002**: Strict validation passes on this phase and recursively on the 012 parent
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass usage limit | Medium | Switch to `cline-pass/deepseek-v4.1-flash`, then wait for the reset |
| Risk | Iteration findings that do not reproduce | Medium | The synthesizer reruns or reads every finding before it enters the report |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The target commits and the review contract are fixed.
<!-- /ANCHOR:questions -->

---
