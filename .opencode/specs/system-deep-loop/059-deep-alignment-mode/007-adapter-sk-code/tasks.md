---
title: "Tasks: Phase 7: adapter-sk-code"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 007"
  - "adapter sk-code"
  - "surface detection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/007-adapter-sk-code"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 007 task list"
    next_safe_action: "Start T004 discover surface-router integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 7: adapter-sk-code

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Confirm phase 005 adapter contract signature is available or fall back to the design-brief-locked contract
- [ ] T002 Re-read `.opencode/skills/sk-code/shared/references/smart_routing.md` and `stack_detection.md` for currency
- [ ] T003 [P] Re-read `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` CLI contract and Finding shape for currency
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement `discover(scope)` calling the shared sk-code surface router (adapters/sk-code-adapter)
- [ ] T005 Implement `standardSource(authority)` loading surface-appropriate reference sets (adapters/sk-code-adapter)
- [ ] T006 Implement `check()` layer 1 deterministic pass invoking `verify_alignment_drift.py` for OPENCODE surface (adapters/sk-code-adapter)
- [ ] T007 [P] Implement `check()` layer 1 deterministic pass invoking the Webflow minification/verification script chain for WEBFLOW surface (adapters/sk-code-adapter)
- [ ] T008 Implement `check()` layer 2 reasoning-agent pass with evidence citation and layer tagging (adapters/sk-code-adapter)
- [ ] T009 Author the accepted-deviation set seeded from `verify_alignment_drift.py`'s skip-path allowlist functions
- [ ] T010 Write the honest automatability-limits statement into adapter documentation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Dry-run layer 1 against a known OPENCODE-surface file; confirm findings translate with `layer: deterministic`
- [ ] T012 Dry-run layer 2 against a file with an intentional pattern deviation; confirm file:line evidence and `layer: reasoning-agent` tag
- [ ] T013 Confirm `surface-undetected` reporting on `UNKNOWN` detection instead of a guessed surface
- [ ] T014 Update `checklist.md` with evidence for each verified item
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
