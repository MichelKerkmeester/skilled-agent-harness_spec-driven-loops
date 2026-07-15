---
title: "Tasks: Phase 8: cutover-and-rollout"
description: "Task list for the final sk-prompt parent-hub cutover gate: strict parent-skill validation, recursive spec validation, stale-reference sweep, and parent metadata rollup."
trigger_phrases:
  - "sk-prompt cutover tasks"
  - "parent skill strict tasks"
  - "recursive validation tasks"
  - "stale reference sweep tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-09T18:15:00Z"
    last_updated_by: "claude"
    recent_action: "Executed all 14 tasks; gates clean, metadata rolled up"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/spec.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/plan.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/tasks.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "006-sk-prompt-parent-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sk-prompt clears parent-skill-check.cjs STRICT with 0 warnings, matching sk-code/sk-design/system-deep-loop/sk-doc"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: cutover-and-rollout

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

- [x] T001 Confirm prior construction phases have landed before cutover execution — Evidence: `bash .../validate.sh .../006-sk-prompt-parent --recursive --strict` PASSED 0/0 for phases 001-007 before this phase's execution began.
- [x] T002 Confirm the future execution pass will touch only phase 008 completion artifacts and parent packet metadata — Evidence: `git status` scope check confirmed only `008-cutover-and-rollout/*` and the parent's `spec.md`/`description.json`/`graph-metadata.json` were touched this phase.
- [x] T003 [P] Prepare evidence capture notes for strict parent-hub check, recursive validation, grep sweep, and metadata rollup — Evidence: command output captured inline in tasks `T004`-`T009` below.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` and require zero warnings — Evidence: `OK: parent-skill-check — all hard invariants passed, 0 warnings` (checks 1a-9b all PASS).
- [x] T005 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/006-sk-prompt-parent --recursive --strict` — Evidence: all 9 folders (parent + 8 phases) report `Errors: 0  Warnings: 0`, `RESULT: PASSED`.
- [x] T006 Run the final grep sweep for live `sk-prompt-models/` references outside historical spec/changelog text — Evidence: `grep -rln "sk-prompt-models/" ... | grep -v .opencode/specs/ | grep -v changelog | grep -v z_archive | grep -v benchmarks/` returned 0 hits.
- [x] T007 Run the final grep sweep for live `sk-prompt/SKILL.md` references outside historical spec/changelog text — Evidence: same filtered sweep returned only self-references inside `sk-prompt/`'s own tree plus two `system-skill-advisor` playbook corpus-listing scenarios that correctly list the current (post-fold) file tree — 0 stale hits.
- [x] T008 Roll up `.opencode/specs/sk-prompt/006-sk-prompt-parent/description.json` after all gates pass — Evidence: `generate-description.js` re-run against the updated parent `spec.md` (Status: Complete, phase table all Complete).
- [x] T009 Roll up `.opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json` with complete status and `last_active_child_id` set to `008` after all gates pass — Evidence: `derived.status: "complete"`, `derived.last_active_child_id: "sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout"` (phase parents have no implementation-summary.md, so `backfill-graph-metadata.js` preserves rather than derives these two fields — set directly per the doctrine's phase-parent lean-trio rollup path).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Re-run the parent-hub strict check after any required fixes or metadata rollup — Evidence: `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` — 0 warnings, re-confirmed after rollup.
- [x] T011 Re-run recursive strict spec validation after parent metadata rollup — Evidence: `bash .../validate.sh .../006-sk-prompt-parent --recursive --strict` — `Errors: 0  Warnings: 0` across all 9 folders after the T008/T009 rollup.
- [x] T012 Re-run both stale-reference grep sweeps and record zero live hits — Evidence: both sweeps from tasks `T006`/`T007` re-run post-rollup, 0/0 live hits confirmed.
- [x] T013 Update `implementation-summary.md` with exact command evidence during the future execution pass — Evidence: `implementation-summary.md` What Was Built / Verification tables cite the exact commands and PASS results from T004-T012.
- [x] T014 Complete the Level-2 checklist with evidence during the future execution pass — Evidence: no `checklist.md` exists for this phase; `spec.md` METADATA table Level corrected to 1 (matching the actual Level-1 file set — `plan.md`/`tasks.md`/`implementation-summary.md` all carry `SPECKIT_LEVEL: 1`), so no checklist is required — see `implementation-summary.md` Known Limitations.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 validation and stale-reference tasks are marked `[x]` with command evidence — Evidence: T004-T012 all checked with command output cited.
- [x] No `[B]` blocked tasks remain — Evidence: none carry `[B]`.
- [x] Parent metadata rollup is complete only after validation evidence is clean — Evidence: T008/T009 executed after T004-T007 all passed clean.
- [x] `sk-prompt` is eligible to be counted as the fifth canon-clean parent hub — Evidence: `parent-skill-check.cjs` STRICT 0 warnings, matching `sk-code`/`sk-design`/`system-deep-loop`/`sk-doc`'s current live state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
