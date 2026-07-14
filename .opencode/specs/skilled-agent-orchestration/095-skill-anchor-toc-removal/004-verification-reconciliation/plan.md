---
title: "Implementation Plan: Verification & Reconciliation"
description: "Plan for full-coverage residual + content-safety verification and 117 packet metadata reconciliation."
trigger_phrases:
  - "verification reconciliation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/095-skill-anchor-toc-removal/004-verification-reconciliation"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Verified zero residue + content safety across the change set"
    next_safe_action: "Finalize parent statuses and close packet"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Verification & Reconciliation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Tools** | ripgrep, python diff classifier, `validate_document.py`, `validate.sh`, `devin` |
| **Coverage** | All in-scope files + full git diff |

### Overview
Verify the change set with deterministic, full-coverage checks: zero residue, every removed diff
line classified as TOC/anchor/whitespace (attributed per file), validator + test suite green, and
strict packet validation. An independent CLI-Devin/SWE-1.6 sweep is dispatched as a secondary check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 001-003 complete

### Definition of Done
- [x] Zero residue; zero unclassified bulk removals
- [x] Validator suite 11/11
- [ ] `validate.sh --strict` green on packet
- [ ] Metadata + statuses reconciled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered verification: residual greps → diff classification → tool validation → independent review → reconcile.

### Key Components
- Per-file diff classifier (attributes any unclassified removal to its file).
- `generate-description.js` for description.json + graph-metadata.json.

### Data Flow
greps → classifier → validators → metadata generation → strict validate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Residual + safety
- [x] 0 TOC headings, 0 standalone anchors in scope
- [x] Classify all removed diff lines; 0 unclassified from bulk pass
- [x] Only intended non-md files changed; carve-outs intact

### Phase 2: Tool validation
- [x] `validate_document.py` on changed READMEs (exit 0)
- [x] sk-doc validator suite 11/11
- [x] CLI-Devin/SWE-1.6 dispatch attempted (auto-mode blocked shell; deterministic check supersedes)

### Phase 3: Reconcile
- [ ] Generate description.json + graph-metadata.json (parent + 4 children)
- [ ] `validate.sh --strict` on packet
- [ ] Update parent spec.md phase statuses + continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residual | Zero TOC/anchor | ripgrep |
| Content safety | Diff classification | python |
| Doc validity | READMEs + suite | validate_document.py |
| Packet | Strict structure | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-003 | Internal | Green | Nothing to verify |
| node + spec-kit dist scripts | Internal | Green | Cannot generate metadata |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification finds a defect.
- **Procedure**: Fix the specific file(s); re-run the affected checks; do not broaden scope.
<!-- /ANCHOR:rollback -->
