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
| D1 | `ai-council` stops being a workflow mode of `system-deep-loop`. The hub registers two modes, research and review, on every routing surface, and the hub's gates pass for a two-mode hub. |
| D2 | The council survives as a standalone agent definition in every runtime's agent folder, carried by the existing mirror mechanism: `.skilled` and `.claude` authored, `.codex`, `.pi` and `.dsh` generated, `.cursor`, `.devin` and `.opencode` symlinked. No second mechanism is added. |
| D3 | The command is a visible decision with two options, agent only (A) or agent plus one command with one workflow file and one presentation file (B). B is recommended. A kept command follows the phase 004 one-workflow-file rule, and its name and family are an open question, because `/deep:ai-council` implies a deep mode. |
| D4 | The divergent Council pivot keeps working. `runtime/lib/council/multi-seat-dispatch.cjs`, its test and the `pathContainsAiCouncil` guard stay. Every other council file listed in `plan.md` section 3 is removed after a named caller check prints nothing. |
| D5 | Nothing is deleted without a rollback sentence. Tracked removals revert through `git revert`. The packet changelog moves to a real folder under `.skilled/changelog/system-deep-loop/deep-ai-council/` instead of being deleted. Existing `ai-council/**` artifacts inside spec folders are never touched, and untracked council graph databases are left in place. |
| D6 | Wiring changes follow `.skilled/repo-rules/skill-hub-routing.md`: both routing stages are replayed on real prompts and the per-hub gate runs with the hub path. |
| D7 | This phase runs after phase 005 so it does not collide with the research and review edits, and it depends on phase 004 for the one-workflow-file rule. |
| D8 | The agent is self-contained. Its body names no `system-deep-loop` path and runs no script. It keeps `bash: deny` and writes `ai-council/**` with its own Write and Edit tools, with the artifact layout and output schema in its own body. |
| D9 | The sweep searches mode vocabulary (`deep-ai-council`, `/deep:ai-council`, `deep-council`, "planning council", "council deliberation"), not the agent name. `@ai-council` and the `ai-council/**` artifact path stay valid. Changelogs, dated benchmark reports and spec-copy fixtures stay as history on an allowlist. |
| D10 | The multi-topic session loop is dropped under both D3 options, because it needs the `council` loop type, the council graph and the session scripts D4 removes. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node -e 'console.log(require("./.skilled/skills/system-deep-loop/mode-registry.json").modes.map(m=>m.workflowMode).join(" "))'` prints `research review`.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` prints `declares 2 modes` and `OK: parent-skill-check`.
- [ ] For "convene an ai council to compare three migration plans", `skill_advisor.py` prints no `"mode": "ai-council"`, `"research"` or `"review"` row and `compiled-route.cjs --hub system-deep-loop` prints no `deep-` packet id.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0.
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs --all` and `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` exit 0, and the agent body search in REQ-008 prints nothing.
- [ ] `npm test` and `npm run typecheck` in the deep-loop runtime and the advisor runtime exit 0 or match the start baseline.
- [ ] Every row in `acceptance-criteria.md` is `Met`, and `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
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
| Spec docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` written on 2026-11-14. Implementation has not started. Inventory baseline saved to `scratch/council-inventory-2026-11-14.txt`, 451 files. |

### Open questions

Open question: the D3 decision is needed and is recorded as a `D3 decision:` line once answered. Keep a council command, and under which name and family? Recommended: option B, `/speckit:ai-council` owned by `system-spec-kit`, single round, with `speckit-ai-council.yaml` and `speckit-ai-council-presentation.txt`. The trade-off: B costs three files, their mirrors and an advisor bridge row, and keeps one typed entry point that binds the spec folder before any write. A is smaller and leaves the council reachable only by `@ai-council` or through `@orchestrate`. Other names considered: keeping `/deep:ai-council`, which implies a deep mode and keeps the hub as owner, or a new command family, which needs its own catalog and mirrors.

Open question: should this phase become a phase parent? The precedent `003-deprecate-improvement-modes` needed 13 phases for a similar removal, and this one touches 451 files. Recommended: keep one phase, and split only if setup shows the runtime removal in T039 to T056 cannot finish in one pass. No subfolder is created until the operator answers.

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
| Finding class | cross-consumer: one mode removal reaches the hub, the runtime, the advisor, six other skills, hooks, plugins and CI. |
<!-- /ANCHOR:log -->
