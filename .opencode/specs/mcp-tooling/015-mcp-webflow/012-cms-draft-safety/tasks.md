---
title: "Tasks: Phase 012: CMS Draft Safety"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "webflow cms draft"
  - "isDraft explicit"
  - "item publish gate"
  - "SAFE-006"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/012-cms-draft-safety"
    last_updated_at: "2026-08-03T13:58:52Z"
    last_updated_by: "pi"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-mcp-webflow-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: placeholder

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] [P0] T001 Fix payload-examples.md CMS draft payload with explicit `_draft: true` + read-back note. [evidence: `assets/payload-examples.md` §3]
- [x] [P0] T002 Fix cms card staging example + publish-deploy card item-publish semantics. [evidence: `feature-catalog/content/cms.md`, `content/publish-deploy.md`]
- [x] [P1] T003 Strengthen READ-001 with draft-state read-back evidence. [evidence: `manual-testing-playbook/read-only/readcms.md`]
- [x] [P1] T004 Add SAFE-006 scenario (item publish PB, no staging target) + root index. [evidence: `safety-gate/itempubgate.md`, root 18 scenarios]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [Implement core feature 1]
- [ ] T005 [Implement core feature 2]
- [ ] T006 [Implement core feature 3]
- [ ] T007 [Add error handling]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test happy path manually
- [ ] T009 Test edge cases
- [ ] T010 Update documentation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks completed with evidence markers.
- Packet validators green; recursive strict validation 0 errors.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

