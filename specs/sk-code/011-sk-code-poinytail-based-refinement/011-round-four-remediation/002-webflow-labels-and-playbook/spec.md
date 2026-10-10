---
title: "Feature Specification: Phase 2: webflow-labels-and-playbook"
description: "Fifty-nine links in the Webflow references and checklists show an old underscore file name over a target that was renamed, and the Webflow playbook root fails the document validator because it has no numbered overview section."
trigger_phrases:
  - "webflow labels and playbook"
  - "phase 2 webflow labels and playbook"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: webflow-labels-and-playbook

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
| **Branch** | `scaffold/002-webflow-labels-and-playbook` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-review-canary-pins |
| **Successor** | 003-hub-surface-precedence |
| **Handoff Criteria** | The underscore label search prints nothing, every relabelled link opens its target, and the Webflow playbook root validates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Round four children specification.

**Scope Boundary**: Link labels, the playbook root heading, the version line and one changelog, all inside `.skilled/skills/sk-code/sk-code-webflow/`.

**Dependencies**:
- Known Limitations 1 and 4 of `../../010-round-three-remediation/004-webflow-and-obsidian/implementation-summary.md`
- Decisions D5 and D8 of `../../010-round-three-remediation/004-webflow-and-obsidian/plan.md`, the worked example this phase repeats

**Deliverables**:
- 59 link labels that show their target path
- A numbered overview heading in the Webflow playbook root
- Version 1.1.2.0 and its changelog entry

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'` lists 59 rows in 23 files. Each shows a file name from before the reference split, such as `animation_workflows.md`, over a link whose target was renamed and still resolves, so the label tells a reader the wrong file. Separately, `validate_document.py` reports the Webflow playbook root `INVALID` with `missing_required_section: overview`, the defect round three fixed on the Obsidian root.

### Purpose
Every Webflow link label shows the path it opens, and the Webflow playbook root passes the document validator with the same single warning the Obsidian root keeps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Relabel all 59 links in the form round three used in `references/shared/dev-workflow/common-commands.md`: the label is the target path in backticks
- Insert `## 1. OVERVIEW` above the intro paragraph of the Webflow playbook root
- Bump `sk-code-webflow` from 1.1.1.0 to 1.1.2.0 and add `changelog/v1.1.2.0.md`

### Out of Scope
- Link targets, which all resolve today and stay byte for byte the same
- The `document_type_fallback` warning, which `validate_document.py` raises for every playbook root and which `sk-doc` owns
- Hermes copies, the compiled sk-code route and its archive copy, which the orchestrator regenerates after all builds
- Any file outside `.skilled/skills/sk-code/sk-code-webflow/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-webflow/assets/webflow-debugging-checklist.md` | Modify | 1 link label |
| `.skilled/skills/sk-code/sk-code-webflow/assets/webflow-verification-checklist.md` | Modify | 1 link label |
| `.skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` | Modify | 5 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md` | Modify | 3 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md` | Modify | 3 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md` | Modify | 3 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md` | Modify | 3 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/overview-architecture-and-filepond.md` | Modify | 1 link label |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md` | Modify | 3 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md` | Modify | 5 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md` | Modify | 4 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md` | Modify | 4 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/filepond.md` | Modify | 1 link label |
| `.skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md` | Modify | 1 link label |
| `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md` | Modify | 2 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md` | Modify | 5 link labels |
| `.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md` | Modify | `## 1. OVERVIEW` heading |
| `.skilled/skills/sk-code/sk-code-webflow/SKILL.md` | Modify | Version 1.1.2.0 |
| `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No Webflow link label shows an underscore file name | `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'` prints nothing and exits 1 |
| REQ-002 | Each of the 59 relabelled links shows its own target path and that target resolves | The label loop in tasks.md over `scratch/label-rows.txt` prints `59 OK` and no `BAD` line |
| REQ-003 | The Webflow playbook root passes the document validator | `validate_document.py` prints `VALID`, `Total issues: 1` (the `document_type_fallback` warning) and exits 0, and `## 1. OVERVIEW` is line 3 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The Webflow playbook package still validates | `validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook` prints `PASS package=sk-code/sk-code-webflow tier=FAIL_CLOSED scenarios=13 categories=4 operator=13 routing_gold_excluded=0 violations=0 warnings=0` and exits 0 |
| REQ-005 | The packet carries version 1.1.2.0 with one changelog entry | `SKILL.md` and `changelog/v1.1.2.0.md` both read `version: 1.1.2.0`, the changelog is a byte copy of `scratch/units/webflow-changelog-v1.1.2.0.md`, validates `VALID` and has 0 hard blockers |
| REQ-006 | The surrounding gates hold | Drift guards print `run-all-drift-guards: all 4 guards PASSED`, the Webflow checker fixtures keep `bad exit=1` and `good exit=0`, and every edited Markdown file keeps its validator verdict and hard-blocker count |
| REQ-007 | Only the planned files change | `git status --porcelain` over the packet, sorted, equals `scratch/status-expected.txt` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader sees the path each Webflow link opens before following it, in all 59 links that showed an old name
- **SC-002**: The Webflow playbook root validates the same way the Obsidian playbook root does
- **SC-003**: No existing gate changes its verdict: drift guards, checker fixtures, playbook package and the document validator on every edited file
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 005 hardens `verify_doc_claims.cjs` in parallel | A new check could judge the new labels | The new label equals its target, which the existing path check already skips, and every target resolves |
| Dependency | Child 003 owns `shared/references/workflow-*.md`, which three Webflow `references/workflow-*.md` symlinks point at | The before/after diff would show their edits | Every diff in tasks.md excludes `workflow-*.md` |
| Risk | Two identical lines in `scroll-interceptor-and-related.md` | An edit could hit the wrong line | Those units quote the line above as context, and each check reads one line number |
| Risk | A builder misreads a backtick-heavy replacement | A broken label | Each unit is checked on its own line number before the next unit runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The label form, the heading and the version bump follow round three decisions D8, D5 and D6.
<!-- /ANCHOR:questions -->

---

