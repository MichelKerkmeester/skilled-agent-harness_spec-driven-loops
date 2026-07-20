---
title: "Tasks: Per-Mode Naming Conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "per-mode conformance tasks"
  - "kebab checker tasks"
  - "mode naming tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/002-per-mode-naming-conformance"
    last_updated_at: "2026-07-20T12:21:56Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation tasks and captured focused verification"
    next_safe_action: "Operator can run central metadata generation and packet validation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Per-Mode Naming Conformance

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

- [x] T001 Confirm Phase 001 landed (shared standard reconciled, guards wired)
- [x] T002 Decide shared-checker vs per-mode-check; one shared checker selected
- [x] T003 Enumerate each generating mode's artifact-path rule from the survey (spec.md §2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Provide the shared authored-name kebab checker honoring canon §3 exemptions
- [x] T005 [P] Make the checker reachable from each prose-only mode workflow (agent, readme, command, changelog, flowchart, benchmark)
- [x] T006 Wire `check_no_hyphenated_catalog_content.py` into catalog + playbook workflows, scoped to new content
- [x] T007 [P] Re-anchor `create-quality-control/{README.md,SKILL.md}` to `filesystem-naming-convention.md`; add a non-scored filename-case signal
- [x] T008 [P] Fix `create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md:67`; cite canon §6 for the family-key exemption
- [x] T009 [P] Fix the cosmetic counter-example in `create-skill/assets/skill/skill-asset-template.md:691`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Unit-test the checker: kebab passes, underscore fails, exemptions honored (`3 passed`)
- [x] T011 Verify each generating mode reaches the checker; deliberate snake_case exits 1 and kebab exits 0
- [x] T012 Verify the scoped catalog guard passes new canonical content without traversing shipped underscore roots
- [x] T013 grep confirms no touched mode doc points at a snake_case filename rule; all changed mode docs pass `validate_document.py`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and focused-verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] `validate.sh --strict` reports Errors: 0 (central operator validation; not run by instruction)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
