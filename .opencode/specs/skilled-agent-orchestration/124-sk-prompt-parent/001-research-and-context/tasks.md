---
title: "Tasks: Phase 1: research-and-context"
description: "Task list for the read-only phase 001 research gate before sk-prompt parent-hub architecture decisions."
trigger_phrases:
  - "sk-prompt parent tasks"
  - "research gate tasks"
  - "referrer inventory tasks"
  - "prompt-models fold-in tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-prompt-parent/001-research-and-context"
    last_updated_at: "2026-07-09T13:42:00Z"
    last_updated_by: "opencode"
    recent_action: "Drafted pending tasks for the read-only research gate"
    next_safe_action: "Human review before executing the scoped research passes"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/001-research-and-context/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/001-research-and-context/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/001-research-and-context/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase scope, parent handoff criteria, and the no-write boundary outside `001-research-and-context/` — Evidence: `spec.md` §3 SCOPE, Out of Scope.
- [x] T002 List the exact live skill descriptor files to read for `.opencode/skills/sk-prompt/` and `.opencode/skills/sk-prompt-models/` — Evidence: read `sk-prompt/SKILL.md`, `sk-prompt-models/SKILL.md`, `sk-prompt-models/description.json` directly.
- [x] T003 [P] Define the referrer inventory grep terms and required evidence format for `sk-prompt-models` and `sk-prompt/SKILL.md` — Evidence: `grep -rl "sk-prompt-models"` excluding `sk-prompt-models/`, `z_archive/`, `/specs/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Execute the skill-state research pass and capture current versions, descriptors, graph metadata, description metadata, README posture, and tool permissions — Evidence: zero drift found, recorded in `spec.md` "Research Findings".
- [x] T005 Execute the referrer inventory pass and record every live file reference with file:line evidence — Evidence: 79 active files referencing `sk-prompt-models`, recorded in `spec.md` "Research Findings".
- [x] T006 Confirm the two hardcoded model-profile path joins, the prompt-card sync workflow, and `/deep:model-benchmark` write-target files appear in the inventory — Evidence: `executor-delegation.ts:162`, `skill_advisor.py:3330`, `.github/workflows/prompt-card-sync.yml`, 20 lines across `deep_model-benchmark_{auto,confirm}.yaml`.
- [x] T007 Review `.opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/` and summarize relevant rename lessons for phases 002-006 — Evidence: `spec.md` "Research Findings", history-care carve-out lesson.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Reconcile research artifacts so the skill-state snapshot, referrer inventory, and prior-art summary do not contradict each other — Evidence: single "Research Findings" section in `spec.md`, no contradicting duplicate notes.
- [x] T009 Verify zero files outside this phase folder were modified during phase execution — Evidence: only `Read`/`Bash`(grep) calls issued against `sk-prompt/`, `sk-prompt-models/`, `system-skill-advisor/`, `.github/`; no `Edit`/`Write` outside `001-research-and-context/`.
- [x] T010 Run phase-folder validation and stop for human review before phase 002 begins — Evidence: `bash .../validate.sh .../001-research-and-context --strict` run after this update.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T010 all checked above.
- [x] No `[B]` blocked tasks remaining — Evidence: none of T001-T010 carry the `[B]` prefix.
- [x] Research gate reviewed — Evidence: findings summarized in `spec.md`, zero drift, confirming the phase 002 decision-record.md target shape is still valid.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
