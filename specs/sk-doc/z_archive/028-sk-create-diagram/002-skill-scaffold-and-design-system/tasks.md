---
title: "Tasks: sk-create-diagram scaffold and design system"
description: "Task queue for scaffolding the packet and authoring SKILL.md plus the shared design-system references."
trigger_phrases:
  - "diagram scaffold tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/002-skill-scaffold-and-design-system"
    last_updated_at: "2026-08-12T06:10:45.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue ahead of executor dispatch"
    next_safe_action: "Dispatch phase 002 executor prompt via cli-opencode"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram scaffold and design system

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the `cli-opencode` provider pre-flight and confirm `opencode-go` credentials
- [x] T002 Compose the executor dispatch prompt from `decision-record.md` §6
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dispatch the executor to scaffold the packet folder [EVIDENCE: `opencode-go/deepseek-v4-flash` PID 82451, dispatch log at `phase-002-dispatch.log`, exited clean.]
- [x] T004 Executor authors `SKILL.md` in the required section order
- [x] T005 [P] Executor ports `references/style-guide.md`
- [x] T006 [P] Executor ports `references/onboarding.md` (trimmed to agent-mediated guidance)
- [x] T007 [P] Executor ports `references/output-spec.md`
- [x] T008 [P] Executor ports `references/primitive-annotation.md`
- [x] T009 [P] Executor ports `references/primitive-sketchy.md`
- [x] T010 [P] Executor ports `references/primitive-terminal.md`
- [x] T011 [P] Executor ports `references/primitive-icons.md`
- [x] T012 [P] Executor ports the four base `assets/template*.html` files
- [x] T013 [P] Executor ports `assets/icons.html`
- [x] T014 Orchestrator reads every produced file and fixes drift in place [EVIDENCE: style-guide-gate color-name inconsistency found and fixed in `SKILL.md`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `validate_skill_package.py --check` against the packet [EVIDENCE: `PASS (exit 0)`, re-run independently by the orchestrator.]
- [x] T016 Confirm the mandatory connector rules and complexity-budget table are present and unabridged [EVIDENCE: `grep` on `SKILL.md` confirmed rules 11-15.]
- [x] T017 Confirm `SKILL.md`'s SMART ROUTING section points at every reference this phase created [EVIDENCE: resource-domain table lines 161-185 reference all 7 ported files.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]
- [x] No [B] tasks remain
- [x] `validate_skill_package.py --check` reports no hard failures
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Executor brief**: `../001-inventory-and-skill-contract/decision-record.md`
<!-- /ANCHOR:cross-refs -->
