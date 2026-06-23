---
title: "Feature Specification: Phase 4 — Apply Catalogs and Playbooks"
description: "Feature catalogs and testing playbooks — roots plus per-feature leaves (1,753 docs) — carry no version; the full corpus must be versioned via the same compute -> MiMo-batch -> verify pipeline, isolated so a bad run cannot poison the standard or the engine."
trigger_phrases:
  - "apply catalog playbook versions"
  - "testing playbook leaves version"
  - "feature catalog version"
  - "full corpus versioning"
  - "per-feature leaf version"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-frontmatter-versioning/004-apply-catalogs-and-playbooks"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Versioned 1,753 catalog and playbook docs from the precomputed manifest"
    next_safe_action: "Phase complete; commit the working tree when ready"
    blockers: []
    key_files:
      - ".opencode/skills/*/feature_catalog"
      - ".opencode/skills/*/manual_testing_playbook"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-apply-catalogs-and-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full corpus: roots AND every per-feature leaf are versioned (1,753 files)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — Apply Catalogs and Playbooks

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
| **Phase** | 4 of 5 |
| **Predecessor** | 003-apply-core-skill-docs |
| **Successor** | 005-verify-and-enforce |
| **Handoff Criteria** | Full corpus verified; no YAML corruption; counts reconciled with the manifest |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Skill Frontmatter Versioning specification.

**Scope Boundary**: `feature_catalog/**` + `manual_testing_playbook/**` under `.opencode/skills/*`, roots and every per-feature leaf. The largest, most mechanical phase — isolated so a bad run cannot poison the standard or engine.

**Dependencies**:
- Phase 2 engine; phase 3 proven on the core docs.

**Deliverables**:
- The full catalog + playbook corpus (~1,700+ files) versioned; `--verify` clean; applied count reconciled to the manifest.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The bulk of the corpus is per-feature catalog and playbook leaves (~1,700+ files) with frontmatter that varies (often only `title` + `description`) and no version. They must all be versioned at scale through the same deterministic pipeline, without silent truncation and without corrupting the lighter 2-field frontmatter.

### Purpose
Every feature-catalog and testing-playbook doc — root and leaf — carries its computed version, the applied count matches the manifest's in-scope count, and `--verify` confirms frontmatter is intact across the full corpus.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compute the manifest for all catalog + playbook docs (roots + leaves), MiMo-batch-apply per skill (script fallback).
- `--verify` the full corpus; reconcile applied count vs manifest; log any dropped/skipped files.

### Out of Scope
- Core skill docs — phase 3 (already applied).
- Enforcement / CI gate — phase 5.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/*/feature_catalog/**/*.md` | Modify | Insert computed version (roots + leaves) |
| `.opencode/skills/*/manual_testing_playbook/**/*.md` | Modify | Insert computed version (roots + leaves) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every catalog + playbook doc (root + leaf) carries its computed version; frontmatter intact | `--verify` green over the corpus; structural diff clean (no `trigger_phrases` reflow) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Scope count reconciled to the manifest — no silent truncation | Applied count == manifest in-scope count; any dropped/skipped files logged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--verify` reports zero mismatches and zero corrupted frontmatter across the full corpus.
- **SC-002**: Applied count equals the manifest's in-scope count; the skipped bucket is explicitly reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scale (~1,700+ files) + MiMo batch failures | Med | Script fallback writer; per-skill chunking; resumable apply |
| Risk | Light 2-field frontmatter on leaves | Med | Field-relative insert (last key before `---`); never positional line number |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Exact leaf count is pinned by the phase-2 manifest.
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
