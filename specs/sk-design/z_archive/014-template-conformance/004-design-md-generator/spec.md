---
title: "Feature Specification: design-md-generator template conformance"
description: "Phase parent auditing the design-md-generator mode's skill docs against sk-doc's authoring templates and package_skill.py structural rules, and remediating what the audit finds — including a genuine exemption decision for the vendor DESIGN.md exemplars."
trigger_phrases:
  - "design-md-generator template conformance"
  - "design-md-generator doc audit"
  - "md-generator mode skill conformance"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author design-md-generator phase-parent spec"
    next_safe_action: "Plan or resume child 001-packet-root"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/"
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

# Feature Specification: design-md-generator template conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
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
`design-md-generator` is the largest and most structurally varied sk-design mode: a 3-file packet root (`SKILL.md`, `README.md`, and an `INSTALL-GUIDE.md` governed by a different template family), a 10-file `references/` root plus an `examples/` tree of 4 vendor DESIGN.md exemplars, a real TypeScript `backend/` with its own test suite, plus `assets/`, `procedures/`, `feature-catalog/`, `manual-testing-playbook/`, and `changelog/`. A sample pass already confirmed two real defects — an `importance_tier` enum violation in `extraction-workflow.md`, and sentence-case numbered H2s in three other reference files — and surfaced one genuine judgment call: the four vendor DESIGN.md exemplars under `references/examples/` look nothing like a reference doc (no numbered H2s, no OVERVIEW, a `contextType` value outside the allowed enum) because they are output exemplars, not skill reference docs, yet they physically live under `references/`.

### Purpose
Exhaustively audit every folder type in `design-md-generator` against its governing sk-doc template (or, where none exists, against directory + naming rules), remediate every real gap the audit finds, and resolve the vendor-exemplar placement as an explicit, recorded decision rather than a silent rewrite or a silent pass.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All eight folder-type audits under `.opencode/skills/sk-design/design-md-generator/`: packet root (3 files), `references/` (10 root files + `examples/`), `assets/`, `procedures/`, `backend/` (structure only), `feature-catalog/`, `manual-testing-playbook/`, `changelog/`.
- Remediation of every real defect the exhaustive audit confirms, scoped strictly to `design-md-generator`.
- A recorded decision on the `references/examples/` vendor exemplars (relocate out of `references/`, or document a sanctioned exemption) — owned by child `002-references`.

### Out of Scope
- The other 014 program children (`001-apache-devendoring`, `002-*`, `003-design-motion`, `005-008`) and the `014-template-conformance` program parent itself — owned by other workers.
- `design-md-generator`'s runtime behavior, extraction logic, or `backend/` code/test content — this program audits documentation and structural conformance only.
- The separate vestigial `design-md-generator/node_modules/` stub at the packet root (outside `backend/`) — owned by sibling `008-structural-anomalies`.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md` | Modify (pending audit) | `002-references` | Fix `importance_tier: "high"` enum violation |
| `.opencode/skills/sk-design/design-md-generator/references/{quality-checklist,writing-style-guide,design-md-format}.md` | Modify (pending audit) | `002-references` | Fix sentence-case numbered H2s |
| `.opencode/skills/sk-design/design-md-generator/references/examples/**` | Decision + Modify (pending audit) | `002-references` | Relocate or exempt the 4 vendor exemplar sets |
| `.opencode/skills/sk-design/design-md-generator/**` | Audit (Modify if confirmed) | `001,003-008` | Remaining folder-type audits; changes only where the exhaustive read confirms a real gap |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable folder-type audit. None blocks another; the numbering is a map position, not a dependency chain.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-packet-root/` | `SKILL.md` + `README.md` + `INSTALL-GUIDE.md` against their respective templates | Planned |
| 2 | `002-references/` | 10 flat `references/*.md` + 4-vendor `examples/` tree; known `importance_tier` and H2-casing defects; exemplar placement decision | Planned |
| 3 | `003-assets/` | `assets/*.md` against `skill-asset-template.md` | Planned |
| 4 | `004-procedures/` | `procedures/*.md` against `skill-procedure-template.md` | Planned |
| 5 | `005-backend/` | `backend/` structure (not `dist/`/`node_modules/`) against directory rules; the only mode with a real test suite | Planned |
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
- Whether the `references/examples/` vendor DESIGN.md exemplars relocate to a non-`references/` path or stay in place under a documented exemption — deferred to child `002-references`'s decision record.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` (owned by another worker).
- **Sibling children:** `../001-apache-devendoring/`, `../002-*/`, `../003-design-motion/`, `../005-008/`.
- **Graph Metadata:** `graph-metadata.json`.
