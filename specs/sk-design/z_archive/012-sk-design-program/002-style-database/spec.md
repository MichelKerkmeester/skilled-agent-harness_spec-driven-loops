---
title: "Feature Specification: sk-design style database phase"
description: "Phase parent for the style database build and evolution — foundation, JS capabilities, measured-native, growth, library restructure, persistent activation, READMEs, and the manual-testing playbook — over the 1,291-style library."
trigger_phrases:
  - "sk-design style database phase"
  - "style database build"
  - "styles database evolution"
  - "persistent style database activation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author style-database theme phase-parent"
    next_safe_action: "Regenerate metadata; validate --recursive"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: sk-design style database phase

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Largely shipped; the persistent SQLite backend stays on `legacy` default until a full-corpus SLO go/no-go passes |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Handoff Criteria** | Each build packet validates independently; persistent activation gated on the SLO |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The style library began as 13k flat files with no indexed query, no semantic retrieval, and no incremental sync — the largest structured dataset in `sk-design` still trapped in flat files.

### Purpose
Stand up a real indexed style database for the 1,291-style library — schema, indexer/sync, retrieval API, storage-neutral facade with a legacy→shadow→persistent activation path — and evolve it through JS capabilities, measured-native work, growth, a library restructure, READMEs, and a manual-testing playbook.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The style-database build (`001-style-database`) and every evolution packet (`002`–`010`), including the persistent-activation and restructure work and the READMEs/playbook.

### Out of Scope
- The style research (owned by `../001-research/`) and the interface commands that query the library (owned by `../003-interface-commands/`).

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `002-style-database/00[1-9]*/`, `010-*/` | Organize | (build packets) | The style-database build + evolution packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable build/evolution packet.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-style-database/` | The initial style-database build + retrieval | **Implementation complete; bounded-fixture verified** |
| 2 | `002-foundation/` | Measurement/contract/rollback foundation plane | **Built + verified** |
| 3 | `003-js-capabilities/` | JS capabilities layer | **Specced** |
| 4 | `004-measured-native/` | Measured-native evaluation | **Specced** |
| 5 | `005-growth/` | Growth work | **Specced** |
| 6 | `006-library-restructure/` | Shallow ownership tree + kebab rename | **Specced/partial** |
| 7 | `007-persistent-db-activation/` | Persistent SQLite activation behind the facade | **Gated on full-corpus SLO; default `legacy`** |
| 8 | `008-styles-folder-readmes/` | READMEs for every styles folder | **Complete** |
| 9 | `009-styles-readme-create-readme-alignment/` | Align styles READMEs to create-readme standards | **Planned** |
| 10 | `010-manual-testing-playbook-and-db-readme/` | Manual-testing playbook + DB README (nested sub-parent) | **Planned** |

### Phase Transition Rules
- Each packet passes `validate.sh` independently; validate the theme with `validate.sh --recursive`.
- Persistent activation flips to default only after the SLO go/no-go passes; a legacy kill-switch is retained.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| build packets | persistent activation | Contract/oracle parity + relevance + perf gate green | differential oracle + shadow trace |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- **Persistent activation SLO:** the ≥30% AND ≥25 ms p95 improvement gate remains proposed until real shadow data confirms it (owned by `007-persistent-db-activation`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` and `../retrospective.md`.
- **Research that drove this build:** `../001-research/001-research-style-database/`.
- **Predecessor engine:** `.opencode/specs/sk-design/011-sk-design-styles-utilization/`.
- **Graph Metadata:** `graph-metadata.json`.
