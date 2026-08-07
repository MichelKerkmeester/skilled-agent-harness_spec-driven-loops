---
title: "Tasks: deep-context workflow adoption (root-cause fix)"
description: "Task list for the council-advised root-cause fix and the constitutional memory."
trigger_phrases:
  - "deep-context workflow adoption tasks"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/011-deep-context-workflow-adoption"
    last_updated_at: "2026-06-07T20:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented fixes; constitutional rule written, live index pending MCP reconnect"
    next_safe_action: "Validate and commit; re-index the constitutional rule when MCP reconnects"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-context-adoption-137"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deep-context workflow adoption (root-cause fix)

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

- [x] T001 Read the deep-context command contract; confirm the assumed Gate-3 friction was false
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Dispatch @ai-council (Depth 1) for the root-cause verdict and recommended fix
- [x] T003 PRIMARY: add PLAN-WORKFLOW LOCK to AGENTS.md (CLAUDE.md symlink binds all runtimes)
- [x] T004 SECONDARY-A: save the cross-runtime feedback memory into this packet
- [x] T005 SECONDARY-B: add the anti-pattern NEVER item to deep-context SKILL.md
- [x] T006 Write the constitutional rule `deep-skill-workflow-required.md` and update the constitutional README (13 files)
- [B] T007 Index the constitutional rule as a const memory (BLOCKED: mk-spec-memory MCP disconnected mid-scan; auto-loads at next daemon priming or retry on /mcp reconnect)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 grep confirms PLAN-WORKFLOW LOCK in AGENTS.md and via the CLAUDE.md symlink, and the deep-context NEVER item
- [x] T009 validate.sh --strict on the packet; constitutional README validates
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All fix artifacts written and grep-verified
- [ ] Constitutional rule live-indexed (pending MCP reconnect; file is constitutional by placement and auto-loads at priming)
- [x] Packet validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Council**: See `ai-council/council-report.md`
<!-- /ANCHOR:cross-refs -->
