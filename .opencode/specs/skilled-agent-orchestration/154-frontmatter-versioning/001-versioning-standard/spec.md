---
title: "Feature Specification: Phase 1 — Versioning Standard"
description: "sk-doc templates, references, validators and create-command generators do not define a frontmatter version field for most doc classes, so there is no documented standard for the retroactive pass to conform to or to enforce going forward."
trigger_phrases:
  - "versioning standard"
  - "frontmatter version field"
  - "sk-doc version required"
  - "version derivation spec"
  - "create command version emit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-frontmatter-versioning/001-versioning-standard"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the version standard; added version to sk-doc templates, promoted to required"
    next_safe_action: "Phase complete; commit the working tree when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
      - ".opencode/skills/sk-doc/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-versioning-standard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Version is 4-part X.Y.Z.W and required everywhere in scope (enforcement flip deferred to phase 5)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Versioning Standard

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
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-derivation-engine |
| **Handoff Criteria** | Standard + templates document the required `version` field; validators format-check it when present; parent validates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Skill Frontmatter Versioning specification.

**Scope Boundary**: sk-doc standards, templates, references, validators, and create-command generators only. No edits to the actual skill-doc corpus (phases 3-4) and no engine build (phase 2).

**Dependencies**:
- None — first phase. Reads the existing `sk-doc/assets/frontmatter_templates.md` and the validators to extend them.

**Deliverables**:
- A version-standard reference: 4-part `X.Y.Z.W` semantics + the changelog-anchored derivation rules (`anchor = max(frontmatter, changelog)`; build segment = numstat-gated edit count).
- `version` added to every doc-type template; creation references updated.
- `quick_validate.py` + `package_skill.py` format-check `version` (`X.Y.Z.W`) and document it as required; the hard error-on-absent gate is deferred to phase 5.
- `create:*` generators emit a `version` line.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc owns the frontmatter standard, templates, validators, and `create:*` generators, but `version` is only documented as an optional SKILL.md field. Most doc classes (references, assets, READMEs, feature catalogs, testing playbooks) have no version in their templates, and the validators do not format-check or require it. Without a written standard and generator support, the retroactive pass has nothing to conform to and new docs would keep shipping without a version.

### Purpose
A written, generated version standard exists in sk-doc: every doc-type template emits a 4-part `version`, the creation references document it, the validators format-check it, and the `create:*` generators produce it — so the corpus pass conforms to one contract and new docs are born versioned.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Version-standard reference doc (X.Y.Z.W semantics + changelog-anchored derivation).
- `version` added to `frontmatter_templates.md` and the skill / feature-catalog / testing-playbook templates.
- Creation references updated to document the field.
- `quick_validate.py` + `package_skill.py`: document `version` as required and add an `X.Y.Z.W` format check (validation when present; hard absence gate deferred to phase 5).
- `create:sk-skill`, `create:feature-catalog`, `create:testing-playbook`, `create:folder_readme` emit a `version` line.

### Out of Scope
- Building the derivation engine — phase 2.
- Applying versions to the corpus — phases 3-4.
- Flipping the hard required-everywhere gate + CI — phase 5 (after the corpus is populated).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | Modify | Add `version` to all templates; document as required |
| `.opencode/skills/sk-doc/assets/{skill,feature_catalog,testing_playbook}/*` | Modify | Templates emit `version` |
| `.opencode/skills/sk-doc/references/*_creation.md` | Modify | Document the version field |
| `.opencode/skills/sk-doc/scripts/{quick_validate.py,package_skill.py}` | Modify | Format-check `X.Y.Z.W` |
| `create:* command generators` | Modify | Emit `version` in generated frontmatter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `version` documented as required 4-part `X.Y.Z.W`; all doc-type templates emit it; validators format-check it when present | Scaffolding a skill via `create:sk-skill` produces a `version:` line; `quick_validate.py` flags a malformed version |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Creation references + `create:feature-catalog` / `create:testing-playbook` / `create:folder_readme` document/emit `version` | `create:feature-catalog` output includes a `version:` line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A doc generated by any `create:*` command carries a 4-part `version`.
- **SC-002**: `quick_validate.py` and `package_skill.py` fail a doc whose `version` is malformed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flipping validators to error-on-absent now | High — every un-versioned corpus doc goes red before phases 3-4 populate it | Phase 1 only format-checks present versions; the hard absence gate lands in phase 5 |
| Dependency | Existing `frontmatter_templates.md` contract | Med | Extend, do not rewrite; keep permissive parsers untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Decisions are locked at the parent level.
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
