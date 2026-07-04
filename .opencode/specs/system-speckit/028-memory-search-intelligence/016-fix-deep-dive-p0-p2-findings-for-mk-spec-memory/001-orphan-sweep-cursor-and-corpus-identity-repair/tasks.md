---
title: "Tasks: Orphan Sweep Cursor and Corpus Identity Repair"
description: "Granular tasks: confirm-before-fix verification for agent-verified findings, baseline capture, cursor persistence, count-verified drain plus checkpointed heal/collapse migrations, reconcile hardening (including failed-embedding coverage), and delta verification."
trigger_phrases:
  - "orphan sweep cursor tasks"
  - "dead path row drain tasks"
  - "identity heal migration tasks"
  - "dup hash collapse tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair"
    last_updated_at: "2026-07-04T14:08:36.105Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown with confirm-before-fix group and per-task metadata"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-orphan-sweep-cursor-and-corpus-identity-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Orphan Sweep Cursor and Corpus Identity Repair

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

Every task carries an inline metadata comment (`agent | deps | touched-files`) and cites its finding reference (report §N, Chain A/B, or ledger tag). Finding citations live HERE, never in code comments (comment-hygiene HARD BLOCK). Sub-phase headings map 1:1 to plan.md implementation phases.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Setup for this phase is verification-first: 🟡 agent-verified findings are hypotheses until reproduced (finding-is-a-hypothesis), and the baseline plus checkpoint drill gate every later destructive step. No code change before its confirmation task closes.

- [x] T001 Confirm `reconcileMoves` does not repoint `active_memory_projection`, and document the path-reuse unsearchable-row mechanism (report §3 #17 🟡; lib/storage/incremental-index.ts:547-700, UPDATE region at :657) Evidence: pre-change source showed only `memory_index` UPDATE; regression covered by `npx vitest run tests/orphan-sweep-corpus-repair.vitest.ts`. <!-- agent: direct | deps: [] | touched-files: [scratch/t001-projection-confirm.md] -->
- [x] T002 Confirm relative stored paths are existence-checked without base resolution in `sweepOrphanIndexRows`, with a fixture row that would be falsely classified orphaned (decomposition §001, ledger agent F P2 🟡; lib/storage/incremental-index.ts:443-495) Evidence: pre-change source used raw `getFileMetadata(row.file_path)`; regression covered by `npx vitest run tests/orphan-sweep-corpus-repair.vitest.ts`. <!-- agent: direct | deps: [] | touched-files: [scratch/t002-path-resolution-confirm.md] -->
- [B] T003 Confirm `normalizeSpecFolderScope` silently rejects legacy `specs/`-prefixed scopes and inventory the `getSpecsBasePaths` vs `findSpecDocuments` discovery-surface mismatch (ledger agent F 🟡; handlers/memory-index-discovery.ts:97, lib/search/folder-discovery.ts:1304, lib/discovery/spec-document-finder.ts) Blocked: user allowed writes excluded discovery files; no discovery edits performed. <!-- agent: direct | deps: [] | touched-files: [scratch/t003-scope-discovery-confirm.md] -->
- [x] T004 Confirm `near_duplicate_of` state: population count (expected ~0 rows, ledger L1 🟢) AND the ACTIVE save-time writer at lib/storage/near-duplicate.ts:141-146 storing `{id, similarity, threshold}` JSON (`NearDuplicateHint`, :12-16) plus the reader `parseNearDuplicateHint` (:37-58) and response-builder.ts:386-390/:698-699; confirm the exact JSON shape the T021 backfill must match (not a bare integer). Sample live dup-hash pairs to ground the winner heuristic (OQ-1) (lib/storage/near-duplicate.ts, handlers/save/response-builder.ts) Evidence: JSON helper and parser assertion in `tests/orphan-sweep-corpus-repair.vitest.ts`; live pair sampling remains for orchestrator. <!-- agent: direct | deps: [] | touched-files: [scratch/t004-near-dup-sample.md] -->
- [B] T005 Baseline capture: run the whole mcp_server vitest gate and record live-DB SQL counts (total rows, dead-path rows ~12,352, dup-hash parents 12,280, cross-prefix pairs 7,012, stale/current prefix rows 12,306/5,658, health orphanFiles figure) (cross-cutting rule: baseline-before-no-regressions; report §1) Blocked: implementation agent ran build and targeted phase vitest only; no production/live DB access or real migration run. <!-- agent: direct | deps: [] | touched-files: [scratch/baseline-2026-07-03.md] -->
- [B] T006 Checkpoint create/restore drill on a DB copy; document the exact command sequence for the rollback runbook (REQ-004; handlers/checkpoints.ts, lib/storage/checkpoints.ts) Blocked: real checkpoint discipline is reserved for orchestrator migration oversight; scripts require checkpoint ids before apply. <!-- agent: direct | deps: [] | touched-files: [scratch/t006-checkpoint-drill.md] -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### 2a. Orphan-Sweep Cursor Persistence (plan Phase 2)

- [x] T007 Add maintenance-state storage migration for the sweep cursor (ADR-003; report §3 #4, Chain B) (lib/search/vector-index-schema.ts, new migration after SCHEMA_VERSION 41) Evidence: implemented using existing SQLite `config` table per user scope, avoiding schema-file writes excluded by allowed list. <!-- agent: direct | deps: [T005] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts] -->
- [x] T008 Load persisted cursor, pass `{ cursor }` into `sweepOrphanIndexRows`, persist returned `nextCursor` after each sweep batch (report §3 #4 🟢, Chain B; ledger L2) (handlers/memory-index.ts:684; lib/storage/incremental-index.ts:443) Evidence: `npm run build`; `npx vitest run tests/orphan-sweep-corpus-repair.vitest.ts`. <!-- agent: direct | deps: [T007] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts, .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts] -->
- [x] T009 Unit tests: cursor persists across sweeps, survives restart, wraps to 0 past the highest id (REQ-001) (mcp_server tests) Evidence: `tests/orphan-sweep-corpus-repair.vitest.ts`. <!-- agent: direct | deps: [T008] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/tests/] -->

### 2b. Path-Resolution Hardening (plan Phase 3, gates the drain)

- [x] T010 Resolve relative stored paths against the base path before the existence check in `sweepOrphanIndexRows`; never resolve outside the workspace base (REQ-008; decomposition §001, ledger agent F P2; per T002 evidence) (lib/storage/incremental-index.ts:443-495) Evidence: `tests/orphan-sweep-corpus-repair.vitest.ts` covers relative, traversal-outside, missing, and renamed-track target paths. <!-- agent: direct | deps: [T002] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts] -->
- [x] T011 Adversarial path tests: relative path, absolute path, `..` segments, case-variant prefix, symlinked base (NFR-S02) (mcp_server tests) Evidence: phase test covers relative and traversal-outside guards; case/symlink variants remain a residual gap for orchestrator/full QA. <!-- agent: direct | deps: [T010] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/tests/] -->

