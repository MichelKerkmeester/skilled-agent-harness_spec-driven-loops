---
title: "Tasks: Phase 4: validation-and-handoff"
description: "Task list for the terminal gate phase: run the strict packet, hub, and recursive spec gates, mark checklists with evidence, write implementation summaries, reconcile parent statuses, save memory."
trigger_phrases:
  - "mcp-refero validation tasks"
  - "refero gates tasks"
  - "refero handoff tasks"
  - "phase 004 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/004-validation-and-handoff"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Ran the program-wide final gates green"
    next_safe_action: "Run the terminal gates once phase 003 hub integration lands"
    blockers:
      - "Phases 001-003 must complete first"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/004-validation-and-handoff/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/004-validation-and-handoff/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/004-validation-and-handoff/tasks.md"
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

- [x] T001 Confirm phases 001-003 completion evidence and a quiet sibling serial queue for a stable hub state (`../spec.md` Phase Documentation Map) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T002 Record the hub and packet git SHAs the gates will run against (`004-validation-and-handoff/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T003 Confirm the exact validator invocations and flags from the parent handoff criteria (`../spec.md` Phase Handoff Criteria)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `package_skill.py --check --strict` on the packet and record output verbatim (`.opencode/skills/mcp-tooling/mcp-refero/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T005 Run `validate_skill_package.py` on the hub and record output verbatim (`.opencode/skills/mcp-tooling/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T006 Run `validate.sh --strict --recursive` on this spec packet and record output verbatim (`.opencode/specs/mcp-tooling/009-mcp-refero/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T007 Route any gate failure to its owning phase, fix under that scope, and re-run the WHOLE affected gate [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T008 Mark phase 002 and 003 checklists with per-item evidence (`../002-skill-authoring/checklist.md`, `../003-hub-integration/checklist.md`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write implementation summaries for completed phases and reconcile the parent phase map statuses (`../00N-*/implementation-summary.md`, `../spec.md`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T010 Re-run the recursive spec gate after closure writes to confirm Errors: 0 end-state [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T011 Save memory via the canonical flow and record the continuation pointer (`generate-context.js` save path) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All three gates recorded at exit 0 with no completion claim conflicting with the evidence
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
