---
title: "Goal: Residual closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "residual closeout goal"
  - "fix remaining"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-016-residual-closeout"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Goal: Residual closeout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every item the epic closeout left open, with proof from a command that ran, and close an item only where each honest fix needs a mechanism the overengineering rule rejects.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | DeepSeek V4.1 Flash at max effort builds through cli-pi on DevPass, with Cline Pass as the fallback; one change per brief |
| D2 | The orchestrator reviews every DeepSeek diff before it commits, and edits only where a dispatch failed twice |
| D3 | A review finding is a hypothesis until a command confirms it; each confirmed P0, P1 and P2 is fixed in its own phase |
| D4 | One sk-git commit per phase in worktree 099, with no attribution trailers; never push or merge |
| D5 | Each skill whose files change is released once with a changelog entry |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-package-strict | `001-package-strict/goal.md` |
| 002-hooks-readme-voice | `002-hooks-readme-voice/goal.md` |
| 003-admission-gold | `003-admission-gold/goal.md` |
| 004-battery-misses | `004-battery-misses/goal.md` |
| 005-hooks-vitest-scope | `005-hooks-vitest-scope/goal.md` |
| 006-closeout-deep-review | `006-closeout-deep-review/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout --strict --recursive`, run from the repository root, prints RESULT: PASSED for the parent and all 6 children.
- [ ] `git log --format='%(trailers:key=Spec,valueonly)' HEAD | grep -c '/016-residual-closeout/'`, run from the repository root, prints 6 or more.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout`, run from the repository root, prints RESULT: PASSED.
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
| Phase 001 | Done | 13 of 13 units pass the strict check |
| Phase 002 | Done | 0 HVR hard blockers in both hooks READMEs |
| Phase 003 | Done | DOC-331 CLOSED: gold right, the only router fix has one caller |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Each phase records its own |
<!-- /ANCHOR:log -->
