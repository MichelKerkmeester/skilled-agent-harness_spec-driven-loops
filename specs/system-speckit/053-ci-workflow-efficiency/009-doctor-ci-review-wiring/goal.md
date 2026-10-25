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
    last_updated_at: "2026-10-25T10:20:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed the verification checklist and the decision statuses"
    next_safe_action: "Phase closed; no further work in this phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-009-doctor-ci-review-wiring"
      parent_session_id: null
    completion_pct: 100
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

**Amended 2026-10-25 (ADR-013):** the CI surface value is dropped. A workflow diff gets the `sk-code-ci` evidence through request vocabulary bundling, so the objective is the `/doctor:ci` command alone and no sk-code file changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The report resolves a switch from each job's `if:` expression and `gh variable list`, and never reads a spec folder. |
| G2 | The report excludes a SHA whose last non-empty commit-message line is `Trigger-Index-Rebuild: ci`. |
| G3 | The scaffold creates new `.github/workflows/` files only and refuses an existing path or a protected workflow name. |
| G4 | Superseded by ADR-013. `CI` sits second in the detection precedence, after `SKILLED`. |
| G5 | The toggle shape follows the single `D9:` line; the R28 probe is pre-approved (operator, 2026-10-23); its outcome writes `D9: write` or `D9: print`, and `print` applies only if the probe fails. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/r28-probe.md` holds `4` lines matching `^(set|get|delete|get-after-delete) exit=`, and `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md` holds exactly `1` line matching `^D9: (write|print)$`
- [x] `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh` lists as many workflows as `ls .github/workflows/*.yml | wc -l`, and every `switch` value is one of `on`, `off`, `partial`, `missing` or `unknown`
- [x] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits `0` and prints `17 routes validated`
- [x] `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`, and `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` prints `STATUS=OK` with `bridges=21`
- [x] Superseded by ADR-013: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` exits `0` with at least `9` passing assertions
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring --strict` prints `RESULT: PASSED`
- [x] `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/phase-result.md` holds `17 routes validated`, `STATUS=OK`, one 40-hex `newest non-rebuild SHA` and `ephemeral-id hits: 0`
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
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` T001 to T033, `acceptance-criteria.md` AC-001 to AC-022, `decision-record.md` ADR-001 to ADR-013 |
| R28 probe and D9 | Done | `scratch/r28-probe.md` holds 4 exit lines and `plan.md` carries `D9: write` |
| `/doctor:ci` command | Done | Landed on main as `10c6791341`, `e0f922b593` and `4e0b8560cb`, with `17 routes validated` and `bridges=21` |
| CI surface value | Superseded | ADR-013, operator ruling of 2026-10-25. No sk-code file changes and T018 to T025 are closed as superseded |
| Verification | Done | `scratch/phase-result.md`, 17 acceptance rows `Met` and 5 `Superseded`, and 26 of 26 checklist rows closed with evidence. The closure commit (T033) is the one open task |

### Deviations and findings

| Item | Note |
|------|------|
| R30 superseded | The hub removed the Webflow and Obsidian surfaces and bundles `sk-code-ci` from request vocabulary, so the frozen precedence cannot be built. The compiled route still returns `sk-code-review` then `sk-code-ci` for a workflow prompt |
| Known limitation | The review router's own surface label reads `UNKNOWN` for a workflow diff. It is recorded in ADR-013 and not planned as a task |
| Counting deviation | AC-021 expects `6` from a line count that prints `12`, because each of the six activation entries matches on two lines |
| Concurrent edit | Another process edited `.skilled/commands/doctor/ci.md` and the `sk-code-ci` docs in this worktree while the closure pass ran. The closure pass did not make those edits and they are uncommitted |
<!-- /ANCHOR:log -->
