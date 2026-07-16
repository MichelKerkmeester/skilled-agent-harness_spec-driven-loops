---
title: "Feature Specification: Phase 1: reference-inventory"
description: "Produce the exhaustive, classified map of every sk-prompt-small-model reference (~799 files) so the rename updates the right files the right way (replace vs regenerate vs git-mv vs history-care)."
trigger_phrases:
  - "sk-prompt-models reference inventory"
  - "rename reference map"
  - "sk-prompt-small-model occurrences"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-models-rename/001-reference-inventory"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/001-reference-inventory"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: reference-inventory

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-core-rename |
| **Handoff Criteria** | A complete classified reference map exists; the replace command + binary exclusions are defined |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-prompt-models-rename specification — the "check every single reference" deliverable. It gates the rest: nothing is edited until the full map exists.

**Scope Boundary**: Discovery + classification ONLY. No file is renamed or edited in this phase. The output is a reference-map document the later phases execute against.

**Dependencies**:
- `rg` (ripgrep) for the sweep. NOTE: in this ripgrep build `-E` means `--encoding`, not extended-regex — use the default regex, never `-E`.

**Deliverables**:
- A complete inventory of every file containing `sk-prompt-small-model` (~799 files / ~4,516 occurrences), each classified into exactly one of: TEXT-REPLACE, REGENERATE, GIT-MV, HISTORY-CARE.
- The exact replacement command + the binary/SQLite/generated-file exclusion list.
- The list of HISTORY-CARE lines (changelogs documenting the original `sk-small-model → sk-prompt-small-model` rename event).

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rename touches ~799 files. A blind global `sed` would corrupt binary/SQLite indexes, leave generated JSON internally stale, and falsify changelogs that document the earlier rename. Before any edit, we need a complete map that says, per file, HOW it should change.

### Purpose
Produce the authoritative classified reference map and the exact replace command + exclusions, so phases 2–6 execute a safe, complete rename with no guesswork.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sweep the whole repo for `sk-prompt-small-model`; bucket by directory + extension.
- Classify each file: TEXT-REPLACE (plain text/markdown/json-config), REGENERATE (advisor skill-graph, spec-memory index, `description.json`/`graph-metadata.json` derived blocks), GIT-MV (the skill folder itself), HISTORY-CARE (rename-documenting changelog lines).
- Identify all binary/SQLite files that MUST be excluded from any text replace.
- Record the exact `rg`/replace command for phase 5's bulk sweep.

### Out of Scope
- Any actual rename or edit (phases 2–5).
- The legacy `sk-small-model` name (separate; parent open question).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-reference-inventory/reference-map.md` | Create | The classified inventory deliverable (this phase's only artifact) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete inventory | Every file with `sk-prompt-small-model` is listed and classified into exactly one bucket; counts reconcile with `rg -l ... | wc -l` |
| REQ-002 | Binary/generated exclusion list | Every `*.sqlite` + compiled index + derived-metadata file is flagged REGENERATE, never TEXT-REPLACE |
| REQ-003 | History-care list | The changelog line(s) documenting the `sk-small-model → sk-prompt-small-model` event are identified for special handling |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Replace command defined | The exact text-replace command + path/glob exclusions for phase 5 is recorded and dry-run-checked |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `reference-map.md` classifies 100% of `sk-prompt-small-model` files; counts reconcile with a fresh `rg` sweep.
- **SC-002**: No file lands in TEXT-REPLACE that is binary/SQLite/generated.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** a fresh `rg -l "sk-prompt-small-model"`, **When** compared to `reference-map.md`, **Then** every file is accounted for with a class.
- **Given** the exclusion list, **When** cross-checked against `find . -name '*.sqlite'`, **Then** every DB touching the name is REGENERATE, not TEXT-REPLACE.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing a hardcoded path | A gate breaks at execution | Cross-check the inventory against the known high-risk list (card-sync guard, deep_*.yaml, reviewer-regression.json, secret-scrubber test, model_profiles profile_refs, models/*.md back-links) |
| Risk | `rg -E` silently returns nothing | Inventory undercounts | Use default regex; never pass `-E` (it is `--encoding` here) |
| Risk | Binary file classified TEXT-REPLACE | Corrupted DB at execution | Enumerate `*.sqlite` + compiled indexes explicitly into REGENERATE |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm the history-care wording for the rename-documenting changelog line(s) (resolved in phase 5; flagged here).
<!-- /ANCHOR:questions -->
