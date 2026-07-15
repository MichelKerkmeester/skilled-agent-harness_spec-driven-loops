---
title: "Implementation Plan: Phase 9: filename-residual-cleanup"
description: "git mv the residual old-name filenames, repair their references, and reconcile the repo-root README without bundling unrelated WIP."
trigger_phrases:
  - "filename residual cleanup plan"
  - "readme reconcile plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/005-sk-prompt-models-rename/009-filename-residual-cleanup"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/009-filename-residual-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: filename-residual-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | git + Markdown |
| **Framework** | none |
| **Storage** | file-based |
| **Testing** | git ls-files glob + playbook link check + README HEAD check |

### Overview
`git mv` the 2 live playbook filenames + the live changelog entry to drop the old skill name, repair the manual-testing-playbook index references in the same change, and reconcile the repo-root README to the new name by isolating its rename hunk from the unrelated pre-existing WIP (or committing with the WIP at the user's direction). Confirm with a `git ls-files '*sk-prompt-small-model*'` glob and a README HEAD check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirm whether `.opencode/changelog/sk-prompt-small-model` is a file or dir + what references it

### Definition of Done
- [x] `git ls-files '*sk-prompt-small-model*'` returns only history/archive; README HEAD says new name; no unrelated WIP committed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rename-and-repair. Move the file, fix every reference to it in the same change so no link dangles.

### Key Components
- **git mv**: the filename moves (history preserved).
- **manual_testing_playbook.md**: the index whose links must be repaired.
- **README.md**: reconciled by isolating its rename hunk from WIP.

### Data Flow
1. git mv the 2 playbook files + the changelog entry.
2. Repair references in the playbook index.
3. Reconcile README (isolate hunk or commit-with-WIP).
4. Glob + HEAD checks confirm.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Filenames
- [x] git mv the 2 cli-opencode playbook files → `…-with-sk-prompt-models.md`
- [x] Confirm + git mv `.opencode/changelog/sk-prompt-small-model` → `sk-prompt-models`

### Phase 2: References + README
- [x] Repair the manual_testing_playbook.md index references to the renamed files
- [x] Reconcile README to the new name without bundling unrelated WIP

### Phase 3: Verify
- [x] `git ls-files '*sk-prompt-small-model*'` = history/archive only; README HEAD says new name; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Glob | No live old-name filenames | `git ls-files '*sk-prompt-small-model*'` |
| Link | Playbook references resolve | grep the index for the old filenames |
| HEAD | README renamed | `git show HEAD:README.md \| grep` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git | External | Available | No history-preserving move |
| WIP owner decision (README) | External | Pending | README reconciliation strategy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A renamed link dangles or the README commit bundles WIP.
- **Procedure**: `git mv` back / `git checkout` the index; for the README, `git reset` the commit and re-isolate. All reversible.
<!-- /ANCHOR:rollback -->
