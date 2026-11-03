---
title: "Goal: Codex and Pi capture"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "codex and pi capture goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/003-codex-and-pi-capture"
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
# Goal: Codex and Pi capture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Get every answer an operator gives to a Codex or Pi question tool into the decision queue once, or give the runtime a recorded, tested reason it cannot.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each runtime is probed first. The Codex live probe runs in a scratch project with the operator's consent and one harmless question. |
| D2 | A runtime with no answer surface gets a probe file stating the observed absence and a test that fails when its README coverage cell stops saying so. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `jq -r .status .skilled/skills/.state/decision-capture/probe/pi.json` and the same for `probe/codex.json` each print a status other than `UNKNOWN`.
- [ ] `node --test .skilled/hooks/decision-capture/bin/sweep-pi.test.mjs` prints `fail 0`, with cases for one line per answered question, none for a cancelled result and none added on a second run.
- [ ] For Codex, either `node --test .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs` passes on a redacted live-probe sample, or the Codex cell of the `decision-capture` row in `.skilled/hooks/README.md` starts `n/a:` and `node --test .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs` passes.
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints PASS, and a Codex or Pi binding exists only for a runtime whose live payload carried the answer.
- [ ] The Codex and Pi rows of the 006 results matrix each read capturing, with one queue line per answer, or no answer surface, with evidence.
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
| Codex live probe | Pending | Needs the operator's consent, tasks.md |
| Live probes (T004, T005, T009) | Done | consent parent Q007; codex.json and pi.json read observed, AC-010 and AC-011 Met |
| Readers, extension, adapter fix (T006 to T013, T018, T019) | Done | sweep-pi 9 of 9, sweep-codex 8 of 8, claude adapter 2 of 2, refusal test 6 of 6, lib+bin suite 77 of 77; a negative control fails each |
| Close-out checks (T014, T015, T017) | Done | no UNKNOWN probe status; validate.sh --strict RESULT: PASSED 2026-11-02 |
| Live re-proof (T016) | Waiting | needs the 006 harness |
| 006 Pi and Codex re-proof; 003 closed | done | Pi 14/14 live; Codex PASS attempt 7 at save time; 7 rows each, 0 dup keys |

### Deviations and findings

| Item | Note |
|------|------|
| Pi answer surface | 001's probe left Pi UNKNOWN after searching for `ask-user-question`. Planning found Pi sessions that hold answered `ask_user_question` results, so Pi gets a reader in this child. |
| AC-001 and AC-003 | The live probes contradicted both pre-probe rows: Pi's hook carries the answer, and Codex answers through the synchronous `request_user_input`. Both are superseded by AC-010 and AC-011 under `decision-record.md` ADR-001. |
| Pi reader error case | No reader test covered a result marked `isError`. One was added at close-out; it fails when the reader stops skipping such results. |
<!-- /ANCHOR:log -->
