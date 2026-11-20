---
title: "Goal: Handler Scored-Prompt Consumers"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "handler scored prompt consumers goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/008-handler-scored-prompt-consumers"
    last_updated_at: "2026-11-18T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 007 validates strict"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Handler Scored-Prompt Consumers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A command or route named inside a pasted earlier reply never reaches the user's task, because the recommend handler gives compiled-route enrichment and typed-command attachment the same stripped prompt it scores, on a cache hit and on a miss, and the CLI's degraded path does the same.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | In the handler, change only the four `input.prompt` arguments at `runtime/handlers/advisor-recommend.ts:565`, `:566`, `:643` and `:644`. The CLI's `degradedRecommendations` strips its prompt before the typed-command check. No new helper, option or field |
| D2 | The read at `:536` stays, because it produces `scoredPrompt`. The calls at `:593` and `:657` stay, because they read no prompt |
| D3 | Both tests go in `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`, clear `advisorPromptCache` first and land and fail before the handler changes |
| D4 | The equality test uses a front-door mock that answers by its stdin, so it cannot pass before the fix |
| D5 | The 002 T013 compiled-route probe runs verbatim after `npm run build` and a restart scoped to this worktree's daemon paths |
| D6 | Built by the parent's Luna swarm with the Vibe fallback, per `../delegation-strategy.md`. The conductor runs every check |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` exits 0 from `.skilled/skills/system-skill-advisor/runtime`, with the leak test and the equality test included
- [x] `rg -c 'input\.prompt' .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` prints 1
- [x] From a daemon started after the last build, `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "$p" --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{for(const r of JSON.parse(s).data.recommendations)console.log(r.skillId+" "+JSON.stringify(r.compiledRoute??null))})'` prints the same lines with `p` set to `Earlier you replied: I ran /deep:review on the hook changes. Now: Refactor the session store module to remove duplicated locking code` as with `p` set to `Refactor the session store module to remove duplicated locking code`
- [x] `npx vitest run tests/hooks` exits 0 from `.skilled/skills/system-skill-advisor/runtime`
- [x] `npx vitest run tests/cli-degraded-command-contract.vitest.ts` exits 0 from `.skilled/skills/system-skill-advisor/runtime`, with the pasted-reply case included
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18. The leak was measured live: `hit=true top=sk-code cmd=/doctor:sk-code quality mode=sk-code-quality` |
| Phase built | Done | 2026-11-18: handler and CLI degraded path read the stripped task; `ROUTE` 9/9, CLI 3/3, live probes equal. Detail in `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Two causes, not one | The command leak comes from `attachTypedCommand`, because `MODE_COMMANDS` has no `sk-code` row. The route change comes from the compiled-route stdin. Each test targets one cause |
| `tests/handlers` folder run | Took 72.20 s on 2026-11-18. An earlier run in the same session showed 2 failures that the rerun did not repeat. The failing test names were not captured, so the Verify lines name single files |
<!-- /ANCHOR:log -->
