---
title: "Implementation Plan: Phase 4 M-3 deep-agent-improvement mutation dedup"
description: "Add mutation-signature dedup to deep-agent-improvement mutation-coverage.cjs."
trigger_phrases:
  - "110 phase 004-dai plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/004-deep-agent-improvement-uplift"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "claude-opus-4-7-110-scaffold"
    recent_action: "phase_plan_authored"
    next_safe_action: "await_council"
    blockers:
      - "Awaiting council verdict"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-110-004-dai-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4 M-3 deep-agent-improvement mutation dedup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Mixed (JS + Markdown + YAML) |
| **Framework** | OpenCode skill + plugin system |
| **Storage** | n/a |
| **Testing** | Per-target smoke tests |
### Overview
Add mutation-signature dedup to deep-agent-improvement mutation-coverage.cjs. Sequential file edits with per-file smoke tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [ ] Council verdict APPROVE on parent packet
- [ ] Target files verified present
### Definition of Done
- [ ] Edits applied; smoke tests pass; strict validate exit 0; commit + push
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Sequential file-edit pattern. See spec.md §3 for file list and §4 for acceptance criteria.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
- Phase A: Read + verify target files
- Phase B: Apply edits one at a time
- Phase C: Smoke test
- Phase D: Strict validate + commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Smoke-test approach per spec.md §5 SUCCESS CRITERIA. Integration testing happens on the next real workflow run.
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
