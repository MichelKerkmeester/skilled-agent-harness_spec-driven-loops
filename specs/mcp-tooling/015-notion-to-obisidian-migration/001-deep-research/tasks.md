---
title: "Tasks: Phase 1 — Deep research: flawless complex Notion→Obsidian migration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "notion obsidian migration research tasks"
  - "015 phase 1 tasks"
  - "deep research notion obsidian tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/001-deep-research"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task list for the two-track 20-iter deep-research run; not yet launched"
    next_safe_action: "run the 20-iter deep research loop"
    blockers: []
    key_files:
      - "spec.md"
      - "prior-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-001-deep-research"
      parent_session_id: "015-notion-to-obisidian-migration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Deep research: flawless complex Notion→Obsidian migration

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

- [ ] T001 Read `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md`; record the fanout flag/env for a GLM-5.2-High dispatch
- [ ] T002 Read `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md`; record the fanout flag/env for a DeepSeek-V4-Flash-xhigh (Cline) dispatch
- [ ] T003 Initialize `/deep:research` state (no-early-convergence, `max-iterations`) under `001-deep-research/research/lineages/glm/` and `.../lineages/deepseek/`
- [ ] T004 [P] Load seed sources (`prior-findings.md`, Obsidian Importer/Bases docs, Notion Bases plugin, Dataview, official Notion API docs, `mcp-notion`/`mcp-obsidian` SKILL.md) and enumerate the research sub-questions in `spec.md` §3
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Run the 10-iteration loop — GLM-5.2 High (`glm-5-2`) via cli-devin, no early convergence
- [ ] T006 Run the 10-iteration loop — DeepSeek V4 Flash xhigh via cli-opencode/Cline, no early convergence
- [ ] T007 Map the survives-automatically vs needs-reconstruction matrix across both tracks (relations, rollups, formulas, files, comments, views, nested hierarchy)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Synthesize both lineages into `research.md`: per-question answers with citations, extending (not discarding) `prior-findings.md`
- [ ] T009 Write the mcp-notion-reads / mcp-obsidian-writes division of labor per migration step + the required-Obsidian-plugin list
- [ ] T010 `validate.sh` this phase; author `implementation-summary.md` + refresh continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] 20 iterations recorded (10 per track), no early convergence on either track
- [ ] `research.md` hands phase 002+ a decided migration method with no open design question
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Seed**: See `prior-findings.md`
- **Next phase**: `../002-*/` (shape TBD, pending this phase's verdict)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
