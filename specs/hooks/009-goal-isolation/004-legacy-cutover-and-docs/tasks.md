---
title: "Tasks: Legacy Cutover and Goal Documentation"
description: "Tasks for safe singleton retirement, explicit migration, diagnostics, and support-truth documentation."
trigger_phrases:
  - "goal cutover tasks"
  - "goal documentation parity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/004-legacy-cutover-and-docs"
    last_updated_at: "2026-08-10T15:00:06Z"
    last_updated_by: "codex"
    recent_action: "Completed all legacy cutover, support reconciliation, and documentation tasks"
    next_safe_action: "Run final verification and validation in phase 5"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Legacy Cutover and Goal Documentation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete with evidence |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Added absent, valid, malformed, and unreadable legacy classification without active fallback. [Evidence: `.opencode/hooks/goal/lib/goal-core.cjs` and integrated tests 82/82]
- [x] T002 Implemented explicit inspect, migrate-to-current-scope, and archive actions. [Evidence: `.opencode/hooks/goal/bin/goal.cjs` and `.opencode/hooks/goal/bin/goal.test.cjs`]
- [x] T003 Covered legacy-only, malformed, repeated, occupied-target, and missing-scope cases. [Evidence: integrated goal tests 82/82]
- [x] T004 Used isolated copied-state roots; both temporary canary roots were moved to Trash after verification. [Evidence: copied-state canary output `TRASHED_PHASE4_CANARIES=2`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Inventoried tracked adapters, registrations, commands, prompts, and tests. [Evidence: `.cursor/hooks.json`, `.pi/settings.json`, and the registration probe exited 0]
- [x] T006 Reconciled Pi, Cursor, Devin, OpenCode, Claude, and Codex support claims. [Evidence: `.opencode/hooks/goal/README.md` runtime support table]
- [x] T007 Registration probes confirmed every registered path exists and retained runtimes have test coverage. [Evidence: registration probe exited 0; integrated tests 82/82]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Updated goal README, contract, state layout, diagnostics, and command docs. [Evidence: 14/14 modified documents passed structural validation]
- [x] T009 Added concurrent-session, missing-id, migration, malformed archive, and rollback playbook cases. [Evidence: `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md`]
- [x] T010 Updated the feature catalog and runtime matrix. [Evidence: `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md`]
- [x] T011 Ran stale-claim, path, link, registration, and focused phase checks; strict packet validation is the phase close-out gate. [Evidence: 199/199 links resolve; targeted stale scan returned zero matches]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Legacy data is preserved but never passively selected.
- [x] All operator surfaces describe shipped current-session behavior.
- [x] Runtime registration and documentation truth agree.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Runtime bindings**: `../003-pi-and-runtime-bindings/spec.md`
<!-- /ANCHOR:cross-refs -->
