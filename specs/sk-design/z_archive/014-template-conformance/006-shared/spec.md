---
title: "Feature Specification: sk-design shared/ template conformance"
description: "Audit every file and subdirectory under `shared/` against its governing template, fix confirmed structural defects (most notably the `smart-routing.md` intro/separator gap and the 7 identically-shaped `structural-fingerprint-cards/`), and confirm `shared/` still holds no per-mode logic and no metadata files of its own."
trigger_phrases:
  - "sk-design shared/ template conformance"
  - "template conformance"
  - "phase parent"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase-parent spec for template-conformance subtree"
    next_safe_action: "Plan or resume a child leaf"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/"
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

# Feature Specification: sk-design shared/ template conformance

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
`shared/` holds cross-packet vocabulary consumed by every sk-design mode (11 root markdown contracts, plus references/assets/procedures/scripts/corpus-context/authored-brand/evidence-envelopes subdirectories), and it has never been audited against the create-skill template family. `shared/` carries a hard constitutional rule — it may hold cross-packet vocabulary but never per-mode workflow logic, and never its own `graph-metadata.json` or `description.json` — that any audit must respect rather than accidentally violate.

### Purpose
Audit every file and subdirectory under `shared/` against its governing template, fix confirmed structural defects (most notably the `smart-routing.md` intro/separator gap and the 7 identically-shaped `structural-fingerprint-cards/`), and confirm `shared/` still holds no per-mode logic and no metadata files of its own.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`. All audit detail, findings, and fixes live in the child leaves below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 11 loose root markdown contracts, plus `references/`, `assets/`, `procedures/`, `scripts/`, `corpus-context/`, `authored-brand/`, `evidence-envelopes/`.
- Confirming `shared/` has no `graph-metadata.json` or `description.json` of its own (constitutional invariant, not a per-leaf fix).

### Out of Scope
- Any per-mode workflow logic — if an audit finds workflow logic that has drifted into `shared/`, that is a LOGIC-SYNC escalation, not a silent move, and gets flagged to the operator rather than fixed in this subtree.
- The runtime behavior of the scripts under `shared/scripts/` and `shared/corpus-context/` — structural/file-type conformance only.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| shared/*.md (11 root docs) | Audit/Fix | 001-root-docs | Cross-packet contract conformance |
| shared/references/** | Audit/Fix | 002-references | smart-routing.md gap + 7 identical fingerprint-card fixes |
| shared/assets/** | Audit | 003-assets | 4 asset cards |
| shared/procedures/** | Audit | 004-procedures | 1 procedure file |
| shared/scripts/** | Audit | 005-scripts | .mjs/.py mix — legal, observed not fixed |
| shared/corpus-context/** | Audit | 006-corpus-context | Directory-rule conformance |
| shared/authored-brand/** | Audit | 007-authored-brand | Directory-rule conformance |
| shared/evidence-envelopes/** | Audit | 008-evidence-envelopes | Directory-rule conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable audit-and-conform leaf.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-root-docs/` | 11 cross-packet markdown contracts at shared/ root | Planned |
| 2 | `002-references/` | smart-routing.md missing intro/separator; 7 structural-fingerprint-cards share one non-conformant shape | Planned |
| 3 | `003-assets/` | 4 asset cards vs skill-asset-template.md | Planned |
| 4 | `004-procedures/` | 1 procedure file vs skill-procedure-template.md | Planned |
| 5 | `005-scripts/` | .mjs/.py mix (legal, observation only) + kebab-case exemption for .py | Planned |
| 6 | `006-corpus-context/` | corpus-context/ directory-rule audit | Planned |
| 7 | `007-authored-brand/` | authored-brand/ directory-rule audit | Planned |
| 8 | `008-evidence-envelopes/` | evidence-envelopes/ directory-rule audit | Planned |

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
