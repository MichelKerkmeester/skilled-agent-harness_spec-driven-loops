---
title: "Feature Specification: Phase 7: review-remediation"
description: "The v4.0.0.11 release-conformance review left one P1 and 24 P2 findings against the /doctor:git setup surfaces. This phase verifies each one against the code and fixes it, or records it as rejected with evidence."
trigger_phrases:
  - "review remediation"
  - "phase 7 review remediation"
  - "doctor git setup conformance fixes"
  - "sk-git skill word limit"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: review-remediation

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
| **Phase** | 7 of 7 |
| **Predecessor** | 006-release-conformance-review |
| **Successor** | None |
| **Handoff Criteria** | Every finding in `../006-release-conformance-review/review/review-report.md` is fixed or rejected with evidence, and every gate in section 5 passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Fix the P1 and P2 findings of the v4.0.0.11 conformance review: the sk-git SKILL.md word limit, voice-rule punctuation in the touched docs, stale playbook counts, feature catalog gaps, root README verdict lines, three battery checks and the git.md command contract specification.

**Scope Boundary**: The 25 findings F-01 to F-25 of the phase 6 review report and the files they cite. Nothing else in those files changes.

**Dependencies**:
- The phase 6 review report and its findings registry, read as the finding source.
- A parallel build on `specs/system-skill-advisor/035-doctor-command-routing` that owns the advisor code, `doctor-setup.yaml`, `setup.md`, `_routes.yaml` and the root README command counts. Shared files get a `git diff` check and a minimal edit.

**Deliverables**:
- A packaged sk-git skill under the 5,000-word limit, with an accurate playbook census and a runnable validation command.
- Docs that pass the Human Voice Rules hard-blocker scan, and accurate playbook, catalog and README statements.
- Three setup-check probes that fail closed, each with a test that failed before the fix.
- A `/doctor:git` router that meets the sk-create-command contract.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The release-conformance review of `/doctor:git setup` returned CONDITIONAL. The documented sk-git package check fails at 5,038 words against a 5,000 maximum. Six docs carry Human Voice Rules punctuation blockers, the playbook, catalog and root README state stale or conflicting facts, and three setup-check probes can report PASS for a state they never confirmed.

### Purpose
Every finding is either fixed with a check that proves it or rejected with evidence, so the release surfaces pass their own sk-doc and sk-code-skilled gates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 25 findings in `../006-release-conformance-review/review/review-report.md` section 3, F-01 to F-25.
- Same-class defects inside a cited file where the finding names the class, such as a second stale scenario count in the playbook index.
- A test per code fix in `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`, with a mutation check.
- The Hermes mirror refresh that follows a sk-git `SKILL.md` change.

### Out of Scope
- Defects outside the cited files. They are recorded, not fixed.
- The parallel packet's files: advisor code and docs, `doctor-setup.yaml`, `setup.md`, `doctor-setup-presentation.txt`, `_routes.yaml` and the root README command count lines.
- Commits, pushes, trigger-index generation and track-root refreshes. The operator owns those.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/SKILL.md` | Modify | Word limit, playbook census and command, HVR punctuation (F-01, F-10, F-11, F-12) |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modify | Category list, section ranges and counts, wave plan, HVR (F-13 to F-16) |
| `.skilled/skills/sk-git/feature-catalog/feature-catalog.md` | Modify | Section 3 heading, DEGRADED verdict, HVR (F-18 to F-20) |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Modify | Status-line counters (F-25) |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modify | HVR punctuation (F-21) |
| `.skilled/skills/sk-git/README.md` | Modify | Worktree reaper row (F-17) |
| `.skilled/commands/README.txt` | Modify | HVR semicolons (F-22) |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Modify | HVR semicolons (F-06) |
| `.skilled/commands/doctor/git.md` | Modify | Description, `--target` binding, gate placement (F-05, F-07, F-08) |
| `.skilled/commands/doctor/scripts/README.md` | Modify | Test coverage claim (F-09) |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Allowlist probe, hook executability, adapter registration (F-02, F-03, F-04) |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | One test per code fix |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modify | Name `/doctor:sk-code` (F-23) |
| `README.md` | Modify | Verdict set and status counters (F-24, F-25) |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modify | Pass `--tool` only for the six runtimes the battery accepts (coordinator request) |
| `.hermes/skills/sk-git/SKILL.md` | Regenerate | Hermes mirror of the sk-git SKILL.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The sk-git package check passes (F-01). | `package_skill.py .skilled/skills/sk-git --check` prints `Result: PASS`, so `.skilled/skills/sk-git/README.md:271` is true again. MET: `Result: PASS`, 4,990 words. |
| REQ-002 | Every finding is fixed or rejected with evidence. | `tasks.md` carries one task per finding, each closed with its evidence or its rejection reason. MET: 25 fixed, 0 rejected, see `tasks.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The six docs named in F-06, F-12, F-16, F-20, F-21 and F-22 carry no HVR hard blocker, with commands, code spans and paths unchanged. | `hvr_scan.py` reports `hard blockers: 0` for each file. MET: 0 on all six and on every other touched doc. |
| REQ-004 | The sk-git playbook index states its real categories, ranges, counts and wave plan, and SKILL.md states the real census and a runnable validation command (F-10, F-11, F-13, F-14, F-15). | The playbook package validator passes, and the SKILL.md command runs and passes as written. MET: `PASS package=sk-git scenarios=46 categories=9`. |
| REQ-005 | The feature catalog numbers its sections in order and names the DEGRADED verdict (F-18, F-19). | `validate_document.py --type feature_catalog` reports no `non_sequential_numbering`, and the catalog validator passes. MET: 0 issues, catalog validator PASS. |
| REQ-006 | The README, catalog leaf and overview statements match the battery (F-09, F-17, F-23, F-24, F-25). | Each statement matches the cited code or tree on a re-read. MET: re-read after each dispatch, and a second-model review. |
| REQ-007 | A probe that cannot run reports UNKNOWN, a hook that is not executable fails, and an adapter file that names the tokens without registering a handler fails (F-02, F-03, F-04). | One new test per fix fails on the old code and passes on the new code, and reverting the fix makes it fail again. MET: all three negative controls failed first, all mutants killed. |
| REQ-008 | `/doctor:git` meets the sk-create-command contract (F-05, F-07, F-08). | `validate_document.py --type command` reports no description warning, the gate binds `--target=<name>`, and the gate is the first content after the frontmatter. MET: 0 issues, gate first. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py .skilled/skills/sk-git --check` prints `Result: PASS`.
- **SC-002**: The doctor test runner passes with the three new tests added, and `route-validate.sh`, `command-catalog-mirror-check.cjs` and `sync-runtime-mirrors.cjs --check` pass.
- **SC-003**: `hvr_scan.py` reports zero hard blockers, and `validate_document.py` reports no new issue, on every touched doc.
- **SC-004**: The sk-git playbook and catalog validators pass, the sk-code drift guards show no new failure against the baseline, and `validate.sh specs/sk-git/033-git-setup-customization --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The parallel 035 build edits files near this scope | Med | `git diff` before each shared edit, minimal edits, and no stash, restore or reset on files this phase did not change |
| Risk | A punctuation pass changes a command, code span or path | Med | Every dispatch diff is read line by line, and anything outside the brief is reverted |
| Risk | Stricter probes turn a healthy repository red | Med | The battery runs against this repository after each code fix and must still print `STATUS=OK` |
| Risk | The executor model edits outside its brief | Low | One change per dispatch, a backup before each, and a diff check after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose to fix every finding, and the execution model is set.
<!-- /ANCHOR:questions -->

---
