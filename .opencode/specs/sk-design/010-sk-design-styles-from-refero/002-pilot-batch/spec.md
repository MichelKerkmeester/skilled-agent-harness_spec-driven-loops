---
title: "Feature Specification: Refero pilot batch"
description: "Run the extraction harness on ~50 styles, validate each folder against the cursor template, index them, and produce a go/no-go recommendation for the full 1,290-style set."
trigger_phrases:
  - "refero pilot batch"
  - "styles pilot extraction"
  - "50 style go no-go"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/010-sk-design-styles-from-refero/002-pilot-batch"
    last_updated_at: "2026-07-18T10:25:46Z"
    last_updated_by: "claude"
    recent_action: "Ran the ~50-style pilot and validated the output shape"
    next_safe_action: "Record the go/no-go and await the operator decision"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-refero-010-002"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Storage for the full 1,290 set (~13k files) — resolved with the operator at go/no-go."
    answered_questions:
      - "The harness output matches the cursor 6-file template at pilot scale."
---

# Feature Specification: Refero pilot batch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../001-extraction-harness/spec.md` |
| **Successor** | `../003-full-set-wave-a/spec.md` (planned — pending go/no-go) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The harness is proven on three styles, but a decision to extract all 1,290 needs evidence at a representative scale: does the output hold across varied styles, how long does it take, and what does the storage footprint look like?

### Purpose
Run the harness on ~50 styles, validate every folder against the cursor template, build a styles index, and record an explicit go/no-go for the full set — including the storage decision for ~13k files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A ~50-style capture run via `extract-refero.mjs --limit`.
- Per-folder validation: the 6-file shape, valid `design-tokens.json`, non-empty tabs.
- A `styles/README.md` index of the extracted styles.
- A go/no-go recommendation in this child's implementation summary.

### Out of Scope
- The full 1,290-style extraction (child 003+; not authored until go).
- Any harness code change (owned by child 001).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/<slug>/**` | Create | ~50 extracted style folders |
| `.opencode/skills/sk-design/styles/README.md` | Create | Index of extracted styles |
| `.opencode/skills/sk-design/styles/_manifest.json` | Modify | Rows flipped to `captured` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | ~50 styles captured | The manifest shows ~50 `captured` rows with 0 silent failures (errors are logged, not swallowed). |
| REQ-002 | Every folder is well-formed | Each captured folder holds the 6-file shape; `design-tokens.json` parses; the four Extended tabs are non-empty. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Idempotent re-run | Re-running over the pilot rows captures nothing new (no-op). |
| REQ-004 | Indexed | `styles/README.md` lists every extracted style with its Refero URL. |
| REQ-005 | Go/no-go recorded | The implementation summary states a go/no-go for the full set and a storage decision for ~13k files. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ~50 folders pass the 6-file shape + JSON checks.
- **SC-002**: A second run reports 0 new captures.
- **SC-003**: `styles/README.md` and the go/no-go note exist.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A minority of styles fail to render a tab | Low | Logged as `error`, retried later; the pilot still yields its go/no-go. |
| Risk | Commit footprint grows fast | Medium | Pilot is ~500 files; the full-set storage question is decided before child 003. |
| Dependency | The child-001 harness | Low | Consumed as-is; no change. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: ~12–15 minutes for ~50 styles at one page at a time.

### Security
- **NFR-S01**: Same compliance envelope as the harness; public pages only.

### Reliability
- **NFR-R01**: Manifest-per-style writes mean the pilot resumes cleanly if interrupted.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Styles with unusually large Extended tabs are captured whole; no truncation.

### Error Scenarios
- If more than a few styles error, the go/no-go flags reliability before committing to 1,290.

### State Transitions
- Errored pilot rows remain `error` and are picked up by the next run or a full-set wave.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | A run + validation + index; no new code. |
| Risk | 10/25 | External-site reliability at scale is the main unknown, which the pilot measures. |
| Research | 4/20 | Method already settled in child 001. |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Storage for the full set (~13k files): commit all, gitignore the bulky `*-canonical.json`, or hold outside the repo? Decided at go/no-go with the operator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Predecessor**: `../001-extraction-harness/spec.md`
- **Harness**: `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs`
