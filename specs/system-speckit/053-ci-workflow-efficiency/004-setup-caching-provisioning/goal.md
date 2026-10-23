---
title: "Goal: Phase 4: setup-caching-provisioning"
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
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning"
    last_updated_at: "2026-10-23T13:35:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-004-setup-caching-provisioning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: setup-caching-provisioning

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Cut the repeated dependency installs in CI by measuring a cache, building one composite setup action, adopting it across the five provisioning sites and the multi-install workflows, and keeping the cold install path exercised.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The gate scan and the `description:` label land before any action file exists, and four fixture cases prove both. |
| G2 | The cache is an accelerator. `provision_worktree` runs on every path including a hit, and the save runs only on a miss after a successful provision. |
| G3 | The key globs every lockfile, the provision list, the provisioner and the Node major, and carries no `restore-keys`. |
| G4 | The cold path is a `cold` dispatch input plus a weekly schedule, and a scheduled run is always cold. |
| G5 | An install substitution is kept only when its warm install step is at least 10 s shorter than its 002 baseline. |
| G6 | The pip cache keys on the workflow file, because the repository holds no requirements file. |
| G7 | A sparse checkout cone names the `.skilled` targets, never the `.opencode` symlinks. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c 'github/actions' .github/scripts/check-gate-inputs.sh` returns `2` or more
- [ ] `bash .github/scripts/tests/check-gate-inputs.test.sh` prints `check-gate-inputs: 54 passed, 0 failed`
- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `files=46` and `RESULT: PASSED`
- [ ] `test ! -f .github/workflows/hooks-node-tests.yml` exits `0`
- [ ] `grep -cE '^(size_gb|restore_seconds|provision_seconds_cold|provision_seconds_warm|verdict)=' scratch/cache-probe/summary.md` returns `5`
- [ ] `grep -c 'bun@1.3.9' .github/workflows/opencode-dual-version.yml` returns `0`
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
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` 82 tasks: T001-T074 plus the lettered tasks T011A, T014A, T027A, T040A, T061A, T062A, T066A and T070G, `acceptance-criteria.md` AC-001 to AC-017, `decision-record.md` ADR-001 to ADR-011 |
| Operator decision D5 | Done | `scratch/decisions.md` records `D5=approve` |
| Baseline rows | Pending | `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` does not exist yet |
| Implementation | Pending | No file named by `tasks.md` has changed |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
