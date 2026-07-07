---
title: "Tasks: Phase 3: Runtime Integration [system-skill-advisor/008-skill-advisor-cli/003-runtime-integration/tasks]"
description: "Task breakdown for Runtime Integration; rows reconciled with shipped runtime evidence."
trigger_phrases:
  - "skill-advisor runtime integration tasks"
  - "003 003-runtime-integration tasks"
  - "skill-advisor phase 3 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-cli/003-runtime-integration"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "T9xx transport-down drill PASSED (Claude+Codex hooks, fail-open); phase complete"
    next_safe_action: "Phase complete; parent 028 map reconciled"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 3: Runtime Integration

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

- [x] T001 Hook pairing (Claude Code, Codex): the UserPromptSubmit advisor-brief adapters (`system-skill-advisor/hooks/{claude,codex}/user-prompt-submit`) gain a CLI-backed warm-only path with `--timeout-ms`, fail-open; one-shot native bridge per prompt remains banned (824.8ms measured)
- [x] T002 OpenCode plugin: `mk-skill-advisor-bridge.mjs` gains CLI fallback (bridge currently probes MCP; add the CLI path for transport-down)
- [x] T003 Config compatibility: MCP registrations across OpenCode/Codex/Claude stay unchanged (CLI is additive)
- [x] T004 Doctor routes: add CLI checks to doctor:skill-advisor + skill-budget surfaces
- [x] T005 Allowlists + docs: transport-down fallback guidance; Gate-2 caller guidance (when skill_advisor.py legacy facade vs new CLI)
- [x] T006 Dual-failure drill: MCP transport stopped + skill-advisor daemon socket absent/dead → hook warm-only path performs NO cold spawn, fails open within the runtime hook timeout, surfaces exit-75 retryable status
- [x] T007 Three-way latency verification per the split acceptance: (a) cache-hit p95 <60ms, (b) warm-daemon non-cache call within its stated ceiling, (c) cold/transport-down path fails open within the runtime hook timeout
- [x] T009 Fix Gemini hook catalog source-path drift — COMPLETED EARLY in 026/008-runtime-defect-fixes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T9xx Transport-down drill passes in ≥2 runtimes within budget; plugin fallback works; docs published — PASS: Claude user-prompt-submit hook 9/9, Codex user-prompt-submit hook 9/9, runtime-parity 4/4, advisor-recommend-unavailable (fail-open) 1/1; warm-only no-spawn proven by stress scenario 435 (60/60 exit-75, zero spawns); launcher delta 0
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