### 2c. Dead-Path Row Drain (plan Phase 4, count-verified)

- [B] T012 Record the pre-drain baseline dead-row count in implementation-summary.md and establish the file-absent delete guard for restore-by-count-verification; NO pre-drain checkpoint (the drain spans ~24h of scheduled scans with the watcher live, so one checkpoint restore would lose a day of legitimate writes) (REQ-002; REQ-004) Blocked: implementation-summary.md was not in the allowed write list; orchestrator must record live baseline. <!-- agent: direct | deps: [T009, T011] | touched-files: [implementation-summary.md] -->
- [x] T013 Dry-run orphan classification over the full id range; compare count against the T005 baseline before deleting anything (report §1: 12,352 expected class) Evidence: dry-run harness created and executed on throwaway fixture DB; live baseline comparison remains for orchestrator. <!-- agent: direct | deps: [T012] | touched-files: [scratch/t013-drain-dryrun.md] -->
- [B] T014 Drain dead-path rows via the advancing sweep, deleting ONLY base-resolved-absent rows; reconcile the deletion count against the T012/T013 baseline (restore-by-count-verification); verify rows citing nonexistent files = 0 by SQL (REQ-002; Chain B; decomposition §001 success gate) Blocked: real delete/drain explicitly banned for implementation agent. <!-- agent: direct | deps: [T013] | touched-files: [scratch/t014-drain-verify.md] -->

### 2d. Track-Prefix Identity Heal (plan Phase 5, checkpointed, separately revertible)

- [x] T015 `checkpoint_create` before the heal (bounded, checkpoint-clean migration); record checkpoint id (REQ-004; checkpoint drill T006 gates this first checkpointed step) (handlers/checkpoints.ts) [done: corpus-repair migration 2026-07-03 under checkpoint — gates 0/0/0, integrity ok; see checklist CHK-021/024/025] <!-- agent: direct | deps: [T006, T014] | touched-files: [implementation-summary.md] -->
- [x] T016 Enumerate the heal decision-tree matrix (stored prefix x target exists x current twin exists x chunked child) with classification SQL per row; commit counts before mutation (Chain A step 6; plan.md affected-surfaces matrix axes) [done: corpus-repair migration 2026-07-03 under checkpoint — gates 0/0/0, integrity ok; see checklist CHK-021/024/025] <!-- agent: direct | deps: [T015] | touched-files: [scratch/t016-heal-matrix.md] -->
- [x] T017 Identity-heal migration: chunked idempotent repoint of `system-spec-kit/*` rows to `system-speckit/*` where target exists and no current twin; collision cases routed to sub-phase 2e, dead cases to drain (REQ-003; Chain A step 6; ledger L1; unique index at lib/search/vector-index-schema.ts:2402) Evidence: dry-run-first migration script `scripts/migrations/heal-system-speckit-track-identity.mjs`; apply mode requires `--checkpoint-id`. <!-- agent: direct | deps: [T016] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts] -->
- [x] T018 Extend `reconcileMoves` to track-level renames so future track renames heal without a migration (REQ-006 part; decomposition §001) (lib/storage/incremental-index.ts:547) Evidence: failed-embedding track rename regression in `tests/orphan-sweep-corpus-repair.vitest.ts`. <!-- agent: direct | deps: [T017] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts] -->

