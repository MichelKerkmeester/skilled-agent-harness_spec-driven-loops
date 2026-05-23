---
title: "Tasks: 115/004 — cross-skill edges + TS"
description: "6-file mechanical task list"
trigger_phrases: ["115 004 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/004-rename-sibling-edges-typescript"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 004 tasks.md"
    next_safe_action: "Author 004 impl-summary"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115004"
      session_id: "115-004-tasks-init"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 115/004

---

<!-- ANCHOR:notation -->
## Task Notation
T### IDs; [P] parallel; [D:T###] depends on
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Read explicit.ts to verify regex shape before edit
- [ ] T002 Read parity vitest to understand assertion structure
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 [P] sed deep-research/graph-metadata.json
- [ ] T011 [P] sed deep-agent-improvement/graph-metadata.json
- [ ] T012 [P] sed system-spec-kit/graph-metadata.json
- [ ] T013 [P] sed system-skill-advisor/graph-metadata.json
- [ ] T014 Edit explicit.ts string constants
- [ ] T015 Edit parity vitest assertions
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 rg "deep-ai-council" on 6 files → 0
- [ ] T021 npx vitest run multi-ai-council-runtime-parity → pass
- [ ] T022 validate.sh --strict 004 → 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
All tasks [x]; vitest pass; strict validate PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Spec: spec.md | Plan: plan.md | Parent: ../spec.md
<!-- /ANCHOR:cross-refs -->
