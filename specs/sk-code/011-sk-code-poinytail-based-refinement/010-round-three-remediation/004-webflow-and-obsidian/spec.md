---
title: "Feature Specification: Phase 4: webflow-and-obsidian"
description: "The shipped Webflow templates point adopters at a references/webflow/ folder that no longer exists, the Webflow guides cite moved section numbers and stale link labels, and the Obsidian SKILL offers three checklists the packet never shipped."
trigger_phrases:
  - "webflow and obsidian"
  - "phase 4 webflow and obsidian"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: webflow-and-obsidian

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
| **Branch** | `scaffold/004-webflow-and-obsidian` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-quality-mode |
| **Successor** | 005-opencode-and-guards |
| **Handoff Criteria** | Every pointer in the shipped Webflow templates opens a real file, the Obsidian asset list names only shipped checklists, and the router-sync guard still passes 5/5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Round-three remediation child specification.

**Scope Boundary**: Files under `.skilled/skills/sk-code/sk-code-webflow/` and `.skilled/skills/sk-code/sk-code-obsidian/` only.

**Dependencies**:
- Findings f-iter013-001, f-iter013-002, f-iter013-003, f-iter004-001, f-iter004-005, f-iter005-001, f-iter005-002 and f-iter015-001 in `../../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/iterations/`
- The round-two follow-up on the Obsidian playbook root recorded in `../../009-round-two-follow-ups/goal.md`

**Deliverables**:
- Nine template pointers repointed to real files
- Five section pointers and two link labels corrected in the Webflow references
- The Webflow comment budget labelled as this surface's setting
- An Obsidian section 4 asset list that names only shipped checklists
- A playbook root that the document validator reports as valid
- Obsidian playbook and README prose and three Webflow dev-workflow link labels that name current files
- Version bumps and changelog entries for both packets

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five copy-paste templates under `sk-code-webflow/assets/templates/` cite `references/webflow/...` in nine places, and that folder does not exist, so the dead pointers travel into every project that copies a template. The Webflow HTML style guide points at `init-dom-error-and-async.md §13` for the Action Routing Pattern (twice) and at `quick-reference.md §10` for form validation classes, and neither section exists. Two Webflow shared-tier links show a pre-move path as their label, the Webflow comment budget reads as a universal rule, and the Obsidian `SKILL.md` section 4 offers three checklists that the packet never shipped. The Obsidian playbook root also fails `validate_document.py` with a missing overview section.

### Purpose
Every pointer a reader or adopter follows in these two packets opens a file and section that exist, and the round-two playbook issue is closed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint the nine legacy `references/webflow/` rows in the five shipped templates to full repository paths that exist, and correct the CSS quick-reference section number on the same template row
- Correct the three dead `§13` and `§10` pointers in the HTML style guide, the dead `§3` pointer in the JavaScript quick reference and the legacy `references/webflow/css/quick-reference.md §5` pointer in the CSS quality standard
- Label the two Webflow "5 comments per 10 lines" rows as the Webflow setting and link the shared comment rule
- Correct the stale link labels in `references/shared/enforcement.md` and `references/shared/cross-language-rules.md`, and the "both surfaces" wording on the same line
- Replace the Obsidian section 4 asset list with the seven shipped checklists
- Add a numbered overview heading to the Obsidian playbook root
- Replace the old reference and checklist names in the Obsidian playbook honesty note, four scenario steps and two README pointers, and the three old underscore labels in `references/shared/dev-workflow/common-commands.md`
- Bump `sk-code-webflow` to 1.1.1.0 and `sk-code-obsidian` to 0.1.3.0 and add one changelog entry each

