---
title: "Feature Specification: Phase 5 — Verify and Enforce"
description: "After population, the standard must be enforced: validators flip to error-on-absent version everywhere in scope, a CI/validation gate blocks unversioned docs, affected skill changelogs are updated, and completion metadata is reconciled."
trigger_phrases:
  - "verify and enforce version"
  - "version CI gate"
  - "required version enforcement"
  - "frontmatter version changelog"
  - "completion reconcile version"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-frontmatter-versioning/005-verify-and-enforce"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Flipped validators to required and added the CI gate; full-corpus gate green"
    next_safe_action: "Phase complete; commit the working tree when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-verify-and-enforce"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The hard required-everywhere gate is sequenced last, after the corpus carries versions."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5 — Verify and Enforce

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-apply-catalogs-and-playbooks |
| **Successor** | None |
| **Handoff Criteria** | Full sweep green; gate blocks unversioned in-scope docs; changelogs + completion reconciled |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Skill Frontmatter Versioning specification.

**Scope Boundary**: enforcement + verification + changelog/completion. Flips the hard required-everywhere gate that phase 1 deferred until the corpus was populated.

**Dependencies**:
- Phases 1-4 complete (standard, engine, core + corpus populated).

**Deliverables**:
- Validators error on missing/malformed version for in-scope classes; a CI/validation gate added; affected skill changelogs updated; full validation sweep green; completion metadata reconciled.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Populating the corpus is not enough — without enforcement, new docs would drift back to no version. The validators must flip from format-check to hard error-on-absent for in-scope classes, a gate must block regressions, the changed skills (notably sk-doc) need changelog entries, and the spec's completion metadata must be reconciled.

### Purpose
The version standard is enforced: a gate blocks any in-scope doc missing or malformed version, the full validation sweep is green, affected changelogs record the change, and the spec closes with reconciled completion metadata.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flip `quick_validate.py` + `package_skill.py` to error-on-absent version for in-scope classes.
- Add a CI/validation gate that blocks unversioned in-scope docs.
- Update affected skill changelogs; run the full validation sweep; reconcile spec completion metadata.

### Out of Scope
- Out-of-scope doc classes (commands, agents, standalone install_guides) — the gate is scoped to in-scope classes only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/scripts/{quick_validate.py,package_skill.py}` | Modify | Error on missing/malformed version |
| CI/validation gate config | Modify/Create | Block unversioned in-scope docs |
| `.opencode/skills/*/changelog/v*.md` | Create | Record the version change for affected skills |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Validators + a gate block any in-scope doc missing/malformed version; full sweep green | Removing a version fails the gate; restoring it passes; `validate.sh --strict` exits 0 on parent + children |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Affected skill changelogs updated; spec completion metadata reconciled | Changelog entries present for changed skills; spec/plan/tasks/checklist completion states agree |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The gate blocks an in-scope doc with no version and passes once it has one.
- **SC-002**: `validate.sh --strict` exits 0 on the parent and all five children.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Gate red-flags out-of-scope classes (commands/agents/install_guides) | Med | Scope the gate to in-scope classes only |
| Dependency | Phases 3-4 fully populated | High | Do not flip the hard gate until the corpus carries versions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. CI gate mechanism (validate.sh hook vs separate lint) chosen during implementation.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
