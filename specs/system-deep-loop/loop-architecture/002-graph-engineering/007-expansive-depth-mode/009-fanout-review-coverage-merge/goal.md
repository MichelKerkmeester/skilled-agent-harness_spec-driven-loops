---
title: "Goal: Carry the review coverage surfaces through the fan-out merge (D12)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fanout review coverage merge goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-fanout-review-coverage-merge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Carry the review coverage surfaces through the fan-out merge (D12)

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Give a merged fan-out review registry the coverage data its lineages already produced, so later guards can read it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The merge rules are the ones in `plan.md` section 3: union for coverage, strongest restriction for traceability status, per-lineage pivot state. |
| D2 | This slice adds data only; the guard that blocks on coverage gaps ships with Slice K. |
| D3 | This slice does not merge `frontier`. Slice K delivers the merged `frontier`, its `frontier.stats` and the fan-out partition itself, because no review frontier shape exists before it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-merge.vitest.ts tests/fanout-review-focus.vitest.ts` exits 0 with the new per-surface, order-swap and missing-fields cases.
- [x] `rg -c` over `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` prints a count above 0 for each of `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergence` and `ruledOutCandidates`.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-merge.vitest.ts tests/unit/fanout-merge-latest-record.vitest.ts tests/unit/fanout-merge-structured-missing.vitest.ts tests/unit/fanout-merge-reducer-provenance.vitest.ts tests/fanout-review-focus.vitest.ts` exits 0, with a pass count equal to the baseline in this goal's log plus the new cases.
- [x] This goal's log records each of the seven files that `rg -l 'deep-review-findings-registry\.json' .skilled/skills/system-deep-loop --glob '*.cjs' --glob '*.ts' --glob '!**/tests/**'` lists, marked safe or changed.
- [ ] `rg -l 'dimensionCoverage' .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout` lists a merged-coverage scenario written through `/create:manual-testing-playbook`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored | Done | `spec.md`, `plan.md`, `tasks.md` |
| Baseline (T001) | Done | 2026-11-17, worktree `460-ed-009-fanout-review-coverage` at `21c4b325b5a`: the five REQ-004 suites, 5 files, **92 passed**, exit 0 |
| Readers (T002) | Done | `rg -l 'deep-review-findings-registry\.json' ... --glob '!**/tests/**'` lists the seven files. `fanout-merge.cjs`: **changed** (the merge itself). `divergent-review-pivot.ts`: **safe**, reads `dimensionCoverage` and `traceability.results` behind `isRecord` and array guards, and the merged surfaces keep the lineage shapes. `reduce-state.cjs`: **safe**, it is the per-lineage producer of the file and reads none of the merged-only keys. `score-fanout-pairs.cjs` and `fanout-run.cjs`: **safe**, they list the file name as a lineage artifact and read none of the six surfaces. `deep-review-projections-contract.ts` and `legacy-projection-manifest.ts`: **safe**, path declarations only |
| Final suites | Done | The five REQ-004 suites: 5 files, **102 passed** (92 + 10 new), exit 0 |
| Implementation | Done | Six merge helpers plus `mergeReviewCoverageSurfaces` in `fanout-merge.cjs`, spread into the merged registry. Nine `fanout-merge.vitest.ts` cases (seven failed before the merge was wired) and one end-to-end case in `fanout-review-focus.vitest.ts` |
| Playbook scenario (T013) | Blocked | `/create:manual-testing-playbook` hard-blocks at Phase 0 unless run as `@markdown`; the phase worker cannot start that agent |

### Deviations and findings

| Item | Note |
|------|------|
| Plan review 2026-11-17 | `../scratch/fable-5-2-plan-review.md` F009-1, X-3 and X-7 applied: readers found by file name, the 011 deliveries recorded as 011's own, test commands in the `npx vitest run` form, a playbook task added. No X-1 or X-2 task: no digest source or agent changes. |
| Task grouping | T003-T008 shipped as one helper dispatch plus one wiring dispatch, after the tests (T010) went in first, instead of six per-surface dispatches. Each surface still has its own named case. |
| Changelog | Added T014 from the cross-phase handoff §3 (an operator-visible defect fix). Blocked by the same `@markdown` gate. |
| Pivot state key | The merged registry carries `divergenceByLineage`, not `divergence`, because merging lineage-local pivot state into one object would invent a focus no lineage chose. |
<!-- /ANCHOR:log -->
