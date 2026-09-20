---
title: "Tasks: Phase 1: research"
description: "Task list for the phase 001 /deep:research fan-out over the Refero MCP surface: init run, monitor lineages, verify synthesis and findings registry, close out."
trigger_phrases:
  - "mcp-refero research tasks"
  - "refero fan-out tasks"
  - "refero deep research tasks"
  - "phase 001 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/001-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Marked all 10 research tasks complete with evidence"
    next_safe_action: "Initialize the /deep:research run when the packet is approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/tasks.md"
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

- [x] T001 Confirm the pinned source links resolve and capture any redirects (`context/website-link.md`)
- [x] T002 Compose the research question covering tool inventory, auth, rate limits, free-vs-paid gating, and skill-repo conventions (`spec.md` §3 SCOPE)
- [x] T003 Initialize the /deep:research run: state packet at `001-research/research/`, 10 iterations (5× cli-codex gpt-5.6-sol xhigh fast, 2× cli-opencode zai-coding-plan/glm-5.2 max, 3× cli-codex gpt-5.6-luna max fast), `--stop-policy=max-iterations`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Monitor the 5× gpt-5.6-sol xhigh fast lineage batch to completion (`research/` run log)
- [x] T005 [P] Monitor the 2× glm-5.2 max lineages to completion (`research/` run log)
- [x] T006 [P] Monitor the 3× gpt-5.6-luna max fast lineages to completion (`research/` run log)
- [x] T007 Resume any externally killed lineage from workflow state instead of restarting the run [evidence: not needed — all three lineages fulfilled first-attempt per `research/orchestration-status.log`, zero failed attempts]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify the synthesis is converged and cited: tool surface, auth, rate limits, and free-vs-paid gating each covered with per-finding citations including both pinned sources (`research/research.md`)
- [x] T009 Verify the findings registry backs every load-bearing synthesis claim and flags unprobed paid-only capabilities as inferred (`research/`)
- [x] T010 Confirm zero writes outside `001-research/`, run phase-folder validation, and close out for the phase 002 handoff [evidence: `git status` shows packet-only writes; `validate.sh --strict` re-run at close-out]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Synthesis reviewed and accepted as sufficient grounding for phase 002 packet authoring
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
