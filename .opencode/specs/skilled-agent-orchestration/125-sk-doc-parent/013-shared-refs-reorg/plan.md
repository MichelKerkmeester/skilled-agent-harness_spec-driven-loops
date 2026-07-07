---
title: "Implementation Plan: Move shared/references/global/* up into shared/references/"
description: "Deterministic git-mv of the 6 global/ files plus a scripted repoint pass over the ~47 citing files, verified by a repo-wide grep for the old path and the link checker."
trigger_phrases:
  - "shared refs reorg plan"
  - "125 sk-doc phase 013 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/013-shared-refs-reorg"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-013 plan"
    next_safe_action: "Confirm the full citation list before moving the 6 files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Move shared/references/global/* up into shared/references/

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Flat markdown reference files + JSON (`hub-router.json`) under `.opencode/skills/sk-doc/` |
| **Framework** | sk-code/sk-design "deterministic move, scripted repoint" pattern |
| **Storage** | In-place directory flatten (`git mv` of 6 files) |
| **Testing** | Repo-wide grep for the old `global/` path; markdown link checker |

### Overview
`shared/references/` holds nothing today except its `global/` subdirectory, so the move itself is a plain relocation of 6 files with no filename collisions. The larger part of the work is the citation sweep: roughly 47 files across the hub (`SKILL.md`s, `references/README.md`s, other reference docs, and `hub-router.json`) cite the `global/` path in prose or JSON, not via filesystem symlinks. A deterministic repoint script does the mechanical find-and-replace; an LLM is not used for the bulk edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed `shared/references/` has no top-level files today (only the `global/` subdirectory) — no collision risk
- [x] Confirmed no filesystem symlink targets `shared/references/global/...` — the sweep is prose/JSON only

### Definition of Done
- [ ] All 6 files live directly under `shared/references/`; `global/` no longer exists
- [ ] 0 remaining citations of `global/` under `.opencode/skills/sk-doc/`
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic move + scripted repoint, reusing the pattern already established for `create-skill`'s own reference regrouping.

### Key Components
- **Move script**: `git mv` each of the 6 files from `shared/references/global/` to `shared/references/`; remove the empty `global/` directory.
- **Repoint script**: a basename/path-to-canonical mapper that rewrites every citation of `shared/references/global/<file>` to `shared/references/<file>` across the ~47 known citing files.
- **Verification sweep**: a fresh repo-wide grep for the literal string `references/global` under `.opencode/skills/sk-doc/`, confirming 0 hits, plus the markdown link checker.

### Data Flow
1. Confirm the full citation list with a fresh grep (do not rely solely on the count captured at spec time).
2. `git mv` the 6 files up one level; remove the empty `global/` directory.
3. Run the repoint script over every citing file.
4. Re-grep for `references/global` to confirm 0 remaining hits.
5. Run the markdown link checker and `parent-skill-check.cjs`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm the citation list with a fresh repo-wide grep for `references/global`
- [ ] Confirm the 6-file move has no destination collisions (already checked clean at spec time)

### Phase 2: Implementation
- [ ] `git mv` the 6 files from `shared/references/global/` to `shared/references/`
- [ ] Remove the now-empty `global/` directory
- [ ] Run the repoint script across every citing file

### Phase 3: Verification
- [ ] Re-grep for `references/global` under `.opencode/skills/sk-doc/`, confirm 0 hits
- [ ] Run the markdown link checker, confirm 0 broken links
- [ ] Run `parent-skill-check.cjs`, confirm 0 new warnings
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Citation sweep completeness | Repo-wide `references/global` string search | `grep -r` |
| Link integrity | Every markdown/JSON reference under sk-doc | Markdown link checker |
| Canon scope | Hub-level invariants unaffected by the move | `parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Markdown link checker | Internal | Green | Cannot confirm 0 broken links |
| `012-quality-control-rename/` completion | Internal | Depends | Avoids compounding two path-moving phases' diffs against the same files simultaneously |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the repoint script misses citations and the link checker reports new breaks after landing.
- **Procedure**:
  1. `git mv` the 6 files back under `shared/references/global/`.
  2. Revert the repoint script's edits to their pre-move committed versions.
  3. Re-run the link checker to confirm the revert is clean, then re-plan the citation sweep before retrying.
<!-- /ANCHOR:rollback -->
