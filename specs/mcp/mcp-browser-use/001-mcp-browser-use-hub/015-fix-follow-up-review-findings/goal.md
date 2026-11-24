---
title: "Goal: Phase 15: fix-follow-up-review-findings"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix follow up review findings goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings"
    last_updated_at: "2026-11-24T07:44:39Z"
    last_updated_by: "scaffold"
    recent_action: "Met every completion criterion"
    next_safe_action: "Run a gate-proven re-review of the hub epic"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "f7099de4-e8ec-43e6-a849-849dabb1c94c"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 15: fix-follow-up-review-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Fix every follow-up review finding that held against source, at its source, in the browser hub and the advisor scorer.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The id-noun residual is fixed in this phase, not a separate packet (Q006) |
| D2 | The Aside installer runs only a script that matches a pinned sha256 (Q008) |
| D3 | A moved advisor pin lands only with the operator's approval |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] The three-mode bundle prompt routes `orderedBundle` to all three modes, and the canary harness exits 0
- [x] The five probe prompts no longer lift a skill they do not name, and the advisor suite fails only the known `system-skilled-bots` test
- [x] The two-stage replay fails only MBU-PB-04, and `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Advisor id-noun and staging fix | Done | Suite 2,737 passed, 1 known failure; ratchet metrics unchanged; doctor row re-pinned (Q009) |
| Hub fixes | Done | Bundle routes three modes; `rg page.on` exit 1; `..` guard; installer digest check |
| Docs and replay | Done | Replay 51 of 52 PASS; vocabulary diff 0; versions 1.1.3.0 and 2.0.3.0 |

### Deviations and findings

| Item | Note |
|------|------|
| Staging finding first marked refuted | The reviewer's exact case returned nothing, but a reworded prompt reproduced it. The review report now says so |
| Shared 0.45 lexical anchor left as is | It is not this review's finding and changes every skill's pins |
<!-- /ANCHOR:log -->
