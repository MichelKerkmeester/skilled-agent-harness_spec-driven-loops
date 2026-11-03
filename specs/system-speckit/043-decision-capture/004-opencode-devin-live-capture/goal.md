---
title: "Goal: OpenCode and Devin live capture"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "opencode devin live capture goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/004-opencode-devin-live-capture"
    last_updated_at: "2026-11-01T21:30:00Z"
    last_updated_by: "series-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: OpenCode and Devin live capture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Queue every OpenCode and Devin operator answer once, during the session wherever a live surface allows it, and test OpenCode's newest storage layout against a real stored question call.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each live surface is probed in a scratch project, with the operator's consent and one harmless question, before any adapter is written. |
| D2 | A live adapter and the save-time reader produce the same `toolSourceKey`, so the capture core keeps one queue line per answer whichever runs first. |
| D3 | A runtime whose probe proves no live surface keeps only its save-time reader, and the reason is written down. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/skills/.state/decision-capture/probe/opencode.json` and `probe/devin.json` each name where the answer sat in a live payload, or keep UNKNOWN with the reason.
- [ ] `node --test .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs` prints `fail 0`, including a case on the redacted real fixture `bin/fixtures/opencode-session-message.json`.
- [ ] `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` prints `fail 0`, including cases where an adapter and a reader see the same answered call in either order and the queue holds one line.
- [ ] With `SYSTEM_DECISION_CAPTURE_DISABLED=1` or a malformed payload, each new adapter writes no queue line and no output, and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints PASS.
- [ ] The OpenCode and Devin rows of the 006 results matrix show each answer queued once during the conversation, with no duplicate added by a save.
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
| Planning docs | Done | `validate.sh --strict` on this folder printed `RESULT: PASSED`, 2026-11-01 |
| Live probes | Pending | Need the operator's consent, tasks.md |
| Live probes (T002 to T004) | Done | consent parent Q007; opencode.json and devin.json read observed, AC-001 and AC-002 Met |
| Live capture build (T005 to T016, T020) | Done | plugin 6 of 6, Devin adapter 6 of 6, same-key 20 of 20, lib+bin 78 of 78, plugin suites 60 of 60; T015 skipped, Devin shows no Stop context |
| Live smoke and validation (T018, T021) | Done | OpenCode and Devin each queued 1 line live and the reader printed recovered 0; validate.sh --strict RESULT: PASSED 2026-11-02 |
| Live re-proof (T019) | Waiting | needs the 006 harness |
| 006 OpenCode and Devin re-proof; 004 closed | done | main 14/14 + kill-switch 1/1 each; 6 queue lines, 0 dup, 7 rows; validate --strict PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Devin nudge | `runtime/hooks/devin/session-stop.ts:32` discards the Claude Stop hook output, so no pending-answer nudge reaches Devin today. The Devin probe settles whether Devin shows Stop context. Settled 2026-11-02: the Stop line was not displayed, so T015 was skipped and Devin gets no nudge. |
| Raw probe logs | The three logs first kept in `scratch/` held real session and call ids. They were moved out at close-out; the redacted fixtures and the probe files carry the evidence. |
| Key exactness | No test showed that near-miss ids stay separate. An exact-key case was added at close-out; it fails when dedup ignores case. |
<!-- /ANCHOR:log -->