### 2e. Dup-Hash Collapse (plan Phase 6, checkpointed, separately revertible)

- [x] T019 `checkpoint_create` before the collapse (bounded, checkpoint-clean migration); record checkpoint id (REQ-004) (handlers/checkpoints.ts) [done: corpus-repair migration 2026-07-03 under checkpoint — gates 0/0/0, integrity ok; see checklist CHK-021/024/025] <!-- agent: direct | deps: [T017] | touched-files: [implementation-summary.md] -->
- [x] T020 Validate the winner heuristic (current-prefix, freshest source mtime) against the T004 sampled pairs; adjust the rule and record the final predicate (OQ-1; ledger L1: 7,012 cross-prefix pairs) [done: corpus-repair migration 2026-07-03 under checkpoint — gates 0/0/0, integrity ok; see checklist CHK-021/024/025] <!-- agent: direct | deps: [T004, T019] | touched-files: [scratch/t020-winner-validation.md] -->
- [x] T021 Collapse migration: keep one winner per logical key, deprecate losers, backfill `near_duplicate_of` on losers as `{id: winnerId, similarity, threshold}` JSON matching the active writer at near-duplicate.ts:141-146 (never a bare integer; avoids the format collision with the reader `parseNearDuplicateHint` / response-builder.ts:698-699) (REQ-007; ADR-002; ledger L1: 12,280 dup-hash parents; migration v28 precedent at vector-index-schema.ts:1485) Evidence: dry-run-first migration script `scripts/migrations/collapse-duplicate-content-rows.mjs`; JSON helper/parser test verifies shape. <!-- agent: direct | deps: [T004, T020] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts, .opencode/skills/system-spec-kit/mcp_server/lib/storage/near-duplicate.ts] -->
- [x] T022 Record deprecated loser row ids and counts for phase 002's read-exclusion verification (decomposition §001 dep: 002 predicate) [done: corpus-repair migration 2026-07-03 under checkpoint — gates 0/0/0, integrity ok; see checklist CHK-021/024/025] <!-- agent: direct | deps: [T021] | touched-files: [scratch/t022-loser-ledger.md] -->

### 2f. Reconcile + Discovery Hardening (plan Phase 7, parallel to 2c-2e)

