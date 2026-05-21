---
title: "Tasks: foundation routing"
description: "Task list for Phase A: T001-T015 across setup, implementation, verification."
trigger_phrases:
  - "foundation routing tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/002-sentinel-skill-foundation"
    last_updated_at: "2026-05-18T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 002 tasks.md"
    next_safe_action: "Author 002 implementation-summary.md placeholder"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000004"
      session_id: "114-002-tasks-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: foundation routing

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

> Sentinel skill scaffolding.

- [x] T001 Create `.opencode/skills/sk-small-model/` directory + `references/` subdir
- [x] T002 Author `sk-small-model/SKILL.md` (frontmatter + philosophy body, ≤200 LOC)
- [x] T003 Author `sk-small-model/graph-metadata.json` (trigger phrases, key topics, enhances edges to cli-devin + cli-opencode)
- [x] T004 Author `sk-small-model/references/pattern-index.md` (stub table)
- [ ] T005 Run `generate-context.js` on sk-small-model to mint description.json — skipped: command rejected `.opencode/skills/sk-small-model` because it only accepts `NNN-feature-name` spec folders; `description.json` was authored manually to satisfy skill layout.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Routing wiring + AGENTS.md edit.

- [x] T006 Edit `cli-devin/graph-metadata.json`: add reverse enhances edge to sk-small-model (weight 0.5 + context string)
- [x] T007 Edit `cli-opencode/graph-metadata.json`: same
- [x] T008 Edit `AGENTS.md` §1: insert "Small-model dispatch rule" under existing CLI dispatch rule
- [x] T009 Run `python3 .../skill_advisor.py --rebuild` to re-index advisor — completed via supported equivalent `--force-refresh`; `--rebuild` is not available in this checkout.
- [ ] T010 [P] Optional: add sk-prompt enhances edge to sk-small-model (weight 0.3) if scope expands — skipped by instruction; deferred to 006.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Scorer simulation + regression check.

- [x] T011 Simulate prompt "dispatch SWE-1.6 to read file X" via skill_advisor.py; confirm sk-small-model in top-3 with confidence ≥ 0.8
- [x] T012 Simulate prompt "use cli-devin for code review with output verification"; same
- [x] T013 Simulate prompt "what's the small-model output verification pattern"; same
- [x] T014 Regression: simulate "code review TypeScript file" (non-small-model); confirm sk-small-model NOT in top-3 OR confidence < 0.5
- [ ] T015 Memory search "small model optimization patterns" returns sk-small-model — skipped: no convenient memory search CLI exists under `.opencode/skills/system-spec-kit/mcp_server/scripts/`; `generate-context.js` is not a search command.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001-T015 marked [x] (T005/T010/T015 skipped with rationale)
- [x] No [B] blocked tasks
- [x] All P0 requirements from spec.md §4 verified
- [ ] All success criteria from spec.md §5 demonstrated (SC-004 skipped: no search CLI)
- [x] implementation-summary.md filled with metrics + verification evidence
- [x] Memory continuity updated with next-phase pointer (→ 003-permissions-matrix and/or 004-cli-devin-quality)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Roadmap**: `../roadmap/follow-on-phases.md` Phase A
- **Research synthesis**: `../001-research-smallcode/research/research.md` §RQ5
<!-- /ANCHOR:cross-refs -->
