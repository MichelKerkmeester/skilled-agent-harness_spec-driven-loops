---
title: "Goal: Phase 1: hop-recall-baseline"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hop recall baseline goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline"
    last_updated_at: "2026-11-15T06:24:18Z"
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
    open_questions:
      - "What threshold turns the measured loss rate into GO?"
      - "How many runs per arm per runtime count toward that threshold?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: hop-recall-baseline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Record whether a session that claims a handoff recovers a detail the handoff note left out, so the operator can answer go or no-go before the rest of the packet is built.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The measurement is two arms that differ only in whether the lookup CLI is on disk. No offer is built in this phase. |
| D2 | Claude Code is the only required runtime. Pi, OpenCode and Codex are optional follow-ups. |
| D3 | A run counts only when the handoff note does not hold the code and the receiver session id differs from the sender's. |
| D4 | No runtime file changes in this phase. A fix would invalidate the baseline it measures. |
| D5 | The operator sets the threshold. Until then the phase is undecidable and phase 002 does not start. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Both arm pages pass `validate-playbook-package.cjs` with `scenarios=126 violations=0`.
- [ ] Each arm's `### Recorded Results` table holds one row per counted Claude Code run, each row carrying `answer`, `lookup_attempted`, `native_recall`, `transcript_read` and `note_leaked`.
- [ ] `goal.md` §4 holds one `Threshold:` line with a number and one `Decision:` line naming GO or NO-GO.
- [ ] `git status --porcelain -- .skilled/hooks .skilled/skills/system-spec-kit/runtime` prints nothing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Decision inputs

Threshold: UNKNOWN
Decision: UNKNOWN

The operator sets the threshold before phase 002. The decision line is written after the threshold is set and the rows are recorded.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning docs authored | Done | `spec.md`, `plan.md`, `tasks.md` in this folder. |
| Arm A page written | Pending | `hop-recall-conversation.md` does not exist yet. |
| Arm B page written | Pending | `hop-recall-baseline-conversation.md` does not exist yet. |
| Claude Code runs recorded | Pending | No row recorded yet. |
| Threshold and answer recorded | Pending | Both fields above read UNKNOWN. |

### Deviations and findings

| Item | Note |
|------|------|
| The conversation runner cannot drive a hop | Its only actions are `restart` and `compact` (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:53`), and `restart` resumes the same session. Both arm pages are therefore operator procedures, not `json conversation` blocks. |
| A receiver that finds the CLI still cannot get a reply | The CLI refuses with `locator_missing` when the session's state holds no locator (`.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:140`), and a hop mints none, as `spec.md` Measured Behavior records. The lookup-present arm measures whether the receiver tries, not whether it succeeds. |
| The compaction pair's expected code is unchanged | The same generator yields `K073 PDSNMMBW`, so a row means the same thing in both pairs. |

### Open questions

Answered 2026-11-15: the operator sets no threshold in advance. Phase 001 records the raw results, and the operator decides go or no-go after seeing the numbers. Phase 002 does not start before that decision.
Open question: How many runs per arm per runtime count toward that threshold? The same operator answer fixes the denominator, and one run per arm is the floor.
<!-- /ANCHOR:log -->