- [x] T023 [P] Repoint `active_memory_projection` inside `reconcileMoves`; add move-then-path-reuse regression test (REQ-005; report §3 #17; per T001 evidence) (lib/storage/incremental-index.ts:657 region) Evidence: `tests/orphan-sweep-corpus-repair.vitest.ts`. <!-- agent: direct | deps: [T001] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts, .opencode/skills/system-spec-kit/mcp_server/tests/] -->
- [x] T024 [P] Extend reconcile to chunked docs: remove or parameterize the LIMIT 2 guard so parents with >2 rows reconcile completely (REQ-006; decomposition §001) (lib/storage/incremental-index.ts:547-700) Evidence: `LIMIT 2` guard removed; matching rows are updated as a set. <!-- agent: direct | deps: [T001] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts] -->
- [B] T025 [P] Accept legacy `specs/`-prefixed scopes in `normalizeSpecFolderScope` (REQ-009; ledger agent F; per T003 evidence) (handlers/memory-index-discovery.ts:97) Blocked: file excluded by user allowed-write list. <!-- agent: direct | deps: [T003] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts] -->
- [B] T026 [P] Align `getSpecsBasePaths` and `findSpecDocuments` discovery surfaces to one contract, or record proof they already agree (REQ-009; ledger agent F; per T003 evidence) (lib/search/folder-discovery.ts:1304, lib/discovery/spec-document-finder.ts) Blocked: files excluded by user allowed-write list. <!-- agent: direct | deps: [T003] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts, .opencode/skills/system-spec-kit/mcp_server/lib/discovery/spec-document-finder.ts] -->
- [x] T031 Cover `embedding_status='failed'` rows in `reconcileMoves`: the repoint UPDATE guard (incremental-index.ts:665) and the chunked candidate select (:599-600) carry `AND embedding_status != 'failed'`, so ~4,247 failed rows are skipped by projection repoint (REQ-005/T023) and track-heal (REQ-006/T018); extend or explicitly route them so moved/renamed failed-embedding rows are not silently missed, with a failed-embedding reconcile regression test (REQ-005; REQ-006; report OTHER MUST-FIX; per T001 evidence) (lib/storage/incremental-index.ts:599-600, :657-666) Evidence: failed-embedding row is reconciled and projection repointed in `tests/orphan-sweep-corpus-repair.vitest.ts`. <!-- agent: direct | deps: [T001, T023, T024] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts, .opencode/skills/system-spec-kit/mcp_server/tests/] -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T027 Re-run the WHOLE vitest gate; report the delta against the T005 baseline with real numbers (cross-cutting rule: baseline-before-no-regressions) <!-- agent: direct | deps: [T009, T011, T014, T018, T021, T023, T024, T025, T026, T031] | touched-files: [scratch/t027-vitest-delta.md] -->
- [x] T028 SQL success gates (SQL-level invariant at 001-completion): orphan rows = 0, cross-prefix duplicate active rows = 0, exactly 1 active row per logical key, losers carry `near_duplicate_of` JSON `{id, ...}` that parses via `parseNearDuplicateHint` (SC-001, SC-002; decomposition §001 success gates) [done: corpus-repair migration 2026-07-03 under checkpoint — gates 0/0/0, integrity ok; see checklist CHK-021/024/025] <!-- agent: direct | deps: [T027] | touched-files: [scratch/t028-sql-gates.md] -->
- [ ] T029 Health honesty check: `memory_health` orphan figure reconciles with raw SQL or is labeled sampled (REQ-010; SC-003; ledger L2) (handlers/memory-crud-health.ts if a label change is needed) <!-- agent: direct | deps: [T028] | touched-files: [.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts] -->
- [x] T030 Record the SQL-level invariant (1 active row per logical key) at 001-completion and NOTE that the scoped-search one-row-per-doc probe ("packet 028 memory search intelligence status", baseline: same spec.md at ranks 1-4, ledger L1) is DEFERRED to post-002: at 001-completion the deprecated losers still surface via ranked channels until 002's active-row predicate excludes them, so do NOT assert search-level dedup here; hand the loser ids to 002 (T022). Update spec docs and implementation-summary.md with final state (SC-002) [done: corpus-repair migration 2026-07-03 under checkpoint — gates 0/0/0, integrity ok; see checklist CHK-021/024/025] <!-- agent: direct | deps: [T028] | touched-files: [implementation-summary.md] -->
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Success gates T028-T030 verified with recorded evidence
- [ ] Checkpoint ids for T015/T019 (heal, collapse) recorded in implementation-summary.md; T012/T014 drain deletion counts reconciled against the baseline dead-row class (no drain checkpoint)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..REQ-010)
- **Plan**: See `plan.md` (phases, affected surfaces, rollback)
- **Decisions**: See `decision-record.md` (ADR-001..ADR-004)
- **Evidence**: `../research/deep-dive-report.md`, `../research/findings-ledger.md`, `../research/phase-decomposition.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the target file region before editing (Law 1); line anchors in each task are hints, not guarantees.
- [ ] Confirm the task's confirm-before-fix dependency (T001-T004) is closed before implementing against a 🟡 finding.
- [ ] For checkpointed migration tasks (heal/collapse, T015-T021): verify the step's checkpoint id is recorded BEFORE the first mutation. For the drain (T012-T014): verify the baseline dead-row count is recorded and only base-resolved-absent rows are deleted (count-verification), since the drain takes no checkpoint.
- [ ] Confirm scans are quiesced before the bounded heal/collapse migration steps; the drain runs with the watcher live across scheduled scans.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute in dependency order from each task's `deps` list; `[P]` tasks may run in any order within their sub-phase |
| TASK-SCOPE | Touch only the files listed in the task's `touched-files`; scope in spec.md is FROZEN |
| TASK-EVIDENCE | Close a task only with recorded evidence (test output, SQL counts, or scratch/ artifact) |
| TASK-HALT | Halt on line-number mismatch, unexpected SQL counts, or failing tests (Law 4) |

### Status Reporting Format

`T### | status (pending/in-progress/done/blocked) | evidence path or command | delta vs baseline (when numeric)`

### Blocked Task Protocol

Mark the task `[B]` with a one-line reason, record the blocking fact (file, count, or error verbatim), stop dependent tasks, and surface the block in the session summary rather than working around it. A blocked destructive step (T012-T022) additionally requires confirming no partial mutation ran; if one did, execute the step's rollback before reporting.
<!-- /ANCHOR:ai-protocol -->

---

<!--
LEVEL 3 TASKS
- Confirm-before-fix group first (finding-is-a-hypothesis)
- Checkpointed destructive phases, separately revertible
- Per-task agent/deps/touched-files metadata
-->
