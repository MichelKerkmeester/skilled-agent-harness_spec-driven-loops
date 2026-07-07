---
title: "Implementation Plan: 115/003 — agent runtime rename"
description: "git mv 4 agent files + 4 README.txt updates per [[feedback_new_agent_mirror_all_runtimes]]."
trigger_phrases: ["115 003 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/001-deep-ai-council/003-rename-agent-4-runtime"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/003 plan.md"
    next_safe_action: "Author 115/003 tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115003"
      session_id: "115-003-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 115/003 — agent runtime rename

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| Language/Stack | shell (git mv + sed) + .toml frontmatter |
| Framework | spec-kit |
| Storage | filesystem |
| Testing | rg + validate.sh --strict |

### Overview
4 runtime mirror rename — same pattern as 007 but applied to agent slug instead of skill name. New agent slug = `ai-council` (NOT `sk-ai-council`; agents don't use sk- prefix). Each agent body's skill-path reference updated to renamed skill `sk-ai-council`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### DoR: 001 rename-plan.json emitted
### DoD: 4 agent files renamed; rg "deep-ai-council" in 4 dirs = 0; validate exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
4-runtime mirror pattern (per [[feedback_new_agent_mirror_all_runtimes]]).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup — verify 001 contract + git status clean
### Phase 2: Implementation — 4 git mv + sed pass + 4 README updates
### Phase 3: Verification — rg + strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test | Tool |
|------|------|
| rg post-rename per runtime | `rg -c "deep-ai-council"` |
| strict validate | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 001 rename-plan.json (gating)
- git mv (Green)
- sed (Green)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: validate.sh fails OR rg shows missed hits
- **Procedure**: git reset --hard HEAD
<!-- /ANCHOR:rollback -->
