---
title: "Tasks: Phase 2: skill-authoring"
description: "Task list for authoring the mcp-refero transport packet: derive the minus-CLI inventory from the mcp-figma exemplar, author all packet surfaces from the research synthesis, and gate with package_skill.py --check."
trigger_phrases:
  - "mcp-refero authoring tasks"
  - "refero packet tasks"
  - "refero skill tasks"
  - "phase 002 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/002-skill-authoring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Marked all authoring tasks complete"
    next_safe_action: "Begin packet authoring once the phase 001 synthesis is accepted"
    blockers:
      - "Phase 001 research synthesis must converge first"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/tasks.md"
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

- [x] T001 Derive the target inventory: list the mcp-figma exemplar tree, subtract CLI machinery, map to spec.md deliverables (`.opencode/skills/mcp-tooling/mcp-figma/`)
- [x] T002 Extract the authoring fact base — tool inventory, parameters, auth, rate limits, tier gating — from the accepted synthesis (`../001-research/research/research.md`)
- [x] T003 [P] Confirm sk-doc create-skill-parent standards and nested-mode frontmatter requirements for hub packets (`.opencode/skills/sk-doc/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the transport contract and surface summary in SKILL.md — `mutatesWorkspace:false`, no Write/Edit/Task, sk-design pairing, Code Mode dispatch (`.opencode/skills/mcp-tooling/mcp-refero/SKILL.md`)
- [x] T005 [P] Author README.md and INSTALL_GUIDE.md (`.opencode/skills/mcp-tooling/mcp-refero/`)
- [x] T006 [P] Author references/mcp_wiring, references/tool_surface, references/troubleshooting (`.opencode/skills/mcp-tooling/mcp-refero/references/`)
- [x] T007 [P] Author mcp-servers/refero-mcp/README.md endpoint notes (`.opencode/skills/mcp-tooling/mcp-refero/mcp-servers/refero-mcp/README.md`)
- [x] T008 Author manual_testing_playbook/ incl. intra-routing-recall/ with ≥2 holdouts, negative.md, troubleshoot.md (`.opencode/skills/mcp-tooling/mcp-refero/manual_testing_playbook/`)
- [x] T009 [P] Seed changelog/, feature_catalog/, scripts/, and assets/ with the ready-to-paste UTCP manual snippet (`.opencode/skills/mcp-tooling/mcp-refero/assets/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the structural gate and fix findings to exit 0 (`package_skill.py --check` on `.opencode/skills/mcp-tooling/mcp-refero/`) [evidence: `package_skill.py --check --strict` PASS exit 0]
- [x] T011 Sweep internal links/paths for resolution; diff the assets UTCP snippet against the live `refero` manual in `.utcp_config.json`
- [x] T012 Trace every capability claim to a research finding, mark checklist items with evidence, and run phase-folder validation (`checklist.md`) [evidence: `package_skill.py --check --strict` PASS exit 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `package_skill.py --check` exit 0 recorded as the phase handoff evidence
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
