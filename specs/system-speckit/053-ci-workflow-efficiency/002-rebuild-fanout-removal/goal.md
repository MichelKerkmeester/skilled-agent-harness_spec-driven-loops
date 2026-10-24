---
title: "Goal: Phase 2: rebuild-fanout-removal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal"
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "T015 now has three qualifying zero-run rebuild SHAs and a fourth additional SHA"
    next_safe_action: "Remaining 002 work: T019's 24 h baseline, then T020/T021 closure"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-002-rebuild-fanout-removal"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: rebuild-fanout-removal

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the CI fan-out that follows every trigger-index rebuild commit, so a pushed rebuild starts no workflow run, and keep that behaviour guarded by the rebuild workflow's own test suite.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The skip is the `[skip ci]` token on the commit body line, the recommended default operator answered D1=A on 2026-10-23. Option B's 104 path-filter entries are not built. |
| G2 | `Trigger-Index-Rebuild: ci` stays the message's last line, so the loop guard's suffix match keeps working. |
| G3 | The assertion lives in `trigger-index-rebuild-workflow.vitest.ts`, and its negative proof uses that suite's `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH` override. |
| G4 | The token, its case, both `spec-kit-check.yml` entries and both README rows land as one commit. |
| G5 | The baseline is a fresh 24 h snapshot, not a scaled shorter window. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -c 'rebuilt it\. \[skip ci\]"' .github/workflows/trigger-index-rebuild.yml` returns `1`
- [x] `grep -c 'trigger-index-rebuild\.yml' .github/workflows/spec-kit-check.yml` returns `2`
- [x] The workflow suite run from `.skilled/skills/system-spec-kit/runtime/cli` exits `0`
- [ ] The same suite with `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH=/tmp/trigger-index-rebuild.no-token.yml` exits non-zero
- [x] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`
- [x] `gh run list --commit <sha>` returns `[]` for each of three post-change rebuild SHAs
- [ ] `scratch/baseline-24h/summary.md` exists and records a total in 1,700-1,850 runner-min/day
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` T001 to T021, `acceptance-criteria.md` AC-001 to AC-007, `decision-record.md` ADR-001 to ADR-005 |
| Decision D1 | Done | `scratch/d1-answer.md` records `D1=A` |
| Implementation | Done except closure work | `8e62a3d096` landed token, comment, case, both filter entries and both README rows; spec-kit-check run 40018919244 `success`; PR #71 run 40021934338 `success` |
| Post-change rebuilds | 3 of 3 (plus a fourth) | `08bd79a68a`, `27490113c2` and `c9d4deed31` each `[]`; `c7c5bfb51b` is a fourth and also `[]` (`scratch/post-change/`) |
| Negative proof | Pending | T012's token-stripped suite run not re-executed under the read-only pass |
| 24 h baseline | Pending | `scratch/baseline-24h/summary.md` waits on the post-merge window (T019) |

### Deviations and findings

| Item | Note |
|------|------|
| T006 wording | Delivered `README.md:58` sentence describes the guard as fallback, more accurate than the tasked text; accepted 2026-10-24 |
| T018 branch name | Probe used `branches/018-probe-rebuild-workflow-trigger` (PR #71), not `probe/rebuild-workflow-trigger`; accepted 2026-10-24 |
| Unasked comment rewrite | `8e62a3d096` rewrote the job-level loop-guard comment beyond T005's scope; content accurate, accepted 2026-10-24 |
| Anchor drift | Token is at `:151` and the T005 anchor moved `:147`→`:149`; tasks, spec, summary and AC-001 updated 2026-10-24 |
<!-- /ANCHOR:log -->
