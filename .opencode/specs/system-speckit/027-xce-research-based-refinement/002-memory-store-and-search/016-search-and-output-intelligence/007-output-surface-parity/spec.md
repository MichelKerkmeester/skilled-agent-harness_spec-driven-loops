---
title: "Feature Specification: Phase 7: output-surface-parity"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "027/002/017/007-output-surface-parity"
    last_updated_at: "2026-06-17T08:40:00Z"
    last_updated_by: "contract-engineer"
    recent_action: "Mandated similarity-only render + surface-parity clause; spec superseded by impl-summary"
    next_safe_action: "Run live cross-model A/B render-consistency probe"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit/027-017/007-output-surface-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which single metric governs rendered output? similarity, 0–1, two decimals, on every surface."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: output-surface-parity

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-command-contract-structural |
| **Successor** | None |
| **Handoff Criteria** | Contract mandates similarity 0–1 / 2dp + five core slots + surface-parity clause; cross-file grep + `validate.sh --strict` green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the search-and-output-intelligence implementation: `/memory:search` output surface-parity (recommendations #4/#5 / O2).

**Scope Boundary**: The `/memory:search` contract and presentation asset render policy only. No `lib/search/` code change; builds on the O1 (phase 006) structural layer without touching it.

**Dependencies**:
- Phase 006 (O1) structural arg-resolution layer - left untouched; this phase edits only the render/contract layer above it.

**Deliverables**:
- A hard mandate: `similarity`, 0–1, two decimals as the sole per-row metric, with `confidence`/percentage explicitly banned in rendered output.
- Five named mandatory core slots (query echo, similarity, id, title, STATUS footer) + an extended render self-check.
- A surface-parity clause (same field set/names/scale across `--command`, direct prompt, and conversation) and two named optional trailing fields (`requestQuality`, `citationPolicy`).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The same retrieval result rendered differently per model: DeepSeek showed `confidence 0.36` while Kimi showed `similarity 0.68` for the identical row, so two surfaces could not be compared or diffed. The previous contract only soft-hinted "render as 0–1 two decimals" and left slot/field presence to model latitude.

### Purpose
Make `/memory:search` mandate one score, one scale, one name on every surface, with named mandatory slots and sanctioned optional fields, so any two surfaces return comparable, diffable rows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hard mandate of `similarity` (0–1, two decimals) as the sole rendered metric; explicit ban on `confidence`/percentage.
- Five named mandatory core slots + extended render self-check.
- Surface-parity clause + two named optional trailing fields (`requestQuality`, `citationPolicy`) + a COSTAR register note.

### Out of Scope
- Any `lib/search/` code change - this is a contract/render-policy change only.
- Mechanical enforcement (a lint/guard rejecting a bad render) - the ban is contract-level, a separate change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/memory/search.md` | Modify | COSTAR note; §3 score mandate + ban, core-slot mandate, surface-parity clause, named optional fields, extended self-check; §7 boundary entry |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modify | COSTAR note; §2 core-slot mandate, score mandate + ban, surface-parity clause, named optional-field rendering example |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Mandate `similarity` 0–1 / two-decimals as the sole rendered metric; ban `confidence`/percentage | Grep: mandate + ban present in both files; percentage divided by 100 before emit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Name five mandatory core slots; extend the render self-check | Grep: five slots named mandatory; self-check confirms presence + no `confidence`/percentage |
| REQ-003 | Add a surface-parity clause + two named optional trailing fields | Grep: surface-parity clause + `requestQuality`/`citationPolicy` named optional in both files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A row that renders `confidence` or a percentage is contract-violating; only `similarity` 0–1 / 2dp is valid.
- **SC-002**: Cross-file consistency grep + `validate.sh --strict` both green (0 errors, 0 warnings).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 (O1) structural layer | Builds on it; must not regress §0/salience/startup gating | Left untouched; verified by grep that O1 lines are unchanged |
| Risk | Enforcement is contract-level, not mechanical | Med — a model could still emit a bad render | Render self-check + the explicit ban; a lint/guard is a separate change |
| Risk | Render consistency under the new contract is unmeasured live | Med | Documented cross-model A/B follow-up via `--command` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Shipped; see `implementation-summary.md`. The live cross-model A/B render-consistency probe is a documented follow-up, not a blocking question.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
