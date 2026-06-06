---
title: "Implementation Plan: Phase 3 H-3 Async-IIFE + H-6 Lazy mkdir"
description: "Sequential plan for Replace sync writeFileSync/appendFileSync with fire-and-forget async-IIFE in 2 hook files; add lazy mkdir flag + env-var enable gate + safe stringify fallback."
trigger_phrases:
  - "108 phase h3-h6 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/108-auto-review-quick-wins-verdict-markers-logging/003-h3-async-iife-h6-lazy-mkdir"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_plan_authored"
    next_safe_action: "await_council"
    blockers:
      - "Awaiting council verdict"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-h3-h6-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 H-3 Async-IIFE + H-6 Lazy mkdir

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Mixed |
| **Framework** | OpenCode skill + plugin system |
| **Storage** | n/a |
| **Testing** | Smoke-test per file |
### Overview
Replace sync writeFileSync/appendFileSync with fire-and-forget async-IIFE in 2 hook files; add lazy mkdir flag + env-var enable gate + safe stringify fallback. Sequential file edits with smoke-tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [ ] Council verdict APPROVE on parent packet
- [ ] Target files verified present
### Definition of Done
- [ ] All edits applied; smoke tests pass; strict validate exit 0; commit + push
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Sequential file-edit pattern. Small edits (<30 LOC per file). See spec.md §3 for file list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
- Phase A: Read + verify target files
- Phase B: Apply edits
- Phase C: Smoke test
- Phase D: Strict validate + commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Smoke-test approach per spec.md §5 SUCCESS CRITERIA.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dep | Purpose |
|-----|---------|
| Target files exist | Cannot implement |
| Council APPROVAL | Implementation gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git revert <commit>` per phase. Independent commits enable clean revert.
<!-- /ANCHOR:rollback -->
