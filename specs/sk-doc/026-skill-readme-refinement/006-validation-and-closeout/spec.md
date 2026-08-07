---
title: "Feature Specification: Phase 006: fleet-wide validation and closeout of the skill README program"
description: "Validate every rewritten skill README (standalone and child modes) with the sk-doc README validator, run the link guard per changed skill, grep HVR violations across all rewrites, reconcile versions and changelog entries, fix any failure, and close out the packet phase docs with evidence."
trigger_phrases:
  - "fleet validation"
  - "readme closeout"
  - "phase 006 validation"
  - "readme program closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/006-validation-and-closeout"
    last_updated_at: "2026-08-05T08:09:02Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 006 fleet validation and closeout specification"
    next_safe_action: "Execute the validation inventory and per-surface gate tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-validation-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 006: fleet-wide validation and closeout of the skill README program

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (026-skill-readme-refinement) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `005-mode-child-readme-revisit` |
| **Successor** | `007-fix-post-closeout-gates-for-readme-fleet` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 001 through 005 refined the shared README template, created the parent-skill README template, updated the creation workflow, and rewrote every standalone and child-mode skill README on the new standard. None of those phases proved the whole fleet at once. No phase has run the README validator across every rewritten README in one pass, guarded links per changed skill, grepped HVR violations across all rewrites, or reconciled version fields against changelog entries. Without this phase the packet cannot claim the program is complete.

### Purpose

Run the fleet-wide validation gates, fix every failure the gates find, reconcile version and changelog discipline, and close out the packet with evidence. The closeout records the implementation summary, regenerates metadata, and validates every phase folder in the packet.

**End goal:** every rewritten skill README passes the README validator with zero issues, shows zero broken links per changed skill, carries no HVR violations, states a version, and has a changelog entry for its release, all recorded in phase docs that validate with zero errors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Build a validation inventory of every skill README rewritten by phases 004 and 005, split into standalone surfaces and child-mode surfaces.
- Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` across every README in the inventory.
- Run the markdown link guard (`.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`) scoped to each changed skill.
- Grep HVR violations (em dashes, semicolons, Oxford comma patterns, banned words) across all rewritten READMEs, with code-fence lines exempt and recorded.
- Confirm every rewritten README has a version field and a changelog entry for its release.
- Fix any failure the gates find, restricted to READMEs, changelogs, phase docs, and generated metadata.
- Close out: write `implementation-summary.md` with an evidence table, regenerate `description.json` and `graph-metadata.json`, refresh changed leaf manifests, run validate.sh on all packet phases, and confirm `git diff --check` is clean.

### Out of Scope

- Changes to the shared README template, the parent-skill README template, or the creation workflow (owned by phases 001 through 003).
- Changes to any SKILL.md or its routing surface.
- Content rewrites of any README beyond fixing gate failures (rewrites belong to phases 004 and 005).
- READMEs outside the skill README program (benchmark reports, tool READMEs, `node_modules`, `.spec-gate-state` and similar state folders).
- Vault, plugin, or runtime files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/*/README.md` (standalone fleet from phase 004) | Validate / Fix | Every standalone skill README on the refined standard |
| `.opencode/skills/*/*/README.md` (child-mode fleet from phase 005) | Validate / Fix | Every child (mode) skill README on the refined standard |
| `.opencode/skills/*/changelog/*.md` (changed skills) | Validate / Add | Changelog entry for every release version |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/006-validation-and-closeout/spec.md` | Update | Phase spec with validation evidence |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/006-validation-and-closeout/plan.md` | Update | Execution record of the gate sequence |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/006-validation-and-closeout/tasks.md` | Update | Task states T001 through T009 |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/006-validation-and-closeout/checklist.md` | Update | Verification evidence for every CHK item |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/006-validation-and-closeout/implementation-summary.md` | Create | Closeout record with the evidence table |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/006-validation-and-closeout/description.json` | Regenerate | Fresh phase metadata |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/006-validation-and-closeout/graph-metadata.json` | Regenerate | Fresh graph metadata |
| `.opencode/skills/*/leaf-manifest.json` (changed skills) | Regenerate | Reflect final README state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The validation inventory covers the whole rewritten fleet | Inventory lists every README touched by phases 004 and 005 plus any skill README added since, each entry tagged as standalone or child mode, and the count matches `git diff --name-only` across the two phases plus a fresh README scan |
| REQ-002 | README validator passes across the fleet | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` exits 0 and reports VALID with zero issues for every README in the inventory |
| REQ-003 | Link guard passes per changed skill | `check-markdown-links.cjs` scoped to each changed skill reports zero broken links within that skill surface |
| REQ-004 | No HVR violations in rewritten READMEs | Grep for em dashes, semicolons, Oxford comma patterns, and banned words returns zero matches in rewritten README prose, every remaining match sits in a code-fence line and is recorded as exempt |
| REQ-005 | Version and changelog discipline holds | Every rewritten README carries a version field, every release version has a changelog entry, and the frontmatter version check script passes for every changed skill |
| REQ-006 | Every gate failure is fixed and re-verified | Each failure found by REQ-001 through REQ-005 is logged with its root cause, fixed within scope, and its gate re-runs clean before closeout |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Closeout evidence is complete | `implementation-summary.md` exists with an evidence table per gate, `description.json` and `graph-metadata.json` regenerate, validate.sh reports zero errors for every phase folder in the packet, and `git diff --check` exits clean |
| REQ-008 | Scope hygiene holds | `git status` shows changes only in READMEs, changelogs, phase docs, and generated metadata from the Files to Change table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every rewritten skill README in the repo validates with zero issues under `validate_document.py --type readme`.
- **SC-002**: No broken links exist inside any changed skill surface.
- **SC-003**: Every rewritten README states a version and has a changelog entry for its release.
- **SC-004**: The packet closes with an evidence-backed implementation summary, fresh metadata, and zero validate.sh errors across all phase folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 004 and 005 must land first | Inventory has nothing to validate | Gate phase start on both predecessors, derive the inventory from their diffs |
| Risk | Inventory drift while 004 and 005 are in flight | A rewritten README escapes validation | Derive the list from git diffs and re-scan for READMEs at execution time |
| Risk | HVR false positives in code fences and URLs | Valid prose fails the gate | Exempt code-fence lines, record every exemption |
| Risk | Changelog gaps for older releases | Release facts unrecoverable later | Changelog reconciliation task adds entries without altering release facts |
| Risk | Fixes leak into template or workflow files | Phase 006 violates its write boundary | Fixes restricted to READMEs, changelogs, phase docs, generated metadata |
| Risk | Validator or guard behavior shifts | Gate results not comparable across runs | Use the pinned script paths and record script behavior in the baseline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
