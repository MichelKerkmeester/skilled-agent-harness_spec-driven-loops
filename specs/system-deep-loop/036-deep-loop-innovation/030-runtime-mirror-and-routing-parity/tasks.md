---
title: "Tasks: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs"
description: "Task breakdown for 030-runtime-mirror-and-routing-parity: confirm-before-build pass over 8 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "runtime mirror parity"
  - "mirror sync verify ordering"
  - "registry compiler unresolved identity"
  - "codex agent parity coverage"
  - "deep loop 030 parity"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/030-runtime-mirror-and-routing-parity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown from the WS1 phase-tree proposal"
    next_safe_action: "Execute T001 before any other task"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and enumerate

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 8 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [3h]
- [ ] T002 Enumerate the load-bearing instruction set per mirrored agent, so order sensitivity applies to sequences rather than to the whole body [4h] {deps: T001}
- [ ] T003 Record the OD-2 status and gate REQ-008 on it [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Mirror gate and sync

- [ ] T004 Order-sensitive and surface-sensitive mirror comparison (`F-028-02`, `F-028-04`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs`) [8h] {deps: T002}
- [ ] T005 Invert the `F-028-04` probe: a reordered load-bearing sequence must fail the gate [3h] {deps: T004}
- [ ] T006 Derive the Codex sandbox mode from the source agent deny list rather than hardcoding it (`F-028-01`) (`sync-agents.cjs`, `.codex/agents/ai-council.toml`) [5h] {deps: T004}
- [ ] T007 Choose exactly one ai-council writer authority and update every runtime mirror together (`F-028-03`) (`.opencode/agents/ai-council.md`, mirrors) [5h] {deps: T006}

### Routing

- [ ] T008 [P] Add the supported launcher missing from the route vocabulary (`F-027-01`) (`.opencode/skills/system-deep-loop/hub-router.json`) [2h] {deps: T001}
- [ ] T009 Resolve packet and leaf identities at compile time; a ghost packet or missing leaf fails compilation (`F-027-02`) (`registry-compiler.cjs`) [6h] {deps: T001}
- [ ] T010 Keep the three improvement modes distinct and stop instructing readers to reinterpret a wrong identity (`F-035-02`) (`.opencode/skills/system-deep-loop/mode-registry.json`, `.opencode/skills/system-deep-loop/shared/references/smart-routing.md`) [5h] {deps: T009}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Matrices and gate

- [ ] T011 Reconcile the runtime-capability matrices with what ships, per OD-2 (`F-040-02`) (`.opencode/skills/system-deep-loop/deep-review/assets/{runtime-capabilities.json,review-mode-contract.yaml}`) [4h] {deps: T003, T007}
- [ ] T012 Run the mirror and parity suites plus `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop`; report the delta [2h] {deps: T005, T010, T011}
- [ ] T013 Independent verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/030-runtime-mirror-and-routing-parity --strict` exits 0 [4h] {deps: T012}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [ ] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
