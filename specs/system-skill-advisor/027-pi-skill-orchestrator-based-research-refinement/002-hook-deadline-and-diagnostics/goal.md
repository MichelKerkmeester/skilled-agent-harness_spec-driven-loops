---
title: "Goal: Hook Deadline and Diagnostics"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/002-hook-deadline-and-diagnostics"
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
# Goal: Hook Deadline and Diagnostics

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every runtime receive either an advisor brief or the fallback directive on every turn, and make each hook turn leave a diagnostics record that later phases can measure against.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | When `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is unset, the shim sets it in the child environment to `CHILD_TIMEOUT_MS` minus a margin measured from child start-up. |
| D2 | The diagnostics log is trimmed by writing a temp file and renaming it over the original. |
| D3 | The fallback wording and its repeat handling belong to phase 004. The compiled-route spawns and the casual-prompt gate belong to phase 003. |
| D4 | The plain rewrite in `apply-graph-metadata-patch.ts` stays as it is, because it rewrites tracked metadata rather than a log. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A shim test whose advisor CLI stub sleeps past 2,500 ms returns the directives fallback instead of `{}`
- [ ] With debug on, a Claude turn and a Pi turn each write a diagnostics record carrying `emittedBytes`, with `runtime` set to `claude` and `pi`
- [ ] `npm run typecheck` and `npm test` exit 0 in the advisor runtime, and no reader of the runtime list rejects `pi`, `codex`, `cursor` or `devin`
- [ ] The Pi dist-path test passes, then fails when the built module path is renamed
- [ ] A test that interrupts the log trim after the temp write leaves every line of the log parseable as JSON
- [ ] A test whose Pi handler never resolves gets the fallback directive within the budget plus the margin
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
