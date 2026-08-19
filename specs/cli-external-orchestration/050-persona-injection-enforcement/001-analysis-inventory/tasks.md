---
title: "Tasks: Persona-Injection Gap Analysis & Dispatch-Point Inventory"
description: "Task breakdown for the read-only cli-devin inventory sweep and orchestrator verification."
trigger_phrases:
  - "persona injection analysis tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/001-analysis-inventory"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Phase 001 tasks"
    next_safe_action: "Dispatch cli-devin to produce the inventory"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-001-analysis"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Persona-Injection Gap Analysis & Dispatch-Point Inventory

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify devin availability + auth (`command -v devin`, `devin auth status`)
- [ ] T002 Read cli-devin/SKILL.md (CLI dispatch preload rule)
- [ ] T003 Read cli-prompt-quality-card + cli-devin providers-and-models for model id + prompt-craft
- [ ] T004 Compose the persona-injected dispatch prompt (inline `context` persona + file list + output schema)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Dispatch cli-devin (`gemini-3-7-flash-high`, fallback `glm-5-2`) to read the 6 modes + hub + sk-prompt + agents roster and write the inventory to scratch/
- [ ] T006 Inventory: agent-persona roster + persona-to-intent mapping (REQ-001)
- [ ] T007 Inventory: every dispatch/prompt-composition point per mode + hub + sk-prompt with file:line (REQ-002)
- [ ] T008 Inventory: per-mode native-load-vs-inline classification with evidence (REQ-003)
- [ ] T009 Inventory: explicit gap statement — which paths attach NO persona today (REQ-004)
- [ ] T010 Inventory: catalogue existing precedents (cli-devin Rule 12/13/14, native --agent, auto-import, .toml TUI-only, opencode subagent) (REQ-005)
- [ ] T011 Inventory: identify sk-prompt doc(s) owning CLI prompt construction (REQ-006)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Orchestrator verifies a sample of cited file:line claims against source (no hallucination)
- [ ] T013 Confirm all 6 modes + hub + sk-prompt covered (cross-check mode-registry.json)
- [ ] T014 Record findings summary in implementation-summary.md
- [ ] T015 Run `validate.sh <phase-folder> --strict` (Errors:0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every native-vs-inline verdict cites file:line
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
