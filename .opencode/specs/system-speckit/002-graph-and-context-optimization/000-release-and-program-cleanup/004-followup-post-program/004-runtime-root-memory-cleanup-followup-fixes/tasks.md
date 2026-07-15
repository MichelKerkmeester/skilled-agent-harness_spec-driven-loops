---
title: "Tasks: 054 Runtime Cleanup Followups"
description: "Task list for resolver hardening, FTS/vec investigation, and deprecated-tier bulk-delete. Format: T### [P?] Description (file path)."
trigger_phrases:
  - "054 tasks"
  - "runtime cleanup followups tasks"
  - "advisor resolver task"
  - "fts vec task"
  - "bulk delete task"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/004-runtime-root-memory-cleanup-followup-fixes"
    last_updated_at: "2026-05-08T08:36:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author task list for three follow-on fixes"
    next_safe_action: "Begin T001 (resolver edit)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/utils/workspace-root.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-runtime-root-memory-cleanup-followup-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 054 Runtime Cleanup Followups

<!-- SPECKIT_LEVEL: 2 -->

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

Snapshot pre-state for each REQ so we have a clean rollback baseline.

- [ ] T001 Snapshot `memory_health.consistency.mismatchedIds` (50 IDs) into `scratch/fts-vec-mismatch-ids.txt`
- [ ] T002 Snapshot `memory_stats` totals + `tierBreakdown` into `scratch/pre-bulk-delete-stats.json`
- [ ] T003 [P] Confirm packet 096 path-residue fix is intact (12 mcp_server source files modified, dist regenerated) via `git status --short .opencode/skills/system-spec-kit/mcp_server`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Three independent fixes. REQ-001 is lowest-risk and unblocks fastest verification, do it first.

### REQ-001: Resolver Hardening
- [ ] T004 Edit `DEFAULT_SENTINEL` in workspace-root.ts:24 → `'.opencode/skills/system-spec-kit/SKILL.md'` (`mcp_server/skill_advisor/lib/utils/workspace-root.ts`)
- [ ] T005 Update JSDoc on `findAdvisorWorkspaceRoot` to cite the anti-recurrence rationale (mirror comment style of `schemas/advisor-tool-schemas.ts:24-28`)
- [ ] T006 Run `npm run typecheck` from `mcp_server/` (must pass)
- [ ] T007 Run `npm run build` from `mcp_server/` (regenerates dist)
- [ ] T008 Run advisor unit tests (`vitest skill_advisor/`) and fix any tests that relied on the bare-sentinel default

### REQ-002: FTS/vec Investigation
- [ ] T009 [P] For a representative sample (5–10 IDs) from T001, inspect row content: `memory_list({ includeChunks: true })` filtered by ID; or direct sqlite query against `memory_index`, `memory_index_fts`, and the vec0 vector table
- [ ] T010 Categorize root cause: embedding-retry residue, partial-write race, migration drift, or other. Document in `scratch/fts-vec-diagnosis.md`
- [ ] T011 Decide repair vs deferral. If repair (≤1 day work): apply (e.g., re-embed mismatched IDs via embedding queue); if deferral: write rationale + revisit conditions into `implementation-summary.md` Open Questions

### REQ-003: Deprecated-Tier Bulk-Delete
- [ ] T012 Run `memory_bulk_delete({ tier: 'deprecated', confirm: true })` (auto-checkpoint enabled)
- [ ] T013 Verify checkpoint: `checkpoint_list` shows new entry with timestamp matching the operation; record the checkpoint ID
- [ ] T014 [P] Optional: `memory_causal_stats` to check for orphan-edge growth; if non-trivial, decide remediation or accept
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Manual repro for REQ-001: kill MCP child, delete any newly-created `mcp_server/.opencode/`, restart, exercise hooks, confirm no recreation within 5 minutes
- [ ] T016 Re-check `memory_health.consistency` post REQ-002; record before/after counts
- [ ] T017 Snapshot post-state: `memory_stats` + verify `tierBreakdown.deprecated === 0`; record delta vs pre-state
- [ ] T018 Fill `implementation-summary.md` with actual results (no template placeholders)
- [ ] T019 Mark all `checklist.md` items `[x]` with evidence
- [ ] T020 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-runtime-root-memory-cleanup-followup-fixes --strict` (must exit 0)
- [ ] T021 Update parent `graph-metadata.json.derived.last_active_child_id` to `004-runtime-root-memory-cleanup-followup-fixes`
- [ ] T022 Save context via `/memory:save` so the indexed-continuity store reflects this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T### tasks marked `[x]` (T011 may resolve via documented deferral)
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --strict` exits 0
- [ ] All three REQs in `spec.md` have evidence in `checklist.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Predecessor work**: packet 096 path-residue fix (uncommitted source files in `mcp_server/skill_advisor/**` + `mcp_server/handlers/**` + `tool-schemas.ts`)
- **Reference for strict sentinel**: `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:23-38`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Level 2 with verification phase + checklist cross-ref
-->
