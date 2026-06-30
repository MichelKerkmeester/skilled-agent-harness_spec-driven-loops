---
title: "Feature Specification: Phase 5: specs-history-sweep"
description: "The 'Everything' bulk: token-replace sk-prompt-small-model across all spec docs, logs, archive, and changelogs, applying the history-care carve-out and skipping binaries."
trigger_phrases:
  - "sk-prompt-models specs sweep"
  - "rename everything bulk replace"
  - "history-care changelog carve-out"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/005-specs-history-sweep"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/005-specs-history-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: specs-history-sweep

<!-- SPECKIT_LEVEL: 1 -->

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
| **Phase** | 5 of 6 |
| **Predecessor** | 004-commands-scripts-data |
| **Successor** | 006-regenerate-verify |
| **Handoff Criteria** | All spec/log/archive/changelog text refs replaced; history-care lines handled; no binary string-edited |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-prompt-models-rename specification — the user-chosen "Everything" bulk across `.opencode/specs/**`.

**Scope Boundary**: Spec docs, logs (`*.out/*.err/*.jsonl/*.txt`), `z_archive/**`, and changelogs. The live skill/command/code surfaces are phases 2–4; index regeneration is phase 6.

**Dependencies**:
- Phase 1 map (the TEXT-REPLACE set + the HISTORY-CARE line list + the binary exclusion list).

**Deliverables**:
- Token replace `sk-prompt-small-model` → `sk-prompt-models` across ~700 historical/spec text files, EXCLUDING binaries/SQLite.
- History-care: the changelog line(s) documenting the original `sk-small-model → sk-prompt-small-model` rename get a clarifying parenthetical (e.g. `… → sk-prompt-small-model (later renamed sk-prompt-models)`) rather than a blind flip.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user chose to rewrite ALL references, including historical spec docs, logs, and changelogs (~700 files). A blind global replace would (a) corrupt SQLite/binary files and (b) falsify the changelog that documents the EARLIER `sk-small-model → sk-prompt-small-model` rename by flipping its target.

### Purpose
Apply the bulk text replace across the historical surface safely — skipping binaries (which phase 6 regenerates) and giving the rename-documenting changelog line(s) a history-accurate parenthetical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Token replace across `.opencode/specs/**` text files (docs, `*.out/*.err/*.jsonl/*.txt`, `z_archive/**`), and changelogs.
- History-care handling for the rename-documenting changelog line(s).

### Out of Scope
- Binary/SQLite/compiled indexes (excluded; regenerated in phase 6).
- The live skill/command/code surfaces (phases 2–4).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/**` text files (incl. `z_archive/**`, logs) | Modify | Bulk token replace (binary-excluded) |
| Changelog line(s) documenting the `sk-small-model → sk-prompt-small-model` event | Modify (history-care) | Clarifying parenthetical, not a blind flip |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bulk replace applied | After the sweep, `rg "sk-prompt-small-model" .opencode/specs` returns only the history-care lines (if any) |
| REQ-002 | No binary corrupted | No `*.sqlite`/compiled index was string-edited; `git diff --stat` shows only text files |
| REQ-003 | History accurate | The rename-documenting changelog line reads correctly (parenthetical), not a falsified target |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Spec docs still validate | Touched active spec docs still pass `validate.sh` structure checks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -l "sk-prompt-small-model" .opencode/specs` returns only the deliberately-kept history-care lines (ideally 0).
- **SC-002**: `git diff` touches only text files; no binary diff.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the binary exclusion list, **When** the bulk replace runs, **Then** no `.sqlite` file appears in `git status`.
- **Given** the rename-documenting changelog, **When** read after the sweep, **Then** it still correctly states the original `sk-small-model → sk-prompt-small-model` event.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bulk replace hits a binary | Corrupted DB | Restrict the replace to text globs; exclude `*.sqlite` + the phase-1 REGENERATE set |
| Risk | Falsifying rename history | Misleading changelog | Apply the history-care parenthetical to the enumerated line(s) |
| Risk | Touching a completed packet's frozen evidence | Altered record | Acceptable per the user's "Everything" choice; verify the touched docs still validate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm the exact parenthetical wording for the history-care changelog line(s) at execution time.
<!-- /ANCHOR:questions -->
