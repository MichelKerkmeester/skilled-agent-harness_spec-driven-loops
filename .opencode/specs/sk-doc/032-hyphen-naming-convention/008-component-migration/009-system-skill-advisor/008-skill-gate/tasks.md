---
title: "Tasks: system-skill-advisor subtree skill gate"
description: "Concrete rollup tasks for sibling evidence aggregation, scope-aware naming/reference checks, parity verification, and the no-new-migration gate."
trigger_phrases:
  - "system-skill-advisor gate tasks"
  - "subtree rollup tasks"
  - "advisor naming gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree-gate tasks"
    next_safe_action: "Collect all sibling receipts and required-file evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase 008 reports and routes failures; it does not perform new migration work."
---

# Tasks: system-skill-advisor subtree skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load sibling 001–007 checklists, receipts, candidate SHAs, BASE SHAs, and map hashes
- [ ] T002 Verify required leaf docs and absence of stray implementation summaries and scratch directories
- [ ] T003 Build the aggregate classification ledger and define all scan roots/consumer sets
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Perform no new rename, source edit, changelog authoring, or exemption change
- [ ] T005 Reconcile sibling maps and classify every remaining underscore-bearing filesystem path and reference hit
- [ ] T006 Route every unknown or newly discovered candidate back to its owning sibling phase
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run scope-aware filesystem-name and stale-live-path scans
- [ ] T008 Resolve whole-surface links and path-valued references
- [ ] T009 Re-run package/launcher, script, hook, catalog, and playbook discovery checks
- [ ] T010 Verify changelog/version evidence and emit the final gate receipt
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->
