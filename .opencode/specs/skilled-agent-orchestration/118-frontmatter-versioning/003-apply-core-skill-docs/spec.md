---
title: "Feature Specification: Phase 3 — Apply Core Skill Docs"
description: "The 21 SKILL.md (some 3-part or stale), 22 READMEs, ~308 references and ~105 assets carry no consistent version; they must be versioned from the engine's computed map, applied by MiMo in per-skill batches with the script as ground-truth + fallback, then verified."
trigger_phrases:
  - "apply core skill doc versions"
  - "SKILL.md version normalize"
  - "MiMo batch apply versions"
  - "reference asset versioning"
  - "core docs verify"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/003-apply-core-skill-docs"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Versioned 457 core docs; normalized 12 SKILL.md incl. the 4 three-part files"
    next_safe_action: "Phase complete; commit the working tree when ready"
    blockers: []
    key_files:
      - ".opencode/skills/*/SKILL.md"
      - ".opencode/skills/*/README.md"
      - ".opencode/skills/*/references"
      - ".opencode/skills/*/assets"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-apply-core-skill-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "MiMo applies per-skill batches; the script holds the authoritative version map and verifies every result."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — Apply Core Skill Docs

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
| **Phase** | 3 of 5 |
| **Predecessor** | 002-derivation-engine |
| **Successor** | 004-apply-catalogs-and-playbooks |
| **Handoff Criteria** | Core docs verified (version == computed; frontmatter intact); consumer parse check green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Skill Frontmatter Versioning specification.

**Scope Boundary**: core skill docs only — `SKILL.md`, `README.md`, `references/**`, `assets/**` under `.opencode/skills/*`. Excludes `feature_catalog/**` and `manual_testing_playbook/**` (phase 4).

**Dependencies**:
- Phase 2 engine + dry-run manifest; phase 1 standard.

**Deliverables**:
- ~436 core docs versioned; 21 SKILL.md normalized to 4-part and reconciled to the changelog anchor; `--verify` clean.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The well-structured core docs carry no consistent version: 21 SKILL.md exist but four are 3-part and several are stale versus their changelog; 22 READMEs, ~308 references and ~105 assets have none. They must be populated from the engine's computed map, applied safely at scale, and verified — without corrupting the 5-field frontmatter contract.

### Purpose
Every core skill doc carries its computed 4-part version, SKILL.md files are normalized and reconciled to the changelog anchor, and a deterministic `--verify` confirms each value with frontmatter structurally intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compute the manifest for core docs, then MiMo-batch-apply per skill (script fallback for skips/failures).
- Normalize the 21 SKILL.md (3-part -> 4-part) and reconcile each to `max(frontmatter, changelog)`.
- `--verify` every touched file; run a consumer parse check on a sample.

### Out of Scope
- Feature catalogs + testing playbooks — phase 4.
- Enforcement / CI gate — phase 5.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/*/SKILL.md` | Modify | Normalize + reconcile to anchor |
| `.opencode/skills/*/README.md` | Modify | Insert computed version |
| `.opencode/skills/*/references/**/*.md` | Modify | Insert computed version |
| `.opencode/skills/*/assets/**/*.md` | Modify | Insert computed version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every core doc carries its computed version; SKILL.md normalized + reconciled; frontmatter intact | `--verify` green over the core set; `quick_validate.py` / `package_skill.py` parse clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | MiMo per-skill batch apply with deterministic script fallback; consumer parse check | Skill advisor indexes a sample of touched skills with no parse regression |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--verify` reports zero mismatches across the ~436 core docs.
- **SC-002**: No SKILL.md remains 3-part; each equals `max(frontmatter, changelog)`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | MiMo nondeterminism on edits | Med | Script holds the authoritative version map and verifies every file; MiMo only applies + reviews |
| Risk | Overwriting a human-set SKILL.md version | Med | Reconcile via `max`; never downgrade; skip-and-report on conflict unless `--update` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Exact core-doc count is pinned by the phase-2 manifest.
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
