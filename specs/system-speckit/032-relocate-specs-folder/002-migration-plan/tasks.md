---
title: "Tasks: Specs-Root Migration Plan"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "migration plan tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/002-migration-plan"
    last_updated_at: "2026-08-06T18:04:13Z"
    last_updated_by: "claude-code"
    recent_action: "T013 added: fresh Opus ADR-002 consultation, verified"
    next_safe_action: "Operator accepts or rejects ADR-002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Specs-Root Migration Plan

<!-- SPECKIT_LEVEL: 3 -->

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

Read the existing spec-root-* subsystem in full before designing anything.

- [x] T001 Read `spec-root-registry.ts` in full (all 21 entries, not sampled) [evidence: `plan.md` §3 groups all 21 entries by precedence type with file:line citations]
- [x] T002 Read `spec-root-migration.ts` in full [evidence: found `migrateLegacyOnlyToCanonical`/`restoreFromQuarantine` hardcode `canonicalRoot`/`legacyRoot` and only act on `legacy-only` classifications]
- [x] T003 Read `spec-root-collision-classifier.ts` in full [evidence: found `haveSameInode` would classify all current packets `same-inode-alias` since `specs` is a symlink today, explaining why the mutation function is currently a no-op]
- [x] T004 Read `spec-root-migration-manifest.ts` in full [evidence: confirmed `buildMigrationManifest` is read-only and reusable as-is for a pre-flip baseline]
- [x] T005 Read `spec-root-write-guard.ts` in full [evidence: confirmed `assertSpecWriteAllowed` needs only a 2-line root-literal swap]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Design the topology-flip approach and cross-check it against phase 001's estimates.

- [x] T006 Group all 21 registry entries by real-change-needed vs. relabel-only [evidence: `plan.md` §3 — 7 need real precedence changes, 14 are already flip-compatible or path-agnostic]
- [x] T007 Design the topology-flip operation, naming which primitives it reuses vs. what's new [evidence: `plan.md` §3 "Pattern" and FIX ADDENDUM table]
- [x] T008 Cross-check the 7-entry real-change count against phase 001's independent "~5-7 literals" estimate [evidence: `plan.md` §3 closing paragraph — counts land within one of each other, derived by different methods]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Record the decision, hand off a concrete plan, and verify the packet.

- [x] T009 Record the packet-consolidation-vs-topology-flip finding as a decision [evidence: `decision-record.md` ADR-001]
- [x] T010 Name the downstream-ownership policy decision as OPEN, without resolving it on the operator's behalf [evidence: `decision-record.md` ADR-002, initial status Open]
- [x] T011 Write a concrete task list a future execution phase could follow without re-deriving the design [evidence: `plan.md` §4 Implementation Phases A/B/C]
- [x] T013 Dispatch a fresh-context Opus agent to independently recommend ADR-002, and verify its claims against real files before recording them [evidence: 3/3 new claims verified — `.gitignore:264-267` project entries, `mk-spec-memory-launcher.cjs:365-366` `SPEC_KIT_DB_DIR` pattern, and the `context-server.ts:1303-1307` vs `indexing.ts:82-87` precedence disagreement all confirmed by direct file reads; `decision-record.md` ADR-002 updated to status Proposed]
- [x] T012 Run `validate.sh --recursive --strict` on the parent packet [evidence: see implementation-summary.md Verification table]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `decision-record.md` and `plan.md` both present with the design and the one open decision
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
