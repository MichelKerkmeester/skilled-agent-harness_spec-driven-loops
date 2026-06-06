---
title: "Feature Specification: spec and resource-map for deep-skill doc evolution"
description: "Phase 1 of the 008 cluster: author the JSON schemas and resource-map.yaml that drive phases 002-009, and reconcile the per-skill documentation delta against the prior 000-release-cleanup work so 008 touches only what remains."
trigger_phrases:
  - "deep-skill doc evolution spec"
  - "deep-skill resource-map"
  - "deep-skill delta reconciliation"
  - "008 phase 1 planning"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/001-spec-and-resource-map"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-phase-1-spec-schemas-resource-map"
    next_safe_action: "validate-strict-then-start-002-references-restructure"
    blockers: []
    key_files:
      - "resource-map.yaml"
      - "schemas/audit-finding.schema.json"
      - "schemas/validation-report.schema.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000801"
      session_id: "116-008-001-spec-and-resource-map"
      parent_session_id: "116-008-001-spec-and-resource-map"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope confirmed: core docs + feature_catalog + manual_testing_playbook conformance"
      - "Delta baseline: harvest 000-release-cleanup, do not redo shipped work"
---
# Feature Specification: spec and resource-map for deep-skill doc evolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 008 cluster improves documentation across five mature deep-* skills, but a sibling cluster (`000-release-cleanup`) already shipped uneven per-skill cleanup. Without a single source of truth for what each skill still needs, phases 002-009 risk redoing finished work, missing a flat reference directory, or emitting findings in inconsistent shapes.

### Purpose
Produce the planning contract for the whole cluster: JSON schemas for the data every later phase emits, a `resource-map.yaml` that maps each in-scope artifact to its sk-doc template and records the remaining delta per skill, and a reconciliation of what `000-release-cleanup` already completed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `resource-map.yaml`: every in-scope artifact across the five skills mapped to its sk-doc template, with a per-artifact delta status
- `schemas/audit-finding.schema.json`, `schemas/changelog-entry.schema.json`, `schemas/validation-report.schema.json`
- Delta reconciliation table: what `000-release-cleanup` shipped per skill versus the remaining 008 work
- Carry-forward of any deferred backlog recorded by the `000` buckets

### Out of Scope
- Editing any skill file (SKILL.md, references, README, catalog, playbook) - that is phases 002-007
- Running the deep-research backstop - that is phase 009
- Modifying any `000-release-cleanup` artifact - read-only harvest only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-spec-and-resource-map/resource-map.yaml` | Create | Artifact-to-template map + per-skill delta |
| `001-spec-and-resource-map/schemas/audit-finding.schema.json` | Create | Shape for per-skill audit findings (003-007) |
| `001-spec-and-resource-map/schemas/changelog-entry.schema.json` | Create | Shape for per-skill changelog entries |
| `001-spec-and-resource-map/schemas/validation-report.schema.json` | Create | Shape for the 008 gate report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | resource-map.yaml enumerates 100% of in-scope artifacts | Every SKILL.md, README.md, references file, feature_catalog, and manual_testing_playbook across the five skills appears as a row mapped to a sk-doc template |
| REQ-002 | Each artifact row carries a delta status | Status is one of `done-by-000`, `needs-subfolder`, `needs-split`, `needs-conformance`, `needs-rewrite`, drawn from live skill state |
| REQ-003 | Three JSON schemas validate against sample objects | A sample finding, changelog entry, and validation report each parse against their schema |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Delta reconciliation cites prior cleanup per skill | Table records, per skill, what 000-release-cleanup shipped and what remains |
| REQ-005 | Carried-forward backlog seeded | resource-map.yaml has a `phase5_backlog` section pre-seeded from 000 deferrals for 009 to extend |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on this folder exits 0
- **SC-002**: resource-map.yaml is the single artifact inventory phases 002-009 read from
- **SC-003**: No row in resource-map.yaml is mapped to a non-existent sk-doc template
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live skill state | High | Read actual skill dirs, not 000 frontmatter, which carries a known completion_pct contradiction |
| Risk | Under-counting artifacts | Med | Generate inventory with `find`, cross-check against the inventory in the 008 plan |
| Risk | Mapping to wrong template | Low | Restrict templates to the verified set under `sk-doc/assets/skill/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: resource-map.yaml parses in under one second with a standard YAML loader
- **NFR-P02**: Schemas are draft-07 compatible for broad tooling support

### Security
- **NFR-S01**: No secrets, tokens, or absolute home paths embedded in the schemas or map
- **NFR-S02**: Schemas reject additional properties by default to catch malformed emitter output

### Reliability
- **NFR-R01**: Artifact inventory is reproducible from a documented `find` command
- **NFR-R02**: Delta status values are a closed enum so downstream phases can branch on them
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty references subfolder: a skill kept flat (deep-loop-runtime) maps with status `done-by-000` or `no-change`
- Skill with no changelog yet: row marked `needs-create` for the changelog artifact

### Error Scenarios
- 000 summary contradicts live state: live state wins, contradiction noted in the reconciliation table
- Template missing for an artifact type: halt and record an open question rather than guess

### State Transitions
- Partial completion: resource-map.yaml is the resumable source of truth, so a half-finished phase reads its remaining rows
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Planning artifacts only, no code |
| Risk | 8/25 | Read-only harvest, low blast radius |
| Research | 14/20 | Requires reconciling prior cleanup against live state |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Final subfolder taxonomy is proposed here and confirmed during 002 once the inbound-link inventory is complete.
- Whether deep-loop-runtime gets any subfoldering at all, given only four reference files and four consumers.
<!-- /ANCHOR:questions -->
