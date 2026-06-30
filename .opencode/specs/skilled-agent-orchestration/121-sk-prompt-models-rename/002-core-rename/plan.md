---
title: "Implementation Plan: Phase 2: core-rename"
description: "git mv the folder, then token-replace the skill's own identity, internal back-links, and profile_refs within the moved tree."
trigger_phrases:
  - "sk-prompt-models core rename plan"
  - "git mv skill folder"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/002-core-rename"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/002-core-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: core-rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | git + Markdown/JSON edits |
| **Framework** | none |
| **Storage** | file-based skill config |
| **Testing** | rg sweep of the moved folder; profile_ref resolution |

### Overview
`git mv` the folder so history is preserved and untracked new files travel with it. Then apply the token replace WITHIN the moved tree to fix identity (`name:`, `skill_id`), internal `../../../sk-prompt-small-model/...` back-links, and the five `profile_ref` strings. Leave derived metadata blocks for phase 6 to regenerate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 map identifies the in-folder references

### Definition of Done
- [x] Folder moved; identity + back-links + profile_refs updated
- [x] `rg "sk-prompt-small-model"` inside the new folder = 0 live hits
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Move-then-fix. The folder move handles the path segment; the in-tree token replace handles identity + links.

### Key Components
- **git mv**: the folder rename (history-preserving).
- **identity fields**: `SKILL.md name:`, `graph-metadata.json skill_id`, `description.json`.
- **in-tree links**: `references/models/*.md`, `_index.md`, `pattern_index.md`, `model_profiles.json profile_ref`.

### Data Flow
1. git mv folder.
2. Replace token in the moved tree (excluding any frozen benchmark logs).
3. Verify identity + every link/profile_ref resolves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Move
- [x] `git mv .opencode/skills/sk-prompt-small-model .opencode/skills/sk-prompt-models`; confirm untracked files moved

### Phase 2: Fix identity + links
- [x] Update `SKILL.md` `name:` + Keywords, `graph-metadata.json` `skill_id`, `description.json`, `README.md`
- [x] Token-replace the in-tree back-links + `model_profiles.json` profile_refs

### Phase 3: Verify
- [x] `rg "sk-prompt-small-model"` inside the new folder = 0; resolve each profile_ref; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sweep | No residual old name in folder | `rg` |
| Resolution | profile_ref + back-links resolve | `test -f` on each target |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 map | Internal | Pending | Risk of missing an in-folder ref |
| git | External | Available | No history-preserving move |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Move or edits break self-navigation.
- **Procedure**: `git mv` back + `git checkout` the edited files; the change is move + text only, fully reversible.
<!-- /ANCHOR:rollback -->
