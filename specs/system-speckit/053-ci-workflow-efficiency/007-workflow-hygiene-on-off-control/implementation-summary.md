---
title: "Implementation Summary"
description: "Planned, not built: this phase will declare least-privilege permissions on the 12 workflows that declare none, split the Dependabot auto-merge workflow into a read-only and a write-scoped job, size a timeout for every job from 40 runs of job-level samples, and put a vars.SKILLED_CI switch on every job except Dependabot's two. No workflow, script or README change exists yet."
trigger_phrases:
  - "workflow hygiene on off control implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control"
    last_updated_at: "2026-10-23T14:00:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded the plan state"
    next_safe_action: "Answer D6, then run the phase's tasks from T001"
    blockers:
      - "D6 is unanswered; the default is 10 minutes"
      - "003, 004, 005 and 006 have not landed"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-007-workflow-hygiene-on-off-control"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-workflow-hygiene-on-off-control |
| **Completed** | Not built |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a Level 3 plan, and every artifact it names is still in its pre-phase state: `.github/workflows/dependabot-auto-merge.yml` still has one job holding `contents: write` and `pull-requests: write`, twelve workflow files still declare no `permissions:` block, no job outside the seven existing `timeout-minutes` lines carries a value, and no job carries a `vars.SKILLED_CI` switch. The plan and the task list are the deliverable; the workflow edits land when `tasks.md` T001 to T102 run.

### Phase 7: workflow-hygiene-on-off-control

The phase closes three gaps that a maintainer meets in production: a hung job holding a runner for GitHub's 360-minute default, a third-party Dependabot action running beside a write token, and no way for a clone to turn a group of checks off without editing YAML. It does that in three passes over the same 32 files, each proved by a parse and by `check-gate-inputs.sh`, with the switch additionally proved on a fork.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/advisory-checks.yml` and ten sibling files | Modify (planned) | A workflow-level `permissions: contents: read` above `jobs:`, plus a timeout and a switch on the job |
| `.github/workflows/skill-doc-frontmatter.yml` | Modify (planned) | The same permission block, two timeouts, one bare switch and one ANDed condition at `:52` |
| `.github/workflows/dependabot-auto-merge.yml` | Modify (planned) | One job becomes a read-only `metadata` job and a write-scoped `auto-merge` job, with a timeout on each |
| `.github/workflows/trigger-index-rebuild.yml` | Modify (planned) | Two timeouts and two ANDed conditions at `:33` and `:186`; `permissions: {}` at `:12` unchanged |
| `.github/workflows/message-contract.yml` | Modify (planned) | One timeout and the `SKILLED_CI_MESSAGES` switch; its step conditions unchanged |
| `.github/workflows/README.md` | Modify (planned) | A new `### On/off switches` section after the push-versus-pull-request table at `:75` |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/` | Create (planned) | `decisions.md`, `phase-baseline.md`, `inventory.md`, `switch-groups.md`, `constraints.md`, `r24/`, `r25-dependabot.md`, `pass-permissions.md`, `pass-switch.md`, `r26-probe.md`, `phase-result.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The delivery plan is `tasks.md`: five phases, 102 tasks, one commit per concern (ADR-010), and three gate points at T020, T060 and T096. `plan.md`'s L3 dependency graph and critical path name the order and the two external inputs, D6 and a fork.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D6's floor, 10 minutes by default (ADR-001) | A floor is a policy the operator owns; the measured term cannot cover a job with no sample |
| Build order R25, R24, R26 (ADR-002) | The Dependabot split creates a job, and a timeout pass cannot size a job that does not exist |
| Job-time samples, not run wall time (ADR-003) | `timeout-minutes` counts execution; run wall time includes queueing and would overstate every value |
| The formula plus thin and absent markers (ADR-004) | One percentile is fooled by one slow run, and a two-run sample must read as thin |
| The split keeps the existing check name (ADR-005) | Only `message-contract.yml`'s context is required, so a rename buys nothing and breaks a bookmark |
| The switch is ANDed, never substituted (ADR-006) | A replacement would delete the rebuild loop guard |
| `SKILLED_CI_MESSAGES` exists and is documented as never-off (ADR-007) | The group list stays complete, and the prohibition is read where the variable is described |
| The README table is the group taxonomy (ADR-008) | One taxonomy, already maintained, instead of a second list |
| The rule packet keeps `max(<floor>, ...)` (ADR-009) | A standard that hard-codes one repository's floor cannot describe the next repository |
| One commit per concern (ADR-010) | A killed timeout must be revertible without reverting the permissions and the switch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -L 'permissions:' .github/workflows/*.yml` | Not run; the tree still lists twelve files |
| `python3` job parse for `timeout-minutes` | Not run; 37 of 44 jobs still lack a value |
| `grep -c "vars.SKILLED_CI != 'off'"` summed over the tree | Not run; the count is `0` |
| `bash .github/scripts/check-gate-inputs.sh` | Not run against a changed tree |
| `validate.sh --strict` on this folder | Planned packet validates; `RESULT: PASSED` except the generated-metadata rules, which recompute from `description.json` |
| Fork probe | Not run; no fork is recorded |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase is planned, not built.** No workflow file has changed, so every acceptance row in `acceptance-criteria.md` is `Unmet`.
2. **D6 is unanswered.** The default is 10 minutes; every timeout value depends on the answer.
3. **A fork is required for AC-008.** Without one the switch's behavioural half stays `Unmet` rather than being waived.
4. **A Dependabot pull request is required for AC-002.** Without one the split's live half stays `Unmet` until the next one arrives.
<!-- /ANCHOR:limitations -->

---
