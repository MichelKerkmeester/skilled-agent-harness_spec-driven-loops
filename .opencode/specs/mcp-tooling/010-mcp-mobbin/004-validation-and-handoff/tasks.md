---
title: "Tasks: Phase 4: validation-and-handoff"
description: "Task list for the mcp-mobbin terminal gates and close-out: run the three gates to exit 0, complete checklists with evidence, author implementation summaries, reconcile the parent phase map, save memory."
trigger_phrases:
  - "mcp-mobbin validation tasks"
  - "mobbin gate tasks"
  - "mobbin close-out tasks"
  - "phase 004 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/004-validation-and-handoff"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Ran the program-wide final gates green"
    next_safe_action: "Run the terminal gates once phase 003 hub integration lands"
    blockers:
      - "Phase 003 hub integration must land first"
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/004-validation-and-handoff/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/004-validation-and-handoff/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/004-validation-and-handoff/tasks.md"
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

- [x] T001 Confirm phase 003 handoff evidence and a quiet working tree on the scoped paths [evidence: 003 `RESULT: PASSED` under `validate.sh --strict`; hub tree quiet per `git status` scope check]
- [x] T002 Pin the exact gate invocations: `package_skill.py --check --strict`, `validate_skill_package.py`, `validate.sh --strict --recursive` [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T003 Baseline run of all three gates; inventory failures with owning-phase classification [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Iterate scoped fixes until `package_skill.py --check --strict` exits 0 (`.opencode/skills/mcp-tooling/mcp-mobbin/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T005 Iterate until `validate_skill_package.py` passes on the hub (`.opencode/skills/mcp-tooling/`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T006 Iterate until `validate.sh --strict --recursive` exits 0 with Errors: 0 (`.opencode/specs/mcp-tooling/010-mcp-mobbin`) [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T007 Mark phase 002 and 003 checklists ` [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly][x]` with per-item evidence (`../002-skill-authoring/checklist.md`, `../003-hub-integration/checklist.md`)
- [x] T008 Author implementation summaries for executed phases and reconcile the parent Phase Documentation Map statuses (`../spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Final clean re-run of all three gates; record output verbatim in the phase 004 implementation summary [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T010 Cross-doc completion-state consistency check across spec statuses, checklists, summaries, and continuity blocks [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
- [x] T011 Memory save via the canonical generate-context flow; address post-save quality review items [evidence: final-gate run 2026-07-16 — `package_skill.py --check --strict` PASS 3/3 packets, hub `parent-skill-check` PASS, advisor probes 5/5 phrasings routed correctly]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All three gates recorded at exit 0 and memory saved — program complete
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
