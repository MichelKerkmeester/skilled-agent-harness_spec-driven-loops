---
title: "Goal: Command surfacing build"
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
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build"
    last_updated_at: "2026-11-12T22:20:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the autonomous goal for the packet"
    next_safe_action: "Finish the phase 007 smoke run and the before arm"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-352-command-surfacing-research"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Goal: Command surfacing build

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every tracked slash command reaches the model with a run, start or ask policy on every supported CLI, and the plan is built, tested, measured, reviewed and improved without waiting on the operator.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Run autonomously and ask the operator nothing. Take the recommended option and record it in `decision-record.md`. |
| D2 | Never push to main, edit a published release or install software. Log each as waiting. |
| D3 | Build with `/speckit:plan` and `/speckit:implement`, review with `/deep:review`, find gains with `/deep:research`, close with `/local-skilled-alignment`. |
| D4 | Workers: DeepSeek v4.1 flash max on OpenCode Go or LLM Gateway. Luna xhigh fast only on the Codex CLI, dropped when its quota is spent. Fable 5.2 medium for synthesis and key reviews. |
| D5 | Live behaviour runs happen only in an arena: a throwaway clone, no remote, credentials off. |
| D6 | Holdout prompt text is never read. Every number comes from a committed script. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-command-routing-baseline-corpus | `001-command-routing-baseline-corpus/goal.md` |
| 002-command-inventory-and-risk-metadata | `002-command-inventory-and-risk-metadata/goal.md` |
| 003-plain-chat-command-reach | `003-plain-chat-command-reach/goal.md` |
| 004-command-meaning-matching | `004-command-meaning-matching/goal.md` |
| 005-recommendation-contract-and-brief | `005-recommendation-contract-and-brief/goal.md` |
| 006-gate-2-binding-and-runtime-pointers | `006-gate-2-binding-and-runtime-pointers/goal.md` |
| 007-per-runtime-behaviour-proof | `007-per-runtime-behaviour-proof/goal.md` |
| 008-embedder-setup-and-cost | `008-embedder-setup-and-cost/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] Strict validation of this packet prints `RESULT: PASSED` for the parent and all eight phases, each Complete.
- [ ] The advisor suite (`npx vitest run`) reports 0 failed, typed recall is 24 of 44 or more and false offers are 0 of 35.
- [ ] The behaviour summary prints a before and an after start rate for claude, codex, opencode, pi, devin and dsh, and each unsafe start after has a fix or a reason in this log.
- [ ] A `/deep:review` loop over the packet code has converged with 0 open P0 and P1 findings.
- [ ] A `/deep:research` loop on UX, performance and cross-CLI usefulness has converged, with each recommendation built in a new phase or declined with a reason.
- [ ] `/local-skilled-alignment` on the branch reports 0 P0 and 0 P1 findings.
- [ ] The branch sits on `origin/main`, clean and unpushed, with each item waiting on the operator in this log.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phases 001 to 004 | Done | Each validates with `RESULT: PASSED`, status Complete |
| Phases 005 to 008 | In Progress | Planned and committed 2026-11-12. Phase 007 harness built, smoke run three in flight |
| Rebase onto main | Done | 2026-11-12, full suite 167 files 1,478 passed |
| Phase 007 smoke run | Done | Third run: all six runtimes ran in arenas and scored, start rate 0 of 1 each, one capped (opencode). runs-smoke.jsonl |

### Deviations and findings

| Item | Note |
|------|------|
| Operator answers before this goal | 57 answers are recorded in `decision-record.md` files of this packet and stay binding |
<!-- /ANCHOR:log -->
