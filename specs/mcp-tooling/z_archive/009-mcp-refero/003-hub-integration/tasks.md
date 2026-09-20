---
title: "Tasks: Phase 3: hub-integration"
description: "Task list for registering mcp-refero as the fourth mcp-tooling mode: serialize after sibling 008, extend registry/router on the transport axis, refresh hub identity, verify the refero UTCP manual, regenerate the advisor skill graph."
trigger_phrases:
  - "mcp-refero integration tasks"
  - "refero registry tasks"
  - "refero router tasks"
  - "phase 003 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/003-hub-integration"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Registered mcp-refero across all hub surfaces"
    next_safe_action: "Open the 010 hub window after its packet passes the gate"
    blockers:
      - "Phase 002 packet must pass package_skill.py --check first"
      - "SERIAL ordering across sibling packets: 008 before 009"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/tasks.md"
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

- [x] T001 Confirm phase 002 handoff evidence (structural gate exit 0) and that sibling packet 008's hub-file slot is complete before any hub write (`spec.md` §4 REQ-003)
- [x] T002 Snapshot the pre-change hub baseline: registry, router, SKILL.md, description/graph metadata (`.opencode/skills/mcp-tooling/`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T003 Derive the fourth mode entry shape from the existing mcp-figma transport entry (`.opencode/skills/mcp-tooling/mode-registry.json`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Extend mode-registry.json: mcp-refero mode entry, `extensions.transport-axis.transports [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean][]` += mcp-refero, crossHubPairing mcp-refero → sk-design (`.opencode/skills/mcp-tooling/mode-registry.json`)
- [x] T005 Extend hub-router.json: mcp-refero routerSignals, refero vocabulary classes, tieBreak for four modes (`.opencode/skills/mcp-tooling/hub-router.json`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T006 [P] Refresh parent SKILL.md to list mcp-refero as a routed transport mode (`.opencode/skills/mcp-tooling/SKILL.md`)
- [x] T007 [P] Refresh hub description.json and graph-metadata.json incl. the sk-design pairing edge (`.opencode/skills/mcp-tooling/`)
- [x] T008 [P] Author the hub changelog entry and the hub_routing refero routing scenario (`.opencode/skills/mcp-tooling/changelog/`, hub_routing playbook)
- [x] T009 Verify the existing `refero` UTCP manual read-only — name key, stdio transport, `npx -y mcp-remote https://api.refero.design/mcp` — and record the evidence; escalate any mismatch (`.utcp_config.json`) [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run parse + cross-agreement checks (registry vs router workflowMode key sets) and the `rg -n 'mcp-refero'` sweep across all hub surfaces [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T011 Dry-read routing: refero holdout prompts resolve to mcp-refero; existing-mode scenarios unchanged against the baseline snapshot [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
- [x] T012 Run advisor skill-graph regeneration, record output, mark checklist evidence, notify the 010 sibling that the serial slot is free, and run phase-folder validation [evidence: shipped per `checklist.md` surface matrix; `jq empty` + structured diff clean]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Hub valid on four modes with recorded evidence; serial handoff to sibling 010 done
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
