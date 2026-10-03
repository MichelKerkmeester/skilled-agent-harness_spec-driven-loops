---
title: "Goal: Jev feature follow-ups"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/051-followups"
    last_updated_at: "2026-10-03T21:08:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-051"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Jev feature follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every follow-up the 050 review left that needs no new labels and no hook that does not exist yet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | 032 is the one feature that runs without an explicit `--jev`, as a non-blocking check, by the operator's choice on 2026-10-03. Every other feature stays opt-in |
| D2 | No new labels. The 025 capture collects unlabeled outputs only, per 003 D4 |
| D3 | The session is master orchestrator. Fresh Opus 5.5 leads, one per stream, drive DeepSeek V4.1 Flash max workers on cli-pi and review their work. The session verifies and commits |
| D4 | A changed flag line, protocol, aggregation or question text is an amendment, logged before the re-measure, with the old verdict kept |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] 032 runs as a non-blocking check in sk-doc validation, with tests for the unchanged exit code, the silent no-auth path and the opt-out, and one live advisory run recorded
- [ ] 032 R9's amendment and re-measure verdict line are in the log with the run folder
- [ ] Pi-answered records in 032, 035, 024, 025 and 017 name Pi's model and token usage, and the input-wrapping measurement and decision are logged
- [ ] The 025 capture writes unlabeled real reviewer outputs with a census, and 017 R8 is ported with 017's replay at K=256 A=97 and 0 dropped
- [ ] 026, 029 and 031 are marked retired in their catalogs, playbooks and phase goal logs
- [ ] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Source: the operator, 2026-10-03: "Fix all use deepseek v4.1 flash max agents orchestrated by fresh opus" and "You are master orchestrar" |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
