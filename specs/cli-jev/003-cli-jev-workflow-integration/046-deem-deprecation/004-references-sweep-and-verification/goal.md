---
title: "Goal: Phase 4: references-sweep-and-verification"
description: "Clear every remaining live Deem reference, add the changelog entries for the removal, and prove the whole removal from the final state."
trigger_phrases:
  - "deem references sweep"
  - "deem removal verification"
  - "jev only changelog"
  - "deem removal review"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-004-references-sweep-and-verification"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: references-sweep-and-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Clear every remaining live Deem reference, add the changelog entries for the removal, and prove the whole removal from the final state.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rewritten docs describe what exists now, Jev only. They carry no note that Deem was once there. Only changelog entries tell that story |
| D2 | Each skill whose behavior or docs changed gets one new changelog entry. Released entries stay as they are |
| D3 | One cross-family review covers the whole removal: P0 and P1 fixed, P2 recorded in this goal's log |
| D4 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies, runs the suites and makes path-scoped commits. The trigger index is rebuilt after the docs land |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `git grep -l -i -P '\bdeem(\b|[-_])' -- ':!specs' ':!*/changelog/*'` prints only files `../001-removal-plan/inventory.md` marks keep, and `git grep -n -e "--deem" -- ':!specs' ':!*/changelog/*'` prints nothing
- [ ] `validate_document.py` passes on each doc this phase changed, and `parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0
- [ ] Every suite named in `../001-removal-plan/inventory.md` passes with 0 failing from the final state
- [ ] The cross-family review leaves no open P0 or P1, and each P2 is in this goal's log
- [ ] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this folder
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
| Planned | Done | Scoped 2026-10-02 from the operator's request to remove Deem and keep Jev |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
