---
title: "Goal: Round-four remediation for sk-code"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation"
    last_updated_at: "2026-10-10T16:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-round-four-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Round-four remediation for sk-code

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the eleven items round three left open, the five it excluded on purpose and the six residuals its children recorded, so each one is fixed in the tree and proved by a check that would fail without the fix.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Claude agents on Opus 5.5 at medium effort plan each child; DeepSeek V4.1 Flash at max effort through cli-pi builds it; several Claude agents on Sonnet 5.5 at high effort verify and review it as soon as its build reports done |
| D2 | The orchestrator reruns every criterion in a child's `goal.md` before calling it done, then makes one commit per child in folder order; never push and never merge without the operator's word |
| D3 | Each child owns its files exclusively; a fix that needs another child's file is handed to that child, never edited across the line |
| D4 | Builders never run the Hermes generator or a compiled-route re-mint in write mode; the orchestrator runs each once after the builds |
| D5 | Where round three recorded a reason for leaving an item out, the child plan answers that reason before fixing the item |
| D6 | Three failed repairs on one child stop that child; report the command and its output |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-review-canary-pins | `001-review-canary-pins/goal.md` |
| 002-webflow-labels-and-playbook | `002-webflow-labels-and-playbook/goal.md` |
| 003-hub-surface-precedence | `003-hub-surface-precedence/goal.md` |
| 004-quality-obsidian-coverage | `004-quality-obsidian-coverage/goal.md` |
| 005-doc-claims-hardening | `005-doc-claims-hardening/goal.md` |
| 006-deep-loop-findings-parser | `006-deep-loop-findings-parser/goal.md` |
| 007-hook-deadline-margins | `007-hook-deadline-margins/goal.md` |
| 008-session-aware-tie-break | `008-session-aware-tie-break/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In the worktree, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation --recursive --strict` prints `RESULT: PASSED` 9 times and `RESULT: FAILED` 0 times
- [ ] In the worktree, `grep -l 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/00[1-8]-*/implementation-summary.md | wc -l` prints 8
- [ ] In the worktree, `git log --format='%(trailers:key=Spec,valueonly)' main..HEAD | grep -c '/011-round-four-remediation/'` prints 8, one per child, and `git status --short` prints nothing
- [ ] In the worktree, `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`, `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`, `node .skilled/bin/compiled-route-guard.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` and `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` each exit 0
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
| 001-review-canary-pins | Verified | The orchestrator reran every goal criterion on 2026-10-10 and strict validation passed. One commit, in folder order |
| 002-webflow-labels-and-playbook | Verified | The orchestrator reran every goal criterion on 2026-10-10 and strict validation passed. One commit, in folder order |
| 003-hub-surface-precedence | Verified | The orchestrator reran every goal criterion on 2026-10-10 and strict validation passed. One commit, in folder order |
| 004-quality-obsidian-coverage | Verified | The orchestrator reran every goal criterion on 2026-10-10 and strict validation passed. One commit, in folder order |
| 005-doc-claims-hardening | Verified | The orchestrator reran every goal criterion on 2026-10-10 and strict validation passed. One commit, in folder order |
| 006-deep-loop-findings-parser | Verified | The orchestrator reran every goal criterion on 2026-10-10 and strict validation passed. One commit, in folder order |
| 007-hook-deadline-margins | Verified | The orchestrator reran every goal criterion on 2026-10-10 and strict validation passed. One commit, in folder order |
| 008-session-aware-tie-break | Planned | Plan written and both validators pass. Builds after 001 to 007 are committed |

### Deviations and findings

| Item | Note |
|------|------|
| Child 008 added | Child 003's reviewer showed that generic words (typescript, vitest, json) decide keyword ties, so WF-005 and WF-013 lead with OpenCode. The operator kept OPENCODE > OBSIDIAN > WEBFLOW as the fallback and added 008: the session's current work, detected by the existing path and marker rules, leads a keyword tie |
| Review findings | Reviewers found defects in 002, 003, 004, 005 and 006. Each became a fix unit, built through the same chain and rechecked. In 006 the fix changed decision D3, so an F### narrative finding yields only to a structured row with its id |
| Scope | The operator first chose the five items excluded on purpose, then widened round four to all eleven after the orchestrator found six more residuals that still reproduce |
<!-- /ANCHOR:log -->
