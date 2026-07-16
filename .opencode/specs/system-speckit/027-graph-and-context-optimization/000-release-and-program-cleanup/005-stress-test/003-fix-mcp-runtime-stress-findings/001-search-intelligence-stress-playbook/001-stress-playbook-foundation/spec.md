---
title: "Feature Specification: Search Intelligence Stress-Test Playbook Foundation"
description: "The foundation phase of the search-intelligence stress-test playbook: the prompt corpus, the cross-AI dispatch harness, and the five-dimension scoring rubric the scenario design and execution phases build on."
trigger_phrases:
  - "search intelligence stress playbook foundation"
  - "memory search cross-AI test rubric"
  - "external vs MCP search comparison"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/001-stress-playbook-foundation"
    last_updated_at: "2026-06-08T12:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored foundation leaf spec after phase-parent restructure"
    next_safe_action: "Resume scenario design (phase 002)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000116"
      session_id: "026-stress-001-stress-playbook-foundation"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Search Intelligence Stress-Test Playbook Foundation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook |
| **Predecessor** | None |
| **Successor** | 002-search-scenario-design |
| **Handoff Criteria** | The corpus, dispatch harness, and scoring rubric are defined well enough for the scenario-design phase to enumerate concrete cases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit search and intelligence surfaces (memory_search, memory_context, code_graph_query, advisor_recommend, the intent classifier) grew organically across 26+ optimization packets. A sibling packet catalogs 17 defects from a single live session. There is no reproducible, cross-AI stress test that quantifies how well the search intelligence performs under realistic prompt variation, so quality regressions surface only in production.

### Purpose
Lay the foundation for a repeatable playbook: a fixed prompt corpus, a cross-AI dispatch harness that runs the corpus through cli-codex and cli-opencode, and a five-dimension scoring rubric (correctness, tool selection, latency, token efficiency, hallucination). The most informative axis is the asymmetry between cli-opencode, which loads the full Spec Kit Memory MCP runtime, and the external CLIs that do not — it reveals whether the search intelligence adds measurable value over off-the-shelf capability.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The fixed prompt corpus shape (scenarios × prompt types).
- The cross-AI dispatch harness contract for cli-codex and cli-opencode.
- The five-dimension scoring rubric and how a run is recorded.

### Out of Scope
- Enumerating the concrete scenarios (phase 002, scenario design).
- Executing the corpus and recording findings (phase 003, scenario execution).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Foundation spec for the corpus, harness, and rubric |
| `plan.md` | Create | Approach for building the playbook foundation |
| `tasks.md` | Create | Task breakdown for the foundation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fixed, reproducible prompt corpus | The corpus is enumerated as scenarios × prompt types and is stable across runs |
| REQ-002 | A cross-AI dispatch harness | The same corpus runs through cli-codex and cli-opencode with comparable invocation shapes |
| REQ-003 | A five-dimension scoring rubric | Each run scores correctness, tool selection, latency, token efficiency, and hallucination |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The MCP-vs-external axis is measurable | Scores separate cli-opencode (full MCP runtime) from external CLIs so the value of the search intelligence is visible |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The corpus, harness, and rubric are defined precisely enough that scenario design can enumerate concrete cases without re-deciding the methodology.
- A dry run through one scenario produces a scored result on all five rubric dimensions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Scoring correctness and hallucination requires a reference answer per prompt; without curated references the rubric is subjective.
- Latency and token efficiency depend on provider availability and quota, so cross-run comparisons must note the provider state.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many runs per (scenario × CLI) cell — N=1 baseline, or N=3 for a variance signal?
- Fixed-corpus scoring or the live production memory database (realistic vs reproducible)?
<!-- /ANCHOR:questions -->
