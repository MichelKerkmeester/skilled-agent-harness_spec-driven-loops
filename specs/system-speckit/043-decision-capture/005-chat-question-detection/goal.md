---
title: "Goal: Chat question detection"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "chat question detection goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/005-chat-question-detection"
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
# Goal: Chat question detection

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let the save step see a plain chat question the operator answered wherever it sat in the assistant message, with at most three candidates per message and keys that stay stable from one sweep to the next.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each assistant message yields at most 3 chat candidates and each session at most 20, the newest kept, with the dropped count printed. |
| D2 | The closing-paragraph candidate keeps today's key, text and object shape. An earlier paragraph gets a key ending in `:p` plus 12 hex digits. |
| D3 | The session model still decides at save time whether a reply answers a candidate. The sweep only offers it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs .skilled/hooks/decision-capture/lib/capture-core.test.mjs` prints `fail 0`, and the ten earlier sweep cases pass with their bodies unedited.
- [ ] A message whose earlier paragraph asks a question and whose closing paragraph is a status line yields one candidate holding that earlier paragraph.
- [ ] A message with five asking paragraphs yields 3 candidates in message order, and a transcript with 25 answered chat questions yields 20 plus `chat_candidates_dropped: 5`.
- [ ] Sweeping one transcript twice prints identical `chat_candidates`, and every key matches `^[A-Za-z0-9:._-]+$`.
- [ ] An earlier paragraph that asks to commit and push, or asks for a spec folder, yields no candidate.
- [ ] The 005 row of the 006 results matrix shows a mid-message chat question offered as one candidate within the cap of 3.
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
| Detection build | Pending | tasks.md |
| Baseline (T001, T002) | Done | sweep-transcript.test.mjs 10 pass 0 fail; dc90f89a real 0.57 to 0.60 s on 2026-11-01, 0.53 to 0.54 s on a frozen copy 2026-11-02 |
| Detection build (T006 to T015) | Done | sweep-transcript 21 of 21, lib+bin suite 74 of 74; the HEAD sweep fails 5 new cases and the sweep without the id guard fails 1 |
| Verification (T016 to T019) | Done | fixture CLI prints 4; frozen ten sum 25 equals measured units 25 and the 20 closing keys match HEAD; 0.55 to 0.57 s, at most 5.6 percent over the same-day baseline |
| Live re-proof (T020) | Waiting | needs the 006 harness |
| Chat detection on every runtime (ADR-001); 005 closed | done | suite 93/93; S11 record_rows=7 on Pi, OpenCode, Devin; validate --strict PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| T015 | `.opencode/commands/speckit` is a symlink to `.skilled/commands/speckit`, so the one T014 edit also met T015's check. The task text called the OpenCode file a real file. |
| T018 baseline | The ten newest transcripts changed and `fe0c9990` grew after 2026-11-01. The spec's ten ids were frozen as copies on 2026-11-02, where the measurement gives units 25, not 24. |
| Missing turn ids | Both the old and the new sweep offered a candidate for an assistant turn without a `uuid`, with `undefined` or an empty segment in its key. The sweep now drops such a turn and a reply without an id, as CHK-031 requires. |
<!-- /ANCHOR:log -->
