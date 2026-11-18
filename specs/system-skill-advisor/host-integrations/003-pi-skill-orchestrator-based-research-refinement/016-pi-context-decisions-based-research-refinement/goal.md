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
    last_updated_at: "2026-11-18T14:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
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

**Objective:** The skill advisor routes a task the same with or without a pasted earlier reply in front of it, shows the model its outage line when the shared hook crashes, and has a measured answer on whether weak follow-ups need a guard, all built from the pi-context-decisions research.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Build order is 001, 005, 002, 004, 003. A phase starts only after the one before it validates strict |
| D2 | Phases 002, 004 and 003 are built by a GPT-6 Luna `xhigh` `fast` swarm through cli-codex, one change per brief, following `delegation-strategy.md` in this folder |
| D3 | The only fallback is DeepSeek V4.1 Flash `max` through cli-mistral-vibe (`deepseek-flash`). Luna never runs through another provider |
| D4 | The orchestrating session runs every build, test, probe and validation itself. An executor's own report is not evidence |
| D5 | Each phase changes only the files its own `spec.md` lists. The cut items R1, R4, R6, R7, R8, N2, N4, N5, N6, N7 and N8 stay out |
| D6 | No commit or push without the operator's say. The operator picks worktree or current branch before phase 002 |
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

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `printf '%s' '{"prompt":"Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` lists `sk-code` as the first recommendation, from a daemon started after the last advisor build
- [ ] `npx vitest run tests/hooks tests/parity` exits 0 from `.skilled/skills/system-skill-advisor/runtime`
- [ ] `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints one line
- [ ] `rg -n 'Decision rule outcome' specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/implementation-summary.md` prints one line naming ship, over-suppresses or no guard
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement --recursive --strict --quiet` prints `RESULT: PASSED` for all six folders
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
| 002, 004, 003 build | Pending | Waits on the operator's worktree or branch choice |

### Deviations and findings

| Item | Note |
|------|------|
| Folder numbers differ from build order | 004 builds before 003 because both edit the same hook file; folder names were kept |
<!-- /ANCHOR:log -->
