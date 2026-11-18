---
title: "Goal: pi-context-decisions Research for Skill Advisor Refinement"
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
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement"
    last_updated_at: "2026-11-18T16:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Amended for the closure phases 006 to 013"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: pi-context-decisions Research for Skill Advisor Refinement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The skill advisor routes a task the same with or without a pasted earlier reply everywhere, shows the right fallback when its hook crashes, keeps route receipts for weak follow-ups and lands on main with nothing open or untested.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Build order: 001, 005, 002, 004, 003, 006 to 011, 013, 012. Each starts after the one before validates strict |
| D2 | Code is built by a GPT-6 Luna `xhigh` `fast` swarm via cli-codex |
| D3 | Fallback: DeepSeek V4.1 Flash `max` via cli-mistral-vibe only. Luna uses no other provider |
| D4 | The conductor runs every check itself |
| D5 | Each phase changes only files its `spec.md` lists. The cut items stay cut. N4 builds in 010 and 011 |
| D6 | Worktree 474 commits are approved. Finish: sk-git merge to main, advisor rebuild and restart, these criteria, push |
| D7 | If the 010 bench rerun gives no guard, the operator decides before 011 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-deep-research | `001-deep-research/goal.md` |
| 002-pasted-context-stripping | `002-pasted-context-stripping/goal.md` |
| 003-follow-up-routing-benchmark | `003-follow-up-routing-benchmark/goal.md` |
| 004-crash-path-fallback | `004-crash-path-fallback/goal.md` |
| 005-plan-validation-research | `005-plan-validation-research/goal.md` |
| 006-strip-rule-boundary-edges | `006-strip-rule-boundary-edges/goal.md` |
| 007-python-scorer-strip-parity | `007-python-scorer-strip-parity/goal.md` |
| 008-handler-scored-prompt-consumers | `008-handler-scored-prompt-consumers/goal.md` |
| 009-crash-fallback-edge-cases | `009-crash-fallback-edge-cases/goal.md` |
| 010-route-receipts-research | `010-route-receipts-research/goal.md` |
| 011-route-receipts-build | `011-route-receipts-build/goal.md` |
| 012-plan-text-and-goal-closeout | `012-plan-text-and-goal-closeout/goal.md` |
| 013-drift-guard-probe-script-errors | `013-drift-guard-probe-script-errors/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `printf '%s' '{"prompt":"Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` lists `sk-code` first on main after a daemon restart
- [ ] `npx vitest run tests/hooks tests/parity tests/handlers` exits 0 from `.skilled/skills/system-skill-advisor/runtime`
- [ ] `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints one line
- [ ] `rg -n 'Decision rule outcome' specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-*/003-*/implementation-summary.md` prints one line naming ship, over-suppresses or no guard
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-* --recursive --strict --quiet` prints `RESULT: PASSED` for all fourteen folders
- [ ] `git merge-base --is-ancestor worktrees/474-advisor-pasted-context-and-crash-fallback origin/main` exits 0
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
| 001 research | Done | `001-deep-research/research/research.md`, 5 iterations, 120 of 120 citations resolve |
| 005 plan validation | Done | `005-plan-validation-research/research/research.md`, plan changes C1 to C15 applied |
| 002, 004, 003 build | Done | Worktree 474, five commits `6c4af5fb5eb` to `84a2d1eb697`; 003 closed on over-suppresses with no guard built |
| 006 to 013 planned | In Progress | Scaffolded 2026-11-18 by operator directive "Fix all open work leave nothing open or untested" |

### Deviations and findings

| Item | Note |
|------|------|
| Folder numbers differ from build order | 004 builds before 003 because both edit the same hook file; folder names were kept |
| Amendment 2026-11-18 | Phases 006 to 013 added, N4 moved out of the cut list, D1 order extended, D6 now approves commits, merge and push, D7 added, criteria 2 and 5 widened and criterion 6 added; the drift-guard and `confidenceOnly` checks live in the 013 and 009 goals |
<!-- /ANCHOR:log -->
