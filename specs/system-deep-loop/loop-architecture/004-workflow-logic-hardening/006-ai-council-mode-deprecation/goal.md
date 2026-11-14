---
title: "Goal: Phase 6: ai-council-mode-deprecation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ai council mode deprecation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation"
    last_updated_at: "2026-11-14T11:56:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-14-ai-council-mode-deprecation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: ai-council-mode-deprecation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Retire `ai-council` as a `system-deep-loop` mode and keep the council as one self-contained agent in every runtime, without breaking the divergent Council pivot.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hub registers two modes, research and review, on every routing surface. |
| D2 | The council survives as one agent in every runtime's agent folder, carried by the existing mirror mechanism only. |
| D3 | Option B: one command, `/speckit:ai-council`, owned by `system-spec-kit`, with one workflow file and one presentation file. |
| D4 | The divergent Council pivot keeps working. `runtime/lib/council/multi-seat-dispatch.cjs`, its test and the `pathContainsAiCouncil` guard stay. |
| D5 | Every delete is a tracked file and reverts through `git revert`. `ai-council/**` inside spec folders and untracked files are never touched. |
| D6 | Hub wiring follows `.skilled/repo-rules/skill-hub-routing.md`: both routing stages replayed, the per-hub gate run with the hub path. |
| D7 | The children run in folder order, after phases 004 and 005 of the packet. |
| D8 | The agent names no `system-deep-loop` path, runs no script and keeps `bash: deny`. |
| D9 | The sweep searches mode vocabulary, not the agent name. Changelogs, dated benchmark reports and spec-copy fixtures stay on an allowlist. |
| D10 | The multi-topic session loop is dropped. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-standalone-agent-and-council-command | `001-standalone-agent-and-council-command/goal.md` |
| 002-hub-two-mode-wiring | `002-hub-two-mode-wiring/goal.md` |
| 003-runtime-council-removal | `003-runtime-council-removal/goal.md` |
| 004-advisor-council-removal | `004-advisor-council-removal/goal.md` |
| 005-caller-sweep-and-verification | `005-caller-sweep-and-verification/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `mode-registry.json` in `.skilled/skills/system-deep-loop` lists exactly two `workflowMode` values, `research` and `review`.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` prints `declares 2 modes` and `OK: parent-skill-check`.
- [ ] For "convene an ai council to compare three migration plans", `skill_advisor.py` prints no `ai-council`, `research` or `review` mode row and `compiled-route.cjs --hub system-deep-loop` prints no `deep-` packet id.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0.
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0, and `rg -n 'system-deep-loop|deep-ai-council|node ' .skilled/agents/ai-council.md` prints nothing.
- [ ] `npm test` and `npm run typecheck` exit 0 in the deep-loop runtime and in the advisor runtime.
- [ ] `validate.sh` on this folder with `--recursive --strict` prints `RESULT: PASSED` for it and all five children.
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
| Split into five children | Done | The operator answered "Split now" (Q009). `create.sh --phase --parent` scaffolded children 001 to 005 on 2026-11-14. All 89 tasks, 17 criteria and 26 checklist items keep their ids in the child that owns them. Ten tasks (T090 to T099), four requirements (REQ-018 to REQ-021) and four criteria (AC-018 to AC-021) were added at the split. `plan.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md` left this folder, because a phase parent keeps only the lean trio and its goal. |
| Spec docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` written on 2026-11-14. Implementation has not started. Inventory baseline saved to `scratch/council-inventory-2026-11-14.txt`, 451 files. |

### Open questions

D3 decision: option B

Start SHA: a55b1f3d58

Closed on 2026-11-14: the operator chose `/speckit:ai-council`, recorded as Q008 in the parent `decision-record.md`. The question as it was asked: Keep a council command, and under which name and family? Recommended: option B, `/speckit:ai-council` owned by `system-spec-kit`, single round, with `speckit-ai-council.yaml` and `speckit-ai-council-presentation.txt`. The trade-off: B costs three files, their mirrors and an advisor bridge row, and keeps one typed entry point that binds the spec folder before any write. A is smaller and leaves the council reachable only by `@ai-council` or through `@orchestrate`. Other names considered: keeping `/deep:ai-council`, which implies a deep mode and keeps the hub as owner, or a new command family, which needs its own catalog and mirrors.

Closed on 2026-11-14: the operator answered "Split now", recorded as Q009 in the parent `decision-record.md`. This phase becomes a phase parent with children before any implementation. The question as it was asked: should this phase become a phase parent? The precedent `003-deprecate-improvement-modes` needed 13 phases for a similar removal, and this one touches 451 files. Recommended: keep one phase, and split only if setup shows the runtime removal in T039 to T056 cannot finish in one pass. No subfolder is created until the operator answers.

Closed on 2026-11-14: the parent `spec.md` Out of Scope list now says this phase retires the mode, and the parent's phase map row 6 and its 005 to 006 handoff row are filled.

Closed on 2026-11-14: phase 005's handoff criteria say the parent closes when "every child" passes, so they need no change for six children. The one stale count, in the parent's continuity `recent_action`, now says six.

Closed on 2026-11-14: this phase answers the parent's open question about fixing the same defects in the `deep-ai-council` mode, and phase 005's open question 3 about `ai-council.md:44` and `integration-points.md:158`. Both are closed: the parent `spec.md` records the council answer under "Answered by the operator on 2026-11-14", and phase 005 `goal.md` hands the two files to this phase.

### Deviations and findings

| Item | Note |
|------|------|
| Agent already mirrored | The agent exists in all eight folders today, so D2 is a de-coupling job, not a new mirror. |
| Agent contradicts itself | `.skilled/agents/ai-council.md` sets `bash: deny` yet tells the agent to run `node` scripts at `:752` and `:773`. D8 resolves this. |
| Pivot closure | The import closure of the two pivot scripts, `divergent-pivot.ts` and both reducers reaches only `multi-seat-dispatch.cjs`, which has no `require`. |
| Pivot comments stay | `fanout-pool.cjs:428` and `:509` and `deep-research-ledger-types.ts:591` to `:741` name the council only as pivot vocabulary. |
| Decisions shortened | The durable slice must stay within 4,000 characters once the binding table is added, so each decision above now states only the choice. The full wording of each one is in the child goal that owns it and in the packet `decision-record.md`. D3 now states the option the operator chose. No decision changed. |
| Criterion wording | The fifth and sixth criteria dropped the "or match the start baseline" clause and the roster checker, which children 001, 003 and 004 carry. The seventh now validates recursively. |
| Verify clauses corrected | Seven task lines and one criterion said `rg -c ... prints 0`. `rg -c` prints no line for zero matches, so that output can never appear. They now pipe to `wc -l`: T012, T029, T031, T063, T077, T079, T080 and AC-004. |
| Finding class | cross-consumer: one mode removal reaches the hub, the runtime, the advisor, six other skills, hooks, plugins and CI. |
<!-- /ANCHOR:log -->
