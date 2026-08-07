---
title: "Tasks: Phase 1 — Deep research: Obsidian CLI / REST API / MCP landscape"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "obsidian research tasks"
  - "mcp-obsidian phase 1 tasks"
  - "deep research tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/001-deep-research"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 1 research tasks"
    next_safe_action: "Read cli-codex SKILL.md, then init deep-research state"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Deep research: Obsidian CLI / REST API / MCP landscape

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

- [ ] T001 Read `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md`; record the SOL/TERRA/LUNA + effort + speed flag syntax and the fan-out env
- [ ] T002 Initialize `/deep:research` state (no-early-convergence) under `001-deep-research/`
- [ ] T003 [P] Load seed sources (dsebastien CLI guide, help/docs.obsidian.md, Local REST API, obsidian:// URI, community CLI + MCP repos) and enumerate research questions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run Batch 1 — GPT-5.6 SOL high/normal ×4 iterations (no early convergence)
- [ ] T005 Run Batch 2 — GPT-5.6 TERRA max/fast ×3 iterations (no early convergence)
- [ ] T006 Run Batch 3 — GPT-5.6 LUNA max/normal ×3 iterations (no early convergence)
- [ ] T007 Verify each candidate CLI/MCP package/binary identity (npm resolves, repo maintained) — avoid the clickup 404 trap
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Synthesize deltas into `research.md`: per-question answers with citations
- [ ] T009 Write the ranked build-vs-adopt recommendation per surface + auth/config pattern + feature surface + headless-compatibility flag
- [ ] T010 `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] 10 productive iterations recorded, no early convergence
- [ ] `research.md` hands Phase 2 a decided recommendation with verified candidate identities
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `../002-tool-selection-and-scaffold/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
