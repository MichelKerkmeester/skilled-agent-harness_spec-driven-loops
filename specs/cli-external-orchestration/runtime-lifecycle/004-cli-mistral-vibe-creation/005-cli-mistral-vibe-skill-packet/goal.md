---
title: "Goal: Phase 5: cli-mistral-vibe-skill-packet"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli mistral vibe skill packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/005-cli-mistral-vibe-skill-packet"
    last_updated_at: "2026-11-14T14:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the cli-mistral-vibe mode packet from the research phase plan"
    next_safe_action: "Wait for phase 004's evidence, then run T001"
    blockers:
      - "Phase 004's evidence does not exist yet"
    key_files:
      - "../001-deep-research/research/research.md"
      - "../004-vibe-contract-pin/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What are the --output json and streaming payload shapes?"
      - "Is stdin a prompt source in vibe 3.1.2?"
      - "Does the ancestor walk see vibe or vibe-rs?"
      - "Does the Mistral catalog list both roster ids without a hand-written row?"
      - "What is the hook decision wire format?"
      - "Does a Vibe turn draw on the same Mistral usage pool as an API turn?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: cli-mistral-vibe-skill-packet

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give Mistral Vibe a governed mode packet whose rules and references state only what phase 004 observed or the research read from source.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The packet follows the layout of `cli-deepseek-harness` and lives at `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/` |
| D2 | Print mode (`vibe -p`) is the only dispatch surface the packet documents. ACP stays deferred |
| D3 | A dispatch outcome is read from `export.json`, never from stdout |
| D4 | The hooks reference does not state the wire format. Phase 008 owns it |
| D5 | No default model changes anywhere. DevPass stays the default |
| D6 | This phase writes only inside the new mode folder. Hub registration is phase 010's |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `jq '[.[] | select((.check // "") == "")] | length' hard-rules.json` prints `0`
- [ ] `validate_document.py` prints `Total issues: 0` for all seven markdown files in the packet
- [ ] `rg -o UNKNOWN references/cli-reference.md | wc -l` prints `0`
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
| Phase 004 evidence | Blocked | Phase 004 has not run, so `evidence/` does not exist |
| Mode packet folder | Pending | `ls .skilled/skills/cli-external-orchestration/cli-mistral-vibe` printed No such file or directory on 2026-11-14 |

### Open questions

- Open question: What are the `--output json` and `streaming` payload shapes? UNKNOWN until phase 004 T006 and T007. The cli-reference output section waits on it.
- Open question: Is stdin a prompt source in 3.1.2? UNKNOWN until phase 004 T008. The shared `stdin-redirect-required` rule is in `hard-rules.json` regardless, so the answer only changes the cli-reference text.
- Open question: Does a recursion guard's ancestor walk see `vibe` or `vibe-rs`? UNKNOWN until phase 004 T009. The cli-reference recursion note waits on it.
- Open question: Does the Mistral catalog list `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` without a hand-written row? UNKNOWN until phase 004 T010. The providers reference states the hand-written rows either way.
- Open question: What does a hook receive and how does it answer? UNKNOWN until phase 008. `guards-and-hooks.md` marks it UNKNOWN.
- Open question: Does a Vibe turn draw on the same Mistral usage pool as an API turn (research question 6)? UNKNOWN, and the phase plan gives it no owner. The providers reference states it as UNKNOWN.

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started |
<!-- /ANCHOR:log -->
