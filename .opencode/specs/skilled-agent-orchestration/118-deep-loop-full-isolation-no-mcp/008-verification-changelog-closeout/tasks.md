---
title: "Tasks: Verification + Changelog + Closeout"
description: "Task breakdown for the 118/008 phase: four verification commands, two SKILL.md/changelog pairs, one deferred resource-map, parent status flip, graph-metadata refresh, single closeout commit."
trigger_phrases:
  - "118/008 tasks"
  - "118 closeout tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/008-verification-changelog-closeout"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 24-task breakdown across three phases."
    next_safe_action: "Confirm phase 007 PASS, then start T001."
    blockers: []
    completion_pct: 5
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1180080080080080080080080080080080080080080080080080080080080002"
      session_id: "118-008-verification-changelog-closeout-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Verification + Changelog + Closeout

<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Setup

- [ ] T001 Read `../007-test-migration/implementation-summary.md`; confirm PASS state (no path written) [3m]
- [ ] T002 [P] Read `.opencode/skills/sk-doc/assets/changelog_template.md`; pick compact vs. expanded (no path written) [3m]
- [ ] T003 [P] Verify `.opencode/skills/deep-loop-runtime/SKILL.md` scaffold exists from phase 001 (no path written) [2m]
- [ ] T004 Capture baseline `git status` for affected scope (no path written) [2m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Verification Commands (15 minutes)

- [ ] T005 Run `pnpm vitest run`; capture exit code + failure count (no path written, output to scratch) [5m]
- [ ] T006 Run `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/deep-loop-runtime`; capture PASS + findings (no path written) [3m]
- [ ] T007 Run `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/commands/spec_kit/assets`; capture PASS + findings (no path written) [3m]
- [ ] T008 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp --recursive --strict`; capture exit code (no path written) [2m]
- [ ] T009 Run `grep -rE "mcp__mk_spec_memory__deep_loop_graph_" .opencode/ | grep -v specs/`; verify zero lines (no path written) [2m]

### SKILL Version Bumps + Changelogs (45 minutes)

- [ ] T010 Bump `.opencode/skills/deep-review/SKILL.md` frontmatter `version: 1.3.3.0` -> `1.4.0.0` (`.opencode/skills/deep-review/SKILL.md`) [10m]
- [ ] T011 Author `.opencode/skills/deep-review/changelog/v1.4.0.0.md` per `sk-doc/assets/changelog_template.md`; document the deep-loop-runtime dependency switch + 118 arc reference (`.opencode/skills/deep-review/changelog/v1.4.0.0.md`) [20m]
- [ ] T012 Finalize `.opencode/skills/deep-loop-runtime/SKILL.md`; fill phase 001 placeholders; lock version (`.opencode/skills/deep-loop-runtime/SKILL.md`) [10m]
- [ ] T013 Author `.opencode/skills/deep-loop-runtime/changelog/v0.1.0.md` (or v1.0.0.md if scope justifies) initial release entry (`.opencode/skills/deep-loop-runtime/changelog/v0.1.0.md`) [15m]

### Deferred-from-116 Resource Map (20 minutes)

- [ ] T014 Author `116-deep-review-complexity/008-playbooks-and-default-calibration/resource-map.md`; list deep-review files touched by 116 arc using FINAL post-118 paths (`.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/008-playbooks-and-default-calibration/resource-map.md`) [20m]

### Parent Status + Metadata Refresh (10 minutes)

- [ ] T015 Update 118 parent `spec.md` Status field from `Scaffolded; phase 001 next` to `Complete; 8/8 children shipped` (`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/spec.md`) [5m]
- [ ] T016 Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` against the 118 parent folder; refresh parent + 8 child `graph-metadata.json` files (`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/graph-metadata.json` + 8 children) [5m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Strict-Validate Gate

- [ ] T017 Re-run `validate.sh --recursive --strict` after all writes; confirm zero errors (no path written) [3m]

### Implementation Summary Population

- [ ] T018 Populate `implementation-summary.md` with verification command outputs + line counts + paths authored (`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/008-verification-changelog-closeout/implementation-summary.md`) [5m]

### Checklist Evidence

- [ ] T019 Mark all P0 checklist items `[x]` with evidence (`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/008-verification-changelog-closeout/checklist.md`) [3m]
- [ ] T020 Mark all P1 checklist items `[x]` with evidence (same file) [2m]

### Single Closeout Commit

- [ ] T021 Stage all closeout paths explicitly (no `git add -A`); double-check `git status` (no path written) [2m]
- [ ] T022 Land single closeout commit on `main` with conventional-commit message (no path written) [3m]
- [ ] T023 Backfill `implementation-summary.md` with commit SHA from `git log -1` (`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/008-verification-changelog-closeout/implementation-summary.md`) [2m]
- [ ] T024 Final sanity: `grep -rE "mcp__mk_spec_memory__deep_loop_graph_" .opencode/ | grep -v specs/` returns zero lines POST-commit (no path written) [1m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All four verification commands PASS
- [ ] All six documentation files authored or updated
- [ ] Parent status = `Complete; 8/8 children shipped`
- [ ] Single closeout commit landed on `main`
- [ ] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Phase Spec**: See `../spec.md`
- **Predecessor Phase**: See `../007-test-migration/`
- **Changelog Template**: `.opencode/skills/sk-doc/assets/changelog_template.md`
<!-- /ANCHOR:cross-refs -->
