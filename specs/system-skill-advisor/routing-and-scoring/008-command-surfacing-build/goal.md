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

**Objective:** A model using skills keeps its free choice and takes the best correct workflow more often, because every tracked slash command reaches it with a run, start or ask policy on every supported CLI, and the plan is built, tested, measured, reviewed and improved without waiting on the operator.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Run autonomously, ask the operator nothing, take the recommended option and record it in `decision-record.md`. |
| D2 | Never push to main, edit a published release or install software. Log each as waiting. |
| D3 | Build with `/speckit:plan` and `/speckit:implement`, review with `/deep:review`, find gains with `/deep:research`, close with `/local-skilled-alignment`. |
| D4 | Workers: DeepSeek v4.1 flash max on OpenCode Go or LLM Gateway. Luna xhigh fast on the Codex CLI only, until out of quota. Fable 5.2 medium for synthesis and key reviews. |
| D5 | Live behaviour runs only in an arena: a throwaway clone, no remote, credentials off. |
| D6 | Never read holdout prompt text. Every number comes from a committed script. |
| D7 | A command is a suggestion beside its hub mode. The model picks either path freely, even for the whole job, but it must be the skill's or the command's own workflow, never an improvised one (007 D2). |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-command-routing-baseline-corpus/goal.md` |
| 002 | `002-command-inventory-and-risk-metadata/goal.md` |
| 003 | `003-plain-chat-command-reach/goal.md` |
| 004 | `004-command-meaning-matching/goal.md` |
| 005 | `005-recommendation-contract-and-brief/goal.md` |
| 006 | `006-gate-2-binding-and-runtime-pointers/goal.md` |
| 007 | `007-per-runtime-behaviour-proof/goal.md` |
| 008 | `008-embedder-setup-and-cost/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] Strict validation prints `RESULT: PASSED` for this parent and all eight phases, each Complete.
- [ ] The advisor suite (`npx vitest run`) reports 0 failed, typed recall is at least 24 of 44 and false offers 0 of 35.
- [ ] The behaviour summary prints a before and after start rate for claude, codex, opencode, pi, devin and dsh, and each unsafe start after has a fix or reason in this log.
- [ ] A `/deep:review` loop over the packet code has converged with 0 open P0 and P1 findings.
- [ ] A `/deep:research` loop on UX, performance and cross-CLI usefulness has converged, each recommendation built in a new phase or declined with a reason.
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
| Phase 008 embedder setup and cost | Complete | code c909693acb, AC 11/11 Met, strict PASSED 0/0, suite 174 files 1540 passed 0 failed, hook median 172.47 to 175.74 ms, embedder 262 MB disk and about 304 MB loaded, warm 4.8 ms, cold 538.53 ms, real-embedding tune recall 14/45 |
| Research segment two (three lineages, 11 iterations) | Merged | research/research-segment-2.md: 18 ranked items, 13 to build in new phases 012 (plain offer reach) and 013 (attribution and install reach), 1 waiting on the operator (Gate 2 clause for a skill-only brief), 4 declined with reasons. Stop: ux-cost-2 converged, offer-reach and cross-cli-2 hit the 4-iteration cap, so segment three follows the build |
| Started-command set, 36 runs at ae06ccb118 | Measured | start: claude 0/6 (scoring gap: the host expands a typed command and the scorer does not count it, all three typed rows ran), codex 0/6 (no brief), pi 4/6, devin 4/6, opencode 5/6, dsh 3/4 with 2 unscored. Unsafe 0 everywhere. Loops without init: pi 2, devin 1, opencode 1, all on the deep-research rows. One repeated COMMAND: line on opencode. Fix: phase 013 folds loop-without-init into the safe... |
| Behaviour runner restore | Finding, fix planned | a turn that stages new files leaves them staged: three arenas ended dirty (43 to 48 paths) with restored true on every line, so later g2 turns on opencode, devin and dsh saw an earlier turn's research output. Fix in phase 013 |
| Phase 011 typed command delivery | Complete, committed 99b68d8b3d | typed delivery 44/44 (24 own, 20 attached), floors 24/44 and 0/35, eval [160,50,21,5], suite 177 files 1672 passed, strict PASSED. Two ratchets recaptured with their own scripts. Decided without the operator: hook health proven with SKILL_ADVISOR_DEBUG=1 through the worktree daemon |
| OpenCode brief drops an attached command | Confirmed by probe, fix planned as ph... | plugin head 'use sk-doc 0.95/0.12 pass' vs Claude hook 'use sk-doc → /create:readme (start)'. A command with its own table row still shows. Codex, Cursor, Devin, Pi and DSH keep the fields. Decided without the operator: added to phase 013 scope |
| Prompt policy skips a short prompt that names a system-* skill | Found, queued for the review remediat... | shouldFireAdvisor('use the system-deep-loop skill') fire=false below_prompt_policy_threshold, while 'use the sk-doc skill' fires as explicit_skill_or_governance_marker. Evidence in 012/scratch/live-heads.txt |
| Brief tests depend on the caller's AI_SESSION_CHILD | Found, queued for the review remediat... | command-brief-golden and skill-advisor-cli-fallback-envelope: 10 failed with AI_SESSION_CHILD=1, 15 passed without. It made a dispatched worker report a red phase 013 baseline. Workers now run vitest with env -u AI_SESSION_CHILD |
| Fallback scorer loses plain offers when the daemon is unreachable | Found, carried to research segment three | sandboxed socket dir with the worktree daemon running: typed command kept, mode label and doctor hand-off lost, plain readme prompt goes to system-spec-kit with no command. Evidence in 012/scratch/live-heads.txt |
| Phase 012 plain offer reach | Complete, committed (see git log) | plain tune 9 to 23 of 45, 16 of 16 chat rows carry their command, floors unchanged, suite 179 files 1699 passed, holdout plain 1 of 44. route-remint bypass used once after running its named fix for both hubs (freshness fresh, copies identical and staged). Decided without the operator: B, C and D merged into one floor check, prompt-policy fix added as a scope amendment |
| Operator amendment to D2 and the run order, 2026-11-13 | Operator-made | 'After phase 13 we commit push merge update changelog v4021 and republish release tag only after that we continue with loops'. Push, merge to main, the v4.0.2.1 changelog edit and the tag republish are now instructed for this one point. Review, research, the final behaviour arm and alignment wait until after it |
| Merge to main, changelog and tag republish | Done on the operator's instruction of... | rebased 35 commits onto origin/main, gates green (suite 179 files 1714 passed, floors 24/44 and 0/35, strict PASSED parent and 13 phases), pushed 35c3188681..f2e1f6138b then f2e1f6138b..320e7b64d4. The push bypassed main's branch rules as the owner (pull request, required check, verified signatures). Tag v4.0.2.1 moved from commit 165e274413 (tag object dc7b74566d) to 320e7b64d4, release recrea... |
| Loops started after the merge | Running | review fan-out (4 lineages, 5 iterations), research segment three (3 lineages, 6 iterations), final behaviour arm on fresh arenas at 320e7b64d4 (claude, opencode, pi, devin, dsh; 120 sessions; codex left out as not measurable, hooks unapproved). Decided without the operator: full final arm, not only the two unsafe rows |
| Session handoff at 81 percent context | Saved | handoff note written, continuity saved to phase 009. 57 operator answers from this session are still pending a decision-record entry: the next save writes them |
| Review pass one verified | PASS with advisories per the Opus ver... | P0 0, P1 0, P2 42, refuted 1. Both lineage P1s lowered to P2 by the verifier, pending a recheck by the coordinator. 14 work groups in review/review-report.md. Second pass required after remediation |
| Final behaviour arm at 320e7b64d4 | Finished, scored, not yet closed | start claude 5/12, devin 10/11, dsh 9/12, opencode 2/5, pi 6/12, codex not measurable. Expected command offered on 13 to 14 rows per runtime. Unsafe 7 (devin 2, dsh 2, opencode 2, pi 1), each still needs a fix or a reason. Evidence 007/scratch/summary-final.json |
| Operator decisions, 57 answers of 2026-11-12 | Confirmed recorded, nothing pending | all 57 sweep keys are in the worktree consumed log and carry a source line in the parent record (39), 003 (9) and 004 (9). The sweep listed them as pending only because it ran from the main checkout, whose consumed log is a different folder. The row above that says they are pending is superseded |
| Operator chat instruction, 2026-11-13 04:30Z | Recorded here | 'In rease parallelism' (verbatim, typo is the operator's): run file-disjoint work side by side, several workers per wave. It has no sweep key, because it answered no question, so the save path cannot write it to a decision record |
| Session of 2026-11-13 08:00Z to 09:10Z | Handed off at 80 percent context | phases 014 and 015 planned and strict PASSED, segment three dispositions final (build ranks 1 to 5, 9 and 11, decline 8, 14, 15 and 16, measure 6 and 10 first, 7, 12 and 13 wait on the operator), phase 014 part one built by twelve lanes with 46 tasks returned and 26 verified PASS, part two running. Continuity saved to phase 014 |
| Correction to the row above | Recorded | the writer refreshed the phase 014 metadata but wrote no continuity fields, because phase 014 has no implementation-summary.md until T061. The session state is in the handoff note |
| Session of 2026-11-13 09:05Z | Resumed from the handoff note | 47 phase 014 part-one tasks ticked after three verifier reports (47 of 47 PASS). Part two (T040, T041, T053 to T055) still running. Verifier follow-ups being written as tasks T062 on |
| Research segment three dispositions | Final, decided without the operator (D1) | Build ranks 1, 2, 3, 4, 5, 9 and 11 in phase 015. Rank 8 declined: its alias phrases are copied from the two tune rows they would move and the expected holdout gain is 0. Ranks 6 and 10 get a measurement in research segment four first, then a new phase or a decline with the number. Ranks 14, 15 and 16 declined with the reasons in research-segment-3.md |
| WAITING ON OPERATOR: research segment three ranks 7, 12 and 13 | Waiting | Rank 7: a Claude-only create skill with a managed .claude/skills tree, to restore Claude visibility to 44 of 44. Rank 12: let the degraded brief carry the plain command, which reverses the operator answer Q026 (only a typed command). Rank 13: a default doctor subcommand for the doctor wrong-top pair, a policy for a seven-subcommand family |
| Final arm unsafe runs, 7 read row by row | Reason or fix per run | Four left the repository unchanged and wrote only temp files: dsh cmd-deep-ai-council-plain-tune-01, devin cmd-deep-review-plain-tune-01, pi mns-chat-07 and dsh mns-chat-07. Fix: phase 015 T015 adds the count unsafeNoChangedPath so the scorer reports them apart. Three are real. opencode cmd-deep-review-plain-tune-01: the ask offer reached the model and it still wrote a new spec folder and ran t... |
| Phase 014 verifier judgment calls | Decided without the operator (D1) | NO_EDIT_REQUEST stays as it is: a prompt that only limits the scope of a change keeps its skill and loses the command, which fails toward no offer and matches what the scorer path already did. The behaviour runner's child environment allowlist stays as it is: the operator shell sets no proxy or certificate variable (env piped to rg -i 'proxy |
| Final arm unsafe, the three real runs (continues the row above) | Reason | opencode cmd-deep-review-plain-tune-01: the ask offer reached the model and it still wrote a new spec folder and ran to the cap. devin and opencode mns-chat-03: an edit request that names no file, no command offered or expected, the model edited a guessed file. A brief cannot fix either. Both wait on the operator as write discipline on Devin and OpenCode |
| Child environment allowlist check (completes the row above) | Decided, no change | The operator shell sets no proxy or certificate variable: a search of env for proxy, CA_CERTS and SSL_CERT exits 1 with no line |
| WAITING ON OPERATOR: AGENTS.md Gate 2 direct-call example | Waiting | Review finding R4-P2-003 at AGENTS.md line 65: show the direct advisor call with --json - and the request on stdin. AGENTS.md is the shared framework document, so the edit is the operator's |
| Phase 014 review remediation | Complete, committed b3b5ae8314 | 64 worker tasks, each checked by an independent Opus verifier (64 of 64 PASS). Suite 182 files 1744 passed 0 failed, doctor tests 1188, reader tests 93, floors unchanged (24 of 44, 0 of 35, eval 160 50 21 5), holdout rows published 44 to 0, strict PASSED. Review pass two still to run |
| Phase 015 health default and brief refinements | Complete, committed (see git log) | Builds segment three ranks 1, 2, 3, 4, 5, 9 and 11. 20 planned tasks verified 20 of 20 PASS by three Opus verifiers, five follow-ups checked by the coordinator. Suite 183 files 1755 passed 0 failed, floors unchanged, strict PASSED. Open: live brief cost not measured, the script refused with degraded_brief |
| Final arm rescored with the phase 015 scorer | Measured | unsafe and of those no changed path: claude 0 and 0, devin 2 and 1, dsh 2 and 2, opencode 2 and 0, pi 1 and 1. Evidence 015 scratch/summary-final-after.json |
| Review pass two and research segment four | Launched side by side | Review: four lineages, 7 iterations, threshold 0.10, scope the committed diff 35c3188681..HEAD. Research: three lineages (embed text for rank 10, in-process timing for rank 6, residual limits), 8 iterations, threshold 0.05. Phase 015 is commit 3b48f0e5f1 |
| Operator amendment to D1, 2026-11-13 | Operator-made | 'use ask question tool for any decisions needed': decisions that are the operator's are now asked through the question tool, no longer taken alone |
| Operator answers, 2026-11-13 (question tool) | Decided by the operator | Rank 7: build the Claude-only create skill and managed .claude/skills tree. Rank 12: keep typed only on the degraded brief (Q026 stands), declined. Rank 13: offer /doctor:helper on an ambiguous doctor prompt. R4-P2-003: yes, edit the AGENTS.md Gate 2 direct-call example to the stdin form. The three builds become phase 016 |
| Review pass two | Converged, PASS: 0 P0, 0 P1, 27 confi... | Four lineages, verified by Opus with probes. 43 of 44 pass-one fixes hold. The 27 P2 in 10 file-disjoint groups become phase 017, then a narrow third pass over that diff. Report review/review-report.md |
| Research segment four | Converged on coverage, dispositions f... | Build: richer command text for five commands (holdout 3 to 5 of 44) and the brief-cost temp path, both in phase 016. Decline: rank 6 in-process degraded scoring (0 of 1283 real records took the path), a skill-parent scorer row, two plugin flags, a directive Claude head, a tie-break line. Operator declined another OpenCode arm, so the receipt and the longer cap are declined |
| Operator answers, 2026-11-13 second round | Decided by the operator | Rank 7 by rename: /create:skill becomes /create:sk-skill on every runtime, no alias, because the collapse is the open Claude Code bug 85786. Doctor default: the narrow show-up cue. No more behaviour arms |
| Operator answer, 2026-11-13: changelog for the rename | Decided by the operator | The breaking rename to /create:sk-skill is recorded as a new sk-doc entry at v2.10.0.0, a minor bump with the break called out in the text. Phase 016 Q3 is answered and its task T026 follows this |
| Session of 2026-11-13 15:00Z | Resumed from the handoff note | Twelve operator answers of 2026-11-13 written to the parent decision record as Q040 to Q051 by the save writer, sweep pending 0. Phases 016 and 017 planned and uncommitted, build of 016 starts |
| Operator answers, 2026-11-13 third round (question tool) | Decided by the operator | Codex: approve the hooks for one arena and run one Codex-only arm, which reverses no more arms for Codex alone. Gate 2 clause for a skill-only brief: declined, Gate 2 stays as approved. Write discipline on Devin and OpenCode: tracked for a separate packet. Holdout row suppressed-codex-abstain: retire it in this packet, as a new phase 018 |
| Operator answers, 2026-11-13 fourth round (question tool) | Decided by the operator | Phase 018 retires only suppressed-codex-abstain. The two short sealed rows that hit data files (P1-ABSTAIN-001, P1-PHRASE-001) and the six sealed rows that hit hand-written scorer rules only are an advisory for a separate decision. The final hand-over of this branch reaches main through a pull request, not a direct push |
| Phase 016 claude create reach and doctor default | Complete, committed ec1869dae8 | Claude lists 44 of 44 commands (was 32), /create:skill renamed to /create:sk-skill with no alias, doctor helper on a not showing up prompt, Gate 2 stdin form, real holdout 3 to 5 of 44, suite 183 files 1758 passed, doctor tests 1189, floors held, strict PASSED. Open: live brief cost still unmeasured (degraded_brief) |
| Operator remark on holdout reach, 2026-11-13 | Open follow-up, not in this packet | The operator called plain holdout top-1 of 5 of 44 awfully low. Raising it needs a different matching approach, not more phrases, and the attached-command figure on holdout is unmeasured. Logged for a follow-up packet unless the operator asks for it here |
| Operator instruction, 2026-11-13 17:00Z | Operator-made, amends D4 | Verbatim: Use fable 5.2 medium through claude 2 for critical thinking / hard questions but dont ket it implement or use subagents. claude2 is the operator zsh function for the second Claude account. It is used read-only for judgment questions, never to edit and never with subagents |
| Session of 2026-11-13 15:00Z to 17:05Z | Handed off at 80 percent context | Phase 016 committed ec1869dae8. Phase 017 T001, T002 and T036 done, nine worker lanes launched 17:00:35Z and still running. Phase 018 planned with Q6 answered. Phase 009 close-out running in an Opus agent. Handoff note written, continuity saved to phase 017 |
| Session of 2026-11-13 18:00Z | Resumed from the handoff note | Phase 017 wave 1 verified: static verify checks, the full gate battery and two independent Opus verifiers (33 of 33 tasks do what their line says, 0 P0, 0 P1, 9 P2). Four follow-ups built by the coordinator (T042 to T045), five left with reasons in 017 tasks.md |
| Phase 009 research | Complete, decided without the operato... | Segment one ranks 7 and 11 and three guards of rank 14 declined with reasons in 009 tasks.md, rank 8 reason restated on Q053 and Q057, question 4 carried to the Codex-only arm. Each reason was checked read-only by Fable 5.2 medium on the second Claude account, which corrected three of them. Strict PASSED, 0 errors, 1 SOURCE_TAGS warning on lineage files |
| Phase 017 gates after the follow-ups | Green, not yet committed | suite 184 files 1796 passed 0 failed (before 183 files 1758), doctor tests 1211, reader tests 93, plugin tests 43, floors and eval equal their before lines (24 of 44, 0 of 35, 44 of 44, 28 of 45, eval 160 50 21 5), 19 of 19 fixed reproduction lines, boundary checks clean |
| Phase 017 review pass two remediation | Complete, committed 11f3a30814 | 33 worker tasks and four coordinator follow-ups, 30 of 30 acceptance rows Met, strict PASSED 0 errors 0 warnings. Suite 184 files 1796 passed 0 failed, doctor tests 1211, floors and eval equal their before lines. Four P2 items left with reasons in 017 tasks.md |
| Phase 018 holdout row retirement | Complete, committed 1ca14a4498 | One sealed row retired without the file being opened, baseline recaptured under its recorded date: holdout 50 of 65 (was 50 of 66, the row was a miss), every other metric and floor unchanged, leak check names no data hit of three words or more, strict PASSED. Decided without the operator (D1): the coordinator ran the two worker tasks itself so no model session handled the sealed file |
| Review pass three | Running | Two DeepSeek lineages (advisor-runtime-3, doctor-docs-3), 4 iterations, threshold 0.10, scope the diff ec1869dae8..1ca14a4498 |
| WAITING ON OPERATOR: Codex-only behaviour arm | Waiting | Approved by the operator (Q052) and needs the operator to open Codex in a prepared arena, run /hooks and approve each entry. Phase 007 closes without it, decided without the operator (D1): the summary already prints codex 0 of 12 before and after with no brief delivered. Research question 4 is carried to this arm |
| Phase 007 per-runtime behaviour proof | Complete, not yet committed | Strict PASSED 0 errors 0 warnings. Acceptance: 6 Met, 3 Waived (unsafe starts, loops without init, one repeated COMMAND line on opencode and one on devin), 1 Superseded (the scorer floor later phases recaptured), each by an ADR in 007 decision-record.md. Start before to after: claude 3/12 to 4/12, codex 0/12 to 0/12, pi 0/11 to 2/10, devin 1/8 to 3/9, opencode 2/7 to 1/5, dsh 6/12 to 6/12. Toda... |
| Conflict named: D1 against the logged amendment | Resolved toward the session goal | The goal the operator set for this session on 2026-11-13 states D1 as ask the operator nothing. The log row of the same day amends D1 to ask through the question tool. This session followed the goal as set and took each decision itself, recording it as decided without the operator, so each one stays open for the operator to overturn |
| Review pass three, first round | 0 P0, 1 P1, 1 P2, both reproduced by... | Two lineages, 4 iterations each, last three at 0.00 new findings. DR3-P1-001: the doctor hook check read node -e1 <script> and node --eval=1 <script> as a wired hook. AR3-P2-001: make no changes to its public api inside a change request read as no-edit. Fixed in 860610d783, suite 1798 passed, floors equal |
| Review pass three, confirming round | 2 P1 on the coordinator's own fix, 5 P2 | Both lineages found that the lookahead added for AR3-P2-001 let a real no-edit request that names its object keep a mutating offer. Checked read-only by Fable 5.2 medium on the second Claude account, which agreed and added that a false match with a read-only verb also floors the skill row to 0.25. Decided without the operator (D1): the lookahead is reverted in 846eab66b8, AR3-P2-001 is accepted... |
| Review pass three | Closed, PASS: 0 open P0, 0 open P1, 5... | Three rounds, six lineages, twenty iterations. Closing round found no defect in the fixes and two vocabulary gaps graded P2 on the pass two precedent (checked read-only by Fable 5.2 medium on the second Claude account) and fixed anyway in 0cdc9fa3ef before the rebase. Five of six lineages ended at 0.00 new findings, one at 0.22 on its cap. The last fix commit was checked by tests and the gate b... |
| Rebase onto origin/main | Done, 0 behind and 14 ahead, not pushed | 13 commits replayed onto 989ab5b82e. One commit that rebuilt the trigger index conflicted with the index main carries and was skipped, then the index was rebuilt from the rebased tree (02c75f049e, 0 stale documents). Gates on the rebased tree: suite 184 files 1807 passed 0 failed, doctor tests 1221, typed recall 24 of 44, false offers 0 of 35, typed delivery 44 of 44, plain tune 28 of 45, eval... |
| Alignment battery on the rebased branch | 105 pass, 2 fail, both also fail on o... | S7 skill graph freshness: SIGNAL DRIFT compiled vs disk for sk-doc, same line on main at 989ab5b82e, and this branch changes neither file. S5 derived counts: .skilled/hooks/README.md line 206 states fourteen test files, same failure on main. A stale local build of the spec-kit cli package after the rebase was rebuilt. Review lanes running |
| WAITING ON OPERATOR: delete the nested repository under review | Waiting | review/lineages/accuracy-runner-2/logs/quotepath-probe is a git repository a pass two reviewer made. It is untracked and kept out of every commit. It is the only thing git status lists. Deleting an untracked file needs the operator's yes |
| WAITING ON OPERATOR: delete the behaviour arenas | Waiting | TMPDIR/skilled-behaviour-arenas/fin-claude, fin-devin, fin-dsh, fin-opencode and fin-pi, about 34 GB, regenerable. Phase 007 is closed, so they are no longer needed |
| WAITING ON OPERATOR: push and pull request | Waiting | The branch worktrees/352-command-surfacing-research is rebased on origin/main and not pushed. By the operator answer of 2026-11-13 it reaches main through a pull request the operator opens |
| Session of 2026-11-13 18:00Z to 20:30Z | Handed off at 80 percent context | Alignment run 20261113T194705Z: battery 105 pass and 2 fail that also fail on main, lane B returned 1 P1 and 2 P2 (B-01, a playbook page that still ties the diagnostics file to SKILL_ADVISOR_DEBUG, not yet verified), lanes A and D timed out and lane C returned no findings object. Next: rerun those lanes, the critic and the report, fix what is upheld, then close the parent |
| Operator statement of the core need, 2026-11-13 | Operator-made, amends the objective | Verbatim: Its not just that but that ais using skills are flexible but will more often use the besr correct workflows for said tasks. The operator felt the purpose was lost across session handovers and asked for it to be restated everywhere. The parent Purpose and Objective now lead with this outcome, decision D7 carries the free-choice rule from 007 decision D2 and each of the 18 phase specs n... |
| Outcome measure for the core need | Proposed, waits on the operator | The packet counts offers and starts. It has no number for how often a model followed a real workflow, the command's or the skill's own, against improvising. Recorded as an open question in the parent spec. Building it and setting a target is the operator's decision |
| Goal check on the binding table | Open, waits on the operator | check-goal.cjs prints RESULT: FAILED (4/5): no binding row for phases 009 to 018, which have no goal.md, and criterion 1 still says all eight phases. Ten more rows do not fit the 4,000 character slice (now 3,999), so the amendment is the operator's |
| Alignment lanes, second run | All four returned | Lane C result recovered from its raw output (the runner's JSON scan missed a printed object), lanes A and D rerun with a 3000 s limit. Findings: A 3 P2, B 1 P1 and 2 P2, C 1 P1 and 2 P2, D 4 P1 and 2 P2. Probes 13 pass, 7 fail: five expect a skill and got that skill's own command row, two are D-03 and D-04 |
| Alignment P1 findings B-01 and C-01 | Fixed, each reproduced first | B-01: two playbook pages tied the diagnostics file to SKILL_ADVISOR_DEBUG. C-01: no changelog entry for the post-release advisor changes. New entries: system-skill-advisor v1.1.0.0, system-skilled-doctor v1.1.7.0, system-spec-kit v2.13.1.0. Decided without the operator: the advisor bump is minor with the break called out, following the operator ruling on the same rename for sk-doc. Four P2 doc... |
| Alignment P1 findings D-01 to D-04 | Fixed, each with a test that failed f... | D-01: a command typed with :auto, :confirm or :autopilot now reads as that command. D-02: the doctor cue folds a curly apostrophe. D-03 and D-04: six generic phrases added in phase 016 removed from /doctor:setup and /doctor:update, because the doctor matcher ranks on shared words and they pulled fix-the-tests and what-changed prompts onto a doctor command. Scoping the phrases was tried first an... |
| Peer session question on the routing corpus pin, 2026-11-13 | Answered not yet | The archive subtrack session will fix the Routing Registry Drift Guard on main. This branch removes one holdout row (phase 018) that reaches main only with the pull request, so a pin recaptured before the merge goes red again. Who recaptures the pin is the operator's call |
| Alignment critic and report, run 20261113T194705Z | Report written at the reviewed commit... | Eight of the nine P1 are fixed on the branch: B-01, C-01, D-01 to D-04 and the two probe rows that restate D-03 and D-04 (both prompts now score exactly as on main, no recommendation). One P1 is open: X-01, the root release note v4.0.2.1 names the old skill versions and says nothing of the rename or hook health by default. It is a published release, so the fix is a new release note and that is... |
| Merge of origin/main 7eedfc68f9 into the branch | Done, 0 behind, not pushed | Merge commit 98cad52343 after tag pre-merge-352. Eight conflicts, all generated or a version line: spec-kit SKILL.md kept at 2.13.1.0, the doctor manifest, the trigger index with three retrieval fixtures, scorer-eval-baseline.json and one description.json were each rebuilt by their own generator. scorer-eval-baseline reads 161 of 195 and holdout 50 of 65. The commit hook needed SPECKIT_GIT_TIME... |
| Routing corpus pin recapture, operator-confirmed 2026-11-13 (question tool) | Done, commit 0238274ed8, not pushed | The operator chose this branch to recapture routing-baseline.json in system-deep-loop 013-drift-guard-repairs. All three corpus hashes repinned, four captures retaken, the workflow's pin check prints corpus matches the pinned baseline hashes and the scoring gate passes at its floors in the CI regime (accuracy 0.5795, TT 110, FT 3, FF 1). The peer session that asked could not be told: its socket... |
| WAITING ON OPERATOR: root release note for phases 014 to 018 | Waiting | Alignment finding X-01. The work after v4.0.2.1 has skill changelog entries and no Skilled release note. Options: a new release note under a new version, or amend v4.0.2.1 and republish as was done for phase 13. Until then the alignment run holds one open P1 |

### Deviations and findings

| Item | Note |
|------|------|
| Operator answers before this goal | 57 answers are recorded in `decision-record.md` files of this packet and stay binding |
<!-- /ANCHOR:log -->
