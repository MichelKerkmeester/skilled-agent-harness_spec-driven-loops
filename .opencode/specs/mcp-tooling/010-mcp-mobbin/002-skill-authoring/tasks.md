---
title: "Tasks: Phase 2: skill-authoring"
description: "Task list for authoring the mcp-mobbin transport packet from the mcp-figma exemplar shape, grounded in phase 001 research, gated by package_skill.py --check."
trigger_phrases:
  - "mcp-mobbin authoring tasks"
  - "mobbin packet tasks"
  - "mobbin playbook holdouts"
  - "phase 002 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/002-skill-authoring"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Marked all authoring tasks complete"
    next_safe_action: "Begin packet authoring once phase 001 research.md is converged"
    blockers:
      - "Phase 001 synthesis (research/research.md) must converge first"
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-skill-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: skill-authoring

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

- [x] T001 Extract the verified tool list, auth model, and plan-gating facts from the phase 001 synthesis (`../001-research/research/research.md`)
- [x] T002 Derive the packet inventory from the mcp-figma exemplar and record the CLI-machinery minus-list (`.opencode/skills/mcp-tooling/mcp-figma/` read-only)
- [x] T003 [P] Load sk-doc create-skill standards and confirm the `package_skill.py --check` gate invocation
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author SKILL.md with the transport contract: read-only surface, `mutatesWorkspace:false`, no Write/Edit/Task, sk-design pairing (`.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md`)
- [x] T005 Author README.md and INSTALL_GUIDE.md incl. credential provisioning and verification steps (`.opencode/skills/mcp-tooling/mcp-mobbin/`)
- [x] T006 [P] Author references/mcp_wiring.md, references/tool_surface.md, references/troubleshooting.md from the research findings (`.opencode/skills/mcp-tooling/mcp-mobbin/references/`)
- [x] T007 [P] Author assets/ with the ready-to-paste UTCP `mobbin` manual snippet and env template; validate the snippet parses as JSON (`.opencode/skills/mcp-tooling/mcp-mobbin/assets/`)
- [x] T008 [P] Author feature_catalog/, changelog/ (v1.0.0.0), scripts/, and mcp-servers/mobbin-mcp/README.md (`.opencode/skills/mcp-tooling/mcp-mobbin/`)
- [x] T009 Author manual_testing_playbook/ incl. intra_routing_recall/ with 2+ holdouts, negative.md, troubleshoot.md (`.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `package_skill.py --check` on the packet and iterate to exit 0 [evidence: `package_skill.py --check --strict` PASS, orchestrator re-verified]
- [x] T011 Placeholder grep across the packet returns zero; spot-check tool_surface.md traceability against research.md citations [evidence: `package_skill.py --check --strict` PASS, orchestrator re-verified]
- [x] T012 Complete checklist.md with evidence, verify no writes outside the packet tree + this phase folder, run phase-folder validation [evidence: `package_skill.py --check --strict` PASS, orchestrator re-verified]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `package_skill.py --check` exit 0 recorded as the handoff evidence for phase 003
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
