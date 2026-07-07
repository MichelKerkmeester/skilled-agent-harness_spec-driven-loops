---
title: "Tasks: deep-context loop"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-context tasks"
  - "context loop tasks"
  - "tasks"
  - "name"
  - "template"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/001-context-loop-foundation"
    last_updated_at: "2026-06-06T19:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added Phase 4 tasks: alignment, catalog/playbook, Barter"
    next_safe_action: "3 sonnet agents align skill, build catalog/playbook, integrate Barter"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:1aecb6c05c8afddbea2821d951fa97eec42d3241a133b2c0cd0c60677edc6667"
      session_id: "dc-134-20260606"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Heterogeneous smoke run on a real target (T013)"
      - "Barter speckit optional add-on wiring (T021)"
    answered_questions:
      - "Coverage-graph context layer complete and tested"
---
# Tasks: deep-context loop

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Author ownership ADR registering deep-context as 3rd runtime consumer (decision-record.md)
- [x] T002 Confirm reuse map: 10 runtime libs as-is, 3 coverage-graph modules + convergence.cjs to extend
- [x] T003 [P] Confirm Code Graph readiness for frontier seeding
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `'context'` to LoopType/VALID_KINDS/VALID_RELATIONS + CHECK + SCHEMA_VERSION 2 to 3; ContextNodeKind/ContextRelation/CONTEXT_WEIGHTS (.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts)
- [x] T005 Add computeContextSignals/computeContextSignalsFromData with the five context signals (.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts)
- [x] T006 Add context gap branch (.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts)
- [x] T007 Add evaluateContext: 0.10 threshold, agreementRate guard (min 2 executors), relevanceFloor guard (0.55) (.opencode/skills/deep-loop-runtime/scripts/convergence.cjs)
- [x] T008 [P] Add promptFramework lineage field (`n` key) for per-model framing (.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts)
- [x] T009 [P] Wire native-parallel via dispatchCouncilSeats concurrent with the CLI pool (.opencode/skills/deep-loop-runtime/lib/council/multi-seat-dispatch.cjs)
- [x] T010 [P] Author deep-context skill: SKILL.md (DQI 88), references, assets, reduce-state.cjs (.opencode/skills/deep-context/**)
- [x] T011 [P] Author /deep:start-context-loop command + auto/confirm YAML (.opencode/commands/deep/start-context-loop.md)
- [x] T012 [P] Author @deep-context LEAF read-only analyzer agent (.opencode/agents/deep-context.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013a Run coverage-graph vitest suite (99/99 pass; signal unit math confirmed)
- [x] T013b Run executor-config vitest suite (36/36 pass)
- [x] T013c Run e2e convergence smoke (green)
- [ ] T013 Run a heterogeneous smoke run on a real target producing a code-graph-verified Context Report
- [ ] T014 Run validate.sh --strict on the spec folder and reconcile completion metadata across docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Alignment, Catalog/Playbook & Barter Integration

### P1: Align skill to sk-doc + sk-code :opencode conventions

- [ ] T015 Add the smart-router section to the deep-context SKILL.md to match the sk-doc skill layout (.opencode/skills/deep-context/SKILL.md)
- [ ] T016 [P] Add sk-doc frontmatter to every references/ and assets/ markdown file; author skill-root README.md and scripts/README.md (.opencode/skills/deep-context/{references,assets,README.md,scripts/README.md})
- [ ] T017 [P] Align reduce-state.cjs file header and the skill config to sk-code :opencode conventions (.opencode/skills/deep-context/scripts/reduce-state.cjs)

### P2: Catalog + Playbook packages

- [ ] T018 [P] Author the feature_catalog package mirroring the sibling deep skills' catalog package (.opencode/skills/deep-context/**)
- [ ] T019 [P] Author the manual_testing_playbook package mirroring the sibling deep skills' playbook package (.opencode/skills/deep-context/**)

### P3: Barter integration

- [ ] T020 [P] Refresh Barter's @deep-context agent and /deep:start-context-loop command to match the finalized Public versions (Barter .opencode/agents + .opencode/commands)
- [ ] T021 Wire deep-context as an AI-offered optional add-on step into Barter's /speckit:complete and /speckit:plan (Barter .opencode/commands/speckit)

### P4: Sync + verification

- [ ] T022 Sync the finalized Public deep-context skill and deep-loop-runtime runtime into Barter (Barter .opencode/skills)
- [ ] T023 Verify: deep-loop-runtime vitest 544/544; node --check on reduce-state.cjs; config parseable; packet validate PASSED; Barter runtime accepts loop_type=context; Barter speckit commands contain the optional deep-context step
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Coverage-graph + executor-config tests + e2e convergence smoke pass
- [ ] Phase 4 alignment + catalog/playbook + Barter integration complete (T015-T023)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
- **Design Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 3 task breakdown - phased, with reuse-onto-runtime tasks
3 phases: Setup (ADR + reuse map), Implementation (graph + convergence + skill), Verification
-->
