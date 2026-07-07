---
title: "Tasks: 115/006"
description: "Final reindex + validate + reconcile task list"
trigger_phrases: ["115 006 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/001-deep-ai-council/006-rename-reindex-validate"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 006 tasks.md"
    next_safe_action: "Author 006 impl-summary"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115006"
      session_id: "115-006-tasks-init"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 115/006

---

<!-- ANCHOR:notation -->
## Task Notation
T### IDs; sequential
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Verify 002+003+004+005 strict validate all PASS
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 python3 skill_graph_compiler.py --export-json --pretty (with incidental-fix protocol)
- [ ] T011 advisor_rebuild MCP call
- [ ] T012 advisor_recommend smoke: "multi-seat AI Council deliberation" → expect sk-ai-council ≥ 0.7
- [ ] T013 npx vitest run multi-ai-council-runtime-parity → pass
- [ ] T014 validate.sh --strict on parent + 6 children (×7) → all 0
- [ ] T015 generate-context.js canonical save (parent reconcile)
- [ ] T016 nested-changelog.js per-phase
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Final repo-wide rg "deep-ai-council" live-surface allow-list = 0
- [ ] T021 Historical-surface rg unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
All tasks [x]; aggregate strict validate PASS; advisor smoke ≥ 0.7
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
Spec/Plan/Parent linked
<!-- /ANCHOR:cross-refs -->
