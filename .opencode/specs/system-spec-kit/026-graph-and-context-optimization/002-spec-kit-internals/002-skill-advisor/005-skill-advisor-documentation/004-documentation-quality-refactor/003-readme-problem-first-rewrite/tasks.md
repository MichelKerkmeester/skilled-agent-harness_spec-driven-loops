---
title: "Tasks: 003-readme-problem-first-rewrite (skeleton)"
description: "Task skeleton — fills post-001."
trigger_phrases:
  - "003 readme marketing tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/003-readme-problem-first-rewrite"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded tasks skeleton"
    next_safe_action: "Fill post-001"
    blockers: ["001 not shipped"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 003-readme-problem-first-rewrite

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read 001 iter 02 README gap findings
- [ ] T002 Re-read peer system-code-graph/README.md for voice ceiling
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [B] Author OVERVIEW + key stats + how-this-compares + features tables
- [ ] T004 [B] Author QUICK START with copyable commands
- [ ] T005 [B] Author FEATURES (3.1 highlights, 3.2 tool table, 3.3 scorer lanes, 3.4 freshness)
- [ ] T006 [B] Author STRUCTURE, CONFIGURATION, USAGE EXAMPLES
- [ ] T007 [B] Author TROUBLESHOOTING, FAQ, RELATED DOCUMENTS
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 HVR grep sweep (hard-blocker words + phrase blockers)
- [ ] T009 sk-doc strict validate on README
- [ ] T010 User read-through approval
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] T008-T010 green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Peer reference**: `.opencode/skills/system-code-graph/README.md`
- **HVR rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
<!-- /ANCHOR:cross-refs -->
