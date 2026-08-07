---
title: "Implementation Plan: Refero pilot batch"
description: "Run the harness on ~50 styles, validate the output shape, index it, and record a go/no-go for the full 1,290-style set."
trigger_phrases:
  - "refero pilot plan"
  - "styles pilot plan"
  - "go no-go plan"
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
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Refero pilot batch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Consumes the child-001 Node harness; validation via `python3`/`node` shape checks |
| **Framework** | None |
| **Storage** | ~50 `styles/<slug>/` folders + `styles/README.md` index + `_manifest.json` |
| **Testing** | Per-folder 6-file shape + JSON parse; idempotent re-run check |

### Overview
Run `extract-refero.mjs --limit` to capture ~50 styles, validate every folder, write the styles index, and record a go/no-go for the full set including the storage decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Child 001 harness passes its self-test

### Definition of Done
- [x] ~50 folders captured and validated
- [x] Re-run is a no-op
- [x] Index written; go/no-go recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A batched, resumable run over the manifest; validation is external shape-checking, not new code.

### Key Components
- The child-001 harness (capture + manifest).
- A validation sweep (6-file shape, JSON parse, non-empty tabs).
- The `styles/README.md` index generator (from the manifest).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `styles/<slug>/**` | n/a (new) | ~50 captured folders | shape + JSON checks |
| `styles/README.md` | n/a (new) | index | lists every captured style |
| `styles/_manifest.json` | crawl state | rows → captured | ~50 captured, 0 silent errors |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Run
- [x] `extract-refero.mjs --limit ~47` to reach ~50 total captured

### Phase 2: Validate
- [x] Per-folder 6-file shape + `design-tokens.json` parse + non-empty Extended tabs

### Phase 3: Index + decide
- [x] Write `styles/README.md`; record go/no-go + storage decision
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Shape check every captured folder; count captured vs errored in the manifest.
- Re-run with `--limit` and confirm 0 new captures.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The child-001 harness and a reachable styles.refero.design.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the captured `styles/<slug>/` folders and the index; reset the affected manifest rows to `pending`. No code change to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Validation depends on the run; the go/no-go depends on validation results.
- Child 003+ depends on this child recording a go and a storage decision.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Estimate |
|------|----------|
| ~50-style run | ~12–15 min |
| Validation + index + write-up | short |
<!-- /ANCHOR:effort -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Predecessor**: `../001-extraction-harness/`
