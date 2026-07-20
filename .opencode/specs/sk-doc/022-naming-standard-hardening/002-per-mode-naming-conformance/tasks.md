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
    last_updated_at: "2026-07-20T10:13:27Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase-002 task breakdown"
    next_safe_action: "Execute after phase 001 lands"
    blockers: []
    completion_pct: 0
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

- [ ] T001 [B] Confirm Phase 001 landed (shared standard reconciled, guards wired)
- [ ] T002 Decide shared-checker vs per-mode-check; record the decision
- [ ] T003 Enumerate each generating mode's artifact-path rule from the survey (spec.md §2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Provide/identify the shared authored-name kebab checker honoring canon §3 exemptions
- [ ] T005 [P] Make the checker reachable from each prose-only mode workflow (agent, readme, command, changelog, flowchart, benchmark)
- [ ] T006 Wire `check_no_hyphenated_catalog_content.py` into catalog + playbook workflows, scoped to new content
- [ ] T007 [P] Re-anchor `create-quality-control/{README.md,SKILL.md}` to `filesystem-naming-convention.md`; add a filename-case signal
- [ ] T008 [P] Fix `create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md:67`; cite canon §6 for the family-key exemption
- [ ] T009 [P] Fix the cosmetic counter-example in `create-skill/assets/skill/skill-asset-template.md:691`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Unit-test the checker: kebab passes, underscore fails, exemptions honored
- [ ] T011 Verify each generating mode flags a deliberate snake_case name
- [ ] T012 Verify the catalog guard does not red-flag shipped underscore roots
- [ ] T013 grep confirms no mode doc points at a snake_case filename rule; run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --strict` reports Errors: 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
