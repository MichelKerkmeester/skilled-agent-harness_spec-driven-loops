---
title: "Tasks: Spec-Folder Naming-Convention Guard [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard/tasks]"
description: "Research task breakdown for the spec-folder naming guard feasibility study and recommended design."
trigger_phrases:
  - "naming guard tasks"
  - "naming guard research tasks"
  - "convention audit tasks"
  - "hook parity audit tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard"
    last_updated_at: "2026-06-06T05:50:56Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored research task breakdown"
    next_safe_action: "Operator review of research findings"
    blockers: []
    key_files:
      - "tasks.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "naming-guard-research-2026-06-06"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
---
# Tasks: Spec-Folder Naming-Convention Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

<!-- Research setup = convention audit -->
### Convention Audit (30m)

- [x] T001 [P] Capture phase-child regex from `is-phase-parent.ts` and `shell-common.sh` [10m]
- [x] T002 [P] Capture `create.sh` basename regex and the looseness gap (`create.sh:683`) [10m]
- [x] T003 Document the top-level vs phase-child decision is flag-driven, not semantic [10m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- Research implementation = hook-parity audit -->
### Hook-Parity Audit (45m)

### Per-Runtime Pre-Write
- [x] T004 Read Codex `pre-tool-use.ts` deny contract (only existing pre-write interception) [15m]
- [x] T005 Confirm Claude has `PostToolUse` but no `PreToolUse` registered (`.claude/settings.local.json`) [10m]

### Lifecycle & Degraded Runtimes
- [x] T006 [P] Map `hook_system.md` §8 runtime matrix to pre-write parity [10m]
- [x] T007 [P] Confirm Gemini has no checked-in project hook; Copilot is next-prompt-only [10m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- Research verification = verdict and design synthesis -->
### Verdict & Design (45m)

### Verdict
- [x] T008 State the feasibility verdict (PARTIAL) with grounded reasoning (`research.md`) [15m]

### Design
- [x] T009 Specify the shared module + creation-path gate + per-runtime hook + validate.sh + fallback (`research.md`) [20m]
- [x] T010 Record risks and open questions (`research.md`, `spec.md`) [10m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every cited file:line verified
- [x] Feasibility verdict produced
- [x] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Findings & Design**: See `research.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
