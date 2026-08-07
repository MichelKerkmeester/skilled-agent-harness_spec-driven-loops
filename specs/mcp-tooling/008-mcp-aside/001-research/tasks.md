---
title: "Tasks: Phase 1: research"
description: "Task list for the phase 001 /deep:research fan-out over the Aside browser's CLI and MCP surface: init run, monitor lineages, verify synthesis and findings registry, close out."
trigger_phrases:
  - "mcp-aside research tasks"
  - "aside deep research tasks"
  - "aside fan-out tasks"
  - "phase 001 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/001-research"
    last_updated_at: "2026-07-16T12:45:00Z"
    last_updated_by: "claude"
    recent_action: "All 10 research tasks completed; synthesis verified"
    next_safe_action: "Proceed to phase 002 skill authoring (auto-continue pre-approved)"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: research

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm the scope boundary (writes only inside `001-research/`) and read the source seed (`context/website-link.md`)
- [x] T002 Confirm the three scheduled executors resolve: cli-codex gpt-5.6-sol, cli-opencode zai-coding-plan/glm-5.2, cli-codex gpt-5.6-luna [evidence: `codex login status` OK, GLM smoke reply PONG, all three lineages fulfilled in `research/orchestration-status.log`]
- [x] T003 Init the /deep:research run: 10 iterations, `--stop-policy=max-iterations`, state packet rooted at `research/` (5× sol xhigh fast, 2× glm-5.2 max, 3× luna max fast)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Monitor the 5× cli-codex gpt-5.6-sol xhigh fast lineage; retry failed iterations through the workflow's resume mechanics (`research/` state packet)
- [x] T005 [P] Monitor the 2× cli-opencode zai-coding-plan/glm-5.2 max lineage (`research/` state packet)
- [x] T006 [P] Monitor the 3× cli-codex gpt-5.6-luna max fast lineage (`research/` state packet)
- [x] T007 Confirm the workflow-owned state packet accumulates in `research/` (state JSONL, deltas, logs, findings registry) with all 10 iterations attributed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify the `research/research.md` synthesis answers the surface questions with citations: standalone CLI existence and command surface, MCP tool list and transport, auth model, install/launch (`spec.md` REQ-002)
- [x] T009 Verify the findings registry backs every load-bearing synthesis claim; mark contradicted or unverifiable claims explicitly (`spec.md` REQ-003)
- [x] T010 Confirm zero writes outside this phase folder, run phase-folder validation, and stop for human review before phase 002 [evidence: `git status` clean outside packet; `validate.sh --strict` re-run post-close-out; human-review stop pre-waived by operator auto-continue decision at plan approval]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Synthesis reviewed; the CLI-vs-MCP answer is decisive enough for phase 002 (or an amendment on `backendKind` is escalated)
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
