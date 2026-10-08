---
title: "Goal: Phase 7: ci-rule-set-comparison"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison"
    last_updated_at: "2026-10-08T12:24:18Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified on local evidence"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".github/workflows/changed-packet-validation.yml"
      - ".github/workflows/strict-pass-freshness-report.yml"
      - ".github/workflows/README.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: ci-rule-set-comparison

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Compare failing rule sets instead of verdicts in the changed-packet PR gate and pass the previous sweep artifact as a baseline to the weekly gate so regressions are detected accurately.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | When no baseline artifact exists on the first run of the weekly sweep, proceed without error and report all failures as the baseline for the next run |
| D2 | Built in wave 2 by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D3 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D4 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] A test packet that fails different rule sets at base and head is reported as a regression in the PR gate
- [x] The weekly sweep receives `--baseline` from a previous artifact and compares with it
- [x] The PR gate output lists the failing rules by name for troubleshooting
- [x] The first run of the weekly sweep handles missing baseline gracefully and reports all failures
- [x] The rule set comparison logic passes with multiple test scenarios (pass-to-fail, fail-to-fail-different-rules, baseline-present, baseline-absent), each with expected outcomes recorded in implementation-summary.md
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
| Planning complete | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all validated --strict before the build |
| PR gate compares rule sets | Done | `failing_rules()` and `comm -23` in `.github/workflows/changed-packet-validation.yml`; a packet fails the gate only for head rules the base did not fail, and the error line names them |
| Weekly sweep baseline | Done | New fetch step and `--baseline` wiring in `.github/workflows/strict-pass-freshness-report.yml`, plus `actions: read`; the sweep script is unchanged |
| First run and unreadable baseline | Done | Three no-baseline paths print a notice, exit 0 and set no variable; the sweep then reports `first-run` |
| Workflow README | Done | Four rows updated in `.github/workflows/README.md` |
| Tests | Done | `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts`, 11 passed (5 gate, 3 sweep, 3 fetch), rerun at close; 5 gate tests failed against the pre-change workflow |
| Cross-family review | Done | Luna round 1 stopped on the AC-006 wording, corrected; round 2 one P1, fixed with 007-F1 and 007-F2 |
| Whole-tree gates | Done | cli test exit 0 with 167 files and 1682 tests passed (baseline 161 and 1639), `run check` and typecheck exit 0, hook tests 184 run, 0 fail |
| Validate changes | Done | `validate.sh --strict` on this folder prints `RESULT: PASSED`, `check-goal.cjs` passes |
| Run on GitHub | Not started | Nothing is pushed. The first run shows the real `gh` calls, the `$GITHUB_ENV` handoff and the sweep step on the runner's bash |

### Deviations and findings

| Item | Note |
|------|------|
| AC-006 wording | The criterion said packets that "passed before" report as `known-failure` when they still fail. That contradicts the sweep script, where a pass that now fails is a `regression` and a failure that still fails is a `known-failure`. It was an authoring error; Luna's round 1 stopped on it and the orchestrator corrected it to "failed before" |
| Local tests instead of a test PR and a dispatched sweep | Nothing is pushed, so the PR-gate and sweep scenarios ran as 11 tests over the workflows' own run blocks with a stub validator and a stub `gh`, plus the real sweep script. Criteria 1 to 5 are met on that evidence |
| Download mechanism | plan.md named `actions/download-artifact@v4` with a `run-id` and a fine-grained token. The build uses `gh run download` with the job token and `actions: read`; plan.md was updated |
| No README examples | The README describes each workflow in one table row, so the four rows carry the behavior and no example block was added |
| Rule counts versus status | The plan and SC-002 speak of rule counts. The unchanged sweep script compares each folder's status with the baseline, so the observable result is `known-failure` rows and zero regressions |
| First-run path on bash 3.2 | With no baseline, the sweep step's empty `baseline_args` array under `set -u` stops with `unbound variable` on the host's bash 3.2.57. The runner's bash 5 is expected to pass; only a run on GitHub confirms it. The workflow was not changed |
| Host adaptations in the gate tests | On macOS the test rewrites the run block's associative array to plain variables and shims `paste`; the Linux runner needs neither |
| Test file beyond the three listed | Allowed by decision D4 |
<!-- /ANCHOR:log -->
