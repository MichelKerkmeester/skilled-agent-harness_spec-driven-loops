---
title: "Feature Specification: sk-design hub-root template conformance"
description: "Audit the hub-root identity/registry files against parent-skill-hub-template.md and its JSON companions, audit changelog/feature-catalog/manual-testing-playbook against their standard templates, and confirm the hub-wide invariants hold — without touching the two anomalies (benchmark/compiled-routing missing an index; styles/'s 7,800-file generated corpus) that are owned by sibling packet 008-structural-anomalies."
trigger_phrases:
  - "sk-design hub-root template conformance"
  - "template conformance"
  - "phase parent"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/007-hub-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase-parent spec for template-conformance subtree"
    next_safe_action: "Plan or resume a child leaf"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: sk-design hub-root template conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Handoff Criteria** | Each child leaf validates independently before the subtree validates `--recursive` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design hub root itself (8 identity/registry files, plus benchmark/, changelog/, feature-catalog/, manual-testing-playbook/, and styles/) has never been audited as a unit against the parent-skill-hub template family. Several invariants are hub-wide and easy to silently violate one file at a time: exactly one graph-metadata.json per hub, hub allowed-tools must equal the union of every mode's toolSurface.allowed, and alias uniqueness across modes.

### Purpose
Audit the hub-root identity/registry files against parent-skill-hub-template.md and its JSON companions, audit changelog/feature-catalog/manual-testing-playbook against their standard templates, and confirm the hub-wide invariants hold — without touching the two anomalies (benchmark/compiled-routing missing an index; styles/'s 7,800-file generated corpus) that are owned by sibling packet 008-structural-anomalies.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`. All audit detail, findings, and fixes live in the child leaves below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 8 hub-root identity/registry files (SKILL.md, README.md, description.json, graph-metadata.json, mode-registry.json, hub-router.json, leaf-manifest.json, command-metadata.json).
- hub-root changelog/, feature-catalog/, manual-testing-playbook/ against their standard templates.
- benchmark/ and styles/ top-level shape only — not a per-file or per-style audit.

### Out of Scope
- The benchmark/compiled-routing/ missing-index anomaly — owned by sibling `008-structural-anomalies`, not this subtree.
- styles/library/bundles/ — the ~7,700-file generated style corpus is explicitly out of audit scope; frozen benchmark run records must not be rewritten.
- Any per-mode content inside design-interface/, design-motion/, design-md-generator/, design-mcp-open-design/ — those are siblings 001-004 and 005, owned elsewhere.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| SKILL.md, README.md, *.json (8 files) | Audit/Fix | 001-identity-and-registry | Hub identity + registry conformance, hub-wide invariants |
| changelog/*.md (9 files) | Audit/Fix | 002-changelog | changelog-template.md conformance |
| feature-catalog/** | Audit/Fix | 003-feature-catalog | feature-catalog-template.md conformance |
| manual-testing-playbook/** | Audit/Fix | 004-manual-testing-playbook | manual-testing-playbook-template.md conformance |
| benchmark/** (top-level shape) | Audit | 005-benchmark | Frozen run records; anomaly flagged not fixed |
| styles/ (top-level only) | Audit | 006-styles | README/database/lib/library/scripts/tests shape only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable audit-and-conform leaf.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-identity-and-registry/` | 8 hub-root files vs parent-skill-hub-template.md + JSON companions; hub-wide invariants | Planned |
| 2 | `002-changelog/` | 9 changelog entries vs changelog-template.md | Planned |
| 3 | `003-feature-catalog/` | feature-catalog.md + 4 subdirs vs feature-catalog-template.md | Planned |
| 4 | `004-manual-testing-playbook/` | manual-testing-playbook.md + 10 subdirs vs its template | Planned |
| 5 | `005-benchmark/` | 11 dated run-record dirs; compiled-routing/ missing-index anomaly flagged, not fixed | Planned |
| 6 | `006-styles/` | Top-level shape only (README/database/lib/library/scripts/tests); library/bundles/ out of scope | Planned |

### Phase Transition Rules
- Each leaf passes `validate.sh` independently; validate the subtree with `validate.sh --recursive --strict`.
- Leaves with no known defects run the exhaustive audit first; "conformant, no changes" is a legitimate leaf outcome.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| each leaf | subtree parent | leaf validate.sh --strict passes | CLI exit 0 |
| subtree parent | program parent (owned by another worker) | validate.sh --recursive --strict passes for the whole subtree | CLI exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` (owned by another worker).
- **Graph Metadata:** `graph-metadata.json`.
