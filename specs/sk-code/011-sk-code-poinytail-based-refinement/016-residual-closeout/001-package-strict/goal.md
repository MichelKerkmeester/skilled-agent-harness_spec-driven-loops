---
title: "Goal: Phase 1: package-strict"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/001-package-strict"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-016-001-package-strict"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: package-strict

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** All 13 skill units that failed the strict package check pass it, with no routing keyword lost and the advisor batteries and route canaries unchanged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A word-limit trim moves or shortens prose only; keyword lines, router signals and registry aliases stay as they are |
| D2 | A checker that reads the wrong heading is fixed at its pattern |
| D3 | Each skill whose files change is released once with a changelog entry |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `for u in cli-classifier/cli-jev cli-external-orchestration/cli-claude-code cli-external-orchestration/cli-devin cli-external-orchestration/cli-opencode cli-external-orchestration/cli-pi mcp-tooling/mcp-notion mcp-tooling/mcp-obsidian sk-design/sk-design-fundamentals sk-doc/sk-create-command sk-doc/sk-create-goal sk-doc/sk-create-manual-testing-playbook sk-doc/sk-create-with-human-voice sk-prompt; do python3 .skilled/skills/sk-doc/scripts/package_skill.py --check --strict .skilled/skills/$u; done 2>&1 | grep -c '^Result: PASS'`, run from the repository root, prints 13.
- [ ] `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py`, run from the repository root, reports 0 failed.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs`, run from the repository root, prints all hubs failures 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/001-package-strict --strict`, run from the repository root, prints RESULT: PASSED.
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
| Phase planned | Done | spec.md, plan.md, tasks.md and this goal written by the orchestrator |
| Fixes and release | Done | 13 of 13 PASS; batteries and canaries unchanged |

### Deviations and findings

| Item | Note |
|------|------|
| Hidden findings | Three findings sat behind word-limit errors and surfaced only once those cleared; each was fixed in this phase |
| Persona inlined in short form | cli-pi asks for the resolved agent persona inline. The full @code and @markdown files are 46 KB and 24 KB, and the operator asked for short briefs, so each brief carried a five-line persona with the tool scope and output contract |
<!-- /ANCHOR:log -->
