---
title: "Tasks: Phase 2 — Tool selection and scaffold"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-obsidian scaffold tasks"
  - "obsidian tool selection tasks"
  - "mcp-obsidian phase 2 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/002-tool-selection-and-scaffold"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 2 scaffold tasks"
    next_safe_action: "Read research.md, then start T001 (extract per-surface recommendation)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-tool-selection-and-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 — Tool selection and scaffold

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

- [ ] T001 Read `../001-deep-research/research.md`; extract the decided per-surface build-vs-adopt recommendation
- [ ] T002 Inventory the `mcp-click-up` tree (`.opencode/skills/mcp-tooling/mcp-click-up/`) as the mirror reference
- [ ] T003 [P] Choose the scaffolder path — `sk-create-skill` `scripts/init_skill.py` vs manual mirror — and record the justification
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Record the CLI build-vs-adopt decision (named candidate + rationale) in `spec.md`
- [ ] T005 Record the MCP build-vs-adopt decision (named candidate + rationale) in `spec.md`
- [ ] T006 Scaffold the `mcp-obsidian` skeleton at `.opencode/skills/mcp-tooling/mcp-obsidian/` mirroring the mcp-click-up inventory
- [ ] T007 Strip mode-illegal artifacts (`assets/`, mode-root `description.json`/`graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Diff the skeleton inventory against `mcp-click-up`; confirm parity minus `assets/` + mode-root JSON
- [ ] T009 If a surface decision is architecturally heavy, add `decision-record.md` and bump this phase to Level 2/3
- [ ] T010 `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Both surface decisions recorded with named candidates, traceable to `research.md`
- [ ] Skeleton matches the mcp-click-up inventory (no `assets/`, no mode-root JSON)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `../003-cli-tool-integration/` and `../004-mcp-server-integration/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
