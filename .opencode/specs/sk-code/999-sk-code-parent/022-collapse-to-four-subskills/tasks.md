---
title: "Tasks: Collapse sk-code from 8 sub-skills to 4"
description: "Executed task list for the sk-code four-sub-skill collapse: workflow modes dissolved, animation folded into Webflow, routing and references reconciled, benchmark gold re-baselined, and verification gates recorded."
trigger_phrases:
  - "phase 22 tasks"
  - "sk-code four subskills tasks"
  - "collapse sk-code tasks"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/022-collapse-to-four-subskills"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Four-sub-skill collapse and Lane-C re-baseline evidence recorded"
    next_safe_action: "None; retrospective close-out docs record shipped work"
---
# Tasks: Collapse sk-code from 8 sub-skills to 4

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
## Phase 1: Setup

- [x] T001 Confirm phase-022 scope and out-of-scope boundaries [small] — spec.md defines the four-sub-skill collapse, zero-loss requirement, routing reconciliation, external reference updates, benchmark re-baseline, live-mode deferral, and pre-existing harness `intents` boundary
- [x] T002 Confirm target sk-code shape [small] — only `code-opencode`, `code-webflow`, `code-review`, and `code-quality` remain as routable sub-skills
- [x] T003 Inventory dissolved workflow-mode content [medium] — implement/debug/verify doctrine, verify scripts, and debugging/verification checklists were identified for preservation
- [x] T004 Inventory animation content [medium] — `code-animation/{references,assets}/*` was identified for folding into `code-webflow/{references,assets}/animation/*`
- [x] T005 Confirm deterministic benchmark gate [small] — router mode is the Lane-C CI gate; live-mode benchmark re-baseline remains out of scope

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [x] T006 Consolidate workflow doctrine [large] — generic implement, debug, and verify doctrine moved into `shared/references/workflow_{implement,debug,verify}.md`
- [x] T007 Add surface-local workflow symlinks [medium] — both `code-opencode/references/` and `code-webflow/references/` symlink the shared workflow doctrine

### sk-design Baseline
- [x] T008 Preserve verify scripts [medium] — `verify_alignment_drift.py` and `verify_stack_folders.py` are preserved under `code-opencode/assets/scripts/`
- [x] T009 Preserve debugging and verification checklists [medium] — `code-webflow/assets/webflow-{debugging,verification}_checklist.md` and `shared/references/universal-{debugging,verification}_checklist.md` remain available

### deep-loop Baseline
- [x] T010 Fold animation into Webflow [large] — `code-animation/{references,assets}/*` moved to `code-webflow/{references,assets}/animation/*` as non-skill resources
- [x] T011 Remove dissolved/folded sub-skills [medium] — `code-implement`, `code-debug`, `code-verify`, and `code-animation` folders are gone as sk-code sub-skills

### Comparison
- [x] T012 Reconcile parent routing [large] — `hub-router.json`, `mode-registry.json`, and `shared/references/smart_routing.md` reflect the four-sub-skill model with trimmed tie-break routing

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T013 Repoint external references [medium] — agents and specs/docs no longer route to dissolved sub-skills; code-review wiring in agents/review.md remains intact
- [x] T014 Restore verify Iron Law references [small] — shared verify doctrine carries the Iron Law and check-rule-copies plus external verify-script refs point to `code-opencode`
- [x] T015 Verify parent hub strict invariants [small] — parent-skill-check STRICT on sk-code exited 0 with all hard invariants passed and 0 warnings

### Severity Promotion
- [x] T016 Verify vocabulary sync [small] — parent-hub vocab-sync exited 0 with orphanAliases, aliasCollisions, ownershipDrift, untypedKeywords, and phantomTypedKeywords all empty
- [x] T017 Verify rule-copy canary [small] — check-rule-copies exited 0 with all rule invariants present across 4 exact-string files and 3 Iron Law files
- [x] T018 Verify router drift guard [small] — `sk-code-router-sync.vitest.ts` passed 4/4

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T019 Re-translate manual testing playbook gold [large] — 17 files updated from `code-animation/{references,assets}/*` to `code-webflow/{references,assets}/animation/*`, dissolved verify-mode scripts to `code-opencode/assets/scripts/*`, and one performance checklist reference to `shared/references/`
- [x] T020 Update benchmark harness expectations [medium] — surface-slice sync, code-surface path parse, and skill-benchmark routing vitests were repointed off dissolved modes and onto the two-axis model
- [x] T021 Regenerate router-final [medium] — deterministic router-final report regenerated with verdict CONDITIONAL and aggregate 71, holding the prior CONDITIONAL 71 requirement

### Optional Feature Catalogs
- [x] T022 [P] Live-mode benchmark report [medium] — DEFERRED; live mode needs configured provider access and is not required for the deterministic router-mode CI gate
- [x] T023 [P] Pre-existing harness `intents` boundary [small] — SCOPED DEVIATION; one dissolved-mode gold update was required to keep the suite green
- [x] T024 [P] Additional surface authoring rewrite [medium] — SKIPPED; spec scope was structural collapse, not a rewrite of each surface's teaching content

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T025 Verify full benchmark suite [medium] — full skill-benchmark vitest suite passed 107/107 across 8 files
- [x] T026 Verify markdown links [small] — check-markdown-links completed cleanly with 0 sk-code links flagged
- [x] T027 Record verification evidence in checklist.md [small] — every checklist item is checked with evidence grounded in the verified packet facts
- [x] T028 Record Files Changed and Deviations in implementation-summary.md [medium] — includes Stage A commit `2cd3b3f7a9`, Stage B commit `6c0d9959b9`, verification evidence, limitations, and scoped deviations

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] sk-code exposes exactly four routable sub-skills: `code-opencode`, `code-webflow`, `code-review`, and `code-quality`.
- [x] Dissolved-mode doctrine, verify scripts, checklists, and animation resources are preserved with no known content loss.
- [x] Routing metadata, external references, playbook gold, and benchmark harness expectations are reconciled to the two-axis model.
- [x] Deterministic router-final remains CONDITIONAL with aggregate 71, meeting the prior CONDITIONAL 71 requirement.
- [x] All recorded gates pass: parent-skill-check STRICT, vocab-sync, check-rule-copies, drift-guard, full benchmark suite, markdown links, and router-final.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
