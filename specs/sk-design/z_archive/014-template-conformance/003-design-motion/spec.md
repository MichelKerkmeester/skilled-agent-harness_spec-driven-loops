---
title: "Feature Specification: design-motion template conformance"
description: "Phase parent auditing the design-motion mode's skill docs against sk-doc's authoring templates and package_skill.py structural rules, and remediating what the audit finds."
trigger_phrases:
  - "design-motion template conformance"
  - "design-motion doc audit"
  - "motion mode skill conformance"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author design-motion phase-parent spec"
    next_safe_action: "Plan or resume child 001-packet-root"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/"
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

# Feature Specification: design-motion template conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P2 |
| **Status** | Planned — audit not yet started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Handoff Criteria** | Each child folder-type audit converges to conformant docs or a documented exemption |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`design-motion` is the smallest and cleanest sk-design mode (19 dirs, 39 files), but a sample pass already found real conformance gaps in `references/`: separator discipline abandoned mid-document in two files, and sentence-case H2s where ALL-CAPS is required. The remaining folder types were sampled, not exhaustively read, so their conformance status is unknown.

### Purpose
Exhaustively audit every folder type in `design-motion` against its governing sk-doc template and `package_skill.py` structural rules, and remediate every real gap the audit finds. Where a folder type is already conformant, the child's own audit records that as a legitimate outcome — it does not need manufactured findings.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All eight folder-type audits under `.opencode/skills/sk-design/design-motion/`: packet root, `references/`, `assets/`, `procedures/`, `corpus/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/`.
- Remediation of any real defect the exhaustive audit confirms, scoped strictly to `design-motion`.

### Out of Scope
- The other 014 program children (`001-apache-devendoring`, `002-*`, `004-design-md-generator`, `005-008`) and the `014-template-conformance` program parent itself — owned by other workers.
- `design-motion`'s runtime behavior, feature scope, or motion-design content — this program audits documentation conformance only.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-design/design-motion/references/*.md` | Modify (pending audit) | `002-references` | Fix separator discipline and H2 casing where confirmed |
| `.opencode/skills/sk-design/design-motion/**` | Audit (Modify if confirmed) | `001,003-008` | Remaining folder-type audits; changes only where the exhaustive read confirms a real gap |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable folder-type audit. None blocks another; the numbering is a map position, not a dependency chain.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-packet-root/` | `README.md` + `SKILL.md` against `skill-readme-template.md` + `skill-md-template.md` | Planned |
| 2 | `002-references/` | 7 flat `references/*.md` against `skill-reference-template.md`; known separator and H2-casing defects | Planned |
| 3 | `003-assets/` | `assets/*.md` against `skill-asset-template.md` | Planned |
| 4 | `004-procedures/` | `procedures/*.md` against `skill-procedure-template.md` | Planned |
| 5 | `005-corpus/` | `corpus/` (no authored template) against directory + kebab/file-type rules | Planned |
| 6 | `006-feature-catalog/` | `feature-catalog/**` against `feature-catalog-template.md` | Planned |
| 7 | `007-manual-testing-playbook/` | `manual-testing-playbook/**` against `manual-testing-playbook-template.md` | Planned |
| 8 | `008-changelog/` | `changelog/*.md` against `changelog-template.md` | Planned |

### Phase Transition Rules
- Each child passes `validate.sh` independently; validate the theme with `validate.sh --recursive`.
- Children are independent audits and may run in any order or in parallel.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| child audits | this parent | Each child's folder type is conformant or carries a documented exemption | per-child `checklist.md` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- `design-motion` has no `scripts/` directory. Confirmed as a legitimate absence (the mode ships no executable tooling), not a structural defect — no child needs to "fix" this.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` (owned by another worker).
- **Sibling children:** `../001-apache-devendoring/`, `../002-*/`, `../004-design-md-generator/`, `../005-008/`.
- **Graph Metadata:** `graph-metadata.json`.
