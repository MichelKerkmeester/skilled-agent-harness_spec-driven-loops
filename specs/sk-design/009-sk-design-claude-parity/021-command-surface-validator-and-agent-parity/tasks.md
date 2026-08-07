---
title: "Tasks: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 021 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/021-command-surface-validator-and-agent-parity"
    last_updated_at: "2026-07-07T12:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "surface-validator-021"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes

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

- [x] T001 Read `design-command-surface-check.mjs` in full (2600+ lines)
- [x] T002 Read all 5 command wrapper files in full
- [x] T003 Read `audit.md`'s owned assets (`presentation.txt`, `auto.yaml`) as the template
- [x] T004 Read `command-metadata.json` in full (853 lines)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `assetPathsForCommand`, `wordOverlapRatio`, `lastPathSegment`, `stripTrailingPeriod`, `readTransportCommands` helpers (`design-command-surface-check.mjs`)
- [x] T006 Rewrite `collectSurfaceDrift` to build the combined 4-file surface per command
- [x] T007 Rewrite `expectedEmitDeliverableDrift` + `expectedExampleDrift` against `presentation.txt`
- [x] T008 Rewrite `expectedDiscriminatorDrift` + `expectedRegisterDrift` + `expectedPreconditionsDrift` against `wrapper` (anchors unchanged) with `combined`-scoped status-token checks
- [x] T009 Rewrite `expectedPipelineDrift`/`expectedPipelineStatusDrift` against `auto`/`combined`/`presentation`; rewrite `extractSuccessStatusLine` for the fenced-code-block format
- [x] T010 Rewrite `expectedHandoffDrift` against `presentation`, dropping obsolete `NEXT_OPTIONS=`/`HANDOFF_REASON=` tokens, adding fuzzy rationale matching
- [x] T011 Rewrite `expectedChoreographyDrift` against `auto` with resource path + fuzzy action-text matching
- [x] T012 Rewrite `expectedTaskProjectionsDrift` against `auto`; regex-normalize the negative-corpus marker
- [x] T013 Rewrite `expectedUserIntentDrift` against `## ROUTER CONTRACT` + sibling-discriminator's "Use this command when" bullet (copyGuard retargeted off the now-uniform router boilerplate)
- [x] T014 [P] Add transport-command exemption to `collectRosterReconciliationDrift` + wire `readTransportCommands` into `main()`
- [x] T015 [P] Remove 8 dead extraction helper functions
- [x] T016 [P] Edit all 5 wrapper `.md` files: `design-mcp-open-design` sibling row + `**Ask-first:**` marker
- [x] T017 [P] Fix obsolete `mcp-open-design` naming: `design-md-generator/{SKILL.md,README.md,references/extraction_workflow.md}`, `feature_catalog/feature_catalog.md` (7 occurrences)
- [x] T018 [P] Fix `.opencode/agents/design.md` + `.claude/agents/design.md`: Mode Map row, Tool-Surface Downshift section, ALWAYS/NEVER rules, packet-path note
- [x] T019 [P] Bump `sk-design/SKILL.md` version `1.1.0.0` -> `1.2.0.0`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 `node --check design-command-surface-check.mjs` after the rewrite
- [x] T021 `node design-command-surface-check.mjs`: iterate until `STATUS=PASS drift=0` (77 -> 10 -> 0)
- [x] T022 Grep sweep: 0 obsolete `mcp-open-design` hits outside the frozen changelog entry
- [x] T023 `diff` the two `design.md` agent mirrors: confirm only frontmatter/path-convention differ
- [x] T024 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `design-command-surface-check.mjs` reaches a genuine clean pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../020-drift-and-improvement-audit/research/research.md`
<!-- /ANCHOR:cross-refs -->
