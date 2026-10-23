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
    last_updated_at: "2026-10-23T10:42:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-002-rebuild-fanout-removal"
      parent_session_id: null
    completion_pct: 0
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
| G1 | The skip is the `[skip ci]` token on the commit body line, the recommended default pending operator D1. Option B's 104 path-filter entries are not built. |
| G2 | `Trigger-Index-Rebuild: ci` stays the message's last line, so the loop guard's suffix match keeps working. |
| G3 | The assertion lives in `trigger-index-rebuild-workflow.vitest.ts`, and its negative proof uses that suite's `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH` override. |
| G4 | The token, its case, both `spec-kit-check.yml` entries and both README rows land as one commit. |
| G5 | The baseline is a fresh 24 h snapshot, not a scaled shorter window. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c 'rebuilt it\. \[skip ci\]"' .github/workflows/trigger-index-rebuild.yml` returns `1`
- [ ] `grep -c 'trigger-index-rebuild\.yml' .github/workflows/spec-kit-check.yml` returns `2`
- [ ] The workflow suite run from `.skilled/skills/system-spec-kit/runtime/cli` exits `0`
- [ ] The same suite with `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH=/tmp/trigger-index-rebuild.no-token.yml` exits non-zero
- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`
- [ ] `gh run list --commit <sha>` returns `[]` for each of three post-change rebuild SHAs
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
| Decision D1 | Pending | `scratch/d1-answer.md` is not written |
| Implementation | Pending | No file named by `tasks.md` has changed |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
