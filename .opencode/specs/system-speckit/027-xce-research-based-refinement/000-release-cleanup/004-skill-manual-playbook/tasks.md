---
title: "Tasks: Skill Manual Playbook"
description: "Planned task outline for Skill Manual Playbook."
trigger_phrases:
  - "skill manual playbook tasks"
  - "027 release cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/004-skill-manual-playbook"
    last_updated_at: "2026-06-10T16:12:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added release-hardening manual testing scenarios and reconciled the playbook count guard"
    next_safe_action: "Run the new manual scenarios in the later model-execution phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-skill-manual-playbook-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
      - "Operator approved manual playbook implementation scope and no-build constraint."
---
# Tasks: Skill Manual Playbook

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

- [x] T001 Inventory current claims (.opencode/skills/**/manual_testing_playbook/**) - Evidence: read root playbook, representative scenario files, current count guard, existing CLI rows 427-438, and committed changelog rollups before editing.
- [x] T002 List claims about schema, flags, CLI, constitutional rules, memory features, and doctrine (.opencode/skills/**/manual_testing_playbook/**) - Evidence: identified missing default-off flag scenarios, retrieval observability, provenance guard, and stale-exclusion/tool-ownership coverage; identified CLI front doors as already covered by rows 427-431 plus follow-ons.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Align stale schema and flag references (.opencode/skills/**/manual_testing_playbook/**) - Evidence: added Playbook IDs 439-445 for default-off flags and modes.
- [x] T004 [P] Align CLI front-door and memory-feature references (.opencode/skills/**/manual_testing_playbook/**) - Evidence: added Playbook ID 446 for retrieval observability and skipped duplicate CLI front-door coverage because 427-431 already cover all three daemon-backed CLI surfaces.
- [x] T005 [P] Align constitutional-rule and doctrine references (.opencode/skills/**/manual_testing_playbook/**) - Evidence: added Playbook IDs 447-448 for source-kind provenance guard and stale-exclusion/tool-ownership governance.
- [x] T006 Preserve ownership boundary: Epic Phase-5 will run these via MiMo and DeepSeek. (.opencode/skills/**/manual_testing_playbook/**) - Evidence: scenarios are executable contracts only; no build, source, feature catalog, stress-test, command, agent, skill routing, or YAML files were edited.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T007 Run strict validation for this child phase (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) - Evidence: strict validation run recorded in implementation-summary.md.
- [x] T008 Record evidence in implementation-summary.md (implementation-summary.md) - Evidence: implementation-summary.md lists added scenarios, skipped coverage, count-bump locations, and validation evidence.
- [x] T009 Confirm no out-of-scope source, command, agent, skill, or YAML edits were made (git status) - Evidence: this lane changed manual_testing_playbook files and this phase's spec docs; `git status` also shows unrelated concurrent changes outside this lane, including sibling feature_catalog and stress-test paths.
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
