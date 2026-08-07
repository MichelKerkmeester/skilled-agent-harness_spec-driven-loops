---
title: "Feature Specification: sk-design reviews and remediation phase"
description: "Phase parent for the program's review and remediation work — review-remediation, the session-shipped-work review, the remediation-program review, post-review remediation, and the program-level review artifacts that hardened the shipped work."
trigger_phrases:
  - "sk-design reviews and remediation phase"
  - "remediation program review"
  - "post-review remediation"
  - "session shipped work review"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/005-reviews-and-remediation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author reviews-and-remediation theme phase-parent"
    next_safe_action: "Regenerate metadata; validate --recursive"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: sk-design reviews and remediation phase

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Complete — the program's shipped work was reviewed and its findings remediated |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Handoff Criteria** | Each review/remediation packet validates independently |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped style-database and interface-command work needed independent review before it could be trusted — and the findings needed remediation, not just recording.

### Purpose
Hold the program's review and remediation passes together: the review-remediation fixes, the session-shipped-work review, the remediation-program review, and the post-review remediation, plus the program-level review/alignment artifacts.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`. `000-program-review-artifacts/` holds the program-level alignment/review lineage artifacts (not a spec packet).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The program's review and remediation packets, and the program-level review/alignment artifacts.

### Out of Scope
- The build work being reviewed (owned by the style-database, interface-commands, and hallmark themes).

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `005-reviews-and-remediation/00[1-4]-*/` | Organize | (review packets) | The review + remediation packets |
| `005-reviews-and-remediation/000-program-review-artifacts/` | Organize | (artifacts) | Program-level alignment/review lineage artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each numbered child is an independently validatable review/remediation packet. `000-program-review-artifacts/` is a non-packet artifact directory.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-review-remediation/` | Fix the deep-review findings on the shipped style-DB + command work | **Complete** |
| 2 | `002-session-shipped-work-review/` | Independent review of the session's shipped work | **Complete** |
| 3 | `003-remediation-program-review/` | Review of the remediation program | **Complete** |
| 4 | `004-post-review-remediation/` | Remediation of the post-review findings | **Complete** |

### Phase Transition Rules
- Each packet passes `validate.sh` independently; validate the theme with `validate.sh --recursive`.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| build phases | reviews | Build shipped and handed to review | per-packet review report |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- None; the review and remediation passes are recorded complete.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` and `../retrospective.md`.
- **Work reviewed:** `../002-style-database/`, `../003-interface-commands/`.
- **Graph Metadata:** `graph-metadata.json`.
