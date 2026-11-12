---
title: "Goal: Refuse a one-lineage fan-out run"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/003-refuse-single-lineage-fanout-run"
    last_updated_at: "2026-11-11T23:59:43Z"
    last_updated_by: "closeout-author"
    recent_action: "Recorded final implementation and verification evidence"
    next_safe_action: "Continue with Phase 4 after closeout review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Refuse a one-lineage fan-out run

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `fanout-run.cjs` refuses a research or review run that expands to one lineage unless the caller passes an explicit escape flag.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The flag is `--allow-single-lineage`, registered in `FANOUT_FLAGS`. |
| D2 | The refusal message names the single-executor command path. It names neither the flag nor a count. |
| D3 | One process per lineage stays as it is. The `--count=2` bypass is recorded, not fixed. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] An unapproved one-lineage research or review run exits with input-validation code 3 before creating a lineage directory, ledger, summary or spawn.
- [x] The refusal names the matching single-executor command and omits the opt-in and count.
- [x] An opted-in one-lineage research or review run reaches the stub executor.
- [x] The focused runner, timestamp-window and CLI-adapter stress suites pass.
- [x] `repin-runbook.md` passes `--allow-single-lineage` in its direct-run command. Evidence: `tasks.md` T012, `rg -c` printed `1`.
- [x] Every known direct one-lineage caller, including the runbook command, passes `--allow-single-lineage`. Evidence: `tasks.md` T004-T005 and T009-T012 are ticked. Their Verify outputs were `1, 1, 1, 3, 1, 1`.
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
| Closeout | Done | T001-T016 and the verification checklist are recorded with evidence in `tasks.md`. Focused suite outputs are at `../scratch/build-evidence.md:71-105`; the final full suite exited 0 with 2,881 passed and 8 skipped at line 119. |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the spec review pass | Criteria come from `../scratch/phase-facts.md` and were rechecked against the reviewed spec during closeout. |
| Known limitation | The `--count=2` bypass remains outside this phase; see `spec.md` section 3 and `.skilled/commands/deep/assets/deep-research-auto.yaml:1216`. |
<!-- /ANCHOR:log -->
