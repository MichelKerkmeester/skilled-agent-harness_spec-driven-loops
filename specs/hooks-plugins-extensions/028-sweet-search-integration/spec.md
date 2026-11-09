---
title: "Feature Specification: Sweet-search integration"
description: "Phased packet that evaluates sweet-search, a local code-search tool for AI coding agents, and integrates it into Skilled only where research shows it earns its place."
trigger_phrases:
  - "sweet search integration phase parent spec"
  - "sweet-search integration"
  - "sweet search code search"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase 1 research complete: verdict is no integration now, with a growth gate"
    next_safe_action: "Read 001-sweet-search-research/research/research.md, then define phase 2 from its recommendation"
    blockers: []
    key_files:
      - "001-sweet-search-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-sweet-search"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Does sweet-search earn a place in Skilled at all, and on which surface?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Sweet-search integration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | hooks-plugins-extensions |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Phase 1 research names a verdict and one recommended integration surface before any build phase is planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Agents working in Skilled and in the project repos Skilled is installed into find code with grep and file reads. sweet-search (source vendored for study under `context/sweet-search-main/`) claims a local, index-backed search that makes agent runs cheaper and faster. Nobody has checked whether that claim holds for Skilled's workflows, or what adopting it would cost the people who install Skilled.

### Purpose
Decide from evidence whether sweet-search is worth adopting, and if so, integrate it through the smallest surface that improves the experience in this repo and in external repos, without adding a layer nobody needs.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research how useful sweet-search is and where it could plug into Skilled (phase 1).
- Research what Skilled can learn from sweet-search for its own retrieval (phases 2-3).
- Build the three adopted retrieval improvements inside system-spec-kit (phases 4-6). Features 4-5 from phase 3 stay deferred behind their triggers and get no phase until a trigger fires.
- Each build phase ships its feature-catalog entry, a conversational playbook scenario (489, 490, 491), README and changelog updates, passes a `/local-skilled-alignment` recheck with 0 open P0 and P1 findings, and publishes a before-versus-after benchmark table. Phase 6 closes with all three tables side by side.

### Out of Scope
- Modifying the sweet-search source under `context/`; it is reference material only.
- Installing or integrating sweet-search itself - phase 1 decided against it.
- Embeddings, BM25 fusion, MCP, daemons or a new persistent index - Skilled removed these on purpose.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-sweet-search-research/research/` | Create | sweet-search-research | Deep-research loop artifacts and `research.md` synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-sweet-search-research/ | 10-iteration deep research: usefulness, integration options, UX in Skilled and external repos | Complete |
| 2 | 002-retrieval-lessons-research/ | 5-iteration research: which lexical techniques from sweet-search improve system-spec-kit retrieval without embeddings, MCP or a daemon | Complete |
| 3 | 003-retrieval-feature-design-research/ | 5-iteration research: implementation-ready designs for the five retrieval improvements from phase 2 | Complete |
| 4 | 004-total-candidate-count/ | Build: report `totalCandidates` beside `truncated` in the trigger lookup, plus the section 9 `research/**` row | Complete |
| 5 | 005-stale-index-fallback/ | Build: zero-hit fallback that scores trigger phrases of spec docs the index does not list yet | Complete |
| 6 | 006-rg-flood-control/ | Build: one row per file plus `+N more` lines in the ripgrep wrapper | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sweet-search-research | 002-retrieval-lessons-research | Phase 1 verdict written: no tool integration; lessons worth testing named | `001-sweet-search-research/research/research.md` exists and phase 1 validates |
| 002-retrieval-lessons-research | 003-retrieval-feature-design-research | Phase 2 rated all five lessons and ranked the build list | `002-retrieval-lessons-research/research/research.md` exists and phase 2 validates |
| 003-retrieval-feature-design-research | 004-total-candidate-count | Phase 3 designs for features 1-3 written with files, lines and tests | `003-retrieval-feature-design-research/research/research.md` exists and phase 3 validates |
| 004-total-candidate-count | 005-stale-index-fallback | `totalCandidates` shipped, because phase 5 recomputes it after its merge | Phase 4 tests pass and phase 4 validates |
| 005-stale-index-fallback | 006-rg-flood-control | Keyed-lane changes complete; phase 6 touches only the ripgrep lane | Phase 5 tests pass and phase 5 validates |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Is sweet-search useful enough over grep and the existing trigger index to justify an install step?
- Which surface fits best: a Skilled skill, an MCP registration, a doctor install step, or nothing?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
