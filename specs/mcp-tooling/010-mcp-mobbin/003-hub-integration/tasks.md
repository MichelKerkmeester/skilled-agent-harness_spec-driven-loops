---
title: "Tasks: Phase 3: hub-integration"
description: "Task list for wiring mcp-mobbin into the mcp-tooling hub inside the serial 008→009→010 window: registry, router, hub docs/metadata, .utcp_config.json manual, advisor regeneration, consistency sweep."
trigger_phrases:
  - "mcp-mobbin integration tasks"
  - "mobbin registry tasks"
  - "mobbin manual utcp tasks"
  - "phase 003 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/003-hub-integration"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Registered mcp-mobbin across all hub surfaces"
    next_safe_action: "Run phase 004 and the program-wide final gates"
    blockers:
      - "Phase 002 packet must pass package_skill.py --check first"
      - "Serial ordering: sibling packets 008 and 009 must complete their hub edits before 010 touches shared hub files"
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: hub-integration

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

- [x] T001 Record phase 002 gate evidence (`package_skill.py --check` exit 0) and locate the UTCP `mobbin` snippet (`.opencode/skills/mcp-tooling/mcp-mobbin/assets/`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T002 Confirm sibling packets 008 and 009 landed their serial hub edits before any shared-file write; record evidence (spec.md REQ-001) [evidence: 008 + 009 phase-003 folders both `RESULT: PASSED` under `validate.sh --strict` before first 010 hub write]
- [x] T003 Read current mode-registry.json and hub-router.json; pin the mcp-figma transport precedent rows to mirror (`.opencode/skills/mcp-tooling/`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the mcp-mobbin mode entry, `extensions.transport-axis.transports[]` element, and `crossHubPairing: mcp-mobbin → sk-design`; parse-check (`.opencode/skills/mcp-tooling/mode-registry.json`)
- [x] T005 Add mcp-mobbin routerSignals, mobbin vocabulary classes, and extend tieBreak; parse-check (`.opencode/skills/mcp-tooling/hub-router.json`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T006 Add the mcp-mobbin mode row/section to the hub contract (`.opencode/skills/mcp-tooling/SKILL.md`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T007 [P] Refresh hub description.json and graph-metadata.json incl. the edge to sk-design; parse-check (`.opencode/skills/mcp-tooling/`)
- [x] T008 [P] Add the hub changelog entry and the hub_routing scenario for mobbin routing (`.opencode/skills/mcp-tooling/{changelog/,manual_testing_playbook/}`)
- [x] T009 Add the name-keyed `mobbin` manual from the phase 002 snippet; parse-check; existing manuals unchanged (`.utcp_config.json`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T010 Regenerate the advisor skill graph and confirm the four-mode hub identity is present (system-skill-advisor tooling) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the cross-file consistency sweep: mode name, packetKind, pairing, and vocabulary agree across every edited surface (spec.md REQ-005) [evidence: 6/6 workflowMode keys cross-agree registry vs router; `rg -n mcp-mobbin` hits 8/8 surfaces]
- [x] T012 Review `git diff` for additivity: existing mode entries, manuals, and edges unchanged; no writes outside scoped files + this phase folder [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T013 Complete checklist.md with evidence and run phase-folder validation before handoff to 004 [evidence: checklist 26/26 with shaped evidence; `validate.sh --strict` re-run at close-out]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Hub valid with registry/router aligned and the `mobbin` manual live — recorded as handoff evidence for phase 004
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
