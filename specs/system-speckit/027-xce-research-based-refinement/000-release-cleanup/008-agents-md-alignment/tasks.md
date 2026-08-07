---
title: "Tasks: AGENTS.md Alignment"
description: "Planned task outline for AGENTS.md Alignment."
trigger_phrases:
  - "agents.md alignment tasks"
  - "027 release cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/008-agents-md-alignment"
    last_updated_at: "2026-06-10T15:25:28Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed AGENTS.md alignment and phase documentation reconciliation"
    next_safe_action: "No follow-up required for this child phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-008-agents-md-alignment-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Tasks: AGENTS.md Alignment

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
## PHASE 1: SETUP

- [x] T001 Inventory current claims (AGENTS.md) - Evidence: grep/read review found existing completion-freshness and Logic-Sync guidance, plus MCP tool counts and CLI fallback sections.
- [x] T002 List claims about schema, flags, CLI, constitutional rules, memory features, and doctrine (AGENTS.md) - Evidence: repository searches verified schema v37, default-off/opt-in flags, CLI shims, and constitutional rule files before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Align stale schema and flag references (AGENTS.md) - Evidence: added current schema v37 and rollout-flag pointer under Startup & Resume Recovery.
- [x] T004 [P] Align CLI front-door and memory-feature references (AGENTS.md) - Evidence: added daemon-backed CLI front-door guidance to Required Tools and MCP Tool Routing.
- [x] T005 [P] Align constitutional-rule and doctrine references (AGENTS.md) - Evidence: added pointer to advisory constitutional memory invariants and the two current rule files.
- [x] T006 Preserve ownership boundary: Four Laws and Gates are byte-stable; do not rewrite them for style. (AGENTS.md) - Evidence: before/after section hashes match for Four Laws and Gates.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T007 Run strict validation for this child phase (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) - Evidence: strict validator passed after reconciliation.
- [x] T008 Record evidence in implementation-summary.md (implementation-summary.md) - Evidence: summary now records changed files and verification checks.
- [x] T009 Confirm no out-of-scope source, command, agent, skill, or YAML edits were made (git diff) - Evidence: final diff limited to AGENTS.md and this phase's spec docs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval
- [x] No blocked tasks remain
- [x] Strict validation passes for this child phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
