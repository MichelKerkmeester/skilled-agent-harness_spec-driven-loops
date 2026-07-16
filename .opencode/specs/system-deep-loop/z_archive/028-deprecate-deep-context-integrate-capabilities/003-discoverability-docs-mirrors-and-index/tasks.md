---
title: "Tasks: Discoverability Docs Mirrors And Index Cleanup"
description: "Task breakdown for phase 003 registry, advisor, active docs, mirror, and generated-index cleanup."
trigger_phrases:
  - "deep-context discoverability tasks"
  - "deep-context advisor cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/028-deprecate-deep-context-integrate-capabilities/003-discoverability-docs-mirrors-and-index"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Completed phase 003 task list"
    next_safe_action: "Proceed to phase 004 runtime cleanup."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-003-tasks"
      parent_session_id: "2026-07-04-phase-003-contract-authoring"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do not create missing mirrors solely to deprecate them."
      - "Disable active OpenCode and Claude deep-context mirrors as deprecation stubs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Discoverability Docs Mirrors And Index Cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after registry decision |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary file or surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 003 scaffold docs before editing.
- [x] T002 Inspect advisor projection and registry references with Grep.
- [x] T003 Confirm direct Glob did not find deep-context mirror agent files.
- [x] T004 Confirm phase 002 redirect verification has passed.
- [x] T005 Capture fresh active discoverability grep inventory.
- [x] T006 Identify projection and index refresh commands.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Update `mode-registry.json` according to chosen deprecation representation.
- [x] T008 Refresh TypeScript advisor projections.
- [x] T009 Refresh Python advisor projections.
- [x] T010 Refresh or update advisor `skill-graph.json`.
- [x] T011 Update parent `deep-loop-workflows/SKILL.md` live mode roster.
- [x] T012 Update `README.md` and `AGENTS.md` active guidance.
- [x] T013 Update `.opencode/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, and active deep-context mirror stubs.
- [x] T014 Refresh generated descriptions/index metadata.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run registry/advisor drift guard tests.
- [x] T016 Run advisor probes for former deep-context prompts.
- [x] T017 Grep active docs for remaining live standalone guidance.
- [x] T018 Verify mirror docs no longer reference missing deep-context files as active targets.
- [x] T019 Refresh `description.json` and `graph-metadata.json`.
- [x] T020 Run strict validation for phase 003.
- [x] T021 Run recursive strict validation from the parent packet.
- [x] T022 Update `implementation-summary.md` with verification evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 002 redirect proof recorded.
- [x] Registry and advisor projections agree.
- [x] Active docs and orchestrator mirrors no longer advertise standalone deep-context.
- [x] Generated indexes and metadata refreshed.
- [x] Phase and recursive parent validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Phase 002**: `../002-public-redirect-and-replacement-contracts/spec.md`
<!-- /ANCHOR:cross-refs -->
