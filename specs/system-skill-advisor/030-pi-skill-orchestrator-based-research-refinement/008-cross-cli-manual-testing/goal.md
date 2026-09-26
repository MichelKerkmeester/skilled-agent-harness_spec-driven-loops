---
title: "Goal: Cross-CLI Manual Testing of the Advisor Refinements"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/008-cross-cli-manual-testing"
    last_updated_at: "2026-09-26T20:04:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-goal-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Cross-CLI Manual Testing of the Advisor Refinements

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every related playbook scenario a verdict from inside cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, with each runtime's own advisor delivery observed rather than assumed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The scenarios are CL-001, CL-005, CL-006, CP-003, CP-004, NC-001 and NC-004 from the advisor playbook, plus 433 and 457 from the spec-kit playbook. |
| D2 | MiMo v2.6 Pro high runs through cli-pi and cli-opencode, SWE-2 high through cli-devin, Grok 4.7 high through cli-cursor and GPT-6 Luna high through cli-codex. |
| D3 | This phase fixes nothing it finds. Findings go to the operator. |
| D4 | "Use Grok" still resolves to Grok 4.6 high. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The dispatch ledger in `evidence/` holds 45 scenario dispatches, and each has a report
- [ ] The diff after the runs shows that no run stopped the daemon, moved the live database or wrote outside its evidence directory
- [ ] Each of the eight Grok 4.7 ids returned a model response with exit 0 before the cli-cursor allowlist changed, and the allowlist tests pass
- [ ] Each FAIL is rerun or traced to a cause, and marked as a code defect, a scenario defect or an environment limit
- [ ] Each CLI has a diagnostics record or a model-visible `Advisor:` line, or a named reason it has neither
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
| Phase status | In Progress | `spec.md` metadata reads Active, and the orchestrator reports the phase is closing |

### Deviations and findings

| Item | Note |
|------|------|
| Source of criteria | The phase is Level 1 and has no `acceptance-criteria.md`, so the criteria come from the Acceptance Criteria column of its `spec.md` requirements table, as the operator approved |
<!-- /ANCHOR:log -->
