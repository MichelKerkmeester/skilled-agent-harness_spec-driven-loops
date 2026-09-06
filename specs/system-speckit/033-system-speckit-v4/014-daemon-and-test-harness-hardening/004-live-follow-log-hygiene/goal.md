---
title: "Goal: Phase 4: Live-Follow Log Hygiene"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening/004-live-follow-log-hygiene"
    last_updated_at: "2026-08-30T10:24:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-live-follow-log-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: Live-Follow Log Hygiene

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Report each divergence once when it starts, and keep the follower log from growing without limit.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The follower's fast-forward-only safety contract is correct and is not touched. This is a logging defect only. |
| D2 | Edge-triggered, not level-triggered: emit on transition, and re-report when a cleared condition returns. |
| D3 | Rotation keeps at least one previous file. Truncating in place would lose evidence mid-investigation. |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] A divergence held across many poll intervals produces one log entry
- [x] Clearing and re-entering the condition produces a second entry
- [x] A long-running follower's log stays within the cap
- [x] The per-checkout pid lock and single-follower guarantee are unaffected by rotation
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
| Cap policy decided | Done | size-based, one retained generation |
| State-change logging | Done | 4 entries -> 1 across a held divergence |
| Criteria verified | Done | held divergence 4 entries -> 1; re-entry produced a second; cap held with `.1` retained; pid lock intact |
| Cap or rotation | Done | cap held; pid lock undisturbed |

### Deviations and findings

| Item | Note |
|------|------|
| Observed scale | One transient divergence produced 126,088 lines across 12 MB in a single checkout's log, from two unconditional echo statements inside a 5-second poll loop. |
| Signal was correct, rate was not | The warning itself is accurate and worth keeping; repeating it every 5 seconds is what buried it. |
<!-- /ANCHOR:log -->
