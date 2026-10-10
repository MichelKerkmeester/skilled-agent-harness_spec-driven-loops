---
title: "Goal: Phase 6: deep-loop-follow-ups"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups"
    last_updated_at: "2026-10-10T12:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-006-deep-loop-follow-ups"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: deep-loop-follow-ups

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the deep-review reducer read the numbered findings the deep-review agent writes without counting their evidence lines, and make the cli-pi environment filter pass PI_BLACKHOLE_PASSIVE to the child, with tests, aligned cli-pi docs and versioned changelogs.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A numbered finding gets the id `R<iteration>-<severity>-<NNN>`, the delta-row convention, and opens only on a line at the left margin |
| D2 | A numbered finding is used only for an iteration with no delta finding rows and no `findingDetails`; the `- **F###**:` path is unchanged |
| D3 | `PI_BLACKHOLE_PASSIVE` passes through an exact-key map for cli-pi only, never a prefix |
| D4 | Patch bumps: cli-pi 1.5.14.0 and the deep-loop runtime 1.9.3.0, each with a compact changelog entry; the runtime lib has no build output to regenerate |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node -e "const {parseIterationFile:p}=require('./.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs'); const r=p(process.argv[1]); console.log('findings=' + r.findings.length + ' ids=' + r.findings.map((f) => f.findingId).join(','))" specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups/scratch/fixtures/iteration-001.md` prints `findings=2 ids=R1-P1-001,R1-P2-001`
- [ ] `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/deep-review-state-reducer.vitest.ts tests/unit/deep-review-state-contract.vitest.ts tests/unit/deep-review-deltas-contract.vitest.ts tests/unit/deep-review-strategy-heading.vitest.ts tests/unit/deep-review-projections-contract.vitest.ts tests/unit/deep-review-reducers.vitest.ts tests/unit/verify-iteration.vitest.ts) 2>&1 | grep -E 'Test Files|Tests '` prints `Test Files  7 passed (7)` and `Tests  151 passed (151)`
- [ ] `(cd .skilled/skills/system-deep-loop/runtime && node --import tsx -e "import('./lib/deep-loop/executor-audit.ts').then((m) => console.log(JSON.stringify(m.buildExecutorDispatchEnv({ kind: 'cli-pi' }, { PATH: '/usr/bin', PI_BLACKHOLE_PASSIVE: 'true', UNLISTED_PROBE_VAR: 'x' }))))")` prints `{"PATH":"/usr/bin","PI_BLACKHOLE_PASSIVE":"true","SPECKIT_CLI_DISPATCH_STACK":"cli-pi"}`
- [ ] `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-process-group.vitest.ts tests/executor-audit-receipts.test.ts tests/executor-audit-cli-branch-receipts.test.ts && npm run typecheck) 2>&1 | grep -E 'Test Files|Tests |error TS'` prints `Test Files  4 passed (4)` and `Tests  62 passed (62)` and no `error TS` line
- [ ] `grep -c 'cli-pi environment filter passes this one variable through' .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` prints `1`, `grep -c '^version: 1.5.14.0$' .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` prints `1`, and `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `VALID` with `Total issues: 0` for `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.14.0.md` and for `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.3.0.md`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups --strict` prints `RESULT: PASSED`
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
| Numbered fixture reduces to two findings with delta-row ids | Done | `parseIterationFile` on scratch/fixtures/iteration-001.md prints `findings=2 ids=R1-P1-001,R1-P2-001`; the pre-planning reducer prints `findings=0 ids=` |
| Seven reducer test files pass 151 tests | Done | `Test Files  7 passed (7)`, `Tests  151 passed (151)` |
| cli-pi dispatch env carries PI_BLACKHOLE_PASSIVE | Done | `{"PATH":"/usr/bin","PI_BLACKHOLE_PASSIVE":"true","SPECKIT_CLI_DISPATCH_STACK":"cli-pi"}`; the git HEAD copy drops it |
| Executor suites pass 62 tests and the type check is clean | Done | `Test Files  4 passed (4)`, `Tests  62 passed (62)`, typecheck exit 0, no `error TS` |
| cli-pi gotcha, version and both changelogs in place and valid | Done | gotcha grep 1, version grep 1, both changelogs `VALID` / `Total issues: 0`. The Hermes copy of cli-pi is pending-orchestrator |
| Folder validates strict | Done | `RESULT: PASSED` (see implementation-summary.md) |

### Deviations and findings

| Item | Note |
|------|------|
| Review result | No defect found; scratch/fix-units.json is `[]` |
| Pending-orchestrator | Hermes generator (7 skill copies drift, including cli-pi and deep-review), compiled-route re-mint (`cli-external-orchestration stale-manifest`), deep-review contract re-mint (`check-contract-drift.cjs` exit 2, `STALE_SOURCE_DIGEST`). None is a criterion of this goal |
| Phase 1 baselines | The builder captured no before-state files; the planner's values in plan.md section 5 and git HEAD copies (scratch/before, scratch/probe/ea-head) stood in; both folders held base-commit source copies and were moved out of the packet before commit |
<!-- /ANCHOR:log -->
