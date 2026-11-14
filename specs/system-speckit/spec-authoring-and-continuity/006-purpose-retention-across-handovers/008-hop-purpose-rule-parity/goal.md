---
title: "Goal: Phase 8: hop-purpose-rule-parity"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/008-hop-purpose-rule-parity"
    last_updated_at: "2026-11-14T08:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: hop-purpose-rule-parity

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the relaunch note and the resume brief state the purpose by the same rule and in the same three line shapes that the compaction recovery and the continuity save already print.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] REQ-001: No hop writes a label shape other than the helper's three. The first Measured Behavior command prints twelve lines, each `Parent purpose (` or `Goal objective:`, two per file for the six files, and no line with `Purpose (parent`, `Purpose (from parent`, `Purpose (goal.md)` or `Purpose (<file>)`
- [ ] REQ-002: Every hop skips the scaffold sentence. The second Measured Behavior command prints `1` for each of the five files
- [ ] REQ-003: The relaunch note quotes one sentence, not the whole Purpose. `rg -c -F 'first sentence' .skilled/commands/speckit/handoff.md .skilled/hooks/session-relaunch/lib/nudge.cjs` prints `1` for each file, where it prints no line for either today
- [ ] REQ-004: The relaunch tests still pass with the new nudge text. `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs; echo "EXIT=$?"` prints `pass 89`, `fail 0` and `EXIT=0`
- [ ] REQ-005: The resume assets still load, the command checks hold and the resume label is pinned. The YAML load prints `yaml ok`, `test-phase-command-workflows.js` prints `Result: passed=150 failed=0` (148 before E9) and the four mirror checks print their baseline `PASS` lines
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
| Phase opened | Pending | Planned 2026-11-14, verified by an independent plan review |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | The criteria above are this phase's own requirement rows, copied from its `spec.md` |
<!-- /ANCHOR:log -->
