---
title: "Goal: Route Receipts Build"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "route receipts build goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/011-route-receipts-build"
    last_updated_at: "2026-11-18T16:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 010 closes on the over-suppresses branch"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
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
# Goal: Route Receipts Build

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A weak follow-up in a session with a recent, different route no longer steers the model away from the session's task, and a prompt with no stored route routes exactly as it does today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase builds only if phase 010's premise check took the over-suppresses branch, and only after phase 009, because both edit `hooks/claude/user-prompt-submit.ts` |
| D2 | Phase 010's `research/research.md` fixes the design. T001 rewrites the Files to Change table, the REQ rows and these criteria from it before any build task |
| D3 | The guard reads the policy reason from stripped text, never from the unstripped prompt the live skip check uses |
| D4 | With no receipt the output is unchanged, so the routing corpus and the scorer see no change |
| D5 | Built by the parent's Luna swarm with the Vibe fallback per `../delegation-strategy.md`. Each failing test lands and is run before its fix |
| D6 | The OpenCode plugin is out unless phase 010 brings it in, and is named as a gap |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The calibration bench run with `--reporter=verbose` exits 0 and prints `advisor-follow-up-receipts` with `"H":0`, the provisional threshold T001 replaces with phase 010's frozen value
- [ ] `npx vitest run tests/hooks/route-receipt.vitest.ts` from the advisor runtime folder exits 0, including the false-carry and expiry cases
- [ ] `npx vitest run tests/hooks tests/schemas tests/handlers` from the advisor runtime folder exits 0
- [ ] `git diff --stat -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json` prints nothing
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md`, `tasks.md` and this goal written 2026-11-18, provisional until phase 010 closes |

### Deviations and findings

| Item | Note |
|------|------|
| Floored flag stops at the scorer | The strict schema, `publicRecommendation`, the hook type and `recommendationFromCli` all drop `confidenceFloored`, so this phase carries it through as phase 003's ship branch planned |
| False-carry hazard is real | On `84a2d1eb697`, "Refactor the session store module to remove duplicated locking code" is a floored work-intent `sk-code` route at 0.82, the same shape as "fix that too" |
<!-- /ANCHOR:log -->
