---
title: "Tasks: Autonomous Dependency Patching"
description: "Task checklist for the npm audit remediation script."
trigger_phrases:
  - "028 autonomous dependency patching tasks"
  - "npm audit remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/005-autonomous-dependency-patching"
    last_updated_at: "2026-06-11T09:30:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Optimized task checklist after final phase renumbering"
    next_safe_action: "Use implementation-summary.md for current verification evidence"
    blockers: []
---
# Tasks: Autonomous Dependency Patching

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

- [x] T001 Create phase folder (`028-autonomous-dependency-patching/`)
- [x] T002 Create package metadata (`description.json`, `graph-metadata.json`)
- [x] T003 Register phase in parent graph metadata (`../graph-metadata.json`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement script argument parsing (`scripts/audit-and-fix.sh`)
- [x] T005 Implement eligible lockfile discovery (`scripts/audit-and-fix.sh`)
- [x] T006 Exclude benchmark/eval fixtures by default (`scripts/audit-and-fix.sh`)
- [x] T007 Implement npm audit parsing (`scripts/audit-and-fix.sh`)
- [x] T008 Implement guarded advisory range parsing (`scripts/audit-and-fix.sh`)
- [x] T009 Implement npm override updates (`scripts/audit-and-fix.sh`)
- [x] T010 Implement workspace fallback detection (`scripts/audit-and-fix.sh`)
- [x] T011 Implement re-audit verification and summary output (`scripts/audit-and-fix.sh`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run shell syntax check (`scripts/audit-and-fix.sh`)
- [x] T013 Run dry-run (`scripts/audit-and-fix.sh`)
- [x] T014 Verify system-skill-advisor audit (`.opencode/skills/system-skill-advisor/mcp_server`)
- [x] T015 Verify system-spec-kit audit (`.opencode/skills/system-spec-kit`)
- [x] T016 Verify mcp-code-mode audit (`.opencode/skills/mcp-code-mode/mcp_server`)
- [x] T017 Write implementation evidence (`implementation-summary.md`)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks are complete.
- [x] No blocked tasks remain.
- [x] Targeted audit verification passed.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation evidence**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
