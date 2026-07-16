---
title: "Tasks: Command Alignment"
description: "Planned task outline for Command Alignment."
trigger_phrases:
  - "command alignment tasks"
  - "027 release cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/006-command-alignment"
    last_updated_at: "2026-06-10T15:29:29Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed content-only command-doc alignment to shipped 027 reality"
    next_safe_action: "Let phase 027/011 perform the later router/presentation split"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-006-command-alignment-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Tasks: Command Alignment

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

- [x] T001 Inventory current claims (.opencode/commands/**) — Evidence: Grep scanned command docs for schema/version/tool-count/daemon/flag/validator/observability terms; Read verified memory, speckit, doctor command docs.
- [x] T002 List claims about schema, flags, CLI, constitutional rules, memory features, and doctrine (.opencode/commands/**) — Evidence: Drift concentrated in memory/manage, memory/search, memory/save, speckit/complete, speckit/implement, speckit/resume, doctor/speckit, doctor/mcp, and doctor/update.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Align stale schema and flag references (.opencode/commands/**) — Evidence: `/memory:manage` now reports schema v37 and documents v34-v37 storage additions plus default-off retention/tombstone/idempotency flags.
- [x] T004 [P] Align CLI front-door and memory-feature references (.opencode/commands/**) — Evidence: `/memory:search`, `/speckit:resume`, and `/doctor:*` now mention the shipped 37/8/9 daemon-backed CLI front doors where relevant.
- [x] T005 [P] Align constitutional-rule and doctrine references (.opencode/commands/**) — Evidence: No command-doc structure change was introduced; relevant content now warns not to imply default-off paths are active unless flags/tool output prove it.
- [x] T006 Preserve ownership boundary: Coordinate with 027/011, which owns the structural router and presentation split; this phase is content-only. (.opencode/commands/**) — Evidence: Diff is markdown prose only; no command assets, YAML, allowed-tool frontmatter, router, or presentation split introduced.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T007 Run strict validation for this child phase (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) — Evidence: `validate.sh ... --strict` exit 0.
- [x] T008 Record evidence in implementation-summary.md (implementation-summary.md) — Evidence: Summary includes drift inventory, changed command docs, verification results, and 027/011 coordination note.
- [x] T009 Confirm no out-of-scope source, command, agent, skill, or YAML edits were made (git diff) — Evidence: Diff reviewed for `.opencode/commands/*.md` command content and this phase's spec docs only.
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
