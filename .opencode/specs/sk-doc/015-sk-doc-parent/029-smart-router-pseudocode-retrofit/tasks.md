---
title: "Tasks: Smart-router pseudocode retrofit (sk-doc mode packets)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "smart router retrofit tasks"
  - "014 sk-doc phase 029 tasks"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/029-smart-router-pseudocode-retrofit"
    last_updated_at: "2026-07-14T16:56:15.126Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks completed and verified"
    next_safe_action: "Commit + push non-force to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Smart-router pseudocode retrofit (sk-doc mode packets)

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

- [x] T001 Read the canonical router pattern (`create-skill/assets/skill/skill_smart_router.md`)
- [x] T002 Author a shared FLAT+KEYED router template (`scratchpad/router-template.md`)
- [x] T003 Prove the golden block on `create-changelog/SKILL.md` (PASS --strict)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Add TIER-FLAT `route_agent_request` (`create-agent/SKILL.md`)
- [x] T005 [P] Add TIER-FLAT `route_diff_request` (`create-diff/SKILL.md`)
- [x] T006 [P] Add TIER-FLAT `route_feature_catalog_request` (`create-feature-catalog/SKILL.md`)
- [x] T007 [P] Add TIER-FLAT `route_manual_testing_playbook_request` (`create-manual-testing-playbook/SKILL.md`)
- [x] T008 [P] Add TIER-FLAT `route_quality_control_request` (`create-quality-control/SKILL.md`)
- [x] T009 [P] Add TIER-FLAT `route_readme_request` (`create-readme/SKILL.md`)
- [x] T010 Split merged heading + renumber sections + `route_flowchart_request` (`create-flowchart/SKILL.md`)
- [x] T011 Add TIER-KEYED compact `route_benchmark_request` + word-budget trims (`create-benchmark/SKILL.md`)
- [x] T012 Close the merged-heading loophole in `validate_smart_router` (`create-skill/scripts/package_skill.py`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `package_skill.py --check --strict` sweep across all 11 packets (11/11 PASS)
- [x] T014 Audit 3 markers + standalone `## N. SMART ROUTING` heading + `route_` fn per packet (grep table)
- [x] T015 Confirm create-benchmark < 5000 words (4998) and PASS `package_skill.py --check --strict`
- [x] T016 Unit-test the loophole fix via `validate_smart_router` (merged heading flagged; standalone+3-markers clean)
- [x] T017 Verify parent hub via `parent-skill-check.cjs` STRICT (exit 0, 0 warnings)
- [x] T018 Run `validate.sh --recursive --strict` on the 029 packet (Errors:0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (packaging sweep + loophole unit test + parent-hub check)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
