---
title: "Tasks: Orchestrator Validation Parity"
description: "Task ledger for the strict-aware filter, started-work exemption, bridge vitest coverage, and gated dist rebuild."
trigger_phrases:
  - "orchestrator parity tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/001-orchestrator-validation-parity"
    last_updated_at: "2026-07-03T07:34:06Z"
    last_updated_by: "gpt-5.5-opencode"
    recent_action: "Added node-rule bridge follow-up evidence"
    next_safe_action: "Orchestrator completes rebuild, bash validation, and live proof tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-001-orchestrator-parity"
      parent_session_id: null
    completion_pct: 65
    open_questions: []
    answered_questions: []
---
# Tasks: Orchestrator Validation Parity

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Read the registry-bridge block and `validateFileExists`/`docsForLevel` flow in `orchestrator.ts` in full.
- [x] T002 Read the hardened `- [x]` heuristic in `check-files.sh` and `check-level-match.sh`.
- [x] T003 Read the nearest existing mcp_server validation vitest file for conventions.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Make the registry filter strict-aware (`strict_only` rules included only when the orchestrator runs strict; `severity: skip` always excluded).
- [x] T005 Add the started-work predicate mirroring the shell heuristic and wire it into `validateFileExists` (and native level-match required-files if it shares the gap).
- [x] T006 Create the bridge vitest file: strict/non-strict filtering, status mapping, path-traversal guard, exemption both directions.
- [x] T012 Add node-rule resolution/execution for `validation/*.ts` registry entries and focused real-rule vitest coverage.
  - **Evidence**: `npx vitest run tests/validation-orchestrator-bridge.vitest.ts` passed 1 file / 9 tests; temporary wrong dist-validation root failed the resolver and real `EVIDENCE_MARKER_LINT` execution tests before restore; rerun passed 1 file / 9 tests.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Full mcp_server vitest suite: 0 new failures.
- [ ] T008 [B] REBUILD GATE: confirm quiet tree or operator approval; then rebuild dist exactly once.
- [ ] T009 `test-validation-extended.sh` fully green; dist-freshness check-all clean.
- [ ] T010 Live proof: strict run executes a strict-only rule; 030/011/007 validates recursively with 0 errors.
- [x] T011 Author implementation-summary.md; fill checklist evidence; set spec.md Status per real outcome.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Manual verification passed (`validate.sh --strict` exits 0 on this folder).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
