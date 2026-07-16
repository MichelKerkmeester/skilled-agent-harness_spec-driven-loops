---
title: "Tasks: Phase 6: live-verification-capture (mcp-aside-devtools)"
description: "Task list for recording the 2026-07-16 aside discovery fixture and flipping the packet's discovery-pending claims to observed facts."
trigger_phrases:
  - "aside discovery tasks"
  - "aside fixture tasks"
  - "aside live verification tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "All tasks complete with evidence"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-aside"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: live-verification-capture

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

- [x] T001 Read the discovery fixture end to end and extract the observed facts (`references/discovery_fixture_2026-07-16.json`) [evidence: `discoveredCallableNames: ["aside.aside.repl"]`; `Access as: aside.aside_repl(args)` in `tool_info_first`; method "direct stdio MCP probe of CodeMode-MCP (initialize, tools/call)"]
- [x] T002 Read the Code Mode naming convention to present the TS surface precisely (`.opencode/skills/mcp-code-mode/references/naming_convention.md`) [evidence: `{manual_name}.{manual_name}_{tool_name}` core pattern, section 1]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flip SKILL.md: MCP approach paragraph, inventory re-confirmation, NEVER rule 2, version 1.1.1.0 (`mcp-aside-devtools/SKILL.md`) [evidence: 4 edits; frontmatter `version: 1.1.1.0`]
- [x] T004 [P] Flip README.md quick-start step 4 and the MCP FAQ (`mcp-aside-devtools/README.md`) [evidence: code block now shows both name forms with the fixture path]
- [x] T005 [P] Flip INSTALL_GUIDE.md validation step 3 (`mcp-aside-devtools/INSTALL_GUIDE.md`) [evidence: step 3 quotes registry + TS forms with fixture citation]
- [x] T006 [P] Flip references: mcp_wiring.md banner + naming bullet + fixture helper surface; aside_cli_reference.md helper paragraph + narrowed UNKNOWN (`references/mcp_wiring.md`, `references/aside_cli_reference.md`) [evidence: 5 edits across the two files; helper list matches the fixture's 21-entry surface]
- [x] T007 [P] Flip asset checklist and server README (`assets/utcp_aside_manual.md`, `mcp-servers/aside-mcp/README.md`) [evidence: 3 checklist items flipped to `[x]` with fixture evidence; step 4 records confirmed naming]
- [x] T008 [P] Flip catalog + playbook mirrors (`feature_catalog/feature_catalog.md`, `feature_catalog/mcp/mcp_transport_and_code_mode.md`, `manual_testing_playbook/manual_testing_playbook.md`, `manual_testing_playbook/mcp_transport/code_mode_discovery.md`) [evidence: 8 edits; ASD-011 records the satisfied 2026-07-16 run and the fixture drift protocol]
- [x] T009 Update doctor.sh discovery hint and add `changelog/v1.1.1.0.md` (`scripts/doctor.sh`, `changelog/v1.1.1.0.md`) [evidence: hint states both forms; changelog records need/change/why + 14 file rows]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the packet gate and residual sweeps (`package_skill.py`, `rg`) [evidence: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-aside-devtools --check --strict` printed "Result: PASS"; stale-claim grep returns 0 non-changelog hits]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T010 above, 10/10]
- [x] No `[B]` blocked tasks remaining [evidence: zero `[B]` rows in this file]
- [x] Manual verification passed [evidence: checklist.md 100% verified with per-item evidence]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
