---
title: "Goal: Epic closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "closeout goal"
  - "leave nothing open"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout"
    last_updated_at: "2026-10-11T05:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-015-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Epic closeout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** End every item the epic left open as fixed, with a check that ran, or closed, with a written reason that a fix would be overengineering.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No item stays deferred, handed off or historical without a recorded reason |
| D2 | A report is a claim; every criterion is rerun, and each new test fails once before its fix |
| D3 | Phases own disjoint files; one sk-git commit per phase in this worktree; never push or merge |
| D4 | Each touched skill is bumped once for the whole closeout, numbered against upstream |
| D5 | Three failed repairs of one problem stop that phase and are reported |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-sk-code-hub-voice | `001-sk-code-hub-voice/goal.md` |
| 002-goal-criteria-refresh | `002-goal-criteria-refresh/goal.md` |
| 003-sk-git-playbook-changelog | `003-sk-git-playbook-changelog/goal.md` |
| 004-dispatch-guard-and-vitest | `004-dispatch-guard-and-vitest/goal.md` |
| 005-stdin-late-write-coverage | `005-stdin-late-write-coverage/goal.md` |
| 006-compiled-route-content-check | `006-compiled-route-content-check/goal.md` |
| 007-review-reducer-missing-config | `007-review-reducer-missing-config/goal.md` |
| 008-advisor-residuals-and-surface-hint | `008-advisor-residuals-and-surface-hint/goal.md` |
| 009-open-items-ledger | `009-open-items-ledger/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/015-closeout --strict --recursive`, run from the repository root, prints RESULT: PASSED for the parent and all nine children.
- [ ] `git log --format='%(trailers:key=Spec,valueonly)' HEAD | grep -c '/015-closeout/'`, run from the repository root, prints 9 or more.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-code/011-sk-code-poinytail-based-refinement/015-closeout`, run from the repository root, prints RESULT: PASSED.
- [ ] `git status --short`, run from the repository root, prints nothing after the last phase commit.
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
| Phases planned | Done | Nine children grouped by file ownership |

### Deviations and findings

| Item | Note |
|------|------|
| Builds made by the orchestrator, not cli-pi | The brief named DeepSeek V4.1 Flash through cli-pi as the builder. This session runs as a leaf worker whose instructions bar dispatching another agent, so the orchestrator made each change itself and verified it the same way: each new test failed once before its fix, and every criterion was rerun |
<!-- /ANCHOR:log -->
