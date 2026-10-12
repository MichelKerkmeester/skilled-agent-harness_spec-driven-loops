---
title: "Feature Specification: Playbook path repair"
description: "Resolve every BACKTICK_PATH_UNRESOLVED warning the playbook validator prints: correct moved paths, replace or drop removed targets, and rewrite text that was never meant as a repo path."
trigger_phrases:
  - "playbook path repair"
  - "phase 2 playbook path repair"
  - "backtick path unresolved"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Playbook path repair

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-12 |
| **Branch** | `worktrees/117-docver-scaffold` (scaffold); the builder works in its own worktree branched from the scaffold commit |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-per-doc-versions |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the doc version and playbook paths packet. Phase `../../021-open-ends-remediation/003-doc-and-catalog-truth/` (PC-R6) taught the playbook validator to report backticked repo paths that resolve from no scenario, playbook, skill, hub or repository base. It corrected the drift its research named and left the rest of the report open. This phase works through that report.

**Scope Boundary**: Backticked paths in playbook scenario and root files under `.skilled/skills/*/manual-testing-playbook/`, and the validator's path check only if a narrow rule is the smallest fix for a clearly marked class.

**Dependencies**:
- None for the build. Phase 001 builds in parallel. This phase never edits a `version:` line; after both merge, the integrator runs 001's bump over the docs this phase changed.

