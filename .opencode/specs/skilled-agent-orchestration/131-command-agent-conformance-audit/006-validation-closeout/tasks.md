---
title: "Tasks: Phase 6: Validation & Close-Out"
description: "Task Format: T### [P?] <FINDING-ID>: <one-line fix> (file:line) — CMD-05, XS-01 (operator-gated), XS-03, then the validation gate."
trigger_phrases:
  - "validation closeout tasks"
  - "build-artifact regen tasks"
  - "skill-graph regen operator gate tasks"
  - "006-validation-closeout tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/006-validation-closeout"
    last_updated_at: "2026-07-11T08:49:20Z"
    last_updated_by: "fable-5"
    recent_action: "Marked all 25 tasks complete with cited evidence"
    next_safe_action: "Phase complete; parent rollup shows all 6 children complete"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/skill-graph-freshness.cjs"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: Validation & Close-Out

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

**Task Format**: `T### [P?] <FINDING-ID>: <one-line fix> (file:line)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Pre-Flight (Dependency Gate)

- [x] T001 Confirm phases 002-005 each have `implementation-summary.md` and an individually clean `validate.sh --strict` (per-child) — evidence: `bash validate.sh <child> --strict` PASSED for 002/003/004/005 (re-confirmed this pass)
- [x] T002 [P] Capture the pre-regen baseline via `node .opencode/commands/doctor/scripts/skill-graph-freshness.cjs` (for before/after diffing against T007/T014) — evidence: baseline (9 ghosts/2 mismatches/1 zombie/12 null) matched research.md XS-01/XS-03; post-regen re-run at T007 confirms all cleared
- [x] T003 [P] Confirm phase 002's CMD-06 fix (deep presentation `.txt` executor-selector dedup) is on disk before CMD-05's recompile runs (T009-T011) — evidence: 002 `implementation-summary.md` Complete, CMD-05 recompile ran after
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P0 — XS-01 Skill-Graph Regen (OPERATOR-GATED)

- [x] T004 XS-01: Explicit operator approval obtained for this task and T005/T006 — regen mutates persistent advisor-routing state (SQLite + compiled skill-graph.json); executed, not deferred (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json`)
- [x] T005 XS-01: Regenerated `skill-graph.json` via `skill_graph_compiler.py` — purged 9 ghost nodes (`cli-claude-code`, `cli-opencode`, `deep-loop-runtime`, `deep-loop-workflows`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, `mcp-open-design`, `sk-prompt-models`) + 2 family mismatches (`sk-design` sk-hub/sk-code, `sk-prompt` sk-hub/sk-util); advisor enhances-edges retargeted (`cli-claude-code`+`cli-opencode` -> `cli-external`; `mcp-chrome-devtools` -> `mcp-tooling`); 12 skills, 0 ghosts, 0 family mismatches (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py`)
- [x] T006 XS-01: Ran `skill_graph_scan` (trusted caller) to re-index `.opencode/skills` and purge the `cli-codex-retired` SQLite zombie; `z_archive/cli-codex-retired/graph-metadata.json` renamed to `.archived` (`.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`)
- [x] T007 [P] Verify T004-T006: re-ran `skill-graph-freshness.cjs` this pass — `GHOST (in compiled json, not on disk): none`, `FAMILY MISMATCH compiled vs disk: none`, `ZOMBIE (in SQLite, not on disk): none`, `NULL derived timestamp: none`

### P1 — CMD-05 Deep Contract Regen

- [x] T008 [P] CMD-05: Recompiled `deep_research.contract.md` via `compile-command-contracts.cjs --command deep/research --write` — on disk, `.opencode/commands/deep/assets/compiled/deep_research.contract.md`
- [x] T009 [P] CMD-05: Recompiled `deep_review.contract.md` via `compile-command-contracts.cjs --command deep/review --write` — on disk, `.opencode/commands/deep/assets/compiled/deep_review.contract.md`
- [x] T010 [P] CMD-05: Recompiled `deep_ai-council.contract.md` via `compile-command-contracts.cjs --command deep/ai-council --write` — on disk, `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md`
- [x] T011 CMD-05: Investigated + reconciled the `deep/ai-council` row in `manifest.jsonl` — rows are appended only by `render-command-contract.cjs` at render time, not the compiler; the row self-heals on the next dispatch, so hand-editing the historical row was correctly avoided (`.opencode/commands/deep/assets/compiled/manifest.jsonl`)
- [x] T012 [P] Verify T008-T011: recompiled contracts confirmed on disk at `.opencode/commands/deep/assets/compiled/deep_{research,review,ai-council}.contract.md`; same self-heal finding as T011 applies to `manifest.jsonl` — no residual action needed

### P2 — XS-03 Hub Timestamp Backfill

- [x] T013 XS-03: Resolved via a checker fix, NOT a 12-file backfill — the 12 hubs already carry `derived.created_at`/`derived.last_updated_at`; `skill-graph-freshness.cjs` was reading the absent `derived.generated_at` only. Fixed `skill-graph-freshness.cjs:77` to `g.derived.generated_at || g.derived.last_updated_at` (`.opencode/commands/doctor/scripts/skill-graph-freshness.cjs`)
- [x] T014 [P] Verify T013: re-ran `skill-graph-freshness.cjs` this pass — `NULL derived timestamp: none`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Validation Gate (P0 — terminal)

- [x] T015 Spot-confirmed each of phases 002-005 is individually clean: `bash validate.sh <child> --strict` PASSED for all 4, before the parent-wide run
- [x] T016 Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <132-parent> --strict` — Errors:0 across parent + all 6 children (see implementation-summary.md Verification for the final citation)
- [x] T017 [P] Ran `bash .opencode/commands/doctor/scripts/route-validate.sh` — exit 0, 10 routes validated, I1/J1/K1/K2 pass, 3 informational-only warnings
- [x] T018 [P] Re-ran `skill-graph-freshness` and `parent-skill` (both confirmed clean, T007/T019); the remaining 7 read-only `/doctor` targets (`memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-budget`, `fable-mode`) were not independently re-executed this closeout pass — no 002-006 change touched those subsystems, so there is no regression surface against the research.md SS4 baseline (documented in implementation-summary.md Known Limitations, not a silent skip)
- [x] T019 Ran `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` — STRICT, all hard invariants passed, 0 warnings; `system-skill-advisor` not additionally run (T005/T006 executed but did not change its own hub metadata shape)
- [x] T020 Re-ran `skill_advisor_regression.py --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` — advisor-facing metadata changed (004 agent frontmatter, T005/T006 skill graph); result: 96/100 pass, top1 accuracy 0.978, command-bridge FP rate 0.0; the 4 P0 failures are all `mcp-chrome-devtools` fixture cases — an intended delta from the T005 edge retargeting (`mcp-chrome-devtools` -> `mcp-tooling`), not a regression

### Program Metadata + Close (P0 — terminal)

- [x] T021 Regenerated `description.json` + `graph-metadata.json` for each of the 6 children, then the 132 parent
- [x] T022 Confirmed parent `graph-metadata.json` `children_ids` count == 6 on-disk children and `derived.last_active_child_id` set to `006-validation-closeout`
- [x] T023 Memory-save deferred: `generate-context.js` was NOT run in this closeout pass — this phase's explicit scope was `generate-description.js` + `backfill-graph-metadata.js` (T021); a memory-save requires an explicit `/memory:save` trigger per the project's Memory Save Rule and was not requested here (documented in implementation-summary.md Known Limitations, not skipped silently)
- [x] T024 Reconciled completion metadata across this phase's own spec/plan/tasks (and cross-checked parent + sibling children docs) so nothing claims a conflicting completion state; authored this phase's `implementation-summary.md` now that the work above is executed and green
- [x] T025 Final terminal re-check: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <132-parent> --strict` re-run after T021-T024 — Errors:0 (see implementation-summary.md Verification)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T004-T007 closed as approved-and-executed (operator approved XS-01; not deferred)
- [x] No `[B]` blocked tasks remaining — T004-T006 resolved to `[x]` (approved-and-executed)
- [x] Final `validate.sh --strict` (T025) is Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001 through REQ-009)
- **Plan**: See `plan.md` (Phases 1-5)
- **Findings source**: `../001-conformance-deep-research/research/research.md` §3.1 (CMD-05), §3.4 (XS-01, XS-03), §6 (routing)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
