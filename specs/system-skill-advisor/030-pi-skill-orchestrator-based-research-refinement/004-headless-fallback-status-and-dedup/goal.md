---
title: "Goal: Headless Fallback Status and Dedup"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/004-headless-fallback-status-and-dedup"
    last_updated_at: "2026-09-26T20:04:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None. The phase is complete, so rerun the criteria only if it reopens"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Headless Fallback Status and Dedup

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let the model tell an advisor outage from a no-match and recover from an outage in the same turn, without rereading the same directives block on every no-route turn.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fallback opens with one status line for an outage, a scored no-match or a gate skip. The unchanged directives block follows after `\nDirectives:`. |
| D2 | The OpenCode plugin carries the same three status lines as the renderer. |
| D3 | A repeat in a known session sends only the status line, as the operator allowed on 2026-09-26. |
| D4 | Pi's repeat handling and the shim's `{}` on a killed child stay as they are. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A Claude hook test whose CLI stub times out emits a fallback whose first line names the outage and contains `skill-advisor.cjs advisor_recommend`
- [ ] A hook test with an `ok` result and no passing recommendation emits the no-match line, and a test with a `skipped` result emits the skipped line
- [ ] A parity test shows the plugin's three status lines equal the renderer's output for the same status
- [ ] Five no-route turns in one Claude session with a known session id deliver one full fallback and then four head-only lines, while an unknown session gets the full fallback every turn
- [ ] The same five-turn test against the OpenCode plugin gives the same result
- [ ] Pi's debug output labels each of the three heads by its case, not by the status word alone
- [ ] A test shows the no-match and skipped heads each under 40 characters and the outage head under 160
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
| Phase status | Done | `spec.md` metadata reads Complete, and `implementation-summary.md` holds the evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Source of criteria | The phase is Level 1 and has no `acceptance-criteria.md`, so the criteria come from the Acceptance Criteria column of its `spec.md` requirements table, as the operator approved |
| Criteria left unticked | This goal was authored after the phase closed. The authoring pass did not rerun the checks, so it ticks none |
<!-- /ANCHOR:log -->
