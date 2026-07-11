---
title: "Task Breakdown: Stage-aware Lane C skill-benchmark scorer"
description: "Phased tasks to wire the consume side of benchmark scenario stages under a score-preserving invariant."
trigger_phrases:
  - "tasks"
  - "stage aware scorer"
  - "holdout"
  - "skill benchmark"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/061-stage-aware-scorer"
    last_updated_at: "2026-07-11T21:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level 2 task list"
    next_safe_action: "Phase 1 — loader stage wiring"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/061-stage-aware-scorer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Stage-aware Lane C skill-benchmark scorer

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold spec folder `061-stage-aware-scorer` (Level 2, `--track system-deep-loop --skip-branch`) - [evidence: 6 docs written under `.opencode/specs/system-deep-loop/061-stage-aware-scorer/`]
- [x] T002 Ground-truth read of loader/scorer/report/generator + the vitest harness; confirm the summary hypotheses against real source - [evidence: `load-playbook-scenarios.cjs:341` hardcoded-false + `score-skill-benchmark.cjs:1337` all-rows aggregate confirmed]
- [x] T003 Capture the pristine Mode-A router-replay baseline across every playbook corpus (the frozen before) - [evidence: `rebaseline/baseline.jsonl` — 33/35 corpora produced reports, 25 scored]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Loader sk-doc path: `negativeActivation = stage === 'negative'` (`load-playbook-scenarios.cjs`)
- [ ] T005 Loader sk-code path: emit `stage: negativeActivation ? 'negative' : 'routing'`
- [ ] T006 Scorer: `scoreScenario` attaches `row.stage` (default `routing` when no scenario supplied)
- [ ] T007 Scorer: `aggregate()` fitted/holdout split — `aggregateScore` over non-holdout rows, `holdoutScore` over holdout rows, `generalizationGap = fitted − holdout`
- [ ] T008 Scorer: `coverage` gains `holdout` + `negative` counts; add a `generalization` report block
- [ ] T009 [P] Report: `build-report.cjs` stage column + generalization/circularity section
- [ ] T010 [P] Generator: thread per-spec `stage` through to `renderScenarioMarkdown`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Add stage-aware unit tests (`row.stage`, fitted/holdout/gap math, coverage buckets) to `tests/skill-benchmark.vitest.ts`
- [ ] T012 Add the adversarial staged-fixture proof (holdout excluded from fitted, gap computed, `stage: negative` inverts) + a score-preserving unit assertion
- [ ] T013 Run `skill-benchmark.vitest.ts` green; record pass count
- [ ] T014 Re-baseline: re-run Mode-A across every corpus; diff fitted `aggregateScore` vs the T003 baseline — must be 0 deltas
- [ ] T015 `validate.sh 061-stage-aware-scorer --strict` clean; write `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Suite green + re-baseline 0 deltas + adversarial staged-fixture proof passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md` (ADR-001 — stage split semantics + score-preserving invariant)
<!-- /ANCHOR:cross-refs -->
