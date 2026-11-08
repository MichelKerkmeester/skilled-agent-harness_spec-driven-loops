---
title: "Goal: integration-and-tests workstream"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests"
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
# Goal: integration-and-tests workstream

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the completed fast-mode extension across package boundaries and in the live environment, then leave settings and plugin documentation synchronized and reversible.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No install mutation happens before the deterministic suite and static gates pass. |
| D2 | The install transition records the pre-state and removes the colliding extension in the same bounded operation. |
| D3 | Live evidence is collected only after command ownership is verified, and documentation and sync closeout follow the runtime proof. |
| D4 | Defects return to the owning earlier leaf. Core handoff and config behavior, npm publication and `statusline.sh` do not change here. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-extension-integration-suite | `001-extension-integration-suite/goal.md` |
| 002-install-transition | `002-install-transition/goal.md` |
| 003-live-verification-and-sync | `003-live-verification-and-sync/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Vitest, `tsc --noEmit` and the focused command and config checks pass with no unresolved ownership gap
- [ ] The fork is installed, the legacy fast-mode package is absent from the settings and npm inventory, and `get_commands` shows bare `/fast` owned by the fork
- [ ] Live UI and child-handoff session logs are recorded, `.pi/PLUGINS.md` is updated, `sync-pi-configs.sh --check` passes and a rollback receipt exists
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
