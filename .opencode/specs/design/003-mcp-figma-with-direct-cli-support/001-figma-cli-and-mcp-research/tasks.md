---
title: "Tasks: figma-cli-and-mcp-research"
description: "Task breakdown for the five-iteration gpt-5.5-fast deep research into the silships figma-cli and the Figma MCP landscape. All tasks complete; deliverable is research/research.md."
trigger_phrases:
  - "figma-cli research tasks"
  - "figma mcp research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/003-mcp-figma-with-direct-cli-support/001-figma-cli-and-mcp-research"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "All research tasks complete"
    next_safe_action: "Operator reviews the recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-001-figma-cli-and-mcp-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: figma-cli-and-mcp-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- `[P]` parallelizable
- Evidence in parentheses where applicable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Create the `001-figma-cli-and-mcp-research` child + `research/` dir
- [x] Frame the four research questions (capabilities, MCP landscape, skill design, install/safety)
- [x] Confirm the canonical binary name (`figma-ds-cli`) and the npm traps to test
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Run iteration 001: the silships figma-cli capability surface and the daemon model
- [x] Run iteration 002: the Figma MCP landscape and the Code Mode `figma` manual fit
- [x] Run iteration 003: the `mcp-figma` skill architecture and the gating policy
- [x] Run iteration 004: the install and safety path (repo build, safe versus yolo)
- [x] Run iteration 005: the convergence and the final recommendation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Ground-truth the live-observed capability and transport facts (orchestrator-verifications.md)
- [x] Write canonical `research/research.md` with the prioritized recommendation
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Five iterations executed read-only over the tool and the MCP landscape
- [x] Recommendation converges across iterations and records the npm traps
- [x] The skill architecture, gating policy, and install/safety path documented
- [x] No skill or app change made (research-only scope honored)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable: `research/research.md`
- Iterations: `research/iterations/iteration-00{1..5}.md`
- Orchestrator ground-truth: `research/iterations/orchestrator-verifications.md`
- Parent: `../spec.md` (phase map)
<!-- /ANCHOR:cross-refs -->
