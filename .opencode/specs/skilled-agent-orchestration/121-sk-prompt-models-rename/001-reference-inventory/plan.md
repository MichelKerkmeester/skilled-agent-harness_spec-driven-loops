---
title: "Implementation Plan: Phase 1: reference-inventory"
description: "Sweep the repo for sk-prompt-small-model, bucket by dir/extension, classify every file, and record the replace command + binary exclusions."
trigger_phrases:
  - "sk-prompt-models reference inventory plan"
  - "rename reference map plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/001-reference-inventory"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: reference-inventory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (rg/find) + Markdown deliverable |
| **Framework** | none (discovery) |
| **Storage** | `001-reference-inventory/reference-map.md` |
| **Testing** | Count reconciliation vs a fresh rg sweep |

### Overview
Sweep `sk-prompt-small-model` repo-wide, bucket by directory + extension, then classify each file into TEXT-REPLACE / REGENERATE / GIT-MV / HISTORY-CARE. Cross-check against the known high-risk hardcoded list. Enumerate binary/SQLite/compiled-index files into REGENERATE. Record the exact text-replace command + path exclusions for phase 5, and dry-run it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `rg` available; repo clean enough to sweep

### Definition of Done
- [x] 100% of files classified; counts reconcile
- [x] Binary/generated exclusion list complete; replace command dry-run-checked
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Discovery-then-classify. The map is the contract phases 2–6 execute against; no edits happen here.

### Key Components
- **rg sweeps**: `rg -l "sk-prompt-small-model"` (files), `rg -c` (per-file counts), grouped by `sed` on dir/extension.
- **classifier buckets**: TEXT-REPLACE / REGENERATE / GIT-MV / HISTORY-CARE.
- **reference-map.md**: the deliverable.

### Data Flow
1. rg lists files + counts.
2. Each file assigned a bucket by directory + type + content role.
3. Binary/SQLite/compiled indexes forced to REGENERATE.
4. Rename-documenting changelog lines flagged HISTORY-CARE.
5. The replace command + exclusions recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Sweep
- [x] `rg -l "sk-prompt-small-model" | wc -l` and `rg -c` totals; bucket by top-level dir + extension
- [x] Enumerate `*.sqlite` + compiled indexes + derived-metadata files (REGENERATE set)

### Phase 2: Classify
- [x] Assign every file a bucket; cross-check vs the known high-risk hardcoded list
- [x] Identify the rename-documenting changelog line(s) (HISTORY-CARE)

### Phase 3: Record
- [x] Write `reference-map.md` (buckets + counts + exclusions + replace command)
- [x] Dry-run the replace command (no `-i`/no write) and confirm hit counts match
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reconciliation | Map covers 100% of rg hits | `rg -l ... | wc -l` vs map count |
| Exclusion check | No binary in TEXT-REPLACE | `find . -name '*.sqlite'` cross-check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ripgrep | External | Available | No sweep |
| Known high-risk list (from the approved plan) | Internal | Available | Could miss a hardcoded path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Inventory found incomplete later.
- **Procedure**: Re-run the sweep and amend `reference-map.md`; no source files were touched, so there is nothing to revert.
<!-- /ANCHOR:rollback -->
