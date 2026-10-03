---
title: "Goal: subagent-handoff workstream"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-child-goal-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: subagent-handoff workstream

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Define and verify one environment variable, one writer policy and one session-start precedence rule so child Pi sessions receive the parent's fast-mode preference through `PI_FAST_MODE_W_SUBAGENT_SUPPORT` without bypassing their own model and target checks.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only an explicitly present `--fast` true overrides inherited state; the flag's absent or default value does not, and `/fast off` is the explicit-false path. |
| D2 | The contract fixture is a minimal inline `spawnSync` (`node -e`); the live pi-subagents probe belongs to `003-integration-and-tests`. |
| D3 | Package identity, config paths, distribution, installation, settings and sync stay out of this workstream, as do IPC, network coordination, tier handoff and changes to pi-subagents. |
| D4 | The contract is fixed before lifecycle wiring, and each leaf passes `validate.sh --strict` before the next starts. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-handoff-contract | `001-handoff-contract/goal.md` |
| 002-session-precedence | `002-session-precedence/goal.md` |
| 003-process-propagation | `003-process-propagation/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Unit tests for `1`, `0`, unset and invalid values of `PI_FAST_MODE_W_SUBAGENT_SUPPORT` pass for the strict parser and writer
- [ ] The precedence matrix passes with deterministic, model-gated toggle, flag and session-start behavior, and the existing payload tests still pass
- [ ] A child-process test proves the child reads the inherited value from a copied environment and cannot mutate the parent process
- [ ] All three leaves pass `validate.sh --strict`
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
| Workstream status | Complete per spec | `spec.md` metadata Status and all three phase map rows read `complete` |

### Deviations and findings

| Item | Note |
|------|------|
| Criteria left unticked | This folder's only authored document is `spec.md`, which reads Status Complete but records no command evidence; the evidence lives in the leaves' own documents |
| Binding rows name no child goal | Resolved 2026-10-03: each of the three leaves now has a `goal.md` and its row points at it |
<!-- /ANCHOR:log -->
