---
title: "Goal: Vendored copy review fixes for mcp-click-up and mcp-figma"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vendored copy review fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/023-vendored-copy-review-fixes"
    last_updated_at: "2026-10-21T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Apply the fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Vendored copy review fixes for mcp-click-up and mcp-figma

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every mcp-click-up and mcp-figma finding from that review in the shared skills, so the vendored copies can be pulled back.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator chose on 2026-10-21 to fix every review finding, upstream included |
| D2 | Every fix lands at the site its finding names, and a finding that does not hold when reopened is recorded rather than forced |
| D3 | No commit or push without the operator's go-ahead |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every mcp-click-up and mcp-figma finding is fixed or recorded with its reason in implementation-summary.md
- [ ] Every changed script passes a direct run that shows the fixed behaviour
- [ ] validate.sh --strict on this packet prints RESULT: PASSED
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
| Opened | Done | 2026-10-21 |
<!-- /ANCHOR:log -->
