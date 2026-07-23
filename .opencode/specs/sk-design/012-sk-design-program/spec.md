---
title: "Feature Specification: sk-design program (styles + interface commands + hallmark)"
description: "Umbrella program packet for the whole sk-design body of work — the style database, the /interface:* creation commands, the hallmark design system, and the reviews/remediation that hardened them — organized into five themed phases with all research, build, and review history preserved."
trigger_phrases:
  - "sk-design program"
  - "style database and interface commands"
  - "hallmark design system"
  - "sk-design historic record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author program-parent root over five themed phases"
    next_safe_action: "Regenerate metadata; validate --recursive"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/"
      - ".opencode/commands/interface/"
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

# Feature Specification: sk-design program (styles + interface commands + hallmark)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio (program umbrella over five themed phases) |
| **Priority** | P1 |
| **Status** | Partially shipped: styles-DB core, the `/interface:*` commands, and the reviews delivered; hallmark adoption and several style-DB evolution packets remain **Planned**; persistent activation SLO-gated |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None; root packet under the design track |
| **Parent Packet** | `sk-design` |
| **Predecessor** | `sk-design/011-sk-design-styles-utilization` (file-based styles retrieval engine) |
| **Successor** | None |
| **Handoff Criteria** | Each themed phase validates independently under `validate.sh`; the whole program validates under `validate.sh --recursive` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-design program grew across many packets — style-database research and build, the design-command redesign, hallmark design-system adoption, and several review and remediation passes. Those packets began as flat siblings with no single entry point, so a reader could not see the program as one story: what it set out to do, what shipped, and what remains.

### Purpose

Present the whole sk-design program as one navigable record, organized into five themed phases — **research**, **style database**, **interface commands**, **hallmark design system**, and **reviews & remediation**. Every original packet keeps its content and git history; this parent adds only the program narrative, the phase map, and a program retrospective (`retrospective.md`). Each themed phase is itself a phase parent whose children are the original packets.

> **Phase-parent note:** This `spec.md` and `retrospective.md` are the only authored markdown at the parent level. The root stays lean: `spec.md`, `retrospective.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A five-phase thematic organization of all prior sk-design 012–018 work under one umbrella.
- A program-level narrative (this doc) and retrospective (`retrospective.md`).
- Preservation of every child packet's content, history, and per-packet documentation.

### Out of Scope

- Any change to the *content* of the shipped work (styles library code, interface commands, hallmark system, runtime) — the child packets own that.
- Re-running or re-verifying the merged work; verdicts inside child packets stand as recorded.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/sk-design/012-sk-design-program/spec.md` | Create | (parent) | Program narrative + phase map |
| `.opencode/specs/sk-design/012-sk-design-program/retrospective.md` | Create | (parent) | Program retrospective (shipped / planned-but-missed / opportunities) |
| `.opencode/specs/sk-design/012-sk-design-program/00[1-5]-*/` | Organize | (themes) | Five themed phase parents holding the original packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Thematic decomposition. Each phase is an independently validatable child phase-parent; all per-packet plan/tasks/checklist/decisions/continuity live inside the packets under each theme.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research/` | All research: style-database patterns, design-command redesign, Rust opportunities, hallmark-skill research, and the gap-remediation research program | **Complete** |
| 2 | `002-style-database/` | The style database build + evolution: foundation, JS capabilities, measured-native, growth, library restructure, persistent activation, READMEs, and the manual-testing playbook | **Largely shipped; persistent activation SLO-gated** |
| 3 | `003-interface-commands/` | The `/interface:*` creation commands: build, alias-namespace retirement, rewrite, research refactor, and the command benchmark | **Complete** |
| 4 | `004-hallmark-design-system/` | Hallmark design-system adoption: surgical fixes, evidence envelopes, authored cards, and the brand-first lane | **Planned — four lanes specced, not built** |
| 5 | `005-reviews-and-remediation/` | Program reviews and remediation: review-remediation, session-shipped-work review, remediation-program review, post-review remediation, and program review artifacts | **Complete** |

### Phase Transition Rules

- Each themed phase MUST pass `validate.sh` independently; the whole program validates under `validate.sh --recursive` on this parent.
- Resume a specific packet with `/speckit:resume [parent]/[NNN-theme]/[NNN-packet]/`.
- The research phase (001) produced the recommendations that drove the build phases (002–004); the reviews phase (005) hardened them.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 research | 002–004 builds | Research converged on DB technology, command design, and hallmark adoption, with evidence | per-packet `research.md` synthesis |
| 002–004 builds | 005 reviews | Build phases shipped and were handed to review | per-packet `implementation-summary.md` + review reports |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Style-DB persistent activation:** the persistent SQLite backend stays on `legacy` default until a full-corpus SLO go/no-go passes (owned by `002-style-database/007-persistent-db-activation`).
- **Rust opportunities:** `001-research/003-styles-database-rust-opportunities` recorded a research verdict; any adoption is superseded by the broader `system-speckit` Rust-backend research and remains a future decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program retrospective:** `retrospective.md` — shipped / planned-but-missed / opportunities across the whole program.
- **Predecessor:** `.opencode/specs/sk-design/011-sk-design-styles-utilization/` — the file-based styles engine this program's database backs.
- **Data source:** `.opencode/specs/sk-design/010-sk-design-styles-from-refero/` — the extraction that produced the 1,291-style library.
- **Phase children:** the five themed sub-folders `00[1-5]-*/`, each a phase parent over its original packets.
- **Graph Metadata:** `graph-metadata.json` (`derived.last_active_child_id` resume pointer).
