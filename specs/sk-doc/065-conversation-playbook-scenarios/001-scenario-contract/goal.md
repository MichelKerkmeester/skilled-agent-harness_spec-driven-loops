---
title: "Goal: Phase 1: scenario-contract"
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
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/001-scenario-contract"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: scenario-contract

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give playbook scenarios a checked conversation script: a `json conversation` block that the fleet validator parses, rejects with a field path when malformed and exports for the runner.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A file without a `json conversation` block keeps exactly the findings it had before this phase. |
| D2 | Every malformed shape reports one code, `CONVERSATION_SCRIPT_INVALID`, as an error whose message names the field path. |
| D3 | The validator never executes a `setup` or `check` string. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` exits 0 and prints `conversation script regressions: PASS`.
- [ ] `node -e "const v=require('./.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs'); console.log(typeof v.parseConversationScript, v.CONVERSATION_RUNTIMES.join(','))"` prints `function claude-code,opencode,codex,pi,devin`.
- [ ] A fleet run of `validate-playbook-package.cjs --format json` reports the same package, violation and warning counts as the T001 run recorded in this goal's log.
- [ ] `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` prints `leaf-manifest.json OK`, and `.skilled/skills/sk-doc/leaf-manifest.json` lists `references/conversation-scenarios.md`.
- [ ] `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` reads `version: 1.0.9.0`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` ends with `OK: parent-skill-check`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract --strict` prints `RESULT: PASSED`.
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
| Phase planned | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` written 2026-11-01 |
| T001 fleet baseline | Done | 2026-11-01T22:11Z: 56 packages, 1 violation, 93 warnings, exit 1 (`scratch/fleet-before.json`) |
| Build | Done | After: 56, 1, 93, exit 1, findings byte-identical. Suite PASS (95 conversation assertions). Manifest OK, hub OK, `validate.sh --strict` PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Key set widened before freezing | ADR-002: check-only turns, `retry`, `multi`, ranged `delay_ms`, exit 77, `checkpoints.tsv` |
<!-- /ANCHOR:log -->
