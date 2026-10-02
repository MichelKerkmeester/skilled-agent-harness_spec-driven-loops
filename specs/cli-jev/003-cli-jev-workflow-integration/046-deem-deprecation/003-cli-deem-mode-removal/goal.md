---
title: "Goal: Phase 3: cli-deem-mode-removal"
description: "Delete the cli-deem mode packet and its copies, and leave cli-classifier a valid parent hub whose only mode is cli-jev."
trigger_phrases:
  - "delete cli-deem packet"
  - "one-mode classifier hub"
  - "cli-classifier routing remint"
  - "hermes cli-deem removal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/003-cli-deem-mode-removal"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-003-cli-deem-mode-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: cli-deem-mode-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Delete the `cli-deem` mode packet and its copies, and leave `cli-classifier` a valid parent hub whose only mode is `cli-jev`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `.skilled/skills/cli-classifier/cli-deem/` and `.hermes/skills/cli-deem/` are deleted. The Hermes mirror is regenerated with `sync-skills-hermes.cjs`, never edited by hand |
| D2 | The hub keeps every parent-hub file, each now listing one mode, and gets a new minor version with its changelog entry |
| D3 | Routing fixtures and the advisor graph drop the Deem mode. A fixture that sent a Deem prompt expects what the compiled router now returns, and `implementation-summary.md` records each change |
| D4 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies, runs the suites and makes path-scoped commits. Luna takes the hub and routing edits, and the session re-mints routing |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/skills/cli-classifier/cli-deem/` and `.hermes/skills/cli-deem/` do not exist, and `sync-skills-hermes.cjs --check` exits 0
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0, and `mode-registry.json` lists exactly one mode, `cli-jev`
- [ ] `compiled-route-status.cjs --hub cli-classifier --no-probe` reports `compiled-serving`, and the cli-classifier compiled-routing harness passes with 0 failing
- [ ] `git grep -n cli-deem -- .skilled/skills/system-skill-advisor .skilled/skills/cli-external-orchestration .skilled/bin ':!*/changelog/*'` prints nothing, and the advisor suite passes with 0 failing
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
