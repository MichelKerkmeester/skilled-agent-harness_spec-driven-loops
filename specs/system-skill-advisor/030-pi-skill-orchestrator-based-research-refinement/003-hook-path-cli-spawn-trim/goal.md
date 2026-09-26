---
title: "Goal: Hook Path CLI Spawn Trim"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/003-hook-path-cli-spawn-trim"
    last_updated_at: "2026-09-26T20:04:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None. The phase is complete, so rerun the criteria only if it reopens"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Hook Path CLI Spawn Trim

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a hook turn spawn only the processes whose output it uses, so a hook request starts no compiled-route child and a prompt the casual-prompt gate declines costs no CLI spawn.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `includeCompiledRoute` defaults to `true` in all three schema copies. The hook payload sends `false`, and the OpenCode plugin omits it. |
| D2 | When an older daemon rejects the option as an unknown key, the CLI retries the call once without it. |
| D3 | The gate is reconnected as it stands. What `shouldFireAdvisor` declines does not change. |
| D4 | The hook docs are fixed to match the CLI-only code, with the gate in front of the CLI call, as the operator decided. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A handler test with `includeCompiledRoute: false` and a compiled-hub top result makes zero `compiled-route.cjs` calls, and the same test without the option makes one
- [ ] `.skilled/plugins/tests/system-skill-advisor.test.cjs` passes unmodified, and a plugin request for a compiled hub still carries `compiledRoute`
- [ ] Claude hook tests with `/help` and with "thanks" each return a `skipped` result and never call the injected `buildCliBrief`
- [ ] A replay of `shouldFireAdvisor` over `labeled-prompts.jsonl` and `gate2-golden-prompts.jsonl` declines zero prompts whose expected skill is a real skill
- [ ] A CLI test against a daemon stub that rejects `includeCompiledRoute` as an unknown key still returns the recommendation after one retry without the option
- [ ] Over a debug-on window, median hook `durationMs` on turns whose top result is a compiled hub falls below the phase 002 baseline for the same turns
- [ ] `hooks/skill-advisor-hook.md` and `ARCHITECTURE.md` name the CLI as the hook's front door with the gate in front of it, and neither mentions a native brief builder on the hook path
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
| Phase status | Done | `spec.md` metadata reads Complete, and `implementation-summary.md` holds the evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Source of criteria | The phase is Level 1 and has no `acceptance-criteria.md`, so the criteria come from the Acceptance Criteria column of its `spec.md` requirements table, as the operator approved |
| Criteria left unticked | This goal was authored after the phase closed. The authoring pass did not rerun the checks, so it ticks none |
<!-- /ANCHOR:log -->
