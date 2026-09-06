---
title: "Goal: Phase 3: Test Hang Containment"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/045-daemon-and-test-harness-hardening/003-test-hang-containment"
    last_updated_at: "2026-08-30T10:24:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-test-hang-containment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: Test Hang Containment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a hung test run die quickly and explain itself, so the underlying leak becomes diagnosable instead of expensive.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Containment and diagnosis only. Fixing whichever test leaks the handle is follow-up this phase enables. |
| D2 | No root cause is asserted without evidence. The retaining handle is unproven and stays that way until reported. |
| D3 | The bound is sized against a measured baseline with recorded margin, never guessed. |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] A deliberately hung run terminates at its bound rather than persisting
- [x] That run's output names the handle retaining the process
- [x] The healthy full suite completes inside the bound with the margin recorded
- [x] A baseline duration is recorded so a future slowdown is visible rather than mysterious
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase authored and validated | Done | `validate.sh --strict` RESULT: PASSED, Errors: 0 |
| Baseline measured | Done | runtime, bound and margin logged per invocation |
| Reproduction built | Done | leaked timer persisted pre-fix, named no handle |
| Criteria verified | Done | 1200ms bound -> exit 124 'terminating process group'; generous bound -> 9 passed, margin 178907ms; reporter named `Timeout` |
| Bound and hang reporting applied | Done | exit 124 at the bound; reporter named `Timeout` |

### Deviations and findings

| Item | Note |
|------|------|
| Cause unproven, deliberately | Three runs were killed at 2h35m, 3h41m and 4h12m, each near 96% CPU. One had printed a complete 167-second summary and then never exited. Sustained CPU points at a spin loop rather than an idle handle, which the standard hang reporter may not surface. |
| Retry loop masked the problem | One session started a second run 30 minutes after the first hung, and a third within seconds of the first being killed. |
<!-- /ANCHOR:log -->
