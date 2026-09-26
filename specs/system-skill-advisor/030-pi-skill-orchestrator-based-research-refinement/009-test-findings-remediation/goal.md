---
title: "Goal: Remediating the Cross-CLI Test Findings"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation"
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
# Goal: Remediating the Cross-CLI Test Findings

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every advisor surface work in all five CLIs, so every related scenario passes there without a caveat.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The advisor plugin module exports only its default factory. Its constants and helpers move to a separate module the tests import. |
| D2 | A daemon started with `SYSTEM_SKILL_ADVISOR_DB_DIR` set writes its generation file under that override. |
| D3 | No daemon-side deduplication of identical concurrent requests is added, because removing the duplicate Codex registration removes the race. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `opencode run --print-logs` shows no `failed to load plugin` line for the advisor plugin, and an OpenCode session lists `spec_kit_skill_advisor_status`
- [ ] The Pi dispatch suite in `.skilled/hooks/dispatch/pi` and the advisor, spec-kit and plugin suites each exit 0 with no failed or errored file
- [ ] A test shows a daemon with `SYSTEM_SKILL_ADVISOR_DB_DIR` set writes its generation file elsewhere, and the live generation file is unchanged after a sandboxed CP-004 run
- [ ] CL-001, CL-005, CL-006, CP-003, CP-004, NC-001, NC-004, 433 and 457 each report PASS from cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, or a FAIL the orchestrator traces to a named environment limit
- [ ] The 457 harness writes `summary.json` with `passed: true` for each registered runtime
- [ ] CL-001 and CP-003 read the advisor diagnostic from the diagnostics JSONL, CL-006 keeps its trust-grant output, CP-004 runs in its own sandbox, NC-004 states the score-gap or confidence-gap rule, cli-cursor names `gemini-3.8-flash-high` and its sandbox limit, CL-005 loads the plugin live and the sk-doc validators report no new issue
- [ ] Either the repository writer of the duplicate Codex advisor hook entry is fixed, or the operator has the exact entry to remove
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
| Phase status | Done | `spec.md` metadata reads Complete. `tasks.md` T001 to T023 carry their evidence, and `implementation-summary.md` holds the rerun matrix |

### Deviations and findings

| Item | Note |
|------|------|
| Source of criteria | The phase is Level 1 and has no `acceptance-criteria.md`, so the criteria come from the Acceptance Criteria column of its `spec.md` requirements table, as the operator approved |
| Scenario set | REQ-004 now names all nine related scenarios, matching parent criterion 4, so NC-001 and 433 are rerun in every CLI too |
| New findings in the reruns | F21, a second launcher shutting down the live advisor, and F22, an unobservable CL-005 signal, were recorded in `spec.md` before work on them started, and REQ-008 covers F21 |
| Codex hook double registration | F5 stays with the operator. `implementation-summary.md` lists the 18 entries, the removal script and the removal-only installer option |
<!-- /ANCHOR:log -->
