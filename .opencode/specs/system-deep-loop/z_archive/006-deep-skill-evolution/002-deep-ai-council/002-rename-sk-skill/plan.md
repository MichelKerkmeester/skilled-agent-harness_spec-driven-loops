---
title: "Implementation Plan: 115/002 — skill dir rename"
description: "Mirror of 007's mechanical-rename pattern, applied to deep-ai-council → sk-ai-council."
trigger_phrases: ["115 002 plan", "skill dir rename plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/002-rename-sk-skill"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/002 plan.md"
    next_safe_action: "Author 115/002 tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115002"
      session_id: "115-002-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 115/002 — skill dir rename

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| Language/Stack | shell (git mv + sed) |
| Framework | spec-kit + cli-devin SWE-1.6 (verification) |
| Storage | filesystem |
| Testing | rg + jq + validate.sh --strict |

### Overview
Mirror 007's mechanical-rename pattern: `git mv` directory + `sed -i ''` literal-substitution on all in-scope files inside the renamed dir + create v3.0.0.0 changelog. No code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 001 emitted `scratch/rename-plan.json` with this phase's file_scope
- [ ] git status clean for `.opencode/skills/deep-ai-council/`

### Definition of Done
- [ ] `git mv` succeeded; old dir gone
- [ ] sed bulk-replace clean on all in-scope files
- [ ] `rg "deep-ai-council" .opencode/skills/sk-ai-council/` returns hits ONLY in changelog/v1+v2
- [ ] `changelog/v3.0.0.0.md` created
- [ ] `validate.sh --strict 002/` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Mechanical rename**, same as 007.

### Key Components
- `.opencode/skills/deep-ai-council/` → `sk-ai-council/` (whole tree)
- ~80 internal files with literal-substitution
- new `changelog/v3.0.0.0.md`

### Data Flow
```
git mv → sed -i '' on file_scope → create v3.0.0.0.md → rg verification → validate
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify 001/scratch/rename-plan.json present
- [ ] Git status clean check

### Phase 2: Implementation
- [ ] git mv directory
- [ ] sed -i '' loop on file_scope (exclude changelog/v1+v2)
- [ ] Create v3.0.0.0.md

### Phase 3: Verification
- [ ] rg post-edit on renamed dir: 0 hits outside excluded changelogs
- [ ] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Scope | Tool |
|------|-------|------|
| rg post-rename | renamed dir | `rg -c "deep-ai-council"` |
| strict validate | 002 spec folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 001 rename-plan.json | internal | gated |
| git mv | shell | Green |
| sed -i '' | shell (macOS) | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh --strict fails OR rg shows missed hits
- **Procedure**: `git reset --hard HEAD` to revert the rename + edits (uncommitted state); or `git revert <sha>` if commits landed
<!-- /ANCHOR:rollback -->
