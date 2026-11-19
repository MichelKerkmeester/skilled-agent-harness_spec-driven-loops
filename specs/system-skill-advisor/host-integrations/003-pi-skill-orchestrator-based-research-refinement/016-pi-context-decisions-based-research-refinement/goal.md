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
    completion_pct: 100
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
| D1 | Order: 001, 005, 002, 004, 003, 006 to 011, 013, 012, 014 to 016, each after the previous validates strict |
| D2 | Code: GPT-6 Luna `xhigh` `fast` swarm, cli-codex |
| D3 | Fallback: DeepSeek V4.1 Flash `max` via cli-mistral-vibe only |
| D4 | The conductor runs every check |
| D5 | A phase changes only files its `spec.md` lists; cut items stay cut |
| D6 | Approved: commits, merge and push for 474 and 014 |
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
| 014-review-p2-fixes | `014-review-p2-fixes/goal.md` |
| 015-skilled-alignment-check | `015-skilled-alignment-check/goal.md` |
| 016-doc-alignment-check | `016-doc-alignment-check/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `printf '%s' '{"prompt":"Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` lists `sk-code` first on main after a daemon restart
- [x] `npx vitest run tests/hooks tests/parity tests/handlers` exits 0 from `.skilled/skills/system-skill-advisor/runtime`
- [x] `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints one line
- [x] `rg -n 'Decision rule outcome' specs/system-skill-advisor/*/003-pi-*/016-pi-*/003-*/implementation-summary.md` prints one line naming ship, over-suppresses or no guard
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/*/003-pi-*/016-pi-* --recursive --strict --quiet` prints `RESULT: PASSED` for all seventeen folders
- [x] `git merge-base --is-ancestor worktrees/474-advisor-pasted-context-and-crash-fallback origin/main` exits 0
- [x] `tasks.md` in 014, 015 and 016 has no `- [ ]` line
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
| 006 to 013 built | Done | Phases 006 to 011 and 013 committed in worktree 474; 012 fixed every confirmed review finding test first and closed the docs |
| Finish | Done | Merged to main as `57d3f5d9159`, advisor rebuilt and its daemon restarted on main, criteria 1 to 5 run on main, pushed to origin/main |
| Criteria evidence | Done | 1: `sk-code` first, daemon 24672 after the main build; 2: 424 passed on main; 3: line 382; 4: line 80, over-suppresses; 5: 14 of 14 on main; 6: exit 0 after pushing `57d3f5d9159` |
| 015 and 016 alignment runs | Done | 015: 25 findings (1 P0 repaired in session, 9 P1, 15 P2), `015-skilled-alignment-check/evidence/report.md`. 016: 20 open findings (5 P1, 15 P2), `016-doc-alignment-check/evidence/report.md`. Both report only, nothing fixed |
| 014 review fixes | Done | Worktree 475, seven commits `5f1bfa57c2d` to `a7964556816`: eight P2 findings fixed, R1-P2-004 accepted. `VT` 500 passed, `PY` pass=120, @review APPROVED, Luna refutation 5 of 6 hold. 014 strict `RESULT: PASSED` |
| 014 merged and saved | Done | Merge c8404904544 on main, no push; main build exit 0, vitest 523 passed, Python 120/0, 17 of 17 strict PASSED, criterion 1 sk-code first after daemon restart; worktree 475 removed |

### Deviations and findings

| Item | Note |
|------|------|
| D6 amended 2026-11-19 | The operator reopened 014 for every follow-up and approved its merge and push |
| Folder numbers differ from build order | 004 builds before 003 because both edit the same hook file; folder names were kept |
| Amendment 2026-11-19, D6 for 014 | Operator approved commits and a merge to main for 014's worktree build, no push (014 decision record Q004) |
| Amendment 2026-11-19, phases 015 and 016 | Report-only alignment runs added by operator request ("Also run /local-skilled-alignment and /local-doc-alignment make that phases"). D1 ends with 014 to 016, two binding rows added, criterion 5 counts seventeen folders and criterion 7 covers the tasks of 014, 015 and 016. To fit 4,000 characters: D7 dropped because it governed only the finished phase 011, D6 kept only its live choice, and `host-integrations` in two criterion globs became `*`, each glob checked to match one path |
| Amendment 2026-11-19 | Phase 014 added for the nine P2 findings of the post-merge review, by operator choice. D1 order ends with 014, a binding row was added, criterion 5 counts fifteen folders and a seventh criterion requires 014's tasks done. To stay under 4,000 characters, D2 to D7 lost wording but no choice: D3's "Luna uses no other provider" and D5's "N4 builds in 010 and 011" were dropped as restating D2 and a finished phase |
| Amendment 2026-11-18 | Phases 006 to 013 added, N4 moved out of the cut list, D1 order extended, D6 now approves commits, merge and push, D7 added, criteria 2 and 5 widened and criterion 6 added; the drift-guard and `confidenceOnly` checks live in the 013 and 009 goals |
<!-- /ANCHOR:log -->
