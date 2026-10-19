---
title: "Feature Specification: Phase 9: second-review-remediation"
description: "The second review of v4.0.0.11 found five P1 and fourteen P2 defects in the /doctor:git setup battery, its repairs, its tests and the docs around it. This phase fixes every one the code confirms and records any it disproves."
trigger_phrases:
  - "second review remediation"
  - "phase 9 second review remediation"
  - "git setup battery review fixes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: second-review-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-out-of-scope-cleanup |
| **Successor** | None |
| **Handoff Criteria** | Every P1 and P2 in `../scratch/review-v4.0.0.11.md` is fixed with a test, or rejected with evidence, and every gate in the plan passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the git setup customization packet. It closes the second review of v4.0.0.11 (`../scratch/review-v4.0.0.11.md`): wrong battery verdicts outside this checkout, repair lines that break, test gaps, the missing Hermes runtime, the input-gate drift and the doc drift.

**Scope Boundary**: the setup battery and its tests, the `/doctor:git` command files, the sk-git leg line of `doctor-setup.yaml`, the sk-git docs, the four commands whose input gate sits inside section 1, the router template, the root README lines on `/doctor:git` and the stale 008 limitation. Everything the parallel 035 build owns stays out.

**Dependencies**:
- The review document `../scratch/review-v4.0.0.11.md`, read as the finding list and checked against the code before each fix.
- The external executors named by the operator: Luna through cli-codex and DeepSeek through cli-pi.

**Deliverables**:
- A battery whose rows match what git, the hooks and the advisory actually do in any repository.
- A test for every code fix, each proven by a mutation check.
- Docs and command files that agree with the code.

