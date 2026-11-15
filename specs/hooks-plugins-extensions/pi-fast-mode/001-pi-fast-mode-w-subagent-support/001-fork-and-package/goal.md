---
title: "Goal: fork-and-package workstream"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package"
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
# Goal: fork-and-package workstream

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Establish a testable raw-TypeScript package foundation for `pi-fast-mode-w-subagent-support` that keeps the upstream target and config model, makes package identity, persistence safety, request guards and distribution explicit, and leaves existing configuration usable for the handoff workstream to extend.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Parent-to-child handoff belongs to `002-subagent-handoff`; installation, command ownership probes, live checks and repository sync belong to `003-integration-and-tests`. |
| D2 | The source baseline is fixed before compatibility changes, and the compatibility policy is fixed before package-level verification is accepted. |
| D3 | The upstream reference source stays untouched. |
| D4 | Each leaf passes `validate.sh --strict` before the next leaf starts. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-source-baseline | `001-source-baseline/goal.md` |
| 002-identity-config-compat | `002-identity-config-compat/goal.md` |
| 003-package-baseline-gates | `003-package-baseline-gates/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A source inventory and a clean baseline diff show the source tree and package location fixed with the upstream reference untouched
- [ ] Unit tests for package identity, config compatibility, atomic persistence and request guards pass
- [ ] The raw TypeScript package loads with provenance preserved, and `tsc --noEmit`, Vitest and `npm pack --dry-run` pass
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
