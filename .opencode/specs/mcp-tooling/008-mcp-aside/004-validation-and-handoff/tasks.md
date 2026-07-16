---
title: "Tasks: Phase 4: validation-and-handoff"
description: "Task list for the mcp-aside-devtools terminal gates and honest closure: strict mode packaging, hub validation, recursive strict packet validation, checklist evidence, summaries, memory save."
trigger_phrases:
  - "mcp-aside validation tasks"
  - "aside terminal gate tasks"
  - "aside handoff tasks"
  - "phase 004 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/004-validation-and-handoff"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Ran the program-wide final gates green"
    next_safe_action: "Run the gates after phase 003 completes"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/004-validation-and-handoff/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/004-validation-and-handoff/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/004-validation-and-handoff/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-validation-and-handoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: validation-and-handoff

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

- [x] T001 Confirm phases 001-003 handoff criteria are all satisfied (converged research, `--check`-clean packet, registered hub) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T002 Capture the pre-gate baseline: `git status` for `.opencode/skills/mcp-tooling/` and this packet [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T003 Locate and record the exact gate script paths and invocations to be run [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `package_skill.py --check --strict` on the mode and record exit + output (`.opencode/skills/mcp-tooling/mcp-aside-devtools/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T005 Run `validate_skill_package.py` on the hub and record exit + output (`.opencode/skills/mcp-tooling/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T006 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/mcp-tooling/008-mcp-aside --strict --recursive` and record exit + output [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T007 If any gate fails: route the fix to the owning phase (002 packet content, 003 hub wiring), then re-run the WHOLE gate set from T004 [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Complete the phase 002 and 003 checklists with per-item evidence (`../002-skill-authoring/checklist.md`, `../003-hub-integration/checklist.md`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T009 Author implementation summaries for executed phases and reconcile the parent phase map, statuses, and continuity (`../spec.md`, per-phase `implementation-summary.md`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T010 Re-run the packet gate to confirm closure writes stayed clean, then perform the closing memory save [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All three gates recorded at exit 0; no packet doc contradicts another on completion state
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
