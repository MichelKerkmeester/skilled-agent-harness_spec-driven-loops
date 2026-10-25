---
title: "Goal: CI workflow efficiency, speed and operator control"
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
    packet_pointer: "system-speckit/053-ci-workflow-efficiency"
    last_updated_at: "2026-10-25T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Progress synced to the child Status lines"
    next_safe_action: "007 T100-T102; 004 T072-T074; 008 after D8"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-ci-workflow-efficiency"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Goal: CI workflow efficiency, speed and operator control

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Cut the CI load and the time to a signal across the repository's 33 GitHub Actions workflows, give base repos and clones an on/off control that defaults to everything on, and give workflow authoring one `sk-code-ci` standard and one `/doctor:ci` operator command.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | A phase's spec, plan, tasks, acceptance criteria and decision record land before any file that phase changes. |
| G2 | An operator decision D1-D10 runs no gated task until an explicit operator yes is recorded in that phase's `scratch/` answer file; a recommended default is not an answer. |
| G3 | Every number a phase quotes comes from `001-research/research/synthesis-reviews/final-review.md` or a `scratch/` measurement it names, never from memory. |
| G4 | No packet path, phase number or ADR/REQ/task/finding id appears in a code comment; the comment states the durable reason. |
| G5 | A phase changes when and how a check runs, never what the check verifies. |
| G6 | Each phase passes `validate.sh --strict` alone before the next starts; the parent passes recursive strict validation at the end. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-research | `001-research/goal.md` |
| 002-rebuild-fanout-removal | `002-rebuild-fanout-removal/goal.md` |
| 003-trigger-and-job-hygiene | `003-trigger-and-job-hygiene/goal.md` |
| 004-setup-caching-provisioning | `004-setup-caching-provisioning/goal.md` |
| 005-slow-and-failing-tests | `005-slow-and-failing-tests/goal.md` |
| 006-sk-code-ci-surface | `006-sk-code-ci-surface/goal.md` |
| 007-workflow-hygiene-on-off-control | `007-workflow-hygiene-on-off-control/goal.md` |
| 008-consolidation-decision | `008-consolidation-decision/goal.md` |
| 009-doctor-ci-review-wiring | `009-doctor-ci-review-wiring/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency --recursive --strict` prints `RESULT: PASSED` for all eleven folders
- [ ] Every R1-R30 is closed in its owning phase, and `rg -c '\| Unmet \|' specs/system-speckit/053-ci-workflow-efficiency/00*/acceptance-criteria.md` prints nothing
- [ ] `gh run list --commit <sha>` returns `[]` for each of three consecutive post-change rebuild commits
- [ ] `rg -o --no-filename 'vars\.SKILLED_CI[A-Z_]*' .github/workflows/*.yml | sort -u | wc -l` returns `6`
- [ ] `.skilled/skills/sk-code/sk-code-ci/SKILL.md` and `.skilled/commands/doctor/ci.md` exist
- [ ] The final commit on `main` has no failed run: `gh run list --commit <sha> --json conclusion --jq '[.[] | select(.conclusion == "failure")] | length'` returns `0`
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
| Goal authored | Done | Nine binding rows match the nine direct phase folders |
| Phase 001 research | Done | `001-research/implementation-summary.md` |
| Phase 002 rebuild fan-out | Done | `002-rebuild-fanout-removal/spec.md` Status `Complete`, closure `03baa89ac6` |
| Phase 003 trigger and job hygiene | Done | `003-trigger-and-job-hygiene/spec.md` Status `Complete` |
| Phase 004 setup caching provisioning | In progress | 16 of 17 acceptance rows `Met`; T072 phase delta, then T073 and T074 remain |
| Phase 005 slow and failing tests | Done | `005-slow-and-failing-tests/spec.md` Status `Complete` |
| Phase 006 sk-code-ci surface | Done | `006-sk-code-ci-surface/spec.md` Status `Complete` |
| Phase 007 hygiene and on/off control | In progress | The five concern commits are on `main`; T100 (after 2026-10-26T00:45Z), then T101 and T102 remain |
| Phase 008 consolidation decision | Pending | Blocked on D8 by design (`T002 [B]`) |
| Phase 009 doctor ci and review wiring | Done | `009-doctor-ci-review-wiring/spec.md` Status `Complete`, closure `8811c7e36d` |
| Phase 010 review remediation | Done | Applied the confirmed findings of `review/review-report.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Amendment 2026-10-25, criterion 4 | The switch-count command gained `--no-filename`. Without it `rg` prefixes each match with its file name, so `sort -u` counted file and name pairs and printed `62` on a correct tree. With it the pipeline prints `6`. |
| Amendment 2026-10-25, criterion 1 | The folder count moved from ten to eleven when `010-review-remediation` was added for the deep-review remediation. |
| 010 has no child goal | `010-review-remediation` is a Level 1 remediation phase. Its `spec.md` scope is its directive, so the binding table keeps its nine rows. |
<!-- /ANCHOR:log -->
