---
title: "Goal: Crash-Fallback Edge Cases"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "crash fallback edge cases goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/009-crash-fallback-edge-cases"
    last_updated_at: "2026-11-18T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 008 validates strict"
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
# Goal: Crash-Fallback Edge Cases

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** When the shared advisor hook crashes, the model gets the same fallback, directive dedup and policy record a timeout would give that turn and the handler never rejects. The threshold doc states correctly what `confidenceOnly` mode does.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Amendment of 004: the crash fallback runs directive dedup and renders with the turn's options. This reverses `../004-crash-path-fallback/implementation-summary.md:80` under the operator directive "Fix all open work leave nothing open or untested". 004's files are not edited |
| D2 | The catch reads only hoisted values and the guarded `elapsed`. Render, dedup and delivery sit in a nested try whose last resort stays `{}` |
| D3 | The dedup and delivery steps move into the module-local helpers `applyDirectiveLifecycle` and `finishAdvisorDelivery`, which both paths call. `runtime/lib/render.ts` does not change |
| D4 | The clock is read inside the try after the disabled and invalid-payload returns. A throwing clock yields the outage fallback, and those two paths stay `{}` |
| D5 | Seven tests land and fail before the hook changes, and one guard test passes throughout |
| D6 | The doc edits are one clause on `ENV-REFERENCE.md:382` with the `daemon starts` sentence intact, and one sentence on `hooks/skill-advisor-hook.md:57` |
| D7 | Built by the parent's Luna swarm with the Vibe fallback, per `../delegation-strategy.md`. The conductor runs every check |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run tests/hooks tests/parity` exits 0 from `.skilled/skills/system-skill-advisor/runtime`, with the eight new tests included
- [x] `rg -n 'renderAdvisorTimeoutFallback\(\)' .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` prints nothing
- [x] ``rg -n "unless `confidenceOnly`" .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`` prints nothing, and `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints line 382
- [x] `rg -n 'exception escapes' .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` prints nothing
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18. All five edges measured on the built hook with `scratch/probe.mjs` and `scratch/probe2.mjs` |
| Phase built | Done | 2026-11-18: hook and parity suites 244/244 with nine new tests, the planning probe shows all five edges fixed. Detail in `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Catch arguments were unguarded | The 004 catch evaluates `elapsed()` and `workspaceRootFor(input)` before `emitDiagnostic`'s own try, so moving the clock alone would still reject. D2 covers it |
| Hook doc sentence added | `hooks/skill-advisor-hook.md:57` was outside the brief. It is in Files to Change because this phase changes the behavior it describes |
| Diagnostic guard added at build | The catch-rewrite leaf found `process.cwd()` evaluated outside any try in the catch. A ninth test and a try around the diagnostic close it |
| Brief line drift | The brief put the catch at about `:468-497`. It is at `:469-492` |
<!-- /ANCHOR:log -->
