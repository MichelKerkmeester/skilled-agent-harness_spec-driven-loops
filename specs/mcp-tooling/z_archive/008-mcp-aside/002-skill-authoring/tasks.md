---
title: "Tasks: Phase 2: skill-authoring"
description: "Task list for authoring the mcp-aside-devtools nested mode packet from the phase 001 research findings, mirroring the mcp-chrome-devtools exemplar inventory, gated by package_skill.py --check."
trigger_phrases:
  - "mcp-aside authoring tasks"
  - "aside devtools packet tasks"
  - "aside skill authoring tasks"
  - "phase 002 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/002-skill-authoring"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Marked all authoring tasks complete with evidence"
    next_safe_action: "Begin authoring after the phase 001 research gate is reviewed"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/tasks.md"
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

- [x] T001 Extract the verified CLI command surface, MCP tool list, auth model, and install/launch steps from the converged synthesis (`../001-research/research/research.md`)
- [x] T002 Snapshot the exemplar inventory and playbook shape (`.opencode/skills/mcp-tooling/mcp-chrome-devtools/`)
- [x] T003 Confirm the `backendKind: cli-plus-mcp` posture holds against the research findings; halt for amendment if no standalone CLI exists
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the mode doctrine: CLI-primary dispatch, Aside MCP via Code Mode fallback, gating rules (`.opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`)
- [x] T005 [P] Author the user surface (`.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md`, `install-guide.md`)
- [x] T006 [P] Author both backend docs (`.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/aside-cli/`, `mcp-servers/aside-mcp/`)
- [x] T007 Author the playbook incl. `intra-routing-recall/` with ≥2 holdouts, `negative.md`, `troubleshoot.md` (`.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/`)
- [x] T008 [P] Author the support dirs: seed changelog entry, worked examples, references, helper scripts (`.opencode/skills/mcp-tooling/mcp-aside-devtools/{changelog,examples,references,scripts}/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Inventory diff against the exemplar — no missing top-level components (`spec.md` REQ-001)
- [x] T010 Citation audit — every command/tool/auth claim traces to a `research.md` finding; zero invented surface (`spec.md` REQ-002)
- [x] T011 Run `package_skill.py --check` on the packet and iterate to exit 0 [evidence: `Result: PASS`, 0 errors 0 warnings, re-verified by orchestrator]
- [x] T012 Complete `checklist.md` with evidence and confirm no writes outside the new packet tree and this phase folder [evidence: `git status` sample — only packet tree + pre-existing dirt; checklist marked]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `package_skill.py --check` exit 0 recorded; packet ready for phase 003 hub registration
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
