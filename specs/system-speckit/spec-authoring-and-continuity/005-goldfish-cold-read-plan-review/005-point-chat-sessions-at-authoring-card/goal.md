---
title: "Goal: Point chat sessions at the authoring card"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card"
    last_updated_at: "2026-11-12T01:58:02Z"
    last_updated_by: "codex"
    recent_action: "Closed the carrier evidence gaps and aligned packet revision references"
    next_safe_action: "Review the recorded closeout before reopening this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Point chat sessions at the authoring card

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A session that only chats is told about the authoring card by a carrier that reaches it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | These items were proposed without a second review of their effect. The first three tasks check that each carrier reaches a chat session. |
| D2 | A carrier that fails its reach check is dropped and the reason is logged. The router carrier passes only for a session that has opened system-spec-kit; it stays, with that limit stated in spec.md. |
| D3 | The Devin `AGENTS.md` overrun is out of scope. |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] T001, T002 and T003 confirm the pre-edit carrier counts and record the valid advisor result.
- [x] Standard and phase create.sh Next steps output include the canonical authoring-card path. Evidence: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:24,2209,2418`; the rerun receipt records exit 0 and 6 tests passed (`../scratch/build-evidence.md:153`).
- [x] The shared first-mutation notice names the canonical authoring card in one direct sentence.
- [x] The measured plain-language write prompt matches an IMPLEMENT keyword in `ROUTER.md`, and `check-card-sync.sh` ends with `CARD SYNC OK`. Phase 007 later moved the six verbs to a WRITE intent at weight 1; the prompt now matches WRITE, which loads the same card.
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
| Phase opened | Done | Read the phase spec, acceptance criteria and cited packet evidence. |
| Closeout evidence | Done | Pre-edit source counts and advisor result are recorded at `../scratch/build-evidence.md:128-141`; the 7-adapter baseline and exact T004 intermediate comparison are at lines 161-163. T008 and T011 receipts are at lines 153 and 52. This closeout reran non-test checks and did not rerun either test suite. Current branch is `main`, HEAD `412bb9e456ce`; source and test edits remain uncommitted. |

### Open questions

- Resolved: `../scratch/build-evidence.md:161-163` records the pre-edit adapter count and the exact T004 intermediate comparison. No closeout evidence question remains.

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the spec review pass | Criteria come from `../scratch/phase-facts.md` and get rechecked against the reviewed spec |
<!-- /ANCHOR:log -->
