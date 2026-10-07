---
title: "Implementation Plan: Deep-Improvement 3-Lane Doc Rebuild"
description: "Reconstructed Level 2 implementation plan for the 007 doc-rebuild child, derived from spec.md and git history. It restates the mirrored lane-grouped taxonomy, the operator-locked decisions, and the acceptance checks; the original plan was never written."
trigger_phrases:
  - "deep-improvement 3lane doc rebuild plan"
  - "feature catalog playbook rebuild plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Deep-Improvement 3-Lane Doc Rebuild

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown feature-catalog entries and playbook scenarios under the `deep-improvement` skill |
| **Framework** | sk-doc feature_catalog / manual_testing_playbook templates |
| **Storage** | Not recorded |
| **Testing** | sk-doc validator on both landings; `validate.sh --strict` for this folder |

### Overview
Re-architect both the `feature_catalog` and `manual_testing_playbook` trees into one mirrored, lane-grouped taxonomy that covers all three lanes (A: agent-improvement, B: model-benchmark, C: skill-benchmark) plus the shared surface, conforming to the sk-doc templates. Lane C is partial in the catalog and absent from the playbook, so it is authored fresh while existing Lane A/B entries are moved and only confirmed-stale text is fixed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Operator-locked decisions confirmed (`spec.md` §2)
- [ ] Execution contract and taxonomy mapping available (`handover.md`)
- [ ] sk-doc templates and validator available

### Definition of Done
- [ ] Both trees share an identical lane-grouped category dir set
- [ ] Every entry conforms to its sk-doc template
- [ ] sk-doc validator exit 0 on both landings
- [ ] `validate.sh <this folder> --strict` green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One mirrored, lane-grouped taxonomy used by both trees — the category spine is identical; catalog holds feature entries and the playbook holds scenario entries.

### Key Components
- **feature_catalog tree**: lane-grouped category dirs with feature entries
- **manual_testing_playbook tree**: the same lane-grouped category dirs with scenario entries
- **Both landings**: a 3-lane legend + a category table whose links resolve and counts match dirs
- **Lane C content**: authored fresh + complete in both trees

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Mirror check + coverage check + stale two-lane text grep | Not recorded |
| Integration | sk-doc validator on both landings | sk-doc validator |
| Static | Folder validation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc templates + validator | Internal | Not recorded | Entries cannot be conformed or verified |
| cli-opencode (GPT-5.5 drafts) | External | Not recorded | Drafting engine unavailable; fall back to direct authoring |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not recorded.
- **Procedure**: Not recorded — changes were to be committed by explicit pathspec so the rebuild could be reverted per tree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Not recorded | Not recorded |
| Implementation | Not recorded | Not recorded |
| Verification | Not recorded | Not recorded |
| **Total** | | **Not recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Commit scoped by explicit pathspec (never `git add -A`)

### Rollback Procedure
1. Not recorded.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not recorded.
<!-- /ANCHOR:enhanced-rollback -->
