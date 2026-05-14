---
title: "Tasks: Validate advisor extraction and remove deprecated bridge"
description: "Task ledger for the three-phase validation, cleanup, and final verification pass in 013/009/006."
trigger_phrases:
  - "013/009/006 tasks"
  - "advisor cleanup tasks"
  - "system_skill_advisor validation tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/006-validation-cleanup-and-deprecation-removal"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Docs authored"
    next_safe_action: "Execute Phase 1 inventory"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0130090060000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-006-validation-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Validate Advisor Extraction and Remove Deprecated Bridge

<!-- SPECKIT_LEVEL: 3 -->

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
## PHASE 1: SETUP

- [ ] T001 Read ADR-001 and confirm standalone MCP plus temporary bridge constraints (`001-design-and-decision-record/decision-record.md`).
- [ ] T002 [P] Inventory old `mcp_server/skill_advisor/` path references across live code, docs, install guides, and spec packets.
- [ ] T003 [P] Inventory invalid "DO NOT register a second MCP server" warnings and other final-topology contradictions.
- [ ] T004 [P] Inspect OpenCode, Codex, Claude, and Gemini MCP configs for both `spec_kit_memory` and `system_skill_advisor`.
- [ ] T005 Build package-local Vitest discovery from `.opencode/skills/system-skill-advisor/mcp_server/`.
- [ ] T006 Capture baseline evidence: Vitest pass count, Python parity status, hook smoke status, DB default path, and grep hit list.
- [ ] T007 Confirm zero live callers for `spec_kit_memory.advisor_*` or block bridge removal.
- [ ] T008 Obtain manual operator confirmation required by ADR-003 before removing the proxy.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T009 Remove `spec_kit_memory` advisor proxy registrations, imports, and dispatch paths.
- [ ] T010 Remove old `spec_kit_memory.advisor_*` schema/tool ids from memory MCP exposure.
- [ ] T011 Remove deprecation hints and fail-fast bridge messages that refer to the retired advisor surface.
- [ ] T012 Rewrite or delete stale live references to `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/`.
- [ ] T013 Annotate legitimate ADR/historical spec references instead of deleting migration evidence.
- [ ] T014 Remove invalid second-server warnings from skill docs and install guides.
- [ ] T015 Rerun focused validation after each cleanup cluster and stop on the first regression.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T016 Run package-local Vitest from `.opencode/skills/system-skill-advisor/mcp_server/`.
- [ ] T017 Run Python parity tests against the moved shim.
- [ ] T018 Run hook smoke tests for post-cutover wrappers.
- [ ] T019 Validate all four runtime configs list `spec_kit_memory` and `system_skill_advisor`.
- [ ] T020 Probe `advisor_recommend` from OpenCode, Codex, Claude, and Gemini.
- [ ] T021 Verify default DB path resolves to `system-skill-advisor/mcp_server/database/` across cold starts.
- [ ] T022 Review install guides in both skill folders for final topology accuracy.
- [ ] T023 Confirm final grep has no live old-path hits outside historical sections.
- [ ] T024 Confirm old `spec_kit_memory.advisor_*` registrations are absent.
- [ ] T025 Run strict spec validation for this packet and update checklist evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` pass.
- [ ] P1 requirements pass or have explicit user-approved deferral.
- [ ] `implementation-summary.md` records commands, results, grep counts, and any caveats.
- [ ] `checklist.md` is updated with evidence for completed rows.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <006-folder> --strict` exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
