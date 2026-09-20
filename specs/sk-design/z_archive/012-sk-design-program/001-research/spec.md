---
title: "Feature Specification: sk-design research phase"
description: "Phase parent for all sk-design research — style-database patterns, the design-command redesign, Rust opportunities, hallmark-skill research, and the four-lane gap-remediation research program — that produced the recommendations driving the build phases."
trigger_phrases:
  - "sk-design research phase"
  - "style database research"
  - "design command research"
  - "gap remediation research"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author research theme phase-parent"
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

# Feature Specification: sk-design research phase

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Complete — all research lanes converged and fed the build phases |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Handoff Criteria** | Each research packet converged with evidence before its paired build began |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design program needed evidence before building: which database technology fits the style library, why the design commands did not help create, whether Rust was warranted, how a hallmark design skill should work, and what gaps remained after the first build passes.

### Purpose
Hold all sk-design research packets together so the evidence that drove the build phases reads as one body. Each child is a converged research packet; the build phases (styles DB, interface commands, hallmark) consumed their recommendations.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All sk-design research packets: style-database, design-commands, Rust opportunities, hallmark-skill, gap-remediation.

### Out of Scope
- The build work the research fed (owned by the style-database, interface-commands, and hallmark themes).

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research/00[1-5]-*/` | Organize | (research packets) | The converged research packets under this theme |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable research packet.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research-style-database/` | Deep research: mirror system-speckit sqlite+embeddings and deep-loop graph-DB patterns for the 1,291-style library | **Complete** |
| 2 | `002-research-design-commands/` | Deep research: why the commands don't help create; Claude design / Open Design / aura.build template prompts; the redesigned command set | **Complete** |
| 3 | `003-styles-database-rust-opportunities/` | Research: whether Rust is warranted for the styles database | **Complete (verdict recorded)** |
| 4 | `004-hallmark-design-skill-research/` | Research: how a hallmark design skill should work | **Complete** |
| 5 | `005-gap-remediation-research/` | Four-lane gap-remediation research (restructure, naming/manifests, DB-fate, commands) — a nested research sub-program | **Complete** |

### Phase Transition Rules
- Each research packet passes `validate.sh` independently; validate the theme with `validate.sh --recursive`.
- Research packets are independent and were run on the models the operator specified.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| research packets | build themes | Converged recommendation with evidence | per-packet `research.md` synthesis |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- The Rust-opportunities verdict is superseded for adoption by the broader `system-speckit` Rust-backend research.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` and `../retrospective.md`.
- **Build phases fed by this research:** `../002-style-database/`, `../003-interface-commands/`, `../004-hallmark-design-system/`.
- **Graph Metadata:** `graph-metadata.json`.