**Deliverables**:
- The validator prints 0 `BACKTICK_PATH_UNRESOLVED` lines, or exactly as many as the Remaining table lists with reasons.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict` exits 0 and prints 258 `BACKTICK_PATH_UNRESOLVED` warnings from 113 distinct paths across 28 packages at the scaffold commit (the operator brief measured 252 from 110 on an earlier tree). About a third name files that exist under another base: mostly `tests/...` written relative to a skill's `runtime/`, or `../` chains off by a level. The rest exist nowhere: renamed or archived spec packets, playbook files that lost an old `004-` style number, removed files such as `.opencode/agents/general.md`. Part of those were never meant as repo paths: sandbox examples like `src/untracked.txt`, placeholders like `001-alpha/goal.md`, and paths into an external Webflow project. The seven cli-external-orchestration packages hold 135 of the warnings.

### Purpose
Every playbook reference that names a repo file resolves, and every warning left has a written reason.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One ledger row per playbook package with warnings, PP-01 to PP-28, and the validator row PP-V.
- For each warning, the narrowest change, in this order:
  1. A path to a file that moved or exists under another base: correct it to the path that resolves.
  2. A path to a removed or renamed target: correct it to its successor, or remove the reference when no successor exists.
  3. Backticked text that is not meant as a repo path: rewrite it so it no longer reads as a path, or add a narrow validator rule for a clearly marked class. Never a broad suppression.
  4. Anything left: a Remaining row with its reason.

### Out of Scope
- Making the warning blocking. It stays report-only, as decision D2 of `../../021-open-ends-remediation/003-doc-and-catalog-truth/goal.md` says.
- Editing a `version:` line. The integrator runs phase 001's bump after merging.
- Other validator warning codes, such as `HAND_TYPED_CENSUS` or `PROMPT_UNSYNCED`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Scenario and root files under `.skilled/skills/*/manual-testing-playbook/` | Modify | Correct, remove or rewrite each backticked path |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify, only if needed | A narrow rule for one clearly marked class |
| `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/changelog/` | Modify, Create, only if the validator changes | sk-doc bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The validator prints 0 `BACKTICK_PATH_UNRESOLVED` lines, or exactly the number of Remaining rows, and still exits 0 |
| REQ-002 | Every ledger row ends Fixed with a command proof or Closed with a written reason |
| REQ-003 | No commit of this phase changes a `version:` line, and no skill is bumped except sk-doc once when the validator changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A validator change, if any, is a narrow rule for one clearly marked class, with a test that fails before and passes after |
| REQ-005 | Every Remaining row names the path, the file and line, and why it stays |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Path Ledger (29 rows)

Counts are from the validator at the scaffold commit. A package row is Fixed when its warning count is 0, with the command that shows it. It is Closed when warnings remain and each is a Remaining row; the reason then says "see Remaining" and names prevent-overengineering or an operator decision.

| ID | Package | Warnings | Distinct paths |
|----|---------|----------|----------------|
| PP-01 | `cli-classifier/cli-jev` | 1 | 1 |
| PP-02 | `cli-external-orchestration/cli-claude-code` | 16 | 3 |
| PP-03 | `cli-external-orchestration/cli-codex` | 21 | 8 |
| PP-04 | `cli-external-orchestration/cli-cursor` | 21 | 8 |
| PP-05 | `cli-external-orchestration/cli-devin` | 22 | 9 |
| PP-06 | `cli-external-orchestration/cli-hermes` | 15 | 1 |
| PP-07 | `cli-external-orchestration/cli-opencode` | 21 | 8 |
| PP-08 | `cli-external-orchestration/cli-pi` | 19 | 6 |
| PP-09 | `cli-orca` | 8 | 3 |
| PP-10 | `mcp-tooling/mcp-click-up` | 1 | 1 |
| PP-11 | `mcp-tooling/mcp-figma` | 1 | 1 |
| PP-12 | `mcp-tooling/mcp-obsidian` | 5 | 3 |
| PP-13 | `sk-code` | 19 | 7 |
| PP-14 | `sk-code/sk-code-obsidian` | 2 | 2 |
| PP-15 | `sk-code/sk-code-review` | 1 | 1 |
| PP-16 | `sk-code/sk-code-webflow` | 1 | 1 |
| PP-17 | `sk-design/sk-design-diagram` | 7 | 7 |
| PP-18 | `sk-doc/sk-create-benchmark` | 1 | 1 |
| PP-19 | `sk-doc/sk-create-changelog` | 2 | 2 |
| PP-20 | `sk-doc/sk-create-command` | 1 | 1 |
| PP-21 | `sk-doc/sk-create-goal` | 5 | 3 |
| PP-22 | `sk-git` | 10 | 5 |
| PP-23 | `sk-vision` | 19 | 4 |
| PP-24 | `system-deep-loop` | 1 | 1 |
| PP-25 | `system-deep-loop/deep-ai-council` | 5 | 4 |
| PP-26 | `system-deep-loop/deep-review` | 2 | 2 |
| PP-27 | `system-deep-loop/runtime` | 1 | 1 |
| PP-28 | `system-spec-kit` | 30 | 21 |
| PP-V | `validate-playbook-package.cjs` | n/a | n/a |

PP-V is Fixed when the validator changed, with its test as proof, or Closed with a prevent-overengineering reason when no change was needed.

### Ledger format

The builder records every row above in `implementation-summary.md`, one line each, in this shape, so the goal criteria can count them:

- `| <ID> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| <ID> | Closed | <the written reason, naming prevent-overengineering or the operator decision> |`

Each warning left goes in a Remaining table in the same file, one line each:

- `| RM-<n> | <path, in backticks, and the file:line that cites it> | <why it stays> |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The validator's `BACKTICK_PATH_UNRESOLVED` count equals the number of Remaining rows, ideally 0.
- **SC-002**: All 29 ledger rows are Fixed or Closed in `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A "correction" points at the wrong successor | Med | Confirm each successor exists and covers the same subject before writing it |
| Risk | Removing a reference drops what a scenario tests | Med | Remove only when no successor exists, and keep the scenario's steps runnable |
| Risk | A validator rule hides real drift | Med | One clearly marked class per rule, with a test; never a broad suppression |
| Risk | Phase 001 restores a `version:` line in the same files | Low | That edit is in the frontmatter and these are body edits, so the merge is line-disjoint |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The validator still exits 0 under `--strict`; the warning stays report-only.
- **NFR-R02**: The count is reproducible: the same tree always prints the same number.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A path that resolves from a skill's `runtime/` folder but is written as `tests/...`: corrected to the path that resolves from a base the validator tries.
- A path into an external project, such as the Webflow `a_nobel_en_zn` tree: rewritten so it does not read as a repo path, or listed in Remaining.

### Error Scenarios
- A spec packet that was archived under `z_archive/`: corrected to its archived path when it exists, otherwise removed.
- A placeholder such as `001-alpha/goal.md` in a sandbox walkthrough: rewritten as plain text or marked as a sandbox path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 258 warnings in 28 packages, doc edits only |
| Risk | 6/25 | Report-only warning, no runtime code unless the validator changes |
| Research | 8/20 | Each removed target needs a successor lookup |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
