---
title: "Implementation Plan: Phase 2 H-2 Loop-prevention header markers"
description: "Sequential plan for Add CODE-REVIEW / DEEP-REVIEW / DEEP-RESEARCH header markers to review prompt templates and have dispatchers scan for them as the first line before dispatching iteration N+1."
trigger_phrases:
  - "108 phase h2-markers plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/108-auto-review-quick-wins-verdict-markers-logging/002-h2-loop-prevention-markers"
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
      session_id: "2026-05-16-108-h2-markers-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 H-2 Loop-prevention header markers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Mixed (Markdown + YAML + TypeScript) |
| **Framework** | OpenCode skill + plugin system |
| **Storage** | n/a (config + small code edits) |
| **Testing** | Smoke-test per file |

### Overview
Add CODE-REVIEW / DEEP-REVIEW / DEEP-RESEARCH header markers to review prompt templates and have dispatchers scan for them as the first line before dispatching iteration N+1. Sequential file edits with smoke-tests after each.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Council verdict APPROVE on parent packet
- [ ] Target file paths verified present
- [ ] Phase 1 complete (for ordering — though phases are mostly independent)

### Definition of Done
- [ ] All target files edited
- [ ] Smoke tests pass
- [ ] Strict validate exit 0 on this packet + phase parent
- [ ] Commit + push
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Sequential file-edit pattern. Each edit is small (<10 LOC). No new modules. See spec.md for the file list and change descriptions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Read + verify target files
### Phase B: Apply edits (one file at a time, commit per file optional)
### Phase C: Smoke test the changes
### Phase D: Strict validate + commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Smoke-test approach: render the new templates / run the new code paths against synthetic inputs, verify outputs match expected. See spec.md §5 SUCCESS CRITERIA for specific tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Purpose |
|-----|---------|
| Target files exist | Cannot implement without them |
| Council APPROVAL | Implementation gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert <commit>` per phase. Each phase commits independently for clean revert points.
<!-- /ANCHOR:rollback -->
