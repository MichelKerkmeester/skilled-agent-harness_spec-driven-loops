---
title: "Tasks: Touchpoint Research — CocoIndex / Rerank-Sidecar Deprecation Discovery"
description: "Task list for the 12-iteration deep-research loop and synthesis that produces the deprecation resource map and phase DAG."
trigger_phrases:
  - "touchpoint research tasks"
  - "deprecation research iterations"
  - "cocoindex research task list"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/002-deprecate-coco-index/001-touchpoint-research"
    last_updated_at: "2026-05-25T08:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Research iterations + synthesis complete"
    next_safe_action: "Plan/execute deprecation phases 002-008"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000014001"
      session_id: "014-001-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Touchpoint Research — CocoIndex / Rerank-Sidecar Deprecation Discovery

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold 014 phase parent + 001 subphase with description.json and graph-metadata.json
- [ ] T002 INIT deep-research loop (config, strategy charter, state log, registry)
- [ ] T003 Pre-flight cli-devin (auth status, sequential_thinking MCP, research-iter agent-config recipe)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Iteration 1 cli-devin swe-1.6 (RQ1 inventory seed, charter validation checkpoint)
- [ ] T005 Iterations 2-5 cli-devin swe-1.6 (RQ1-RQ3 deep dive)
- [ ] T006 Iterations 6-10 cli-devin swe-1.6 (RQ4-RQ7 plus dedup)
- [ ] T007 Swap executor config to cli-opencode deepseek-v4
- [ ] T008 Iterations 11-12 cli-opencode deepseek-v4 (adversarial cross-model gap-find)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Compile research/research.md from iteration findings
- [ ] T010 Emit research/resource-map.md (classified touchpoints plus phase DAG)
- [ ] T011 Promote resource-map.md to the 014 root
- [ ] T012 Scaffold deprecation phase children (002+) from the DAG
- [ ] T013 Save continuity plus strict-validate 014 and 001
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All 12 iterations dispatched (or genuine convergence reached) with valid state files.
- resource-map.md present at the 014 root classifying 100% of live touchpoints.
- Deprecation phase DAG scaffolded with dependency-correct ordering.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Parent: `../spec.md`
- Research output: `research/research.md`, `research/resource-map.md`
<!-- /ANCHOR:cross-refs -->
