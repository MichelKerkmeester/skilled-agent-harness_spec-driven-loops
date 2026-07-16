---
title: "Tasks: MCP topology pivot"
description: "Tracked tasks T001-T020 for standalone system_code_graph MCP pivot."
trigger_phrases:
  - "mcp topology pivot"
  - "system code graph standalone mcp"
  - "ADR-002 code graph topology"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/006-extraction-and-isolation/003-standalone-mcp-topology-pivot"
    last_updated_at: "2026-05-14T09:24:15Z"
    last_updated_by: "claude"
    recent_action: "Validated ADR-002 standalone MCP topology pivot"
    next_safe_action: "Restart MCP children to pick up system_code_graph"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140007"
      session_id: "007-mcp-topology-pivot"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: MCP topology pivot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Recalibrate 001-006 graph metadata to complete.
- [x] T002 Recalibrate 001-006 implementation summaries with post-reorg reality.
- [x] T003 Scaffold 007 spec.md.
- [x] T004 Scaffold 007 plan.md.
- [x] T005 Scaffold 007 tasks.md/checklist.md/metadata.
- [x] T006 Author ADR-002 decision-record.md.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T007 Create system-code-graph launcher.
- [x] T008 Create standalone MCP entrypoint.
- [x] T009 Create system-code-graph tool-schemas.ts.
- [x] T010 Remove code-graph schema registration from spec_kit_memory.
- [x] T011 Remove code-graph dispatcher registration from spec_kit_memory.
- [x] T012 Move/confirm stress tests and plugin bridge ownership.
- [x] T013 Move pure internal external tests and keep cross-subsystem contract tests.
- [x] T014 Update opencode.json MCP registry and env defaults.
- [x] T015 Update agent/command MCP namespace grants.
- [x] T016 Fix doctor/update.md mutation boundary paths.
- [x] T017 Update SKILL.md/README.md standalone topology docs.
- [x] T018 Delete stale stub DB when safe.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T019 Run strict packet validation, typecheck, and smoke Vitest. Evidence: 007 strict validate, both typechecks, and smoke Vitest exits recorded in implementation-summary.md.
- [x] T020 Run recursive parent validation and record final metrics. Evidence: recursive 014 validate exit and required output metrics recorded in implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks complete. Evidence: T001-T020 are checked with validation evidence.
- [x] No blockers remain. Evidence: validation and smoke checks exit 0.
- [x] Final output metrics emitted. Evidence: implementation-summary.md contains the dispatch metric block.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `005-code-graph/013-system-code-graph-extraction`
- Superseded decision: `014/001-extraction-design-and-adr/decision-record.md` ADR-001 Q3 only
- Active decision: `014/007-mcp-topology-pivot/decision-record.md` ADR-002
<!-- /ANCHOR:cross-refs -->
