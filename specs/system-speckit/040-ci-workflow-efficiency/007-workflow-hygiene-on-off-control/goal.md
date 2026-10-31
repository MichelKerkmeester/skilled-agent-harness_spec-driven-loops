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
    last_updated_at: "2026-10-25T21:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase closed: 0 timeout kills in 690 runs, 13 of 13 criteria met"
    next_safe_action: "None, phase complete"
    blockers: []
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
    completion_pct: 100
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
| Permissions pass | Done | `4b7d3d8941`: every workflow declares `permissions:` (AC-001) |
| Dependabot split | Done | `b1315701ca`: a read-only `metadata` job and a write-scoped `auto-merge` job (AC-002, on the operator's ruling of 2026-10-25) |
| Timeout pass | Done | `8ff7da700d`: all 44 jobs carry a timeout sized from their own samples (AC-003, AC-004) |
| Switch pass | Done | `9480d99e6d` and `03abdb20d8`: 42 jobs carry the switch and the README documents it (AC-005 to AC-007) |
| Probe | Done | Runs 40150455358 (`off: skipped`) and 40150476111 (`unset: ran`) on a throwaway probe repository (AC-008) |
| Timeout-kill read | Done | `timeout kills: 0` over the 690 runs from 2026-10-25T00:43Z to 21:30Z (`scratch/phase-result.md`) |
| Final gates and closure | Done | T101's gates passed and T102 committed the closure; 13 of 13 acceptance rows `Met` |

### Deviations and findings

| Item | Note |
|------|------|
| Kill-read window, 2026-10-25 | The read covers 20.8 hours, not 24, because the operator asked not to wait for the full window. None of the repository's own schedules falls in the hours left out: the daily schedule ran inside the window, and both weekly schedules fire after it. Separately, the one scheduled run after 21:30Z, the one-shot plugin-test run 40236652343 the setup caching phase fired at 21:41Z, finished `success` in 251 s against its 10-minute timeout, with no kill message in its log. |
| Kill-read listing | `gh run list --limit 300` covers only the newest 3.5 to 5 hours at today's rate, so the read lists the window by creation date in three-hour chunks. |
| AC-011 path check | Other work reached `main` after the phase start, so the whole-range path list holds 5,488 paths. The check reads the phase's own nine commits, which stay inside the three roots except a consumer test and the parent's derived metadata. |
| ADR-010 | The permissions and Dependabot records landed after their commits, in `b03d3bd1c6`. |
| Probe repository | GitHub does not let an account fork its own repository, so a throwaway repository with the same workflows stood in for the fork. Its `off` run concluded `skipped`, not `success`, with its job `skipped`. |
<!-- /ANCHOR:log -->
