---
title: "Goal: Phase 7: workflow-hygiene-on-off-control"
description: "The durable directive this packet executes against and the criteria that determine when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control"
    last_updated_at: "2026-10-23T13:55:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "003, 004, 005 and 006 have not landed"
      - "No fork is recorded for the switch probe"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-007-workflow-hygiene-on-off-control"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: workflow-hygiene-on-off-control

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every CI job a timeout sized from its own samples, give every workflow a least-privilege token scope with the Dependabot merge isolated behind a read-only metadata job, and give every job except Dependabot's two a repository-variable switch that a clone can set to `off`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | Every timeout value is the `final` cell of that job's row in `scratch/r24/timeouts.md`, computed with D6's floor; the 10-minute default is the recommended default `D6=10` (operator, 2026-10-23), and no value is copied from a sibling job or from this plan. |
| G2 | The passes run R25, then R24, then R26, so the job graph stops moving before anything is sized or gated. |
| G3 | A switch on a job that already has a condition is ANDed on with both sides parenthesised; the original expression survives as the last conjunct. |
| G4 | `dependabot-auto-merge.yml` is two jobs: `metadata` runs `dependabot/fetch-metadata` read-only, `auto-merge` holds both write scopes, runs only `gh pr merge`, and keeps the existing check name. |
| G5 | `SKILLED_CI_MESSAGES` exists on `message-contract.yml` and the README states it must stay unset while the ruleset requires that context. |
| G6 | No workflow comment, step name, job name or README sentence names an R-id, a D-id or a phase number. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -L 'permissions:' .github/workflows/*.yml` exits `1` with no output
- [ ] `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/dependabot-auto-merge.yml')); print(sorted(d['jobs']), d['permissions'])"` prints `['auto-merge', 'metadata'] {'contents': 'read'}`, and `grep -c 'contents: write' .github/workflows/dependabot-auto-merge.yml` returns `1`
- [ ] `python3 -c "import yaml,glob; d=[(f,j) for f in glob.glob('.github/workflows/*.yml') for j,v in yaml.safe_load(open(f))['jobs'].items() if 'timeout-minutes' not in v]; print('no-timeout', d)"` prints `no-timeout []`
- [ ] `grep -c "vars.SKILLED_CI != 'off'" .github/workflows/*.yml | awk -F: '{s+=$2} END {print s}'` returns `42` when `.github/workflows/hooks-node-tests.yml` is absent and `43` when it is present
- [ ] `grep -c '^### On/off switches$' .github/workflows/README.md` returns `1`, and `for v in SKILLED_CI SKILLED_CI_TESTS SKILLED_CI_REPORTS SKILLED_CI_REVIEW SKILLED_CI_FRESHNESS SKILLED_CI_MESSAGES; do grep -q "$v" .github/workflows/README.md || echo "missing: $v"; done` prints nothing
- [ ] `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r26-probe.md` holds two `run id: <n>` lines, one `off: skipped` line and one `unset: ran` line
- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control --strict` prints `RESULT: PASSED`
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
| Plan authored | Done | `spec.md` (REQ-001 to REQ-013), `plan.md` (L3 dependency graph, critical path, milestones and ADR index), `tasks.md` (T001 to T102), `acceptance-criteria.md` (AC-001 to AC-013), `decision-record.md` (ADR-001 to ADR-010) |
| D6 | Done | `D6=10` (operator, 2026-10-23) recorded in `scratch/decisions.md` |
| Permissions pass | Pending | Twelve workflow files still declare no `permissions:` block |
| Timeout pass | Pending | No sample is taken and no value is written |
| Switch pass | Pending | No job carries a `vars.SKILLED_CI` line |
| Probe | Pending | No fork is recorded |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
