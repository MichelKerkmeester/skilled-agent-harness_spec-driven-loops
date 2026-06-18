---
title: "Tasks: Live-run and refine the design playbooks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "design playbook live run tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/010-design-playbook-live-run-and-refinement"
    last_updated_at: "2026-06-15T10:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Run + refinements complete; packet finalization pending"
    next_safe_action: "Validate, commit, then restructure under 145-mcp-open-design"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/145-mcp-open-design/010-design-playbook-live-run-and-refinement/scratch/results-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-design-playbook-live-run-and-refinement"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Live-run and refine the design playbooks

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

- [x] T001 Enumerate both playbooks (Explore) and classify the 13 scenarios
- [x] T002 Preflight: app/daemon, Kimi + DeepSeek slugs, `.utcp_config.json` backup
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run ID-007 (provenance) + ID-005/006 routing + ID-001/002/003 model-judgment via Kimi + DeepSeek
- [x] T004 WIRE-001: install open-design into `.utcp_config.json` (Code Mode)
- [x] T005 READ-001 + ID-004 + ID-008 via the bundled Open Design systems
- [x] T006 RUN-001 gated od generation (throwaway, model-pinned) + ID-009 fidelity + FAIL-001 simulated
- [x] T007 Capture the results matrix (12 PASS / 1 PARTIAL / 0 SKIP)
- [x] T008 Apply mcp-open-design refinements (preconditions, RUN-001, READ-001, mcp_wiring Code Mode)
- [x] T009 Apply sk-interface-design refinements (ID-003 fixture, ID-004/008 system source, ID-007 tokens, ID-009 runId)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `package_skill --check` both skills; self-check counts preserved; house-voice sweep
- [x] T011 Fix the 154 contrast cross-finding (committed under 154)
- [ ] T012 Author packet docs, `validate.sh --strict`, scoped commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All generated artifacts host-verified against real sources
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