**Changelog**:
- The coordinator writes the changelog entries after this phase. This phase lists the user-visible changes in its report and does not edit a changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/doctor:git setup` battery passes on its own checkout but gives wrong answers elsewhere. It calls a clone's own hooks untrusted while they run, validates its own rule file instead of the one the advisory reads, passes a registration whose script is missing, prints repairs that break on a path with a space and fails on a stray `.DS_Store` with no repair that clears it. Fourteen smaller defects sit in the same code, its tests and the docs that describe it.

### Purpose
Every battery row tells the truth about the inspected repository, and every repair it prints works when pasted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five P1 and fourteen P2 findings in `../scratch/review-v4.0.0.11.md`.
- A failing test for each code fix, written as a fixture under a fresh temporary folder.
- Hermes support in the battery and in the two workflows that run it.
- The doc lines the findings name, and the lines that repeat the same wrong claim.

### Out of Scope
- Changelog entries, because the coordinator writes them after the phase.
- Advisor code and docs, `_routes.yaml`, `setup.md`, `doctor-setup-presentation.txt`, the doctor scripts README and the advisor leg of `doctor-setup.yaml`, because the parallel 035 build owns them.
- Commits, pushes and trigger-index rebuilds, which the operator runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | The battery fixes for every code finding |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | A test per code fix, and the two round trips repaired |
| `.skilled/commands/doctor/git.md` | Modify | `--tool` names hermes |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modify | Hermes, and step wording that matches the code |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Modify | A detail column, and the FAIL listing rule |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modify | The sk-git leg line passes `--tool=hermes` |
| `.skilled/commands/deep/research.md`, `deep/review.md`, `deep/ai-council.md`, `prompt/improve.md` | Modify | Input gate moved before section 1 |
| `.skilled/skills/sk-git/SKILL.md`, `README.md`, `scripts/hooks/README.md` | Modify | Seven runtimes, and one registration entry per runtime |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Modify | The environment claim |
| `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md` | Modify | hermes in the runtime list |
| `README.md` | Modify | The trust, shared files and verify lines on `/doctor:git` |
| `specs/sk-git/033-git-setup-customization/008-out-of-scope-cleanup/implementation-summary.md` | Modify | The stale gate limitation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The trust row reports a repository whose installed hooks link into its own tree as running its own scripts (P1-1) | A fixture whose hooks link into its own tree gets trust PASS. Reverting the fix fails the test |
| REQ-002 | advisory-rules validates the inspected repository's `hard-rules.json`, the file the advisory reads, and its repair names that path (P1-2) | A repository rule file naming an unknown check fails the row. A missing file is reported. The round trip edits the printed path |
| REQ-003 | ai-tool-hooks counts a registration only when the advisory script its command runs exists (P1-3) | A registration whose script is missing fails the row |
| REQ-004 | Every path in a repair line is shell-quoted (P1-4) | The hooks repair run from an install path with a space sets the full path and turns the row PASS |
| REQ-005 | hooks expects only real git hook names, the set the installer links (P1-5) | A `.DS_Store` in the hook folder does not fail the row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | A helper exit other than 0 or 1, or `main` refused, makes allowlist UNKNOWN (P2-1) | A fake helper that exits 2 gives UNKNOWN |
| REQ-007 | The safe git environment is applied once in `main()` and covers in-process modules (P2-2, part of P2-14) | An exported `GIT_DIR` no longer steers the standards row |
| REQ-008 | The battery accepts `--tool=hermes` and checks the `repo-guards` adapter, and both workflows pass it (P2-3) | `--tool=hermes` on this checkout ends STATUS=OK |
| REQ-009 | Claude's `"*"` matcher counts as match-all (P2-4) | A `"*"` matcher passes |
| REQ-010 | A fully muted advisory is DEGRADED with an unset repair (P2-5) | `SK_GIT_PREFLIGHT_DISABLED=1` or `SKGIT_ADVISORY=0` gives DEGRADED |
| REQ-011 | An adapter parse error never prints file bytes (P2-6) | A symlink to a non-JSON file prints `not valid JSON` and none of its text |
| REQ-012 | The install restore is printed only for paths in HEAD (P2-7) | An uncommitted install gets the reinstall wording |
| REQ-013 | A dangling symlink as the worktree base fails (P2-8) | The fixture fails worktrees |
| REQ-014 | `--json` keeps every detail line (P2-9) | A JSON row with more than ten details is not cut |
| REQ-015 | The rules and Commit-Id repairs use the install-root label (P2-10) | No repair hardcodes `.skilled/` |
| REQ-016 | The four gated commands put the input gate after the H1 and purpose line, before section 1, and the 008 limitation is current (P2-11) | Each gate sits before `## 1.` and `deep/research.md` loads no workflow before it |
| REQ-017 | The setup YAML and presentation match the code and show the failing detail (P2-12) | YAML step 2 describes each row as the code checks it, and the result table has a detail column |
| REQ-018 | The test gaps the review lists are covered and the dead fsmonitor assertion is resolved (P2-13) | Each gap has a test that fails against the old code |
| REQ-019 | Usage errors say why, and invalid JSON in `hard-rules.json` has its own message (P2-14) | A non-repository and a bad flag print different reasons |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git-setup-check.cjs --tool=claude` and `--tool=hermes` on this checkout both end `STATUS=OK checks=11` with exit 0.
- **SC-002**: The doctor test runner passes with more tests than the baseline of 334, and each code fix has a mutation check whose test fails with the old code.
- **SC-003**: route-validate, the sk-git package check, the playbook validator, the Hermes sync check, the mirror check, the drift guards and strict spec validation all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The parallel 035 build edits shared files such as `doctor-setup.yaml` and `README.md` | Med | Run `git diff` on a shared file before each edit and change only the owned line |
| Risk | sk-git `SKILL.md` sits at 4,990 of 5,000 words | Med | Rephrase the runtime line so the Hermes addition costs no net words |
| Risk | An external executor edits outside its brief | Med | Back up each target, diff after each dispatch and revert anything outside the brief |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose every finding, and the executors and file ownership are set in the brief.
<!-- /ANCHOR:questions -->

---
