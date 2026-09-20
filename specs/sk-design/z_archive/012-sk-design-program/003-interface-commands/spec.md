---
title: "Feature Specification: sk-design interface commands phase"
description: "Phase parent for the /interface:* creation commands — the initial build, the /design:* alias-namespace retirement, the body rewrite to literal creation prompts, the research refactor, and the command benchmark."
trigger_phrases:
  - "sk-design interface commands phase"
  - "interface creation commands"
  - "design command rewrite"
  - "interface command benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author interface-commands theme phase-parent"
    next_safe_action: "Regenerate metadata; validate --recursive"
    blockers: []
    key_files:
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

# Feature Specification: sk-design interface commands phase

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Complete — the five `/interface:*` commands shipped, the `/design:*` aliases retired, and the surface benchmarked |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Handoff Criteria** | Command test suite green; single public namespace |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The design commands were thin routers that resolved a mode and deferred to the hub — no structured brief intake, no exemplar grounding, no scaffolded build flow. A user got a router, not a design partner. They also lived under a `/design:*` namespace alongside `/interface:*` aliases.

### Purpose
Build the five `/interface:*` commands as genuine creation prompts sharing one lifecycle contract, retire the `/design:*` alias namespace so `/interface:*` is the sole public surface, refactor the research behind them, and benchmark the surface for output quality.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `/interface:*` command build, the alias-namespace retirement, the body rewrite, the research refactor, and the benchmark.

### Out of Scope
- The style database the commands query (owned by `../002-style-database/`) and the design judgment in the sk-design modes (unchanged).

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `003-interface-commands/00[1-5]-*/` | Organize | (command packets) | The interface-command build + benchmark packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable packet.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-interface-commands/` | Build the five `/interface:*` creation commands + shared contract | **Complete (16/16 tests)** |
| 2 | `002-retire-design-alias-namespace/` | Retire `/design:*` so `/interface:*` is the sole public surface | **Complete** |
| 3 | `003-interface-command-rewrite/` | Rewrite command bodies to literal creation prompts | **Complete** |
| 4 | `004-interface-command-research-refactor/` | Refactor the research behind the commands | **Complete** |
| 5 | `005-interface-command-benchmark/` | Benchmark the command surface for output quality across models | **Complete** |

### Phase Transition Rules
- Each packet passes `validate.sh` independently; validate the theme with `validate.sh --recursive`.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| build | benchmark | Commands shipped + test-green | command test suite + benchmark report |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- None; the surface is shipped and benchmarked.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` and `../retrospective.md`.
- **Research that drove this build:** `../001-research/002-research-design-commands/`.
- **Graph Metadata:** `graph-metadata.json`.
