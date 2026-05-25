---
title: "Tasks: full strict evergreen-citation sweep across the deep-* skills"
description: "Skill-by-skill task ledger for rewriting transient citations + per-skill and comprehensive verification."
trigger_phrases:
  - "full strict evergreen sweep tasks"
  - "010 evergreen sweep tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/002-evergreen-citation-sweep"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "tasks-authored"
    next_safe_action: "sweep-skill-by-skill-then-regrep"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010003"
      session_id: "131-000-010-evergreen-sweep"
      parent_session_id: "131-000-010-evergreen-sweep"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: full strict evergreen-citation sweep across the deep-* skills

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load `sk-doc` (markdown) + `sk-code` (`.cjs`/`.ts` comments)
- [ ] T002 Enumerate the full citation set (done: ~63 lines / ~27 files) and group by skill
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 deep-loop-runtime: rewrite README + SKILL ADR-provenance citations (keep "Runtime Boundary Decision (ADR-001)", drop packet prefix) + feature_catalog + lib/deep-loop/README + tests
- [ ] T004 deep-research: SKILL + reduce-state.cjs comments
- [ ] T005 deep-review: README + references (state_format, convergence) + reduce-state.cjs + playbook
- [ ] T006 deep-ai-council: references (folder_layout, convergence_signals, command_wiring) + playbook
- [ ] T007 deep-agent-improvement: mutation-coverage.cjs + reduce-state.cjs comments + playbook
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 `node --check` on every touched `.cjs`
- [ ] T009 vitest run per skill with a suite (deep-loop-runtime, deep-agent-improvement, deep-review)
- [ ] T010 `verify_alignment_drift.py --root <skill>` PASS per touched skill
- [ ] T011 Comprehensive closing re-grep across all 5 skills = 0 transient citations
- [ ] T012 Fill `implementation-summary.md`; strict validate (exit 0); scope-strict commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Re-grep 0 (REQ-001); ADR/REQ anchors preserved (REQ-002)
- [ ] node --check + vitest clean (REQ-003); alignment-drift PASS (REQ-004)
- [ ] Strict validate exit 0; `implementation-summary.md` filled
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Source**: `../009-resolve-005-deep-research-followon-findings/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
