---
title: "Feature Specification: Phase 11: remediation-deep-review"
description: "Nine remediation phases shipped as commits 191aea6baa through 03e31f902b, each verified only by the orchestrator that built it. This phase reviews them with an independent five-iteration deep review and keeps only the findings a rerun confirms."
trigger_phrases:
  - "remediation deep review"
  - "phase 11 remediation deep review"
  - "skill authoring remediation review"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: remediation-deep-review

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
| **Branch** | `worktrees/095-skill-authoring-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-validator-false-positives |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the skill authoring UX research packet. It reviews the fixes phases 002 to 010 shipped and changes no product file.

**Scope Boundary**: Review only. The commits `191aea6baa..03e31f902b` are read and rerun; findings go to `review/review-report.md`.

**Dependencies**:
- The nine remediation phases, committed
- The `pi` binary with the llmgateway credential, or cline-pass as the fallback route

**Deliverables**:
- One five-iteration `/deep:review` lineage under `review/lineages/`
- `review/review-report.md` with confirmed findings only

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each remediation phase was built by a cli-pi builder and checked by the same orchestrator that wrote its brief. Nobody independent has asked whether each fix is correct, whether it broke a neighbor, whether each new test fails without its fix, and whether each phase's summary claims what its commit does. The orchestrator also saw the Python advisor battery drop from 13/17 to 9/17 in this worktree and needs its cause.

### Purpose
A ranked list of confirmed findings against the nine fixes, each with file:line evidence and the smallest fix, plus the cause of the Python battery drop, so the next round can act without re-deriving anything.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

The review target is the change in commits `191aea6baa..03e31f902b` on branch `worktrees/095-skill-authoring-ux-research`. Read it with `git show <commit>` or `git diff bb3878b570..03e31f902b -- <path>`.

| Phase | Commit | Change to review |
|-------|--------|------------------|
| plan | 191aea6baa | The remediation phase plan |
| 002 | d3b9e272d8 | The refinement parent goal cut back under its budget |
| 003 | 8011f1b408 | The hub version-copy reader search; the removal was dropped |
| 004 | 410df0acce | The pre-commit `gate:skill-authoring` check and its untrusted-clone notice |
| 005 | 7bbb7f0f20 | The changelog workflows number against upstream and write every carrier |
| 006 | dffd7f98e2 | create-skill guidance and the leaf-manifest stale message |
| 007 | 479186cfed | Advisor name-mention scoring in the TypeScript scorer, mirrored in part in Python |
| 008 | eeb6285a8e | The advisor `surfaceHint` passthrough and the package engines field |
| 009 | 827e44abc8 | Advisor vocabulary freshness and the CI steps |
| 010 | 03e31f902b | Catalog and package validator false positives |

Review lenses, in this order:
1. **Known issue first**: the Python advisor battery (`node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs`) against the TypeScript one (`python3 007-advisor-name-mention-scoring/scratch/advisor-battery.py`).
2. **Correctness and regressions**: the pre-commit gate's cost, fail-open path and wording; changelog numbering offline and with no remote; `surfaceHint` validation; the CI steps; the validator exemptions.
3. **Test quality**: does each new test fail without its fix.
4. **Version and changelog hygiene**, **comment hygiene**, and each change against `.skilled/repo-rules/prevent-overengineering.md`.
5. **Claim fidelity**: each phase's `spec.md`, `goal.md` and `implementation-summary.md` against its commit.

The files under review are listed in `goal-file-manifest.txt`.

### Out of Scope
- Changing any product file. Findings name the fix; a later phase builds it.
- Known environment gaps: sk-vision's `vision-runtime/dist` is not built in worktrees, and `create-journey-proof.test.cjs` failed before this work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `011-remediation-deep-review/review/` | Create | Lineage state and the synthesized `review-report.md` |
| `011-remediation-deep-review/*.md`, `goal-file-manifest.txt` | Create | Phase docs and the review scope |
| `../spec.md`, `../goal.md`, `../graph-metadata.json` | Modify | The phase-map row and the goal binding row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five review iterations run on the named executor | The lineage state log holds five iteration records |
| REQ-002 | Only confirmed findings reach the report | Each finding in `review/review-report.md` carries file:line and the command or read that confirmed it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No product file changes | `git diff --name-only` over this phase's commit lists only spec-folder paths |
| REQ-004 | The Python battery drop has a stated cause | The report opens with the cause, the command that shows it and the smallest fix |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` ranks every confirmed finding P0, P1 or P2 and lists the refuted ones.
- **SC-002**: This phase and the 014 parent pass strict validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass usage limit | Med | Switch to cline-pass, then wait for the reset |
| Risk | A lineage finding is wrong | Med | The synthesis reruns or rereads each one before keeping it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
