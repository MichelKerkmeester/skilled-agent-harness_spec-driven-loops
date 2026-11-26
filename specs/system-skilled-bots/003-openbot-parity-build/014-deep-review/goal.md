---
title: "Goal: Phase 14: deep-review"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/014-deep-review"
    last_updated_at: "2026-11-25T20:03:16Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-014-deep-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 14: deep-review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the OpenBot parity build on a reviewed surface rather than thirteen separately validated ones, by running one expanded deep review over the code and docs phases 001 to 013 built, fixing every P0 and P1 it reports, and re-running the affected tests, as phase 14 of the parent goal's OpenBot parity build.

### Decisions

Frozen choices. Changing one is an amendment.

The ids below are this packet's own, not the build's. `../contracts/decisions.md` numbers its own D1 to D9, where D3 is the missing-executor fallback, D4 is 012's failure policy and D7 is this phase's scenario re-run. A document that means the build's decision cites that file. The design docs write `goal D3` when they mean the stop rule.

| ID | Decision |
|----|----------|
| D1 | The review starts only after phase 013 is clean: every row in its `acceptance-criteria.md` is `Met` and `validate.sh --strict` prints `RESULT: PASSED` for that folder, so the review reads a checked surface rather than an assumed one [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:178]. |
| D2 | The five named dimensions ride on the four canonical ids, because a fan-out lineage reviews the canonical four only, and that mapping is what makes each named dimension covered [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md, section "Review dimensions"]. |
| D3 | The run stops on the stop rule, not on the iteration ceiling. Hitting `maxIterations` 7 without a false-positive STOP is a legal stop, and the run records which of the two it took [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:172]. |
| D4 | A review lineage runs read-only and the fix pass is a separate step, so no lineage edits the surface it audits; every lineage carries `AI_SESSION_CHILD=1` and the child-dispatch preamble [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:256]. |
| D5 | The fix pass changes no file outside the surfaces the review named, and a fix that needs a new surface is deferred as a finding rather than widening the diff [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:192]. |
| D6 | A P2 finding does not block the close. The verdict reads PASS with advisories and the finding stays open in the report [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:204]. |
| D7 | The suite baseline is 35 files and 381 tests, and REQ-006 is met only when the same command exits 0 with at least 381 tests passing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:94]. |
| D8 | Every row of the three review inputs becomes a seeded finding before any lineage spawns, so a product failure 012 or 013 filed is a finding the review must answer rather than one it might rediscover. A missing input is recorded with its reason and does not stop the run [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:184]. |
| D9 | After the last fix, every 012 scenario whose owning phase a fix touched is re-run and recorded, so a fix that breaks an operator flow 012 already proved is caught before the close rather than after it. A `FAIL` becomes a new finding and blocks the close [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:194]. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node -e "const c=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/deep-review-config.json'); console.log(c.antiConvergence.depthMode, c.reviewDimensions.join(','), c.convergenceThreshold, c.stuckThreshold)"` prints `expansive correctness,security,traceability,maintainability 0.1 2`.
- [ ] `node -e "const s=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/orchestration-summary.json'); console.log(s.total_cli_lineages, s.orphaned_lineages.length)"` prints `5 0`.
- [ ] `rg -c '^## (Executive Summary|Planning Trigger|Active Finding Registry|Remediation Workstreams|Spec Seed|Plan Seed|Traceability Status|Deferred Items|Audit Appendix)$' specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/review-report.md` prints `9`, and `rg -c '^Review verdict: ' specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/review-report.md` prints `1`.
- [ ] `node -e "const r=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P0)"` prints `0`, `rg -c '^\| F[0-9]' specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/fix-ledger.md` prints the same number as `node -e "const r=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/deep-review-findings-registry.json'); console.log(r.openFindings.length)"`, and `node -e "const s=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/seeded-findings.json'); console.log(s.sources.length, s.seededCount, s.rows.length)"` prints `3 2 2`.
- [ ] `node -e "const r=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P1)"` prints `0`, `rg -c '^\| F[0-9].*\| (pass|deferred) \|$' specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/fix-ledger.md` prints the same number as `rg -c '^\| F[0-9]' specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/fix-ledger.md`, and `node -e "const s=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/scenario-rerun.json'); console.log(s.rerunCount, s.failedCount)"` prints `9 0`.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints at least `Tests  381 passed`.
- [ ] `git status --porcelain | rg -v '^.. (\.skilled/(bin/bots\.cjs|skills/system-skilled-bots/(runtime/(lib|tests)/|scripts/bot-check\.cjs))|specs/system-skilled-bots/003-openbot-parity-build/)' | wc -l` prints `0`, `rg -c 'P0|P1' specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/implementation-summary.md` prints at least `1`, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-deep-review --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/014-deep-review` prints `RESULT: PASSED (5/5 checks)` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-deep-review --strict` prints `RESULT: PASSED` |
| Phase 013 precondition | Pending | `acceptance-criteria.md:45` is the only `Met` row; AC-002 to AC-012 read `Unmet` |
| Review packet | Pending | `ls specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review` exits 1, so no config, registry, ledger or report exists |
| Design artifacts | Done | `design/records.md`, `design/state-machines.md`, `design/refusals.md`, `design/mockups.md` and `design/fixtures/` exist, and the check block in `design/fixtures/README.md` prints `expansive correctness,security,traceability,maintainability 0.1 2`, `5 4 true`, `5 0`, `0 0 4`, `3 2 2`, `9 0`, `4`, `4`, `9`, `1` |
| Suite baseline | Recorded, not re-run | `spec.md:71-94` records `Test Files 35 passed (35)` and `Tests 381 passed (381)` at exit 0; `ls .skilled/skills/system-skilled-bots/runtime/tests/*.vitest.ts \| wc -l` prints 35, which agrees on the file count |
| Fix pass | Pending | No `review/fix-ledger.md` exists, so no finding has a fix row |
| Acceptance criteria | Pending | Eleven of twelve rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal | `specs/system-skilled-bots/003-openbot-parity-build/goal.md:79` binds this phase through its row `014-deep-review/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Seven criteria carry twelve acceptance rows | Criteria 1 to 7 cover AC-002 to AC-012 and SC-001 to SC-005. AC-001 is the phase 013 precondition, already `Met` and owned by that folder, so it rides in D1 rather than in a criterion. Criterion 1 carries AC-002 and AC-007 together because both read the same config file, and criterion 7 carries AC-009, AC-010 and SC-005 because all three answer the close. AC-011 and AC-012 are the two rows D8 and D9 added. |
| D8 and D9 are additions, not amendments | The plan-depth research added two requirements the original seven decisions did not cover: the seeded intake and the scenario re-run. D1 to D7 keep their wording and their citations, and the two new decisions carry the two new requirements. A builder reading the directive sees nine frozen choices and no contradiction between them. |
| The probe record is a file, not a log line | D3 makes the fallback the normal path, so the run has to show which five binaries it tried and which one ran twice. `review/preflight.json` is that record, its shape is `design/records.md` section 11, and `design/fixtures/preflight.json` shows a host with four present so the fallback is proven rather than assumed. |
| Criterion 7 is self-referential | Its validator command reads this packet, so the goal file is part of what it checks. That is SC-005's own wording, and the run that satisfies it is the one that closes the packet. |
| Suite baseline is the spec's measurement | This goal did not run `npm test`. The 381-test figure is quoted from `spec.md:71-94`, and the 35-file count was confirmed against the tests folder. A run that finds a different count corrects the criterion rather than the baseline. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as a warning on a Draft packet, not as an error. |
<!-- /ANCHOR:log -->
