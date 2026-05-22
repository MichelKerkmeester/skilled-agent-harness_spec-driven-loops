---
title: "Tasks: 118/001 — Runtime Skill Scaffold"
description: "Level 2 task ledger for scaffolding the .opencode/skills/deep-loop-runtime/ peer skill skeleton."
trigger_phrases:
  - "deep-loop-runtime scaffold"
  - "runtime skill skeleton"
  - "118 phase 001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/001-runtime-skill-scaffold"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 task ledger."
    next_safe_action: "Complete Phase 1 tasks then proceed to implementation."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180011180011180011180011180011180011180011180011180011180010003"
      session_id: "118-001-runtime-skill-scaffold-tasks"
      parent_session_id: "118-001-runtime-skill-scaffold-spec"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Tasks: 118/001 — Runtime Skill Scaffold

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Read parent spec (`../spec.md`) to internalize 118 arc scope [5m]
- [ ] T002 [P] Read predecessor 117 ADR-001 SPLIT ruling to confirm override (`../../117-deep-loop-core-isolation-deliberation/ai-council/seats/round-001/seat-D-adjudicator.md`) [5m]
- [ ] T003 [P] Inspect peer skill frontmatter shape (`.opencode/skills/deep-review/SKILL.md`, `.opencode/skills/deep-research/SKILL.md`) [10m]
- [ ] T004 Confirm `.opencode/skills/deep-loop-runtime/` does not exist (`ls .opencode/skills/ | grep deep-loop-runtime`) [2m]
- [ ] T005 Confirm `validate.sh` exists and runs on a known reference packet [3m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Create `.opencode/skills/deep-loop-runtime/` folder [1m]
- [ ] T011 Author `.opencode/skills/deep-loop-runtime/SKILL.md` with name=deep-loop-runtime, version=0.1.0, allowed-tools=[Read,Glob,Grep,Bash] frontmatter and 118 ADR-001 cross-reference [10m]
- [ ] T012 Author `.opencode/skills/deep-loop-runtime/README.md` with overview and phase ownership map [8m]
- [ ] T013 [P] Create `.opencode/skills/deep-loop-runtime/lib/deep-loop/.gitkeep` [1m]
- [ ] T014 [P] Create `.opencode/skills/deep-loop-runtime/lib/coverage-graph/.gitkeep` [1m]
- [ ] T015 [P] Create `.opencode/skills/deep-loop-runtime/scripts/.gitkeep` [1m]
- [ ] T016 [P] Create `.opencode/skills/deep-loop-runtime/storage/.gitkeep` [1m]
- [ ] T017 [P] Create `.opencode/skills/deep-loop-runtime/tests/.gitkeep` [1m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 Run `ls .opencode/skills/deep-loop-runtime/` and confirm two files plus five directories present [2m]
- [ ] T021 Run `find .opencode/skills/deep-loop-runtime -name .gitkeep` and confirm exit-0 with five paths [2m]
- [ ] T022 Run `head -30 .opencode/skills/deep-loop-runtime/SKILL.md` and confirm `name: deep-loop-runtime`, `version: 0.1.0`, and the allowed-tools list [3m]
- [ ] T023 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/001-runtime-skill-scaffold --strict` and confirm exit 0 plus `RESULT: PASSED` [3m]
- [ ] T024 Run `git status .opencode/skills/system-spec-kit/mcp_server/` and confirm no in-scope diffs [2m]
- [ ] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp --strict --recursive` and confirm parent + phase 001 both PASS [3m]
- [ ] T026 Update `implementation-summary.md` `what-built` and `verification` anchors with concrete file paths and command output [10m]
- [ ] T027 Update `description.json` and `graph-metadata.json` if implementation deviated from scaffold metadata [5m]
- [ ] T028 Mark all checklist items with evidence in `checklist.md` [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or explicitly documented as deferred with rationale.
- [ ] No `[B]` blocked tasks remaining.
- [ ] `.opencode/skills/deep-loop-runtime/` exists with all required files.
- [ ] Strict validation passes for this packet AND for the phase parent recursive run.
- [ ] `checklist.md` is fully verified with evidence per item.
- [ ] `implementation-summary.md` documents real file paths under `what-built` and real commands under `verification`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`
- **Successor Phase**: See `../002-lib-runtime-migration/spec.md`
<!-- /ANCHOR:cross-refs -->
</content>
</invoke>