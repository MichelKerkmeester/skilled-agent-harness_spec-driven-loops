---
title: "Implementation Plan: Phase 2: playbook-marker-backfill"
description: "Insert the template's Result persistence block into the 11 roots that lack it, with each root's own path in the recorder command."
trigger_phrases:
  - "playbook marker backfill plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: playbook-marker-backfill

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | Skilled manual testing playbook roots |
| **Storage** | None |
| **Testing** | The fleet validator and `validate_document.py` |

### Overview
All 11 roots share one shape: an intro, `---`, then `## 1. OVERVIEW`. One script inserts the block above that `---` in each root and stops on any root that differs, so no root is edited by hand.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The fleet validator exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The same block in every root, copied from the root template.

### Key Components
- **Result persistence block**: the marker comment, the outcome rule and the recorder command for that root.

### Data Flow
The validator reads the marker. A runner reads the command.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 11 root playbooks | Scenario index and policy | Add the block | Fleet validator exits 0 |
| The commit hook's doc-version gate | Raises a doc's edition when its body changes | Expected to raise each root | The commit output lists each raise |

Required inventories:
- Same-class producers: the fleet validator lists every root without the marker. It listed exactly these 11.
- Consumers of changed symbols: N/A. No code changed.
- Matrix axes: N/A.
- Algorithm invariant: N/A.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the fleet counts and each root's doc-validator issue count. Implementation inserts the block into the 11 roots. Verification reruns the fleet and both counts. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | All 59 roots | `validate-playbook-package.cjs --json`, compared with the baseline |
| Manual | The 11 roots' structure | `validate_document.py --type playbook` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 | Internal | Green | No final block text |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the fleet fails or a root's doc count rises.
- **Procedure**: `git checkout --` the 11 roots before the commit, or `git revert` the phase commit after it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Insertion | Phase 1's block text | The fleet passing |
<!-- /ANCHOR:phase-deps -->

---
