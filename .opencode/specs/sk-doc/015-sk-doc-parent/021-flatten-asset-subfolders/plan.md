---
title: "Implementation Plan: Flatten redundant asset subfolders"
description: "git mv the 17 templates up into each packet's assets/, then anchored packet-scoped path rewrites across live surfaces; verify every reference resolves."
trigger_phrases:
  - "flatten asset subfolders plan"
  - "125 sk-doc phase 021 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/021-flatten-asset-subfolders"
    last_updated_at: "2026-07-07T14:54:32.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-021 plan"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Flatten redundant asset subfolders

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | sk-doc packet template assets + reference paths in YAML/MD |
| **Framework** | git mv + anchored path sweep |
| **Storage** | In-repo file moves |
| **Testing** | `test -e` on rewritten paths; stale-ref grep |

### Overview
Deterministic reorg. `git mv` each redundant subfolder's templates directly into its `assets/`, remove the empty subdir, then rewrite `<packet>/assets/<sub>/` → `<packet>/assets/` across live surfaces with six anchored, packet-scoped replacements. Verify 0 stale live refs and that every rewritten template path resolves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Redundant single-subfolder packets identified (6); multi-family create-skill excluded
- [x] Collision-safe (each packet's `assets/` held only the one subfolder)

### Definition of Done
- [ ] 6 subfolders gone; 17 templates loose in assets/
- [ ] 0 stale live refs; every rewritten path resolves
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
`git mv` (preserves history) + anchored per-packet path rewrite scoped to live surfaces.

### Key Components
- **Move**: templates from `assets/<sub>/` to `assets/`; remove empty subdir.
- **Sweep**: six anchored replacements over live files (exclude specs/changelog).

### Data Flow
1. Collision-check, then `git mv` each of the 17 templates up.
2. Null-delimited loop rewrites the six subfolder paths on every live reference file.
3. Verify: 0 stale live refs; `test -e` each rewritten path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scan packets; identify the six redundant single-subfolders
- [x] Confirm no collisions (only the subfolder lived in each assets/)

### Phase 2: Implementation
- [x] `git mv` 17 templates up; remove the six empty subdirs
- [x] Anchored packet-scoped path sweep across live surfaces

### Phase 3: Verification
- [x] 0 stale live refs; every rewritten path resolves (missing=0)
- [ ] `validate.sh` passes; commit; push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path resolution | Rewritten template refs | `test -e` |
| Stale-ref sweep | Live surfaces | `rg` fixed-strings |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Concurrent-session quiet on shared docs | Internal | Churning | Scoped pathspec commit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a rewritten reference fails to resolve.
- **Procedure**: `git mv` is reversible; `git revert` the scoped commit restores the subfolders + old refs together.
<!-- /ANCHOR:rollback -->
