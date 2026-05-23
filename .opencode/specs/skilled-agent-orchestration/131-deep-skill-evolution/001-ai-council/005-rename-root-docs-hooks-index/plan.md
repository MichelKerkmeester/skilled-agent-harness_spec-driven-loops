---
title: "Implementation Plan: 115/005 — root docs + hooks + skills index"
description: "Update 4 root-level surfaces post-rename"
trigger_phrases: ["115 005 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/005-rename-root-docs-hooks-index"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 005 plan.md"
    next_safe_action: "Author 005 tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115005"
      session_id: "115-005-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 115/005

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
| Aspect | Value |
|--------|-------|
| Language/Stack | shell (sed) + bash hook |
| Framework | spec-kit |
| Testing | rg + validate |

### Overview
Mechanical edit of 4 root-level surfaces. CLAUDE.md handled via AGENTS.md symlink (auto).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### DoR: 001+002+003 landed
### DoD: rg=0; validate exit 0; hook smoke-test
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Direct-edit pattern, 4 disjoint files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup — read pre-push-council.sh glob
### Phase 2: Implementation — sed 4 files
### Phase 3: Verification — rg + smoke-run hook + strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test | Tool |
|------|------|
| rg | `rg -c "sk-ai-council"` |
| Hook smoke | bash hook with test commit |
| Strict validate | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 001+002+003 landed
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
git reset --hard
<!-- /ANCHOR:rollback -->
