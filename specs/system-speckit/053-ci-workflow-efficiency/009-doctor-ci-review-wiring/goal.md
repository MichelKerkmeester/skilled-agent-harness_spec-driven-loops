---
title: "Goal: Phase 9: doctor-ci-review-wiring"
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
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring"
    last_updated_at: "2026-10-23T15:50:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "D9 is unanswered; the probe needs an operator yes"
      - "006-sk-code-ci-surface and 007-workflow-hygiene-on-off-control have not landed"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-009-doctor-ci-review-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 9: doctor-ci-review-wiring

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver a `/doctor:ci` command that reports every workflow's switch state, scaffolds a compliant workflow and toggles a documented switch, together with the CI surface value that makes a workflow diff review with the `sk-code-ci` evidence packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The report resolves a switch from each job's `if:` expression and `gh variable list`, and never reads a spec folder. |
| G2 | The report excludes a SHA whose last non-empty commit-message line is `Trigger-Index-Rebuild: ci`. |
| G3 | The scaffold creates new `.github/workflows/` files only and refuses an existing path or a protected workflow name. |
| G4 | `CI` sits second in the detection precedence, after `SKILLED`. |
| G5 | The toggle shape follows the single `D9:` line; `print` is the recommended default pending operator D9 when the operator declines the probe. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/r28-probe.md` holds `4` lines matching `^(set|get|delete|get-after-delete) exit=`, and `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md` holds exactly `1` line matching `^D9: (write|print)$`
- [ ] `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh` lists as many workflows as `ls .github/workflows/*.yml | wc -l`, and every `switch` value is one of `on`, `off`, `partial`, `missing` or `unknown`
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits `0` and prints `17 routes validated`
- [ ] `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`, and `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` prints `STATUS=OK` with `bridges=21`
- [ ] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` exits `0` with at least `9` passing assertions
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring --strict` prints `RESULT: PASSED`
- [ ] `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/phase-result.md` holds `17 routes validated`, `STATUS=OK`, one 40-hex `newest non-rebuild SHA` and `ephemeral-id hits: 0`
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
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` T001 to T033, `acceptance-criteria.md` AC-001 to AC-022, `decision-record.md` ADR-001 to ADR-012 |
| R28 probe and D9 | Pending | `scratch/r28-probe.md` is not written and `plan.md` carries no `D9:` line |
| `/doctor:ci` command | Pending | No file under `.skilled/commands/doctor/` names the command |
| CI surface value | Pending | `detect_surface_evidence` still returns four values |
| Verification | Pending | `scratch/phase-result.md` is not written |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
