---
title: "Tasks: Manual Testing Playbook Refresh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual testing playbook refresh tasks"
  - "EX-037 EX-042 authoring tasks"
  - "checkpoint enrichment frontproxy skgit scenario tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored manual-testing-playbook-update child packet docs and EX scenarios"
    next_safe_action: "Hand back to parent; start sibling 002-feature-catalog-update"
    blockers: []
    key_files:
      - "manual_testing_playbook/manual_testing_playbook.md"
      - "manual_testing_playbook/05--lifecycle/"
      - "manual_testing_playbook/04--maintenance/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-testing-playbook-update-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Manual Testing Playbook Refresh

<!-- SPECKIT_LEVEL: 3 -->
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

**Phase 1 - Author checkpoint + maintenance scenarios** (read source anchors, then write feature files).

- [x] T001 Read source anchors: `lib/storage/checkpoints.ts`, `lib/search/vector-index-schema.ts`, `handlers/save/enrichment-state.ts`, `handlers/memory-index.ts` (read-only)
- [x] T002 [P] Author EX-037 checkpoint-v2 round-trip (05--lifecycle/050-checkpoint-v2-file-snapshot-roundtrip.md)
- [x] T003 [P] Author EX-042 `.needs-rebuild` self-heal (05--lifecycle/051-checkpoint-v2-needs-rebuild-self-heal.md)
- [x] T004 [P] Author EX-038 schema v30 enrichment lifecycle (04--maintenance/039-post-insert-enrichment-lifecycle-v30.md)
- [x] T005 [P] Author EX-039 index_scan phased-async refinements (04--maintenance/040-index-scan-phased-async-refinements.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase 2 - Author infra scenarios** (front-proxy + sk-git).

- [x] T006 Read source anchors: `.opencode/bin/lib/launcher-session-proxy.cjs`, `.opencode/bin/mk-spec-memory-launcher.cjs`, `context-server.ts:2126` (read-only)
- [x] T007 [P] Author EX-040 front-proxy reconnect + SPECKIT_BACKEND_ONLY + -32002/-32001 (14--pipeline-architecture/258-front-proxy-reconnect-and-backend-only.md)
- [x] T008 Read sk-git worktree rule: `.opencode/skills/sk-git/SKILL.md` (rule on `wt/{NNNN}-{name}`)
- [x] T009 [P] Author EX-041 sk-git worktree-convention validation (16--tooling-and-scripts/300-sk-git-worktree-convention.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase 3 - Wire into the master index and validate**.

- [x] T010 Add `### EX-037` checkpoint-v2 entry to master index `## 7. EXISTING FEATURES` (manual_testing_playbook/manual_testing_playbook.md)
- [x] T011 Add `### EX-038` enrichment entry to master index `## 7` (manual_testing_playbook/manual_testing_playbook.md)
- [x] T012 Add `### EX-039` index_scan entry to master index `## 7` (manual_testing_playbook/manual_testing_playbook.md)
- [x] T013 Add `### EX-040` front-proxy entry to master index `## 7` (manual_testing_playbook/manual_testing_playbook.md)
- [x] T014 Add `### EX-041` sk-git entry to master index `## 7` (manual_testing_playbook/manual_testing_playbook.md)
- [x] T015 Add `### EX-042` `.needs-rebuild` self-heal entry to master index `## 7` (manual_testing_playbook/manual_testing_playbook.md)
- [x] T016 Confirm each new feature file cites the source anchor it was read from in Source Metadata
- [x] T017 Confirm `-32001` is documented as live retryable-recycle (NOT removed) and `-32002` as terminal fail-closed
- [x] T018 Gate: `validate.sh --strict` on this packet → Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Six EX feature files authored and master-index entries wired
- [x] Each behavioral claim traces to a verified source anchor
- [x] `validate.sh --strict` on this packet passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
