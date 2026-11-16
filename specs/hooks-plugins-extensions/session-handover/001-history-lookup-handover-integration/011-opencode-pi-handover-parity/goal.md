---
title: "Goal: Phase 11: opencode-pi-handover-parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "opencode pi handover parity goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity"
    last_updated_at: "2026-11-16T05:25:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: opencode-pi-handover-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A hand-over hop on OpenCode or Pi finishes the sender's task in the new session, and the new session recovers through the History Lookup any detail the note left out, with secrets shown as redaction markers.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The live-hop harness in this packet's `scratch/harness/` is the proof. A row passes only on a real hop, never on a unit test alone. |
| D2 | Receivers run on DeepSeek V4.1 Flash at max thinking, the repository default, so a pass does not depend on a stronger model. |
| D3 | All work lives in worktree `worktrees/422-opencode-pi-handover-parity`. Commit, merge and push each wait for the operator's yes. |
| D4 | Research runs through `/deep:research` as a two-lineage fan-out: cli-mistral-vibe `deepseek-flash` and cli-opencode `opencode-go/deepseek-v4.1-flash` at max. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] Three consecutive `PI_ROUTE=deepseek live-hop.sh pi` runs score 5/5 with `sideWordStated: true` and `sideWordInNote: false`.
- [x] Three consecutive `live-hop.sh opencode` runs score 5/5 with `sideWordStated: true` and `sideWordInNote: false`.
- [x] On one Pi hop and one OpenCode hop with a planted fake token in the sender's turn, the receiver's lookup reply shows a `[REDACTED:` marker and never the token.
- [x] `env -u AI_SESSION_CHILD` runs of the history engine, hooks vitest, session readers and handover suites exit 0 with no fewer passing tests than before.
- [ ] `validate.sh <this packet> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Baseline OpenCode hop `base1` | Done | Scorecard 5/5; the receiver loaded the sender's first turn through the lookup and stated the side word |
| Baseline Pi hop `base1` (DeepSeek, max) | Done | Scorecard 4/5; note left `claimed`. The lookup was offered and works, but the sender's note said the side word could not be recovered and the receiver asked the operator instead of running it |

| Research fan-out | Done | Vibe 10 iterations, OpenCode Go 8 (converged); `research/research.md` |
| Fixes and suites | Done | engine 148, hooks 503, readers 103, hand-over 1115, all passing |
| Live hops `fix1` to `fix3` | Done | Pi 5/5 x3, OpenCode 5/5 x3, side word stated, never in the note, password never leaked |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 instead of Level 2 | `recommend-level.sh` printed Level 1; the first scaffold at Level 2 was removed and recreated |
<!-- /ANCHOR:log -->
