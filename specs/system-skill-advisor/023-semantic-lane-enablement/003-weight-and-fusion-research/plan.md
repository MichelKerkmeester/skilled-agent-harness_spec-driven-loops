---
title: "Implementation Plan: Phase 3: weight-and-fusion-research"
description: "The draft research design this phase turns into research/research-plan.md: six questions, fourteen iterations with no early stop, two executors, and a regime that separates real vectors from fixtures."
trigger_phrases:
  - "research design"
  - "deep research dispatch"
  - "weight sweep points"
  - "measurement regime"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/003-weight-and-fusion-research"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the implementation plan carrying the draft research design"
    next_safe_action: "Write research/research-plan.md from this design once phases 001 and 002 land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-003-weight-and-fusion-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: weight-and-fusion-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, plus the deep-research loop for the eventual run |
| **Framework** | `/deep:research`, which owns its own state, deltas and logs |
| **Storage** | This phase folder. The loop writes its state under the bound spec folder |
| **Testing** | The frozen corpora and the accuracy ratchet, used as measurement rather than as a gate here |

### Overview

Turn the weight question into six questions that each end in a number. The lane weight is
overridable through an environment variable that the registry already reads and clamps per lane,
so every sweep point is a process restart rather than a code edit. That makes the sweep cheap and
makes each point reversible, which is why the sweep comes before any committed default.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 reports full coverage, verified by a count query rather than by a run report
- [ ] Phase 001 recorded whether any run scores real vectors
- [ ] Each executor named below was re-checked against its own skill document

### Definition of Done
- [ ] `research/research-plan.md` exists and every question names its artifact and its closing number
- [ ] The dispatch command is written out in full, including the iteration count and the stop policy
- [ ] No file outside this phase folder changed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A bounded research loop over a reversible configuration, with every point re-scored against
frozen corpora.

### Key Components

- **The six questions**, listed below, each with one artifact.
- **The sweep mechanism**: `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, read by the lane registry at load, merged over the defaults, clamped to the range zero through one per lane, and ignored when it fails to parse.
- **The two ranking paths**: the fused score, and an exact-semantic rerank that only applies when two candidates sit inside a narrow score window.
- **The regression set**: the 444 declared signals, the 180 realistic rows, the 224 out-of-scope controls, and the abstain counts the accuracy baseline records.

### The questions

| ID | Question | Artifact | Closes when |
|----|----------|----------|-------------|
| Q1 | What do weights 0.05, 0.10, 0.15, 0.20 and 0.30 do to the four accuracy metrics and to Gate B, with the other four lanes held in their current ratio? | A five-row table, one row per point | Every point carries all five numbers |
| Q2 | Is any second gate still suppressing the lane, given the registry already marks it live? | A trace from one prompt showing the lane's raw score and its weighted contribution | The contribution is shown non-zero, or the suppressor is named |
| Q3 | Which moves Gate B further: full coverage at weight 0.05, or weight 0.30 at the old coverage? | Two measured points against the same 180 rows | Both points are measured and compared |
| Q4 | Does a weight change move rank through the fused score or through the rerank window? | A per-row attribution over the rows whose rank changed | Every changed row is attributed to one path |
| Q5 | Does more semantic signal make the advisor fire where it should abstain? | The 224 controls plus the abstain counts, at each sweep point | No point raises the abstain failures above the recorded baseline |
| Q6 | Which run can score real vectors, given the committed baseline runs on fixtures? | A named run, or a written statement that one must be built and what it costs | The answer names a file or names the gap |

### Dispatch

```
/deep:research:auto "advisor semantic lane weight and fusion behaviour" \
  --spec-folder=specs/system-skill-advisor/023-semantic-lane-enablement/003-weight-and-fusion-research \
  --max-iterations=14 --stop-policy=max-iterations --convergence-mode=off \
  --executors='[{"type":"cli-codex","model":"gpt-5.6-sol","reasoning-effort":"high","iters":9},
                {"type":"cli-devin","model":"glm-5.2","reasoning-effort":"high","iters":5}]' \
  --concurrency=2
```

Fourteen iterations, split nine and five across two executors, with convergence reported and
never allowed to stop the loop. Two executors rather than one, because a single model agreeing
with itself across fourteen iterations is not evidence. The exact model strings are re-checked
against each executor's own skill document immediately before dispatch, which is REQ-006.

### Data Flow

Each sweep point sets the weight override, restarts the daemon, re-scores the frozen corpora,
and writes its numbers. The research loop reads those numbers and argues over them rather than
generating them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/scorer/lane-registry.ts` | Reads the weight override and clamps it | not a consumer of this phase, read only | No diff in this phase |
| `lib/scorer/fusion.ts` | Normalizes over live lanes and applies the rerank window | not a consumer of this phase, read only | No diff in this phase |
| `research/research-plan.md` | The deliverable | create | The file exists and answers REQ-001 through REQ-005 |
| `research/measurement-regime.md` | Says which numbers come from real vectors | create | The file names the flag that substitutes fixtures |

Required inventories:
- Same-class producers: `rg -n 'LANE_WEIGHTS_JSON|resolveLaneWeightsOverride' .opencode/skills/system-skill-advisor/mcp-server --glob '*.ts'`.
- Consumers of changed symbols: none. This phase changes no symbol.
- Matrix axes: weight point, coverage state, vector regime. Five by two by two, and the plan says which cells are worth running.
- Algorithm invariant: a sweep point is only comparable to another point when the corpus hashes and the coverage count both match. A point that cannot show both is discarded.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. This phase writes documents | N/A |
| Integration | A dry run of the dispatch command, which halts before it writes state | The deep-research loop with its preview flag |
| Manual | A reader follows the plan and reports whether any step needed a question answered | A second person, or a fresh session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 coverage | Internal | Yellow | A sweep against partial coverage measures the gap rather than the weight |
| Phase 001 regime answer | Internal | Yellow | Without it, Q6 has no starting point |
| Executor availability | External | Yellow | A missing model stops dispatch, which is why the roster is re-checked first |
| The frozen corpora | Internal | Green | Without them no two sweep points are comparable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The plan is found to depend on a measurement that cannot be produced.
- **Procedure**: Mark the affected question superseded in the acceptance criteria, record why in the phase log, and re-scope the question rather than deleting it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001 baseline ──┐
               ├──► 003 plan authored ──► 004 applies the answer
002 coverage ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001, 002 | Draft |
| Draft | Setup | Review |
| Review | Draft | 004 |
| Verify | Review | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Medium | Two to four hours of authoring |
| Verification | Low | An hour, mostly the dry run |
| **Total** | | **Three to six hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No weight override is set in the current shell
- [ ] The dry run halts before writing state
- [ ] The plan names no model without checking its executor document first

### Rollback Procedure
1. Delete the drafted plan documents, since nothing else changed
2. Record in the phase log which question could not be specified and why
3. Re-scope that question rather than dropping it, so phase 004 knows what stayed unanswered
4. Leave the acceptance criteria row `Unmet` rather than marking it waived without a decision record

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase writes two documents and changes nothing else
<!-- /ANCHOR:enhanced-rollback -->

---
