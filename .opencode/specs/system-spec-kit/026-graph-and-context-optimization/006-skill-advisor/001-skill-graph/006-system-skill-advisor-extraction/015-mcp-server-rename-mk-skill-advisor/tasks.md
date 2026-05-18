---
title: "Tasks: Rename system_skill_advisor MCP server to mk_skill_advisor"
description: "Task breakdown for packet 015 runtime identity rename."
trigger_phrases:
  - "013/009/015 tasks"
  - "mk_skill_advisor tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/015-mcp-server-rename-mk-skill-advisor"
    last_updated_at: "2026-05-14T20:45:00Z"
    last_updated_by: "codex"
    recent_action: "Rename tasks completed"
    next_safe_action: "Commit scoped rename"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rename system_skill_advisor MCP server to mk_skill_advisor

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
## Phase 1: Setup

- [x] T001 Confirm branch is `main`.
- [x] T002 Review recent git log.
- [x] T003 [P] Read `mk_code_index` rename precedent.
- [x] T004 [P] Read sibling packet 010 shape and packet 014 metadata.
- [x] T005 Scaffold Level 3 packet 015.
- [x] T006 Capture baseline old-identity grep inventory.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Rename `.opencode/bin/skill-advisor-launcher.cjs` to `.opencode/bin/mk-skill-advisor-launcher.cjs`.
- [x] T008 Update launcher log prefix, lockdir, state file, and command payload.
- [x] T009 Rename launcher state JSON to `.mk-skill-advisor-launcher.json`.
- [x] T010 Update `advisor-server.ts` server name to `mk_skill_advisor`.
- [x] T011 Update `opencode.json`.
- [x] T012 Update `.claude/mcp.json`.
- [x] T013 Update `.codex/config.toml`.
- [x] T014 Update `.gemini/settings.json`.
- [x] T015 Sweep live old namespace references to `mcp__mk_skill_advisor__*`.
- [x] T016 Update live server-id docs and bridge strings to `mk_skill_advisor`.
- [x] T017 Update parent `handover.md` section 9/10 continuity note.
- [x] T018 Update parent `graph-metadata.json` children and active-child pointer.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run advisor package `npm run typecheck`.
- [x] T020 Run spec-kit MCP `npx tsc --noEmit`.
- [x] T021 Run mk launcher smoke.
- [x] T022 Run `opencode mcp list`.
- [x] T023 Run final old namespace grep.
- [x] T024 Run packet 015 strict validation.
- [x] T025 Stage scoped files and create authorized commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Required verification passed or failures are explicitly reported.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
