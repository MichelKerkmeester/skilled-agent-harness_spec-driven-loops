---
title: "Goal: Phase 9: review-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/009-review-closeout"
    last_updated_at: "2026-10-26T18:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed every completion criterion on the final tree, three on the amended checks"
    next_safe_action: "None: the phase is closed and its fix commit 6988bb2c9d is on main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-review-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: review-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Implement every review recommendation the operator accepted on 2026-10-26, so the quality gate errors only on faults that affect the files it checks, runs a repository's configured commands only under a stated grant, meets its 50-file budget by a recorded measurement, and every record in the packet says what is true.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Configured checks need their own grant, `skilled.trustRepoChecks` in local git config, separate from `skilled.trustRepoHooks`. The hub's own repository and an explicit `--config` also grant (ADR-001). |
| D2 | An outside skill's quality fault errors only where its surface applies to a file in scope, and is a non-gating `config.warnings` entry otherwise (ADR-002). |
| D3 | `syntax-node` keeps `node --check` and runs it through a pool bounded by the core count, with findings in input order (ADR-003). |
| D4 | REQ-001, REQ-002 and REQ-003 edit `quality-gate.cjs` in that order, one lane at a time. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The quality suite passes with the new cases: `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`, and the suite holds a case where a fault on a non-applying surface lands in `config.warnings` and a case where a committed config with no grant gives `SKIPPED_UNTRUSTED` and exit 4.
- [x] The doctor and parity suites pass: `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` exits 0.
- [x] The timing record holds five full runs: `node -p "require('./specs/sk-code/015-quality-agnostic-gate/009-review-closeout/evidence/timing.json').after.runs_ms.length"` prints `5`, and each run's wall time reads under 2000 ms on the reference machine.
- [x] The @code mirrors match and name the runner by the loaded skill's location: `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0, `rg -c 'inside the sk-code skill loaded in step 3' .skilled/agents/code.md` prints `1`, and any root path in the step is a labelled `in this repository:` example.
- [x] No record still waits for confirmation: `rg -n 'pending operator confirmation|pending confirmation' specs/sk-code/015-quality-agnostic-gate/00[1-8]-* | rg -v 'Confirmed by the operator 2026-10-26'` prints no line.
- [x] The whole packet validates: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
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
| Phase documents authored | Done | `validate.sh --strict` on this folder, recorded in the handback |
| Lanes A to G | Done | Tasks T001 to T032 are `[x]` in `tasks.md`, all sixteen acceptance criteria are `Met`, and the recursive strict validator printed `RESULT: PASSED`. CHK-FIX-007 pins the evidence to fix commit `6988bb2c9d` |

### Deviations and findings

| Item | Note |
|------|------|
| Operator acceptance | The operator accepted every review recommendation on 2026-10-26 with "Go, all is accepted as recommended". This phase exists to implement them |
| Criteria 3 to 5 amended | Run as first written on 2026-10-26, three criteria failed while the intent held: `timing.json` keeps its runs under `before` and `after`, so `.runs` is undefined; `code.md` keeps a labelled in-repository example, so the root-path count is `1`; and the packet-wide search matches closed evidence and changelogs that quote the old status. Each now uses the check `acceptance-criteria.md` AC-007, AC-009 and AC-010 accepted, and each printed what it names: `5`, `1` and `1`, and no line |
<!-- /ANCHOR:log -->
