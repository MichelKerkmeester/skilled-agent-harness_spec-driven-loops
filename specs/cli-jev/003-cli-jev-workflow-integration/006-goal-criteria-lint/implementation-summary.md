---
title: "Implementation Summary: Goal-Criteria Lint (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe a zero-call lexical lint for sk-create-goal rules 4 and 5, scored against operator labels under a rubric the operator has not yet adopted, and no result exists."
trigger_phrases:
  - "goal criteria lint summary"
  - "lint-goal-criteria status"
  - "goal criteria lint planned"
  - "goal criteria lint results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint"
    last_updated_at: "2026-09-27T05:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the planning documents"
    next_safe_action: "Operator adopts the rubric, then write the lint"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which rubric does the operator adopt for rules 4 and 5"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Goal-Criteria Lint (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-goal-criteria-lint |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no script, label or measurement exists for it.

### Phase 6: goal-criteria-lint

The plan is an advisory lint, `lint-goal-criteria.cjs`, beside `check-goal.cjs` in `sk-create-goal`. It flags criteria that break rule 4 (self-contained) or rule 5 (checkable without opening another file), makes zero Jev calls and always exits 0. A scorer, `score-goal-lint.cjs`, then measures the lint against about 100 criterion lines the operator labels under a rubric they adopt first. `check-goal.cjs` stays unchanged. A Jev arm is built only if the labeled violation rate is at least 0.05. See `spec.md` for the requirements and the rubric candidates, and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Authored | Planning documents for this phase. No code file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written from recommendation R20 and proposed phase 006 in `../004-deep-research-expansion/research/research.md`, with the key gate from the parent goal's decision D5.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A separate lint instead of a new `check-goal.cjs` check | `check-goal.cjs` is a completion gate with frozen exit codes. An advisory lint inside it would move `RESULT: PASSED` for every goal |
| The rubric before any label, chosen by the operator | The recorded base rates run from 1.5% to 79.5% because they measure different failure definitions. A label means nothing until one definition is written down |
| Zero calls in the first slice | The lexical lint is the build-nothing competitor. A Jev arm has to beat it by a measured F1 gain, and no arm is built below the 5% stop line |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build and measurement | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder at authoring time. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No rubric is adopted.** Labeling cannot start until the operator records one in `spec.md`, which is task T001.
2. **No numbers exist yet.** The violation rate, per-rule precision and recall and the stop decision are all UNKNOWN until the labels and one scorer run.
3. **Coverage is partial by design.** The lint reaches goals authored through `/create:goal`. Native `/goal` strings, direct edits and `/goal-opencode set` bypass it.
<!-- /ANCHOR:limitations -->

---