### Out of Scope
- The shared comment-density rule in `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` - owned by child 001
- The OpenCode half of the comment-budget and link-label findings - owned by child 005
- Old underscore link labels in other Webflow references (about sixty rows, for example `references/deployment/cdn-deployment.md:314`) - no finding or orchestrator instruction names them, and they are recorded as a known limitation
- The `document_type_fallback` warning on the playbook root - decided by the validator in `sk-doc`, not by the file
- Regenerating Hermes copies - the orchestrator runs that generator once after every build

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js` | Modify | One legacy pointer to the JavaScript style-guide folder |
| `.skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.css` | Modify | One legacy pointer |
| `.skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html` | Modify | Two legacy pointers, one with a moved section |
| `.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html` | Modify | Four legacy pointers, one with a wrong section number |
| `.skilled/skills/sk-code/sk-code-webflow/assets/templates/head-footer-code-template.html` | Modify | One legacy pointer |
| `.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md` | Modify | Three dead section pointers |
| `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md` | Modify | Comment budget label and one dead section pointer |
| `.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md` | Modify | Comment budget label and one stale link label |
| `.skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md` | Modify | One legacy pointer with a moved section |
| `.skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md` | Modify | One stale link label |
| `.skilled/skills/sk-code/sk-code-webflow/SKILL.md` | Modify | Version 1.1.0.0 to 1.1.1.0 |
| `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md` | Create | Changelog entry |
| `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` | Modify | Section 4 asset list and version 0.1.2.0 to 0.1.3.0 |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modify | Numbered overview heading and honesty note with current names |
| `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md` | Create | Changelog entry |
| `.skilled/skills/sk-code/sk-code-obsidian/README.md` | Modify | Two old reference names |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md` | Modify | Triage step names current files |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md` | Modify | Triage step names current files |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md` | Modify | Triage step names current files |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md` | Modify | Expected result names current files |
| `.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md` | Modify | Three old underscore link labels |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md` | Modify | Scope amendment after verification: two lines still called the SKILL.md map stale after this child fixed it |
| `.skilled/skills/sk-code/sk-code-webflow/references/performance/interaction-gated-loading.md` | Modify | Scope amendment after verification: a pattern path and a checklist label that did not resolve |
| `.skilled/skills/sk-code/sk-code-obsidian/references/release/release-verification.md` | Modify | Scope amendment after verification: a setup path that did not resolve, flagged by the doc-claims checker the parent goal requires at 4/4 |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md` | Modify | Scope amendment after verification: a link label that did not resolve |
| `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md` | Modify | Scope amendment after verification: a link label that did not resolve |
| `.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md` | Modify | Scope amendment after verification: retired packet name in the title and intro |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template pointers resolve | `rg -n 'references/webflow' .skilled/skills/sk-code/sk-code-webflow/assets/templates/` prints nothing and exits 1, and each of the nine full-path pointers in the templates passes `test -e` from the repository root |
| REQ-002 | Section pointers resolve | No `§13 Action Routing`, `§13 handles`, `§10 Form Validation` or CSS `quick-reference.md §3 Form` pointer remains in the Webflow packet, and the replacement pointers name `shared-listener-and-weakmap.md` section 2, JavaScript quick reference section 5 and CSS quick reference sections 4 and 6, whose headings exist |
| REQ-003 | Obsidian asset list is real | `rg -n 'renderer-implementation-checklist\|comment-grammar-checklist\|debug-checklist' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md` prints nothing and exits 1, and every `assets/*.md` named in section 4 exists, seven in all |
| REQ-004 | Routing inputs stay fresh | The router-sync guard prints `router-sync: 5/5 checks passed`, the compiled-route guard prints `sk-code` as `fresh`, the leaf manifest check prints `leaf-manifest.json OK`, and the Obsidian playbook package validator prints its baseline `PASS` line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Webflow comment budget labelled | Both "5 comments per 10 lines" rows carry the words `Webflow setting` and link `../../../shared/references/universal/code-style-guide.md` section 4 |
| REQ-006 | Shared-tier link labels match targets | `rg -n 'assets/webflow/checklists\|\[.\.\./\.\./universal/code-style-guide\.md.\]\|for both surfaces' .skilled/skills/sk-code/sk-code-webflow/references/shared/` prints nothing and exits 1 |
| REQ-007 | Playbook root passes the document validator | `validate_document.py` on the Obsidian playbook root prints `VALID`, no `missing_required_section`, `Total issues: 1` from the `document_type_fallback` warning only, and exits 0 |
| REQ-008 | Versions and changelogs | `version: 1.1.1.0` in the Webflow `SKILL.md` and its new changelog, `version: 0.1.3.0` in the Obsidian `SKILL.md` and its new changelog, every edited Markdown file still `VALID`, and no voice-scan hard-blocker count rises |
| REQ-009 | Checker fixtures and drift guards hold | The Webflow known-bad fixture still exits 1 with `Failed:  4/4`, the known-good fixture still exits 0 with `Passed:  2/2`, and `run-all-drift-guards.sh` still prints `Errors: 0` |
| REQ-011 | Old names gone | `rg -n 'single-stylesheet-ownership\|screenshot-fixture-harness\|obsidian-api-boundary\|renderer-implementation-checklist\|comment-grammar-checklist\|debug-checklist' .skilled/skills/sk-code/sk-code-obsidian --glob '!**/changelog/**'` and `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md` each print nothing and exit 1 |
| REQ-010 | Scope holds | Only the twenty-one files in the Files to Change table differ from the Phase 1 `git status` baseline, and no file under `.hermes/` is written by the builder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every file and section pointer in the five shipped templates and the HTML style guide opens something that exists.
- **SC-002**: No line in Obsidian `SKILL.md` section 4 names a file that the packet does not ship.
- **SC-003**: Every routing and drift gate run in Phase 1 returns the same verdict after the edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 001 edits the shared comment rule in `shared/references/universal/code-style-guide.md` | Med | The two Webflow rows link the file and its section 4 COMMENTING, which child 001 extends rather than renames (plan.md Handoffs) |
| Risk | A template pointer form that resolves in this repository but not in an adopter project | Low | Pointers use the full `.skilled/skills/sk-code/sk-code-webflow/references/...` path, the same form the Webflow scripts already print in their usage lines |
| Risk | The new numbered heading changes how the playbook package validator reads the root | Low | A copy of the edited package passed the validator with `violations=0 warnings=0` during planning |
| Risk | Sibling builds leave Hermes copies drifted while this phase runs | Low | The builder runs only `--check` and compares against its Phase 1 baseline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Every design choice is recorded as a decision in plan.md.
<!-- /ANCHOR:questions -->

---
