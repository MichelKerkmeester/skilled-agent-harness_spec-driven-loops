---
title: "Tasks: Phase 003 OpenCode Internal References"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "070 phase 003 tasks"
  - "opencode internal reference tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "completed"
    next_safe_action: "Start Phase 004 handoff"
    blockers: []
    key_files:
      - "tasks.md"
      - ".opencode/skills/sk-code-review/graph-metadata.json"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 003 OpenCode Internal References

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read parent spec (`../spec.md`)
- [x] T002 Read parent resource map (`../resource-map.md`)
- [x] T003 Read Phase 001 inventory and edge cases (`../001-discovery-impact-map/inventory.md`, `inventory.tsv`, `edge-cases.md`)
- [x] T004 Render Level 2 templates for Phase 003 artifacts (`/tmp/phase003-render`)
- [x] T005 Author Phase 003 Level 2 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Fix critical edge in `.opencode/skills/sk-code-review/graph-metadata.json` (evidence: residual count `0`)
- [x] T007 Fix critical edges in `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` (evidence: residual count `0`)
- [x] T008 Build scoped replacement file list with exclusions (evidence: initial scoped pass covered 749 files; no-ignore tail pass cleaned 264 additional active `.opencode` files)
- [x] T009 Replace old skill IDs in allowed `.opencode/skill` docs, metadata, references, assets, and playbooks (evidence: broad active `.opencode` residual count `0` after exclusions)
- [x] T010 Replace old skill IDs in `.opencode/agent` and `.opencode/commands/spec_kit` (evidence: audit count `0`)
- [x] T011 Replace old skill IDs in MCP server code, scripts, tests, and expected fixtures (evidence: audit count `0`)
- [x] T012 Replace old skill IDs in active `.opencode/specs` authored docs, metadata, descriptions, research, and review artifacts (evidence: authored-doc audit count `0`; broad no-ignore active `.opencode` residual count `0`)
- [x] T013 Validate edited JSON files parse successfully (evidence: `json_checked=96`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run critical graph metadata residual greps (evidence: both counts `0`)
- [x] T015 Run active spec residual grep audit (evidence: count `0`)
- [x] T016 Run agent/command residual grep audit (evidence: count `0`)
- [x] T017 Run MCP server/scripts residual grep audit (evidence: count `0`)
- [x] T018 Run OpenCode alignment drift verifier (evidence: PASS, 0 errors, 21 warnings)
- [x] T019 Run child strict validation (evidence: exit 0)
- [x] T020 Run parent strict validation (evidence: exit 0)
- [x] T021 Record completion evidence in checklist and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Requested grep audits return zero residual hits in non-excluded scopes
- [x] Edited JSON files parse successfully
- [x] Child and parent strict validation exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Resource Map**: See `../resource-map.md`
- **Phase 001 Inventory**: See `../001-discovery-impact-map/inventory.tsv`
<!-- /ANCHOR:cross-refs -->
