---
title: "Tasks: Skill Docs Alignment"
description: "Planned task outline for Skill Docs Alignment."
trigger_phrases:
  - "skill docs alignment tasks"
  - "027 release cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/002-skill-docs-alignment"
    last_updated_at: "2026-06-10T15:29:12Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Aligned stale skill documentation and ENV_REFERENCE to shipped 027 reality"
    next_safe_action: "Review validation evidence and proceed with release-cleanup sibling lanes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-skill-docs-alignment-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Tasks: Skill Docs Alignment

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

- [x] T001 Inventory current claims (.opencode/skills/**) Evidence: grep/read inventory found stale system-spec-kit schema/tool/ENV claims and missing cli-opencode front-door guidance.
- [x] T002 List claims about schema, flags, CLI, constitutional rules, memory features, and doctrine (.opencode/skills/**) Evidence: implementation-summary.md records stale, aligned, and untouched skill sets.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Align stale schema and flag references (.opencode/skills/**) Evidence: system-spec-kit SKILL, README, memory reference, config reference, and ENV_REFERENCE now reflect schema v37 and default-off 027 flags.
- [x] T004 [P] Align CLI front-door and memory-feature references (.opencode/skills/**) Evidence: cli-opencode now points to spec-memory/code-index/skill-advisor CLI front doors when a full OpenCode dispatch is unnecessary.
- [x] T005 [P] Align constitutional-rule and doctrine references (.opencode/skills/**) Evidence: inventory confirmed sk-code-review riskScore, deep-review VERDICT_LOCK, sk-code escalation, and system-skill-advisor CLI trust language were already current, so no stale doctrine docs were edited.
- [x] T006 Preserve ownership boundary (.opencode/skills/**) Evidence: edits stayed within .opencode/skills/** docs, ENV_REFERENCE.md, and this phase folder; agents, commands, AGENTS.md, and source code were not edited.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T007 Run strict validation for this child phase (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: `validate.sh --strict` exit 0 after doc reconciliation.
- [x] T008 Record evidence in implementation-summary.md (implementation-summary.md) Evidence: implementation-summary.md contains per-skill drift list and verification results.
- [x] T009 Confirm no out-of-scope source, command, agent, or YAML edits were made (git diff) Evidence: touched paths are scoped to .opencode/skills/** docs, ENV_REFERENCE.md, and this phase folder.
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
