---
title: "Feature Specification: Scaffold surface placement"
description: "R1 and R8: the parent-skill scaffold places a new surface mode after the workflow modes and ahead of the existing surface modes in tieBreak, the two contract references state the same rule, and the completion report names the canary and commit follow-ups the scaffold cannot run."
trigger_phrases:
  - "scaffold surface placement"
  - "phase 1 scaffold surface placement"
  - "tiebreak insertion rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Scaffold surface placement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-13 |
| **Branch** | Its own worktree from origin/main, created as `goal.md` says |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-doctor-guard-sync-messages |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the external surface priority build. It builds research recommendations R1 and R8, phase P8 of `../../025-external-surface-priority-research/research/research.md` section 14.1, as the verification pass narrowed them.

**Scope Boundary**: The `tieBreak` activity in step_4 and the step_6 completion report of the two create-skill-parent YAML twins, the tie-break paragraph of `parent-hub-router-schema.md` and the tie-break row of `parent-skills-nested-packets.md`. The shipped `tieBreak` order in `.skilled/skills/sk-code/hub-router.json` does not change.

**Dependencies**:
- None. Builds in parallel with 002 and 003.

**Deliverables**:
- The insertion rule, stated with the same phrase in all four files.
- Two follow-up lines in each twin's completion report.
- One sk-create-skill release.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/create:skill-parent update --surfaces` writes `hub-router.json`, and its step_4 activity (`create-skill-parent-confirm.yaml:462`, `create-skill-parent-auto.yaml:423`) only says the `tieBreak` must cover all modes. A new surface is appended after `sk-code-skilled` and loses every keyword tie against it (F47, F52; reproduced with a reorder in verification run V1). The scaffold then stops with the doctor red on 5k-canary only, and its completion report does not say that a canary case and its authored fixture copy are needed, or that a commit with the hooks installed re-mints and copies the activation manifest (F46, F80, F89).

### Purpose
A surface added by the scaffold leads a tie against `sk-code-skilled`, and the scaffold's report names the two follow-ups that take the doctor, guard and sync to green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **R1.** The step_4 `hub-router.json` activity in both YAML twins gains the insertion rule, word for word the same in each: a new surface mode goes after the workflow modes and ahead of the existing surface modes in `tieBreak`. The tie-break paragraph at `parent-hub-router-schema.md:290` and the tie-break row at `parent-skills-nested-packets.md:224` state the same rule. All four carry the exact phrase `ahead of the existing surface modes`, so one grep finds every site.
- **R8.** The step_6 completion report of both twins gains two lines: author a canary case for each new surface in `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` and copy that fixture to its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/`; and commit with the hooks installed (`bash .skilled/scripts/install-git-hooks.sh`), whose pre-commit gate re-mints and copies the activation manifest, or else run `compiled-route-manifest.cjs refresh` and copy the manifest by hand. Each line names `canary-cases.v1.json` and `install-git-hooks.sh` literally.
- One release of the sk-create-skill mode packet, whose parent-hub references are the contract that changed.

### Out of Scope
- `README.md:1448` (moved to R9, phase 005), `SKILL.md:74` (detection precedence, F5) and `upgrading-a-skill-to-v4.md:161` (no add-surface caller reads it), dropped in the verification pass.
- Generating canary cases in the scaffold (X10) and running the re-mint inside it (X14).
- A rank field, a native flag or an order derived at mint (X1, X2, X3).
- A doctor leg that enforces the insertion position (research section 12, open and unbuilt).
- Reconciling the example order at `parent-hub-router-schema.md:69` (research section 12 open question).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/create/assets/create-skill-parent-confirm.yaml` | Modify | Insertion rule at the step_4 `hub-router.json` activity; two lines in step_6_completion |
| `.skilled/commands/create/assets/create-skill-parent-auto.yaml` | Modify | The same two edits, kept word for word identical |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modify | Tie-break ordering paragraph states the rule |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modify | Stage-one tie-break row states the rule |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `.skilled/skills/sk-doc/sk-create-skill/changelog/` | Modify, Create | One release |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The phrase `ahead of the existing surface modes` appears in both YAML twins on identical lines and in both references |
| REQ-002 | In a full-tree copy, the update workflow for a stand-in surface writes `tieBreak` as `[sk-code-quality, sk-code-review, <stand-in>, sk-code-skilled, sk-code-obsidian, sk-code-webflow]`, and the doctor passes 5e and 5i |
| REQ-003 | In that copy, after the re-mint, a prompt that ties the stand-in with OpenCode routes `[<stand-in>, sk-code-skilled]` |
| REQ-004 | Both twins' completion reports name `canary-cases.v1.json` and `install-git-hooks.sh`; following them clears 5k-canary and leaves the guard and sync `--check` at exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The live tree stays green: the sk-code and sk-doc doctors and `run-all-drift-guards.sh` exit 0, and `validate_document.py` passes on both references |
| REQ-006 | Exactly one changelog entry is added, under `sk-create-skill/changelog/`, with the packet `SKILL.md` version raised to it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Acceptance Ledger (6 rows)

The builder records each row in `implementation-summary.md` as `| P8-<n> | Pass | <backticked command and what it printed> |`.

| ID | Check |
|----|-------|
| P8-1 | The insertion-rule phrase is on identical lines in both twins and present in both references |
| P8-2 | Copy: the update workflow for the stand-in writes the expected `tieBreak` order |
| P8-3 | Copy: `parent-skill-check.cjs` prints PASS for 5e and 5i |
| P8-4 | Copy: after refresh and copy-back, the tie prompt routes `[<stand-in>, sk-code-skilled]`; with the stand-in appended after `sk-code-webflow` instead, the same prompt routes `[sk-code-skilled, <stand-in>]` |
| P8-5 | Copy: the run's completion report contains both follow-up lines |
| P8-6 | Copy: after following both lines, the doctor has no 5k-canary failure and exits 0, and the guard and sync `--check` exit 0 |

Review findings go in a `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` table in the same file.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A stand-in surface added by the scaffold leads a tied prompt against `sk-code-skilled`.
- **SC-002**: A user who follows the completion report reaches a green doctor, guard and sync without another doc.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The two YAML twins drift apart | Med | Criterion 1 compares the lines byte for byte |
| Risk | The copy run touches the real worktree, as lineage C's iteration 6 did | High | Copies live under the session scratchpad; `pwd` after each `cd` |
| Risk | The tie prompt does not actually tie | Med | P8-4 records the appended-order route first, which must show OpenCode leading |
| Dependency | `/create:skill-parent` runs as an agent-followed workflow, not a binary | Med | The builder follows the twin's steps with the copy as the working tree |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The operator's shipped order and routes are unchanged; only newly added surfaces are placed by the rule.
- **NFR-R02**: The rule is stated in one phrase, so a grep proves every site.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A hub with no surface modes yet: the new surface goes right after the workflow modes, which the same rule gives.
- Several surfaces added in one run: each goes ahead of the surfaces that existed before the run, in the order given.

### Error Scenarios
- The stand-in already appears in `tieBreak` (an update rerun): the scaffold leaves its position alone.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Four files and a release, about 60 lines |
| Risk | 8/25 | A shared scaffold contract; the shipped order stays |
| Research | 4/20 | Verified in research V1 |
| **Total** | **18/70** | **Level 2, chosen for the build as a whole; see the parent goal log** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
