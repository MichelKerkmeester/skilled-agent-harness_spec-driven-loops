---
title: "Tasks: Update mcp-open-design od CLI verb surface table with missing commands"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "od verb surface tasks"
  - "mcp-open-design doc update"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/013-update-mcp-open-design-skill-verb-surface-table-with-missing-od-cli-commands"
    last_updated_at: "2026-06-21T13:29:38Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Populated spec.md and plan.md"
    next_safe_action: "Implement verb table additions"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/od_cli_reference.md"
      - ".opencode/skills/mcp-open-design/references/tool_surface.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-od-verb-surface-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Update mcp-open-design od CLI verb surface table with missing commands

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

- [x] T001 [P] Add `od project create` row to od_cli_reference.md Section 4 (mutating, flags: `--name`, `--skill`, `--design-system`, `--json`) — `references/od_cli_reference.md`
- [x] T002 [P] Add `od files list`, `od files read`, and `od files write` rows to od_cli_reference.md Section 4 (read-only for list/read, mutating for write) — `references/od_cli_reference.md`
- [x] T003 [P] Add `od skills list` and `od design-systems list` rows to od_cli_reference.md Section 4 (read-only) — `references/od_cli_reference.md`
- [x] T004 [P] Add `od daemon start` row to od_cli_reference.md Section 4 (mutating, flags: `--headless`, `--serve-web`, `--port`) — `references/od_cli_reference.md`
- [x] T005 [P] Promote `od doctor` from `[UNVERIFIED]` to confirmed read-only; add `od daemon status` as new read-only row — `references/od_cli_reference.md`
- [x] T006 Add inline form-answer pattern documentation to od_cli_reference.md Section 5 (follow-up `--message` on same `--conversation` in `od run start`) — `references/od_cli_reference.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 [P] Add `od daemon start` and `od project create` to "Surface but GATE" list in tool_surface.md Section 3 — `references/tool_surface.md`
- [x] T008 [P] Add `od skills list`, `od design-systems list`, `od files list`, `od files read`, `od doctor`, and `od daemon status` to "Surface freely" read-only list; add `od files write` to "Surface but GATE" list in tool_surface.md Section 3 — `references/tool_surface.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify each new entry by running `node "$OD_BIN" <verb> --help` and confirming flags match documentation
- [x] T010 Grep od_cli_reference.md and tool_surface.md for any remaining `[UNVERIFIED]` tags on confirmed commands (only `daemon stop` and `db vacuum` remain deliberately uncertain)
- [x] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (PASSED: 0 errors, 0 warnings)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 11 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 7 new verb table entries confirmed correct
- [ ] 0 `[UNVERIFIED]` tags on confirmed commands
- [ ] validate.sh --strict exits 0
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
- 4 phases: Verb Table, Form Pattern, Gating Policy, Verification
- Add L2/L3 addendums for complexity
-->
