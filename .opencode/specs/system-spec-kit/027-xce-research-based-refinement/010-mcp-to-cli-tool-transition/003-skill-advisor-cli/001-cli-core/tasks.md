---
title: "Tasks: Phase 1: CLI Core [system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/tasks]"
description: "Task breakdown for CLI Core; all rows complete with shipped CLI and hardening-suite evidence."
trigger_phrases:
  - "skill-advisor cli core tasks"
  - "003 001-cli-core tasks"
  - "skill-advisor phase 1 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Ticked verification row on hardening-suite + drill evidence"
    next_safe_action: "Continue dual-stack observation window"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 1: CLI Core

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T000 Verify predecessor handoff criteria and run speckit:plan for this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Registry codegen: 9 subcommands from `TOOL_DEFINITIONS` with the exported Zod schemas at argv (closest sibling to the spec-memory codegen path)
- [x] T002 IPC connect + auto-spawn via `mk-skill-advisor-launcher.cjs`; warm-first policy with `--timeout-ms`
- [x] T003 Trusted-caller gate: graph-mutating commands (`graph scan`, `rebuild`, `graph propagate-enhances --apply`) fail closed unless explicitly authorized
- [x] T004 Output contracts `--format json|text`; exit map 0/1/64/69/75
- [x] T005 skill_advisor.py untouched in this phase (facade reconciliation lands in phase 2 fixtures)
- [x] T006 Resident-service semantics: `status` reports artifact freshness and daemon trust-evidence as separate fields; telemetry/shadow-sink writes preserved on CLI calls; embedder resolution honored on CLI-triggered scan/rebuild
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T9xx 9/9 subcommands invocable against a live daemon; mutating commands fail closed untrusted; exit matrix verified — proven by the phase-002 parity/dual-client suites + the fail-closed gate verification
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 requirements in spec.md verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-skill-advisor-cli-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
