---
title: "Goal: Phase 2: Orphan Daemon Reaping"
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
    packet_pointer: "system-speckit/045-daemon-and-test-harness-hardening/002-orphan-daemon-reaping"
    last_updated_at: "2026-08-30T10:24:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-orphan-daemon-reaping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: Orphan Daemon Reaping

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make an orphaned launcher terminate itself, and let the sweep that already identifies one act when it does not.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Classification is not touched. Packet 035 settled it; this phase attaches triggers only. |
| D2 | Three independent triggers, so no single missed signal recreates a multi-day orphan: stdin close, self-reparenting, external sweep. |
| D3 | Reapable requires exact ownership evidence AND no live parent AND no connected socket peer. A name match alone never suffices. |
| D4 | Terminating a live session's daemon is worse than the leak. AC-006 blocks closure on its own. |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [ ] A launcher whose stdio peer closes exits rather than persisting
- [ ] A launcher reparented to init terminates within one heartbeat interval
- [ ] A respawn lock held by an orphaned process is reclaimable by another session
- [ ] The sweep has a guarded apply path and a lifecycle event invokes it
- [ ] A launcher with a live parent is never signalled, proven by a dedicated safety test
- [ ] `ops/README.md` no longer states that no live apply command exists
- [ ] Every row in `acceptance-criteria.md` is Met, Waived or Superseded
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
| Phase authored and validated | Done | `validate.sh --strict` RESULT: PASSED, Errors: 0; 7 AC rows Unmet |
| Negative control captured | Pending | — |
| Launcher self-exit | Pending | — |
| Sweep apply path and trigger | Pending | — |

### Deviations and findings

| Item | Note |
|------|------|
| Root cause is narrower than first stated | The reaping logic exists and is correct. `shouldAbortRelaunchOnFire` is consulted only on the relaunch path, which a launcher with a dead child never takes. The launcher also never watches its own stdin. |
| Observed orphan | A launcher survived at ppid 1 for 2d14h holding a respawn lock naming its own pid, so staleness by pid liveness stayed valid and blocked every respawn. |
| Reversing a deliberate design | The README's non-destructive framing is intentional. Making the sweep destructive is a recorded decision, not an implementation detail. |
<!-- /ANCHOR:log -->
