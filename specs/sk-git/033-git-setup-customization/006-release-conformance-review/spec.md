---
title: "Feature Specification: Phase 6: release-conformance-review"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "release conformance review"
  - "phase 6 release conformance review"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: release-conformance-review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-10-16 |
| **Branch** | `scaffold/006-release-conformance-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-setup-check-hardening |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Deep review of the v4.0.0.11 work (/doctor:git setup and its hardening) for conformance with the sk-doc authoring modes, sk-code-opencode and cross-repo references specification.

**Scope Boundary**: Read-only review of the files in `goal-file-manifest.txt`; writes stay inside this phase folder.

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.11 release shipped the `/doctor:git setup` command and its hardening across code, a command router, skill docs, playbooks, catalogs, changelogs and cross-repo indexes. Nobody has yet checked each of those artifacts against its own sk-doc authoring mode or the sk-code-opencode standards, or confirmed that every repo surface listing doctor commands and `/doctor:git` targets names `setup` correctly.

### Purpose
A two-lineage deep review (cli-codex gpt-6-luna and cli-pi deepseek-v4.1-flash, five iterations each) produces a review report with path:line findings on standards conformance, correctness, traceability and maintainability for every file listed in `goal-file-manifest.txt`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Review, read-only, every file in `goal-file-manifest.txt`: the setup-check script and its test, the gate-inputs workflow and script with its test, the `/doctor:git` router, YAML, presentation and routes, the sk-git SKILL.md, README, commit template, playbook scenario and index, catalog leaf and index, hooks README, the cross-repo indexes (root README, commands README, spec-kit doctor catalog and playbook README, Hermes sk-git mirror) and both changelogs.
- Judge each artifact against its sk-doc authoring mode contract (`sk-create-command`, `sk-create-manual-testing-playbook`, `sk-create-feature-catalog`, `sk-create-readme`, `sk-create-skill`, `sk-create-changelog`, the Human Voice Rules in `sk-create-with-human-voice`) and code against `sk-code/sk-code-opencode` (SKILL.md section 3, `assets/checklists/javascript-checklist.md` and `shell-checklist.md`, the shared references).
- Check that every repo surface listing doctor commands, sk-git surfaces or `/doctor:git` targets names `setup` correctly, that every cited path and command exists and runs as written, and that the root README points to it where a user would look.
- Run the repo's own validators where they exist: `.skilled/skills/sk-doc/scripts/validate_document.py`, `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`, the playbook and catalog validators, `.skilled/commands/doctor/scripts/route-validate.sh` and the sk-code drift guards.
- Dimensions: correctness, traceability, maintainability, standards conformance. Every finding cites path:line with a concrete failure case.

### Out of Scope
- Fixing any finding - this phase reports; remediation is a later `/speckit:plan`.
- Files outside the manifest, except to confirm a cited path or a cross-reference.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `goal-file-manifest.txt` | Create | Review scope, one repo-relative path per line |
| `review/` | Create | Deep-review packet: lineages, merged registry and `review-report.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---


