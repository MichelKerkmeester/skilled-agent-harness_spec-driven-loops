---
title: "Goal: Process Propagation"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/003-process-propagation"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Add the missing evidence for the unticked criterion in section 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Goal: Process Propagation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove with a deterministic child process that a spawned child reads the parent's `PI_FAST_MODE_W_SUBAGENT_SUPPORT` value from a copied environment and cannot change the parent's environment, and document the final handoff contract in the README.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The test spreads `process.env` into the child's env rather than building a fresh object, so a fresh-env bug cannot pass. |
| D2 | The README section `## Subagent handoff` is the user-facing statement of the contract. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `tests/propagation.test.ts` asserts the child prints exactly the parent-set `1` and `0` on stdout, and it passes
- [ ] `tests/propagation.test.ts` asserts the child observes no preference when the parent sets an invalid value and when the value is unset
- [x] `tests/propagation.test.ts` asserts the parent's `process.env[HANDOFF_ENV]` is unchanged after the child's env copy is written
- [x] `README.md` has a `## Subagent handoff` section stating the env var, the strict `1` and `0` values, the precedence and the one-directional rule
- [x] `npm run typecheck` exits 0 and `npm test` reports 76 passed across 7 files
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
| Inline child and copied env | Done (2026-08-16) | `tasks.md` T601, T602 |
| Inheritance and isolation tests | Done for `1` and `0` | `tasks.md` T603, T604 |
| README handoff section | Done | `tasks.md` T605 |
| Typecheck and suite | Done | `tasks.md` T606; `implementation-summary.md` How It Was Delivered |

### Deviations and findings

| Item | Note |
|------|------|
| Invalid and unset child rows unticked | `spec.md` deliverables and T603 ask for invalid and unset cases at spawn. T603's evidence covers `1` and `0` only, and `implementation-summary.md` points invalid and unset at the `readHandoff` tests in `tests/handoff.test.ts` |
| No separate fixture file | `plan.md` names `tests/fixtures/handoff-child.ts`; the child runs inline through `spawnSync(process.execPath, ["-e", ...])` instead (T601) |
<!-- /ANCHOR:log -->
