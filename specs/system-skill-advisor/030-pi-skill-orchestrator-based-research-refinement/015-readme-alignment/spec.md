---
title: "Feature Specification: README Alignment for the Root and Skill Advisor READMEs"
description: "The root README and the skill advisor README carry claims the repository no longer matches: stale counts, renamed commands, removed files and behavior that changed. This phase checks every claim against its source, fixes each confirmed drift and records the rest."
trigger_phrases:
  - "root readme alignment"
  - "skill advisor readme alignment"
  - "readme claim ledger"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: README Alignment for the Root and Skill Advisor READMEs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-changelog-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every confirmed drift is fixed or recorded, both READMEs pass `validate_document.py` and the HVR scan, and packet 030 validates strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of packet 030. After phase 14 the operator asked whether the root README and the skill advisor README still match the repository.

**Scope Boundary**: the two READMEs only. A drift found in any other document is reported, not fixed.

**Dependencies**:
- The sources each claim names: code, configs, command docs, skill docs and git history.
- `validate_document.py` and `hvr_scan.py` from sk-doc, and the frontmatter versioning standard for the advisor README `version`.

**Deliverables**:
- Both READMEs corrected where a source confirms the drift.
- `evidence/claim-ledger.md`, which lists every drift with its evidence and what was done.

**Changelog**:
- This phase changes documentation only. It adds no changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README says `validate.sh` runs 38 rules and the command library has 32 entry points, where the registry holds 40 rules and `.skilled/commands` holds 36 entry points. It names `/create:sk-skill` and `/create:testing-playbook`, which do not exist, lists a `CLAUDE.md` the repository removed and tells a new user to run `npm install` at a root that has no `package.json`. The skill advisor README places every runtime adapter under its own `hooks/` folder, while the Codex, Cursor, Devin and Claude entry shims live in system-spec-kit.

### Purpose
A reader of either README can act on what it says without meeting a count, a name, a path or a behavior the repository contradicts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Check the claims in both READMEs against their sources. Four read-only agents split the root README, and the orchestrator checks the skill advisor section and the advisor README itself.
- Confirm each suspected drift at its cited source before any edit, and fix the confirmed ones in place without changing the README structure.
- Clear the HVR hard blockers the scan finds in the two files, so each edited file ends with none.
- Set the advisor README `version` under the frontmatter versioning standard.

### Out of Scope
- Drift in other documents, such as install guides or reference docs. It goes to the ledger as a follow-up.
- Repository defects a claim exposes, such as a file that should be tracked. They go to the ledger as follow-ups.
- Rewriting sections for style, or adding coverage the READMEs never claimed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Fix each confirmed drift |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | Fix each confirmed drift, clear the hard HVR blockers and set `version` |
| `015-readme-alignment/evidence/` | Create | Baselines, the claim ledger and the final checks |
| `../goal.md` | Modify | Bind this phase's goal and keep the durable slice within 4,000 characters |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every suspected drift is confirmed or rejected at its source before an edit | Each ledger row names the file and line or command output that decided it |
| REQ-002 | Every confirmed drift is fixed, and each fix is rechecked against its source after the edit | Each fixed ledger row is marked rechecked |
| REQ-003 | Both READMEs stay structurally valid | `validate_document.py --type readme` reports zero issues on each |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No HVR hard blocker remains in either README | `hvr_scan.py` reports `hard blockers: 0` on each |
| REQ-005 | The advisor README `version` follows the versioning standard | `frontmatter-version.mjs compute` derives the value the file carries |
| REQ-006 | Drift outside the two READMEs is recorded, not fixed | The ledger lists each follow-up with its source |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No ledger row stays unresolved: each is fixed, kept with a reason or recorded as a follow-up.
- **SC-002**: `validate.sh` on packet 030 with `--strict --recursive` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An agent's verdict is wrong and a correct claim gets rewritten | Med | Each verdict is a hypothesis until the orchestrator opens the cited source |
| Risk | A fix states a new claim nobody checked | Med | Each fixed line is rechecked against its source after the edit |
| Risk | A fresh-clone step cannot be run here, because it installs packages | Low | Those fixes follow the manifests and build scripts, and the ledger marks them inferred |
| Dependency | Other sessions have uncommitted files in the tree | Low | Stage only this phase's paths by name |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose this phase for the work and asked for a push to main when it is done.
<!-- /ANCHOR:questions -->

---
