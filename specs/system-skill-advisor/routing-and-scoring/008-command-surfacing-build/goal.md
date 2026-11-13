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
| Ungated setup while the before arm runs | Done | 005 wave 0 captures, 007 T016-T021, 008 measurement script, commits d8797702e8 and 49281dd652 |
| Research segment one (13 iterations, 3 lineages) | Done | 009-ux-performance-cross-cli-research/research/research.md, 14 ranked recommendations |
| Autonomous decision: ranks 1-6 and 10 become phase 010, built before the after arm | Decided | research.md section 16 says ranks 2-3 are needed for the after arm to be evidence |
| WAITING ON OPERATOR: Codex hook approval for arena paths | Waiting | Codex got no advisor brief in the before arm (0 of 24 transcripts hold an Advisor line). Approval lives in the home Codex config, which this goal does not change |
| Before arm, 144 runs on six runtimes | Done | commit f8a7f6fc10: claude 3/12, codex 0/12, pi 0/12, devin 3/12, opencode 5/12, dsh 5/12 |
| Harness fault: DSH before arm ran with the fan-out leaf marker, so the advisor was off | Fixed, rerun started | runner no longer passes lineage.patch.yml. One smoke row shows the brief in the session. 24-row rerun writes runs-pre-dsh-rerun.jsonl |
| Research rank 4 (cold-start warm-up) | Declined | true cold first prompt 611-844 ms, fail-open 0 of 5, 010 scratch/cold-arena-result.txt |
| Finding: 7 of 44 typed commands reach the model without their command | Open, planned as phase 011 | typed top-1 24/44 plus 13 attached by the hub route. Missing: /create:goal, /create:skill-parent, /deep:research, /deep:review, /prompt:improve, /speckit:resume, /speckit:save |
| Phase 005 recommendation contract and brief | Complete | AC closure 19/19, suite 1513 passed 0 failed, commit a57ce61a13 plus closing docs |
| Phase 006 Gate 2 binding | Complete | commit c-006 on the worktree branch: AC 9/9 Met, strict PASSED, suite 173 files 1528 passed 0 failed, agents-md STATUS=OK at 16092/16384 bytes |
| Scope amendment 006 (autonomous, D1) | Decided | four compiled-route manifests added to 006 scope: a hub ROUTER.md edit made sk-design and system-deep-loop serve legacy and cut tune recall 9 to 6 of 45, refresh restored 9 |
| 007 T031 once-per-command clause | Not done (autonomous, D1) | would reword the operator-approved 463-byte Gate 2 bullet, child goal 006 D1 forbids it; the g2 set measures repeats without it |
| Phase 006 commit hash | Recorded | ae06ccb118 (the row above says c-006), 005 close is 48c3207a99 |
| After arm, Claude instruction delivery | Finding | an arena has no CLAUDE.md and ~/.claude/CLAUDE.md links to main's AGENTS.md, so Claude post rows carry the new brief without the Gate 2 bullet; kept as brief-only, rerun queued with an arena-committed CLAUDE.md importing AGENTS.md |
| Phase 008 wave 0 and 1 | Done | before numbers recorded (typed 24/44, tune 9/45 stand-in and 14/45 real, hook median 172.47 ms middle run), Ollama does not keep loading after a 50 ms abort, T007-T010 verified: typecheck 0, scorer tests 348 passed |
| After arm, 144 runs at ae06ccb118 | Measured | start before to after: claude 3/12 to 4/12, codex 0/12 to 0/12, pi 0/11 to 2/10, devin 1/8 to 3/9, opencode 2/7 to 1/5, dsh 6/12 to 6/12. Unsafe: pi 3 to 1, devin 3 to 1, opencode 2 to 2, dsh 1 to 0, claude and codex 0. Expected command offered on 3 of 16 plain rows |
| Unsafe after, row cmd-deep-review-plain-tune-01 (pi, opencode, plus devin loop without init) | Reason, fix planned | no command was offered: the deep-loop hub defers on the mode for this prompt, so the ask policy never reached the model and it improvised a multi-pass audit to the cap. Same row was unsafe before on pi, devin and opencode. Fix: offer /deep:review (ask) on this prompt in the plain-offer phase |
| Unsafe after, row mns-chat-03 (devin, opencode) | Reason | an edit request that names no file, no command offered or expected: the model edited a guessed file instead of asking. It is a write-discipline miss outside command surfacing, devin was unsafe on it before too |
| Brief delivery, after arm | Measured | claude 24/24 (raw transcript hook_additional_context), devin 24/24 (system node in sessions.db), pi 24/24, dsh 23/23 stored sessions (repo-guards user message, one run has no session id), opencode plugin loaded on 24 runs and quoted by the model in 10, no store trace, codex 0/24 (hooks unapproved). The shared session readers drop injected context, which is why loadSession showed 0 to 4 |
| Phase 010 reachability and attribution | Complete | strict PASSED (0 errors, 1 warning), 13 AC Met, AC-008 Superseded by ADR-001 (autonomous, D1). Waiting on the operator: approve Codex hooks for one arena path, then one Codex smoke row (T031) and the Codex brief decoding (T032) |

### Deviations and findings

| Item | Note |
|------|------|
| Operator answers before this goal | 57 answers are recorded in `decision-record.md` files of this packet and stay binding |
<!-- /ANCHOR:log -->
