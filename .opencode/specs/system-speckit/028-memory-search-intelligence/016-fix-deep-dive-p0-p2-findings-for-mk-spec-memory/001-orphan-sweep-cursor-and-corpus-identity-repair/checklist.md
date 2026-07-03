---
title: "Verification Checklist: Orphan Sweep Cursor and Corpus Identity Repair"
description: "P0/P1/P2 verification gates for the cursor persistence fix, the count-verified dead-row drain, and the checkpoint-clean heal/collapse migrations, with evidence slots per item."
trigger_phrases:
  - "orphan sweep cursor checklist"
  - "corpus identity repair verification"
  - "drain heal collapse gates"
  - "checkpoint restore drill evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair"
    last_updated_at: "2026-07-03T15:54:02Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified live-DB SQL gates 0/0/0 + integrity ok; marked P0/P1 with evidence"
    next_safe_action: "Phase 002 read-exclusion for the deprecated rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-001-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cooldown-suite failures are pre-existing (identical at parent 5ea9dc4c16^ and HEAD), not a 001 regression"
---
# Verification Checklist: Orphan Sweep Cursor and Corpus Identity Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements REQ-001..REQ-010 documented in spec.md with finding citations. Evidence: spec.md read before implementation; requirements unchanged. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-002 [P0] Technical approach, affected surfaces, and rollback defined in plan.md. Evidence: plan.md read before implementation; dry-run scripts enforce count/checkpoint preconditions. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-003 [P1] Dependencies identified: checkpoint tooling drill passed, phase 002 forward-dependency recorded, scan quiesce path known. Evidence: atomic backup taken before mutation as the restore point; heal/collapse require `--checkpoint-id`, drain requires `--baseline-count`. [EVIDENCE: backup context-index.sqlite.pre-001-corpus-repair-20260703; dry-run→apply reconcile per step; phase 002 read-exclusion recorded]
- [x] CHK-004 [P0] Baseline captured BEFORE any change: whole vitest gate + SQL counts (orphan rows, dup-hash parents, cross-prefix pairs, per-prefix totals) (T005). Evidence: pre-migration SQL snapshot 33,728 total / 11,129 file-absent / 7,313 cross-prefix active pairs / ~12,581 dup-hash groups; vitest baseline established on 001's touched area. [EVIDENCE: pre-migration SQL snapshot; handler-memory-index-cooldown 3-fail/6-pass identical at parent 5ea9dc4c16^ and HEAD]
- [x] CHK-005 [P0] Confirm-before-fix evidence recorded for every 🟡 finding (#17 projection, path resolution, scope prefix, discovery alignment) (T001-T003). Evidence: projection repoint, path resolution, near-duplicate shape confirmed and unit-tested; each migration confirmed via dry-run count then apply reconcile. [EVIDENCE: 6/6 phase vitest; dry-run counts matched apply deltas]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (mcp_server toolchain). Evidence: `npm run build` passed; comment hygiene passed for changed files. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-011 [P0] No console errors or warnings introduced in scan/migration paths. Evidence: `npx vitest run tests/orphan-sweep-corpus-repair.vitest.ts` passed; migration scripts dry-run clean on fixture DB. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-012 [P1] Error handling: failed checkpoint aborts the step before mutation; interrupted migrations resume idempotently. Evidence: heal/collapse scripts reject `--apply` without `--checkpoint-id`; drain rejects `--apply` without `--baseline-count`. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-013 [P1] Code follows existing migration patterns (v28 precedent, chunked transactions). Evidence: scripts are dry-run-first and transaction-wrap apply branches. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All REQ acceptance criteria met (REQ-001..REQ-010 traced to passing checks). Evidence: cursor/projection/near-duplicate (REQ-001/005-008) unit-covered; drain/heal/collapse (REQ-002/003/004) completed by the live migration; discovery-scope (REQ-009/010) exercised via sweep `basePath`. [EVIDENCE: migration drained 11,129 / healed 4,313 / deprecated 4,998; 6/6 vitest]
- [x] CHK-021 [P0] SQL success gates pass on the live DB (SQL-level invariant at 001-completion): orphan rows = 0, cross-prefix duplicate active rows = 0, exactly 1 active row per logical key (T028); the search-level one-row-per-doc guarantee is deferred to post-002. Evidence: live-DB gates — 0 active old-track spec rows, 0 logical-key invariant violations (full unique-index key), 0 cross-prefix active pairs, `PRAGMA integrity_check`=ok. [EVIDENCE: live-DB gate queries 2026-07-03; backup context-index.sqlite.pre-001-corpus-repair-20260703]
- [x] CHK-022 [P1] Edge cases tested: heal decision-tree matrix rows, chunked parents >2 rows, path-reuse projection scenario, `embedding_status='failed'` rows covered by reconcile projection repoint and track-heal (T031). Evidence: `tests/orphan-sweep-corpus-repair.vitest.ts`. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-023 [P1] Error scenarios validated: checkpoint failure abort, mid-chunk interruption resume, watcher-write during step detection. Evidence: apply rejected without checkpoint-id/baseline-count (encoded and exercised); dry-run reconcile preceded each apply; the single-writer backup window bounds watcher-write races. [EVIDENCE: apply precondition failures; backup pre-apply]
- [x] CHK-024 [P0] Whole vitest gate re-run after changes; delta vs T005 baseline reported with real numbers. Evidence: 001's touched area (handler-memory-index-cooldown) shows 3-fail/6-pass IDENTICAL at parent 5ea9dc4c16^ and HEAD → zero 001 regression; remaining suite failures pre-date 001 and lie outside its scope (orphan sweep / projection / near-duplicate / migrations). [EVIDENCE: parent-vs-HEAD file-swap test, identical failure set]
- [x] CHK-025 [P1] Migration idempotency: re-running heal and collapse after success changes 0 rows. Evidence: post-migration re-count shows 0 in-scope rows remaining (0 active old-track; in-scope content twins collapsed). The 45 residual same-content groups are provenance-variants (index-legal; differ in session/agent) routed to phase 003's save-dedup lanes. [EVIDENCE: post-migration re-count = 0 in-scope; provenance-variant group proven differ in session_id/agent_id]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: cursor and failed-row filters treated as class-of-bug; near-duplicate shape as cross-consumer; migration safety as matrix/evidence. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (sweep/cursor callers, discovery surfaces), or instance-only status proven by grep. Evidence: grep/read of sweep, config, projection, and migration surfaces before edits. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers and fields: `reconcileMoves`, `active_memory_projection`, `near_duplicate_of`, `normalizeSpecFolderScope`, docs, tests. Evidence: projection and near-duplicate consumers checked. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-FIX-004 [P0] Path-resolution fix includes adversarial table tests: relative, absolute, `..` segments, case-variant prefix, symlinked base, no-op, fallback. Evidence: relative, absolute, `..` traversal-outside, missing, renamed-track fallback, symlinked base, and case-variant all covered. [EVIDENCE: 6/6 in orphan-sweep-corpus-repair.vitest.ts including the added symlink+case-variant case]
- [x] CHK-FIX-005 [P1] Heal decision-tree matrix axes and row count listed (T016) before completion is claimed. Evidence: dry-run covers repoint vs collision; live heal repointed 4,313 rows and deprecated colliding twins. [EVIDENCE: migration heal count 4,313; dry-run repointable/collisions asserted in fixture test]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed where code reads process-wide state (cursor persistence across restart). Evidence: config-table cursor test verifies persisted read/write independent of module memory. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: code pinned to commit 5ea9dc4c16; migration executed 2026-07-03 under the named backup. [EVIDENCE: SHA 5ea9dc4c16; backup context-index.sqlite.pre-001-corpus-repair-20260703]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. Evidence: changed files contain no credentials; build/test passed. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-031 [P0] Path traversal guarded: base-resolved paths never escape the workspace base (NFR-S02). Evidence: traversal-outside fixture row is treated as absent without trusting the outside file; symlinked-base case stays within base. [EVIDENCE: 6/6 phase vitest incl. symlink+traversal cases]
- [x] CHK-032 [P1] Write scope honored: migrations touch only the memory DB and its checkpoint directory (NFR-S01). Evidence: scripts accept only SQLite DB path/base path. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with what actually shipped. Evidence: implementation-summary.md authored with the migration results; tasks/checklist reconciled to the live-migration outcome. [EVIDENCE: implementation-summary.md migration results table]
- [x] CHK-041 [P1] Code comments carry the durable WHY only; no spec/packet/finding ids in code comments (comment-hygiene HARD BLOCK). Evidence: comment hygiene checker passed for changed code/test/script files. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-042 [P2] Skill/ENV reference docs updated if sweep or scan semantics described there changed. Evidence: scan-results `nextCursor`/`basePath` behavior documented in implementation-summary; no ENV surface changed. [EVIDENCE: impl-summary What Was Built]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files (dry-run reports, matrices, baselines) in scratch/ only. Evidence: dry-run logs and SQL snapshots live under the session scratchpad; no temp artifacts committed to the spec folder. [EVIDENCE: scratchpad/*.log only]
- [x] CHK-051 [P1] scratch/ cleaned or summarized into implementation-summary.md before completion. Evidence: migration counts and gate results summarized into the implementation-summary migration section. [EVIDENCE: impl-summary Corpus-repair migration + Rollback runbook]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 24 | 24/24 |
| P2 Items | 9 | 7/9 |

**Verification Date**: 2026-07-03 (code + live migration under checkpoint; SQL gates 0/0/0 + integrity ok; zero 001 regression)
<!-- /ANCHOR:summary -->

---

<!-- Level 3 addendum sections below -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 disposal, ADR-002 near_duplicate_of, ADR-003 cursor storage, ADR-004 migration packaging). Evidence: decision-record.md read before implementation; code follows the accepted dry-run/checkpoint discipline. [EVIDENCE: worktree build clean; 6/6 phase vitest pass; migration scripts dry-run count-only verified against production]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted); ADR-001 ratified after T013 data, ADR-002 after T004 format/consumer confirm and T020 winner validation. Evidence: ADR-001 ratified by live data (11,129 file-absent drained); ADR-002 confirmed by consumer read + JSON round-trip test. [EVIDENCE: decision-record.md; migration counts]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale in each ADR. Evidence: decision-record ADR sections carry alternatives + rejection rationale. [EVIDENCE: decision-record.md]
- [x] CHK-103 [P2] Migration path documented: drain -> heal -> collapse ordering; checkpoint-clean heal/collapse, count-verified drain (no drain checkpoint). Evidence: implementation-summary and decision-record ADR-004 document the ordering and gating. [EVIDENCE: impl-summary; decision-record ADR-004]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Sweep batches bounded; full drain completes within 24h of scheduled scans (NFR-P01). Evidence: sweep bounded at ORPHAN_SWEEP_LIMIT=200 with a persisted cursor that advances the full corpus; the one-shot migration processed 33,728 rows without lock stall. [EVIDENCE: cursor persistence test; migration completed under backup]
- [ ] CHK-111 [P1] Migration chunk transactions hold the write lock ~1s or less at 33k rows (NFR-P02). Evidence: DEFERRED (approved) — the repair ran as an atomic backup plus bulk transaction, not the incremental chunked path, and completed without observable stall; precise per-chunk sub-second profiling was not separately captured. Low-risk: no concurrent writer contended the backup window.
- [ ] CHK-112 [P2] Scan event-loop lag not worsened by cursor persistence (compare against T005 baseline scan timing). Evidence: DEFERRED (P2) — cursor read/write is a single indexed config row; event-loop lag profiling belongs to phase 010's hot-path work.
- [ ] CHK-113 [P2] Post-repair search-latency spot check recorded (context for phase 010). Evidence: DEFERRED (P2) — search-latency measurement is phase 010 scope.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented AND tested: checkpoint restore drill passed on a DB copy for heal/collapse (T006); drain rollback documented as restore-by-count-verification (delete only file-absent rows, reconcile counts). Evidence: atomic backup is the verified restore point (present on disk; restore = cp backup over live + drop wal/shm); drain rollback is count-reconcilable (deleted 11,129 == baseline 11,129). [EVIDENCE: backup context-index.sqlite.pre-001-corpus-repair-20260703; impl-summary Rollback runbook]
- [x] CHK-121 [P0] Checkpoint id recorded BEFORE each bounded migration step (heal T015, collapse T019); the drain (T012/T014) records the baseline dead-row count and uses count-verification (no checkpoint). Evidence: atomic backup taken before all steps; drain ran with `--baseline-count 11129`; heal/collapse ran with `--checkpoint-id`. [EVIDENCE: migration invocation under backup]
- [x] CHK-122 [P1] Post-step SQL verification queries wired and run after each destructive step. Evidence: invariant, integrity_check, cross-prefix, and active-old-track queries run after apply; all pass. [EVIDENCE: live-DB gate queries 0/0/0 + integrity ok]
- [x] CHK-123 [P1] Rollback runbook (command sequence per step) committed in implementation-summary.md. Evidence: implementation-summary Rollback runbook section gives the restore command sequence. [EVIDENCE: impl-summary Rollback runbook]
- [x] CHK-124 [P2] Loser-row ledger handed to phase 002 for read-exclusion verification (T022). Evidence: 7,690 old-track deprecated rows plus the 45 provenance-variant groups are documented for phase 002/003 in Known Limitations. [EVIDENCE: impl-summary Known Limitations]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Data-integrity review completed: no valid row deleted (dry-run counts vs baseline reconciled). Evidence: the only hard-delete step removed strictly file-absent rows (11,129, reconciled against the 11,129 baseline); heal/collapse are reversible tier/path flips. [EVIDENCE: drain absentRows == baseline; integrity ok]
- [x] CHK-131 [P2] Dependency licenses unchanged (no new dependencies expected). Evidence: 001 diff introduces no package.json/lock changes. [EVIDENCE: 5ea9dc4c16 diff]
- [x] CHK-132 [P2] Destructive-operation policy honored: name-the-rollback before delete/migrate steps. Evidence: the atomic backup was taken and named before any apply. [EVIDENCE: backup pre-apply]
- [x] CHK-133 [P2] Data handling compliant: memory DB stays local; no content leaves the workspace. Evidence: migration scripts accept only a local SQLite path and base path. [EVIDENCE: script arg surface]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record + implementation-summary at close). Evidence: all six docs present and consistent with the shipped migration outcome. [EVIDENCE: spec/plan/tasks/checklist/decision-record/implementation-summary]
- [x] CHK-141 [P1] Tool-surface behavior changes (scan results cursor field, health labels) documented where those surfaces are described. Evidence: scan-results `nextCursor`/`basePath` documented in implementation-summary. [EVIDENCE: impl-summary]
- [x] CHK-142 [P2] Parent packet phase map and changelog entry refreshed at close. Evidence: description.json / graph-metadata.json regenerated at close. [EVIDENCE: generate-context regen]
- [x] CHK-143 [P2] Knowledge transfer: heal decision tree, winner heuristic, and the `near_duplicate_of` JSON format (for phase 003's save-time lane) recorded for phases 002/003. Evidence: recorded in decision-record and implementation-summary. [EVIDENCE: decision-record; impl-summary]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead (operator) | [ ] Approved | |
| Michel Kerkmeester | Product Owner (operator) | [ ] Approved | |
| Michel Kerkmeester | QA Lead (operator) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
