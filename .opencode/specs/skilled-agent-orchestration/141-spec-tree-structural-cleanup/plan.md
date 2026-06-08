---
title: "Implementation Plan: Spec-tree structural cleanup"
description: "Audit the active spec tree for duplicate sibling numbers and impure phase-parent roots, then rename the duplicates and restructure the conformant parents with coordinated metadata refresh and scoped commits."
trigger_phrases:
  - "spec tree cleanup plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-spec-tree-structural-cleanup"
    last_updated_at: "2026-06-08T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan executed; 4 parents restructured + 2 duplicates fixed"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000141"
      session_id: "spec-141-spec-tree-structural-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Spec-tree structural cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash + Node CLIs (generate-description, validate.sh) |
| **Framework** | system-spec-kit spec-folder tooling |
| **Storage** | spec-folder JSON metadata + spec-memory DB |
| **Testing** | `validate.sh --strict` per packet |

### Overview
Audit the 1,751 active spec folders deterministically, then resolve the two active duplicate-number sets with renames and bring the conformant phase parents to purity by moving root heavy docs into a new `001` phase and shifting existing phases up, each with coordinated identity and manifest refresh.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit complete and cross-checked by an independent gpt-5.5-fast pass
- [x] Success criteria measurable (audit clean; parents validate --strict)
- [x] Dependencies identified (generate-description, validate.sh)

### Definition of Done
- [x] All confirmed violations resolved or documented
- [x] Each restructured parent and its phases validate --strict
- [x] Docs updated (spec/plan/tasks/checklist/impl-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic audit plus per-packet mechanical restructure with a coordinated metadata refresh.

### Key Components
- **Audit script**: Detects duplicate sibling numbers and phase-parents-with-heavy-docs.
- **Rename/restructure helper**: git mv + identity rewrite + parent `children_ids` patch.

### Data Flow
The audit emits violations, each violation drives a scoped set of filesystem renames, identity rewrites flow from the new location into the packet's JSON and frontmatter, and `validate.sh` gates the commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| packet `description.json` | Per-folder identity (`specFolder`, `folderSlug`) | update via generate-description | `jq .specFolder` matches new path |
| packet `graph-metadata.json` | Identity + `children_ids` manifest | update from location / surgical patch | `jq .children_ids` lists new phases |
| markdown frontmatter | `packet_pointer` continuity | set to new path | `rg packet_pointer` resolves |

Required inventories:
- Same-class producers: `rg -n 'packet_pointer|spec_folder|specFolder' <packet>`.
- Consumers of changed paths: parent `graph-metadata.json` `children_ids` and the aggregate `descriptions.json`.
- Matrix axes: {duplicate rename, phase-parent restructure} x {plain-feature-spec root, phase-parent-style root}.
- Algorithm invariant: a packet's identity always derives from its real folder location after the move.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit
- [x] Deterministic scan of active spec folders
- [x] Independent gpt-5.5-fast cross-check
- [x] Conformance inspection per candidate

### Phase 2: Core Restructure
- [x] Two duplicate renames (Rule A)
- [x] Four phase-parent restructures (Rule B)
- [x] Revert the non-conformant review-campaign parent

### Phase 3: Verification
- [x] `validate.sh --strict` per parent and phase
- [x] Scoped commits with stat verification
- [x] Tracking docs updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Each restructured packet | `validate.sh --strict` |
| Identity | packet_pointer / specFolder / children_ids | `jq` + `rg` |
| Audit re-run | Active Rule-A violations | the audit script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| generate-description.js | Internal | Green | Per-folder description regen unavailable |
| validate.sh | Internal | Green | Cannot gate commits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A packet cannot reach clean without fabricating docs.
- **Procedure**: `git reset` + `git checkout -- <subtree>` + remove leftover untracked dirs to restore HEAD.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ──► Phase 2 (Restructure) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Restructure |
| Restructure | Audit | Verify |
| Verify | Restructure | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Med | 1-2 hours |
| Restructure | High | 4-6 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Each packet committed independently
- [x] HEAD recoverable per packet
- [x] Scoped commits avoid foreign-file entanglement

### Rollback Procedure
1. Identify the packet subtree to revert.
2. `git reset -- <subtree>` then `git checkout -- <subtree>`.
3. Remove leftover untracked shifted dirs.
4. Re-validate the restored packet against HEAD.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Git restore of the spec-folder subtree
<!-- /ANCHOR:enhanced-rollback -->
