---
title: "Tasks: Manual Testing Playbook Cleanup"
description: "PENDING task list for manual testing playbook sweep."
trigger_phrases:
  - "028 release cleanup manual testing tasks"
  - "manual-testing-playbooks cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-release-cleanup/005-manual-testing-playbooks"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All cleanup tasks executed and marked complete with evidence"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-005-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Manual Testing Playbook Cleanup

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

- [x] T001 Run discovery for manual testing playbook sweep. Evidence: `rg --files | rg '(^|/)(manual_testing_playbook...)'` enumerated the package; the packet-028 surface is `.opencode/skills/system-spec-kit/manual_testing_playbook` (410 scenario files plus root index).
- [x] T002 Save candidate paths as phase evidence. Evidence: discovery output and the deterministic coverage self-check recorded in `implementation-summary.md`.
- [x] T003 Confirm packet 030 is not in the candidate list. Evidence: no path under packet 030 was edited; packet-030 scenarios 450-452 are only referenced from the root index prose and were left unchanged.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Review every candidate document against current source files. Evidence: scanned all 410 scenario files plus the root index for backtick path anchors against the live tree.
- [x] T005 Remove stale file, feature and route claims. Evidence: 13 stale anchors fixed across 9 files (corpus.ts move, matrix-definition to matrix-manifest, spec_kit to speckit yaml x3, memory/context.ts to memory-context.ts x2, 119 to z_archive x6, feature-file-path metadata).
- [x] T006 Apply HVR voice edits. Evidence: all edits are path-only and introduce no em dash, semicolon or Oxford comma. The pre-existing package-wide em dash table convention was left intact rather than rewritten piecemeal.
- [x] T007 Keep out-of-scope document families unchanged. Evidence: no code, no packet 030, and no concurrent-session files (deep-research, commands, rrf-fusion.ts, .gitignore) were touched. Other skills' playbook packages were left unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run em dash scan. Evidence: package-wide scan shows 338 em dashes across 63 files, almost all in the established SOURCE-table role convention. None were introduced by this cleanup; edited lines add none.
- [x] T009 Run semicolon character scan. Evidence: 3846 semicolons across 374 files, overwhelmingly inside executable bash and python code blocks (syntactically required, not prose). No actionable prose hit introduced.
- [x] T010 Run stale-reference scan. Evidence: comprehensive backtick-anchor resolution scan; 13 genuine stale anchors fixed. Residual unresolved hits classified as intentional ledger rows, placeholders, absence-assertions or non-actionable shorthand in features outside packet 028.
- [x] T011 Run strict validation for this child folder. Evidence: `validate.sh --strict` exits 0 (0 errors, 0 warnings).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification evidence is recorded.
- [x] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
