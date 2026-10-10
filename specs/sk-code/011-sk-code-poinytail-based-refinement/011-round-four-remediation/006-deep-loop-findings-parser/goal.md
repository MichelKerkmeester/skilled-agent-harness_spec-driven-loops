---
title: "Goal: Phase 6: deep-loop-findings-parser"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser"
    last_updated_at: "2026-10-10T15:10:00Z"
    last_updated_by: "verifier"
    recent_action: "Verified every criterion; no fix units"
    next_safe_action: "Orchestrator runs the Hermes generator and trigger-index rebuild once"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-006-deep-loop-findings-parser"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: deep-loop-findings-parser

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the deep-loop runtime count each narrative finding once, with the shared parser ignoring indented numbered sub-steps and reading F### bullets and the review reducer letting an F### finding yield to the structured row with its id, with tests and a runtime changelog entry.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only a numbered line at the left margin opens a finding |
| D2 | A Findings section is read in one shape only, the first present of numbered subheadings, margin numbered lines and margin `- **F###**:` bullets |
| D3 | Numbered narrative findings yield to the structured findings of their iteration. An F### narrative finding yields only to a structured finding of its iteration with the same id, because an iteration can narrate findings it never recorded as rows. The parser's callers already let narrative yield, and the review reducer now applies the id rule to F### findings |
| D4 | The deep-loop runtime takes a patch bump to 1.9.4.0 with a compact changelog entry |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/probe/parse-fixture.cjs specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/fixtures/iteration-indented.md` prints `count=2 titles=The guard compares paths lexically|The stale comment names a removed flag`
- [ ] The same command on `scratch/fixtures/iteration-fbullets.md` and then on `scratch/fixtures/iteration-mixed.md` prints `count=2 titles=Guard compares paths lexically|Stale comment names a removed flag` each time
- [ ] `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/iteration-findings.vitest.ts) 2>&1 | grep -E 'Tests '` prints `Tests  6 passed (6)`
- [ ] `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/verify-iteration.vitest.ts tests/unit/fanout-merge.vitest.ts tests/unit/synthesis-closeout-latest-record.vitest.ts) 2>&1 | grep -E 'Test Files|Tests '` exits 0 and prints `Test Files  3 passed (3)` with no `failed`
- [ ] `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/deep-review-state-reducer.vitest.ts -t 'defers F### bullets|keeps an F### bullet') 2>&1 | grep -E 'Tests '` prints `Tests  2 passed | 11 skipped (13)`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser --strict` prints `RESULT: PASSED`
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
| Indented fixture parses to two findings | Done | `parse-fixture.cjs iteration-indented.md` exit 0: `count=2 titles=The guard compares paths lexically\|The stale comment names a removed flag` |
| F### and mixed fixtures parse to two findings each | Done | both exit 0: `count=2 titles=Guard compares paths lexically\|Stale comment names a removed flag` |
| Parser test file passes 6 of 6 | Done | Orchestrator rerun after the fix chain: `Tests  6 passed (6)` |
| Caller suites pass | Done | `Test Files  3 passed (3)`, `Tests  96 passed (96)`, exit 0 |
| Reducer counts restated F### findings once and keeps narrative-only ones | Done | Orchestrator rerun: `Tests  2 passed \| 11 skipped (13)`; `mode=after dirs=499 same=310 changed=146 raised=0 liveErrors=43` |
| Folder validates strict | Done | `RESULT: PASSED` on the verifier run, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Review reducer F### rule | First planned as a handoff, then assigned to this child by the orchestrator and planned as tasks T014 to T018 |
| D3 amended after review | The parallel reviewer showed the built rule dropped real findings: an iteration can record fewer delta rows than it narrates, and 15 narrative-only findings in 3 folders lost every copy (`luna-max` open 12 -> 5, with F005 and F006 still active in its report). Its units R01 and R02 (T035, T036) let an F### finding yield only to a row with the same id, and the new test failed `expected 1 to be 2` on the built reducer before them. Measured after: `luna-max` 12 -> 8, `deepseek-flash` 50 -> 40, still 146 folders changed and none raised. Objective, D3 and criteria 3 and 5 amended by the orchestrator on 2026-10-10 |
| Colon required in F### bullets | The parser made the colon optional, unlike D2's shape and the review reducer, so restated bullets such as `- **F004** (refined): ...` counted. T037 and T038 require it and add a test that failed on the parser before T037. The reviewer's changelog unit R03 was malformed, so T039 carries its text and T040 records the colon rule. `compare-parser-real.cjs` now prints `mode=unknown`, because the live parser no longer equals the planned unit text, with `liveMatch=1087` of `claims=2687` unchanged (`1075` before the build) |
| Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0 |
<!-- /ANCHOR:log -->
