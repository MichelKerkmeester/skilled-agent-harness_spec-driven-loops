---
title: "Tasks: Code Graph Gold-Query Battery Repair"
description: "Task list for repairing stale Code Graph gold-query verification assets after extraction and proving the structural read gate unlocks."
trigger_phrases:
  - "gold query battery tasks"
  - "code graph verify repair tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/014-gold-query-battery-repair"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "openai-gpt-5-5"
    recent_action: "Completed battery repair, verifier recovery, and evidence update"
    next_safe_action: "Restart the mk-code-index MCP server to load patched runtime code"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code Graph Gold-Query Battery Repair

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

- [x] T001 Create `014-gold-query-battery-repair` phase folder under the Code Graph parent.
- [x] T002 Replace scaffold placeholders with concrete Level 2 phase docs.
- [x] T003 Add and maintain a verification checklist for this repair phase.
- [x] T004 Read current gold-query and confidence fixture contents before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update moved Code Graph path/symbol expectations in `code-graph-gold-queries.json`. Evidence: full 28-query battery passed after path refresh.
- [x] T006 Update moved Skill Advisor path/symbol expectations in `code-graph-gold-queries.json`. Evidence: advisor handler/lib queries passed in the repaired battery.
- [x] T007 Rewrite the outdated Spec Kit ownership regression to current ownership. Evidence: `GQ-REG-003` now targets standalone `system-code-graph` tool-schema ownership.
- [x] T008 Patch `exclude-rule-confidence.json` if it still references stale extraction paths. Evidence: asset grep found no stale pre-extraction Code Graph or Skill Advisor paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `code_graph_scan` with the repository's required Code Graph scope.
- [x] T010 Run `code_graph_verify` against the repaired battery and inspect details.
- [x] T011 Confirm representative `code_graph_query` no longer blocks on `verificationGate: "fail"`.
- [x] T012 Update the parent timeline with verified evidence.
- [x] T013 Run `validate.sh --strict` for this phase folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 checklist items marked `[x]` with evidence.
- [x] No `[B]` blocked tasks remaining.
- [x] Code Graph verification gate passes and structural read smoke test answers.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Battery asset**: `../005-resilience-and-advisor/002-code-graph-resilience-research/assets/code-graph-gold-queries.json`
<!-- /ANCHOR:cross-refs -->
