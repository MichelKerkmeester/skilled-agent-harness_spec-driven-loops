---
title: "Tasks: Phase 3: registry-graph-and-skill-advisor-removal"
description: "Task list for cli-devin deprecation phase 3"
trigger_phrases:
  - "phase 3 tasks"
  - "registry-graph-and-skill-advisor-removal tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-cli-devin-deprecation/003-registry-graph-and-skill-advisor-removal"
    last_updated_at: "2026-06-08T17:38:17.105Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 3 tasks completed"
    next_safe_action: "Proceed to phase 4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: registry-graph-and-skill-advisor-removal

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read the Context Report §2 cluster + the target files before editing (READ-first, scope-locked)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 swe-1.6 model deleted; cli-devin executor rows dropped from deepseek/kimi/glm (cli-opencode retained)
- [x] T003 cli-devin edges removed from 6 graph-metadata.json + 2 skill-graph.json; stale swe-1.6 signal scrubbed
- [x] T004 Devin hooks deleted (.devin/hooks.v1.json, hooks/devin/ + dist); 'devin' runtime enum removed
- [x] T005 advisor playbook scenario count decremented 45->44 + vitest updated
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Verify: advisor runtime-parity + manual-testing-playbook vitest 5 passed (count 44); jq valid on 8 graph JSON; grep 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Verification passed (see implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation**: See `implementation-summary.md`
- **Authoritative edit list**: `../context/context-report.md` §2
<!-- /ANCHOR:cross-refs -->
